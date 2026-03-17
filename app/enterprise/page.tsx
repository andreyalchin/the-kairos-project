import Link from 'next/link'

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">Kairos for Enterprise</h1>
          <p className="text-slate-500 text-lg">Scientific intelligence for hiring teams and organizational leaders.</p>
          <Link href="mailto:enterprise@kairos.ai" className="inline-block bg-indigo text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors">
            Contact Sales
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Trait-Based Hiring', desc: 'Assess candidates against validated dimension profiles for any role — not gut feel, not credentials.' },
            { title: 'Team Composition Analysis', desc: "Understand your team's collective strengths, blind spots, and the archetype gaps that limit performance." },
            { title: 'Leadership Pipeline', desc: 'Identify high-potential leaders using our Leadership Tier scoring and founder potential composite.' },
            { title: 'Culture Fit Science', desc: 'Match candidates to team composition using archetype compatibility matrices, not vibes.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 space-y-2">
              <h2 className="font-semibold text-indigo">{title}</h2>
              <p className="text-slate-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
