"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart2, Clock } from "lucide-react"

export default function Stats() {
  const [sessions, setSessions] = useState<{ id: number, duration: number, timestamp: string }[]>([])

  const fetchSessions = () => {
    fetch("http://localhost:8000/sessions")
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchSessions()
    // Poll every 30s for updates
    const interval = setInterval(fetchSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0)
  const totalHours = (totalSeconds / 3600).toFixed(1)

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="projection-card ethopic-glass rounded-2xl p-4 w-64 transition-colors duration-500"
    >
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 mb-6 border-b border-black/5 dark:border-white/10 pb-4">
        <BarChart2 size={18} className="text-indigo-500" />
        <h2 className="font-semibold text-sm tracking-wide">FOCUS STATS</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Total Hours</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">{totalHours}</span>
            <span className="text-sm text-slate-400 font-medium">hrs</span>
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Sessions Completed</div>
           <div className="flex items-center space-x-2">
            <Clock size={16} className="text-amber-500" />
            <span className="text-2xl font-bold">{sessions.length}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
