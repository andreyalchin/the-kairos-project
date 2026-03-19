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

const HIGH_SIGNALS: Record<string, string> = {
  achievement_drive: 'You are energized by ambitious targets. You need to feel like you\'re making progress toward something that matters.',
  risk_tolerance: 'Uncertainty doesn\'t repel you — it draws you. You are most alive when the outcome isn\'t guaranteed.',
  autonomy_need: 'Self-direction is fuel for you. You do your best work when the "how" is yours to define.',
  purpose_orientation: 'Meaning is non-negotiable. Work that connects to a larger mission sustains you in ways that pure achievement cannot.',
  competitive_drive: 'You measure yourself against others and that measurement motivates you. Knowing the score sharpens your performance.',
}

const LOW_SIGNALS: Record<string, string> = {
  achievement_drive: 'Environments of constant performance pressure will erode your motivation and quality over time.',
  risk_tolerance: 'Chronic uncertainty, high-stakes ambiguity, and frequent pivots will be draining rather than energizing.',
  autonomy_need: 'Micromanagement and over-specified processes will suppress your performance below your actual ceiling.',
  purpose_orientation: 'Work that feels purely transactional, without connection to a mission you believe in, will not sustain your engagement.',
  competitive_drive: 'Relentless competitive framing — ranking systems, constant comparison, zero-sum environments — will feel hollow or counterproductive.',
}

export function ReportSection5({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { motivational_architecture: mot } = result.hpif_profile
  const sorted = [...MOT_DIMS].sort((a, b) => result.scores[b] - result.scores[a])
  const drivers = sorted.slice(0, 3)
  const drains = sorted.slice(-2)

  return (
    <section className="py-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 5</p>
          <h2 className="text-2xl font-bold text-white mt-1">Motivational Architecture</h2>
          <p className="text-slate-400 text-sm mt-1">The drives and conditions that fuel your best performance</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100 hover:-translate-y-1 transition-transform duration-200">
              <p className="text-xs text-teal-600 uppercase tracking-widest font-medium mb-1">Primary Driver</p>
              <p className="text-xl font-bold text-teal">{mot.primary_driver}</p>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:-translate-y-1 transition-transform duration-200">
              <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-1">Secondary Driver</p>
              <p className="text-xl font-bold text-indigo">{mot.secondary_driver}</p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">{mot.description}</p>

          {/* Top Drivers */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-text">What Fuels You</h3>
              <p className="text-xs text-slate-400 mt-0.5">Your highest-scoring motivational dimensions — the conditions under which you operate at full capacity.</p>
            </div>
            {drivers.map((d, i) => (
              <div key={d} className="p-4 rounded-2xl bg-teal-50 border border-teal-100 hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-sm font-semibold text-teal-800">{LABELS[d]}</span>
                  </div>
                  <span className="font-bold text-teal text-sm">{result.scores[d]}</span>
                </div>
                <div className="h-2 bg-teal-100 rounded-full mb-2">
                  <div className="h-full bg-teal rounded-full" style={{ width: `${result.scores[d]}%` }} />
                </div>
                <p className="text-xs text-slate-500 mb-1">{DESCRIPTIONS[d]}</p>
                <p className="text-xs text-teal-700 font-medium">{HIGH_SIGNALS[d]}</p>
              </div>
            ))}
          </div>

          {/* Energy Drains */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-text">What Drains You</h3>
              <p className="text-xs text-slate-400 mt-0.5">Your lowest-scoring motivational dimensions — conditions that erode engagement and performance over time.</p>
            </div>
            {drains.map((d) => (
              <div key={d} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">↓</span>
                    <span className="text-sm font-semibold text-slate-600">{LABELS[d]}</span>
                  </div>
                  <span className="font-bold text-slate-400 text-sm">{result.scores[d]}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mb-2">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: `${result.scores[d]}%` }} />
                </div>
                <p className="text-xs text-slate-500 mb-1">{DESCRIPTIONS[d]}</p>
                <p className="text-xs text-slate-500 italic">{LOW_SIGNALS[d]}</p>
              </div>
            ))}
          </div>

          {archetype.reward_ranking && (
            <div>
              <h3 className="font-semibold text-teal mb-3">What Rewards You Most</h3>
              <div className="space-y-2">
                {archetype.reward_ranking.map((r, i) => (
                  <div key={r} className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100 hover:-translate-y-0.5 transition-transform duration-200">
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
                <h3 className="font-semibold text-red-400 mb-3">Warning Signals</h3>
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
        </div>
      </div>
    </section>
  )
}
