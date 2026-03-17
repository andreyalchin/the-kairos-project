const TIERS = [
  { name: 'Free', price: '$0', period: '', target: 'Individuals', features: ['Sections 1–2 (no sign-up)', 'Archetype hero', 'Psychological Fingerprint radar'] },
  { name: 'Professional', price: '$29', period: '/month', target: 'Power users', features: ['Full 11-section report', 'Unlimited retakes', 'Growth tracking dashboard', 'PDF export (coming soon)'], highlight: true },
  { name: 'Corporate', price: '$25', period: '/candidate', target: 'HR teams', features: ['Candidate assessment portal', 'Hiring dashboard', 'Team compatibility matrix', 'Bulk reporting'] },
  { name: 'Recruiter Network', price: '$499', period: '/month', target: 'Recruiters', features: ['Trait-based candidate search', 'Unlimited assessments', 'API access (limited)'], badge: 'Coming soon' },
  { name: 'Talent API', price: '$1', period: '/analysis', target: 'Developers', features: ['REST API access', 'Full dimension scores', 'Archetype assignment'], badge: 'Coming soon' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">Simple, Transparent Pricing</h1>
          <p className="text-slate-500">Free forever for individuals during early access.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TIERS.map(tier => (
            <div key={tier.name} className={`bg-white rounded-2xl p-6 border space-y-4 ${tier.highlight ? 'border-2 border-indigo' : 'border-slate-100'}`}>
              {tier.badge && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{tier.badge}</span>}
              <div>
                <p className="font-bold text-text">{tier.name}</p>
                <p className="text-sm text-slate-500">{tier.target}</p>
              </div>
              <div className="text-3xl font-bold text-indigo">{tier.price}<span className="text-base font-normal text-slate-400">{tier.period}</span></div>
              <ul className="space-y-2">{tier.features.map(f => <li key={f} className="text-xs text-slate-600 flex gap-1"><span className="text-teal shrink-0">✓</span>{f}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
