"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "./ThemeContext"

export default function AtmosphericBackground() {
  const { theme } = useTheme()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<number>
      const intensity = typeof customEvent.detail === "number" ? customEvent.detail : 0
      setScale(1 + (intensity * 0.15))
    }
    window.addEventListener("audio-freq", handler)
    return () => window.removeEventListener("audio-freq", handler)
  }, [])

  const ambientMap: Record<string, { base: string; p1: string; p2: string; p3: string }> = {
    "deep-space": { base: "#030305", p1: "rgba(99,102,241,0.28)", p2: "rgba(6,182,212,0.18)", p3: "rgba(168,85,247,0.14)" },
    "forest-zen": { base: "#111c18", p1: "rgba(16,185,129,0.26)", p2: "rgba(34,197,94,0.2)", p3: "rgba(245,158,11,0.12)" },
    "cyberpunk": { base: "#090a0f", p1: "rgba(240,20,194,0.26)", p2: "rgba(0,240,255,0.24)", p3: "rgba(251,191,36,0.12)" },
    "vintage": { base: "#f7f3eb", p1: "rgba(180,83,9,0.2)", p2: "rgba(120,53,15,0.15)", p3: "rgba(100,116,139,0.1)" },
    "sattva": { base: "#fcf9f2", p1: "rgba(234,88,12,0.25)", p2: "rgba(217,119,6,0.2)", p3: "rgba(124,58,237,0.1)" },
  }

  const palette = ambientMap[theme] || ambientMap["deep-space"]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: palette.base }}>
      <motion.div
        animate={{ scale, opacity: 0.32 + (scale - 1) }}
        transition={{ ease: "linear", duration: 0.1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] h-[92vw] rounded-full blur-[130px]"
        style={{ background: `radial-gradient(circle, ${palette.p1} 0%, transparent 70%)` }}
      />
      <motion.div
        animate={{ scale: 1 + (scale - 1) * 0.7, x: [0, 16, 0], y: [0, -10, 0] }}
        transition={{ ease: "easeInOut", duration: 8, repeat: Infinity }}
        className="absolute -top-24 -left-20 w-[55vw] h-[55vw] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${palette.p2} 0%, transparent 72%)` }}
      />
      <motion.div
        animate={{ scale: 1 + (scale - 1) * 0.9, x: [0, -20, 0], y: [0, 12, 0] }}
        transition={{ ease: "easeInOut", duration: 10, repeat: Infinity }}
        className="absolute -bottom-28 -right-24 w-[62vw] h-[62vw] rounded-full blur-[130px]"
        style={{ background: `radial-gradient(circle, ${palette.p3} 0%, transparent 75%)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(130deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.03) 100%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  )
}
