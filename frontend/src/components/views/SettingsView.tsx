"use client"

export function SettingsView({
  masterVolume,
  onSetMasterVolume,
  goal,
  onCycleGoal,
  onClearData,
}: {
  masterVolume: number
  onSetMasterVolume: (v: number) => void
  goal: number
  onCycleGoal: () => void
  onClearData: () => void
}) {
  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Settings</h3>

        <div className="settings-section">
          <label>Master Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={masterVolume}
            onChange={e => onSetMasterVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>

        <div className="settings-section">
          <label>Daily Goal</label>
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-title">{goal} sessions per day</span>
              <span className="settings-row-hint">Tap to cycle through 4 / 6 / 8 / 10</span>
            </div>
            <button className="btn-primary" onClick={onCycleGoal}>Change</button>
          </div>
        </div>

        <div className="settings-section">
          <label>Data</label>
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-title">Clear all local data</span>
              <span className="settings-row-hint">Removes tasks, sessions and preferences from this device</span>
            </div>
            <button
              className="btn-danger"
              onClick={() => {
                if (window.confirm("This will permanently delete all tasks, sessions and preferences stored on this device. Continue?")) {
                  onClearData()
                }
              }}
            >
              Clear data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
