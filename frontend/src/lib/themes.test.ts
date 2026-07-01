import { describe, it, expect } from "vitest"
import { themes, getTheme } from "./themes"

describe("themes", () => {
  it("has all 4 themes", () => {
    expect(Object.keys(themes)).toEqual(["sunrise", "daylight", "sunset", "midnight"])
  })

  it("each theme has all required color properties", () => {
    const requiredProps = [
      "ambient", "surface", "surfaceHover", "primary", "primaryDim",
      "secondary", "textMain", "textMuted", "borderLine", "glowGold",
      "stoneDark", "stoneMid", "stoneLight",
      "sceneSkyTop", "sceneSkyBottom", "sceneCloud", "sceneSun",
      "sceneAmbient", "sceneMist", "terrainColor",
    ]
    for (const theme of Object.values(themes)) {
      for (const prop of requiredProps) {
        expect(theme).toHaveProperty(prop)
        expect(typeof (theme as Record<string, unknown>)[prop]).toBe("string")
      }
    }
  })

  it("getTheme returns correct theme", () => {
    const daylight = getTheme("daylight")
    expect(daylight.name).toBe("Daylight")
    expect(daylight.ambient).toBe("#0f1920")
  })

  it("each theme has a name", () => {
    for (const [id, theme] of Object.entries(themes)) {
      expect(theme.name).toBeTruthy()
    }
  })

  it("themes have distinct primary colors", () => {
    const primaryColors = Object.values(themes).map(t => t.primary)
    const unique = new Set(primaryColors)
    expect(unique.size).toBe(Object.keys(themes).length)
  })
})
