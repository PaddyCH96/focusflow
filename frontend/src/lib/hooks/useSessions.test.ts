import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { useSessions } from "./useSessions"

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(data),
    json: async () => data,
  } as Response
}

describe("useSessions", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("starts empty and loads sessions from the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([{ id: 1, duration: 1500, status: "completed", timestamp: "2024-01-01T00:00:00.000Z" }])
    )
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useSessions())
    expect(result.current.sessions).toEqual([])
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.sessions).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/sessions"), expect.any(Object))
  })

  it("logs a completed session and prepends it to the list", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({ id: 2, duration: 900, status: "completed", timestamp: "2024-01-02T00:00:00.000Z" }))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useSessions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.logSession(900, "completed")
    })
    await waitFor(() => expect(result.current.sessions).toHaveLength(1))
    expect(result.current.sessions[0].status).toBe("completed")
  })

  it("logs a failed session when a focus attempt is skipped mid-way", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(jsonResponse({ id: 3, duration: 200, status: "failed", timestamp: "2024-01-03T00:00:00.000Z" }))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useSessions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.logSession(200, "failed")
    })
    await waitFor(() => expect(result.current.sessions).toHaveLength(1))
    expect(result.current.sessions[0].status).toBe("failed")
  })

  it("surfaces a load error instead of throwing", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ detail: "boom" }, 500))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useSessions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBeTruthy()
    expect(result.current.sessions).toEqual([])
  })

  it("reload triggers a fresh GET request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]))
    vi.stubGlobal("fetch", fetchMock)

    const { result } = renderHook(() => useSessions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const callsBefore = fetchMock.mock.calls.length

    act(() => {
      result.current.reload()
    })
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBefore))
  })
})
