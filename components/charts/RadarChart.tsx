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

interface Props { scores: DimensionScores }

export function DimensionRadarChart({ scores }: Props) {
  const data = Object.entries(scores)
    .filter(([key]) => key !== 'founder_potential')
    .map(([key, value]) => ({ subject: DIMENSION_LABELS[key] ?? key, score: value, fullMark: 100 }))

  return (
    <ResponsiveContainer width="100%" height={420}>
      <RechartsRadar data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
        <Radar name="Score" dataKey="score" stroke="#3730A3" fill="#3730A3" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip formatter={(v) => [`${v}`, 'Score']} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
