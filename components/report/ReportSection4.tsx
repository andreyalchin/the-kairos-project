import { GaugeChart } from '@/components/charts/GaugeChart'
import { getPercentile } from '@/lib/norms'
import type { AssessmentResult, DimensionSlug } from '@/lib/types'

const COG_DIMS: DimensionSlug[] = ['cognitive_agility', 'executive_function', 'attention_control', 'systems_thinking', 'creative_intelligence']

export function ReportSection4({ result }: { result: AssessmentResult }) {
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Cognitive Profile</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {COG_DIMS.map(dim => (
          <GaugeChart key={dim} score={result.scores[dim]} label={dim.replace(/_/g, ' ')} />
        ))}
      </div>
      <div className="space-y-3">
        {COG_DIMS.map(dim => (
          <div key={dim} className="flex justify-between text-sm">
            <span className="capitalize">{dim.replace(/_/g, ' ')}</span>
            <span className="text-indigo font-medium">{result.scores[dim]} · p{Math.round(getPercentile(dim, result.scores[dim]))}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
