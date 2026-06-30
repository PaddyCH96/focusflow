import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"

vi.mock("@/components/ThemeContext", () => ({
  useTheme: () => ({ theme: "himalayan", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import Page from "./page"

describe("FocusFlow Home Page", () => {
  it("renders the deep work heading", () => {
    render(<Page />)
    expect(screen.getByText("Deep Work")).toBeInTheDocument()
  })

  it("renders timer controls", () => {
    render(<Page />)
    expect(screen.getByText("Pomodoro")).toBeInTheDocument()
    expect(screen.getByText("Flowmodoro")).toBeInTheDocument()
    expect(screen.getByText("Dharana")).toBeInTheDocument()
    expect(screen.getByText("Rest")).toBeInTheDocument()
  })

  it("renders the begin button", () => {
    render(<Page />)
    expect(screen.getByText("Begin")).toBeInTheDocument()
  })
})
