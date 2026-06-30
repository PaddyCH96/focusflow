<div align="center">
  <img src="https://via.placeholder.com/150/ea580c/ffffff?text=FocusFlow" alt="FocusFlow Logo" width="120" />

  # FocusFlow Studio 🪷
  **The World's First Vedic-Logic Pomodoro Workstation.**

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Docker Status](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-black?style=flat&logo=react)](https://react.dev/)
  
  <br />
  <a href="https://railway.app/new"><img src="https://railway.app/button.svg" alt="Deploy on Railway"></a>
  <a href="https://vercel.com/new"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a>
</div>

---

## 🚀 The Science of Dharana

Tired of highly-stimulating productivity apps padding your stress levels? **FocusFlow** combines the brutal efficiency of western Pomodoro/Flowmodoro cycles with the deeply grounding, ancient Indian practice of **Dharana** (Single-Pointed Concentration).

By pairing aggressive `beforeunload` browser-traps with 4-4-4 Pranayama breathing loops during your off-intervals, FocusFlow structurally forces you into a flow state characterized by low-anxiety baseline cortisol limits and sustained cognitive expansion. Zero telemetry, completely local.

### Core Ideology vs Paid Competitors

| Metric | FocusFlow (Vedic Architecture) | Endel ($15/mo) | Tide ($12/mo) |
|---------|-----------------|----------------|---------------|
| **Mental Recovery** | ✅ 4-4-4 Pranayama Visualizer | ❌ None | ❌ Abstract |
| **Focus Pedagogy** | ✅ Dharana + Trataka Tips | ❌ None | ❌ Generic |
| **Strict Traps** | ✅ PostreSQL session penalties | ❌ No | ❌ No |
| **Theme Depth** | ✅ 5x CSS Variable Themes | ✅ Yes | ❌ Fixed |
| **Music Sourcing** | ✅ Included "Ancient Echoes" Drone | ✅ Yes | ❌ None |

---

## 🪷 The "Sattva" Theme Engine (v6.0)

Along with Deep Space, Forest Zen, Cyberpunk, and Vintage, FocusFlow is globally governed by the **Sattva (Pure)** Theme.

- **Vedic Chromatics**: A lush, warm layout built entirely on *Sand* and *Saffron* root variables rendering over an absolute minimum white interface.
- **Tejas Micro-Interactions**: When the Dharana (Focus) timer is active, a massive "Tejas" (Divine Radiance) box-shadow glows dynamically from the timer component rendering real-time drop-shadow calculations.
- **The Wisdom Engine**: A dedicated layout dashboard rotating high-value structural focus tips extracted directly from the *Bhagavad Gita*, *Yoga Sutras*, and *Ayurvedic* textbooks.

---

## 🧠 Advanced Capabilities

- **Pranayama Breath-Sync**: During breaks, pulling out your phone ruins your dopamine baseline. The central timer is entirely replaced by a glowing Pranayama breathing-guide synchronized strictly to a 12-second core loop: *Inhale for 4s - Hold for 4s - Exhale for 4s*. 
- **Flowmodoro Engine**: Sick of being interrupted at 25 minutes while in the zone? Toggle "Flowmodoro". The timer counts *up* infinitely. When you manually hit halt, the system gracefully calculates proportional break intervals via a strict `Elapsed/5` algorithm.
- **The Cross-Fade Engine**: Driven by raw `AudioContext` and `GainNode`, the app seamlessly transitions between your intense Focus loops and relaxed Break loops over mathematically precise 5-second `linearRampToValueAtTime` curves.

---

## 🛠 Tech Stack Deep Dive

FocusFlow uses a distinctly separated high-availability microservice design:

1. **Frontend (Next.js 14 / Tailwind / Framer Motion)**: A stateless UX layer. Heavy lifting is passed arbitrarily to Framer Motion for pristine 60fps React hardware scaling on the breathing components.
2. **Backend (Python 3.12 / FastAPI / Psycopg2)**: A zero-bloat asynchronous REST layer executing fast sub-millisecond route resolution against our history heat-maps.
3. **Database (PostgreSQL 15)**: Relational tables utilizing clustered indexing mapped to high-volume user event chronologies (Tasks, Journals, Session telemetry arrays).

---

## ⚙️ One-Command Local Deployment

Requirements: `docker` and `docker-compose`.

```bash
git clone https://github.com/yourusername/focusflow.git
cd focusflow
chmod +x setup.sh
./setup.sh
docker compose up --build -d
```
Access the immersive UI interface at `http://localhost:3001`.
