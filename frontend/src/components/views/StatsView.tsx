"use client"
import { useMemo } from "react"
import type { Session } from "@/lib/storage/types"

export function StatsView({ sessions }: { sessions: Session[] }) {
  const totalFocusMinutes = useMemo(
    () => sessions.filter(s => s.type === "work").reduce((a, s) => a + s.duration, 0) / 60,
    [sessions]
  )

  const todaySessions = useMemo(
    () => sessions.filter(s => new Date(s.startTime).toDateString() === new Date().toDateString()),
    [sessions]
  )

  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Today&apos;s Focus</h3>
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
        {sessions.length === 0 ? (
          <p className="empty-hint">No sessions yet. Complete a focus session to see it here.</p>
        ) : (
          <div className="session-list">
            {sessions.slice(0, 10).map(s => (
              <div key={s.id} className="session-row">
                <span className="session-type">{s.type === "work" ? "Focus" : s.type === "shortBreak" ? "Short Break" : "Long Break"}</span>
                <span className="session-dur">{Math.floor(s.duration / 60)}m</span>
                <span className="session-time">{new Date(s.startTime).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
