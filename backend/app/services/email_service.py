import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Tuple

def send_password_reset_email(to_email: str, reset_token: str, reset_link: str) -> Tuple[bool, str]:
    """
    Sends a password reset email to the target email address using SMTP if configured.
    Returns (success: bool, info_message: str).
    """
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "noreply@pragma.gov")

    subject = "PRAGMA Security - Password Reset Request"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PRAGMA Password Reset</title>
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #081120; color: #E2E8F0; margin: 0; padding: 20px; }}
        .card {{ max-width: 550px; margin: 0 auto; background: #0D1527; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .title {{ color: #3B82F6; font-size: 22px; font-weight: bold; margin: 0; }}
        .subtitle {{ color: #94A3B8; font-size: 13px; margin-top: 4px; uppercase; tracking-wider; }}
        .content {{ font-size: 14px; line-height: 1.6; color: #CBD5E1; margin-bottom: 24px; }}
        .btn-container {{ text-align: center; margin: 30px 0; }}
        .btn {{ background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px rgba(37,99,235,0.4); }}
        .token-box {{ background: #1E293B; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #60A5FA; word-break: break-all; margin: 16px 0; border: 1px solid #334155; }}
        .footer {{ text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 16px; margin-top: 24px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 class="title">PRAGMA Governance Platform</h1>
          <div class="subtitle">Password Reset Security Dispatch</div>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a password reset request for your account: <strong>{to_email}</strong>.</p>
          <p>Click the button below to reset your password. This security link expires in 1 hour.</p>
        </div>
        <div class="btn-container">
          <a href="{reset_link}" class="btn" target="_blank">Reset Password Now</a>
        </div>
        <div class="content">
          <p>If the button above does not work, copy and paste this link into your browser:</p>
          <div class="token-box">{reset_link}</div>
          <p style="font-size:12px; color:#94A3B8;">If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          Multiagent Predictive Risk Analysis & Governance Management Assistant &copy; 2026
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
    PRAGMA Password Reset Request
    
    We received a password reset request for your account: {to_email}.
    
    Please click the link below to reset your password (valid for 1 hour):
    {reset_link}

    Reset Token: {reset_token}
    
    If you did not request this, please ignore this message.
    """

    if smtp_user and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = smtp_from
            msg["To"] = to_email

            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_content, "html")
            msg.attach(part1)
            msg.attach(part2)

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(smtp_from, [to_email], msg.as_string())
            
            return True, f"Email sent successfully to {to_email} via SMTP."
        except Exception as e:
            print(f"[Email Service SMTP Exception]: {e}")
            return False, f"SMTP delivery note: {e}. Fallback reset link available."
    else:
        print(f"[Email Service Console Dispatch]: Password reset link for {to_email} -> {reset_link}")
        return True, f"Password reset link generated for {to_email}."
