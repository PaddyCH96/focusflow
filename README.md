# FocusFlow Studio

**Vedic Pomodoro Workstation — open-source, local-first, zero telemetry.**

FocusFlow is a full-stack productivity app that combines Pomodoro and Flowmodoro timers with Pranayama breathing exercises, kanban tasks, journaling, audio tracks, voice notes, and a whiteboard — all wrapped in 5 handcrafted themes.

Built with Next.js, FastAPI, and PostgreSQL, it runs entirely on your machine via Docker.

---

## Features

- **Pomodoro & Flowmodoro** — classic 25/5 or count-up flow mode with proportional breaks
- **Pranayama Ring** — 4-4-4 breathing guide during breaks
- **Strict Mode** — `beforeunload` trap that logs failed sessions if you close the tab
- **5 Themes** — Deep Space, Forest Zen, Cyberpunk, Vintage, Sattva
- **Kanban Tasks** — add, complete, and track your tasks
- **Session Analytics** — heatmap with focus scoring
- **Journal** — timestamped entries for daily reflection
- **Audio Player** — lo-fi, rain, forest ambiance (bring your own mp3)
- **Voice Notes (Vani)** — record and store voice memos
- **Whiteboard (Mandala)** — freeform drawing canvas
- **Wisdom Panel** — rotating tips from Bhagavad Gita, Yoga Sutras & Ayurveda
- **Fully local** — no accounts, no cloud, no telemetry

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
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

State-related endpoints (`/state`) are tested directly. Database-dependent endpoints (`/tasks`, `/sessions`, etc.) are tested with mocked PostgreSQL connections so tests run without Docker.

### Tests Conducted (Latest Verification)

- **Frontend unit/integration tests**: timer rendering + interactions, page/component behavior, and client-side state transitions
- **Backend API tests**: `/state` read/write flow, request validation, and error handling with mocked DB connections
- **Regression checks**: history aggregation route behavior, Docker build sanity, and local startup flow

Recommended verification commands:

```bash
# Frontend
cd frontend && npx vitest run

# Backend
cd backend && python -m pytest
```

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
│   │   └── test_main.py     # Backend tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   └── components/      # React components
│   ├── tests/               # Vitest test files
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

---

## License

MIT
