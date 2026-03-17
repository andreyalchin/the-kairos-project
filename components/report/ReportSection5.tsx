import type { AssessmentResult, ArchetypeDefinition, DimensionSlug } from '@/lib/types'

const MOT_DIMS: DimensionSlug[] = ['achievement_drive', 'risk_tolerance', 'autonomy_need', 'purpose_orientation', 'competitive_drive']
const LABELS: Record<string, string> = {
  achievement_drive: 'Achievement Drive', risk_tolerance: 'Risk Tolerance',
  autonomy_need: 'Autonomy Need', purpose_orientation: 'Purpose Orientation', competitive_drive: 'Competitive Drive'
}

export function ReportSection5({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const sorted = [...MOT_DIMS].sort((a, b) => result.scores[b] - result.scores[a])
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Motivational Architecture</h2>
      <div className="space-y-3">
        <h3 className="font-semibold text-teal">Top Drivers</h3>
        {sorted.slice(0, 5).map((d, i) => (
          <div key={d} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-teal text-white text-xs flex items-center justify-center">{i + 1}</span>
            <span className="flex-1">{LABELS[d]}</span>
            <span className="font-bold text-teal">{result.scores[d]}</span>
          </div>
        ))}
      </div>
      {archetype.ideal_work_conditions && (
        <div>
          <h3 className="font-semibold text-indigo mb-2">Ideal Work Conditions</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
            {archetype.ideal_work_conditions.map((c: string) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      )}
    </section>
  )
}
