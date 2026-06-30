from pydantic import BaseModel
from typing import Literal, Optional

# Phase 1: Timer State
class TimerState(BaseModel):
    mode: Literal["work", "short_break", "long_break"]
    remaining_seconds: int
    cycle: int

class UpdateStateRequest(BaseModel):
    mode: Literal["work", "short_break", "long_break"]
    remaining_seconds: int
    cycle: int

# Phase 2: Study Hub
class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    completed: bool

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool

class SessionCreate(BaseModel):
    duration: int
    status: str = "completed"

class SessionResponse(BaseModel):
    id: int
    duration: int
    status: str
    timestamp: str

class JournalCreate(BaseModel):
    text: str

class JournalResponse(BaseModel):
    id: int
    text: str
    timestamp: str

# Phase 3: Hub & Custom Audio
class AudioTrackCreate(BaseModel):
    name: str
    url: str
    is_apple_music: bool

class AudioTrackResponse(BaseModel):
    id: int
    name: str
    url: str
    is_apple_music: bool

class HistoryEvent(BaseModel):
    id: int
    type: str # "task", "session", "journal"
    title: str
    timestamp: str

class HistoryResponse(BaseModel):
    events: list[HistoryEvent]

class HeatmapDayResponse(BaseModel):
    date: str
    focus_score: float
    sessions_completed: int
    sessions_failed: int

# Phase 9: Voice Notes (Vani)
class VoiceNoteResponse(BaseModel):
    id: int
    title: str
    file_path: str
    duration: int
    timestamp: str
