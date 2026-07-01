import { describe, it, expect, beforeEach, vi } from "vitest"
import { localStorageProvider } from "./local"

describe("localStorageProvider", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("stores and retrieves values", () => {
    localStorageProvider.set("test-key", { name: "test", count: 42 })
    const result = localStorageProvider.get<{ name: string; count: number }>("test-key")
    expect(result).toEqual({ name: "test", count: 42 })
  })

  it("returns null for missing keys", () => {
    const result = localStorageProvider.get("nonexistent")
    expect(result).toBeNull()
  })

  it("handles JSON parse errors gracefully", () => {
    localStorage.setItem("corrupt", "not-valid-json{{{")
    const result = localStorageProvider.get("corrupt")
    expect(result).toBeNull()
  })

  it("removes keys correctly", () => {
    localStorageProvider.set("temp", "value")
    localStorageProvider.remove("temp")
    expect(localStorage.getItem("temp")).toBeNull()
  })

  it("does not crash when localStorage throws (SSR safety)", () => {
    const getItemSpy = vi.spyOn(globalThis, "localStorage", "get").mockImplementation(() => {
      throw new Error("localStorage unavailable")
    })
    const result = localStorageProvider.get("any")
    expect(result).toBeNull()
    getItemSpy.mockRestore()
  })

  it("handles undefined gracefully in server context", () => {
    const win = { ...globalThis }
    const descriptor = vi.spyOn(globalThis, "window", "get").mockImplementation(() => undefined as unknown as Window & typeof globalThis)
    const result = localStorageProvider.get("key")
    expect(result).toBeNull()
    descriptor.mockRestore()
  })
})
