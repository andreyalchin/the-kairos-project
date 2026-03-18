// app/page.tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Target, Network, TrendingUp, Building2 } from 'lucide-react'
import { CompetitorContrast } from '@/components/home/CompetitorContrast'
import { SciencePillars } from '@/components/home/SciencePillars'
import { ArchetypeShowcase } from '@/components/home/ArchetypeShowcase'
import { ReportPreview } from '@/components/home/ReportPreview'
import { Testimonials } from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,#3730A315,transparent_60%),radial-gradient(ellipse_at_20%_80%,#0F766E10,transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
          <Badge variant="indigo">Built on Big Five + HEXACO + Adaptive IRT</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-text leading-tight">
            Most personality tests<br />
            are <span className="text-slate-400">guessing.</span><br />
            Kairos <span className="text-indigo">measures.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            29 scientifically validated dimensions. 32 distinct archetypes. Behavioral
            inference that catches what self-report misses. Your complete intelligence
            profile in 12 minutes — free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              Take the Free Assessment
            </Link>
            <Link
              href="/results/demo"
              className="border border-indigo text-indigo px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              See a Sample Report
            </Link>
          </div>
          {/* PLACEHOLDER: replace 10,000+ with real verified number */}
          <p className="text-sm text-slate-400">
            No account required · 40–82 adaptive questions · Used by 10,000+ professionals
          </p>
        </div>
      </section>

      {/* ── Social Proof Bar ── */}
      <section className="border-y border-slate-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
          {/* PLACEHOLDER: replace all four values with real verified stats */}
          {[
            { value: '10,847', label: 'Assessments completed' },
            { value: '29', label: 'Dimensions measured' },
            { value: '32', label: 'Archetypes identified' },
            { value: 'Big Five + HEXACO', label: 'Scientific foundation' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-indigo">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitor Contrast ── */}
      <CompetitorContrast />

      {/* ── How It Works ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-12">How Kairos Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Take the Assessment',
                desc: '40–82 adaptive questions across 29 dimensions. No registration required.',
              },
              {
                step: '2',
                title: 'Get Your Profile',
                desc: 'The scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions in real time.',
              },
              {
                step: '3',
                title: 'Unlock Deep Insight',
                desc: 'Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan.',
              },
            ].map(({ step, title, desc }) => (
              <Card key={step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo text-white text-xl font-bold flex items-center justify-center mx-auto">
                  {step}
                </div>
                <h3 className="font-semibold text-text text-lg">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science Pillars ── */}
      <SciencePillars />

      {/* ── Archetype Showcase ── */}
      <ArchetypeShowcase />

      {/* ── Report Preview ── */}
      <ReportPreview />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Enterprise ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="teal">Enterprise</Badge>
            <h2 className="text-3xl font-bold text-text">
              Built for teams that take talent seriously
            </h2>
            <p className="text-slate-600">
              Kairos Enterprise gives founders and HR leaders a scientific lens into
              candidate potential, team composition, and capability gaps — not vibes.
            </p>
            <Link
              href="/enterprise"
              className="inline-block border border-teal text-teal px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
            >
              Talk to us about Enterprise →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Target size={16} className="text-indigo" />, title: 'Trait-based hiring', desc: 'Match candidates to role requirements scientifically' },
              { icon: <Network size={16} className="text-indigo" />, title: 'Team compatibility', desc: 'See how profiles interact before you build the team' },
              { icon: <TrendingUp size={16} className="text-indigo" />, title: 'Leadership scoring', desc: 'Identify who\'s ready to lead before it\'s too late' },
              { icon: <Building2 size={16} className="text-indigo" />, title: 'Culture fit analysis', desc: 'Measure values and work style alignment, not just skills' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-4 bg-white rounded-xl border border-slate-100 space-y-1.5">
                {icon}
                <p className="font-medium text-text text-sm">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-3">Simple Pricing</h2>
          <p className="text-slate-500 text-center mb-10">
            Paid plans launching later in 2026. Lock in free access now.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <div className="space-y-4">
                <p className="font-bold text-text text-lg">Free</p>
                <p className="text-3xl font-bold text-indigo">$0 <span className="text-sm font-normal text-slate-400">forever</span></p>
                <ul className="space-y-1.5">
                  {['First 2 report sections', 'No account required', 'Archetype + Fingerprint'].map(f => (
                    <li key={f} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-teal">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/assessment"
                  className="block text-center border border-indigo text-indigo px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Take Free Assessment
                </Link>
              </div>
            </Card>
            <Card className="border-2 border-indigo">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-text text-lg">Early Access</p>
                  <Badge variant="teal">Most Popular</Badge>
                </div>
                <p className="text-3xl font-bold text-indigo">$0 <span className="text-sm font-normal text-slate-400">during beta</span></p>
                <ul className="space-y-1.5">
                  {[
                    'Full 11-section report',
                    'Requires free account',
                    'Retakes + history',
                    'Growth tracking',
                    'Priority support',
                  ].map(f => (
                    <li key={f} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-teal">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/assessment"
                  className="block text-center bg-indigo text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
                >
                  Unlock Full Report
                </Link>
              </div>
            </Card>
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">
            Free forever for individuals during early access.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-4xl font-bold text-text">
          12 minutes. 29 dimensions. One profile that&apos;s actually you.
        </h2>
        {/* PLACEHOLDER: replace 10,000+ with real verified number */}
        <p className="text-slate-500 text-lg">
          Join 10,000+ professionals who&apos;ve stopped guessing about themselves.
        </p>
        <Link
          href="/assessment"
          className="inline-block bg-indigo text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Take the Free Assessment
        </Link>
      </section>

    </div>
  )
}
