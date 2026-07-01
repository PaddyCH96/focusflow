import { describe, it, expect } from "vitest"
import { DURATIONS } from "./constants"

describe("DURATIONS constants", () => {
  it("has correct work duration (25 minutes)", () => {
    expect(DURATIONS.work).toBe(25 * 60)
  })

  it("has correct short break duration (5 minutes)", () => {
    expect(DURATIONS.shortBreak).toBe(5 * 60)
  })

  it("has correct long break duration (15 minutes)", () => {
    expect(DURATIONS.longBreak).toBe(15 * 60)
  })
})
