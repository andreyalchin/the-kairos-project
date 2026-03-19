'use client'
import { useState, useEffect } from 'react'
import { RadarChart as RechartsRadar, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { DimensionScores } from '@/lib/types'

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness', conscientiousness: 'Conscientiousness', extraversion: 'Extraversion',
  agreeableness: 'Agreeableness', emotional_stability: 'Emotional Stability', honesty_humility: 'Honesty',
  cognitive_agility: 'Cognitive Agility', executive_function: 'Executive Function',
  attention_control: 'Attention Control', systems_thinking: 'Systems Thinking',
  creative_intelligence: 'Creativity', achievement_drive: 'Achievement', risk_tolerance: 'Risk Tolerance',
  autonomy_need: 'Autonomy', purpose_orientation: 'Purpose', competitive_drive: 'Competition',
  social_influence: 'Social Influence', conflict_navigation: 'Conflict Nav.', communication_style: 'Communication',
  collaboration_signature: 'Collaboration', leadership_drive: 'Leadership', founder_potential: 'Founder',
  strategic_orientation: 'Strategic', specialist_generalist: 'Generalist', innovation_index: 'Innovation',
  psychological_resilience: 'Resilience', growth_mindset: 'Growth Mindset',
  adaptability_quotient: 'Adaptability', learning_agility: 'Learning Agility',
}

interface CustomTickProps {
  x?: number
  y?: number
  payload?: { value: string }
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit'
  fontSize?: number
}

function CustomTick({ x = 0, y = 0, payload, textAnchor, fontSize = 11 }: CustomTickProps) {
  const label: string = payload?.value ?? ''
  const words = label.split(' ')

  if (!label || words.length === 1 || label.length <= 12) {
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#64748B" fontSize={fontSize}>
        <tspan x={x} dy="0.355em">{label}</tspan>
      </text>
    )
  }

  const mid = Math.ceil(words.length / 2)
  const line1 = words.slice(0, mid).join(' ')
  const line2 = words.slice(mid).join(' ')

  return (
    <text x={x} y={y} textAnchor={textAnchor} fill="#64748B" fontSize={fontSize}>
      <tspan x={x} dy="-0.3em">{line1}</tspan>
      <tspan x={x} dy="1.2em">{line2}</tspan>
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

  const data = Object.entries(scores)
    .filter(([key]) => key !== 'founder_potential')
    .map(([key, value]) => ({ subject: DIMENSION_LABELS[key] ?? key, score: value, fullMark: 100 }))

  const margin = isMobile
    ? { top: 10, right: 30, bottom: 10, left: 30 }
    : { top: 20, right: 80, bottom: 20, left: 80 }

  const fontSize = isMobile ? 9 : 11

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 420 : 500}>
      <RechartsRadar data={data} margin={margin}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={<CustomTick fontSize={fontSize} />} />
        <Radar name="Score" dataKey="score" stroke="#3730A3" fill="#3730A3" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip formatter={(v) => [`${v}`, 'Score']} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
