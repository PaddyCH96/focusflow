import type { ThemeId } from "./storage/types"

export interface ThemeColors {
  name: string
  ambient: string
  surface: string
  surfaceHover: string
  primary: string
  primaryDim: string
  secondary: string
  textMain: string
  textMuted: string
  borderLine: string
  glowGold: string
  stoneDark: string
  stoneMid: string
  stoneLight: string
  sceneSkyTop: string
  sceneSkyBottom: string
  sceneCloud: string
  sceneSun: string
  sceneAmbient: string
  sceneMist: string
  terrainColor: string
}

export const themes: Record<ThemeId, ThemeColors> = {
  sunrise: {
    name: "Sunrise",
    ambient: "#1a1410",
    surface: "#2a2018",
    surfaceHover: "#3a3028",
    primary: "#e8b87a",
    primaryDim: "#c49a62",
    secondary: "#a08060",
    textMain: "#f0e4d0",
    textMuted: "#a09080",
    borderLine: "rgba(232, 184, 122, 0.10)",
    glowGold: "rgba(232, 184, 122, 0.25)",
    stoneDark: "#201814",
    stoneMid: "#302824",
    stoneLight: "#403830",
    sceneSkyTop: "#4a1a0a",
    sceneSkyBottom: "#c47040",
    sceneCloud: "#e8a060",
    sceneSun: "#f0c040",
    sceneAmbient: "#2a1410",
    sceneMist: "rgba(200, 150, 100, 0.15)",
    terrainColor: "#3a2a1a",
  },
  daylight: {
    name: "Daylight",
    ambient: "#0f1920",
    surface: "#1a2a30",
    surfaceHover: "#2a3a40",
    primary: "#8ab8d0",
    primaryDim: "#6a98b0",
    secondary: "#708890",
    textMain: "#d8e8f0",
    textMuted: "#8898a0",
    borderLine: "rgba(138, 184, 208, 0.12)",
    glowGold: "rgba(138, 184, 208, 0.20)",
    stoneDark: "#141e24",
    stoneMid: "#202e34",
    stoneLight: "#303e44",
    sceneSkyTop: "#1a4a6a",
    sceneSkyBottom: "#8ab8d0",
    sceneCloud: "#c0d8e8",
    sceneSun: "#f0e8c0",
    sceneAmbient: "#1a2a30",
    sceneMist: "rgba(180, 210, 230, 0.15)",
    terrainColor: "#2a3a2a",
  },
  sunset: {
    name: "Sunset",
    ambient: "#1a0e14",
    surface: "#2a1820",
    surfaceHover: "#3a2830",
    primary: "#d49a7a",
    primaryDim: "#b47a5a",
    secondary: "#907080",
    textMain: "#e8d0d0",
    textMuted: "#908090",
    borderLine: "rgba(212, 154, 122, 0.10)",
    glowGold: "rgba(212, 154, 122, 0.20)",
    stoneDark: "#1e1018",
    stoneMid: "#2e1822",
    stoneLight: "#3e2832",
    sceneSkyTop: "#2a0a20",
    sceneSkyBottom: "#c06050",
    sceneCloud: "#d08070",
    sceneSun: "#f0a050",
    sceneAmbient: "#1a0e14",
    sceneMist: "rgba(200, 120, 100, 0.12)",
    terrainColor: "#3a2020",
  },
  midnight: {
    name: "Midnight",
    ambient: "#080a10",
    surface: "#12141c",
    surfaceHover: "#1c1e2a",
    primary: "#8090b8",
    primaryDim: "#607098",
    secondary: "#586078",
    textMain: "#c8ccdc",
    textMuted: "#787c8c",
    borderLine: "rgba(128, 144, 184, 0.08)",
    glowGold: "rgba(128, 144, 184, 0.18)",
    stoneDark: "#0c0e16",
    stoneMid: "#161822",
    stoneLight: "#222430",
    sceneSkyTop: "#0a0a2a",
    sceneSkyBottom: "#1a2a5a",
    sceneCloud: "#2a3a6a",
    sceneSun: "#6078b0",
    sceneAmbient: "#080a10",
    sceneMist: "rgba(100, 120, 180, 0.12)",
    terrainColor: "#1a1a2a",
  },
}

export function getTheme(themeId: ThemeId): ThemeColors {
  return themes[themeId]
}
