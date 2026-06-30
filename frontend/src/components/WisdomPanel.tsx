"use client"
import { useMemo } from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const WISDOM_DATA = [
  { type: "Pranayama", text: "Practice Nadi Shodhana (Alternate Nostril Breathing) for 2 mins to balance the brain hemispheres before deep work." },
  { type: "Trataka", text: "Keep your gaze fixed on the timer ring. This is a form of Trataka, or candle-gazing, to brutally sharpen mental concentration." },
  { type: "Ayurveda", text: "Sip warm water or Brahmi tea to sustain cognitive endurance and clear mental 'ama' (toxins) during long study blocks." },
  { type: "Pranayama", text: "If anxiety spikes, execute a 4-7-8 breathing rhythm. Extended exhales physically force the parasympathetic nervous system into deep calm." },
  { type: "Dharana", text: "Dharana is the binding of the mind to one place, object, or idea. Let this timer be your sole anchor to reality." },
  { type: "Sutra", text: "Yoga Sutra 1.2: 'Yogas chitta vritti nirodhah' - Yoga is the stilling of the fluctuations of the mind." },
  { type: "Gita", text: "Bhagavad Gita 6.19: 'As a lamp in a windless place does not flicker, so the disciplined mind remains steady in meditation.'" },
  { type: "Trataka", text: "When distracted, do not move your eyes. Physical eye stillness directly correlates to neural calmness." },
  { type: "Ayurveda", text: "Avoid heavy meals before a long FocusFlow block. Digestion draws vast amounts of blood away from the prefrontal cortex." },
  { type: "Dhyana", text: "Recognize the gap between the thought to check your phone, and the physical action. In that gap lies total freedom." }
]

const getWisdomReadState = () => {
  if (typeof window === "undefined") {
    return {
      insight: WISDOM_DATA[0],
      level: "Novice 🕯️",
    }
  }

  const random = WISDOM_DATA[Math.floor(Math.random() * WISDOM_DATA.length)]
  const currentReads = parseInt(localStorage.getItem("focusflow-wisdom-reads") || "0", 10)
  const newReads = currentReads + 1
  localStorage.setItem("focusflow-wisdom-reads", newReads.toString())

  let level = "Novice 🕯️"
  if (newReads > 15) level = "Sage 🪷"
  else if (newReads > 5) level = "Seeker 👁️"

  return { insight: random, level }
}

export default function WisdomPanel() {
  const { insight, level } = useMemo(() => getWisdomReadState(), [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="projection-card ethopic-glass rounded-2xl p-5 w-full max-w-2xl mx-auto flex flex-col mt-4 transition-colors duration-500 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles size={64} className="text-primary" />
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2 text-primary">
          <BookOpen size={18} />
          <h2 className="font-semibold text-sm tracking-wide">VEDIC WISDOM ENGINE</h2>
        </div>
        <div className="text-xs font-semibold px-2 py-1 bg-ambient rounded-md border border-border-line text-text-muted flex items-center space-x-1">
          <span>Level: {level}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-2">
        <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{insight.type} Insight</span>
        <p className="text-sm font-medium text-text-main leading-relaxed italic">
          &ldquo;{insight.text}&rdquo;
        </p>
      </div>
    </motion.div>
  )
}
