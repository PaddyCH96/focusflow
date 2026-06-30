"use client"
import { motion } from "framer-motion"
import {
  Timer,
  CheckSquare,
  BarChart3,
  Wind,
  Volume2,
} from "lucide-react"

type View = "focus" | "tasks" | "insights" | "breath" | "ambient"

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "focus", label: "Focus", icon: <Timer size={20} /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={20} /> },
  { id: "insights", label: "Insights", icon: <BarChart3 size={20} /> },
  { id: "breath", label: "Breath", icon: <Wind size={20} /> },
  { id: "ambient", label: "Ambient", icon: <Volume2 size={20} /> },
]

export default function Sidebar({
  activeView,
  onViewChange,
}: {
  activeView: View
  onViewChange: (v: View) => void
}) {
  return (
    <nav className="flex flex-col items-center gap-6 py-8 px-3">
      {/* Brand mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>

      {/* Nav items */}
      <div className="flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item, i) => {
          const isActive = activeView === item.id
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => onViewChange(item.id)}
              className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
              style={{
                background: isActive
                  ? "rgba(214, 185, 138, 0.1)"
                  : "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-highlight"
                  className="absolute inset-0 rounded-xl border border-primary/20"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(214,185,138,0.08) 0%, transparent 100%)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className="relative z-10 transition-colors duration-300"
                style={{
                  color: isActive
                    ? "var(--primary)"
                    : "var(--text-muted)",
                }}
              >
                {item.icon}
              </span>

              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap text-xs"
                style={{
                  background: "var(--stone-mid)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-line)",
                }}
              >
                {item.label}
              </div>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
