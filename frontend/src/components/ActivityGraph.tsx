"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart2 } from "lucide-react"

type HeatmapDay = {
  date: string
  focus_score: number
  sessions_completed: number
  sessions_failed: number
}

export default function ActivityGraph() {
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([])

  const fetchHeatmap = () => {
    fetch("http://localhost:8000/analytics/heatmap")
      .then((res) => res.json())
      .then((data) => setHeatmap(data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchHeatmap()
    const interval = setInterval(fetchHeatmap, 30000)
    return () => clearInterval(interval)
  }, [])

  const grid = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().split("T")[0]
    const found = heatmap.find((h) => h.date.startsWith(dateStr))
    return found || { date: dateStr, focus_score: 0, sessions_completed: 0, sessions_failed: 0 }
  })

  const getOpacity = (score: number) => {
    if (score === 0) return "rgba(59,54,50,0.15)"
    if (score < 10) return "rgba(214,185,138,0.2)"
    if (score < 30) return "rgba(214,185,138,0.35)"
    if (score < 50) return "rgba(214,185,138,0.5)"
    return "rgba(214,185,138,0.7)"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-line">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} style={{ color: "var(--primary-dim)" }} />
          <h2 className="heading-serif text-sm tracking-wide text-text-main">30-Day Heatmap</h2>
        </div>
        <span className="text-xs" style={{ color: "var(--primary-dim)" }}>
          {Math.round(grid.reduce((acc, curr) => acc + curr.focus_score, 0))} total
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {grid.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            title={`${day.date}: ${Math.round(day.focus_score)} pts`}
            className="w-3 h-3 rounded-sm transition-all duration-200 cursor-help"
            style={{
              background: getOpacity(day.focus_score),
              border: day.sessions_failed > 0
                ? "1px solid rgba(214,185,138,0.3)"
                : "1px solid rgba(59,54,50,0.2)",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border-line">
        <span className="text-[10px] text-text-muted">Less</span>
        {[0.15, 0.2, 0.35, 0.5, 0.7].map((op, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: `rgba(214,185,138,${op})` }}
          />
        ))}
        <span className="text-[10px] text-text-muted">More</span>
      </div>
    </motion.div>
  )
}
