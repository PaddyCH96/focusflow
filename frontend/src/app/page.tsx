"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Settings, Headphones, Menu, X, Play, Pause, RotateCcw, CheckCircle2, Circle, Trash2, Sparkles, Brain, BarChart3, Timer as TimerIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/components/ThemeContext"
import { useAudio } from "@/lib/hooks/useAudio"
import { useTasks } from "@/lib/hooks/useTasks"
import { useSessions } from "@/lib/hooks/useSessions"
import {
  MandalaPattern,
  TempleSilhouette,
} from "@/components/VedicOrnaments"
const Scene3D = dynamic(() => import("@/components/Scene3D").then(m => ({ default: m.Scene3D })), { ssr: false })
import type { View, ThemeId } from "@/lib/storage/types"
import { themes, getTheme } from "@/lib/themes"
import { DURATIONS } from "@/lib/constants"

const SOUND_LABELS: Record<string, string> = {
  rain: "Rain",
  ocean: "Ocean",
  stream: "Stream",
  wind: "Wind",
  forest: "Forest",
  fireplace: "Fireplace",
  cafe: "Cafe",
  night: "Night",
}

const SOUND_ICONS: Record<string, string> = {
  rain: "🌧️",
  ocean: "🌊",
  stream: "💧",
  wind: "💨",
  forest: "🌲",
  fireplace: "🔥",
  cafe: "☕",
  night: "🌙",
}

const VIEW_ICONS: Record<View, React.ReactNode> = {
  focus: <Brain size={18} />,
  timer: <TimerIcon size={18} />,
  tasks: <CheckCircle2 size={18} />,
  insights: <BarChart3 size={18} />,
  breath: <Sparkles size={18} />,
  ambient: <Headphones size={18} />,
}

export default function Home() {
  const { themeId, colors, setTheme } = useTheme()
  const { sounds, masterVolume, toggle: toggleSound, setVolume, setMasterVolume } = useAudio()
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const { sessions, addSession } = useSessions()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState<View>("focus")
  const [timerMode, setTimerMode] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [timeRemaining, setTimeRemaining] = useState(DURATIONS.work)
  const [timerRunning, setTimerRunning] = useState(false)
  const [taskInput, setTaskInput] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const timerCanvasRef = useRef<HTMLCanvasElement>(null!)
  const timerViewCanvasRef = useRef<HTMLCanvasElement>(null!)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const themeDots: ThemeId[] = ["sunrise", "daylight", "sunset", "midnight"]

  const totalFocusMinutes = useMemo(
    () => sessions.filter(s => s.type === "work").reduce((a, s) => a + s.duration, 0) / 60,
    [sessions]
  )

  const timerProgress = useMemo(() => {
    const total = DURATIONS[timerMode]
    return 1 - timeRemaining / total
  }, [timeRemaining, timerMode])

  const todaySessions = useMemo(
    () => sessions.filter(s => new Date(s.startTime).toDateString() === new Date().toDateString()),
    [sessions]
  )

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }, [])

  const handleSessionComplete = useCallback(() => {
    const now = new Date().toISOString()
    addSession({
      id: crypto.randomUUID(),
      startTime: now,
      duration: DURATIONS[timerMode] - timeRemaining,
      type: timerMode === "work" ? "work" : timerMode === "shortBreak" ? "shortBreak" : "longBreak",
      completed: true,
      timerType: "pomodoro",
    })
  }, [timerMode, timeRemaining, addSession])

  const startTimer = useCallback(() => {
    if (timeRemaining <= 0) {
      const nextMode = timerMode === "work" ? "shortBreak" : "work"
      setTimerMode(nextMode)
      setTimeRemaining(DURATIONS[nextMode])
    }
    setTimerRunning(true)
  }, [timeRemaining, timerMode])

  const pauseTimer = useCallback(() => {
    setTimerRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setTimerRunning(false)
    setTimeRemaining(DURATIONS[timerMode])
  }, [timerMode])

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false)
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerRunning, handleSessionComplete])

  useEffect(() => {
    setTimeRemaining(DURATIONS[timerMode])
    setTimerRunning(false)
  }, [timerMode])

  function drawTimer(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return
    const size = 280
    const cx = size / 2
    const cy = size / 2
    const r = 120
    const lineW = 4

    ctx.clearRect(0, 0, size, size)

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = colors.borderLine
    ctx.lineWidth = lineW
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * timerProgress)
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = lineW
    ctx.lineCap = "round"
    ctx.stroke()

    const ticks = 60
    for (let i = 0; i < ticks; i++) {
      const angle = (i / ticks) * Math.PI * 2 - Math.PI / 2
      const inner = i % 5 === 0 ? r - 10 : r - 6
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner)
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
      ctx.strokeStyle = i % 5 === 0 ? colors.primary : colors.borderLine
      ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.8
      ctx.stroke()
    }

    const progressTicks = Math.floor(timerProgress * ticks)
    for (let i = 0; i < progressTicks; i++) {
      const angle = (i / ticks) * Math.PI * 2 - Math.PI / 2
      const inner = i % 5 === 0 ? r - 10 : r - 6
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner)
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = i % 5 === 0 ? 1.5 : 0.8
      ctx.stroke()
    }
  }

  useEffect(() => {
    drawTimer(timerCanvasRef.current?.getContext("2d") ?? null)
  }, [timerProgress, colors])

  useEffect(() => {
    drawTimer(timerViewCanvasRef.current?.getContext("2d") ?? null)
  }, [timerProgress, colors])

  return (
    <div className="app-container">
      <Scene3D />

      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <div className="logo-section">
              <MandalaPattern className="logo-mandala" ariaHidden />
              <div>
                <h1 className="logo-title">FocusFlow</h1>
                <p className="logo-subtitle">Deep Work</p>
              </div>
            </div>
          )}
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        <nav className="sidebar-nav">
          {(Object.keys(VIEW_ICONS) as View[]).map(view => (
            <button
              key={view}
              className={`nav-item ${activeView === view ? "active" : ""}`}
              onClick={() => setActiveView(view)}
              aria-label={view.charAt(0).toUpperCase() + view.slice(1)}
            >
              {VIEW_ICONS[view]}
              {sidebarOpen && <span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div aria-hidden="true"><TempleSilhouette height={40} /></div>
          </div>
        )}
      </aside>

      <div className="main-area">
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Close menu" : "Open menu"}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="page-title">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</span>
          </div>
          <div className="top-bar-center">
            <div className="theme-dots">
              {themeDots.map(id => (
                <button
                  key={id}
                  className={`theme-dot ${themeId === id ? "active" : ""}`}
                  style={{
                    background: getTheme(id).primary,
                    borderColor: themeId === id ? getTheme(id).primary : "transparent",
                  }}
                  onClick={() => setTheme(id)}
                  title={getTheme(id).name}
                />
              ))}
            </div>
          </div>
          <div className="top-bar-right">
            <button className="icon-btn" onClick={() => setShowSettings(!showSettings)} aria-label="Open settings">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <main className="content">
          {activeView === "focus" && (
            <div className="focus-view">
              <div className="section-card greeting-card">
                <div className="greeting-content">
                  <MandalaPattern className="greeting-mandala" ariaHidden />
                  <h2 className="greeting-title">Welcome to FocusFlow</h2>
                  <p className="greeting-subtitle">Your sacred space for deep work</p>
                </div>
              </div>
              <div className="section-card timer-card">
                <div className="timer-display">
                  <div className="timer-dial">
                    <canvas ref={timerCanvasRef} width={280} height={280} className="timer-canvas" role="img" aria-label={`Timer: ${formatTime(timeRemaining)}`} />
                    <div className="timer-center">
                      <span className="timer-time">{formatTime(timeRemaining)}</span>
                      <span className="timer-label">{timerMode === "work" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}</span>
                    </div>
                  </div>
                  <div className="timer-controls">
                    {!timerRunning ? (
                      <button className="btn-primary" onClick={startTimer} aria-label="Start timer">
                        <Play size={20} /> Start
                      </button>
                    ) : (
                      <button className="btn-primary" onClick={pauseTimer} aria-label="Pause timer">
                        <Pause size={20} /> Pause
                      </button>
                    )}
                    <button className="btn-ghost" onClick={resetTimer} aria-label="Reset timer">
                      <RotateCcw size={16} /> Reset
                    </button>
                  </div>
                  <div className="timer-mode-tabs" role="tablist" aria-label="Timer mode">
                    {(["work", "shortBreak", "longBreak"] as const).map(mode => (
                      <button
                        key={mode}
                        role="tab"
                        aria-selected={timerMode === mode}
                        className={`mode-tab ${timerMode === mode ? "active" : ""}`}
                        onClick={() => setTimerMode(mode)}
                      >
                        {mode === "work" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="section-card quote-card">
                <blockquote className="daily-quote">
                  "The mind is everything. What you think you become."
                  <cite>— Buddha</cite>
                </blockquote>
              </div>
            </div>
          )}

          {activeView === "timer" && (
            <div className="focus-view">
              <div className="section-card timer-card">
                <div className="timer-display">
                  <div className="timer-dial">
                    <canvas ref={timerViewCanvasRef} width={280} height={280} className="timer-canvas" role="img" aria-label={`Timer: ${formatTime(timeRemaining)}`} />
                    <div className="timer-center">
                      <span className="timer-time">{formatTime(timeRemaining)}</span>
                      <span className="timer-label">{timerMode === "work" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}</span>
                    </div>
                  </div>
                  <div className="timer-controls">
                    {!timerRunning ? (
                      <button className="btn-primary" onClick={startTimer}>
                        <Play size={20} /> Start
                      </button>
                    ) : (
                      <button className="btn-primary" onClick={pauseTimer}>
                        <Pause size={20} /> Pause
                      </button>
                    )}
                    <button className="btn-ghost" onClick={resetTimer}>
                      <RotateCcw size={16} /> Reset
                    </button>
                  </div>
                  <div className="timer-mode-tabs">
                    {(["work", "shortBreak", "longBreak"] as const).map(mode => (
                      <button
                        key={mode}
                        className={`mode-tab ${timerMode === mode ? "active" : ""}`}
                        onClick={() => setTimerMode(mode)}
                      >
                        {mode === "work" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "tasks" && (
            <div className="tasks-view">
              <div className="section-card">
                <h3 className="section-title">Daily Tasks</h3>
                <div className="task-input-row">
                  <input
                    className="task-input"
                    placeholder="Add a task..."
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && taskInput.trim()) {
                        addTask(taskInput.trim())
                        setTaskInput("")
                      }
                    }}
                  />
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => {
                      if (taskInput.trim()) {
                        addTask(taskInput.trim())
                        setTaskInput("")
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                <ul className="task-list">
                  {tasks.map(task => (
                    <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                      <button className="task-check" onClick={() => toggleTask(task.id)} aria-label={task.completed ? "Mark incomplete" : "Mark complete"}>
                        {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <span className="task-text">{task.text}</span>
                      <button className="task-delete" onClick={() => deleteTask(task.id)} aria-label={`Delete task: ${task.text}`}>
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeView === "insights" && (
            <div className="insights-view">
              <div className="section-card">
                <h3 className="section-title">Today's Focus</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{todaySessions.length}</span>
                    <span className="stat-label">Sessions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{totalFocusMinutes.toFixed(0)}m</span>
                    <span className="stat-label">Total Focus</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{sessions.length}</span>
                    <span className="stat-label">All Time</span>
                  </div>
                </div>
              </div>
              <div className="section-card">
                <h3 className="section-title">Recent Sessions</h3>
                <div className="session-list">
                  {sessions.slice(0, 10).map(s => (
                    <div key={s.id} className="session-row">
                      <span className="session-type">{s.type}</span>
                      <span className="session-dur">{Math.floor(s.duration / 60)}m</span>
                      <span className="session-time">{new Date(s.startTime).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === "breath" && (
            <div className="breath-view">
              <div className="section-card breath-card">
                <h3 className="section-title">Pranayama</h3>
                <div className="breath-circle">
                  <div className="breath-ring">
                    <MandalaPattern className="breath-mandala" ariaHidden />
                  </div>
                </div>
                <p className="breath-hint">Breathe in peace, breathe out stress</p>
              </div>
            </div>
          )}

          {activeView === "ambient" && (
            <div className="ambient-view">
              <div className="section-card">
                <div className="ambient-header">
                  <h3 className="section-title">Ambient Sounds</h3>
                  <div className="master-volume-row">
                    <label className="vol-label">Master</label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={masterVolume}
                      onChange={e => setMasterVolume(parseFloat(e.target.value))}
                      className="volume-slider"
                    />
                  </div>
                </div>
                <div className="sound-grid">
                  {sounds.map(sound => (
                    <button
                      key={sound.id}
                      className={`sound-card ${sound.playing ? "playing" : ""}`}
                      onClick={() => toggleSound(sound.id)}
                    >
                      <span className="sound-icon">{SOUND_ICONS[sound.id]}</span>
                      <span className="sound-name">{SOUND_LABELS[sound.id]}</span>
                      {sound.playing && (
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={sound.volume}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setVolume(sound.id, parseFloat(e.target.value))}
                          className="sound-volume"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={e => e.stopPropagation()}>
            <h3>Settings</h3>
            <div className="settings-section">
              <label>Theme</label>
              <div className="theme-grid">
                {themeDots.map(id => (
                  <button
                    key={id}
                    className={`theme-option ${themeId === id ? "active" : ""}`}
                    onClick={() => setTheme(id)}
                  >
                    <span
                      className="theme-swatch"
                      style={{ background: getTheme(id).primary }}
                    />
                    <span>{getTheme(id).name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="settings-section">
              <label>Master Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={masterVolume}
                onChange={e => setMasterVolume(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>
            <button className="btn-primary btn-sm" onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
