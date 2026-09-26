"use client"
import { useMemo } from "react"
import { useHeatmap } from "@/lib/hooks/useHeatmap"
import type { Session } from "@/lib/storage/types"

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString()
}

function heatmapColor(score: number, max: number): string {
  if (max <= 0) return "var(--panel-hover)"
  const intensity = Math.min(1, score / max)
  return `color-mix(in srgb, var(--primary) ${Math.round(intensity * 90)}%, var(--panel-hover))`
}

export function StatsView({ sessions }: { sessions: Session[] }) {
  const { days, isLoading: heatmapLoading } = useHeatmap()

  const completedSessions = useMemo(() => sessions.filter(s => s.status === "completed"), [sessions])

  const totalFocusMinutes = useMemo(
    () => completedSessions.reduce((a, s) => a + s.duration, 0) / 60,
    [completedSessions]
  )

  const todaySessions = useMemo(
    () => completedSessions.filter(s => isToday(s.timestamp)),
    [completedSessions]
  )

  const maxScore = useMemo(() => Math.max(0, ...days.map(d => d.focus_score)), [days])

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
            <span className="stat-value">{completedSessions.length}</span>
            <span className="stat-label">All Time</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title">30-Day Heatmap</h3>
        <p className="section-subtitle">Focus score blends completion rate with strict-mode penalties.</p>
        {heatmapLoading ? (
          <p className="empty-hint">Loading heatmap…</p>
        ) : days.length === 0 ? (
          <p className="empty-hint">No session data in the last 30 days yet.</p>
        ) : (
          <div className="heatmap-grid">
            {days.map(day => (
              <div
                key={day.date}
                className="heatmap-cell"
                style={{ background: heatmapColor(day.focus_score, maxScore) }}
                title={`${day.date}: score ${day.focus_score} (${day.sessions_completed} completed, ${day.sessions_failed} failed)`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="section-card">
        <h3 className="section-title">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <p className="empty-hint">No sessions yet. Complete a focus session to see it here.</p>
        ) : (
          <div className="session-list">
            {sessions.slice(0, 10).map(s => (
              <div key={s.id} className="session-row">
                <span className={`session-type ${s.status === "failed" ? "failed" : ""}`}>
                  {s.status === "completed" ? "Completed" : "Skipped"}
                </span>
                <span className="session-dur">{Math.floor(s.duration / 60)}m</span>
                <span className="session-time">{new Date(s.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
