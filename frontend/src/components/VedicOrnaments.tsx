"use client"
import { useTheme } from "./ThemeContext"

export function MandalaPattern({ className, ariaHidden }: { className?: string; ariaHidden?: boolean }) {
  const { colors } = useTheme()
  const size = 120
  const cx = size / 2
  const cy = size / 2
  const outerR = size * 0.45
  const innerR = size * 0.35

  const petals = 8
  const petalPoints: string[] = []
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2 - Math.PI / 2
    const nextAngle = ((i + 1) / petals) * Math.PI * 2 - Math.PI / 2
    const midR = (outerR + innerR) / 2
    const r1 = outerR
    const r2 = innerR
    petalPoints.push(
      `${(cx + Math.cos(angle) * r1).toFixed(0)},${(cy + Math.sin(angle) * r1).toFixed(0)}`
    )
    petalPoints.push(
      `${(cx + Math.cos(angle + (nextAngle - angle) * 0.5) * midR).toFixed(0)},${(cy + Math.sin(angle + (nextAngle - angle) * 0.5) * midR).toFixed(0)}`
    )
    petalPoints.push(
      `${(cx + Math.cos(nextAngle) * r2).toFixed(0)},${(cy + Math.sin(nextAngle) * r2).toFixed(0)}`
    )
  }

  const ringCount = 3
  const rings: { r: number; dash: string }[] = []
  for (let i = 0; i < ringCount; i++) {
    const r = innerR + (outerR - innerR) * ((i + 1) / (ringCount + 1))
    rings.push({
      r,
      dash: `${(r * 0.1).toFixed(0)} ${(r * 0.05).toFixed(0)}`,
    })
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden={ariaHidden}
      style={{ opacity: 0.3 }}
    >
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={ring.r}
          fill="none"
          stroke={colors.primary}
          strokeWidth={0.5}
          strokeDasharray={ring.dash}
        />
      ))}
      <polygon
        points={petalPoints.join(" ")}
        fill="none"
        stroke={colors.primary}
        strokeWidth={0.5}
        opacity={0.5}
      />
      <circle cx={cx} cy={cy} r={innerR * 0.3} fill={colors.primary} opacity={0.15} />
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={colors.primary} strokeWidth={0.3} opacity={0.3} />
    </svg>
  )
}

export function TempleSilhouette({
  height = 60,
  className,
  ariaHidden,
}: {
  height?: number
  className?: string
  ariaHidden?: boolean
}) {
  const width = height * 0.6
  const tierH = height * 0.25
  const baseW = width
  const topW = width * 0.4
  const spireH = height * 0.15

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden={ariaHidden}
      style={{ opacity: 0.15 }}
    >
      <rect x={0} y={height * 0.95} width={baseW} height={tierH} rx={1} fill="currentColor" />
      <rect
        x={(baseW - baseW * 0.8) / 2}
        y={height * 0.7}
        width={baseW * 0.8}
        height={tierH}
        rx={1}
        fill="currentColor"
      />
      <rect
        x={(baseW - baseW * 0.6) / 2}
        y={height * 0.45}
        width={baseW * 0.6}
        height={tierH}
        rx={1}
        fill="currentColor"
      />
      <polygon
        points={`${(baseW - topW) / 2},${height * 0.45} ${(baseW + topW) / 2},${height * 0.45} ${baseW / 2},${height * 0.3}`}
        fill="currentColor"
      />
      <line
        x1={baseW / 2}
        y1={height * 0.3}
        x2={baseW / 2}
        y2={height * 0.3 - spireH}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  )
}
