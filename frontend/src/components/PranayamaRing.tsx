"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PranayamaRing() {
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale")

  useEffect(() => {
    // 12-second loop synchronized to the framer-motion keyframes
    const interval = setInterval(() => {
      setPhase(p => {
        if (p === "Inhale") return "Hold"
        if (p === "Hold") return "Exhale"
        return "Inhale"
      })
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-ambient/80 backdrop-blur-sm rounded-full pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.3, 1.3, 1] }}
        transition={{ 
          duration: 12, 
          times: [0, 0.33, 0.66, 1], 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center shadow-[0_0_30px_var(--color-primary)]"
      >
         <AnimatePresence mode="wait">
            <motion.span 
              key={phase}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-bold tracking-widest uppercase text-sm drop-shadow-md"
            >
              {phase}
            </motion.span>
         </AnimatePresence>
      </motion.div>
    </div>
  )
}
