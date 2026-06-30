"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

type Theme = "deep-space" | "forest-zen" | "cyberpunk" | "vintage" | "sattva"

type ThemeContextType = {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_OPTIONS: Theme[] = ["deep-space", "forest-zen", "cyberpunk", "vintage", "sattva"]

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "deep-space"
  const stored = localStorage.getItem("focusflow-theme")
  if (stored && THEME_OPTIONS.includes(stored as Theme)) {
    return stored as Theme
  }
  return "deep-space"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.body.setAttribute("data-theme", theme)
    localStorage.setItem("focusflow-theme", theme)
  }, [theme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
