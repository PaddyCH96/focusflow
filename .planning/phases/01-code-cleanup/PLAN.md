# Phase 1: Code Cleanup & Configuration

## Objective
Clean up code, add configuration management, add health checks, and prepare the codebase for production deployment.

## Tasks

### Task 1: Backend .dockerignore
Create a `.dockerignore` file in the backend directory to exclude unnecessary files from Docker builds.

**Files to modify:**
- `backend/.dockerignore` (create)

**Acceptance criteria:**
- `.dockerignore` excludes `__pycache__`, `*.pyc`, `.git`, `venv`, `.env`, `tests/`
- Docker build is faster and smaller

### Task 2: Environment Variable Configuration
Create `.env.example` and update code to use environment variables instead of hardcoded values.

**Files to modify:**
- `.env.example` (create)
- `backend/app/database.py` (update)
- `docker-compose.yml` (update)

**Acceptance criteria:**
- `.env.example` documents all configurable values
- Database URL reads from `DATABASE_URL` env var
- Docker Compose uses env vars from `.env` file
- Hardcoded values removed from code

### Task 3: Health Check Endpoints
Add `/health` and `/ready` endpoints to the backend API.

**Files to modify:**
- `backend/app/router.py` (update)

**Acceptance criteria:**
- `GET /health` returns `{"status": "ok"}`
- `GET /ready` checks database connectivity and returns readiness status
- Endpoints don't require authentication

### Task 4: CORS Configuration
Restrict CORS to known origins in production.

**Files to modify:**
- `backend/app/main.py` (update)
- `.env.example` (update)

**Acceptance criteria:**
- CORS origins configurable via `CORS_ORIGINS` env var
- Default allows localhost for development
- Production restricts to deployed frontend URL

### Task 5: Error Handling Middleware
Add request validation and error handling middleware.

**Files to modify:**
- `backend/app/main.py` (update)

**Acceptance criteria:**
- Global exception handler for unhandled errors
- Structured error responses (JSON)
- Request ID tracking

### Task 6: Structured Logging
Add JSON-formatted logging for production.

**Files to modify:**
- `backend/app/main.py` (update)
- `backend/requirements.txt` (update)

**Acceptance criteria:**
- JSON-formatted logs in production
- Console output in development
- Request/response logging

### Task 7: Backend .dockerignore
Create `.dockerignore` for the frontend.

**Files to modify:**
- `frontend/.dockerignore` (create)

**Acceptance criteria:**
- Excludes `node_modules`, `.next`, `.git`
- Reduces Docker context size

## Dependencies
- None (this is the first phase)

## Estimated Time
- 2-3 hours

## Success Criteria
- All tasks completed
- `docker compose up --build` works with new configuration
- Health endpoints respond correctly
- Environment variables properly configured
