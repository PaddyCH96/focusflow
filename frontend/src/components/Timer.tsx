"use client"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Brain, Coffee, BatteryCharging, AlertCircle, TrendingUp, Circle, Flame } from "lucide-react"
import { useTheme } from "./ThemeContext"
import PranayamaRing from "./PranayamaRing"

type TimerProps = {
  mode: "work" | "shortBreak" | "longBreak"
  setMode: (m: "work" | "shortBreak" | "longBreak") => void
  strictMode: boolean
  timerType: "pomodoro" | "flowmodoro"
  setTimerType: (t: "pomodoro" | "flowmodoro") => void
}

const MODES = {
  work: { id: "work", time: 25 * 60, icon: <Brain size={16} />, label: "Focus" },
  shortBreak: { id: "shortBreak", time: 5 * 60, icon: <Coffee size={16} />, label: "Short Break" },
  longBreak: { id: "longBreak", time: 15 * 60, icon: <BatteryCharging size={16} />, label: "Long Break" }
} as const

export default function Timer({ mode, setMode, strictMode, timerType, setTimerType }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timeElapsed, setTimeElapsed] = useState(0) // Used strictly for Flowmodoro "work"

  const [isActive, setIsActive] = useState(false)
  const [cycle, setCycle] = useState(0)
  const [audioScale, setAudioScale] = useState(1)
  const [failedSession, setFailedSession] = useState(false)
  const { theme } = useTheme()
  const isSattva = theme === "sattva"

  const logSession = useCallback(async (duration: number, status: string) => {
    await fetch("http://localhost:8000/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration, status })
    })
  }, [])

  const switchMode = useCallback((newMode: "work" | "shortBreak" | "longBreak") => {
    setIsActive(false)
    setMode(newMode)
    setTimeLeft(MODES[newMode].time)
    setTimeElapsed(0)
  }, [setMode])

  const handleSessionComplete = useCallback(() => {
    setIsActive(false)
    if (mode === "work") {
      logSession(25 * 60, "completed")
      const newCycle = cycle + 1
      setCycle(newCycle)
      if (newCycle % 4 === 0) switchMode("longBreak")
      else switchMode("shortBreak")
    } else {
      switchMode("work")
    }
  }, [mode, cycle, logSession, switchMode])

  const engageFlowBreak = () => {
    setIsActive(false)
    logSession(timeElapsed, "completed")

    // Break = Work / 5. (Using floor, min 1 minute)
    let breakSeconds = Math.floor(timeElapsed / 5)
    if (breakSeconds < 60) breakSeconds = 60

    setCycle(cycle + 1)
    setMode("shortBreak")
    setTimeLeft(breakSeconds)
    setTimeElapsed(0)
  }

  const toggleTimerType = (t: "pomodoro" | "flowmodoro") => {
    if (isActive) return
    setTimerType(t)
    switchMode("work")
  }

  const toggleTimer = () => {
    if (strictMode && mode === "work" && isActive) {
      const duration = timerType === "flowmodoro" ? timeElapsed : (25 * 60) - timeLeft
      if (duration < 60) {
        setIsActive(false) // Safe pause if < 1 minute
        return
      }

      const confirmFail = window.confirm("Strict Mode Penalty: Pausing now will log a failed session. Proceed?")
      if (!confirmFail) return

      setFailedSession(true)
      logSession(duration, "failed")
      setTimeout(() => setFailedSession(false), 3000)
      switchMode("work")
      return
    }
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(MODES[mode].time)
    setTimeElapsed(0)
  }

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<number>
      const intensity = typeof customEvent.detail === "number" ? customEvent.detail : 0
      setAudioScale(1 + (intensity * 0.08)) // Pulse tightly mapped to aesthetic themes
    }
    window.addEventListener("audio-freq", handler)
    return () => window.removeEventListener("audio-freq", handler)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let completionTimeout: ReturnType<typeof setTimeout> | undefined
    if (isActive) {
      if (timerType === "flowmodoro" && mode === "work") {
        interval = setInterval(() => setTimeElapsed(t => t + 1), 1000)
      } else {
        if (timeLeft > 0) interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
        else if (timeLeft === 0) completionTimeout = setTimeout(() => handleSessionComplete(), 0)
      }
    }
    return () => {
      clearInterval(interval)
      if (completionTimeout) clearTimeout(completionTimeout)
    }
  }, [isActive, timeLeft, timerType, mode, handleSessionComplete])

  useEffect(() => {
    if (strictMode && isActive && mode === "work") {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = "Strict Mode active."
      }
      const handleUnload = () => {
        const duration = timerType === "flowmodoro" ? timeElapsed : (25 * 60) - timeLeft
        if (duration > 60) {
          navigator.sendBeacon("http://localhost:8000/sessions", JSON.stringify({ duration, status: "failed" }))
        }
      }
      window.addEventListener("beforeunload", handleBeforeUnload)
      window.addEventListener("unload", handleUnload)
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        window.removeEventListener("unload", handleUnload)
      }
    }
  }, [strictMode, isActive, mode, timeLeft, timerType, timeElapsed])

  // Calculate rendering variables
  const isFlowWork = timerType === "flowmodoro" && mode === "work"
  const currentRenderTime = isFlowWork ? timeElapsed : timeLeft
  const progress = isFlowWork ? (1) : (1 - (timeLeft / MODES[mode].time)) // Flowmodoro shows solid ring

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence>
        {failedSession && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-12 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
            <AlertCircle size={14} /> <span>Session Failed (Strict Mode)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Type Toggle */}
      <div className="flex space-x-1 p-1 rounded-full mb-6 border border-border-line bg-surface/50">
        <button onClick={() => toggleTimerType("pomodoro")} className={`px-4 py-1.5 text-xs font-semibold rounded-full flex items-center space-x-1 transition-all ${timerType === 'pomodoro' ? 'bg-primary text-white shadow' : 'text-text-muted hover:text-text-main'}`}>
          <Circle size={12} fill="currentColor" /> <span>Pomodoro</span>
        </button>
        <button onClick={() => toggleTimerType("flowmodoro")} className={`px-4 py-1.5 text-xs font-semibold rounded-full flex items-center space-x-1 transition-all ${timerType === 'flowmodoro' ? 'bg-primary text-white shadow' : 'text-text-muted hover:text-text-main'}`}>
          <TrendingUp size={12} /> <span>Flowmodoro</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-surface-hover p-1 rounded-xl mb-8 border border-border-line relative z-10">
        {(Object.keys(MODES) as Array<keyof typeof MODES>).map(k => (
          <button
            key={k}
            onClick={() => switchMode(k)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === k
                ? 'bg-ambient text-primary shadow-sm border border-border-line'
                : 'text-text-muted hover:text-text-main hover:bg-ambient/50'
            }`}
          >
            {isSattva && k === "work" ? <Flame size={14} className="text-primary mr-1" /> : null}
            <span>{isSattva && k === "work" ? "Dharana" : MODES[k].label}</span>
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center mb-10 w-[280px] h-[280px]">

        {/* Pranayama Breath Sync Overlay */}
        <AnimatePresence>
          {(mode === "shortBreak" || mode === "longBreak") && isActive && (
            <PranayamaRing />
          )}
        </AnimatePresence>

        {/* Background Ring */}
        <svg width="280" height="280" className="rotate-[-90deg] absolute inset-0">
          <circle
            cx="140" cy="140" r="130"
            className="stroke-border-line"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="140" cy="140" r="130"
            className={`stroke-primary transition-all duration-700 ${(isSattva && isActive) ? "drop-shadow-[0_0_20px_rgba(234,88,12,0.8)]" : "drop-shadow-[0_0_8px_var(--color-primary)]"}`}
            strokeWidth={isFlowWork ? "4" : "8"}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - progress)}
            animate={{ scale: isActive ? audioScale : 1 }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
            style={{ originX: "140px", originY: "140px" }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-7xl font-bold tracking-tighter text-text-main drop-shadow-md">
            {Math.floor(currentRenderTime / 60).toString().padStart(2, '0')}:
            {(currentRenderTime % 60).toString().padStart(2, '0')}
          </span>
          <span className="text-sm font-semibold text-primary tracking-widest mt-3 uppercase drop-shadow-sm">
            {isFlowWork ? "FLOW STATE" : `SESSION ${cycle + 1}`}
          </span>
          {strictMode && mode === "work" && (
            <span className="text-[10px] bg-rose-500/20 text-rose-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-2 border border-rose-500/30">
              Strict Limit
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`px-10 py-4 rounded-full font-bold text-lg text-white shadow-[0_0_15px_var(--color-primary)] transition-all active:scale-95 flex items-center space-x-2 ${
              isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/50' : 'bg-primary hover:brightness-110'
            }`}
          >
            {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
            <span>{isActive ? (isFlowWork ? 'Halt Flow' : 'Pause') : 'Start'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-surface text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors border border-border-line"
            title="Reset Timer"
          >
            <RotateCcw size={22} />
          </button>
        </div>

        {/* Exclusive Flowmodoro Take Break Action */}
        <AnimatePresence>
          {isFlowWork && (timeElapsed > 60) && !isActive && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={engageFlowBreak}
              className="text-sm font-semibold text-primary hover:text-white px-4 py-2 border border-primary/50 hover:bg-primary rounded-full transition-colors flex items-center space-x-1"
            >
              <Coffee size={14} /> <span>Take {Math.floor(timeElapsed / 5 / 60)} min break</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
