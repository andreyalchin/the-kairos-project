import type { ArchetypeDefinition } from '@/lib/types'

export function ReportSection3({ archetype }: { archetype: ArchetypeDefinition }) {
  const sections = [
    { title: 'Who You Are', content: archetype.who_you_are },
    { title: 'How You Think', content: archetype.how_you_think },
    { title: 'What Drives You', content: archetype.what_drives_you },
    { title: 'How You Show Up', content: archetype.how_you_show_up },
    { title: 'Your Shadow Side', content: archetype.shadow_side },
  ].filter(s => s.content)

  const isStub = sections.length === 0

  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Deep Archetype Profile</h2>
      {isStub ? (
        <div className="p-6 rounded-2xl bg-indigo-50 text-indigo text-center">
          <p className="font-semibold">Full profile coming soon</p>
          <p className="text-sm mt-1 text-indigo-600">{archetype.description}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(({ title, content }) => (
            <div key={title} className="space-y-2">
              <h3 className="font-semibold text-indigo">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{content}</p>
            </div>
          ))}
          {archetype.famous_examples && (
            <div>
              <h3 className="font-semibold text-indigo mb-2">Famous Examples</h3>
              <div className="flex flex-wrap gap-2">
                {archetype.famous_examples.map(name => (
                  <span key={name} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo text-sm">{name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
