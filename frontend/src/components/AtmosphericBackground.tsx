"use client"
import { useMemo } from "react"
import { motion } from "framer-motion"

function SunGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[60vw] h-[30vh]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(214,185,138,0.12) 0%, rgba(214,185,138,0.06) 30%, rgba(214,185,138,0.02) 50%, transparent 70%)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[40vw] h-[20vh]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,200,150,0.08) 0%, transparent 60%)",
        }}
      />
    </div>
  )
}

function MountainLayer({ peaks, color, opacity, yOffset, parallax }: {
  peaks: string
  color: string
  opacity: number
  yOffset: number
  parallax: number
}) {
  return (
    <motion.div
      animate={{ y: [0, -parallax, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-x-0 pointer-events-none"
      style={{ bottom: yOffset, height: "50vh", opacity }}
    >
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
      >
        <path d={peaks} fill={color} />
      </svg>
    </motion.div>
  )
}

// SVG path data for distinct Himalayan-style mountain ranges
const MOUNTAIN_LAYERS = [
  {
    // Far range — highest peaks, snow-capped, most faded
    peaks: "M0,400 L0,180 Q80,140 160,160 Q240,80 320,120 Q400,40 480,100 Q560,60 640,80 Q720,30 800,90 Q880,50 960,70 Q1040,100 1120,130 Q1200,80 1280,110 Q1360,150 1440,140 L1440,400 Z",
    color: "#2A2A35",
    opacity: 0.3,
    yOffset: 40,
    parallax: 3,
  },
  {
    // Mid-far range
    peaks: "M0,400 L0,220 Q100,195 200,210 Q300,175 400,190 Q500,160 600,175 Q700,185 800,170 Q900,190 1000,180 Q1100,195 1200,185 Q1300,200 1440,195 L1440,400 Z",
    color: "#1E1E28",
    opacity: 0.4,
    yOffset: 20,
    parallax: 5,
  },
  {
    // Mid range
    peaks: "M0,400 L0,260 Q150,240 300,255 Q450,230 600,245 Q750,225 900,240 Q1050,235 1200,250 Q1320,240 1440,255 L1440,400 Z",
    color: "#16161E",
    opacity: 0.5,
    yOffset: 0,
    parallax: 7,
  },
  {
    // Near range — darkest, most detailed
    peaks: "M0,400 L0,300 Q120,285 240,295 Q360,275 480,290 Q600,280 720,285 Q840,270 960,290 Q1080,280 1200,295 Q1320,285 1440,300 L1440,400 Z",
    color: "#0E0E12",
    opacity: 0.6,
    yOffset: -10,
    parallax: 10,
  },
]

function FogOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Bottom fog */}
      <motion.div
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 inset-x-0 h-[35vh]"
        style={{
          background: "linear-gradient(0deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.3) 40%, transparent 100%)",
        }}
      />
      {/* Mid fog bank */}
      <motion.div
        animate={{ x: [0, 30, 0], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] inset-x-0 h-[20vh]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(214,185,138,0.04) 30%, rgba(214,185,138,0.06) 50%, rgba(214,185,138,0.04) 70%, transparent 100%)",
          filter: "blur(40px)",
        }}
      />
      {/* Subtle incense/smoke wisps */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0, 0.08, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[40%] left-[20%] w-[20vw] h-[30vh]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200,180,160,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  )
}

export default function AtmosphericBackground() {
  const layers = useMemo(() => MOUNTAIN_LAYERS, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0B0B0B]">
      {/* Warm sunrise sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0B0B0B 0%, #0F0E0D 25%, #141110 40%, #1A1512 55%, #1E1814 70%, #161412 85%, #0B0B0B 100%)",
        }}
      />

      {/* Sunrise glow */}
      <SunGlow />

      {/* Mountain layers */}
      {layers.map((layer, i) => (
        <MountainLayer key={i} {...layer} />
      ))}

      {/* Fog */}
      <FogOverlay />

      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  )
}
