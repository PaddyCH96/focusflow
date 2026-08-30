# FocusFlow Context

## Project History

### Origin
FocusFlow started as a personal productivity tool combining Pomodoro technique with Eastern meditation practices (Pranayama breathing, spiritual wisdom). The goal was to create a beautiful, distraction-free workstation for focused work.

### Evolution
1. **Initial Build:** Basic timer + kanban + audio
2. **Theme System:** Added 5 handcrafted themes
3. **Advanced Features:** Added voice notes, whiteboard, journal
4. **Breathing Exercises:** Integrated Pranayama ring
5. **Wisdom Panel:** Added spiritual quotes from Gita, Yoga Sutras
6. **Bug Fixes:** Fixed 7 critical bugs (documented in README)
7. **Testing:** Added Vitest + pytest test suites

### Current State
- 9 commits
- All core features implemented
- Docker Compose working locally
- Basic test coverage
- No deployment
- No production hardening

## Technical Context

### Codebase Structure
```
focusflow/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── database.py      # PostgreSQL connection
│   │   ├── models.py        # Pydantic models
│   │   └── router.py        # All API routes
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   └── components/      # React components
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── assets/
│   ├── audio/               # MP3 files
│   └── voice_notes/         # User recordings
├── docker-compose.yml
└── setup.sh
```

### API Endpoints
- `GET/POST /state` - Timer state
- `GET/POST /tasks` - Task management
- `PUT /tasks/{id}` - Toggle task
- `GET/POST /sessions` - Session history
- `GET/POST /journal` - Journal entries
- `GET/POST /audio` - Audio tracks
- `GET /history` - Combined timeline
- `GET /analytics/heatmap` - Focus heatmap
- `GET/POST /voice-notes` - Voice memos
- `GET/POST /whiteboards` - Whiteboard data

### Database Schema
- `tasks` - Kanban tasks
- `sessions` - Completed focus sessions
- `journal` - Journal entries
- `audio` - Audio track metadata
- `voice_notes` - Voice memo metadata
- `whiteboards` - Whiteboard data
- `timer_state` - Current timer state

## User Context

### Target Users
- Developers seeking focused work
- Knowledge workers
- Students
- Meditation practitioners
- Anyone wanting Pomodoro + breathing exercises

### Use Cases
1. **Deep Work Session:** Start Pomodoro, work for 25 min, take Pranayama break
2. **Flow State:** Use Flowmodoro for uninterrupted focus
3. **Task Management:** Track tasks while focusing
4. **Reflection:** Journal after sessions
5. **Ambient Focus:** Play lo-fi audio while working

## Deployment Context

### Current Deployment
- Local only via `docker compose up`
- No public URL
- No CI/CD

### Target Deployment
- **Frontend:** Vercel (free tier)
- **Backend:** Railway or Fly.io (free tier)
- **Database:** Neon or Supabase (free tier)
- **Total cost:** $0/month (free tiers)

### Deployment Challenges
1. Audio/voice note storage (filesystem vs object storage)
2. Database migrations on hosted service
3. Environment variable management
4. CORS configuration for cross-origin requests
