import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTimer } from "./useTimer"

const STORAGE_KEY = "focusflow_timer"

describe("useTimer", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("starts with default work timer", () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.mode).toBe("work")
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingFormatted).toBe("25:00")
  })

  it("persists timer state to localStorage", () => {
    const { result } = renderHook(() => useTimer())
    act(() => { result.current.start() })
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    expect(saved.isRunning).toBe(true)
    expect(saved.mode).toBe("work")
    expect(saved.remaining).toBe(1500)
  })

  it("restores timer state from localStorage on mount", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      isRunning: false,
      remaining: 600,
      mode: "shortBreak",
      timerType: "pomodoro",
    }))
    const { result } = renderHook(() => useTimer())
    expect(result.current.mode).toBe("shortBreak")
    expect(result.current.remainingFormatted).toBe("10:00")
  })

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "{corrupt-json}")
    const { result } = renderHook(() => useTimer())
    expect(result.current.mode).toBe("work")
    expect(result.current.remainingFormatted).toBe("25:00")
  })

  it("decrements timer when running", () => {
    const { result } = renderHook(() => useTimer())
    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(true)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.remainingFormatted).toBe("24:57")
  })

  it("pauses timer correctly", () => {
    const { result } = renderHook(() => useTimer())
    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(5000) })
    act(() => { result.current.pause() })
    expect(result.current.isRunning).toBe(false)
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    expect(saved.remaining).toBe(1495)
  })

  it("resets timer to full duration", () => {
    const { result } = renderHook(() => useTimer())
    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(10000) })
    act(() => { result.current.reset() })
    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingFormatted).toBe("25:00")
  })

  it("switches modes and resets duration", () => {
    const { result } = renderHook(() => useTimer())
    act(() => { result.current.setMode("shortBreak") })
    expect(result.current.mode).toBe("shortBreak")
    expect(result.current.remainingFormatted).toBe("05:00")
    act(() => { result.current.setMode("longBreak") })
    expect(result.current.remainingFormatted).toBe("15:00")
    act(() => { result.current.setMode("work") })
    expect(result.current.remainingFormatted).toBe("25:00")
  })

  it("calls onSessionComplete when timer reaches zero", () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(onComplete))
    act(() => { result.current.start() })
    for (let i = 0; i < 1500; i++) {
      act(() => { vi.advanceTimersByTime(1000) })
    }
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.isRunning).toBe(false)
  })

  it("clears interval on unmount", () => {
    const { result, unmount } = renderHook(() => useTimer())
    act(() => { result.current.start() })
    expect(result.current.isRunning).toBe(true)
    unmount()
    act(() => { vi.advanceTimersByTime(5000) })
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    expect(saved.remaining).toBe(1500)
  })

  it("does not make network calls during save/load", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
    const xhrSpy = vi.spyOn(globalThis, "XMLHttpRequest")
    renderHook(() => useTimer())
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(xhrSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
    xhrSpy.mockRestore()
  })
})
