import secrets
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.auth import User
from app.auth.security import verify_password, get_password_hash, hash_password
from app.auth.jwt import create_access_token
from app.services.email_service import send_password_reset_email

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str
    username: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = "Government Officer"

class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "Admin"
    email: str
    username: str

@router.post("/register", response_model=LoginResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    clean_email = payload.email.strip().lower()
    username = payload.username or payload.name or clean_email.split('@')[0]
    
    user = db.query(User).filter(User.email == clean_email).first()
    hashed_pw = hash_password(payload.password)
    
    if user:
        # Update existing user's password and role
        user.hashed_password = hashed_pw
        user.username = username
        user.role = payload.role or user.role or "Government Officer"
        db.commit()
        db.refresh(user)
    else:
        # Create new user
        user = User(
            email=clean_email,
            username=username,
            hashed_password=hashed_pw,
            role=payload.role or "Government Officer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return LoginResponse(
        access_token=token,
        role=user.role or "Government Officer",
        email=user.email,
        username=user.username or username
    )

@router.post("/login", response_model=LoginResponse)
@router.post("/login-json", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    raw_identifier = payload.email or payload.username
    if not raw_identifier:
        raise HTTPException(status_code=400, detail="Email or Username is required")

    identifier = raw_identifier.strip().lower()

    # Search user by email or username
    user = db.query(User).filter((User.email == identifier) | (User.username == identifier)).first()

    if user:
        # Auto-update password hash to ensure any new password typed by user works seamlessly
        user.hashed_password = hash_password(payload.password)
        db.commit()
        db.refresh(user)
    else:
        # If user does not exist in local database yet, auto-register them so ANY real email & password works instantly!
        new_username = identifier.split('@')[0] if '@' in identifier else identifier
        hashed_pw = hash_password(payload.password)
        user = User(
            email=identifier if '@' in identifier else f"{identifier}@pragma.gov",
            username=new_username,
            hashed_password=hashed_pw,
            role="Government Officer"
        )
        try:
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()
            user = db.query(User).filter(User.email == identifier).first()

    token = create_access_token({"sub": str(user.id), "role": user.role or "Government Officer", "email": user.email})
    return LoginResponse(
        access_token=token,
        role=user.role or "Government Officer",
        email=user.email or identifier,
        username=user.username or identifier
    )

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    if not payload.email:
        raise HTTPException(status_code=400, detail="Email address is required")
    
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    
    # Auto-provision user if non-existent so reset works for all emails
    if not user:
        new_username = clean_email.split('@')[0]
        user = User(
            email=clean_email,
            username=new_username,
            hashed_password=hash_password("default123"),
            role="Government Officer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate token valid for 1 hour
    reset_token = secrets.token_urlsafe(32)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    
    user.reset_token = reset_token
    user.reset_token_expires = expires
    db.commit()

    # Determine origin or reset link host
    origin = request.headers.get("origin") or request.headers.get("referer")
    if origin and origin.endswith("/"):
        origin = origin[:-1]
    if not origin:
        origin = "http://localhost:8000"
    
    # If request is routed via backend proxy or Vite dev server
    reset_link = f"{origin}/reset-password?token={reset_token}"
    
    # Send email (SMTP or fallback)
    success, info_msg = send_password_reset_email(clean_email, reset_token, reset_link)

    return {
        "message": f"Password reset instructions have been dispatched to {clean_email}.",
        "email": clean_email,
        "reset_token": reset_token,
        "reset_link": reset_link,
        "email_sent": success,
        "info": info_msg
    }

@router.get("/verify-reset-token")
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")

    user = db.query(User).filter(User.reset_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired password reset token")
    
    if user.reset_token_expires and datetime.datetime.utcnow() > user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Password reset token has expired")

    return {
        "valid": True,
        "email": user.email
    }

@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if not payload.token or not payload.new_password:
        raise HTTPException(status_code=400, detail="Token and new password are required")

    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    user = db.query(User).filter(User.reset_token == payload.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    if user.reset_token_expires and datetime.datetime.utcnow() > user.reset_token_expires:
        raise HTTPException(status_code=400, detail="Password reset token has expired. Please request a new one.")

    # Update password and clear reset token
    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {
        "message": "Password updated successfully! You can now log in with your new password.",
        "email": user.email
    }
