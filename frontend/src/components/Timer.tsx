"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Coffee, TrendingUp, Circle, Flame } from "lucide-react"
import PranayamaRing from "./PranayamaRing"

type TimerProps = {
  mode: "work" | "shortBreak" | "longBreak"
  setMode: (m: "work" | "shortBreak" | "longBreak") => void
  strictMode: boolean
  timerType: "pomodoro" | "flowmodoro"
  setTimerType: (t: "pomodoro" | "flowmodoro") => void
}

const MODES = {
  work: { id: "work" as const, time: 25 * 60, label: "Dharana" },
  shortBreak: { id: "shortBreak" as const, time: 5 * 60, label: "Rest" },
  longBreak: { id: "longBreak" as const, time: 15 * 60, label: "Long Rest" },
}

const DIAL_RADIUS = 155
const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS

export default function Timer({ mode, setMode, strictMode, timerType, setTimerType }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [cycle, setCycle] = useState(0)

  const timeLeftRef = useRef(25 * 60)
  const timeElapsedRef = useRef(0)
  const isActiveRef = useRef(false)
  const modeRef = useRef(mode)
  const timerTypeRef = useRef(timerType)
  const cycleRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timeLeftRef.current = timeLeft
    timeElapsedRef.current = timeElapsed
    isActiveRef.current = isActive
    modeRef.current = mode
    timerTypeRef.current = timerType
    cycleRef.current = cycle
  }, [timeLeft, timeElapsed, isActive, mode, timerType, cycle])

  const logSession = useCallback(async (duration: number, status: string) => {
    await fetch("http://localhost:8000/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration, status }),
    })
  }, [])

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const switchMode = useCallback((newMode: "work" | "shortBreak" | "longBreak") => {
    clearTimerInterval()
    setIsActive(false)
    setMode(newMode)
    setTimeLeft(MODES[newMode].time)
    setTimeElapsed(0)
  }, [setMode, clearTimerInterval])

  const handleSessionComplete = useCallback(() => {
    clearTimerInterval()
    setIsActive(false)
    const currentMode = modeRef.current
    const currentCycle = cycleRef.current
    if (currentMode === "work") {
      logSession(25 * 60, "completed")
      const newCycle = currentCycle + 1
      setCycle(newCycle)
      setMode(newCycle % 4 === 0 ? "longBreak" : "shortBreak")
      setTimeLeft(MODES[newCycle % 4 === 0 ? "longBreak" : "shortBreak"].time)
      setTimeElapsed(0)
    } else {
      setMode("work")
      setTimeLeft(MODES.work.time)
      setTimeElapsed(0)
    }
  }, [logSession, clearTimerInterval, setMode])

  const startTimer = useCallback(() => {
    setIsActive(true)
    intervalRef.current = setInterval(() => {
      const cm = modeRef.current
      const ct = timerTypeRef.current
      if (ct === "flowmodoro" && cm === "work") {
        timeElapsedRef.current += 1
        setTimeElapsed(timeElapsedRef.current)
      } else {
        const remaining = timeLeftRef.current - 1
        timeLeftRef.current = remaining
        setTimeLeft(remaining)
        if (remaining <= 0) {
          handleSessionComplete()
        }
      }
    }, 1000)
  }, [handleSessionComplete])

  const engageFlowBreak = () => {
    clearTimerInterval()
    setIsActive(false)
    logSession(timeElapsedRef.current, "completed")
    let breakSeconds = Math.floor(timeElapsedRef.current / 5)
    if (breakSeconds < 60) breakSeconds = 60
    const newCycle = cycleRef.current + 1
    setCycle(newCycle)
    setMode("shortBreak")
    setTimeLeft(breakSeconds)
    setTimeElapsed(0)
  }

  const toggleTimerType = (t: "pomodoro" | "flowmodoro") => {
    if (isActiveRef.current) return
    setTimerType(t)
    switchMode("work")
  }

  const toggleTimer = () => {
    if (strictMode && modeRef.current === "work" && isActiveRef.current) {
      const duration = timerTypeRef.current === "flowmodoro" ? timeElapsedRef.current : 25 * 60 - timeLeftRef.current
      if (duration < 60) { setIsActive(false); clearTimerInterval(); return }
      const confirm = window.confirm("Strict Mode: pausing logs a failed session. Continue?")
      if (!confirm) return
      logSession(duration, "failed")
      clearTimerInterval()
      setIsActive(false)
      return
    }
    if (isActiveRef.current) {
      clearTimerInterval()
      setIsActive(false)
    } else {
      startTimer()
    }
  }

  const resetTimer = () => {
    clearTimerInterval()
    setIsActive(false)
    setTimeLeft(MODES[mode].time)
    setTimeElapsed(0)
  }

  useEffect(() => {
    if (strictMode && isActive && mode === "work") {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = "Strict Mode active."
      }
      const handleUnload = () => {
        const duration = timerType === "flowmodoro" ? timeElapsed : 25 * 60 - timeLeft
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

  useEffect(() => {
    return () => clearTimerInterval()
  }, [clearTimerInterval])

  const isFlowWork = timerType === "flowmodoro" && mode === "work"
  const currentRenderTime = isFlowWork ? timeElapsed : timeLeft
  const progress = isFlowWork ? 1 : 1 - timeLeft / MODES[mode].time
  const strokeDashoffset = DIAL_CIRCUMFERENCE * (1 - progress)

  return (
    <div className="flex flex-col items-center">
      {/* Timer type toggle */}
      <div className="flex items-center gap-1.5 mb-8 px-1.5 py-1 rounded-full glass-panel-light">
        <button
          onClick={() => toggleTimerType("pomodoro")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
            timerType === "pomodoro"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          <Circle size={10} fill="currentColor" />
          <span>Pomodoro</span>
        </button>
        <button
          onClick={() => toggleTimerType("flowmodoro")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
            timerType === "flowmodoro"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-text-muted hover:text-text-main"
          }`}
        >
          <TrendingUp size={10} />
          <span>Flowmodoro</span>
        </button>
      </div>

      {/* Mode selector */}
      <div className="flex items-center gap-1 mb-10 px-1 py-1 rounded-full glass-panel-light">
        {(Object.keys(MODES) as Array<keyof typeof MODES>).map((k) => (
          <button
            key={k}
            onClick={() => switchMode(k)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
              mode === k
                ? "bg-stone-light/40 text-primary border border-primary/15"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            {mode === k && k === "work" ? <Flame size={10} className="text-primary" /> : null}
            <span>{MODES[k].label}</span>
          </button>
        ))}
      </div>

      {/* Stone meditation dial */}
      <div className="relative flex items-center justify-center mb-8">
        <AnimatePresence>
          {(mode === "shortBreak" || mode === "longBreak") && isActive && <PranayamaRing />}
        </AnimatePresence>

        {/* Stone platform shadow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[280px] h-[20px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Outer stone ring */}
        <div className="relative w-[360px] h-[360px] rounded-full stone-surface shadow-2xl"
          style={{
            boxShadow: `
              inset 0 2px 4px rgba(214,185,138,0.08),
              inset 0 -2px 4px rgba(0,0,0,0.4),
              0 20px 60px rgba(0,0,0,0.5),
              0 0 40px rgba(214,185,138,0.06)
            `,
          }}
        >
          {/* Inner stone surface */}
          <div className="absolute inset-[6px] rounded-full stone-surface-light overflow-hidden">
            <div className="absolute inset-0 rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 35% 35%, rgba(214,185,138,0.04) 0%, transparent 40%),
                  radial-gradient(circle at 70% 60%, rgba(59,54,50,0.3) 0%, transparent 50%)
                `,
              }}
            />
          </div>

          {/* SVG progress ring */}
          <svg
            width="360"
            height="360"
            className="absolute inset-0 -rotate-90"
          >
            {/* Background track */}
            <circle
              cx="180"
              cy="180"
              r={DIAL_RADIUS}
              fill="none"
              stroke="rgba(214,185,138,0.06)"
              strokeWidth="2"
            />
            {/* Progress ring */}
            <motion.circle
              cx="180"
              cy="180"
              r={DIAL_RADIUS}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={DIAL_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                filter: isActive ? "drop-shadow(0 0 12px rgba(214,185,138,0.4))" : undefined,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={currentRenderTime}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="heading-serif text-7xl tracking-tight text-text-main"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {Math.floor(currentRenderTime / 60).toString().padStart(2, "0")}
              <span className="mx-1 opacity-40">:</span>
              {(currentRenderTime % 60).toString().padStart(2, "0")}
            </motion.span>
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em] mt-3 font-medium"
              style={{ color: "var(--primary-dim)" }}
            >
              {isFlowWork ? "Flow State" : `Session ${cycle + 1}`}
            </motion.span>

            {strictMode && mode === "work" && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] uppercase tracking-widest mt-2 px-2 py-0.5 rounded-full border"
                style={{
                  color: "var(--primary-dim)",
                  borderColor: "rgba(214,185,138,0.15)",
                  background: "rgba(214,185,138,0.05)",
                }}
              >
                Strict
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={toggleTimer}
          className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 gold-glow"
          style={{
            background: isActive
              ? "linear-gradient(135deg, rgba(214,185,138,0.15), rgba(214,185,138,0.05))"
              : "linear-gradient(135deg, rgba(214,185,138,0.2), rgba(214,185,138,0.08))",
            color: "var(--primary)",
            border: "1px solid rgba(214,185,138,0.2)",
          }}
        >
          {isActive ? (
            <><Pause size={16} fill="currentColor" /> <span>{isFlowWork ? "Halt" : "Pause"}</span></>
          ) : (
            <><Play size={16} fill="currentColor" /> <span>Begin</span></>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
          style={{
            background: "rgba(59,54,50,0.3)",
            border: "1px solid var(--border-line)",
            color: "var(--text-muted)",
          }}
          title="Reset"
        >
          <RotateCcw size={16} />
        </motion.button>
      </div>

      {/* Flowmodoro break prompt */}
      <AnimatePresence>
        {isFlowWork && timeElapsed > 60 && !isActive && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={engageFlowBreak}
            className="flex items-center gap-1.5 mt-6 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              color: "var(--primary-dim)",
              border: "1px solid rgba(214,185,138,0.15)",
              background: "rgba(214,185,138,0.04)",
            }}
          >
            <Coffee size={14} />
            <span>Take {Math.floor(timeElapsed / 5 / 60)} min break</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
