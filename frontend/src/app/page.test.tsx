import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"

vi.mock("@/components/ThemeContext", () => ({
  useTheme: () => ({ theme: "deep-space", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import Page from "./page"

describe("FocusFlow Home Page", () => {
  it("renders the header", () => {
    render(<Page />)
    expect(screen.getByText("FocusFlow")).toBeInTheDocument()
  })

  it("toggles zen mode when button is clicked", async () => {
    const user = userEvent.setup()
    render(<Page />)
    const zenButton = screen.getByTitle("Toggle Zen Mode")
    await user.click(zenButton)
    expect(screen.getByText("zen.")).toBeInTheDocument()
  })
})
