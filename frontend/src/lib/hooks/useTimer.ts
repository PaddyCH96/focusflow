"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { localStorageProvider } from "@/lib/storage"
import { DURATIONS } from "@/lib/constants"
import type { TimerState } from "@/lib/storage/types"

const TIMER_KEY = "focusflow_timer"

const defaultTimer: TimerState = {
  isRunning: false,
  remaining: DURATIONS.work,
  mode: "work",
  timerType: "pomodoro",
}

export function useTimer(onSessionComplete?: () => void) {
  const [timer, setTimer] = useState<TimerState>(defaultTimer)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const saved = localStorageProvider.get<TimerState>(TIMER_KEY)
    if (saved) setTimer(saved)
  }, [])

  useEffect(() => {
    localStorageProvider.set(TIMER_KEY, timer)
  }, [timer])

  const start = useCallback(() => {
    setTimer(prev => {
      if (prev.remaining <= 0) {
        return { ...prev, isRunning: true, remaining: DURATIONS[prev.mode] }
      }
      return { ...prev, isRunning: true }
    })
  }, [])

  const pause = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: false }))
  }, [])

  const reset = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      remaining: DURATIONS[prev.mode],
    }))
  }, [])

  const setMode = useCallback((mode: TimerState["mode"]) => {
    setTimer(prev => ({
      ...prev,
      mode,
      isRunning: false,
      remaining: DURATIONS[mode],
    }))
  }, [])

  const setTimerType = useCallback((timerType: TimerState["timerType"]) => {
    setTimer(prev => ({ ...prev, timerType }))
  }, [])

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const next = prev.remaining - 1
          if (next <= 0) {
            onSessionComplete?.()
            return { ...prev, isRunning: false, remaining: 0 }
          }
          return { ...prev, remaining: next }
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timer.isRunning, onSessionComplete])

  const remainingFormatted = useCallback(() => {
    const m = Math.floor(timer.remaining / 60)
    const s = timer.remaining % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }, [timer.remaining])

  return {
    timer,
    start,
    pause,
    reset,
    setMode,
    setTimerType,
    remainingFormatted: remainingFormatted(),
    isRunning: timer.isRunning,
    mode: timer.mode,
  }
}
