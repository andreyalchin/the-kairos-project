import { GaugeChart } from '@/components/charts/GaugeChart'
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

const COG_DESC: Record<string, string> = {
  cognitive_agility: 'How quickly and fluidly you adapt your thinking across different problem types and domains.',
  executive_function: 'Your ability to plan, organize, prioritize, and regulate complex goal-directed behavior.',
  attention_control: 'How effectively you sustain focus and manage cognitive interference and distraction.',
  systems_thinking: 'Your capacity to model how parts relate to wholes and understand complex interdependencies.',
  creative_intelligence: 'The richness of your associative network and your capacity for original, generative thought.',
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
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold text-text">Cognitive Profile</h2>

      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-1">Cognitive Operating System</p>
            <p className="text-2xl font-bold text-text">{cos.primary_style}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo">{cos.composite}</p>
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
        {COG_DIMS.map(dim => (
          <div key={dim} className="p-4 rounded-xl bg-white border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm text-text">{COG_LABELS[dim]}</span>
              <span className="text-indigo font-bold text-sm">{result.scores[dim]} · p{Math.round(getPercentile(dim, result.scores[dim]))}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{COG_DESC[dim]}</p>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Behavioral Signal · Processing Speed</p>
        <p className="font-semibold text-text mb-1">{rs.label}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{rs.desc}</p>
        <p className="text-xs text-slate-400 mt-2">Avg response time: {(avgResponseMs / 1000).toFixed(1)}s per question</p>
      </div>
    </section>
  )
}
