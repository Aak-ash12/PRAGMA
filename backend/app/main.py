import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from app.database.connection import Base, engine
from app.api.simulation import router as simulation_router
from app.api.prediction import router as prediction_router
from app.api.auth import router as auth_router
from app.api.policies import router as policies_router


# Create database tables automatically on startup and perform column check
try:
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        if "users" in inspector.get_table_names():
            columns = [c['name'] for c in inspector.get_columns('users')]
            if 'reset_token' not in columns:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)"))
                    conn.commit()
                except Exception as col_err:
                    print(f"Column reset_token note: {col_err}")
            if 'reset_token_expires' not in columns:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME"))
                    conn.commit()
                except Exception as col_err:
                    print(f"Column reset_token_expires note: {col_err}")
except Exception as e:
    print(f"Database initialization note: {e}")

app = FastAPI(title="Multiagent Predictive Risk Analysis and Governance Management Assistant for Smart Cities Using Digital Twin")

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth Short"])
app.include_router(simulation_router, prefix="/api/v1/simulation", tags=["Simulation"])
app.include_router(simulation_router, prefix="/api/simulation", tags=["Simulation Short"])
app.include_router(prediction_router, prefix="/api/v1/prediction", tags=["Prediction"])
app.include_router(prediction_router, prefix="/api/prediction", tags=["Prediction Short"])
app.include_router(policies_router, prefix="/api/v1/policies", tags=["Policies"])
app.include_router(policies_router, prefix="/api/policies", tags=["Policies Short"])

@app.get("/api/{full_path:path}")
def handle_api_get(full_path: str, request: Request):
    if "stats" in full_path:
        return {
            "active_alerts": 12,
            "governance_score": 95.0,
            "resources_deployed": 1420,
            "ai_confidence": 98.5
        }
    return []

@app.post("/api/{full_path:path}")
def handle_api_post(full_path: str, request: Request):
    return {"token": "dummy_token"}

def get_static_path():
    frontend_dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
    if os.path.exists(os.path.join(frontend_dist_path, "index.html")):
        return frontend_dist_path
    backend_static = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
    if os.path.exists(os.path.join(backend_static, "index.html")):
        return backend_static
    return frontend_dist_path

@app.get("/assets/{file_path:path}")
def serve_assets(file_path: str):
    current_static = get_static_path()
    asset_file = os.path.join(current_static, "assets", file_path)
    if os.path.exists(asset_file):
        response = FileResponse(asset_file)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response
    fallback = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "assets", file_path)
    if os.path.exists(fallback):
        return FileResponse(fallback)
    return JSONResponse(status_code=404, content={"error": "Asset not found"})

@app.get("/{full_path:path}")
def serve_frontend(full_path: str = ""):
    current_static = get_static_path()
    if full_path and "." in os.path.basename(full_path):
        direct_file = os.path.join(current_static, full_path)
        if os.path.exists(direct_file) and os.path.isfile(direct_file):
            return FileResponse(direct_file)
        fallback_asset = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", full_path)
        if os.path.exists(fallback_asset) and os.path.isfile(fallback_asset):
            return FileResponse(fallback_asset)

    index_file = os.path.join(current_static, "index.html")
    if os.path.exists(index_file):
        response = FileResponse(index_file)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response
    backend_index = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "index.html")
    if os.path.exists(backend_index):
        return FileResponse(backend_index)
    return JSONResponse(status_code=404, content={"error": "Frontend index.html not found"})

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
