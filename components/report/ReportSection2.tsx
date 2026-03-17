'use client'
import { DimensionRadarChart } from '@/components/charts/RadarChart'
import { HorizontalBarChart } from '@/components/charts/BarChart'
import { getPercentile } from '@/lib/norms'
import type { AssessmentResult } from '@/lib/types'

const DIM_DESCRIPTIONS: Record<string, string> = {
  openness: 'Receptivity to new ideas, experiences, and perspectives.',
  conscientiousness: 'Capacity for discipline, organization, and follow-through.',
  extraversion: 'Orientation toward social engagement and external stimulation.',
  agreeableness: 'Tendency toward cooperation, empathy, and interpersonal harmony.',
  emotional_stability: 'Resilience under pressure and consistency of emotional response.',
  honesty_humility: 'Commitment to authenticity, integrity, and freedom from self-promotion.',
  cognitive_agility: 'Speed and fluidity of adapting thinking across different problem types.',
  executive_function: 'Planning, organizing, prioritizing, and regulating goal-directed behavior.',
  attention_control: 'Sustaining focus and managing distraction under cognitive load.',
  systems_thinking: 'Modeling complex interdependencies and emergent patterns.',
  creative_intelligence: 'Richness of associative network and capacity for generative thinking.',
  achievement_drive: 'Drive to accomplish difficult goals and exceed your own standards.',
  risk_tolerance: 'Comfort operating in uncertain environments with real downside.',
  autonomy_need: 'Need for self-direction and independence in how you work.',
  purpose_orientation: 'Degree to which meaning and mission factor into your motivation.',
  competitive_drive: 'Need to outperform others and track progress against external benchmarks.',
  social_influence: 'Ability to persuade, inspire, and move others toward shared goals.',
  conflict_navigation: 'Effectiveness at engaging, managing, and resolving interpersonal tension.',
  communication_style: 'Approach to expressing ideas and adapting to different audiences.',
  collaboration_signature: 'Natural approach to shared work and team dynamics.',
  leadership_drive: 'Orientation toward taking charge, setting direction, and developing others.',
  founder_potential: 'Composite readiness to build, lead, and sustain new ventures.',
  strategic_orientation: 'Capacity for long-horizon planning and competitive positioning.',
  specialist_generalist: 'Orientation toward depth vs. breadth of expertise.',
  innovation_index: 'Drive and capacity to generate breakthrough ideas and novel solutions.',
  psychological_resilience: 'Capacity to recover, adapt, and grow through adversity.',
  growth_mindset: 'Belief in the malleability of ability and orientation toward development.',
  adaptability_quotient: 'Effectiveness at adjusting to changing conditions and new environments.',
  learning_agility: 'Speed and effectiveness of acquiring and applying new knowledge.',
}

function DimCard({ slug, score, variant }: { slug: string; score: number; variant: 'super' | 'growth' }) {
  const percentile = Math.round(getPercentile(slug, score))
  const label = slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const desc = DIM_DESCRIPTIONS[slug] ?? ''
  const isSuper = variant === 'super'

  return (
    <div className={`p-4 rounded-2xl border ${isSuper ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${isSuper ? 'text-teal-800' : 'text-slate-600'}`}>{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isSuper ? 'bg-teal text-white' : 'bg-slate-200 text-slate-600'}`}>
            p{percentile}
          </span>
          <span className={`font-bold text-sm ${isSuper ? 'text-teal' : 'text-slate-500'}`}>{score}</span>
        </div>
      </div>
      <div className="h-1.5 bg-white rounded-full mb-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${isSuper ? 'bg-gradient-to-r from-teal to-teal-400' : 'bg-slate-300'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {desc && <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>}
    </div>
  )
}

interface Props { result: AssessmentResult; onSentinelRef: (el: HTMLDivElement | null) => void }

export function ReportSection2({ result, onSentinelRef }: Props) {
  const scores = result.scores
  const sorted = Object.entries(scores)
    .filter(([k]) => k !== 'founder_potential')
    .sort(([, a], [, b]) => b - a)
  const superpowers = sorted.slice(0, 3)
  const growthAreas = sorted.slice(-2)

  const barItems = sorted.map(([k, v]) => ({
    label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    score: v,
    percentile: Math.round(getPercentile(k, v)),
  }))

  return (
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold text-text">Your Psychological Fingerprint</h2>
      <DimensionRadarChart scores={scores} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal inline-block" />
            <h3 className="font-semibold text-teal">Superpowers</h3>
          </div>
          <p className="text-xs text-slate-400 -mt-2">Your three highest-scoring dimensions relative to population norms.</p>
          {superpowers.map(([k, v]) => (
            <DimCard key={k} slug={k} score={v} variant="super" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
            <h3 className="font-semibold text-slate-500">Growth Areas</h3>
          </div>
          <p className="text-xs text-slate-400 -mt-2">Your two lowest-scoring dimensions — highest-leverage development targets.</p>
          {growthAreas.map(([k, v]) => (
            <DimCard key={k} slug={k} score={v} variant="growth" />
          ))}
        </div>
      </div>

      <HorizontalBarChart items={barItems} />
      <div ref={onSentinelRef} id="section-2-sentinel" className="h-px" />
    </section>
  )
}
