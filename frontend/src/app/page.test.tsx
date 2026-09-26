import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import React from "react"

vi.mock("@/components/ThemeContext", () => ({
  useTheme: () => ({
    themeId: "sunrise",
    colors: {
      id: "sunrise",
      name: "Himalayan Dawn",
      description: "Golden sunrise, warm tones, peaceful, energizing.",
      primary: "#F5B15A",
      primaryLight: "#FFD08A",
      stoneDark: "#241a10",
      stoneMid: "#382818",
      stoneLight: "#4a3820",
      sceneSkyTop: "#7a3a1a",
      sceneSkyBottom: "#e8a555",
      sceneCloud: "#f0c090",
      sceneSun: "#ffd88a",
      sceneMist: "rgba(245, 177, 90, 0.15)",
      terrainColor: "#3a2a18",
    },
    setTheme: vi.fn(),
    dayNight: "day",
    toggleDayNight: vi.fn(),
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
    tasks: [{ id: 1, text: "Test task", completed: false }],
    addTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
    isLoading: false,
    error: null,
    reload: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/useSessions", () => ({
  useSessions: () => ({
    sessions: [],
    logSession: vi.fn(),
    isLoading: false,
    error: null,
    reload: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/useDailyGoal", () => ({
  useDailyGoal: () => ({
    goal: 6,
    cycleGoal: vi.fn(),
  }),
}))

vi.mock("@/lib/hooks/useJournal", () => ({
  useJournal: () => ({
    entries: [],
    addEntry: vi.fn(),
    isLoading: false,
    error: null,
  }),
}))

vi.mock("@/lib/hooks/useVoiceNotes", () => ({
  useVoiceNotes: () => ({
    notes: [],
    uploadNote: vi.fn().mockResolvedValue(true),
    isLoading: false,
    isUploading: false,
    error: null,
  }),
}))

vi.mock("@/lib/hooks/useWhiteboards", () => ({
  useWhiteboards: () => ({
    boards: [],
    saveBoard: vi.fn().mockResolvedValue(true),
    isLoading: false,
    isSaving: false,
    error: null,
  }),
}))

vi.mock("@/lib/migrateLocalData", () => ({
  migrateLocalDataToBackend: vi.fn().mockResolvedValue(false),
}))

vi.mock("@/components/Scene3D", () => ({
  Scene3D: () => null,
}))

import Page from "./page"

// The page is loaded via next/dynamic with ssr:false (see src/app/page.tsx),
// so content mounts asynchronously — the first query in each test must be a
// findBy* to await that resolution before asserting on the rendered tree.
describe("FocusFlow Home Page", () => {
  it("renders the timer view by default", async () => {
    render(<Page />)
    expect(await screen.findByText("25:00")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Start timer" })).toBeInTheDocument()
  })

  it("renders all nine navigation items", async () => {
    render(<Page />)
    expect(await screen.findByRole("button", { name: "Timer" })).toBeInTheDocument()
    for (const label of ["Tasks", "Sounds", "Stats", "Journal", "Voice Notes", "Whiteboard", "Themes", "Settings"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument()
    }
  })

  it("renders the right-rail summary cards", async () => {
    render(<Page />)
    expect(await screen.findByText("Daily Goal")).toBeInTheDocument()
    expect(screen.getByText("Today's Focus")).toBeInTheDocument()
    expect(screen.getByText("Completed Tasks")).toBeInTheDocument()
    expect(screen.getByText("0 / 6 sessions")).toBeInTheDocument()
  })

  it("switches to the Tasks view and shows existing tasks", async () => {
    render(<Page />)
    fireEvent.click(await screen.findByRole("button", { name: "Tasks" }))
    expect(screen.getByText("Test task")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Add a task...")).toBeInTheDocument()
  })

  it("switches to the Journal view", async () => {
    render(<Page />)
    fireEvent.click(await screen.findByRole("button", { name: "Journal" }))
    expect(screen.getByText("Past Entries")).toBeInTheDocument()
  })

  it("switches to the Voice Notes view", async () => {
    render(<Page />)
    fireEvent.click(await screen.findByRole("button", { name: "Voice Notes" }))
    expect(screen.getByText("Vani — Voice Notes")).toBeInTheDocument()
  })

  it("switches to the Whiteboard view", async () => {
    render(<Page />)
    fireEvent.click(await screen.findByRole("button", { name: "Whiteboard" }))
    expect(screen.getByText("Mandala — Whiteboard")).toBeInTheDocument()
  })

  it("renders the greeting and quote in the top bar", async () => {
    render(<Page />)
    expect(await screen.findByText("Namaste, Focus Seeker")).toBeInTheDocument()
  })
})
