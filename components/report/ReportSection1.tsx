import { Badge } from '@/components/ui/Badge'
import { ArchetypeIllustration } from './ArchetypeIllustration'
import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

interface Props { result: AssessmentResult; archetype: ArchetypeDefinition }

function matchQuality(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Exceptional Match', color: 'bg-teal/20 text-teal-100' }
  if (score >= 70) return { label: 'Strong Match', color: 'bg-white/20 text-white' }
  if (score >= 55) return { label: 'Moderate Match', color: 'bg-amber-400/20 text-amber-100' }
  return { label: 'Developing Profile', color: 'bg-white/10 text-indigo-200' }
}

export function ReportSection1({ result, archetype }: Props) {
  const { label, color } = matchQuality(result.match_score)

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo to-indigo-700 text-white p-8 md:p-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,#0F766E,transparent_60%)]" />
        <div className="absolute -right-4 -top-4 opacity-60 pointer-events-none select-none hidden sm:block">
          <ArchetypeIllustration archetype={archetype} />
        </div>
        <span className="absolute right-6 bottom-4 text-[10rem] font-black text-white/5 leading-none select-none pointer-events-none" aria-hidden="true">
          {result.match_score}
        </span>
        <div className="relative space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-sm uppercase tracking-widest mb-2">Your Archetype</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{archetype.name}</h1>
              <p className="text-indigo-200 text-lg mt-1">{archetype.subtitle}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="relative inline-block">
                <div className="absolute -inset-3 rounded-full bg-white/10 animate-ping" style={{animationDuration:'3s'}} aria-hidden="true" />
                <p className="relative text-5xl md:text-6xl font-black text-white">{result.match_score}%</p>
              </div>
              <p className="text-indigo-200 text-sm">match confidence</p>
              <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
                {label}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {archetype.signature3Words.map(w => (
              <Badge key={w} className="bg-white/15 border border-white/20 backdrop-blur-sm text-white">{w}</Badge>
            ))}
          </div>
          <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-indigo-100">
            &quot;{archetype.quote}&quot;
          </blockquote>
          <p className="text-indigo-200 text-sm">{archetype.rarity}</p>
        </div>
      </section>

    </div>
  )
}
