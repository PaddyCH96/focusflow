from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import logging
import uuid
from contextlib import asynccontextmanager
from .router import router
from .database import init_db

# Configure structured logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format='{"time":"%(asctime)s","level":"%(levelname)s","message":"%(message)s"}' if os.getenv("ENVIRONMENT") == "production" else "%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FocusFlow backend...")
    init_db()
    logger.info("Database initialized successfully")
    yield
    logger.info("Shutting down FocusFlow backend...")

app = FastAPI(
    title="FocusFlow Backend",
    description="Vedic Pomodoro Workstation API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3001,http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request ID middleware for tracking
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if os.getenv("ENVIRONMENT") != "production" else "An error occurred",
            "request_id": getattr(request.state, "request_id", None)
        }
    )

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"← {request.method} {request.url.path} {response.status_code}")
    return response

app.include_router(router)

# Ensure the assets/audio and voice_notes directory exists before mounting to prevent startup crashes
os.makedirs("assets/audio", exist_ok=True)
os.makedirs("assets/voice_notes", exist_ok=True)
app.mount("/audio", StaticFiles(directory="assets/audio"), name="audio")
app.mount("/voice-notes-files", StaticFiles(directory="assets/voice_notes"), name="voice_notes")
