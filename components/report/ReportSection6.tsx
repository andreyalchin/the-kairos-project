import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

export function ReportSection6({ archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Career Intelligence</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-indigo mb-3">Primary Verticals</h3>
          <div className="space-y-2">
            {(archetype.career_verticals_primary ?? []).map((v: string) => (
              <div key={v} className="px-4 py-2 bg-indigo-50 rounded-lg text-indigo text-sm font-medium">{v}</div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-500 mb-3">Secondary Verticals</h3>
          <div className="space-y-2">
            {(archetype.career_verticals_secondary ?? []).map((v: string) => (
              <div key={v} className="px-4 py-2 bg-slate-50 rounded-lg text-slate-600 text-sm">{v}</div>
            ))}
          </div>
        </div>
      </div>
      {archetype.dream_roles && (
        <div>
          <h3 className="font-semibold text-indigo mb-2">Dream Roles</h3>
          <div className="flex flex-wrap gap-2">
            {archetype.dream_roles.map((r: string) => (
              <span key={r} className="px-3 py-1.5 bg-indigo text-white rounded-full text-sm">{r}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
