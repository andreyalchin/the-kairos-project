import { GaugeChart } from '@/components/charts/GaugeChart'
import { InfoTip } from '@/components/ui/InfoTip'
import { getPercentile } from '@/lib/norms'
import type { AssessmentResult, DimensionSlug } from '@/lib/types'

const COG_DIMS: DimensionSlug[] = ['cognitive_agility', 'executive_function', 'attention_control', 'systems_thinking', 'creative_intelligence']

const COG_LABELS: Record<string, string> = {
  cognitive_agility: 'Cognitive Agility',
  executive_function: 'Executive Function',
  attention_control: 'Attention Control',
  systems_thinking: 'Systems Thinking',
  creative_intelligence: 'Creative Intelligence',
}

const COG_DESCRIPTIONS: Record<string, string> = {
  cognitive_agility: 'Speed and fluidity of adapting your thinking across different domains and problem types. High scorers shift cognitive gears with minimal friction — a core differentiator in fast-changing environments.',
  executive_function: 'Your capacity to plan, sequence, prioritize, and sustain goal-directed behavior under competing demands. High scorers translate intention into action reliably, even when complexity is high.',
  attention_control: 'Your ability to sustain focused work for extended periods and resist distraction under cognitive load. High scorers achieve deep work states more consistently and produce higher quality output on complex tasks.',
  systems_thinking: 'Your ability to model interdependencies and understand how changes propagate through complex structures. High scorers see second-order effects others miss — one of the rarest and most leveraged cognitive capabilities.',
  creative_intelligence: 'The richness of your associative network and capacity for generative thinking. High scorers connect ideas across distant domains and produce original framings that others cannot reach through linear reasoning.',
}

function cogInsight(dim: string, score: number, p: number): string {
  const band = score >= 75 ? 'high' : score >= 50 ? 'mid' : 'low'
  const pStr = `${p}th percentile`
  switch (dim) {
    case 'cognitive_agility':
      return band === 'high'
        ? `At ${score} (${pStr}), your cognitive agility is a genuine differentiator. You shift between problem types, domains, and thinking modes with speed that most people cannot match. This makes you exceptionally effective in fast-changing environments.`
        : band === 'mid'
        ? `Your cognitive agility score of ${score} (${pStr}) reflects solid, reliable mental flexibility. You adapt your thinking when the situation demands it — not effortlessly, but consistently. Building deliberate practice in cross-domain thinking will move this higher.`
        : `At ${score} (${pStr}), cognitive agility is a development area. You are most effective in familiar domains where your existing frameworks apply. Deliberately exposing yourself to unfamiliar problem types will build this dimension over time.`
    case 'executive_function':
      return band === 'high'
        ? `Your executive function score of ${score} (${pStr}) puts you among the most organized and goal-directed people in the population. You translate intention into action reliably, manage complexity without losing threads, and execute with consistency.`
        : band === 'mid'
        ? `At ${score} (${pStr}), your executive function is functional but variable. You perform well under structure and clear priorities, and you can lose efficiency when context is ambiguous or demands are competing. Systems and external scaffolding amplify your output.`
        : `Your executive function score of ${score} (${pStr}) suggests that planning, sequencing, and sustaining effort on complex projects is a meaningful challenge. External structure — tools, accountability partners, routines — directly compensates for this.`
    case 'attention_control':
      return band === 'high'
        ? `At ${score} (${pStr}), your attention control is exceptional. You can sustain focused work for extended periods, resist interruption, and manage cognitive load under pressure. Deep work is a natural strength.`
        : band === 'mid'
        ? `Your attention control of ${score} (${pStr}) is average — you maintain focus adequately in conducive environments but are vulnerable to distraction in high-stimulation contexts. Environment design (removing interruption sources) is a direct lever.`
        : `At ${score} (${pStr}), attention control is a development priority. You are likely drawn to novelty and frequent context-switching. This is energizing in the short term but reduces output quality on tasks requiring sustained depth.`
    case 'systems_thinking':
      return band === 'high'
        ? `Your systems thinking score of ${score} (${pStr}) is elite. You see interdependencies others miss, model how changes propagate through complex structures, and understand second-order effects intuitively. This is one of the rarest and most valuable cognitive capabilities.`
        : band === 'mid'
        ? `At ${score} (${pStr}), your systems thinking is above average. You can follow complex causal chains and appreciate interdependencies when you take time to map them. With deliberate practice, this can become a genuine strength.`
        : `Your systems thinking score of ${score} (${pStr}) indicates a preference for linear, concrete problem-solving over systemic analysis. You are most effective when working within well-defined scope and less effective when problems require modeling many interacting variables.`
    case 'creative_intelligence':
      return band === 'high'
        ? `At ${score} (${pStr}), your creative intelligence is highly developed. Your associative network is unusually dense — you connect ideas across distant domains and generate original framings naturally. This capacity is rare and compounding.`
        : band === 'mid'
        ? `Your creative intelligence of ${score} (${pStr}) reflects solid generative thinking. You produce novel ideas in domains you know well and have real potential to develop broader creative range with cross-domain exposure.`
        : `At ${score} (${pStr}), creative intelligence is a growth area. You are more effective refining and executing existing ideas than generating new ones. This is not a fixed trait — creative output scales with exposure to diverse inputs and deliberate practice.`
    default:
      return `Score: ${score} · ${pStr}`
  }
}

const STYLE_DESCRIPTIONS: Record<string, string> = {
  'Analytical-Convergent': 'You process information through disciplined, structured analysis — building certainty before committing to action. Your thinking converges on high-confidence conclusions and you are most effective when you have time to reason carefully.',
  'Balanced': 'You move fluidly between analytical rigor and intuitive judgment, adapting your cognitive approach to what the situation requires. You can work from data and from pattern recognition — often switching between the two within a single problem.',
  'Intuitive-Divergent': 'You process information through rapid pattern recognition and intuitive leaps. Your thinking diverges toward possibilities before narrowing to solutions. You are often several steps ahead — and sometimes need to slow down to bring others with you.',
}

function responseStyle(avgMs: number) {
  if (avgMs < 5000) return { label: 'Rapid Processor', desc: 'You answered quickly throughout the assessment — a signal of fast, decisive processing. Your first impressions are strong and you act on them. Watch for situations where slowing down produces better outcomes.' }
  if (avgMs < 15000) return { label: 'Balanced Thinker', desc: 'You took adequate time before committing to each answer — neither impulsive nor overthinking. This suggests you engage thoughtfully with what\'s asked before responding, which tends to produce accurate and stable self-assessments.' }
  return { label: 'Deliberate Reasoner', desc: 'You took more time than average per question — a signal of thorough, careful processing. You think before you speak. This depth of reflection tends to produce high-accuracy self-assessment, with the trade-off of slower initial response.' }
}

export function ReportSection4({ result }: { result: AssessmentResult }) {
  const { cognitive_operating_system: cos } = result.hpif_profile
  const { avgResponseMs } = result.inference_data
  const rs = responseStyle(avgResponseMs)

  return (
    <section className="py-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 4</p>
          <h2 className="text-2xl font-bold text-white mt-1">Cognitive Profile</h2>
          <p className="text-slate-400 text-sm mt-1">How your mind processes information and solves problems</p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100 hover:-translate-y-1 transition-transform duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs text-indigo uppercase tracking-widest font-medium">Cognitive Operating System</p>
                  <InfoTip
                    title="Cognitive Operating System"
                    body="A composite of your 5 cognitive dimensions — agility, executive function, attention control, systems thinking, and creative intelligence. It describes your natural information processing style and the cognitive contexts where you create the most value."
                  />
                </div>
                <p className="text-2xl font-bold text-text">{cos.primary_style}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <p className="text-4xl font-black text-indigo">{cos.composite}</p>
                  <InfoTip
                    title="Cognitive Composite"
                    body="Equally weighted average of your 5 cognitive dimension scores. 50 = population average. 70+ represents high cognitive performance across this cluster. This composite predicts performance in complex, ambiguous, and intellectually demanding roles."
                  />
                </div>
                <p className="text-xs text-slate-500">composite</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{STYLE_DESCRIPTIONS[cos.primary_style] ?? cos.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {COG_DIMS.map(dim => (
              <GaugeChart key={dim} score={result.scores[dim]} label={COG_LABELS[dim]} />
            ))}
          </div>

          <div className="space-y-3">
            {COG_DIMS.map(dim => {
              const score = result.scores[dim]
              const p = Math.round(getPercentile(dim, score))
              return (
                <div key={dim} className="p-4 rounded-xl bg-white border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm text-text">{COG_LABELS[dim]}</span>
                      <InfoTip
                        title={COG_LABELS[dim]}
                        body={COG_DESCRIPTIONS[dim] ?? ''}
                      />
                    </div>
                    <span className="text-indigo font-bold text-sm">{score} · p{p}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{cogInsight(dim, score, p)}</p>
                </div>
              )
            })}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Behavioral Signal · Processing Speed</p>
              <InfoTip
                title="What Processing Speed Measures"
                body="Your average time between seeing a question and committing to an answer. This captures cognitive processing rhythm and self-certainty — not raw intelligence. Rapid responders show strong self-clarity or high decisiveness. Deliberate responders show thorough self-reflection."
              />
            </div>
            <p className="font-semibold text-text mb-1">{rs.label}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{rs.desc}</p>
            <p className="text-xs text-slate-400 mt-2">Avg response time: {(avgResponseMs / 1000).toFixed(1)}s per question</p>
          </div>
        </div>
      </div>
    </section>
  )
}
