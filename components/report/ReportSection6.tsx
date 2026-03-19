import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

const TRAJECTORY_DESCRIPTIONS: Record<string, string> = {
  Accelerating: 'Your growth capacity is high — you are built for rapid development and can absorb increasing complexity faster than your peers. Environments that invest in your development will see outsized returns.',
  Steady: 'You have a reliable, compounding growth trajectory. Targeted development investment will build capability over time. You grow most through consistent challenge and reflection rather than dramatic leaps.',
  Developing: 'You are building your growth foundation. There is significant upside available through deliberate focus on specific development areas. The gap between your current and potential ceiling is large — and closeable.',
}

export function ReportSection6({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { growth_vector } = result.hpif_profile

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 6</p>
        <h2 className="text-2xl font-bold text-white mt-1">Career Intelligence</h2>
        <p className="text-slate-400 text-sm mt-1">Where your profile creates the most career leverage</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {archetype.career_trajectory && (
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:-translate-y-1 transition-transform duration-200">
            <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-2">Career Trajectory</p>
            <p className="text-slate-700 leading-relaxed text-sm">{archetype.career_trajectory}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-indigo mb-3">Primary Verticals</h3>
            <div className="space-y-2">
              {(archetype.career_verticals_primary ?? []).map((v) => (
                <div key={v} className="px-4 py-2.5 bg-indigo-50 rounded-xl text-indigo text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-default">{v}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-500 mb-3">Secondary Verticals</h3>
            <div className="space-y-2">
              {(archetype.career_verticals_secondary ?? []).map((v) => (
                <div key={v} className="px-4 py-2.5 bg-slate-50 rounded-xl text-slate-600 text-sm border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">{v}</div>
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
                <span key={r} className="px-4 py-2 bg-indigo text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-default">{r}</span>
              ))}
            </div>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100 hover:-translate-y-1 transition-transform duration-200">
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
      </div>
    </div>
  )
}
