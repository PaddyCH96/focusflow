"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "@/components/ThemeContext"
import { useAudio } from "@/lib/hooks/useAudio"
import { useTasks } from "@/lib/hooks/useTasks"
import { useSessions } from "@/lib/hooks/useSessions"
import { useTimer } from "@/lib/hooks/useTimer"
import { useDailyGoal } from "@/lib/hooks/useDailyGoal"
import { useJournal } from "@/lib/hooks/useJournal"
import { useVoiceNotes } from "@/lib/hooks/useVoiceNotes"
import { useWhiteboards } from "@/lib/hooks/useWhiteboards"
import { localStorageProvider } from "@/lib/storage"
import { migrateLocalDataToBackend } from "@/lib/migrateLocalData"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { BottomBar } from "@/components/layout/BottomBar"
import { TimerDial } from "@/components/timer/TimerDial"
import { RightRail } from "@/components/rail/RightRail"
import { TasksView } from "@/components/views/TasksView"
import { SoundsView } from "@/components/views/SoundsView"
import { StatsView } from "@/components/views/StatsView"
import { ThemesView } from "@/components/views/ThemesView"
import { JournalView } from "@/components/views/JournalView"
import { VoiceNotesView } from "@/components/views/VoiceNotesView"
import { WhiteboardView } from "@/components/views/WhiteboardView"
import { SettingsView } from "@/components/views/SettingsView"
const Scene3D = dynamic(() => import("@/components/Scene3D").then(m => ({ default: m.Scene3D })), { ssr: false })
import type { View, TimerState } from "@/lib/storage/types"
import { DURATIONS } from "@/lib/constants"

const STORAGE_KEYS = [
  "focusflow_theme",
  "focusflow_day_night",
  "focusflow_timer",
  "focusflow_tasks",
  "focusflow_sessions",
  "focusflow_sounds",
  "focusflow_daily_goal",
  "focusflow_migrated_v1",
]

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString()
}

function nextModeAfter(mode: TimerState["mode"], completedWorkCountAfter: number): TimerState["mode"] {
  if (mode === "work") return completedWorkCountAfter % 4 === 0 ? "longBreak" : "shortBreak"
  return "work"
}

export function AppShell() {
  const { themeId, setTheme, dayNight, toggleDayNight } = useTheme()
  const { sounds, masterVolume, toggle: toggleSound, setVolume, setMasterVolume, stopAll } = useAudio()
  const { tasks, addTask, toggleTask, deleteTask, isLoading: tasksLoading, error: tasksError, reload: reloadTasks } = useTasks()
  const { sessions, logSession, reload: reloadSessions } = useSessions()
  const { goal, cycleGoal } = useDailyGoal()
  const journal = useJournal()
  const voiceNotes = useVoiceNotes()
  const whiteboards = useWhiteboards()

  const [activeView, setActiveView] = useState<View>("timer")
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const taskInputRef = useRef<HTMLInputElement>(null)
  const pendingFocusTasks = useRef(false)

  useEffect(() => {
    migrateLocalDataToBackend().then(migrated => {
      if (migrated) {
        reloadTasks()
        reloadSessions()
      }
    })
  }, [reloadTasks, reloadSessions])

  const todayCompletedWorkCount = useMemo(
    () => sessions.filter(s => s.status === "completed" && isToday(s.timestamp)).length,
    [sessions]
  )

  const onSessionCompleteRef = useRef<() => void>(() => {})
  const handleSessionComplete = useCallback(() => onSessionCompleteRef.current(), [])

  const { timer, start, pause, reset, setMode, remainingFormatted } = useTimer(handleSessionComplete)

  useEffect(() => {
    onSessionCompleteRef.current = () => {
      if (timer.mode === "work") {
        logSession(DURATIONS.work, "completed")
      }
      const completedAfter = timer.mode === "work" ? todayCompletedWorkCount + 1 : todayCompletedWorkCount
      setMode(nextModeAfter(timer.mode, completedAfter))
    }
  })

  const timerProgress = useMemo(() => {
    const total = DURATIONS[timer.mode]
    return 1 - timer.remaining / total
  }, [timer.remaining, timer.mode])

  const handleSkip = useCallback(() => {
    if (timer.mode === "work" && timer.remaining < DURATIONS.work) {
      logSession(DURATIONS.work - timer.remaining, "failed")
    }
    setMode(nextModeAfter(timer.mode, todayCompletedWorkCount))
  }, [setMode, timer.mode, timer.remaining, todayCompletedWorkCount, logSession])

  const handleQuickAdd = useCallback(() => {
    pendingFocusTasks.current = true
    setActiveView("tasks")
    setMobileNavOpen(false)
  }, [])

  useEffect(() => {
    if (activeView === "tasks" && pendingFocusTasks.current) {
      pendingFocusTasks.current = false
      taskInputRef.current?.focus()
    }
  }, [activeView])

  const handleClearData = useCallback(() => {
    STORAGE_KEYS.forEach(key => localStorageProvider.remove(key))
    window.location.reload()
  }, [])

  return (
    <div className="app-shell">
      <Scene3D />
      <div className="scene-scrim" aria-hidden="true" />

      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        expanded={sidebarExpanded}
        onToggleExpanded={() => setSidebarExpanded(v => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="main-column">
        <TopBar
          onOpenHistory={() => setActiveView("stats")}
          onQuickAdd={handleQuickAdd}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />

        {activeView === "timer" && (
          <div className="stage">
            <div className="stage-center">
              <TimerDial
                mode={timer.mode}
                timeFormatted={remainingFormatted}
                progress={timerProgress}
                isRunning={timer.isRunning}
                onStart={start}
                onPause={pause}
                onReset={reset}
                onSkip={handleSkip}
                onSetMode={setMode}
              />
            </div>
            <RightRail
              sessions={sessions}
              tasks={tasks}
              goal={goal}
              onCycleGoal={cycleGoal}
              onToggleTask={toggleTask}
            />
          </div>
        )}

        {activeView === "tasks" && (
          <TasksView
            ref={taskInputRef}
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            isLoading={tasksLoading}
            error={tasksError}
          />
        )}

        {activeView === "sounds" && (
          <SoundsView
            sounds={sounds}
            masterVolume={masterVolume}
            onSetMasterVolume={setMasterVolume}
            onToggleSound={toggleSound}
            onSetVolume={setVolume}
          />
        )}

        {activeView === "stats" && <StatsView sessions={sessions} />}

        {activeView === "journal" && (
          <JournalView
            entries={journal.entries}
            onAddEntry={journal.addEntry}
            isLoading={journal.isLoading}
            error={journal.error}
          />
        )}

        {activeView === "voiceNotes" && (
          <VoiceNotesView
            notes={voiceNotes.notes}
            onUpload={voiceNotes.uploadNote}
            isLoading={voiceNotes.isLoading}
            isUploading={voiceNotes.isUploading}
            error={voiceNotes.error}
          />
        )}

        {activeView === "whiteboard" && (
          <WhiteboardView
            boards={whiteboards.boards}
            onSave={whiteboards.saveBoard}
            isLoading={whiteboards.isLoading}
            isSaving={whiteboards.isSaving}
            error={whiteboards.error}
          />
        )}

        {activeView === "themes" && (
          <ThemesView
            themeId={themeId}
            onSetTheme={setTheme}
            dayNight={dayNight}
            onSetDayNight={mode => { if (mode !== dayNight) toggleDayNight() }}
          />
        )}

        {activeView === "settings" && (
          <SettingsView
            masterVolume={masterVolume}
            onSetMasterVolume={setMasterVolume}
            goal={goal}
            onCycleGoal={cycleGoal}
            onClearData={handleClearData}
          />
        )}

        <BottomBar
          sounds={sounds}
          masterVolume={masterVolume}
          onSetMasterVolume={setMasterVolume}
          onToggleSound={toggleSound}
          onStopAll={stopAll}
          dayNight={dayNight}
          onToggleDayNight={toggleDayNight}
        />
      </div>
    </div>
  )
}
