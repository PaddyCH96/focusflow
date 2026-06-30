"use client"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

const WISDOM_DATA = [
  { type: "Pranayama", text: "Practice Nadi Shodhana for 2 minutes to balance the brain hemispheres before deep work." },
  { type: "Trataka", text: "Keep your gaze fixed on the timer ring. This sharpens mental concentration." },
  { type: "Ayurveda", text: "Sip warm water or Brahmi tea to sustain cognitive endurance during long study blocks." },
  { type: "Dharana", text: "Dharana is the binding of the mind to one place. Let this timer be your anchor." },
  { type: "Sutra", text: "Yoga Sutra 1.2: Yoga is the stilling of the fluctuations of the mind." },
  { type: "Gita", text: "As a lamp in a windless place does not flicker, so the disciplined mind remains steady." },
  { type: "Dhyana", text: "In the gap between thought and action lies total freedom." },
]

export default function WisdomPanel() {
  const insight = useMemo(
    () => WISDOM_DATA[Math.floor(Math.random() * WISDOM_DATA.length)],
    []
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel rounded-2xl p-4 transition-all duration-500 h-full flex flex-col justify-center"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={14} style={{ color: "var(--primary-dim)" }} />
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--primary-dim)" }}>
          Wisdom
        </span>
        <span className="text-[9px] uppercase tracking-wider ml-auto px-1.5 py-0.5 rounded"
          style={{
            color: "var(--primary-dim)",
            background: "rgba(214,185,138,0.06)",
          }}
        >
          {insight.type}
        </span>
      </div>
      <p className="text-sm text-text-main/80 leading-relaxed italic">
        &ldquo;{insight.text}&rdquo;
      </p>
    </motion.div>
  )
}
