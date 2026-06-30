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
      .then(res => res.json())
      .then(data => setEvents(data.events))
      .catch(console.error)
  }

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 30000) // Poll for updates
    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: string) => {
    switch(type) {
      case "task": return <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-500/20" />
      case "session": return <Clock size={16} className="text-amber-500 fill-amber-500/20" />
      case "journal": return <BookOpen size={16} className="text-purple-500 fill-purple-500/20" />
      default: return <GitCommit size={16} className="text-zinc-500" />
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="projection-card ethopic-glass rounded-2xl p-6 w-64 h-[400px] flex flex-col"
    >
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 mb-6 border-b border-black/5 dark:border-white/10 pb-4 shrink-0">
        <GitCommit size={18} className="text-indigo-500" />
        <h2 className="font-semibold text-sm tracking-wide">OBSIDIAN GRAPH</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        {events.length === 0 ? (
           <div className="text-center text-sm font-medium text-slate-400 mt-10">
             Your graph is empty. Start focusing!
           </div>
        ) : (
           <div className="absolute left-[11px] top-2 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
        )}
        
        <AnimatePresence>
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div
                key={`${event.type}-${event.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-8 flex flex-col"
              >
                {/* Node on the timeline */}
                <div className="absolute left-[3px] top-0.5 bg-white dark:bg-zinc-900 z-10">
                  {getIcon(event.type)}
                </div>

                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight mb-1">
                  {event.title}
                </div>
                
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
