"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PranayamaRing({ standalone }: { standalone?: boolean }) {
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale")

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => {
        if (p === "Inhale") return "Hold"
        if (p === "Hold") return "Exhale"
        return "Inhale"
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (standalone) {
    return (
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1.25, 1] }}
          transition={{
            duration: 12,
            times: [0, 0.33, 0.66, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-48 h-48 rounded-full flex items-center justify-center"
          style={{
            border: "2px solid rgba(214,185,138,0.2)",
            boxShadow: "0 0 30px rgba(214,185,138,0.1)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: "var(--primary-dim)" }}
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        <div className="flex gap-2 mt-4">
          {["Inhale", "Hold", "Exhale"].map((p) => (
            <div
              key={p}
              className="text-[9px] uppercase tracking-wider px-2 py-1 rounded-full transition-all duration-500"
              style={{
                color: phase === p ? "var(--primary)" : "var(--text-muted)",
                background: phase === p ? "rgba(214,185,138,0.1)" : "transparent",
                border: phase === p
                  ? "1px solid rgba(214,185,138,0.2)"
                  : "1px solid transparent",
              }}
            >
              {p} 4s
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.2, 1.2, 1] }}
        transition={{
          duration: 12,
          times: [0, 0.33, 0.66, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-40 h-40 rounded-full flex items-center justify-center"
        style={{
          border: "1px solid rgba(214,185,138,0.15)",
          boxShadow: "0 0 20px rgba(214,185,138,0.08)",
          background: "rgba(11,11,11,0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ color: "var(--primary-dim)" }}
          >
            {phase}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
