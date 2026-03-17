import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

const TRAJECTORY_DESCRIPTIONS: Record<string, string> = {
  Accelerating: 'Your growth capacity is high — you are built for rapid development and can absorb increasing complexity faster than your peers. Environments that invest in your development will see outsized returns.',
  Steady: 'You have a reliable, compounding growth trajectory. Targeted development investment will build capability over time. You grow most through consistent challenge and reflection rather than dramatic leaps.',
  Developing: 'You are building your growth foundation. There is significant upside available through deliberate focus on specific development areas. The gap between your current and potential ceiling is large — and closeable.',
}

export function ReportSection6({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { growth_vector } = result.hpif_profile

  return (
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold text-text">Career Intelligence</h2>

      {archetype.career_trajectory && (
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-2">Career Trajectory</p>
          <p className="text-slate-700 leading-relaxed text-sm">{archetype.career_trajectory}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-indigo mb-3">Primary Verticals</h3>
          <div className="space-y-2">
            {(archetype.career_verticals_primary ?? []).map((v) => (
              <div key={v} className="px-4 py-2.5 bg-indigo-50 rounded-xl text-indigo text-sm font-medium border border-indigo-100">{v}</div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-500 mb-3">Secondary Verticals</h3>
          <div className="space-y-2">
            {(archetype.career_verticals_secondary ?? []).map((v) => (
              <div key={v} className="px-4 py-2.5 bg-slate-50 rounded-xl text-slate-600 text-sm border border-slate-100">{v}</div>
            ))}
          </div>
        </div>
      </div>

      {archetype.dream_roles && result.match_score >= 60 && (
        <div>
          <h3 className="font-semibold text-indigo mb-1">Dream Roles</h3>
          <p className="text-xs text-slate-400 mb-3">Roles where this archetype&apos;s profile is a strong structural fit.</p>
          <div className="flex flex-wrap gap-2">
            {archetype.dream_roles.map((r) => (
              <span key={r} className="px-4 py-2 bg-indigo text-white rounded-full text-sm font-medium">{r}</span>
            ))}
          </div>
        </div>
      )}

      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-teal uppercase tracking-widest font-medium mb-1">Growth Trajectory</p>
            <p className="text-2xl font-bold text-teal">{growth_vector.trajectory}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Potential Ceiling</p>
            <p className="font-semibold text-slate-700 text-sm">{growth_vector.ceiling}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{TRAJECTORY_DESCRIPTIONS[growth_vector.trajectory] ?? ''}</p>
      </div>
    </section>
  )
}
