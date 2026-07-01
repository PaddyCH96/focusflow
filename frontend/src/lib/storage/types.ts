export interface Session {
  id: string
  startTime: string
  duration: number
  type: "work" | "shortBreak" | "longBreak"
  completed: boolean
  timerType: "pomodoro" | "flowmodoro"
}

export interface TimerState {
  isRunning: boolean
  remaining: number
  mode: "work" | "shortBreak" | "longBreak"
  timerType: "pomodoro" | "flowmodoro"
}

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export type SoundId = "rain" | "ocean" | "stream" | "wind" | "forest" | "fireplace" | "cafe" | "night"

export interface SoundState {
  id: SoundId
  playing: boolean
  volume: number
}

export type ThemeId = "sunrise" | "daylight" | "sunset" | "midnight"

export type View = "focus" | "timer" | "tasks" | "insights" | "breath" | "ambient"
