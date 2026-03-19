import type { ArchetypeDefinition } from '@/lib/types'

const SECTION_CONFIG = [
  {
    key: 'who_you_are' as const,
    title: 'Who You Are',
    icon: '◈',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    accent: 'text-indigo',
  },
  {
    key: 'how_you_think' as const,
    title: 'How You Think',
    icon: '◎',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    accent: 'text-slate-700',
  },
  {
    key: 'what_drives_you' as const,
    title: 'What Drives You',
    icon: '◉',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    accent: 'text-teal-700',
  },
  {
    key: 'how_you_show_up' as const,
    title: 'How You Show Up',
    icon: '◐',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    accent: 'text-violet-700',
  },
]

export function ReportSection3({ archetype, matchScore = 99 }: { archetype: ArchetypeDefinition; matchScore?: number }) {
  const hasContent = !!(archetype.who_you_are || archetype.how_you_think || archetype.what_drives_you || archetype.how_you_show_up)

  return (
    <section className="py-8">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-4 sm:px-6 py-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 3</p>
          <h2 className="text-2xl font-bold text-white mt-1">Deep Archetype Profile</h2>
          <p className="text-slate-400 text-sm mt-1">A detailed psychological portrait of your archetype</p>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {!hasContent ? (
            <div className="p-6 rounded-2xl bg-indigo-50 text-indigo text-center">
              <p className="font-semibold">Full profile coming soon</p>
              <p className="text-sm mt-1 text-indigo-600">{archetype.description}</p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Signature dimensions strip */}
              {archetype.signature && archetype.signature.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-3">Defining Dimensions</p>
                  <div className="flex flex-wrap gap-2">
                    {archetype.signature.slice(0, 5).map(s => (
                      <div key={s.dimension} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo inline-block" />
                        <span className="text-xs font-medium text-indigo capitalize">{s.dimension.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main narrative cards */}
              {SECTION_CONFIG.map(({ key, title, icon, bg, border, accent }) => {
                const content = archetype[key]
                if (!content) return null
                return (
                  <div key={key} className={`p-5 rounded-2xl ${bg} border ${border} hover:-translate-y-1 transition-transform duration-200`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-lg leading-none ${accent}`}>{icon}</span>
                      <h3 className={`font-semibold text-sm uppercase tracking-widest ${accent}`}>{title}</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{content}</p>
                  </div>
                )
              })}

              {/* Shadow Side — distinct warning treatment */}
              {archetype.shadow_side && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg leading-none text-amber-600">△</span>
                    <h3 className="font-semibold text-sm uppercase tracking-widest text-amber-700">Your Shadow Side</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{archetype.shadow_side}</p>
                </div>
              )}

              {/* Famous Examples — only shown when match confidence is meaningful */}
              {archetype.famous_examples && archetype.famous_examples.length > 0 && matchScore >= 65 && (
                <div className="p-5 rounded-2xl bg-white border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-3">Famous Examples</p>
                  <div className="flex flex-wrap gap-2">
                    {archetype.famous_examples.map(name => (
                      <span
                        key={name}
                        className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors cursor-default"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    These individuals share core dimensional patterns with your profile. Their paths are illustrative — not prescriptive.
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </section>
  )
}
