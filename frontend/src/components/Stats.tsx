"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Sparkles } from "lucide-react"

export default function Stats() {
  const [sessions, setSessions] = useState<{ id: number; duration: number; timestamp: string }[]>([])
  const [streak, setStreak] = useState(0)

  const fetchSessions = () => {
    fetch("http://localhost:8000/sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data)
        // Calculate streak from completed sessions today
        const today = new Date().toDateString()
        const todaySessions = data.filter(
          (s: any) => new Date(s.timestamp).toDateString() === today
        )
        setStreak(todaySessions.length)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.round(totalSeconds / 60)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-4 transition-all duration-500 h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} style={{ color: "var(--primary-dim)" }} />
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--primary-dim)" }}>
          Today
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="heading-serif text-2xl text-text-main">{totalMinutes}</span>
        <span className="text-xs text-text-muted">min focused</span>
      </div>
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-line">
        <Sparkles size={12} style={{ color: "var(--primary-dim)" }} />
        <span className="text-xs text-text-muted">
          {streak > 0 ? `${streak} session${streak !== 1 ? "s" : ""} today` : "No sessions yet"}
        </span>
      </div>
    </motion.div>
  )
}
