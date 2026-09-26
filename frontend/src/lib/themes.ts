import type { ThemeId } from "./storage/types"

export interface ThemeColors {
  id: ThemeId
  name: string
  description: string
  primary: string
  primaryLight: string
  stoneDark: string
  stoneMid: string
  stoneLight: string
  sceneSkyTop: string
  sceneSkyBottom: string
  sceneCloud: string
  sceneSun: string
  sceneMist: string
  terrainColor: string
}

export const themes: Record<ThemeId, ThemeColors> = {
  sunrise: {
    id: "sunrise",
    name: "Himalayan Dawn",
    description: "Golden sunrise, warm tones, peaceful, energizing.",
    primary: "#F5B15A",
    primaryLight: "#FFD08A",
    stoneDark: "#241a10",
    stoneMid: "#382818",
    stoneLight: "#4a3820",
    sceneSkyTop: "#7a3a1a",
    sceneSkyBottom: "#e8a555",
    sceneCloud: "#f0c090",
    sceneSun: "#ffd88a",
    sceneMist: "rgba(245, 177, 90, 0.15)",
    terrainColor: "#3a2a18",
  },
  sunset: {
    id: "sunset",
    name: "Sacred Twilight",
    description: "Purple twilight, mystical, spiritual, calm.",
    primary: "#B18AFF",
    primaryLight: "#D8C4FF",
    stoneDark: "#1c1428",
    stoneMid: "#2a1e3c",
    stoneLight: "#3a2c50",
    sceneSkyTop: "#1c1040",
    sceneSkyBottom: "#8a5cc0",
    sceneCloud: "#c8a0e8",
    sceneSun: "#e0b8ff",
    sceneMist: "rgba(177, 138, 255, 0.15)",
    terrainColor: "#241a34",
  },
  daylight: {
    id: "daylight",
    name: "Vedic Forest",
    description: "Lush forest, river, ancient ruins, earthy, refreshing.",
    primary: "#6BCB77",
    primaryLight: "#A8E6AE",
    stoneDark: "#14201a",
    stoneMid: "#1e2e24",
    stoneLight: "#2c3e30",
    sceneSkyTop: "#153a2e",
    sceneSkyBottom: "#5a9a6a",
    sceneCloud: "#a8d8b0",
    sceneSun: "#e8e0a0",
    sceneMist: "rgba(107, 203, 119, 0.15)",
    terrainColor: "#1e3020",
  },
  midnight: {
    id: "midnight",
    name: "Snow Serenity",
    description: "Snowy mountains, minimal, clean, focused.",
    primary: "#8AC7FF",
    primaryLight: "#C9E8FF",
    stoneDark: "#0e1620",
    stoneMid: "#182432",
    stoneLight: "#243444",
    sceneSkyTop: "#0e1c30",
    sceneSkyBottom: "#6a9ac0",
    sceneCloud: "#e0eefc",
    sceneSun: "#d8ecff",
    sceneMist: "rgba(138, 199, 255, 0.18)",
    terrainColor: "#1c2836",
  },
}

export const themeOrder: ThemeId[] = ["sunrise", "sunset", "daylight", "midnight"]

export function getTheme(themeId: ThemeId): ThemeColors {
  return themes[themeId]
}
