import { getPercentile } from '@/lib/norms'
import type { AssessmentResult, ArchetypeDefinition, DimensionSlug } from '@/lib/types'

const FOUNDER_DIMS: { key: DimensionSlug; label: string; desc: string }[] = [
  { key: 'risk_tolerance', label: 'Risk Tolerance', desc: 'Your appetite for uncertainty and willingness to bet on non-consensus outcomes where the downside is real.' },
  { key: 'creative_intelligence', label: 'Creative Intelligence', desc: 'Your ability to generate novel ideas — the raw material of founder-market fit and product innovation.' },
  { key: 'psychological_resilience', label: 'Psychological Resilience', desc: 'Your capacity to absorb setbacks and maintain effective function under sustained pressure.' },
  { key: 'achievement_drive', label: 'Achievement Drive', desc: 'Your need to accomplish hard things — the internal engine that pushes through when the path is unclear and the outcome uncertain.' },
]

const TIER_INFO: Record<string, { headline: string; body: string }> = {
  'Serial Founder': {
    headline: 'Built for repeated founding',
    body: 'Your profile shows the rare combination of risk appetite, creative intelligence, resilience, and drive that characterizes serial entrepreneurs. You are oriented toward repeated cycles of creation, iteration, and scale — and you likely find the early stages of building more energizing than managing what you\'ve built.',
  },
  Founder: {
    headline: 'Strong founding profile',
    body: 'Your scores indicate a genuine founder orientation. You have the raw material for building something from scratch — the key question is finding the right problem, the right team, and the right moment. Your psychological profile is well-suited to the demands of early-stage creation.',
  },
  Builder: {
    headline: 'Builder orientation',
    body: 'You have strong building instincts. You may be best positioned as an early team member, co-founder, or founder in a lower-ambiguity context — where the problem is clearer and the team provides complementary risk appetite. Your building capacity is real; your pure founding drive is more measured.',
  },
  Operator: {
    headline: 'Operator orientation',
    body: 'Your profile is stronger in execution than in founding risk-taking. You are likely to create more value inside an existing structure than by starting from scratch. This is a strength, not a limitation — great operators are rarer than great founders, and the leverage from the right operational role can exceed what most founders achieve.',
  },
}

const ENTREPRENEURIAL_ARCHETYPES = new Set([
  'visionary_entrepreneur', 'courageous_disruptor', 'bold_risk_taker',
  'innovation_pioneer', 'creative_catalyst', 'resilient_pioneer',
  'transformational_catalyst', 'systematic_innovator', 'creative_technologist',
])

export function ReportSection9({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { founder_score, founder_tier } = result.hpif_profile.career_potential_matrix
  const tierInfo = TIER_INFO[founder_tier]
  const isEntrepreneurial = ENTREPRENEURIAL_ARCHETYPES.has(archetype.slug)

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 9</p>
        <h2 className="text-2xl font-bold text-white mt-1">Founder &amp; Entrepreneur Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Your entrepreneurial orientation and founding potential</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100 hover:-translate-y-1 transition-transform duration-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-teal uppercase tracking-widest font-medium mb-1">Entrepreneurial Tier</p>
              <p className="text-3xl font-bold text-teal">{founder_tier}</p>
              <p className="font-semibold text-slate-700 mt-1">{tierInfo?.headline}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-teal">{founder_score}</p>
              <p className="text-xs text-teal-600 mt-1">founder potential</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{tierInfo?.body}</p>
        </div>

        {isEntrepreneurial && (
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-3 items-start hover:-translate-y-1 transition-transform duration-200">
            <span className="text-indigo text-lg shrink-0">★</span>
            <p className="text-sm text-indigo-800 leading-relaxed">
              Your archetype — <strong>{archetype.name}</strong> — is naturally entrepreneurially oriented. Your psychological profile aligns with the demands of founding, building, and operating in environments where there is no established playbook.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold text-text">Founding Dimension Breakdown</h3>
          <p className="text-xs text-slate-500">Founder potential is a composite of these four dimensions. Your overall score of <strong>{founder_score}</strong> reflects your average across them.</p>
          {FOUNDER_DIMS.map(({ key, label, desc }) => (
            <div key={key} className="p-4 rounded-xl bg-white border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm text-text">{label}</span>
                <span className="text-teal font-bold text-sm">{result.scores[key]} · p{Math.round(getPercentile(key, result.scores[key]))}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full mb-2">
                <div className="h-full bg-gradient-to-r from-teal to-indigo rounded-full" style={{ width: `${result.scores[key]}%` }} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
