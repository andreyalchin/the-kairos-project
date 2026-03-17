'use client'
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

function CustomTick({ x, y, payload, textAnchor }: any) {
  const label: string = payload.value
  const words = label.split(' ')

  if (words.length === 1 || label.length <= 12) {
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#64748B" fontSize={11}>
        <tspan x={x} dy="0.355em">{label}</tspan>
      </text>
    )
  }

  const mid = Math.ceil(words.length / 2)
  const line1 = words.slice(0, mid).join(' ')
  const line2 = words.slice(mid).join(' ')

  return (
    <text x={x} y={y} textAnchor={textAnchor} fill="#64748B" fontSize={11}>
      <tspan x={x} dy="-0.3em">{line1}</tspan>
      <tspan x={x} dy="1.2em">{line2}</tspan>
    </text>
  )
}

interface Props { scores: DimensionScores }

export function DimensionRadarChart({ scores }: Props) {
  const data = Object.entries(scores)
    .filter(([key]) => key !== 'founder_potential')
    .map(([key, value]) => ({ subject: DIMENSION_LABELS[key] ?? key, score: value, fullMark: 100 }))

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RechartsRadar data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
        <Radar name="Score" dataKey="score" stroke="#3730A3" fill="#3730A3" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip formatter={(v) => [`${v}`, 'Score']} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
