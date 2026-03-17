import type { AssessmentResult, ArchetypeDefinition, DimensionSlug } from '@/lib/types'

const MOT_DIMS: DimensionSlug[] = ['achievement_drive', 'risk_tolerance', 'autonomy_need', 'purpose_orientation', 'competitive_drive']

const LABELS: Record<string, string> = {
  achievement_drive: 'Achievement Drive',
  risk_tolerance: 'Risk Tolerance',
  autonomy_need: 'Autonomy Need',
  purpose_orientation: 'Purpose Orientation',
  competitive_drive: 'Competitive Drive',
}

const DESCRIPTIONS: Record<string, string> = {
  achievement_drive: 'Your drive to accomplish difficult goals and exceed your own standards of performance.',
  risk_tolerance: 'How comfortably you operate in uncertain environments where the downside is real and the outcome unknown.',
  autonomy_need: 'Your need for self-direction, independent decision-making, and control over how and what you work on.',
  purpose_orientation: 'How strongly meaning and mission factor into your motivation, engagement, and long-term commitment.',
  competitive_drive: 'Your need to outperform others and measure your output against external benchmarks.',
}

export function ReportSection5({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { motivational_architecture: mot } = result.hpif_profile
  const sorted = [...MOT_DIMS].sort((a, b) => result.scores[b] - result.scores[a])

  return (
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold text-text">Motivational Architecture</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
          <p className="text-xs text-teal-600 uppercase tracking-widest font-medium mb-1">Primary Driver</p>
          <p className="text-2xl font-bold text-teal">{mot.primary_driver}</p>
        </div>
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-1">Secondary Driver</p>
          <p className="text-2xl font-bold text-indigo">{mot.secondary_driver}</p>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed">{mot.description}</p>

      <div className="space-y-5">
        <h3 className="font-semibold text-text">Motivation Breakdown</h3>
        {sorted.map((d, i) => (
          <div key={d}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo text-white text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-medium text-text">{LABELS[d]}</span>
              </div>
              <span className="font-bold text-indigo text-sm">{result.scores[d]}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full mb-1">
              <div className="h-full bg-gradient-to-r from-indigo to-teal rounded-full" style={{ width: `${result.scores[d]}%` }} />
            </div>
            <p className="text-xs text-slate-500">{DESCRIPTIONS[d]}</p>
          </div>
        ))}
      </div>

      {archetype.reward_ranking && (
        <div>
          <h3 className="font-semibold text-teal mb-3">What Rewards You Most</h3>
          <div className="space-y-2">
            {archetype.reward_ranking.map((r, i) => (
              <div key={r} className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100">
                <span className="text-teal font-bold text-sm w-5 shrink-0">#{i + 1}</span>
                <span className="text-teal-800 text-sm">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {archetype.ideal_work_conditions && (
          <div>
            <h3 className="font-semibold text-indigo mb-3">You Thrive When</h3>
            <ul className="space-y-2">
              {archetype.ideal_work_conditions.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-teal shrink-0 mt-0.5">✓</span>{c}
                </li>
              ))}
            </ul>
          </div>
        )}
        {archetype.warning_signals && (
          <div>
            <h3 className="font-semibold text-red-400 mb-3">What Drains You</h3>
            <ul className="space-y-2">
              {archetype.warning_signals.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-red-400 shrink-0 mt-0.5">⚠</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
