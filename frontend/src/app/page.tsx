"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize, Shield, Plus, Palette } from "lucide-react"
import Timer from "@/components/Timer"
import Stats from "@/components/Stats"
import TaskList from "@/components/TaskList"
import Timeline from "@/components/Timeline"
import ActivityGraph from "@/components/ActivityGraph"
import AudioPlayer from "@/components/AudioPlayer"
import AtmosphericBackground from "@/components/AtmosphericBackground"
import WisdomPanel from "@/components/WisdomPanel"
import NewsPanel from "@/components/NewsPanel"
import VoiceNotes from "@/components/VoiceNotes"
import Whiteboard from "@/components/Whiteboard"
import { useTheme } from "@/components/ThemeContext"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [zenMode, setZenMode] = useState(false)
  const [strictMode, setStrictMode] = useState(false)
  
  // Timer Mode (Pomodoro vs Break vs Flowmodoro) is lifted here
  const [timerType, setTimerType] = useState<"pomodoro" | "flowmodoro">("pomodoro")
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [workspace, setWorkspace] = useState<"dashboard" | "voice" | "whiteboard">("dashboard")

  return (
    <main className={`projection-shell flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative min-h-screen bg-ambient text-text-main transition-colors duration-700`}>
      
      {/* Dynamic Immersive Theme Background Sync */}
      <AtmosphericBackground />

      {/* Zen Overlay (Dulls the background sharply) */}
      <AnimatePresence>
        {zenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10 bg-ambient/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-30">
        <motion.h1 
           animate={{ opacity: zenMode ? 0.3 : 1 }}
           className="text-xl font-bold tracking-tight text-text-main"
        >
          {zenMode ? "zen." : "FocusFlow"}
        </motion.h1>
        
        <div className="flex items-center space-x-3">
          {/* Theme Engine shifted from Sidebar to Header */}
          <div className="flex items-center bg-surface-hover/50 backdrop-blur-md rounded-xl p-1 border border-border-line/50 space-x-1 group relative">
             <button title="Theme Engine" className="p-2 rounded-lg text-text-muted hover:text-primary transition-all">
                <Palette size={18} />
             </button>
             {/* Expandable Theme Picker */}
             <div className="absolute right-0 top-12 flex flex-col space-y-1 items-start opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all p-3 bg-surface border border-border-line rounded-xl shadow-2xl z-50 w-48">
                <button onClick={() => setTheme("deep-space")} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg whitespace-nowrap ${theme==='deep-space' ? 'bg-primary text-white': 'text-text-muted hover:bg-surface-hover'}`}>🌌 Deep Space</button>
                <button onClick={() => setTheme("forest-zen")} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg whitespace-nowrap ${theme==='forest-zen' ? 'bg-primary text-white': 'text-text-muted hover:bg-surface-hover'}`}>🌲 Forest Zen</button>
                <button onClick={() => setTheme("cyberpunk")} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg whitespace-nowrap ${theme==='cyberpunk' ? 'bg-primary text-white': 'text-text-muted hover:bg-surface-hover'}`}>⚡ Cyberpunk</button>
                <button onClick={() => setTheme("vintage")} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg whitespace-nowrap ${theme==='vintage' ? 'bg-primary text-white': 'text-text-muted hover:bg-surface-hover'}`}>🕰️ Vintage</button>
                <div className="w-full h-px bg-border-line my-1" />
                <button onClick={() => setTheme("sattva")} className={`w-full text-left px-3 py-1.5 text-xs rounded-lg whitespace-nowrap ${theme==='sattva' ? 'bg-primary text-white': 'text-text-muted hover:bg-surface-hover'}`}>🪷 Sattva (Pure)</button>
             </div>

             <button 
                onClick={() => setStrictMode(!strictMode)}
                className={`p-2 rounded-lg transition-all border border-transparent ${strictMode ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'text-text-muted hover:text-rose-500'}`}
                title="Strict Mode"
             >
                <Shield size={18} />
             </button>
          </div>

          <div className="h-8 w-px bg-border-line/30 mx-2" />
          
          {/* Workspace Switcher */}
          <div className="flex items-center bg-surface-hover/30 backdrop-blur-md rounded-xl p-1 border border-border-line/50 space-x-1">
             <button 
                onClick={() => setWorkspace("dashboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${workspace==='dashboard' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
             >
                FOCUS
             </button>
             <button 
                onClick={() => setWorkspace("voice")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${workspace==='voice' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
             >
                VANI
             </button>
             <button 
                onClick={() => setWorkspace("whiteboard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${workspace==='whiteboard' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
             >
                MANDALA
             </button>
          </div>

          <div className="h-8 w-px bg-border-line/30 mx-2" />

          <button 
            onClick={() => setZenMode(!zenMode)}
            className={`p-2 rounded-lg transition-all ${zenMode ? 'bg-surface text-primary border border-border-line shadow-sm' : 'hover:bg-surface-hover text-text-muted'}`}
            title="Toggle Zen Mode"
          >
            <Maximize size={18} />
          </button>
        </div>
      </header>


      <div className="z-20 w-full flex-grow flex flex-col items-center justify-start overflow-hidden pt-8">
        <AnimatePresence mode="wait">
          {workspace === "dashboard" ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(20px)" }}
              className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-6"
            >
              {/* Dashboard Content */}
              <AnimatePresence>
                 {!zenMode && (
                   <motion.div 
                     initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                     animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                     exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                     className="hidden lg:block shrink-0 ml-16"
                   >
                     <div className="flex flex-col space-y-4">
                       <WisdomPanel />
                       <div className="flex flex-col space-y-4 max-w-sm">
                          <Stats />
                          <NewsPanel />
                       </div>
                       <Timeline />
                     </div>
                   </motion.div>
                 )}
              </AnimatePresence>

              <div className="flex flex-col items-center space-y-8 w-full max-w-2xl">
                  <motion.div 
                    layout
                    className={`projection-card ethopic-glass w-full rounded-3xl p-8 transition-all duration-700 relative`}
                  >
                    <div className="absolute top-6 right-8">
                       <AudioPlayer mode={mode} />
                    </div>
                    <Timer mode={mode} setMode={setMode} strictMode={strictMode} timerType={timerType} setTimerType={setTimerType} />
                  </motion.div>
                  
                  <AnimatePresence>
                    {!zenMode && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
                        <ActivityGraph />
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <AnimatePresence>
                 {!zenMode && (
                   <motion.div 
                     initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                     animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                     exit={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                     className="hidden lg:block shrink-0"
                   >
                     <TaskList />
                   </motion.div>
                 )}
              </AnimatePresence>
            </motion.div>
          ) : workspace === "voice" ? (
             <motion.div 
               key="voice"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="w-full"
             >
                <VoiceNotes />
             </motion.div>
          ) : (
             <motion.div 
               key="whiteboard"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, filter: "blur(10px)" }}
               className="w-full h-full min-h-[80vh]"
             >
                <Whiteboard />
             </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* Floating Action Button for Quick Task Entry */}
      <AnimatePresence>
         {!zenMode && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute bottom-8 right-8 z-50 flex flex-col items-end space-y-4"
            >
              {showTaskInput && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl shadow-2xl w-64 bg-surface border border-border-line`}>
                   <p className="text-xs font-semibold text-text-muted mb-2 tracking-wider">QUICK ADD KANBAN</p>
                   <input type="text" placeholder="Task title..." onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                         fetch("http://localhost:8000/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: e.currentTarget.value }) })
                         e.currentTarget.value = ""
                         setShowTaskInput(false)
                      }
                   }} className="w-full bg-ambient px-3 py-2 rounded focus:ring ring-primary/50 outline-none text-sm text-text-main" />
                </motion.div>
              )}
              <button 
                onClick={() => setShowTaskInput(!showTaskInput)}
                className={`p-4 rounded-full text-white shadow-[0_0_20px_var(--color-primary)] transition-transform hover:scale-110 active:scale-95 ${showTaskInput ? 'bg-ambient border border-border-line text-text-muted' : 'bg-primary'}`}
              >
                <Plus size={24} className={showTaskInput ? 'rotate-45 transition-transform' : 'transition-transform'} />
              </button>
            </motion.div>
         )}
      </AnimatePresence>

    </main>
  );
}
