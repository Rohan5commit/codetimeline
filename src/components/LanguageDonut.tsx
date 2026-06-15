'use client'

import { useMemo, useId } from 'react'
import type { LanguageData } from '@/lib/types'
import { LANG_COLORS, getLangColor } from '@/lib/colors'

interface Props {
  languages: LanguageData
  size?: number
}

export function LanguageDonut({ languages, size = 140 }: Props) {
  const filterId = useId()

  const slices = useMemo(() => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0)
    if (total === 0) return []
    const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6)
    let cumAngle = -Math.PI / 2
    return sorted.map(([name, bytes]) => {
      const fraction = bytes / total
      const angle = fraction * 2 * Math.PI
      const start = cumAngle
      cumAngle += angle
      return { name, fraction, start, end: cumAngle }
    })
  }, [languages])

  const cx = size / 2
  const cy = size / 2
  const outerR = size / 2 - 4
  const innerR = outerR * 0.58

  function describeArc(startAngle: number, endAngle: number, r: number) {
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  function slicePath(startAngle: number, endAngle: number) {
    const outerStart = { x: cx + outerR * Math.cos(startAngle), y: cy + outerR * Math.sin(startAngle) }
    const outerEnd = { x: cx + outerR * Math.cos(endAngle), y: cy + outerR * Math.sin(endAngle) }
    const innerEnd = { x: cx + innerR * Math.cos(endAngle), y: cy + innerR * Math.sin(endAngle) }
    const innerStart = { x: cx + innerR * Math.cos(startAngle), y: cy + innerR * Math.sin(startAngle) }
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' ')
  }

  if (slices.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-white/5 bg-white/[0.02]"
        style={{ width: size, height: size }}
      >
        <span className="text-center text-xs text-zinc-600">No language data</span>
      </div>
    )
  }

  const primaryLang = slices[0]?.name ?? ''

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="drop-shadow-lg" role="img" aria-label="Language distribution chart">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {slices.map((s) => (
            <path
              key={s.name}
              d={slicePath(s.start, s.end)}
              fill={getLangColor(s.name)}
              opacity={0.9}
              filter={`url(#${filterId})`}
              className="transition-opacity duration-300 hover:opacity-100"
            />
          ))}
          {/* Center circle */}
          <circle cx={cx} cy={cy} r={innerR - 2} fill="#0d0d1a" />
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui"
          >
            {primaryLang.slice(0, 10)}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="#64748b"
            fontSize="9"
            fontFamily="system-ui"
          >
            {Math.round((slices[0]?.fraction ?? 0) * 100)}%
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-1.5">
        {slices.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: getLangColor(s.name) }}
            />
            <span className="text-xs text-zinc-400">{s.name}</span>
            <span className="ml-auto pl-3 text-xs font-medium text-zinc-300">
              {Math.round(s.fraction * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
