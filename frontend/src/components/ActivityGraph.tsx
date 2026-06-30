"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart2, ShieldAlert } from "lucide-react"

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
      .then(res => res.json())
      .then(data => setHeatmap(data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchHeatmap()
    const interval = setInterval(fetchHeatmap, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fill in the 30 days grid even if some days are missing from db
  const grid = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().split('T')[0]
    const found = heatmap.find(h => h.date.startsWith(dateStr))
    return found || { date: dateStr, focus_score: 0, sessions_completed: 0, sessions_failed: 0 }
  })

  // Color mapping similar to GitHub contributions but using FocusFlow theme
  const getOp = (score: number) => {
    if (score === 0) return "bg-ambient border border-border-line"
    if (score < 10) return "bg-primary opacity-40"
    if (score < 30) return "bg-primary opacity-60"
    if (score < 50) return "bg-primary opacity-80"
    return "bg-primary shadow-[0_0_8px_var(--color-primary)]"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="projection-card ethopic-glass rounded-2xl p-6 w-full max-w-2xl mx-auto flex flex-col mt-4 transition-colors duration-500"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 text-primary">
          <BarChart2 size={18} />
          <h2 className="font-semibold text-sm tracking-wide">30-DAY FOCUS HEATMAP</h2>
        </div>
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Score: {Math.round(grid.reduce((acc, curr) => acc + curr.focus_score, 0))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-end">
        {grid.map((day, i) => (
          <div
            key={i}
            title={`${day.date}: ${Math.round(day.focus_score)} points (${day.sessions_completed} complete, ${day.sessions_failed} failed)`}
            className={`w-4 h-4 rounded-[4px] transition-all cursor-help ${getOp(day.focus_score)} ${day.sessions_failed > 0 ? "border border-rose-500" : ""}`}
          />
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border-line flex justify-between items-center text-xs text-text-muted">
        <div className="flex items-center space-x-1.5">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-black/5 dark:bg-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-300 dark:bg-indigo-900/50"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-700/60"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-500 dark:bg-indigo-600"></div>
          <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-500"></div>
          <span>More</span>
        </div>
        <div className="flex items-center space-x-1 text-rose-500">
           <ShieldAlert size={12} />
           <span>Red borders indicate failed strict sessions</span>
        </div>
      </div>
    </motion.div>
  )
}
