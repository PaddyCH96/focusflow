# FocusFlow Decisions

## Architecture Decisions

### AD-001: Local-First Architecture
- **Decision:** No cloud sync, no user accounts, no external dependencies
- **Rationale:** Privacy-focused, simple deployment, no auth complexity
- **Status:** LOCKED

### AD-002: Docker Compose for Development
- **Decision:** Use Docker Compose for all local development
- **Rationale:** Consistent environment, easy setup, matches production
- **Status:** LOCKED

### AD-003: PostgreSQL over SQLite
- **Decision:** Use PostgreSQL for persistence
- **Rationale:** Better performance, proper JSON support, easier hosted options
- **Status:** LOCKED

### AD-004: FastAPI Backend
- **Decision:** FastAPI for Python backend
- **Rationale:** Async support, automatic OpenAPI docs, type safety
- **Status:** LOCKED

### AD-005: Next.js 16 with App Router
- **Decision:** Next.js 16 for frontend
- **Rationale:** React 19 support, server components, optimized builds
- **Status:** LOCKED

### AD-006: No Authentication
- **Decision:** Single-user local app, no auth
- **Rationale:** Simplifies codebase, aligns with local-first philosophy
- **Status:** LOCKED

### AD-007: No Telemetry
- **Decision:** Zero external analytics or tracking
- **Rationale:** Privacy commitment, no external dependencies
- **Status:** LOCKED

## Technology Decisions

### TD-001: Three.js for Visualizations
- **Decision:** Use Three.js/React Three Fiber for 3D elements
- **Rationale:** Already in package.json, used for whiteboard/mandala
- **Status:** IMPLEMENTED

### TD-002: Framer Motion for Animations
- **Decision:** Framer Motion for UI animations
- **Rationale:** Already in package.json, smooth transitions
- **Status:** IMPLEMENTED

### TD-003: Tailwind CSS 4
- **Decision:** Tailwind CSS for styling
- **Rationale:** Utility-first, fast development, good theme support
- **Status:** IMPLEMENTED

## Deployment Decisions

### DD-001: Frontend on Vercel
- **Decision:** Deploy Next.js frontend to Vercel
- **Rationale:** Native Next.js support, free tier, easy setup
- **Status:** PENDING

### DD-002: Backend on Railway/Fly.io
- **Decision:** Deploy FastAPI backend to Railway or Fly.io
- **Rationale:** Python support, Docker support, reasonable pricing
- **Status:** PENDING

### DD-003: Database on Neon/Supabase
- **Decision:** Host PostgreSQL on Neon or Supabase
- **Rationale:** Free tier available, easy setup, managed service
- **Status:** PENDING
