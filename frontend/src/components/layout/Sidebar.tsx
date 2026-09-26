"use client"
import { Timer, ListChecks, Volume2, BarChart3, Palette, Settings, ChevronLeft, ChevronRight, BookOpen, Mic, PenTool } from "lucide-react"
import type { View } from "@/lib/storage/types"

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "timer", label: "Timer", icon: <Timer size={18} /> },
  { id: "tasks", label: "Tasks", icon: <ListChecks size={18} /> },
  { id: "sounds", label: "Sounds", icon: <Volume2 size={18} /> },
  { id: "stats", label: "Stats", icon: <BarChart3 size={18} /> },
  { id: "journal", label: "Journal", icon: <BookOpen size={18} /> },
  { id: "voiceNotes", label: "Voice Notes", icon: <Mic size={18} /> },
  { id: "whiteboard", label: "Whiteboard", icon: <PenTool size={18} /> },
  { id: "themes", label: "Themes", icon: <Palette size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
]

export function Sidebar({
  activeView,
  onSelectView,
  expanded,
  onToggleExpanded,
  mobileOpen,
  onCloseMobile,
}: {
  activeView: View
  onSelectView: (v: View) => void
  expanded: boolean
  onToggleExpanded: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} aria-hidden="true" />}
      <aside className={`sidebar ${expanded ? "" : "collapsed"} ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-badge" aria-hidden="true">ॐ</div>
          <div className="brand-text">
            <div className="brand-title">Focus Flow</div>
            <div className="brand-tagline">Deep Work</div>
          </div>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => {
                onSelectView(item.id)
                onCloseMobile()
              }}
              aria-current={activeView === item.id ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          className="sidebar-toggle"
          onClick={onToggleExpanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          <span>Collapse</span>
        </button>
      </aside>
    </>
  )
}
