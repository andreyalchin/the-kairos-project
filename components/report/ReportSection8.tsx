import { ARCHETYPES } from '@/lib/archetypes'
import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

function archetypeName(slug: string) {
  return ARCHETYPES.find(a => a.slug === slug)?.name
    ?? slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  Architect: 'You build the frameworks and systems others operate within. You excel at structural thinking, long-term planning, and creating the intellectual infrastructure that enables teams to scale.',
  Catalyst: 'You spark action and creative momentum. You energize teams, generate ideas, and initiate change that others carry forward. Teams benefit most from you at the start of a project or during inflection points.',
  Executor: 'You deliver. Where others conceptualize, you build — transforming plans into reality with reliability and follow-through. Teams depend on you to make things actually happen.',
  Harmonizer: 'You create the conditions for collaboration. You build trust, reduce friction, and make the team more than the sum of its parts. Without you, high-performing groups become collections of individuals.',
  Challenger: 'You push the team toward higher performance. You question assumptions, raise the bar, and resist comfortable mediocrity. You are at your most valuable when the team risks going too easy on itself.',
  Navigator: 'You orient teams through complexity. You read the environment, adapt strategy, and guide decisions under ambiguity. Teams lean on you most when the path is unclear.',
}

const COLLAB_STYLE_FULL: Record<string, string> = {
  Architect: 'You contribute most in the design and planning phases — bringing clear frameworks, structured analysis, and long-horizon thinking to contexts that need intellectual architecture.',
  Catalyst: 'You contribute most when teams need to generate new ideas, build momentum, or change direction. Your energy is a resource the team draws on, especially when things feel stalled.',
  Executor: 'You contribute most through consistent, reliable delivery. Teams count on you to close the loop — to take what\'s been decided and make it real, on time, at the standard promised.',
  Harmonizer: 'You contribute most when the team needs cohesion — during onboarding, conflict, or change. You create the relational conditions that allow other contributions to land.',
  Challenger: 'You contribute most when the team needs honest pushback. Your willingness to name what others avoid creates the productive tension that drives high performance.',
  Navigator: 'You contribute most in novel or uncertain environments where there\'s no established playbook. Your cross-domain range and situational awareness creates options others don\'t see.',
}

export function ReportSection8({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const tc = result.hpif_profile.team_compatibility
  const role = tc.team_role

  return (
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold text-text">Team Intelligence</h2>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 border border-indigo-100">
        <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-1">Your Team Role</p>
        <p className="text-3xl font-bold text-text mb-2">{role}</p>
        <p className="text-slate-600 text-sm leading-relaxed">{ROLE_DESCRIPTIONS[role] ?? ''}</p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">How You Contribute</p>
        <p className="text-sm text-slate-600 leading-relaxed">{COLLAB_STYLE_FULL[role] ?? tc.collaboration_style}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-100 text-center">
          <p className="text-lg font-bold text-indigo">{tc.remote_orientation}</p>
          <p className="text-xs text-slate-500 mt-1">Work Location Preference</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-100 text-center">
          <p className="text-lg font-bold text-indigo">{tc.team_size_preference}</p>
          <p className="text-xs text-slate-500 mt-1">Ideal Team Size</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-teal text-sm">Best Partners</h3>
          <p className="text-xs text-slate-400 mb-1">Complement your strengths</p>
          {archetype.best_partners.map((p) => (
            <div key={p} className="px-3 py-2 rounded-lg bg-teal-50 border border-teal-100 text-sm text-teal-800 font-medium">{archetypeName(p)}</div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-indigo text-sm">Growth Partners</h3>
          <p className="text-xs text-slate-400 mb-1">Challenge your limits</p>
          {archetype.growth_partners.map((p) => (
            <div key={p} className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-sm text-indigo-800 font-medium">{archetypeName(p)}</div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-500 text-sm">Friction Risk</h3>
          <p className="text-xs text-slate-400 mb-1">Manage these dynamics</p>
          {archetype.friction_archetypes.map((p) => (
            <div key={p} className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600 font-medium">{archetypeName(p)}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
