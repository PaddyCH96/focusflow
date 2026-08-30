# Phase 4: Database Hosting

## Purpose
Migrate from local PostgreSQL to Neon hosted database for production deployment.

## Scope
- Set up Neon database project
- Add Alembic for database migrations
- Update backend to support hosted database
- Test connectivity and run migrations

## Out of Scope
- Data migration (starting fresh)
- Backend deployment (Phase 5)
- Frontend deployment (Phase 6)

## Acceptance Criteria
1. Neon project created with PostgreSQL database
2. Alembic configured and initial migration created
3. Backend connects to hosted database via environment variable
4. All API endpoints work with hosted database
5. Migrations run successfully on Neon

## Technical Details

### Neon Setup
- Create free tier project
- Use connection pooling (recommended for serverless)
- Get connection string format: `postgresql://user:pass@host/dbname?sslmode=require`

### Alembic Configuration
- Initialize in `backend/alembic/`
- Create migration from current `database.py` schema
- Support both local and hosted database via `DATABASE_URL`

### Backend Changes
- Update `database.py` to use `DATABASE_URL` env var
- Add fallback to local database for development
- Update Docker Compose with `DATABASE_URL` variable
