# Phase 2: Testing & CI — Context

**Gathered:** 2026-08-29
**Status:** Ready for planning
**Source:** Manual analysis from ROADMAP.md

<domain>
## Phase Boundary

Add comprehensive test coverage and set up CI/CD pipeline for automated testing and deployment. This phase ensures code quality through integration tests, E2E tests, and automated CI checks on every PR.

</domain>

<decisions>
## Implementation Decisions

### Test Framework
- **Backend:** pytest with httpx for API testing
- **Frontend:** Vitest with React Testing Library
- **E2E:** Playwright for browser automation

### CI/CD Platform
- **GitHub Actions** for CI/CD pipeline
- Free tier for public repositories

### Test Coverage Target
- Minimum 80% code coverage for backend
- All API endpoints tested
- Critical user flows tested with E2E

### Claude's Discretion
- Specific test file locations
- Mock strategies for external dependencies
- CI workflow configuration details

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Tests
- `backend/tests/test_main.py` — Existing backend tests (pytest)
- `frontend/tests/` — Existing frontend tests (Vitest)

### Configuration
- `backend/requirements.txt` — Python dependencies
- `frontend/package.json` — Node.js dependencies
- `docker-compose.yml` — Service configuration

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<specifics>
## Specific Ideas

### Integration Tests
- Test all CRUD endpoints with real database
- Test error handling and edge cases
- Test authentication-free access (local-first)

### E2E Tests
- Test timer start/stop/reset flow
- Test task creation and completion
- Test journal entry creation
- Test theme switching

### CI Pipeline
- Run tests on every PR
- Run linting (ruff for Python, eslint for TypeScript)
- Run type checking (mypy for Python, tsc for TypeScript)
- Build verification

</specifics>

<deferred>
## Deferred Ideas

- Performance testing (load testing)
- Security scanning (SAST/DAST)
- Visual regression testing
- Accessibility testing automation

</deferred>

---

*Phase: 02-testing-ci*
*Context gathered: 2026-08-29 via manual analysis*
