import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from app.api.v1.routes import router as v1_router

app = FastAPI(title="LogicPuse API (FastAPI)")

# Include API routes first so they take precedence over the SPA fallback
app.include_router(v1_router)

# Serve frontend static files (built into `frontend/dist` by the Dockerfile)
FRONTEND_DIR = Path("frontend/dist")
INDEX_FILE = FRONTEND_DIR / "index.html"

if FRONTEND_DIR.is_dir():
    # Static assets served from /static/*
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
async def root():
    # Serve the SPA index if available, otherwise show a simple API root
    if INDEX_FILE.exists():
        return FileResponse(INDEX_FILE)
    return {"message": "Welcome to LogicPuse API (FastAPI)", "version": "1.0.0"}


@app.get("/{full_path:path}")
async def spa_fallback(full_path: str, request: Request):
    # Do not intercept API routes
    if full_path.startswith("api"):
        return JSONResponse({"detail": "Not Found"}, status_code=404)

    # Serve index.html for SPA routes
    if INDEX_FILE.exists():
        return FileResponse(INDEX_FILE)

    return JSONResponse({"message": "Not Found"}, status_code=404)
