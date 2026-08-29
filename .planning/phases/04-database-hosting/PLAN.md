# Phase 4: Database Hosting

## Goal
Move from local PostgreSQL to Neon hosted database.

## Decisions Made
- **Provider:** Neon (serverless PostgreSQL)
- **Migration Strategy:** Alembic for schema management
- **Data Migration:** Start fresh (empty database)

## Plan

### 4.1 Set up Neon Database
- Create Neon account and project
- Get connection string
- Configure connection pooling

### 4.2 Add Alembic for Migrations
- Install Alembic in backend
- Initialize Alembic configuration
- Create initial migration from current schema
- Test migration on local database

### 4.3 Update Backend Configuration
- Update `database.py` to support both local and hosted DB
- Add `DATABASE_URL` environment variable handling
- Update Docker Compose for local development

### 4.4 Test Database Connectivity
- Test local connection with Alembic
- Test hosted connection with Alembic
- Verify all endpoints work with hosted DB

### 4.5 Run Migrations on Hosted Database
- Run `alembic upgrade head` on Neon
- Verify tables created correctly
- Test API endpoints with hosted DB

## Verification
- [ ] Neon project created
- [ ] Alembic configured and working
- [ ] Initial migration created
- [ ] Backend connects to hosted database
- [ ] All API endpoints work with hosted DB
- [ ] Migrations run successfully on Neon
