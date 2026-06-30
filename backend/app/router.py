from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from psycopg2.extras import RealDictCursor
import os
from uuid import uuid4
from .models import (
    TimerState, UpdateStateRequest, 
    TaskCreate, TaskUpdate, TaskResponse,
    SessionCreate, SessionResponse,
    JournalCreate, JournalResponse,
    AudioTrackCreate, AudioTrackResponse,
    HistoryResponse, HistoryEvent, HeatmapDayResponse,
    VoiceNoteResponse
)
from .database import get_db

router = APIRouter()

# --- PHASE 1: Timer State ---
_state = TimerState(mode="work", remaining_seconds=1500, cycle=0)

@router.get("/state", response_model=TimerState)
def get_state():
    return _state

@router.post("/state", response_model=TimerState)
def update_state(req: UpdateStateRequest):
    global _state
    _state = TimerState(**req.model_dump())
    return _state

# --- PHASE 2: Tasks (Kanban) ---
@router.get("/tasks", response_model=list[TaskResponse])
def get_tasks():
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM tasks ORDER BY id ASC")
        tasks = cur.fetchall()
    conn.close()
    return tasks

@router.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate):
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("INSERT INTO tasks (title) VALUES (%s) RETURNING *", (task.title,))
        new_task = cur.fetchone()
    conn.close()
    return new_task

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate):
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("UPDATE tasks SET completed = %s WHERE id = %s RETURNING *", (task.completed, task_id))
        updated = cur.fetchone()
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

# --- PHASE 2: Sessions (Stats) ---
@router.get("/sessions", response_model=list[SessionResponse])
def get_sessions():
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM sessions ORDER BY timestamp DESC")
        sessions = cur.fetchall()
    conn.close()
    # Serialize timestamps for Pydantic
    for s in sessions:
        s['timestamp'] = s['timestamp'].isoformat()
    return sessions

@router.post("/sessions", response_model=SessionResponse)
def log_session(session: SessionCreate):
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("INSERT INTO sessions (duration, status) VALUES (%s, %s) RETURNING *", (session.duration, session.status))
        new_session = cur.fetchone()
    conn.close()
    new_session['timestamp'] = new_session['timestamp'].isoformat()
    return new_session

# --- PHASE 4: Elite Analytics Engine ---
@router.get("/analytics/heatmap", response_model=list[HeatmapDayResponse])
def get_heatmap():
    conn = get_db()
    # Pull last 30 days of session data grouped by DATE
    heatmap = []
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                DATE(timestamp) as focus_date,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count
            FROM sessions
            WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(timestamp)
            ORDER BY focus_date ASC
        """)
        results = cur.fetchall()
        
    conn.close()
    
    for row in results:
        completed = row['completed_count']
        failed = row['failed_count']
        # Focus score multiplier based heavily on completion ratio
        denominator = (completed + failed) if (completed + failed) > 0 else 1
        score = completed * 10.0 * (completed / denominator)
        if failed > 0:
            score -= (failed * 5.0) # Harsh penalty for strict mode failure
        
        heatmap.append({
            "date": row['focus_date'].isoformat() if hasattr(row['focus_date'], 'isoformat') else str(row['focus_date']),
            "focus_score": max(0, round(score, 1)),
            "sessions_completed": completed,
            "sessions_failed": failed
        })
    return heatmap

# --- PHASE 2: Journal ---
@router.get("/journal", response_model=list[JournalResponse])
def get_journals():
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM journal ORDER BY timestamp DESC")
        journals = cur.fetchall()
    conn.close()
    for j in journals:
        j['timestamp'] = j['timestamp'].isoformat()
    return journals

@router.post("/journal", response_model=JournalResponse)
def log_journal(journal: JournalCreate):
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("INSERT INTO journal (text) VALUES (%s) RETURNING *", (journal.text,))
        new_journal = cur.fetchone()
    conn.close()
    new_journal['timestamp'] = new_journal['timestamp'].isoformat()
    return new_journal

# --- PHASE 3: Custom Audio Tracks ---
@router.get("/audio", response_model=list[AudioTrackResponse])
def get_audio_tracks():
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM audio_tracks ORDER BY id ASC")
        tracks = cur.fetchall()
    conn.close()
    return tracks

@router.post("/audio", response_model=AudioTrackResponse)
def add_audio_track(track: AudioTrackCreate):
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("INSERT INTO audio_tracks (name, url, is_apple_music) VALUES (%s, %s, %s) RETURNING *", (track.name, track.url, track.is_apple_music))
        new_track = cur.fetchone()
    conn.close()
    return new_track

# --- PHASE 3: Obsidian Timeline Engine ---
@router.get("/history", response_model=HistoryResponse)
def get_history():
    conn = get_db()
    events = []
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Fetch completed tasks
        cur.execute("SELECT id, title, timestamp FROM tasks WHERE completed = TRUE")
        for row in cur.fetchall():
            events.append({"id": row['id'], "type": "task", "title": f"Completed Task: {row['title']}", "timestamp": row['timestamp'].isoformat()})
        
        # Fetch sessions
        cur.execute("SELECT id, duration, timestamp FROM sessions")
        for row in cur.fetchall():
            events.append({"id": row['id'], "type": "session", "title": f"Resolved Focus Session ({row['duration']//60}m)", "timestamp": row['timestamp'].isoformat()})
        
        # Fetch journals
        cur.execute("SELECT id, text, timestamp FROM journal")
        for row in cur.fetchall():
            events.append({"id": row['id'], "type": "journal", "title": f"Journal Entry: {row['text'][:30]}...", "timestamp": row['timestamp'].isoformat()})
            
    conn.close()
    return HistoryResponse(events=sorted(events, key=lambda e: e['timestamp'], reverse=True))
    
# --- PHASE 9: Voice Notes (Vani) ---
@router.post("/voice-notes", response_model=VoiceNoteResponse)
async def upload_voice_note(
    file: UploadFile = File(...),
    title: str = Form("New Recording"),
    duration: int = Form(0)
):
    # Ensure directory exists (should be handled in main.py too)
    os.makedirs("assets/voice_notes", exist_ok=True)
    
    # Save the file with a unique name
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "webm"
    unique_filename = f"{uuid4()}.{file_extension}"
    file_path = f"assets/voice_notes/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Public URL for the frontend
    public_url = f"http://localhost:8000/voice-notes-files/{unique_filename}"
    
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "INSERT INTO voice_notes (title, file_path, duration) VALUES (%s, %s, %s) RETURNING *",
            (title, public_url, duration)
        )
        new_note = cur.fetchone()
    conn.close()
    
    new_note['timestamp'] = new_note['timestamp'].isoformat()
    return new_note

@router.get("/voice-notes", response_model=list[VoiceNoteResponse])
def get_voice_notes():
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM voice_notes ORDER BY timestamp DESC")
        notes = cur.fetchall()
    conn.close()
    for n in notes:
        n['timestamp'] = n['timestamp'].isoformat()
    return notes

# --- PHASE 10: Whiteboard (Mandala) ---
@router.get("/whiteboards", response_model=list[dict])
def get_whiteboards():
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM whiteboards ORDER BY timestamp DESC")
        boards = cur.fetchall()
    conn.close()
    for b in boards:
        b['timestamp'] = b['timestamp'].isoformat()
    return boards

@router.post("/whiteboards")
def save_whiteboard(board: dict):
    # board: { "title": str, "content": str }
    conn = get_db()
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            "INSERT INTO whiteboards (title, content) VALUES (%s, %s) RETURNING id",
            (board.get("title", "Untitled"), board.get("content", ""))
        )
        new_id = cur.fetchone()['id']
    conn.close()
    return {"id": new_id, "status": "saved"}
