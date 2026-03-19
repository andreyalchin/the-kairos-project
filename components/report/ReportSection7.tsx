import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

const TIER_DESCRIPTIONS: Record<string, string> = {
  Visionary: 'You operate at the highest tier of leadership drive — oriented toward large-scale impact and leading organizations at full scale. You are most energized when the mandate is real, the stakes are high, and you have room to shape direction.',
  Established: 'Your leadership drive is strong and well-developed. You are capable of leading teams and organizations with real authority. People follow you because you\'ve demonstrated you can deliver results while navigating complexity.',
  Rising: 'Your leadership potential is developing. You have the instincts and the drive — the work now is building the track record and the confidence that comes from repeated high-stakes delivery.',
  Emerging: 'You are in the early stages of building your leadership identity. The foundation is here. Deliberate investment in leadership experience now will accelerate your development significantly.',
}

const SOCIAL_STYLE_DESCRIPTIONS: Record<string, string> = {
  Analytical: 'You communicate precisely and systematically. You build credibility through rigor and are most persuasive when grounded in evidence. Others see you as thorough, reliable, and intellectually honest.',
  Driver: 'You communicate directly and decisively. You move conversations forward and prefer action over prolonged discussion. Others experience you as confident, results-oriented, and clear.',
  Amiable: 'You communicate warmly and collaboratively. You build trust through relationship and shared understanding. Others experience you as genuine, supportive, and easy to work with.',
  Expressive: 'You communicate with energy and expressiveness. You build engagement through enthusiasm and authentic emotion. Others experience you as inspiring, open, and magnetic.',
}

export function ReportSection7({ result, archetype }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { leadership_tier, leadership_score, strategic_vs_tactical, specialist_vs_generalist } = result.hpif_profile.career_potential_matrix
  const { social_style } = result.hpif_profile.behavioral_expression

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-4 sm:px-6 py-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Section 7</p>
        <h2 className="text-2xl font-bold text-white mt-1">Leadership Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Your leadership style, orientation, and influence patterns</p>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center hover:-translate-y-1 transition-transform duration-200">
            <p className="text-4xl font-black text-indigo">{leadership_score}</p>
            <p className="text-indigo-600 text-sm mt-1">Leadership Score</p>
          </div>
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center hover:-translate-y-1 transition-transform duration-200">
            <p className="text-3xl font-black text-indigo">{leadership_tier}</p>
            <p className="text-indigo-600 text-sm mt-1">Leadership Tier</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">{TIER_DESCRIPTIONS[leadership_tier]}</p>

        <div className="space-y-5">
          <h3 className="font-semibold text-text">Leadership Orientation</h3>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Tactical</span>
              <span className="font-medium text-indigo">Strategic · {strategic_vs_tactical}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo to-teal rounded-full" style={{ width: `${strategic_vs_tactical}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">How strongly you orient toward long-horizon vision versus day-to-day execution</p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Specialist</span>
              <span className="font-medium text-indigo">Generalist · {specialist_vs_generalist}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo to-teal rounded-full" style={{ width: `${specialist_vs_generalist}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">Whether you lead through deep domain expertise or broad cross-functional range</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Communication Style</p>
          <p className="font-bold text-text mb-1">{social_style}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{SOCIAL_STYLE_DESCRIPTIONS[social_style] ?? ''}</p>
        </div>

        {archetype.leadership_style && (
          <div className="px-5 py-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:-translate-y-1 transition-transform duration-200">
            <p className="text-xs text-indigo uppercase tracking-widest font-medium mb-1">Leadership Style</p>
            <p className="font-semibold text-indigo">{archetype.leadership_style}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {archetype.leadership_strengths && (
            <div>
              <h3 className="font-semibold text-teal mb-3">Leadership Strengths</h3>
              <ul className="space-y-2">
                {archetype.leadership_strengths.map((s) => (
                  <li key={s} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-teal shrink-0 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {archetype.leadership_blind_spots && (
            <div>
              <h3 className="font-semibold text-amber-500 mb-3">Leadership Blind Spots</h3>
              <ul className="space-y-2">
                {archetype.leadership_blind_spots.map((s) => (
                  <li key={s} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-amber-400 shrink-0 mt-0.5">△</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
