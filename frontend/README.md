# FocusFlow Studio

A cinematic, meditation-focused deep work environment inspired by Himalayan monasteries. Combines a Pomodoro timer with procedurally generated 3D landscapes, ambient soundscapes, and Vedic-inspired visual design.

**All data is stored locally on your device. Zero cloud sync, zero telemetry, zero network requests for persistence.**

---

## Features

- **Pomodoro Timer** — Work/break timer with visual arc progress and tick marks
- **4 Theme Environments** — Sunrise, Daylight, Sunset, Midnight — each with unique 3D scene colors
- **Procedural 3D Scene** — Terrain, temple silhouettes, clouds, mist, and starfield using Three.js
- **8 Ambient Sounds** — Rain, Ocean, Stream, Wind, Forest, Fireplace, Cafe, Night — synthetically generated via Web Audio API (no audio files needed)
- **Task Management** — Add, complete, and delete tasks with localStorage persistence
- **Session Tracking** — Automatic session logging with insights view
- **Breathing Guide** — Pranayama-inspired animated mandala
- **Fully Offline** — Works completely offline after the initial page load
- **Local-First** — All data persisted to `localStorage`. No external databases, no cloud sync, no API calls.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D Rendering | Three.js + @react-three/fiber + @react-three/drei |
| Audio | Web Audio API (procedural synthesis) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Inter + Playfair Display (via next/font) |
| Testing | Vitest + Testing Library |
| Build | Next.js standalone output |

---

## Local-First Architecture

FocusFlow is built on a strict **local-first** principle:

```
┌─────────────────────────────────────┐
│           Browser (Client)          │
│                                     │
│  ┌─────────┐    ┌────────────────┐  │
│  │   UI     │◄──►│  React Hooks   │  │
│  │ (page.tsx)│    │ (useTimer,     │  │
│  └─────────┘    │  useTasks,      │  │
│                 │  useSessions,   │  │
│  ┌─────────┐    │  useAudio)      │  │
│  │  Scene3D │    └───────┬────────┘  │
│  │ (Three)  │            │           │
│  └─────────┘            ▼           │
│                 ┌────────────────┐  │
│                 │  localStorage  │  │
│                 │  Provider      │  │
│                 └───────┬────────┘  │
│                         ▼           │
│                 ┌────────────────┐  │
│                 │  Browser       │  │
│                 │  localStorage  │  │
│                 └────────────────┘  │
└─────────────────────────────────────┘
```

- **Zero server-side persistence** — No backend database, no REST API, no GraphQL
- **Zero third-party storage** — No Firebase, Supabase, or cloud services
- **Zero analytics** — No telemetry, tracking pixels, or analytics SDKs
- **Zero external audio** — All sounds are procedurally generated; no audio files to download
- **Zero runtime network calls** — After the initial page load, the app makes zero `fetch`/`XMLHttpRequest`/`WebSocket` calls

All state is persisted via `window.localStorage` through a thin abstraction layer (`src/lib/storage/`) that handles JSON serialization and SSR safety.

### Storage Keys

| Key | Contents |
|-----|----------|
| `focusflow_theme` | Current theme ID |
| `focusflow_timer` | Timer state (remaining, mode, running) |
| `focusflow_tasks` | Task list |
| `focusflow_sessions` | Completed sessions |
| `focusflow_sounds` | Sound state and volumes |

---

## Installation

### Prerequisites

- Node.js >= 18
- npm, yarn, pnpm, or bun

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/focusflow.git
cd focusflow/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Docker

```bash
docker compose up --build -d
# App available at http://localhost:3001
```

---

## Usage

1. **Timer** — Select Focus, Short Break, or Long Break mode. Press Start. The arc fills as time progresses.
2. **Tasks** — Switch to the Tasks view, type a task, and press Enter or click Add.
3. **Ambient Sounds** — Switch to Ambient view. Click any sound card to play. Use the slider to adjust individual volume.
4. **Theme** — Click any of the four colored dots in the top bar (Sunrise, Daylight, Sunset, Midnight).
5. **Insights** — View today's session count and total focus time.
6. **Settings** — Click the gear icon to change theme or adjust master volume.

---

## Development

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles and Tailwind
│   │   ├── layout.tsx        # Root layout with ThemeProvider
│   │   ├── page.tsx          # Main application page
│   │   └── page.test.tsx     # Page integration tests
│   ├── components/
│   │   ├── Scene3D.tsx       # Three.js procedural 3D scene
│   │   ├── ThemeContext.tsx   # Theme provider with CSS variable injection
│   │   └── VedicOrnaments.tsx # SVG decorative elements
│   └── lib/
│       ├── constants.ts      # Shared constants (durations)
│       ├── themes.ts         # Theme color definitions
│       ├── audio-engine.ts   # Web Audio API procedural sound engine
│       ├── storage/
│       │   ├── types.ts      # TypeScript types for all state
│       │   ├── provider.ts   # Storage provider interface
│       │   └── local.ts      # localStorage implementation
│       └── hooks/
│           ├── useTimer.ts   # Pomodoro timer logic
│           ├── useTasks.ts   # Task CRUD operations
│           ├── useSessions.ts # Session history tracking
│           └── useAudio.ts   # Sound state management
├── vitest.config.ts
└── package.json
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Tests cover:
- Timer logic (start, pause, reset, completion, mode switching)
- State persistence (localStorage save/restore, corruption handling)
- Storage provider (CRUD, error handling, SSR safety)
- Theme definitions (structure, completeness, uniqueness)
- Constants validation
- UI component rendering
- Network call verification (ensures zero network requests)

---

## Architecture Decisions

### Why localStorage instead of IndexedDB?
localStorage is simpler, synchronous (no async complexity for small data), and sufficient for the app's data volume (< 1MB total). If the task list grows large, migration to IndexedDB would be straightforward via the storage provider abstraction.

### Why procedural audio instead of audio files?
Procedural synthesis via Web Audio API means zero audio file downloads, zero server bandwidth for audio, and a smaller bundle size. The app works fully offline without any audio assets.

### Why single-page architecture?
The app is a focused productivity tool with a single workflow. A single-page architecture eliminates navigation overhead, simplifies state management, and keeps the bundle small.

---

## License

MIT — see [LICENSE](./LICENSE) for details.
