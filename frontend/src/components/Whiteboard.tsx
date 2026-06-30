"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Pencil, Square as RectIcon, Type, MousePointer2, Trash2, Save, Move } from "lucide-react"

type Element = {
  id: string
  type: 'pen' | 'rect' | 'text'
  points?: { x: number, y: number }[]
  x?: number
  y?: number
  width?: number
  height?: number
  text?: string
  color: string
}

type WhiteboardTool = 'pen' | 'rect' | 'text' | 'select'

const TOOL_OPTIONS: Array<{ id: WhiteboardTool; icon: typeof Pencil }> = [
  { id: 'pen', icon: Pencil },
  { id: 'rect', icon: RectIcon },
  { id: 'text', icon: Type },
  { id: 'select', icon: MousePointer2 },
]

const drawElements = (ctx: CanvasRenderingContext2D, items: Element[]) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  items.forEach(el => {
    const elColor = el.color || "#f49252"
    const renderColor = elColor.startsWith('var') ? "#f49252" : elColor
    ctx.strokeStyle = renderColor
    ctx.fillStyle = renderColor
    ctx.lineWidth = 2

    if (el.type === 'pen' && el.points && el.points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(el.points[0].x, el.points[0].y)
      el.points.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    } else if (el.type === 'rect' && typeof el.x === "number" && typeof el.y === "number" && typeof el.width === "number" && typeof el.height === "number") {
      ctx.strokeRect(el.x, el.y, el.width, el.height)
    } else if (el.type === 'text' && typeof el.text === "string" && typeof el.x === "number" && typeof el.y === "number") {
      ctx.font = "14px Inter"
      ctx.fillText(el.text, el.x, el.y)
    }
  })
}

export default function Whiteboard() {
  const [elements, setElements] = useState<Element[]>([])
  const [tool, setTool] = useState<WhiteboardTool>('pen')
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentElementRef = useRef<Element | null>(null)

  const draw = useCallback((items: Element[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawElements(ctx, items)
  }, [])

  const fetchLatestBoard = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/whiteboards")
      const data = await res.json()
      if (data && data.length > 0) {
        const latest = data[0]
        try {
          const parsedContent = JSON.parse(latest.content)
          if (Array.isArray(parsedContent)) {
            setElements(parsedContent as Element[])
          }
        } catch (e) {
          console.error("Failed to parse board content:", e)
        }
      }
    } catch (err) {
      console.error("Failed to fetch board:", err)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchLatestBoard()
    }, 0)
    return () => clearTimeout(timeout)
  }, [fetchLatestBoard])

  useEffect(() => {
    draw(elements)
  }, [elements, draw])

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent
    setIsDrawing(true)

    const id = Math.random().toString(36).slice(2, 11)
    const color = "#f49252"

    if (tool === 'pen') {
      currentElementRef.current = { id, type: 'pen', points: [{ x, y }], color }
    } else if (tool === 'rect') {
      currentElementRef.current = { id, type: 'rect', x, y, width: 0, height: 0, color }
    } else if (tool === 'text') {
      const text = prompt("Enter text:")
      if (text) {
        setElements(prev => [...prev, { id, type: 'text', x, y, text, color }])
      }
      setIsDrawing(false)
    }
  }

  const drawMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentElementRef.current) return
    const { offsetX: x, offsetY: y } = e.nativeEvent

    const el = currentElementRef.current
    if (el.type === 'pen') {
      el.points = [...(el.points || []), { x, y }]
    } else if (el.type === 'rect') {
      el.width = x - (el.x || 0)
      el.height = y - (el.y || 0)
    }

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    drawElements(ctx, elements)
    ctx.strokeStyle = el.color
    if (el.type === 'pen' && el.points && el.points.length > 0) {
      ctx.beginPath()
      ctx.moveTo(el.points[0].x, el.points[0].y)
      el.points.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    } else if (el.type === 'rect' && typeof el.x === "number" && typeof el.y === "number" && typeof el.width === "number" && typeof el.height === "number") {
      ctx.strokeRect(el.x, el.y, el.width, el.height)
    }
  }

  const endDrawing = () => {
    if (currentElementRef.current) {
      setElements(prev => [...prev, { ...currentElementRef.current! }])
    }
    setIsDrawing(false)
    currentElementRef.current = null
  }

  const saveBoard = async () => {
    try {
      await fetch("http://localhost:8000/whiteboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Mandala Board", content: JSON.stringify(elements) })
      })
      alert("Board saved to Treasury!")
    } catch (err) {
      console.error("Save failed:", err)
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-6 space-y-6 overflow-hidden">
      <div className="projection-card ethopic-glass flex items-center justify-between w-full max-w-5xl p-3 rounded-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Move size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-main italic">Mandala Canvas</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Unfold your flow-charts</p>
          </div>
        </div>

        <div className="flex items-center bg-ambient/50 rounded-xl p-1 border border-border-line">
          {TOOL_OPTIONS.map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`p-2 rounded-lg transition-all ${tool === t.id ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
            >
              <t.icon size={18} />
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setElements([])} className="p-2 text-text-muted hover:text-rose-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <button onClick={saveBoard} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all flex items-center space-x-2">
            <Save size={14} />
            <span>SAVE BOARD</span>
          </button>
        </div>
      </div>

      <div className="projection-card relative w-full max-w-5xl flex-grow bg-white/5 backdrop-blur-sm border-2 border-dashed border-border-line rounded-[2.5rem] overflow-hidden cursor-crosshair group">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          onMouseDown={startDrawing}
          onMouseMove={drawMove}
          onMouseUp={endDrawing}
          className="w-full h-full object-contain"
        />
        {!elements.length && (
          <div className="absolute inset-0 flex flex-center items-center justify-center pointer-events-none opacity-20 flex-col space-y-4">
            <Pencil size={64} className="text-text-muted animate-bounce" />
            <p className="text-sm font-medium tracking-[0.3em] uppercase">Void Canvas: Begin Drawing</p>
          </div>
        )}
      </div>
    </div>
  )
}
