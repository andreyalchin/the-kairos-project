import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

export function ReportSection7({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { leadership_tier, leadership_score } = result.hpif_profile.career_potential_matrix
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Leadership Profile</h2>
      <div className="flex items-center gap-4 p-6 rounded-2xl bg-indigo-50">
        <div>
          <p className="text-4xl font-bold text-indigo">{leadership_score}</p>
          <p className="text-indigo-600 text-sm">Leadership Score</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo">{leadership_tier}</p>
          <p className="text-indigo-600 text-sm">Leadership Tier</p>
        </div>
      </div>
      {archetype.leadership_style && (
        <div><h3 className="font-semibold text-indigo mb-1">Style</h3><p className="text-slate-600">{archetype.leadership_style}</p></div>
      )}
      {archetype.leadership_strengths && (
        <div>
          <h3 className="font-semibold text-teal mb-2">Strengths</h3>
          <ul className="space-y-1">{archetype.leadership_strengths.map((s: string) => <li key={s} className="text-slate-600 text-sm flex gap-2"><span className="text-teal">✓</span>{s}</li>)}</ul>
        </div>
      )}
    </section>
  )
}
