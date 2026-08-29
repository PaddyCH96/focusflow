# FocusFlow Constraints

## Technical Constraints

### TC-001: Local-First Architecture
- No cloud sync or external databases for local mode
- All data stored locally in PostgreSQL
- No user accounts or authentication
- Audio/voice notes stored on local filesystem

### TC-002: Docker Dependency
- Requires Docker and Docker Compose for local development
- No native installation option
- Database runs in Docker container

### TC-003: Python Backend
- FastAPI requires Python 3.12+
- PostgreSQL driver (psycopg2) requires system dependencies
- Audio processing may require additional system packages

### TC-004: Next.js Frontend
- Requires Node.js 20+ for development
- Build output is server-rendered (not static export)
- Three.js requires WebGL support

## Business Constraints

### BC-001: No Revenue Model
- Free and open-source (MIT license)
- No monetization planned
- No paid features

### BC-002: No Support
- Community support only
- No SLA or guaranteed response time
- No paid support tiers

### BC-003: Single Developer
- Maintained by single developer
- Limited time for features and bug fixes
- Community contributions welcome

## Resource Constraints

### RC-001: Free Tier Deployment
- Must work within free tiers of deployment platforms
- No paid infrastructure required
- Database must fit within free tier limits

### RC-002: Storage Limits
- Audio/voice notes limited by filesystem space
- No cloud storage integration
- No backup solution provided

### RC-003: Bandwidth Limits
- No CDN for assets
- No image optimization pipeline
- No video/audio streaming optimization

## Compliance Constraints

### CC-001: Privacy
- No telemetry or analytics
- No tracking pixels
- No third-party cookies
- No user data collection

### CC-002: Security
- No authentication (local-only)
- No sensitive data handling
- No payment processing
- No PII storage

### CC-003: Licensing
- MIT license for all code
- Third-party dependencies must be compatible
- No proprietary components

## Quality Constraints

### QC-001: Testing
- Minimum 80% test coverage
- All API endpoints tested
- Frontend components tested
- Integration tests for critical paths

### QC-002: Documentation
- Comprehensive README
- API documentation (OpenAPI)
- Contributing guidelines
- Architecture documentation

### QC-003: Code Quality
- TypeScript strict mode
- Python type hints
- ESLint + Prettier
- Ruff for Python linting
