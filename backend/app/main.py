from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from contextlib import asynccontextmanager
from .router import router
from .database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="FocusFlow Backend", lifespan=lifespan)

# Allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Ensure the assets/audio and voice_notes directory exists before mounting to prevent startup crashes
os.makedirs("assets/audio", exist_ok=True)
os.makedirs("assets/voice_notes", exist_ok=True)
app.mount("/audio", StaticFiles(directory="assets/audio"), name="audio")
app.mount("/voice-notes-files", StaticFiles(directory="assets/voice_notes"), name="voice_notes")
