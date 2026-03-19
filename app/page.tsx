// app/page.tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Target, Network, TrendingUp, Building2 } from 'lucide-react'
import { HeroCanvas } from '@/components/home/HeroCanvas'
import { CompetitorContrast } from '@/components/home/CompetitorContrast'
import { SciencePillars } from '@/components/home/SciencePillars'
import { ArchetypeShowcase } from '@/components/home/ArchetypeShowcase'
import { ReportPreview } from '@/components/home/ReportPreview'
import { Testimonials } from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '560px' }}>
        <HeroCanvas />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-28 min-h-[560px]">
          <Badge variant="indigo" className="mb-6">Built on Big Five + HEXACO + Adaptive IRT</Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-text leading-tight max-w-3xl">
            Most personality tests are <span className="text-slate-400">guessing.</span><br />
            Kairos <span className="text-indigo">measures.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl">
            29 validated dimensions · 32 archetypes · behavioral inference. Your complete profile — free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </section>

      {/* ── Social Proof Bar ── */}
      <section className="bg-slate-900 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-20">
          {/* PLACEHOLDER: replace with real verified stats */}
          <div className="text-center">
            <p className="text-3xl sm:text-5xl font-black text-white">10,847</p>
            <p className="text-sm text-slate-400 mt-1">Assessments completed</p>
          </div>
          <div className="hidden md:block w-px h-14 bg-slate-700 self-center" aria-hidden="true" />
          <div className="text-center">
            <p className="text-3xl sm:text-5xl font-black text-indigo">29</p>
            <p className="text-sm text-slate-400 mt-1">Dimensions measured</p>
          </div>
          <div className="hidden md:block w-px h-14 bg-slate-700 self-center" aria-hidden="true" />
          <div className="text-center">
            <p className="text-3xl sm:text-5xl font-black text-teal">32</p>
            <p className="text-sm text-slate-400 mt-1">Archetypes identified</p>
          </div>
          <div className="hidden md:block w-px h-14 bg-slate-700 self-center" aria-hidden="true" />
          <div className="text-center">
            <p className="text-2xl font-black text-white leading-tight">Big Five<br />+ HEXACO</p>
            <p className="text-sm text-slate-400 mt-1">Scientific foundation</p>
          </div>
        </div>
      </section>

      {/* ── Competitor Contrast ── */}
      <CompetitorContrast />

      {/* ── How It Works ── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-text text-center mb-4">How Kairos Works</h2>
          <p className="text-slate-500 text-center mb-14 text-lg">Three steps. No fluff.</p>
          <div className="grid md:grid-cols-3 gap-5">

            {/* Step 1 — wide */}
            <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-indigo/10 bg-gradient-to-br from-indigo-50 to-white p-5 md:p-8 shadow-sm hover:-translate-y-1 transition-transform duration-200">
              <span className="absolute right-4 -top-2 text-[9rem] font-black text-indigo/5 leading-none select-none pointer-events-none" aria-hidden="true">1</span>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo flex items-center justify-center mb-5">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="font-bold text-text text-xl mb-2">Take the Assessment</h3>
                <p className="text-slate-500 leading-relaxed">40–82 adaptive questions across 29 dimensions. No registration required. Questions calibrate to your responses in real time.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative overflow-hidden rounded-2xl border border-teal/20 bg-gradient-to-br from-teal-50 to-white p-5 md:p-8 shadow-sm hover:-translate-y-1 transition-transform duration-200">
              <span className="absolute right-4 -top-2 text-[9rem] font-black text-teal/5 leading-none select-none pointer-events-none" aria-hidden="true">2</span>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center mb-5">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h3 className="font-bold text-text text-xl mb-2">Get Your Profile</h3>
                <p className="text-slate-500 leading-relaxed">The scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions in real time.</p>
              </div>
            </div>

            {/* Step 3 — full width */}
            <div className="md:col-span-3 relative overflow-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50 to-white p-5 md:p-8 shadow-sm hover:-translate-y-1 transition-transform duration-200">
              <span className="absolute right-8 -top-2 text-[9rem] font-black text-violet-500/5 leading-none select-none pointer-events-none" aria-hidden="true">3</span>
              <div className="relative md:flex items-center gap-12">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center mb-5">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-bold text-text text-xl mb-2">Unlock Deep Insight</h3>
                  <p className="text-slate-500 max-w-md leading-relaxed">Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan — all in one report.</p>
                </div>
                <div className="hidden md:flex gap-2.5 flex-wrap mt-6 md:mt-0">
                  {['Archetype', 'HPIF Profile', 'Career Intelligence', 'Team Compatibility', '90-Day Plan', 'Growth Edges', 'Blind Spots'].map(tag => (
                    <span key={tag} className="bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

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
      <section className="bg-slate-900 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="teal">Enterprise</Badge>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Built for teams that take talent seriously
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Kairos Enterprise gives founders and HR leaders a scientific lens into
                candidate potential, team composition, and capability gaps — not vibes.
              </p>
              <Link
                href="/enterprise"
                className="inline-block bg-teal text-white px-7 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Talk to us about Enterprise →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <Target size={16} className="text-teal" />, stat: 'r = .48', title: 'Trait-based hiring', desc: 'Match candidates to role requirements scientifically' },
                { icon: <Network size={16} className="text-teal" />, stat: '+24%', title: 'Team compatibility', desc: 'Validity improvement over unstructured interviews' },
                { icon: <TrendingUp size={16} className="text-teal" />, stat: '85 yrs', title: 'Leadership scoring', desc: 'Of psychometric research backing the methodology' },
                { icon: <Building2 size={16} className="text-teal" />, stat: '$50k', title: 'Culture fit analysis', desc: 'Average cost of a bad senior hire — measurably reduced' },
              ].map(({ icon, stat, title, desc }) => (
                <div key={title} className="p-5 bg-slate-800 rounded-2xl border border-slate-700 space-y-2 hover:-translate-y-1 transition-transform duration-200">
                  <p className="text-2xl font-black text-teal">{stat}</p>
                  <div className="flex items-center gap-2">{icon}<p className="font-semibold text-white text-sm">{title}</p></div>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-bg py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text mb-3">Free during beta. Honest pricing after.</h2>
            <p className="text-slate-500 text-lg">Full individual reports are $0 right now.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {/* Featured free plan */}
            <div className="relative overflow-hidden bg-indigo rounded-2xl p-7 shadow-xl text-white">
              <span className="absolute -right-3 -top-3 text-[7rem] font-black text-white/5 leading-none select-none pointer-events-none" aria-hidden="true">$0</span>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-5">Beta — Free now</span>
              <p className="text-5xl font-black mb-1">$0</p>
              <p className="text-indigo-200 text-sm mb-6">Individual · $4.99 after beta</p>
              <Link
                href="/assessment"
                className="block text-center bg-white text-indigo rounded-xl py-2.5 font-semibold text-sm hover:bg-indigo-50 transition-colors"
              >
                Take Free Assessment
              </Link>
            </div>
            {/* Corporate */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Corporate</p>
                <p className="text-5xl font-black text-text mb-1">$9.99</p>
                <p className="text-slate-400 text-sm mb-5">per candidate</p>
                <p className="text-sm text-slate-500 leading-relaxed">Hiring dashboard, role-fit scores, team compatibility matrix</p>
              </div>
              <p className="text-xs text-slate-400 mt-5 font-medium">Launching 2026</p>
            </div>
            {/* Recruiter */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Recruiter Network</p>
                <p className="text-5xl font-black text-text mb-1">$99</p>
                <p className="text-slate-400 text-sm mb-5">per month</p>
                <p className="text-sm text-slate-500 leading-relaxed">Unlimited candidates, API access, white-label reports</p>
              </div>
              <p className="text-xs text-slate-400 mt-5 font-medium">Launching 2026</p>
            </div>
          </div>
          <p className="text-center mt-8">
            <Link href="/pricing" className="text-indigo text-sm font-semibold hover:underline">
              See full pricing &amp; features →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo via-indigo-800 to-indigo-950 py-28 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#6366f130,transparent_65%)]" />
        <div className="relative max-w-3xl mx-auto px-4 space-y-6">
          {/* PLACEHOLDER: replace with validated timing */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            12 minutes.<br />29 dimensions.<br />One profile that&apos;s actually you.
          </h2>
          {/* PLACEHOLDER: replace 10,000+ with real verified number */}
          <p className="text-indigo-200 text-base sm:text-xl">
            Join 10,000+ professionals who&apos;ve stopped guessing about themselves.
          </p>
          <div className="pt-2">
            <Link
              href="/assessment"
              className="inline-block bg-white text-indigo px-12 py-4 rounded-xl text-lg font-bold hover:bg-indigo-50 hover:scale-105 transition-all"
            >
              Take the Free Assessment
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
