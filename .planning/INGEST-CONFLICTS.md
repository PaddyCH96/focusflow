# FocusFlow Ingest Conflicts

## BLOCKERS (0)

No blockers found. All decisions are consistent.

## WARNINGS (0)

No warnings found. No competing variants.

## INFO (3)

### INFO-001: Deployment Platform Choice
- **Variant A:** Railway (backend + database)
- **Variant B:** Fly.io (backend) + Neon (database)
- **Variant C:** Vercel (frontend) + Railway (backend + database)
- **Resolution:** User choice based on preference and pricing

### INFO-002: Storage for Audio/Voice Notes
- **Variant A:** Local filesystem (current)
- **Variant B:** Object storage (S3-compatible)
- **Variant C:** Cloudinary or similar
- **Resolution:** Start with local filesystem, migrate to object storage if needed

### INFO-003: Feature Priority
- **Variant A:** Deploy first, add features later
- **Variant B:** Complete all features, then deploy
- **Variant C:** Deploy MVP, iterate on features
- **Resolution:** User choice based on timeline and goals

## Auto-Resolved (7)

### AR-001: Backend Framework
- **Input:** FastAPI (from codebase)
- **Resolution:** LOCKED to FastAPI

### AR-002: Frontend Framework
- **Input:** Next.js 16 (from package.json)
- **Resolution:** LOCKED to Next.js 16

### AR-003: Database
- **Input:** PostgreSQL (from docker-compose.yml)
- **Resolution:** LOCKED to PostgreSQL 15

### AR-004: Authentication
- **Input:** None (from README)
- **Resolution:** No authentication (local-only)

### AR-005: Telemetry
- **Input:** None (from README)
- **Resolution:** No telemetry

### AR-006: License
- **Input:** MIT (from README)
- **Resolution:** MIT license

### AR-007: Test Framework
- **Input:** Vitest + pytest (from package.json and README)
- **Resolution:** Vitest for frontend, pytest for backend
