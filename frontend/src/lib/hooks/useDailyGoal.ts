"use client"
import { useState, useCallback } from "react"
import { localStorageProvider } from "@/lib/storage"

const GOAL_KEY = "focusflow_daily_goal"
const GOAL_OPTIONS = [4, 6, 8, 10]
const DEFAULT_GOAL = 6

export function useDailyGoal() {
  const [goal, setGoal] = useState(() => {
    const saved = localStorageProvider.get<number>(GOAL_KEY)
    return saved && GOAL_OPTIONS.includes(saved) ? saved : DEFAULT_GOAL
  })

  const cycleGoal = useCallback(() => {
    setGoal(prev => {
      const idx = GOAL_OPTIONS.indexOf(prev)
      const next = GOAL_OPTIONS[(idx + 1) % GOAL_OPTIONS.length]
      localStorageProvider.set(GOAL_KEY, next)
      return next
    })
  }, [])

  return { goal, cycleGoal }
}
