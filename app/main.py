import os
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.api.v1.routes import router as v1_router

app = FastAPI(title="GNS Software")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    organization: Optional[str] = ""
    phone: Optional[str] = ""
    inquiryType: Optional[str] = ""
    message: str


@app.post("/api/contact")
async def contact(form_data: ContactForm):
    """Handle contact form submissions"""
    try:
        # Get SMTP configuration from environment variables
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER", "")
        smtp_password = os.getenv("SMTP_PASSWORD", "")
        contact_email = os.getenv("CONTACT_EMAIL", "info@gnssoftware.in")
        
        # Validate SMTP configuration
        if not smtp_user or not smtp_password:
            return {
                "success": False,
                "message": "Email service not configured. Please contact us directly at info@gnssoftware.in"
            }
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = contact_email
        msg['Subject'] = f"Contact Form Submission: {form_data.inquiryType or 'General Inquiry'}"
        
        # Build email body
        body = f"""
New Contact Form Submission

Name: {form_data.name}
Email: {form_data.email}
Organization: {form_data.organization or 'Not provided'}
Phone: {form_data.phone or 'Not provided'}
Inquiry Type: {form_data.inquiryType or 'General'}
Message:
{form_data.message}
"""
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        try:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
            server.quit()
            
            return {
                "success": True,
                "message": "Thank you for your message! We'll get back to you soon."
            }
        except Exception as e:
            print(f"SMTP Error: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send email. Please contact us directly at info@gnssoftware.in"
            }
            
    except Exception as e:
        print(f"Contact form error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred processing your request. Please try again later."
        )


# Include API routes first so they take precedence over the SPA fallback
app.include_router(v1_router)

# Serve frontend static files (built into `frontend/dist` by the Dockerfile)
FRONTEND_DIR = Path("frontend/dist")
INDEX_FILE = FRONTEND_DIR / "index.html"

if FRONTEND_DIR.is_dir():
    # Serve the SPA (index + assets) from the repo root so absolute asset paths like
    # /assets/... resolve correctly. API routes are included above and will take
    # precedence over these static routes.
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")


# Optional: keep an explicit API root handler if the SPA is not present
@app.get("/")
async def root():
    # Serve the SPA index if available, otherwise show a simple API root
    if INDEX_FILE.exists():
        return FileResponse(INDEX_FILE)
    return {"message": "Welcome to LogicPuse API (FastAPI)", "version": "1.0.0"}


# SPA fallback is no longer needed if StaticFiles(html=True) is mounted at '/',
# but keep a defensive fallback for non-API routes.
@app.get("/{full_path:path}")
async def spa_fallback(full_path: str, request: Request):
    # Do not intercept API routes
    if full_path.startswith("api"):
        return JSONResponse({"detail": "Not Found"}, status_code=404)

    # If SPA index exists, serve it for client-side routing
    if INDEX_FILE.exists():
        return FileResponse(INDEX_FILE)

    return JSONResponse({"message": "Not Found"}, status_code=404)
