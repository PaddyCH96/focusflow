// A Session always represents a focus (work) attempt — the backend has no
// concept of breaks. "completed" means the timer ran out; "failed" means the
// user skipped away from an in-progress focus session.
export interface Session {
  id: number
  duration: number
  status: "completed" | "failed"
  timestamp: string
}

export interface TimerState {
  isRunning: boolean
  remaining: number
  mode: "work" | "shortBreak" | "longBreak"
  timerType: "pomodoro" | "flowmodoro"
}

export interface Task {
  id: number
  text: string
  completed: boolean
}

export type SoundId = "rain" | "ocean" | "stream" | "wind" | "forest" | "fireplace" | "cafe" | "night"

export interface SoundState {
  id: SoundId
  playing: boolean
  volume: number
}

export type ThemeId = "sunrise" | "daylight" | "sunset" | "midnight"

export type DayNight = "day" | "night"

export type View =
  | "timer"
  | "tasks"
  | "sounds"
  | "stats"
  | "themes"
  | "journal"
  | "voiceNotes"
  | "whiteboard"
  | "settings"
