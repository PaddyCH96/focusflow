"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Send } from "lucide-react"

export default function Journal({ mode }: { mode: "work" | "short_break" | "long_break" }) {
  const [entry, setEntry] = useState("")
  const [saved, setSaved] = useState(false)

  const saveJournal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry.trim()) return
    const res = await fetch("http://localhost:8000/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: entry })
    })
    if (res.ok) {
      setEntry("")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  // Only render during long breaks
  if (mode !== "long_break") return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm w-full max-w-md"
      >
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 mb-4 border-b border-black/5 dark:border-white/10 pb-4">
          <BookOpen size={18} className="text-purple-500" />
          <h2 className="font-semibold text-sm tracking-wide">SESSION JOURNAL</h2>
        </div>

        {saved ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-6 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3">
              <BookOpen size={24} />
            </div>
            Journal entry saved securely to your local database. Great work!
          </motion.div>
        ) : (
          <form onSubmit={saveJournal} className="relative">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Reflect on your focus session. What did you accomplish? Any roadblocks?"
              className="w-full h-32 bg-black/5 dark:bg-white/5 border border-transparent focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm outline-none transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none custom-scrollbar"
            />
            <button 
              type="submit" 
              disabled={!entry.trim()}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-lg"
            >
              <Send size={16} className="translate-x-0.5 -translate-y-0.5" />
            </button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
