"use client"
import { useMemo } from "react"
import { ChevronRight, Check } from "lucide-react"
import type { Session, Task } from "@/lib/storage/types"

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]

function startOfDay(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function lastSevenDays(): Date[] {
  const today = startOfDay(new Date())
  const days: Date[] = []
  for (let i = 6; i >= 0; i--) {
    days.push(new Date(today.getTime() - i * 86400000))
  }
  return days
}

export function RightRail({
  sessions,
  tasks,
  goal,
  onCycleGoal,
  onToggleTask,
}: {
  sessions: Session[]
  tasks: Task[]
  goal: number
  onCycleGoal: () => void
  onToggleTask: (id: number) => void
}) {
  const today = useMemo(() => startOfDay(new Date()), [])

  const todaySessions = useMemo(
    () => sessions.filter(s => s.status === "completed" && startOfDay(new Date(s.timestamp)).getTime() === today.getTime()),
    [sessions, today]
  )

  const todayMinutes = useMemo(
    () => Math.round(todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60),
    [todaySessions]
  )

  const weekBars = useMemo(() => {
    const days = lastSevenDays()
    const minutesByDay = days.map(day => {
      const dayEnd = day.getTime() + 86400000
      return sessions
        .filter(s => s.status === "completed" && new Date(s.timestamp).getTime() >= day.getTime() && new Date(s.timestamp).getTime() < dayEnd)
        .reduce((acc, s) => acc + s.duration, 0) / 60
    })
    const max = Math.max(...minutesByDay, 1)
    return minutesByDay.map((m, i) => ({
      minutes: m,
      heightPct: Math.max(6, Math.round((m / max) * 100)),
      isToday: i === days.length - 1,
    }))
  }, [sessions])

  const goalProgress = Math.min(1, todaySessions.length / goal)

  return (
    <aside className="right-rail" aria-label="Focus summary">
      <div className="rail-card">
        <div className="rail-card-header">
          <span className="rail-card-label">Daily Goal</span>
          <button className="rail-arrow-btn" onClick={onCycleGoal} aria-label={`Change daily goal, currently ${goal} sessions`}>
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="daily-goal-value">{todaySessions.length} / {goal} sessions</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${goalProgress * 100}%` }} />
        </div>
      </div>

      <div className="rail-card">
        <div className="rail-card-header">
          <span className="rail-card-label">Today&apos;s Focus</span>
        </div>
        <div className="focus-minutes">
          <span className="focus-minutes-value">{todayMinutes}</span>
          <span className="focus-minutes-unit">min</span>
        </div>
        <div className="mini-bar-chart" aria-hidden="true">
          {weekBars.map((bar, i) => (
            <div className="mini-bar-col" key={i}>
              <div className={`mini-bar ${bar.isToday ? "today" : ""}`} style={{ height: `${bar.heightPct}%` }} />
            </div>
          ))}
        </div>
        <div className="mini-bar-labels">
          {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      <div className="rail-card">
        <div className="rail-card-header">
          <span className="rail-card-label">Completed Tasks</span>
        </div>
        {tasks.length === 0 ? (
          <p className="rail-empty">No tasks yet — add one from the Tasks view.</p>
        ) : (
          <div className="mini-task-list">
            {tasks.slice(0, 6).map(task => (
              <button
                key={task.id}
                className="mini-task-row"
                onClick={() => onToggleTask(task.id)}
                aria-pressed={task.completed}
              >
                <span className={`mini-task-check ${task.completed ? "checked" : ""}`}>
                  {task.completed && <Check size={11} strokeWidth={3} />}
                </span>
                <span>{task.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
