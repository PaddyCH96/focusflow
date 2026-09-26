"use client"
import { useMemo } from "react"
import { History, Plus, Menu } from "lucide-react"

const QUOTES = [
  "Discipline is the bridge between goals and accomplishment.",
  "The mind is everything. What you think you become.",
  "Small daily improvements are the key to staggering long-term results.",
  "Stillness is where creativity and solutions to problems are found.",
  "Focus on being productive instead of busy.",
]

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

export function TopBar({
  onOpenHistory,
  onQuickAdd,
  onOpenMobileMenu,
}: {
  onOpenHistory: () => void
  onQuickAdd: () => void
  onOpenMobileMenu: () => void
}) {
  const quote = useMemo(() => QUOTES[dayOfYear() % QUOTES.length], [])

  return (
    <header className="topbar">
      <button className="icon-btn topbar-menu-btn" onClick={onOpenMobileMenu} aria-label="Open menu">
        <Menu size={18} />
      </button>
      <div className="topbar-greeting">
        <h1>Namaste, Focus Seeker</h1>
        <p className="topbar-quote">&ldquo;{quote}&rdquo;</p>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" onClick={onOpenHistory} aria-label="View session history">
          <History size={17} />
        </button>
        <button className="icon-btn" onClick={onQuickAdd} aria-label="Add a task">
          <Plus size={17} />
        </button>
      </div>
    </header>
  )
}
