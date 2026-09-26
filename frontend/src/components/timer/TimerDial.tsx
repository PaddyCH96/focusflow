"use client"
import { useId } from "react"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"
import type { TimerState } from "@/lib/storage/types"

const MODE_LABEL: Record<TimerState["mode"], string> = {
  work: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
}

export function TimerDial({
  mode,
  timeFormatted,
  progress,
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
  onSetMode,
}: {
  mode: TimerState["mode"]
  timeFormatted: string
  progress: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  onSetMode: (mode: TimerState["mode"]) => void
}) {
  const gradientId = useId()
  const size = 200
  const r = 88
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div>
      <div className="timer-ring-wrap">
        <svg className="timer-ring-svg" width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-light)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--primary)" strokeOpacity={0.18} strokeWidth={8} />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="timer-ring-center">
          <span className="timer-ring-label">{MODE_LABEL[mode]}</span>
          <span className="timer-ring-time" role="timer" aria-live="polite">{timeFormatted}</span>
          {isRunning ? (
            <button className="timer-start-btn" onClick={onPause} aria-label="Pause timer">
              <Pause size={16} /> Pause
            </button>
          ) : (
            <button className="timer-start-btn" onClick={onStart} aria-label="Start timer">
              <Play size={16} /> Start
            </button>
          )}
        </div>
      </div>

      <div className="timer-icon-controls">
        <button className="timer-icon-btn" onClick={onReset} aria-label="Reset timer">
          <RotateCcw size={16} />
        </button>
        <button className="timer-icon-btn" onClick={onSkip} aria-label="Skip to next session">
          <SkipForward size={16} />
        </button>
      </div>

      <div className="timer-mode-tabs" role="tablist" aria-label="Timer mode">
        {(["work", "shortBreak", "longBreak"] as const).map(m => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            className={`mode-tab ${mode === m ? "active" : ""}`}
            onClick={() => onSetMode(m)}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>
    </div>
  )
}
