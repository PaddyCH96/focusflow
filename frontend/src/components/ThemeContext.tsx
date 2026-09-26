"use client"
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { getTheme, themes } from "@/lib/themes"
import { tokens } from "@/lib/tokens"
import type { ThemeId, DayNight } from "@/lib/storage/types"

type ThemeContextType = {
  themeId: ThemeId
  colors: ReturnType<typeof getTheme>
  setTheme: (t: ThemeId) => void
  dayNight: DayNight
  toggleDayNight: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_KEY = "focusflow_theme"
const DAY_NIGHT_KEY = "focusflow_day_night"

function readInitialTheme(): ThemeId {
  if (typeof window === "undefined") return "sunrise"
  const saved = localStorage.getItem(THEME_KEY)
  return saved && saved in themes ? (saved as ThemeId) : "sunrise"
}

function readInitialDayNight(): DayNight {
  if (typeof window === "undefined") return "day"
  const saved = localStorage.getItem(DAY_NIGHT_KEY)
  return saved === "day" || saved === "night" ? saved : "day"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(readInitialTheme)
  const [dayNight, setDayNight] = useState<DayNight>(readInitialDayNight)

  const setTheme = useCallback((t: ThemeId) => {
    setThemeIdState(t)
    localStorage.setItem(THEME_KEY, t)
  }, [])

  const toggleDayNight = useCallback(() => {
    setDayNight(prev => {
      const next = prev === "day" ? "night" : "day"
      localStorage.setItem(DAY_NIGHT_KEY, next)
      return next
    })
  }, [])

  const colors = useMemo(() => getTheme(themeId), [themeId])

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty("--bg", tokens.color.bg)
    root.style.setProperty("--panel", tokens.color.panel)
    root.style.setProperty("--panel-hover", tokens.color.panelHover)
    root.style.setProperty("--border-line", tokens.color.border)
    root.style.setProperty("--text-main", tokens.color.textPrimary)
    root.style.setProperty("--text-muted", tokens.color.textSecondary)
    root.style.setProperty("--success", tokens.color.success)
    root.style.setProperty("--danger", tokens.color.danger)

    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--primary-light", colors.primaryLight)
    root.style.setProperty("--glow-gold", `${colors.primary}40`)
    root.style.setProperty("--stone-dark", colors.stoneDark)
    root.style.setProperty("--stone-mid", colors.stoneMid)
    root.style.setProperty("--stone-light", colors.stoneLight)

    root.setAttribute("data-theme", themeId)
    root.setAttribute("data-mode", dayNight)
  }, [themeId, colors, dayNight])

  return (
    <ThemeContext.Provider value={{ themeId, colors, setTheme, dayNight, toggleDayNight }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
