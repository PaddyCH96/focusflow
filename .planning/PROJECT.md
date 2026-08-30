# FocusFlow Studio

## Overview

FocusFlow is a full-stack, local-first productivity app combining Pomodoro/Flowmodoro timers with Pranayama breathing exercises, kanban tasks, journaling, audio tracks, voice notes, and a whiteboard — all wrapped in 5 handcrafted themes. Zero telemetry, no accounts, runs entirely on your machine via Docker.

## Goals

- Ship a polished, deployable productivity app
- Maintain local-first, zero-telemetry philosophy
- Deploy to a public URL for portfolio demonstration
- Clean up code, add missing features, and ensure production readiness

## Non-Goals

- User authentication / multi-user support
- Cloud sync or backend-as-a-service
- Mobile native apps (PWA acceptable)
- Monetization

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Three.js |
| Backend | Python 3.12, FastAPI, Psycopg2 |
| Database | PostgreSQL 15 |
| Container | Docker + Docker Compose |

## Locked Decisions

- **Runtime:** Docker Compose (local-first)
- **Database:** PostgreSQL 15 (not SQLite, not Supabase)
- **Backend framework:** FastAPI
- **Frontend framework:** Next.js 16 with App Router
- **No auth:** Local-only, no user accounts
- **No telemetry:** Zero external analytics

## Success Metrics

- App runs via `docker compose up` with zero errors
- All features functional and tested
- Deployed to a public URL (Vercel + Railway/Fly.io or similar)
- Portfolio-ready README with live demo link
