import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTasks } from "./useTasks"

const STORAGE_KEY = "focusflow_tasks"

describe("useTasks", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("starts with empty tasks", () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
  })

  it("adds tasks", () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask("Test task") })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe("Test task")
    expect(result.current.tasks[0].completed).toBe(false)
  })

  it("persists tasks to localStorage", () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask("Persisted task") })
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    expect(saved).toHaveLength(1)
    expect(saved[0].text).toBe("Persisted task")
  })

  it("toggles task completion", () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask("Toggle me") })
    const id = result.current.tasks[0].id
    act(() => { result.current.toggleTask(id) })
    expect(result.current.tasks[0].completed).toBe(true)
    act(() => { result.current.toggleTask(id) })
    expect(result.current.tasks[0].completed).toBe(false)
  })

  it("deletes tasks", () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask("Delete me") })
    const id = result.current.tasks[0].id
    act(() => { result.current.deleteTask(id) })
    expect(result.current.tasks).toHaveLength(0)
  })

  it("restores tasks from localStorage on mount", () => {
    const task = { id: "existing-1", text: "Existing task", completed: false, createdAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([task]))
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe("Existing task")
  })
})
