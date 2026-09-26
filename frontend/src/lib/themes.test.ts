import { describe, it, expect } from "vitest"
import { themes, themeOrder, getTheme } from "./themes"

describe("themes", () => {
  it("has all 4 themes", () => {
    expect(Object.keys(themes).sort()).toEqual(["daylight", "midnight", "sunrise", "sunset"])
  })

  it("themeOrder matches the reference presentation order", () => {
    expect(themeOrder).toEqual(["sunrise", "sunset", "daylight", "midnight"])
  })

  it("each theme has all required color properties", () => {
    const requiredProps = [
      "id", "name", "description", "primary", "primaryLight",
      "stoneDark", "stoneMid", "stoneLight",
      "sceneSkyTop", "sceneSkyBottom", "sceneCloud", "sceneSun",
      "sceneMist", "terrainColor",
    ]
    for (const theme of Object.values(themes)) {
      for (const prop of requiredProps) {
        expect(theme).toHaveProperty(prop)
        expect(typeof (theme as unknown as Record<string, unknown>)[prop]).toBe("string")
      }
    }
  })

  it("getTheme returns correct theme", () => {
    const sunrise = getTheme("sunrise")
    expect(sunrise.name).toBe("Himalayan Dawn")
    expect(sunrise.primary).toBe("#F5B15A")
  })

  it("each theme has a name and description", () => {
    for (const theme of Object.values(themes)) {
      expect(theme.name).toBeTruthy()
      expect(theme.description).toBeTruthy()
    }
  })

  it("themes have distinct primary colors", () => {
    const primaryColors = Object.values(themes).map(t => t.primary)
    const unique = new Set(primaryColors)
    expect(unique.size).toBe(Object.keys(themes).length)
  })
})
