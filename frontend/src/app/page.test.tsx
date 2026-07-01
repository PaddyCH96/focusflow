import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"

vi.mock("@/components/ThemeContext", () => ({
  useTheme: () => ({
    themeId: "daylight",
    colors: {
      ambient: "#0f1920",
      surface: "#1a2a30",
      surfaceHover: "#2a3a40",
      primary: "#8ab8d0",
      primaryDim: "#6a98b0",
      secondary: "#708890",
      textMain: "#d8e8f0",
      textMuted: "#8898a0",
      borderLine: "rgba(138, 184, 208, 0.12)",
      glowGold: "rgba(138, 184, 208, 0.20)",
      stoneDark: "#141e24",
      stoneMid: "#202e34",
      stoneLight: "#303e44",
      sceneSkyTop: "#1a4a6a",
      sceneSkyBottom: "#8ab8d0",
      sceneCloud: "#c0d8e8",
      sceneSun: "#f0e8c0",
      sceneAmbient: "#1a2a30",
      sceneMist: "rgba(180, 210, 230, 0.15)",
      terrainColor: "#2a3a2a",
    },
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("@/lib/hooks/useAudio", () => ({
  useAudio: () => ({
    sounds: [
      { id: "rain", playing: false, volume: 0.5 },
      { id: "ocean", playing: false, volume: 0.5 },
      { id: "stream", playing: false, volume: 0.5 },
      { id: "wind", playing: false, volume: 0.5 },
      { id: "forest", playing: false, volume: 0.5 },
      { id: "fireplace", playing: false, volume: 0.5 },
      { id: "cafe", playing: false, volume: 0.5 },
      { id: "night", playing: false, volume: 0.5 },
    ],
    masterVolume: 0.5,
    toggle: vi.fn(),
    setVolume: vi.fn(),
    setMasterVolume: vi.fn(),
    stopAll: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/useTimer", () => ({
  useTimer: () => ({
    timer: { isRunning: false, remaining: 1500, mode: "work", timerType: "pomodoro" },
    start: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(),
    setMode: vi.fn(),
    setTimerType: vi.fn(),
    remainingFormatted: "25:00",
    isRunning: false,
    mode: "work",
  }),
}))

vi.mock("@/lib/hooks/useTasks", () => ({
  useTasks: () => ({
    tasks: [
      { id: "1", text: "Test task", completed: false, createdAt: new Date().toISOString() },
    ],
    addTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/useSessions", () => ({
  useSessions: () => ({
    sessions: [],
    addSession: vi.fn(),
    totalFocusMinutes: 0,
  }),
}))

vi.mock("@/components/Scene3D", () => ({
  Scene3D: () => null,
}))

import Page from "./page"

describe("FocusFlow Home Page", () => {
  it("renders the welcome greeting", () => {
    render(<Page />)
    expect(screen.getByText("Welcome to FocusFlow")).toBeInTheDocument()
  })

  it("renders timer display", () => {
    render(<Page />)
    expect(screen.getByText("25:00")).toBeInTheDocument()
  })

  it("renders navigation items", () => {
    render(<Page />)
    expect(screen.getAllByText("Focus").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Tasks")).toBeInTheDocument()
  })
})
