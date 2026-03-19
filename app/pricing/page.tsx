import Link from 'next/link'

// ✓ = available now   ◎ = in development
type Feature = { text: string; live: boolean }

interface Tier {
  name: string
  audience: string
  price: string
  period: string
  priceSub: string
  highlight?: boolean
  betaNote?: string
  cta: string
  ctaHref: string
  ctaStyle: 'primary' | 'outline' | 'ghost'
  badge?: string
  features: Feature[]
  roadmap: Feature[]
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    audience: 'Everyone',
    price: '$0',
    period: '',
    priceSub: 'during beta · then free for 2 sections',
    betaNote: 'Full report unlocked for all users during beta. After beta, the free tier shows your Archetype and Fingerprint — sections 1 and 2 only.',
    cta: 'Take the Assessment',
    ctaHref: '/assessment',
    ctaStyle: 'outline',
    features: [
      { text: 'Full 11-section report (beta only)', live: true },
      { text: 'All 29 dimensions measured', live: true },
      { text: 'Archetype identification + match score', live: true },
      { text: 'Psychological Fingerprint radar', live: true },
      { text: 'No account required', live: true },
      { text: 'No credit card, ever', live: true },
    ],
    roadmap: [
      { text: 'After beta: sections 1–2 permanently free', live: false },
    ],
  },
  {
    name: 'Individual',
    audience: 'Professionals & students',
    price: '$4.99',
    period: '/report',
    priceSub: 'one-time · no subscription',
    highlight: true,
    badge: 'Free during beta',
    cta: 'Get Full Access',
    ctaHref: '/assessment',
    ctaStyle: 'primary',
    features: [
      { text: 'Full 11-section report, forever', live: true },
      { text: 'All 29 dimensions + HPIF framework', live: true },
      { text: 'Career Potential Matrix', live: true },
      { text: 'Team Compatibility profile', live: true },
      { text: 'Leadership & Founder potential scores', live: true },
      { text: 'Retake history + score comparison', live: true },
      { text: 'PDF export', live: true },
    ],
    roadmap: [
      { text: 'Longitudinal growth tracking (12-month view)', live: false },
      { text: 'Career path recommendations engine', live: false },
      { text: 'Side-by-side report comparison', live: false },
      { text: 'Coaching session integration', live: false },
      { text: 'Custom role fit scoring', live: false },
    ],
  },
  {
    name: 'Corporate',
    audience: 'HR teams & hiring managers',
    price: '$9.99',
    period: '/candidate',
    priceSub: 'pay per assessment · no seat minimum',
    badge: 'Coming soon',
    cta: 'Join the Waitlist',
    ctaHref: 'mailto:andrey.alchin@gmail.com?subject=Corporate plan interest',
    ctaStyle: 'outline',
    features: [
      { text: 'Everything in Individual', live: true },
      { text: 'Candidate assessment portal', live: false },
      { text: 'Hiring dashboard with role fit scores', live: false },
      { text: 'Team compatibility matrix', live: false },
      { text: 'Bulk candidate management', live: false },
      { text: 'Structured interview question generator', live: false },
      { text: 'Onboarding compatibility report', live: false },
    ],
    roadmap: [
      { text: 'ATS integration (Greenhouse, Lever, Workday)', live: false },
      { text: 'Anonymous team benchmark comparisons', live: false },
      { text: 'Manager–direct report compatibility scoring', live: false },
      { text: 'Diversity & cognitive-style analytics', live: false },
      { text: 'Automated post-hire fit tracking', live: false },
    ],
  },
  {
    name: 'Recruiter Network',
    audience: 'Recruiting firms & talent partners',
    price: '$99',
    period: '/month',
    priceSub: 'unlimited candidate assessments included',
    badge: 'Coming soon',
    cta: 'Join the Waitlist',
    ctaHref: 'mailto:andrey.alchin@gmail.com?subject=Recruiter plan interest',
    ctaStyle: 'outline',
    features: [
      { text: 'Everything in Corporate', live: true },
      { text: 'Unlimited candidate assessments', live: false },
      { text: 'Trait-based search and filtering', live: false },
      { text: 'Candidate shortlisting tools', live: false },
      { text: 'Client-shareable candidate reports', live: false },
      { text: 'Multi-client workspace management', live: false },
      { text: 'Limited API access', live: false },
    ],
    roadmap: [
      { text: 'Passive candidate talent marketplace', live: false },
      { text: 'Automated fit-score ranking for job posts', live: false },
      { text: 'White-label candidate report branding', live: false },
      { text: 'Recruiter analytics dashboard', live: false },
      { text: 'Bulk outreach with trait-matched messaging', live: false },
    ],
  },
  {
    name: 'Talent API',
    audience: 'Developers & platforms',
    price: '$1',
    period: '/analysis',
    priceSub: 'pay per call · volume discounts available',
    badge: 'Coming soon',
    cta: 'Request API Access',
    ctaHref: 'mailto:andrey.alchin@gmail.com?subject=API access interest',
    ctaStyle: 'outline',
    features: [
      { text: 'Full 29 dimension scores as JSON', live: false },
      { text: 'Archetype assignment + match score', live: false },
      { text: 'Behavioral inference signals', live: false },
      { text: 'HPIF profile layers', live: false },
      { text: 'Secure token-based auth', live: false },
      { text: 'Comprehensive API documentation', live: false },
    ],
    roadmap: [
      { text: 'Webhook support for async completion', live: false },
      { text: 'Batch processing endpoint', live: false },
      { text: 'Custom scoring model integration', live: false },
      { text: 'White-label embed (iFrame + headless)', live: false },
      { text: 'SOC 2 compliance documentation', live: false },
      { text: 'Dedicated developer sandbox', live: false },
    ],
  },
]

const FAQ = [
  {
    q: 'What happens when beta ends?',
    a: 'The free tier will permanently cover Sections 1–2 (Archetype and Psychological Fingerprint). Full reports will move to the Individual plan at $4.99 per report. Everyone who takes the assessment during beta gets to keep their existing results at no charge.',
  },
  {
    q: 'Is $4.99 a subscription?',
    a: 'No. Individual pricing is per-report — one payment, permanent access to that report. There is no recurring charge. If you want to retake the assessment later, each retake is an additional $4.99.',
  },
  {
    q: 'When do the paid business plans launch?',
    a: 'Corporate, Recruiter Network, and Talent API are in active development. We are targeting a phased rollout in late 2026. You can join the waitlist for any plan by clicking the relevant button above — waitlist members get early access and grandfather pricing.',
  },
  {
    q: 'What does "per candidate" mean for Corporate?',
    a: 'Each candidate assessment is $9.99, billed as they complete it. There is no seat fee, no platform fee, and no minimum commitment. You pay only for the assessments you actually run.',
  },
  {
    q: 'Can I use Kairos for hiring decisions?',
    a: 'Kairos provides behavioral and psychometric data to inform hiring — not to make hiring decisions autonomously. Our results are designed to be one input among many. We follow APA guidelines on the use of psychological assessments in employment contexts and recommend reviewing results alongside structured interviews and work samples.',
  },
  {
    q: 'Is there an enterprise or custom pricing option?',
    a: "Yes. For organizations with high volume, custom integrations, or white-label requirements, we offer bespoke arrangements. Reach out at hello@kairos.so and we'll respond within one business day.",
  },
]

function FeatureList({ features, roadmap }: { features: Feature[]; roadmap: Feature[] }) {
  return (
    <div className="space-y-2">
      {features.map(f => (
        <div key={f.text} className="flex gap-2.5 text-sm">
          <span className={`shrink-0 font-bold mt-0.5 ${f.live ? 'text-teal' : 'text-slate-300'}`}>
            {f.live ? '✓' : '◎'}
          </span>
          <span className={f.live ? 'text-slate-700' : 'text-slate-400'}>{f.text}</span>
        </div>
      ))}
      {roadmap.length > 0 && (
        <>
          <div className="border-t border-slate-100 pt-2 mt-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">On the roadmap</p>
          </div>
          {roadmap.map(f => (
            <div key={f.text} className="flex gap-2.5 text-sm">
              <span className="shrink-0 text-slate-300 font-bold mt-0.5">◎</span>
              <span className="text-slate-400">{f.text}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function DarkFeatureList({ features, roadmap }: { features: Feature[]; roadmap: Feature[] }) {
  return (
    <div className="space-y-2">
      {features.map(f => (
        <div key={f.text} className="flex gap-2.5 text-sm">
          <span className={`shrink-0 font-bold mt-0.5 ${f.live ? 'text-teal' : 'text-slate-600'}`}>
            {f.live ? '✓' : '◎'}
          </span>
          <span className={f.live ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
        </div>
      ))}
      {roadmap.length > 0 && (
        <>
          <div className="border-t border-slate-700 pt-2 mt-3">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">On the roadmap</p>
          </div>
          {roadmap.map(f => (
            <div key={f.text} className="flex gap-2.5 text-sm">
              <span className="shrink-0 text-slate-600 font-bold mt-0.5">◎</span>
              <span className="text-slate-600">{f.text}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div className={`bg-white rounded-2xl border flex flex-col hover:-translate-y-1 transition-transform duration-200 ${tier.highlight ? 'border-2 border-indigo shadow-lg shadow-indigo/10' : 'border-slate-100'}`}>

      {/* Top */}
      <div className="p-6 border-b border-slate-100 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-text text-lg leading-tight">{tier.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{tier.audience}</p>
          </div>
          {tier.badge && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              tier.badge === 'Free during beta'
                ? 'bg-teal text-white'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {tier.badge}
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-indigo">
            {tier.price}
            <span className="text-base font-normal text-slate-400">{tier.period}</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{tier.priceSub}</p>
        </div>
        <a
          href={tier.ctaHref}
          className={`block text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            tier.ctaStyle === 'primary'
              ? 'bg-indigo text-white hover:bg-indigo-600'
              : tier.ctaStyle === 'outline'
              ? 'border border-indigo text-indigo hover:bg-indigo-50'
              : 'text-slate-500 hover:text-indigo'
          }`}
        >
          {tier.cta}
        </a>
      </div>

      {/* Features */}
      <div className="p-6 flex-1">
        {tier.betaNote && (
          <div className="bg-teal/5 border border-teal/20 rounded-xl px-3 py-2.5 mb-4">
            <p className="text-xs text-teal leading-relaxed">{tier.betaNote}</p>
          </div>
        )}
        <FeatureList features={tier.features} roadmap={tier.roadmap} />
      </div>

    </div>
  )
}

function DarkTierCard({ tier }: { tier: Tier }) {
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col hover:-translate-y-1 transition-transform duration-200">

      {/* Top */}
      <div className="p-6 border-b border-slate-700 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-white text-lg leading-tight">{tier.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{tier.audience}</p>
          </div>
          {tier.badge && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 bg-slate-700 text-slate-300">
              {tier.badge}
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-teal">
            {tier.price}
            <span className="text-base font-normal text-slate-400">{tier.period}</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{tier.priceSub}</p>
        </div>
        <a
          href={tier.ctaHref}
          className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-teal text-teal hover:bg-teal hover:text-white"
        >
          {tier.cta}
        </a>
      </div>

      {/* Features */}
      <div className="p-6 flex-1">
        <DarkFeatureList features={tier.features} roadmap={tier.roadmap} />
      </div>

    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-20">
        <span className="absolute right-8 bottom-4 text-[12rem] font-black text-white/5 leading-none select-none pointer-events-none" aria-hidden="true">$0</span>
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-5">
          <div className="inline-block bg-teal/20 text-teal text-xs font-semibold px-3 py-1 rounded-full">Beta — Full reports free right now</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Transparent Pricing</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Free for individuals during beta. Honest pricing after. No dark patterns, no bait-and-switch.
          </p>
        </div>
      </section>

      {/* Beta banner */}
      <div className="bg-teal text-white text-center py-2.5 px-4">
        <p className="text-sm font-medium">
          Beta is live — full individual reports are free for everyone right now.{' '}
          <Link href="/assessment" className="underline font-semibold hover:opacity-80">
            Take yours before pricing launches →
          </Link>
        </p>
      </div>

      {/* Individual tiers */}
      <section className="bg-bg py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text text-center mb-2">For individuals</h2>
          <p className="text-slate-500 text-center mb-10">Personal growth, career clarity, self-knowledge.</p>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {TIERS.slice(0, 2).map(tier => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
          <div className="flex gap-6 justify-center mt-6 text-xs text-slate-400">
            <span className="flex gap-1.5 items-center"><span className="text-teal font-bold">✓</span> Available now</span>
            <span className="flex gap-1.5 items-center"><span className="text-slate-300 font-bold">◎</span> In development</span>
          </div>
        </div>
      </section>

      {/* Business tiers */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-2">For teams and platforms</h2>
          <p className="text-slate-400 text-center mb-10">Hiring intelligence, candidate screening, API access.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {TIERS.slice(2).map(tier => (
              <DarkTierCard key={tier.name} tier={tier} />
            ))}
          </div>
          <div className="flex gap-6 justify-center mt-6 text-xs text-slate-500">
            <span className="flex gap-1.5 items-center"><span className="text-teal font-bold">✓</span> Available now</span>
            <span className="flex gap-1.5 items-center"><span className="text-slate-600 font-bold">◎</span> In development</span>
          </div>
        </div>
      </section>

      {/* Why we built it this way */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-text text-center mb-10">Why we built it this way</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-indigo-50 border border-indigo/20 rounded-2xl p-6 space-y-2 hover:-translate-y-1 transition-transform duration-200">
              <p className="font-semibold text-text">Individuals first</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most psychometric tools cost hundreds of dollars per report when sold through consultants. At $4.99, we are making professional-grade self-knowledge accessible to anyone who wants it — not just people at companies with HR budgets.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal/20 rounded-2xl p-6 space-y-2 hover:-translate-y-1 transition-transform duration-200">
              <p className="font-semibold text-text">No subscription traps</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Individual reports are pay-per-use. You own your report permanently after one payment. We do not charge you monthly to access something you already paid for. That model exists to extract value from customers — not to create it.
              </p>
            </div>
            <div className="bg-violet-50 border border-violet-200/50 rounded-2xl p-6 space-y-2 hover:-translate-y-1 transition-transform duration-200">
              <p className="font-semibold text-text">Beta access is a real gift</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Full reports are free during beta because we need real data to keep improving our models. You are helping us build a better product. In exchange, you get a report that would cost $50–$300 elsewhere, at no cost. That is a fair trade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <h2 className="text-2xl font-bold text-text text-center mb-8">Common questions</h2>
        {FAQ.map(({ q, a }) => (
          <div key={q} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-2">
            <p className="font-semibold text-text">{q}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo via-indigo-800 to-indigo-950 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#6366f130,transparent_65%)]" />
        <div className="relative max-w-3xl mx-auto px-4 space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Still free right now. Not for much longer.</h2>
          <p className="text-indigo-200 text-lg">Take the full assessment before paid plans launch.</p>
          <div className="pt-2">
            <Link
              href="/assessment"
              className="inline-block bg-white text-indigo px-10 py-4 rounded-xl text-lg font-bold hover:bg-indigo-50 hover:scale-105 transition-all"
            >
              Take the Free Assessment
            </Link>
          </div>
          <p className="text-indigo-300 text-xs">No account required to start. 15–20 minutes.</p>
        </div>
      </section>

    </div>
  )
}
