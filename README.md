# FocusFlow Studio

**Vedic Pomodoro Workstation — open-source, self-hosted, zero telemetry.**

FocusFlow is a full-stack productivity app that combines a Pomodoro timer with kanban-style tasks, journaling, voice notes, and a whiteboard — all wrapped in a cinematic Himalayan-monastery visual language with 4 handcrafted environments and day/night lighting.

Built with Next.js and FastAPI + PostgreSQL, it runs entirely on your machine via Docker. Nothing is sent anywhere except between your own frontend and your own backend.

---

## Screenshots

See [`frontend/README.md`](./frontend/README.md#screenshots) for the full set (Timer, Tasks, Stats, Journal, Voice Notes, Whiteboard, Themes, night mode, and responsive layouts).

---

## Features

- **Pomodoro Timer** — Focus / Short Break / Long Break with a circular progress ring; every 4th completed focus session rolls into a Long Break automatically
- **4 Environments** — Himalayan Dawn, Sacred Twilight, Vedic Forest, Snow Serenity — each with its own accent color and 3D scene palette, plus an independent Day/Night lighting toggle
- **Kanban-style Tasks** — add, complete, and delete tasks, persisted through the backend
- **Session Analytics** — a 30-day focus-score heatmap (`/analytics/heatmap`) and session history; skipping mid-focus logs a `failed` session, letting it run out logs `completed`
- **Journal** — timestamped entries for daily reflection
- **Voice Notes (Vani)** — record from the browser microphone and play recordings back
- **Whiteboard (Mandala)** — freeform drawing canvas with save/load
- **Ambient Sounds** — 8 procedurally-generated soundscapes (Web Audio API, no audio files) — entirely client-side, no backend involved
- **Fully self-hosted** — no accounts, no third-party cloud services, no telemetry; the only network traffic is your browser talking to the backend you're running

Not yet implemented, despite being an early goal for this project: a Flowmodoro (count-up) timer mode, a Pranayama breathing guide, a "Strict Mode" `beforeunload` failed-session trap, and a dedicated UI for the backend's custom `/audio` track library. The API and data model for most of these are either partially or fully in place; the frontend UI isn't.

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js (@react-three/fiber), Web Audio API |
| Backend | Python 3.12, FastAPI, Psycopg2 |
| Database | PostgreSQL 15 |
| Container | Docker + Docker Compose |

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (Docker Desktop on Mac/Windows, or Docker Engine + Compose plugin on Linux)
- Git

Installation takes about 5–10 minutes depending on your internet speed.

### Step-by-step

```bash
# 1. Clone the repository
git clone https://github.com/PaddyCH96/focusflow.git
cd focusflow

# 2. Make the setup script executable and run it
chmod +x setup.sh
./setup.sh

# 3. Build and start all services
docker compose up --build -d

# 4. Open the app
open http://localhost:3001
```

That's it. The backend API runs on `http://localhost:8000` and PostgreSQL on port `5432`.

The frontend runs entirely in your browser and calls the backend directly, so the backend URL is baked into the frontend bundle at build time via `NEXT_PUBLIC_API_URL` (set to `http://localhost:8000` in `docker-compose.yml`). If you publish the backend on a different host or port, change it there and rebuild.

For frontend-only development against a backend you're already running, see [`frontend/README.md`](./frontend/README.md#quick-start).

### What setup.sh does

The setup script creates the `assets/audio` and `assets/voice_notes` directories if they don't exist — these are required by the backend at startup. On first run, the backend also auto-creates all database tables and seeds 3 default audio tracks.

### Stopping the app

```bash
docker compose down
```

To also delete the database data (fresh start):
```bash
docker compose down -v
```

---

## Running Tests

### Frontend (Vitest)

```bash
cd frontend
npm install
npx vitest run
```

### Backend (pytest)

```bash
cd backend
pip install -r requirements.txt
python -m pytest
```

Neither suite needs Docker or a running database.

### What's covered

- **Frontend (45 tests)** — timer logic (local-only, verified to make no network calls); task and session hooks against a mocked `fetch` (loading, optimistic add/toggle/delete with rollback on failure, error surfacing, reload); storage provider and theme definitions; page-level integration across all nine views.
- **Backend (24 tests)** — every endpoint: `/state`, task CRUD including `DELETE` and 404s, sessions (completed and failed), journal, audio tracks, voice note list and multipart upload, whiteboards, the `/history` merge-and-sort, and the `/analytics/heatmap` focus-score math. Database access is mocked through a shared `mock_conn_factory` fixture in `backend/tests/conftest.py`; file writes in the voice-note upload test are mocked too.

---

## Project Structure

```
focusflow/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # PostgreSQL connection & schema init
│   │   ├── models.py        # Pydantic request/response models
│   │   └── router.py        # All API routes
│   ├── tests/
│   │   ├── conftest.py      # TestClient + mocked-DB fixtures
│   │   └── test_*.py        # One file per resource
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # See frontend/README.md for the full tree
│   ├── src/
│   │   ├── app/             # Next.js entry, global styles, page tests
│   │   ├── components/      # AppShell, layout, timer, rail, and views
│   │   └── lib/             # API client, hooks, storage, themes, audio engine
│   ├── docs/screenshots/
│   ├── Dockerfile
│   └── package.json
├── assets/
│   ├── audio/               # MP3 files served by the backend
│   └── voice_notes/         # User recordings saved here
├── docker-compose.yml
└── setup.sh
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/state` | Current timer state |
| POST | `/state` | Update timer state |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/{id}` | Toggle task completion |
| DELETE | `/tasks/{id}` | Delete a task (204; 404 if missing) |
| GET | `/sessions` | Session history |
| POST | `/sessions` | Log a session |
| GET | `/journal` | Journal entries |
| POST | `/journal` | Create entry |
| GET | `/audio` | List audio tracks |
| POST | `/audio` | Add audio track |
| GET | `/history` | Combined timeline |
| GET | `/analytics/heatmap` | Focus score heatmap |
| GET | `/voice-notes` | List voice notes |
| POST | `/voice-notes` | Upload voice note |
| GET | `/whiteboards` | List whiteboards |
| POST | `/whiteboards` | Save whiteboard |

---

## Problems Faced & How I Fixed Them

When I picked this project up, it had some rough edges that made it frustrating to work with. Here's what was wrong and how I sorted it out.

### 1. The history endpoint silently returned nothing

There was a route for `GET /history` meant to show a combined timeline of completed tasks, sessions, and journal entries. The code built a list of events but never returned it — no `return` statement. So hitting the endpoint just gave back an empty response with no error. I added the missing `return HistoryResponse(events=events)` to make it actually work.

### 2. No tests — at all

The project had zero tests. Not one. Frontend had no test framework installed, backend had no test dependencies. I set up Vitest with React Testing Library on the frontend and pytest with httpx on the backend. Now there are tests for the core timer endpoints and a basic page render test. The db-dependent tests use mocked connections so they don't need Docker to run.

### 3. The Dockerfile had deprecated ENV syntax

The Dockerfile was using the old `ENV key value` format (without `=`) which throws warnings. I updated all of them to `ENV key=value`. Clean builds, no noise in the logs.

### 4. next.config.ts had config keys that did nothing

The config file had `eslint` and `typescript` keys that were silently ignored by Next.js 16. No errors, no warnings — just dead config. I removed them and the build now runs TypeScript checking during compilation as intended.

### 5. The docker-compose file had a deprecated field

It had `version: '3.8'` at the top which Docker Compose has ignored for a while now. I removed it.

### 6. Database URL was hardcoded

The backend could only connect to a database called `postgres` at host `postgres` — if you wanted to run it differently you had to edit `database.py`. I changed it to read from a `DATABASE_URL` environment variable with the old value as fallback, so it works both in Docker and when customized.

### 7. No .dockerignore on the frontend

The frontend Docker build was sending the entire project folder (including `node_modules`) to the Docker daemon — over 400MB of unnecessary bloat. I added a `.dockerignore` that excludes `node_modules`, `.next`, and git files.

### 8. The frontend never actually talked to the backend

The backend had a full API for tasks, sessions, journal, voice notes, whiteboards, and analytics — but the frontend kept everything in `localStorage` and never made a single request to it. Journal, Voice Notes, and Whiteboard existed only as database tables with no UI at all. I added a small typed `fetch` client, moved tasks and sessions onto the API (with a one-time migration of anything already in `localStorage`), built the three missing views, surfaced the heatmap in Stats, and added the `DELETE /tasks/{id}` endpoint the existing delete button needed. Backend test coverage went from 3 tests to 24, covering every endpoint.

---

## License

MIT
