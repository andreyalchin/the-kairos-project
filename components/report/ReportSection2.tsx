'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { DimensionRadarChart } from '@/components/charts/RadarChart'
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

function DimTooltip({ text }: { text: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  return (
    <span
      className="inline-flex items-center"
      onMouseEnter={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setPos({ x: rect.left + rect.width / 2, y: rect.top })
      }}
      onMouseLeave={() => setPos(null)}
    >
      <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold inline-flex items-center justify-center ml-1.5 align-middle cursor-default select-none">i</span>
      {pos && createPortal(
        <span
          style={{
            position: 'fixed',
            left: Math.min(pos.x, window.innerWidth - 272),
            top: pos.y - 8,
            transform: 'translateY(-100%)',
            zIndex: 9999,
          }}
          className="w-64 bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 leading-relaxed shadow-xl pointer-events-none"
        >
          {text}
        </span>,
        document.body
      )}
    </span>
  )
}

function DimCard({ slug, score, variant }: { slug: string; score: number; variant: 'super' | 'growth' }) {
  const percentile = Math.round(getPercentile(slug, score))
  const label = slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const desc = DIM_DESCRIPTIONS[slug] ?? ''
  const isSuper = variant === 'super'

  return (
    <div className={`p-4 rounded-2xl border hover:-translate-y-1 transition-transform duration-200 ${isSuper ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${isSuper ? 'text-teal-800' : 'text-slate-600'}`}>{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isSuper ? 'bg-teal text-white' : 'bg-slate-200 text-slate-600'}`}>
            p{percentile}
          </span>
          <span className={`font-bold text-sm ${isSuper ? 'text-teal' : 'text-slate-500'}`}>{score}</span>
        </div>
      </div>
      <div className="h-2 bg-white rounded-full mb-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${isSuper ? 'bg-gradient-to-r from-teal to-teal-400' : 'bg-slate-300'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {desc && <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>}
    </div>
  )
}

interface DimItem {
  slug: string
  label: string
  score: number
  percentile: number
}

function DimensionsTable({ items }: { items: DimItem[] }) {
  const [expanded, setExpanded] = useState(false)
  const [motionOverflow, setMotionOverflow] = useState<'hidden' | 'visible'>('hidden')

  return (
    <div className="space-y-3">
      {!expanded && (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded(true)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-5 py-2.5 text-sm font-semibold text-indigo cursor-pointer transition-colors"
          >
            Show all {items.length} dimensions ↓
          </button>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="dimensions-table"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: motionOverflow }}
            onAnimationStart={() => setMotionOverflow('hidden')}
            onAnimationComplete={() => setMotionOverflow('visible')}
          >
            <div className="rounded-2xl border border-slate-100 overflow-visible">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-medium">Dimension</th>
                    <th className="px-4 py-3 w-1/3" />
                    <th className="text-right px-4 py-3 font-medium">Score</th>
                    <th className="text-right px-4 py-3 font-medium">Percentile</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const desc = DIM_DESCRIPTIONS[item.slug] ?? ''
                    return (
                      <tr key={item.slug} className="border-b border-slate-50 last:border-0">
                        <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                          <span className="inline-flex items-center">
                            {item.label}
                            {desc && <DimTooltip text={desc} />}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo rounded-full"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-sm text-text">{item.score}</td>
                        <td className="px-4 py-3 text-right text-xs text-slate-400">p{item.percentile}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
            </div>

            <div className="flex justify-center pt-3">
              <button
                onClick={() => setExpanded(false)}
                className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                ↑ Collapse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    slug: k,
    label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    score: v,
    percentile: Math.round(getPercentile(k, v)),
  }))

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-4 sm:px-6 py-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 2</p>
        <h2 className="text-2xl font-bold text-white mt-1">Your Psychological Fingerprint</h2>
        <p className="text-slate-400 text-sm mt-1">29 dimensions measured across all personality domains</p>
      </div>
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
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

        <DimensionsTable items={barItems} />
        <div ref={onSentinelRef} id="section-2-sentinel" className="h-px" />
      </div>
    </div>
  )
}
