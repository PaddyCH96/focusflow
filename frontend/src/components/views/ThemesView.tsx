"use client"
import { Sunrise, Sparkles, Leaf, Snowflake, Sun, Moon } from "lucide-react"
import { themeOrder, themes } from "@/lib/themes"
import type { ThemeId, DayNight } from "@/lib/storage/types"

const THEME_ICON: Record<ThemeId, React.ReactNode> = {
  sunrise: <Sunrise size={15} />,
  sunset: <Sparkles size={15} />,
  daylight: <Leaf size={15} />,
  midnight: <Snowflake size={15} />,
}

export function ThemesView({
  themeId,
  onSetTheme,
  dayNight,
  onSetDayNight,
}: {
  themeId: ThemeId
  onSetTheme: (id: ThemeId) => void
  dayNight: DayNight
  onSetDayNight: (mode: DayNight) => void
}) {
  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Environment</h3>
        <p className="section-subtitle">Switch the lighting of your Himalayan scene.</p>
        <div className="day-night-toggle" role="tablist" aria-label="Day or night mode">
          <button role="tab" aria-selected={dayNight === "day"} className={dayNight === "day" ? "active" : ""} onClick={() => onSetDayNight("day")}>
            <Sun size={14} /> Day
          </button>
          <button role="tab" aria-selected={dayNight === "night"} className={dayNight === "night" ? "active" : ""} onClick={() => onSetDayNight("night")}>
            <Moon size={14} /> Night
          </button>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title">Themes</h3>
        <div className="theme-grid">
          {themeOrder.map(id => {
            const theme = themes[id]
            return (
              <button
                key={id}
                className={`theme-card ${themeId === id ? "active" : ""}`}
                onClick={() => onSetTheme(id)}
                aria-pressed={themeId === id}
              >
                <span
                  className="theme-card-swatch"
                  style={{ background: `linear-gradient(160deg, ${theme.sceneSkyBottom}, ${theme.sceneSkyTop})` }}
                  aria-hidden="true"
                />
                <span className="theme-card-icon" style={{ color: theme.primary }}>{THEME_ICON[id]}</span>
                <span className="theme-card-name">{theme.name}</span>
                <span className="theme-card-desc">{theme.description}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
