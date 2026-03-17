import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

export function ReportSection9({ result }: { result: AssessmentResult; archetype: ArchetypeDefinition }) {
  const { founder_score, founder_tier } = result.hpif_profile.career_potential_matrix
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Founder &amp; Entrepreneur Profile</h2>
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-teal-50">
        <div className="text-center">
          <p className="text-4xl font-bold text-teal">{founder_score}</p>
          <p className="text-teal-600 text-sm">Founder Potential</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-teal">{founder_tier}</p>
          <p className="text-teal-600 text-sm">Entrepreneurial Tier</p>
          <p className="text-xs text-teal-500 mt-1">Composite of risk tolerance, creativity, resilience, and drive</p>
        </div>
      </div>
    </section>
  )
}
