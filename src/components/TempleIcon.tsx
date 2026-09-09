import { useMemo } from 'react'
import type { TempleStyle } from '../types'
import { sampleTemple, templeRadiusAt } from '../geometry/temple'

interface TempleIconProps {
  style: TempleStyle
  className?: string
}

const VIEW_W = 96
const VIEW_H = 36
const ORIGIN_X = 6
const ORIGIN_Y = 11
const LENGTH_SCALE = 0.72
const THICKNESS_SCALE = 1.7

export default function TempleIcon({ style, className }: TempleIconProps) {
  const { bodyPoints, hingePoint, tipPoint, tipRadius } = useMemo(() => {
    const N = 18
    const centers: { x: number; y: number }[] = []
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const s = sampleTemple(style, u)
      centers.push({ x: ORIGIN_X + u * 84, y: ORIGIN_Y + s.y * LENGTH_SCALE })
    }

    const top: string[] = []
    const bottom: string[] = []
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const radius = Math.max(templeRadiusAt(style, u) * THICKNESS_SCALE * 0.5, 0.9)
      const prev = centers[Math.max(i - 1, 0)]
      const next = centers[Math.min(i + 1, N)]
      const tx = next.x - prev.x
      const ty = next.y - prev.y
      const len = Math.hypot(tx, ty) || 1
      const nx = -ty / len
      const ny = tx / len
      const c = centers[i]
      top.push(`${(c.x + nx * radius).toFixed(2)},${(c.y + ny * radius).toFixed(2)}`)
      bottom.push(`${(c.x - nx * radius).toFixed(2)},${(c.y - ny * radius).toFixed(2)}`)
    }
    bottom.reverse()

    return {
      bodyPoints: [...top, ...bottom].join(' '),
      hingePoint: centers[0],
      tipPoint: centers[N],
      tipRadius: Math.max(templeRadiusAt(style, 1) * THICKNESS_SCALE * 0.5, 0.9),
    }
  }, [style])

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={className} aria-hidden="true" focusable="false">
      <circle cx={hingePoint.x} cy={hingePoint.y} r={2.2} fill="currentColor" opacity={0.5} />
      <polygon points={bodyPoints} fill="currentColor" />
      {style.endType === 'ball' && (
        <circle cx={tipPoint.x} cy={tipPoint.y} r={tipRadius * 2} fill="currentColor" />
      )}
      {style.endType === 'looped' && (
        <circle
          cx={tipPoint.x}
          cy={tipPoint.y}
          r={tipRadius * 2.1}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
        />
      )}
    </svg>
  )
}
