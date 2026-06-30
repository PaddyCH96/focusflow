"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GitCommit, Clock, CheckCircle2, BookOpen } from "lucide-react"

type HistoryEvent = {
  id: number
  type: "task" | "session" | "journal"
  title: string
  timestamp: string
}

export default function Timeline() {
  const [events, setEvents] = useState<HistoryEvent[]>([])

  const fetchHistory = () => {
    fetch("http://localhost:8000/history")
      .then((res) => res.json())
      .then((data) => setEvents(data.events))
      .catch(console.error)
  }

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 30000)
    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle2 size={14} style={{ color: "var(--primary-dim)" }} />
      case "session":
        return <Clock size={14} style={{ color: "var(--primary-dim)" }} />
      case "journal":
        return <BookOpen size={14} style={{ color: "var(--primary-dim)" }} />
      default:
        return <GitCommit size={14} style={{ color: "var(--text-muted)" }} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel rounded-2xl p-6 transition-all duration-500"
    >
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border-line">
        <GitCommit size={16} style={{ color: "var(--primary-dim)" }} />
        <h2 className="heading-serif text-sm tracking-wide text-text-main">Timeline</h2>
      </div>

      <div className="space-y-0 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 relative">
        {events.length === 0 ? (
          <div className="text-center text-sm text-text-muted py-10">
            Your timeline is empty. Begin your practice.
          </div>
        ) : (
          <>
            <div className="absolute left-[7px] top-2 bottom-2 w-px"
              style={{ background: "rgba(214,185,138,0.08)" }}
            />
            <AnimatePresence>
              <div className="space-y-4">
                {events.slice(0, 20).map((event, i) => (
                  <motion.div
                    key={`${event.type}-${event.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="relative pl-7 flex flex-col"
                  >
                    <div className="absolute left-[1px] top-0.5 z-10">
                      {getIcon(event.type)}
                    </div>
                    <span className="text-xs font-medium text-text-main leading-tight mb-0.5">
                      {event.title}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--primary-dim)" }}>
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  )
}
