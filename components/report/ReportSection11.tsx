import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

function revisionInsight(rate: number): string {
  if (rate > 0.3) return 'You revised a notable portion of your answers — a signal of either genuine reconsideration or some uncertainty about your self-perception in those areas. Pay particular attention to the dimensions where you felt most conflicted. That tension is often where the most useful self-knowledge lives.'
  if (rate > 0.1) return 'You revised some answers as you went — a healthy signal of reflective self-assessment. You engaged with the questions rather than defaulting to first impressions, which tends to produce more accurate and useful profiles.'
  return 'You largely stayed with your initial answers — a sign of strong self-clarity or high confidence in your self-perception. This can be a genuine strength. It\'s worth periodically testing your self-assessments against outside feedback to ensure the clarity is calibrated, not just confident.'
}

function consistencyInsight(score: number): string {
  if (score > 75) return 'Your responses to construct pairs were highly consistent throughout the assessment — you have a stable, integrated sense of your own traits. This suggests your self-model is well-formed and that your scores reflect a genuine and stable underlying profile.'
  if (score > 50) return 'Your responses showed moderate consistency across construct pairs — a normal range that reflects some complexity or context-dependence in how you experience yourself. This is often accurate: most people do show different facets of themselves in different environments.'
  return 'Your responses showed lower-than-average consistency across paired constructs. This may indicate that your self-perception shifts significantly with context, that you\'re in a period of genuine personal transition, or that some of these traits are genuinely ambivalent for you. Treat these dimensions as areas for further exploration.'
}

function responseTimeInsight(avgMs: number): string {
  if (avgMs < 5000) return 'You answered quickly throughout — a signal of fast, decisive processing. Your first impressions are strong and you act on them readily. In high-stakes situations, build in a deliberate pause before committing to decisions that warrant more consideration.'
  if (avgMs < 15000) return 'You took measured time per question — a balanced cognitive approach. You engaged thoughtfully without overthinking. This typically produces accurate self-assessment and reflects a healthy processing style that works well across most decision contexts.'
  return 'You took more time per question than average — a signal of thorough, deliberate processing. You think carefully before committing. This depth of reflection tends to produce high-accuracy self-assessment, and in practice it often produces better decisions than faster, more reactive processing styles.'
}

export function ReportSection11({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const scores = result.scores
  const { revisionRate, consistencyScore, avgResponseMs } = result.inference_data
  const growthDims = Object.entries(scores).sort(([, a], [, b]) => a - b).slice(0, 3).map(([k]) => k)

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-6 py-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 11</p>
        <h2 className="text-2xl font-bold text-white mt-1">Growth Roadmap</h2>
        <p className="text-slate-400 text-sm mt-1">Your 90-day priorities and long-term development trajectory</p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-text">Development Priorities</h3>
          <p className="text-xs text-slate-500">Your three lowest-scoring dimensions, with guidance personalized to your archetype.</p>
          {growthDims.map(dim => (
            <div key={dim} className="p-5 rounded-2xl bg-white border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
              <h4 className="font-semibold text-indigo capitalize mb-2">{dim.replace(/_/g, ' ')}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {archetype.development_areas?.[dim] ?? `Developing your ${dim.replace(/_/g, ' ')} is a high-leverage opportunity given your current profile. Deliberate practice in this area will compound with your existing strengths in ways that expand your overall range significantly.`}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {archetype.challenge_90_day && (
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:-translate-y-1 transition-transform duration-200">
              <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-2">Your 90-Day Challenge</p>
              <p className="text-sm text-indigo-800 leading-relaxed">{archetype.challenge_90_day}</p>
            </div>
          )}
          {archetype.vision_1_year && (
            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100 hover:-translate-y-1 transition-transform duration-200">
              <p className="text-xs text-teal uppercase tracking-widest font-medium mb-2">1-Year Vision</p>
              <p className="text-sm text-teal-800 leading-relaxed">{archetype.vision_1_year}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-text">Behavioral Self-Awareness Signals</h3>
          <p className="text-xs text-slate-500">These signals come from how you answered — not just what you answered. They reflect patterns in your real-time behavior during the assessment.</p>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm text-text">Answer Revision Rate</p>
              <p className="text-3xl font-black text-indigo">{(revisionRate * 100).toFixed(0)}%</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{revisionInsight(revisionRate)}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm text-text">Response Consistency</p>
              <p className="text-3xl font-black text-indigo">{consistencyScore.toFixed(0)} / 100</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{consistencyInsight(consistencyScore)}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm text-text">Average Response Time</p>
              <p className="text-3xl font-black text-indigo">{(avgResponseMs / 1000).toFixed(1)}s per question</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{responseTimeInsight(avgResponseMs)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
