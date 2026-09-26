import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { useTasks } from "./useTasks"

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
    json: async () => data,
  } as Response
}

describe("useTasks", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("loads tasks from the API on mount", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([{ id: 1, title: "Existing task", completed: false }])
    )
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useTasks())
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.tasks).toEqual([{ id: 1, text: "Existing task", completed: false }])
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/tasks"), expect.any(Object))
  })

  it("adds a task via POST /tasks", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({ id: 5, title: "New task", completed: false }))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.addTask("New task")
    })
    await waitFor(() => expect(result.current.tasks).toHaveLength(1))
    expect(result.current.tasks[0]).toEqual({ id: 5, text: "New task", completed: false })
  })

  it("optimistically toggles completion and rolls back on failure", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([{ id: 1, title: "Task", completed: false }]))
      .mockResolvedValueOnce(jsonResponse({ detail: "server error" }, 500))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.toggleTask(1)
    })
    expect(result.current.tasks[0].completed).toBe(true)

    await waitFor(() => expect(result.current.tasks[0].completed).toBe(false))
    expect(result.current.error).toBeTruthy()
  })

  it("optimistically removes a task via DELETE", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([{ id: 1, title: "Task", completed: false }]))
      .mockResolvedValueOnce({ ok: true, status: 204, text: async () => "", json: async () => undefined } as Response)
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.deleteTask(1)
    })
    expect(result.current.tasks).toHaveLength(0)
  })

  it("surfaces a load error instead of throwing", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ detail: "boom" }, 500))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBeTruthy()
    expect(result.current.tasks).toEqual([])
  })

  it("reload triggers a fresh GET request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const callsBefore = fetchMock.mock.calls.length

    act(() => {
      result.current.reload()
    })
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBefore))
  })
})
