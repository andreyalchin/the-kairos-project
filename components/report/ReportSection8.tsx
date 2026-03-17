import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

export function ReportSection8({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const tc = result.hpif_profile.team_compatibility
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Team Intelligence</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Team Role', value: tc.team_role },
          { label: 'Remote Preference', value: tc.remote_orientation },
          { label: 'Team Size', value: tc.team_size_preference },
          { label: 'Style', value: tc.collaboration_style.split(' ')[0] },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-xl bg-white border border-slate-100 text-center">
            <p className="text-lg font-bold text-indigo">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div><h3 className="font-semibold text-teal mb-2">Best Partners</h3>{archetype.best_partners.map((p: string) => <p key={p} className="text-sm text-slate-600 capitalize">{p.replace(/_/g, ' ')}</p>)}</div>
        <div><h3 className="font-semibold text-blue-500 mb-2">Growth Partners</h3>{archetype.growth_partners.map((p: string) => <p key={p} className="text-sm text-slate-600 capitalize">{p.replace(/_/g, ' ')}</p>)}</div>
        <div><h3 className="font-semibold text-slate-500 mb-2">Friction Risk</h3>{archetype.friction_archetypes.map((p: string) => <p key={p} className="text-sm text-slate-600 capitalize">{p.replace(/_/g, ' ')}</p>)}</div>
      </div>
    </section>
  )
}
