"use client"
import { useState } from "react"

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function JournalView({
  entries,
  onAddEntry,
  isLoading,
  error,
}: {
  entries: { id: number; text: string; timestamp: string }[]
  onAddEntry: (text: string) => void
  isLoading: boolean
  error: string | null
}) {
  const [draft, setDraft] = useState("")

  const submit = () => {
    if (draft.trim()) {
      onAddEntry(draft.trim())
      setDraft("")
    }
  }

  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Journal</h3>
        <p className="section-subtitle">A quiet place for daily reflection.</p>
        {error && <p className="api-error">{error}</p>}
        <textarea
          className="journal-textarea"
          placeholder="What's on your mind today?"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit()
          }}
          rows={4}
        />
        <div className="journal-actions">
          <span className="section-subtitle" style={{ margin: 0 }}>⌘/Ctrl + Enter to save</span>
          <button className="btn-primary" onClick={submit} disabled={!draft.trim()}>Save Entry</button>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title">Past Entries</h3>
        {isLoading ? (
          <p className="empty-hint">Loading entries…</p>
        ) : entries.length === 0 ? (
          <p className="empty-hint">No entries yet. Write your first reflection above.</p>
        ) : (
          <ul className="journal-list">
            {entries.map(entry => (
              <li key={entry.id} className="journal-entry">
                <span className="journal-entry-time">{formatTimestamp(entry.timestamp)}</span>
                <p className="journal-entry-text">{entry.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
