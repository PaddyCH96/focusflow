"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Plus } from "lucide-react"
import { useTheme } from "@/components/ThemeContext"
import Timer from "@/components/Timer"
import Sidebar from "@/components/Sidebar"
import Stats from "@/components/Stats"
import TaskList from "@/components/TaskList"
import WisdomPanel from "@/components/WisdomPanel"
import ActivityGraph from "@/components/ActivityGraph"
import Timeline from "@/components/Timeline"
import AudioPlayer from "@/components/AudioPlayer"
import AtmosphericBackground from "@/components/AtmosphericBackground"
import PranayamaRing from "@/components/PranayamaRing"
import VoiceNotes from "@/components/VoiceNotes"
import Whiteboard from "@/components/Whiteboard"

type View = "focus" | "tasks" | "insights" | "breath" | "ambient"

function FocusView({
  mode,
  setMode,
  strictMode,
  timerType,
  setTimerType,
}: {
  mode: "work" | "shortBreak" | "longBreak"
  setMode: (m: "work" | "shortBreak" | "longBreak") => void
  strictMode: boolean
  timerType: "pomodoro" | "flowmodoro"
  setTimerType: (t: "pomodoro" | "flowmodoro") => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0">
      <Timer
        mode={mode}
        setMode={setMode}
        strictMode={strictMode}
        timerType={timerType}
        setTimerType={setTimerType}
      />

      {/* Bottom progress cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex items-stretch gap-3 mt-6 max-w-2xl w-full px-4"
      >
        <div className="flex-1 min-w-0">
          <Stats />
        </div>
        <div className="flex-[2] min-w-0">
          <WisdomPanel />
        </div>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const { theme } = useTheme()
  const [activeView, setActiveView] = useState<View>("focus")
  const [strictMode, setStrictMode] = useState(false)
  const [timerType, setTimerType] = useState<"pomodoro" | "flowmodoro">("pomodoro")
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [workspace, setWorkspace] = useState<"dashboard" | "voice" | "whiteboard">("dashboard")

  return (
    <main className="flex-1 flex min-h-screen relative">
      <AtmosphericBackground />

      {/* Left sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col items-center border-r border-border-line/50"
        style={{
          width: "72px",
          background: "linear-gradient(180deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.7) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </aside>

      {/* Header bar (top right area) */}
      <header className="fixed top-0 right-0 left-[72px] z-30 flex items-center justify-between px-8 py-4"
        style={{
          background: "linear-gradient(180deg, rgba(11,11,11,0.6) 0%, transparent 100%)",
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="heading-serif text-lg text-text-main/60"
        >
          {activeView === "focus" && "Deep Work"}
          {activeView === "tasks" && "Practice"}
          {activeView === "insights" && "Reflect"}
          {activeView === "breath" && "Pranayama"}
          {activeView === "ambient" && "Soundscape"}
        </motion.span>

        <div className="flex items-center gap-3">
          {/* Workspace switcher */}
          <div className="flex items-center gap-1 px-1.5 py-1 rounded-full glass-panel-light">
            <button
              onClick={() => setWorkspace("dashboard")}
              className={`px-3 py-1.5 text-[10px] font-medium rounded-full transition-all duration-300 tracking-wider uppercase ${
                workspace === "dashboard"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setWorkspace("voice")}
              className={`px-3 py-1.5 text-[10px] font-medium rounded-full transition-all duration-300 tracking-wider uppercase ${
                workspace === "voice"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Vani
            </button>
            <button
              onClick={() => setWorkspace("whiteboard")}
              className={`px-3 py-1.5 text-[10px] font-medium rounded-full transition-all duration-300 tracking-wider uppercase ${
                workspace === "whiteboard"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Mandala
            </button>
          </div>

          <div className="w-px h-6 bg-border-line" />

          {/* Strict mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStrictMode(!strictMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              color: strictMode ? "var(--primary)" : "var(--text-muted)",
              background: strictMode ? "rgba(214,185,138,0.08)" : "transparent",
              border: strictMode ? "1px solid rgba(214,185,138,0.2)" : "1px solid transparent",
            }}
          >
            <Shield size={14} />
            <span>Strict</span>
          </motion.button>

          {/* Ambient controls */}
          <AudioPlayer mode={mode} />
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 ml-[72px] pt-20 pb-8 px-6 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {workspace === "dashboard" ? (
            <motion.div
              key={workspace}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center min-h-0"
            >
              <AnimatePresence mode="wait">
                {activeView === "focus" && (
                  <motion.div
                    key="focus"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full flex flex-col items-center"
                  >
                    <FocusView
                      mode={mode}
                      setMode={setMode}
                      strictMode={strictMode}
                      timerType={timerType}
                      setTimerType={setTimerType}
                    />
                  </motion.div>
                )}

                {activeView === "tasks" && (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-lg mx-auto pt-8"
                  >
                    <TaskList />
                  </motion.div>
                )}

                {activeView === "insights" && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-3xl mx-auto pt-8 space-y-6"
                  >
                    <ActivityGraph />
                    <Timeline />
                  </motion.div>
                )}

                {activeView === "breath" && (
                  <motion.div
                    key="breath"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-lg mx-auto pt-16 flex flex-col items-center"
                  >
                    <div className="text-center mb-8">
                      <h2 className="heading-serif text-2xl text-text-main mb-2">Pranayama</h2>
                      <p className="text-sm text-text-muted">4-4-4 breathing cycle</p>
                    </div>
                    <div className="relative w-[300px] h-[300px] stone-surface rounded-full flex items-center justify-center shadow-2xl"
                      style={{
                        boxShadow: "inset 0 2px 4px rgba(214,185,138,0.08), inset 0 -2px 4px rgba(0,0,0,0.4), 0 20px 60px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="absolute inset-[6px] rounded-full stone-surface-light" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PranayamaRing standalone />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeView === "ambient" && (
                  <motion.div
                    key="ambient"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-md mx-auto pt-16"
                  >
                    <div className="text-center mb-10">
                      <h2 className="heading-serif text-2xl text-text-main mb-2">Soundscape</h2>
                      <p className="text-sm text-text-muted">Ambient audio for deep focus</p>
                    </div>
                    <AudioPlayer mode={mode} expanded />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : workspace === "voice" ? (
            <motion.div
              key="voice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-3xl mx-auto pt-8"
            >
              <VoiceNotes />
            </motion.div>
          ) : (
            <motion.div
              key="whiteboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full min-h-[70vh] pt-8"
            >
              <Whiteboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating quick task button */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 rounded-full gold-glow transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(214,185,138,0.2), rgba(214,185,138,0.08))",
            border: "1px solid rgba(214,185,138,0.2)",
            color: "var(--primary)",
          }}
          onClick={() => setActiveView("tasks")}
          title="Quick Task"
        >
          <Plus size={20} />
        </motion.button>
      </div>
    </main>
  )
}
