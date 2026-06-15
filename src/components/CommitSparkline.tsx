'use client'

import { useMemo, useId } from 'react'
import type { CommitFrequencyPoint } from '@/lib/types'

interface Props {
  data: CommitFrequencyPoint[]
  width?: number
  height?: number
  color?: string
}

export function CommitSparkline({ data, width = 280, height = 48, color = '#6366f1' }: Props) {
  const gradientId = useId()
  const { points, area } = useMemo(() => {
    if (data.length < 2) return { points: '', area: '' }

    const counts = data.map((d) => d.count)
    const maxCount = Math.max(...counts, 1)
    const step = width / (data.length - 1)

    const pts = data.map((d, i) => ({
      x: i * step,
      y: height - (d.count / maxCount) * (height - 4) - 2,
    }))

    const linePoints = pts.map((p) => `${p.x},${p.y}`).join(' ')
    const areaPoints = [
      `0,${height}`,
      ...pts.map((p) => `${p.x},${p.y}`),
      `${width},${height}`,
    ].join(' ')

    return { points: linePoints, area: areaPoints }
  }, [data, width, height])

  if (data.length < 2) {
    return (
      <div className="flex h-14 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
        <span className="text-xs text-zinc-600">Not enough commit data to plot</span>
      </div>
    )
  }

  return (
    <svg width={width} height={height} className="overflow-visible" role="img" aria-label="Commit activity sparkline">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {area && (
        <polygon
          points={area}
          fill={`url(#${gradientId})`}
        />
      )}
      {points && (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
