'use client'
import { useState, useEffect } from 'react'
import { RadarChart as RechartsRadar, Radar, PolarGrid, PolarAngleAxis,
         ResponsiveContainer, Tooltip } from 'recharts'
import { DIMENSIONS, MAJOR_DIMS } from '@/lib/dimensions'
import type { DimensionScores, DimensionSlug } from '@/lib/types'

interface CustomTickProps {
  x?: number
  y?: number
  payload?: { value: string }
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit'
}

// Ordered list of all 35 active dims (founder_potential excluded)
const RADAR_ORDER = DIMENSIONS.filter(d => d.slug !== 'founder_potential')

function CustomTick({ x = 0, y = 0, payload, textAnchor, isMobile = false }: CustomTickProps & { isMobile?: boolean }) {
  const label = payload?.value ?? ''
  const slug = RADAR_ORDER.find(d => d.shortLabel === label)?.slug
  const isMajor = slug ? MAJOR_DIMS.has(slug as DimensionSlug) : false

  const fill = isMajor ? '#3730A3' : '#64748B'
  const fontWeight = isMajor ? 600 : 400
  const fontSize = isMobile ? (isMajor ? 9 : 8) : (isMajor ? 10 : 9)

  const words = label.split(' ')
  if (!label || words.length === 1 || label.length <= 10) {
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={fontSize} fontWeight={fontWeight}>
        <tspan x={x} dy="0.355em">{label}</tspan>
      </text>
    )
  }
  const mid = Math.ceil(words.length / 2)
  return (
    <text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={fontSize} fontWeight={fontWeight}>
      <tspan x={x} dy="-0.3em">{words.slice(0, mid).join(' ')}</tspan>
      <tspan x={x} dy="1.2em">{words.slice(mid).join(' ')}</tspan>
    </text>
  )
}

interface Props { scores: DimensionScores }

export function DimensionRadarChart({ scores }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const data = RADAR_ORDER.map(dim => {
    const score = scores[dim.slug] ?? 50
    return {
      subject: dim.shortLabel,
      slug: dim.slug,
      majorScore: MAJOR_DIMS.has(dim.slug as DimensionSlug) ? score : 50,
      minorScore: !MAJOR_DIMS.has(dim.slug as DimensionSlug) ? score : 50,
      fullMark: 100,
    }
  })

  const margin = isMobile
    ? { top: 10, right: 25, bottom: 10, left: 25 }
    : { top: 20, right: 80, bottom: 20, left: 80 }

  return (
    <div>
      <ResponsiveContainer width="100%" height={isMobile ? 460 : 520}>
        <RechartsRadar data={data} margin={margin}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={<CustomTick isMobile={isMobile} />}
          />
          <Radar
            name="Major"
            dataKey="majorScore"
            stroke="#3730A3"
            fill="#3730A3"
            fillOpacity={0.22}
            strokeWidth={2}
          />
          <Radar
            name="Minor"
            dataKey="minorScore"
            stroke="#0F766E"
            fill="#0F766E"
            fillOpacity={0.12}
            strokeWidth={1.5}
          />
          <Tooltip formatter={(v, name) => [`${v}`, name === 'Major' ? 'Major dimension' : 'Supporting dimension']} />
        </RechartsRadar>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block opacity-70" style={{ backgroundColor: '#3730A3' }} />
          Major dimensions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block opacity-60" style={{ backgroundColor: '#0F766E' }} />
          Supporting dimensions
        </span>
      </div>
    </div>
  )
}
