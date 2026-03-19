import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

interface EnvItem {
  label: string
  desc: string
  score: number
}

export function ReportSection10({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const scores = result.scores

  const environments: EnvItem[] = [
    { label: 'Fast-paced & Ambiguous', desc: 'High change velocity, unclear rules, constant pivoting required', score: Math.round((scores.adaptability_quotient + scores.risk_tolerance) / 2) },
    { label: 'Structured & Predictable', desc: 'Clear processes, defined roles, stable expectations', score: Math.round((scores.conscientiousness + 100 - scores.risk_tolerance) / 2) },
    { label: 'Creative & Open', desc: 'Exploration encouraged, originality rewarded, few constraints', score: Math.round((scores.openness + scores.creative_intelligence) / 2) },
    { label: 'Collaborative & Social', desc: 'Team-first culture, regular interaction, collective achievement', score: Math.round((scores.extraversion + scores.collaboration_signature) / 2) },
    { label: 'Independent & Focused', desc: 'Deep work blocks, minimal interruption, personal accountability', score: Math.round((scores.autonomy_need + scores.attention_control) / 2) },
    { label: 'Strategic & High-Stakes', desc: 'Real consequences, long time horizons, decision-making authority', score: Math.round((scores.strategic_orientation + scores.leadership_drive) / 2) },
    { label: 'Mission-Driven', desc: 'Work connected to a larger purpose, strong values alignment', score: Math.round((scores.purpose_orientation + scores.growth_mindset) / 2) },
  ].sort((a, b) => b.score - a.score)

  const top = environments[0]

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 10</p>
        <h2 className="text-2xl font-bold text-white mt-1">Work Environment Match</h2>
        <p className="text-slate-400 text-sm mt-1">The conditions where your performance peaks</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100 hover:-translate-y-1 transition-transform duration-200">
          <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-1">Strongest Environment Match</p>
          <p className="text-xl font-bold text-text mb-1">{top.label}</p>
          <p className="text-sm text-slate-600">{top.desc}</p>
        </div>

        <div className="space-y-5">
          {environments.map(env => (
            <div key={env.label} className="hover:bg-slate-50 transition-colors rounded-xl px-2 -mx-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-text">{env.label}</span>
                <span className="font-bold text-indigo">{env.score}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full mb-1">
                <div className="h-full bg-gradient-to-r from-indigo to-teal rounded-full" style={{ width: `${env.score}%` }} />
              </div>
              <p className="text-xs text-slate-400">{env.desc}</p>
            </div>
          ))}
        </div>

        {archetype.warning_signals && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-100 hover:-translate-y-1 transition-transform duration-200">
            <h3 className="font-semibold text-red-600 mb-3">Environments That Drain You</h3>
            <p className="text-xs text-slate-500 mb-3">These conditions consistently undermine performance for your archetype — not just discomfort, but genuine depletion.</p>
            <ul className="space-y-2">
              {archetype.warning_signals.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-red-800">
                  <span className="shrink-0 mt-0.5">⚠</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
