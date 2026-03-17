'use client'
import { DimensionRadarChart } from '@/components/charts/RadarChart'
import { HorizontalBarChart } from '@/components/charts/BarChart'
import { getPercentile } from '@/lib/norms'
import type { AssessmentResult } from '@/lib/types'

interface Props { result: AssessmentResult; onSentinelRef: (el: HTMLDivElement | null) => void }

export function ReportSection2({ result, onSentinelRef }: Props) {
  const scores = result.scores
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const superpowers = sorted.slice(0, 3)
  const blindSpots = sorted.slice(-2)

  const barItems = Object.entries(scores)
    .filter(([k]) => k !== 'founder_potential')
    .map(([k, v]) => ({
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
          <h3 className="font-semibold text-teal">Superpowers</h3>
          {superpowers.map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span>{k.replace(/_/g, ' ')}</span>
              <span className="font-bold text-teal">{v} · p{Math.round(getPercentile(k, v))}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-500">Growth Areas</h3>
          {blindSpots.map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span>{k.replace(/_/g, ' ')}</span>
              <span className="font-bold text-slate-400">{v} · p{Math.round(getPercentile(k, v))}</span>
            </div>
          ))}
        </div>
      </div>
      <HorizontalBarChart items={barItems} />
      <div ref={onSentinelRef} id="section-2-sentinel" className="h-px" />
    </section>
  )
}
