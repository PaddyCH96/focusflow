"use client"
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { getTheme, themes } from "@/lib/themes"
import type { ThemeId } from "@/lib/storage/types"

type ThemeContextType = {
  themeId: ThemeId
  colors: ReturnType<typeof getTheme>
  setTheme: (t: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>("daylight")

  useEffect(() => {
    const saved = localStorage.getItem("focusflow_theme")
    if (saved && saved in themes) setThemeIdState(saved as ThemeId)
  }, [])

  const setTheme = useCallback((t: ThemeId) => {
    setThemeIdState(t)
    localStorage.setItem("focusflow_theme", t)
  }, [])

  const colors = useMemo(() => getTheme(themeId), [themeId])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--ambient", colors.ambient)
    root.style.setProperty("--surface", colors.surface)
    root.style.setProperty("--surface-hover", colors.surfaceHover)
    root.style.setProperty("--primary", colors.primary)
    root.style.setProperty("--primary-dim", colors.primaryDim)
    root.style.setProperty("--secondary", colors.secondary)
    root.style.setProperty("--text-main", colors.textMain)
    root.style.setProperty("--text-muted", colors.textMuted)
    root.style.setProperty("--border-line", colors.borderLine)
    root.style.setProperty("--glow-gold", colors.glowGold)
    root.style.setProperty("--stone-dark", colors.stoneDark)
    root.style.setProperty("--stone-mid", colors.stoneMid)
    root.style.setProperty("--stone-light", colors.stoneLight)
    root.setAttribute("data-theme", themeId)
  }, [themeId, colors])

  return (
    <ThemeContext.Provider value={{ themeId, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
