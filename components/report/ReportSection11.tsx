import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

export function ReportSection11({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const scores = result.scores
  const growthDims = Object.entries(scores).sort(([, a], [, b]) => a - b).slice(0, 3).map(([k]) => k)
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Growth Roadmap</h2>
      <div className="space-y-4">
        {growthDims.map(dim => (
          <div key={dim} className="p-5 rounded-2xl bg-white border border-slate-100">
            <h3 className="font-semibold text-indigo capitalize mb-1">{dim.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-slate-600">{archetype.development_areas?.[dim] ?? `Developing your ${dim.replace(/_/g, ' ')} will unlock significant new capability. Focus on deliberate practice in this area.`}</p>
          </div>
        ))}
      </div>
      {archetype.challenge_90_day && (
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <h3 className="font-semibold text-indigo mb-1">90-Day Challenge</h3>
          <p className="text-sm text-indigo-800">{archetype.challenge_90_day}</p>
        </div>
      )}
      {archetype.vision_1_year && (
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
          <h3 className="font-semibold text-teal mb-1">1-Year Vision</h3>
          <p className="text-sm text-teal-800">{archetype.vision_1_year}</p>
        </div>
      )}
    </section>
  )
}
