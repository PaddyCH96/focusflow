// Fixed design tokens shared by every theme (chrome stays constant; only
// scene environment + accent colors vary per-theme, see themes.ts).
export const tokens = {
  color: {
    bg: "#0B1F14",
    panel: "#11161E",
    panelHover: "#151B25",
    border: "#1E2633",
    textPrimary: "#E8ECF1",
    textSecondary: "#A6ADB8",
    success: "#6BCB77",
    danger: "#FF7A45",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "22px",
    pill: "999px",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  shadow: {
    card: "0 8px 32px rgba(0, 0, 0, 0.35)",
    glow: "0 0 24px",
  },
} as const
