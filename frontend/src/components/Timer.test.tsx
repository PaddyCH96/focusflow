import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("./ThemeContext", () => ({
  useTheme: () => ({ theme: "himalayan", setTheme: vi.fn() }),
}))

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

import Timer from "./Timer"

function renderTimer(props: Partial<React.ComponentProps<typeof Timer>> = {}) {
  const defaults: React.ComponentProps<typeof Timer> = {
    mode: "work",
    setMode: vi.fn(),
    strictMode: false,
    timerType: "pomodoro",
    setTimerType: vi.fn(),
  }
  return render(<Timer {...defaults} {...props} />)
}

// Helper: find the time text via the heading-serif span's combined text
function getTimeDisplay() {
  const els = screen.getAllByText(/\d{2}/)
  // Find the element that has heading-serif class
  return els.find((el) => el.className.includes("heading-serif"))
}

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it("renders the time display at 25:00 for work mode", () => {
    renderTimer()
    const display = getTimeDisplay()
    expect(display).toBeTruthy()
    expect(display?.textContent?.replace(/\s/g, "")).toBe("25:00")
  })

  it("shows Begin button when idle", () => {
    renderTimer()
    expect(screen.getByText("Begin")).toBeInTheDocument()
  })

  it("shows Pause after clicking Begin", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer()
    await user.click(screen.getByText("Begin"))
    expect(screen.getByText("Pause")).toBeInTheDocument()
  })

  it("toggles back to Begin after clicking Pause", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer()
    await user.click(screen.getByText("Begin"))
    await user.click(screen.getByText("Pause"))
    expect(screen.getByText("Begin")).toBeInTheDocument()
  })

  it("decrements time while active", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer()
    await user.click(screen.getByText("Begin"))
    act(() => { vi.advanceTimersByTime(2000) })
    const display = getTimeDisplay()
    expect(display?.textContent?.replace(/\s/g, "")).toBe("24:58")
  })

  it("resets to 25:00 on reset click", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer()
    await user.click(screen.getByText("Begin"))
    act(() => { vi.advanceTimersByTime(5000) })
    const display = getTimeDisplay()
    expect(display?.textContent?.replace(/\s/g, "")).toBe("24:55")
    await user.click(screen.getByTitle("Reset"))
    const display2 = getTimeDisplay()
    expect(display2?.textContent?.replace(/\s/g, "")).toBe("25:00")
  })

  it("switches to Rest mode when Rest button is clicked", async () => {
    const setMode = vi.fn()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer({ setMode })
    await user.click(screen.getByText("Rest"))
    expect(setMode).toHaveBeenCalledWith("shortBreak")
  })

  it("switches to Pomodoro mode when Pomodoro button is clicked", async () => {
    const setTimerType = vi.fn()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer({ timerType: "flowmodoro", setTimerType })
    await user.click(screen.getByText("Pomodoro"))
    expect(setTimerType).toHaveBeenCalledWith("pomodoro")
  })

  it("switches to Flowmodoro mode when Flowmodoro button is clicked", async () => {
    const setTimerType = vi.fn()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer({ setTimerType })
    await user.click(screen.getByText("Flowmodoro"))
    expect(setTimerType).toHaveBeenCalledWith("flowmodoro")
  })

  it("shows Session 1 label by default", () => {
    renderTimer()
    expect(screen.getByText("Session 1")).toBeInTheDocument()
  })

  it("starts, pauses, and resets in sequence", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderTimer()

    await user.click(screen.getByText("Begin"))
    expect(screen.getByText("Pause")).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(3000) })
    let display = getTimeDisplay()
    expect(display?.textContent?.replace(/\s/g, "")).toBe("24:57")

    await user.click(screen.getByText("Pause"))
    expect(screen.getByText("Begin")).toBeInTheDocument()
    display = getTimeDisplay()
    expect(display?.textContent?.replace(/\s/g, "")).toBe("24:57")

    await user.click(screen.getByTitle("Reset"))
    display = getTimeDisplay()
    expect(display?.textContent?.replace(/\s/g, "")).toBe("25:00")
    expect(screen.getByText("Begin")).toBeInTheDocument()
  })
})
