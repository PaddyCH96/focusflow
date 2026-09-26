"use client"
import { useCallback, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { Eraser, Save } from "lucide-react"
import type { ApiWhiteboard } from "@/lib/api/types"

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
}

export function WhiteboardView({
  boards,
  onSave,
  isLoading,
  isSaving,
  error,
}: {
  boards: ApiWhiteboard[]
  onSave: (title: string, content: string) => Promise<boolean>
  isLoading: boolean
  isSaving: boolean
  error: string | null
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const drawingRef = useRef(false)
  const [title, setTitle] = useState("")

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const stroke of strokesRef.current) {
      if (stroke.points.length < 2) continue
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (const p of stroke.points.slice(1)) ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
  }, [])

  const getPos = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = true
    strokesRef.current.push({ points: [getPos(e)], color: "#F5B15A" })
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const current = strokesRef.current[strokesRef.current.length - 1]
    current.points.push(getPos(e))
    redraw()
  }

  const handlePointerUp = () => {
    drawingRef.current = false
  }

  const clearCanvas = () => {
    strokesRef.current = []
    redraw()
  }

  const handleSave = async () => {
    const content = JSON.stringify(strokesRef.current)
    const ok = await onSave(title.trim() || "Untitled Board", content)
    if (ok) setTitle("")
  }

  const loadBoard = (board: ApiWhiteboard) => {
    try {
      strokesRef.current = JSON.parse(board.content) as Stroke[]
      redraw()
    } catch {
      // malformed saved content — ignore rather than crash the canvas
    }
  }

  return (
    <div className="view-panel">
      <div className="section-card">
        <h3 className="section-title">Mandala — Whiteboard</h3>
        <p className="section-subtitle">Freeform space for sketches and mind maps.</p>
        {error && <p className="api-error">{error}</p>}
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          className="whiteboard-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <div className="whiteboard-actions">
          <input
            className="task-input"
            placeholder="Board title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button className="btn-ghost" onClick={clearCanvas} type="button">
            <Eraser size={15} /> Clear
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            <Save size={15} /> {isSaving ? "Saving…" : "Save Board"}
          </button>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title">Saved Boards</h3>
        {isLoading ? (
          <p className="empty-hint">Loading boards…</p>
        ) : boards.length === 0 ? (
          <p className="empty-hint">No boards saved yet.</p>
        ) : (
          <ul className="whiteboard-list">
            {boards.map(board => (
              <li key={board.id}>
                <button className="whiteboard-list-item" onClick={() => loadBoard(board)}>
                  {board.title}
                  <span className="whiteboard-list-time">{new Date(board.timestamp).toLocaleDateString()}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
