import type { AssessmentResult } from '@/lib/types'

export function ReportSection10({ result }: { result: AssessmentResult }) {
  const scores = result.scores
  const environments = [
    { label: 'Fast-paced & Ambiguous', score: Math.round((scores.adaptability_quotient + scores.risk_tolerance) / 2) },
    { label: 'Structured & Predictable', score: Math.round((scores.conscientiousness + 100 - scores.risk_tolerance) / 2) },
    { label: 'Creative & Open', score: Math.round((scores.openness + scores.creative_intelligence) / 2) },
    { label: 'Collaborative & Social', score: Math.round((scores.extraversion + scores.collaboration_signature) / 2) },
    { label: 'Independent & Focused', score: Math.round((scores.autonomy_need + scores.attention_control) / 2) },
    { label: 'Strategic & High-Stakes', score: Math.round((scores.strategic_orientation + scores.leadership_drive) / 2) },
    { label: 'Mission-Driven', score: Math.round((scores.purpose_orientation + scores.growth_mindset) / 2) },
  ]
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Work Environment Match</h2>
      <div className="space-y-3">
        {environments.sort((a, b) => b.score - a.score).map(env => (
          <div key={env.label} className="space-y-1">
            <div className="flex justify-between text-sm"><span>{env.label}</span><span className="font-medium text-indigo">{env.score}</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-gradient-to-r from-indigo to-teal rounded-full" style={{ width: `${env.score}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  )
}
