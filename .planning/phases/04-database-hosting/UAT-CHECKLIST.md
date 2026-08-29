# Phase 4 UAT Checklist

## Tasks

- [ ] 4.1 Set up Neon Database
- [ ] 4.2 Add Alembic for Migrations
- [ ] 4.3 Update Backend Configuration
- [ ] 4.4 Test Database Connectivity
- [ ] 4.5 Run Migrations on Hosted Database

## UAT Checklist

- [ ] Neon project created
- [ ] Connection string obtained
- [ ] Alembic installed and configured
- [ ] Initial migration created
- [ ] Migration runs successfully on local database
- [ ] Backend connects to hosted database
- [ ] All API endpoints work with hosted database
- [ ] Migrations run successfully on Neon

## Verification Steps

1. Create Neon project and obtain connection string
2. Install Alembic in backend
3. Initialize Alembic configuration
4. Create initial migration from current schema
5. Test migration on local database
6. Update backend to use `DATABASE_URL` environment variable
7. Test connection to hosted database
8. Run `alembic upgrade head` on Neon
9. Verify tables created correctly
10. Test all API endpoints with hosted database
