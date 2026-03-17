import { Badge } from '@/components/ui/Badge'
import { ArchetypeIllustration } from './ArchetypeIllustration'
import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

interface Props { result: AssessmentResult; archetype: ArchetypeDefinition }

export function ReportSection1({ result, archetype }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo to-indigo-700 text-white p-8 md:p-12">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,#0F766E,transparent_60%)]" />

      {/* Illustration — decorative, positioned top-right */}
      <div className="absolute -right-4 -top-4 opacity-60 pointer-events-none select-none hidden sm:block">
        <ArchetypeIllustration archetype={archetype} />
      </div>

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm uppercase tracking-widest mb-2">Your Archetype</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{archetype.name}</h1>
            <p className="text-indigo-200 text-lg mt-1">{archetype.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-5xl font-bold">{result.match_score}%</span>
            <p className="text-indigo-200 text-sm">match confidence</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {archetype.signature3Words.map(w => (
            <Badge key={w} className="bg-white/20 text-white border-white/20">{w}</Badge>
          ))}
        </div>
        <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-indigo-100">
          &quot;{archetype.quote}&quot;
        </blockquote>
        <p className="text-indigo-200 text-sm">{archetype.rarity}</p>
      </div>
    </section>
  )
}
