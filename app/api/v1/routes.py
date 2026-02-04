"""API v1 routes"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["v1"])


@router.get("/")
async def api_root():
    """API root endpoint"""
    return {
        "message": "LogicPuse API v1",
        "endpoints": {
            "health": "/api/v1/health",
            "info": "/api/v1/info",
            "contact": "/api/contact"
        }
    }


@router.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}


@router.get("/info")
async def info():
    """API information"""
    return {
        "company": "LogicPuse Software Pvt. Ltd.",
        "api_version": "1.0.0",
        "description": "Company Website API"
    }

