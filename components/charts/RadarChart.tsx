'use client'
import { useState, useCallback } from 'react'
import { DIMENSIONS } from '@/lib/dimensions'
import { getPercentile } from '@/lib/norms'
import type { DimensionScores, DimensionSlug } from '@/lib/types'

// ── Data setup ────────────────────────────────────────────────────────────────
type DimMeta = (typeof DIMENSIONS)[number]
const ACTIVE = DIMENSIONS.filter(d => d.slug !== 'founder_potential') // 35 dims

const CLUSTERS = [
  { tier: 1 as const, label: 'Foundation' },
  { tier: 2 as const, label: 'Cognitive' },
  { tier: 3 as const, label: 'Motivational' },
  { tier: 4 as const, label: 'Interpersonal' },
  { tier: 5 as const, label: 'Career' },
  { tier: 6 as const, label: 'Growth' },
]

// ── SVG geometry ──────────────────────────────────────────────────────────────
const CX = 290, CY = 290        // chart centre
const R_IN  = 58                 // inner hole radius
const R_OUT = 218                // outer edge at score = 100
const DR    = R_OUT - R_IN       // data range in px
const LR    = 256                // cluster label radius

// Angular layout
const CLUSTER_GAP = 4.5                             // extra degrees between clusters
const BAR_SLOT    = (360 - 6 * CLUSTER_GAP) / 35   // ≈ 9.51° per dim slot
const BAR_W       = 8.0                             // bar arc width in degrees
const BAR_OFFSET  = (BAR_SLOT - BAR_W) / 2         // centres bar in its slot

// ── Build angular positions ───────────────────────────────────────────────────
type BarEntry = {
  dim: DimMeta
  startAngle: number
  endAngle: number
  midAngle: number
  clusterLabel: string
}

function buildLayout(): BarEntry[] {
  const out: BarEntry[] = []
  let cursor = -90 // start at 12 o'clock

  for (const cl of CLUSTERS) {
    const dims = ACTIVE.filter(d => d.tier === cl.tier)
    for (const dim of dims) {
      const start = cursor + BAR_OFFSET
      out.push({
        dim,
        startAngle: start,
        endAngle:   start + BAR_W,
        midAngle:   start + BAR_W / 2,
        clusterLabel: cl.label,
      })
      cursor += BAR_SLOT
    }
    cursor += CLUSTER_GAP
  }
  return out
}

const LAYOUT = buildLayout()

// Midpoint angle for each cluster label
const CLUSTER_MIDS = CLUSTERS.map(cl => {
  const items = LAYOUT.filter(l => l.clusterLabel === cl.label)
  return {
    label: cl.label,
    midAngle: (items[0].midAngle + items[items.length - 1].midAngle) / 2,
  }
})

// ── SVG helpers ───────────────────────────────────────────────────────────────
const toRad = (deg: number) => deg * Math.PI / 180

function sector(r1: number, r2: number, aDeg: number, bDeg: number): string {
  const a = toRad(aDeg), b = toRad(bDeg)
  const lg = bDeg - aDeg > 180 ? 1 : 0
  const p = (r: number, t: number) => `${CX + r * Math.cos(t)} ${CY + r * Math.sin(t)}`
  return `M ${p(r1,a)} L ${p(r2,a)} A ${r2} ${r2} 0 ${lg} 1 ${p(r2,b)} L ${p(r1,b)} A ${r1} ${r1} 0 ${lg} 0 ${p(r1,a)} Z`
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { scores: DimensionScores }

export function DimensionRadarChart({ scores }: Props) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)

  const onSvgMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const onSvgLeave = useCallback(() => {
    setHoveredSlug(null)
    setMouse(null)
  }, [])

  // Reference rings
  const rings = [
    { r: R_IN + 0.25 * DR, label: '25', dashed: true,  bold: false },
    { r: R_IN + 0.50 * DR, label: '50', dashed: true,  bold: true  },
    { r: R_IN + 0.75 * DR, label: '75', dashed: true,  bold: false },
    { r: R_OUT,             label: '100', dashed: false, bold: false },
  ]

  const hovEntry   = hoveredSlug ? LAYOUT.find(l => l.dim.slug === hoveredSlug) ?? null : null
  const hovScore   = hovEntry ? (scores[hovEntry.dim.slug as DimensionSlug] ?? 50) : 0
  const hovPercent = hovEntry ? Math.round(getPercentile(hovEntry.dim.slug as DimensionSlug, hovScore)) : 0

  return (
    <div className="relative select-none">
      <svg
        viewBox="0 0 580 580"
        className="w-full"
        onMouseMove={onSvgMouseMove}
        onMouseLeave={onSvgLeave}
        aria-label="Dimension profile chart"
      >
        {/* ── Background disc ── */}
        <circle cx={CX} cy={CY} r={R_OUT + 2} fill="#F8FAFC" />

        {/* ── Reference rings ── */}
        {rings.map(({ r, label, dashed, bold }) => (
          <g key={label}>
            <circle
              cx={CX} cy={CY} r={r}
              fill="none"
              stroke={bold ? '#CBD5E1' : '#E2E8F0'}
              strokeWidth={bold ? 1.25 : 0.75}
              strokeDasharray={dashed ? '3 4' : undefined}
            />
            <text
              x={CX + r + 3} y={CY + 3.5}
              fontSize="7" fill="#94A3B8"
              fontFamily="system-ui, sans-serif"
            >{label}</text>
          </g>
        ))}

        {/* ── Bars ── */}
        {LAYOUT.map(({ dim, startAngle, endAngle }) => {
          const score  = scores[dim.slug as DimensionSlug] ?? 50
          const rBar   = Math.max(R_IN + (score / 100) * DR, R_IN + 4)
          const isHov  = hoveredSlug === dim.slug
          const fill   = dim.major ? '#3730A3' : '#0F766E'

          return (
            <path
              key={dim.slug}
              d={sector(R_IN + 1, rBar, startAngle, endAngle)}
              fill={fill}
              fillOpacity={isHov ? 0.92 : 0.62}
              stroke={fill}
              strokeWidth={isHov ? 1.5 : 0.4}
              strokeOpacity={isHov ? 1 : 0.5}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.12s' }}
              onMouseEnter={() => setHoveredSlug(dim.slug)}
            />
          )
        })}

        {/* ── Centre hole ── */}
        <circle cx={CX} cy={CY} r={R_IN - 1} fill="white" />
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="system-ui, sans-serif" fontWeight="600">Score</text>
        <text x={CX} y={CY + 7} textAnchor="middle" fontSize="7.5" fill="#CBD5E1" fontFamily="system-ui, sans-serif">0–100</text>

        {/* ── Cluster labels ── */}
        {CLUSTER_MIDS.map(({ label, midAngle }) => {
          const rad = toRad(midAngle)
          const lx  = CX + LR * Math.cos(rad)
          const ly  = CY + LR * Math.sin(rad)
          return (
            <text
              key={label}
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fill="#94A3B8"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
              letterSpacing="0.07em"
            >
              {label.toUpperCase()}
            </text>
          )
        })}
      </svg>

      {/* ── Legend ── */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: '#3730A3', opacity: 0.7 }} />
          Major dimensions (20)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: '#0F766E', opacity: 0.7 }} />
          Supporting dimensions (15)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 inline-block border-t border-dashed border-slate-300 mt-0.5" />
          Average (50)
        </span>
      </div>

      {/* ── Tooltip ── */}
      {hovEntry && mouse && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-800 text-white rounded-2xl px-4 py-3.5 shadow-2xl w-56"
          style={{
            left: Math.min(Math.max(mouse.x + 18, 8), window.innerWidth - 240),
            top:  Math.min(mouse.y + 12, window.innerHeight - 160),
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className="font-bold text-sm leading-snug">{hovEntry.dim.label}</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 mt-0.5"
              style={{
                background: hovEntry.dim.major ? 'rgba(99,102,241,0.35)' : 'rgba(20,184,166,0.3)',
                color:      hovEntry.dim.major ? '#a5b4fc' : '#5eead4',
              }}
            >
              {hovEntry.dim.major ? 'Major' : 'Supporting'}
            </span>
          </div>

          {/* Score + percentile */}
          <div className="flex items-baseline gap-3 mb-2.5">
            <span
              className="text-3xl font-black leading-none"
              style={{ color: hovEntry.dim.major ? '#818cf8' : '#2dd4bf' }}
            >
              {hovScore}
            </span>
            <div className="text-slate-400 text-xs leading-snug">
              <div>p{hovPercent}</div>
              <div className="text-slate-500">/100</div>
            </div>
            {/* Mini bar */}
            <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden ml-1">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${hovScore}%`,
                  background: hovEntry.dim.major ? '#6366f1' : '#14b8a6',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed text-[11px]">{hovEntry.dim.description}</p>

          {/* Cluster tag */}
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-wider font-medium">
            {hovEntry.clusterLabel}
          </p>
        </div>
      )}
    </div>
  )
}
