import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSessions } from "./useSessions"
import type { Session } from "../storage/types"

const STORAGE_KEY = "focusflow_sessions"

function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: crypto.randomUUID(),
    startTime: new Date().toISOString(),
    duration: 1500,
    type: "work",
    completed: true,
    timerType: "pomodoro",
    ...overrides,
  }
}

describe("useSessions", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("starts with empty sessions", () => {
    const { result } = renderHook(() => useSessions())
    expect(result.current.sessions).toEqual([])
  })

  it("adds sessions in reverse chronological order", () => {
    const { result } = renderHook(() => useSessions())
    act(() => { result.current.addSession(makeSession({ id: "1" })) })
    act(() => { result.current.addSession(makeSession({ id: "2" })) })
    expect(result.current.sessions).toHaveLength(2)
    expect(result.current.sessions[0].id).toBe("2")
    expect(result.current.sessions[1].id).toBe("1")
  })

  it("computes total focus minutes", () => {
    const { result } = renderHook(() => useSessions())
    act(() => { result.current.addSession(makeSession({ type: "work", duration: 1500 })) })
    act(() => { result.current.addSession(makeSession({ type: "work", duration: 600 })) })
    act(() => { result.current.addSession(makeSession({ type: "shortBreak", duration: 300 })) })
    expect(result.current.totalFocusMinutes).toBe(2100)
  })

  it("persists sessions to localStorage", () => {
    const { result } = renderHook(() => useSessions())
    act(() => { result.current.addSession(makeSession()) })
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    expect(saved).toHaveLength(1)
  })
})
