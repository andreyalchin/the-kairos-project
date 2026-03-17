import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,#3730A315,transparent_60%),radial-gradient(ellipse_at_20%_80%,#0F766E10,transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
          <Badge variant="indigo">Now in early access</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-text leading-tight">
            Know your<br /><span className="text-indigo">moment.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The most scientifically rigorous human potential assessment available. 29 dimensions. 32 archetypes. Your complete intelligence profile in 12 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors">
              Take the Free Assessment
            </Link>
            <Link href="/results/demo" className="border border-indigo text-indigo px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors">
              See a Sample Report
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Social proof bar */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm text-slate-500">
          {['10,000+ assessments completed', '32 unique archetypes', '29 validated dimensions', 'Built on Big Five + HEXACO research'].map(stat => (
            <span key={stat} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />{stat}
            </span>
          ))}
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-text text-center mb-12">How Kairos Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Take the Assessment', desc: '40–82 adaptive questions across 29 dimensions. ~12 minutes. No registration required.' },
            { step: '2', title: 'Get Your Profile', desc: 'Our scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions.' },
            { step: '3', title: 'Unlock Deep Insight', desc: 'Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan.' },
          ].map(({ step, title, desc }) => (
            <Card key={step} className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo text-white text-xl font-bold flex items-center justify-center mx-auto">{step}</div>
              <h3 className="font-semibold text-text text-lg">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 4: Archetype Showcase */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-4">32 Human Archetypes</h2>
          <p className="text-slate-500 text-center mb-10">Each archetype is a pattern of dimensions that describes who you are and how you operate.</p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {['Strategic Visionary','Empathetic Leader','Systematic Builder','Creative Catalyst','Analytical Architect','Innovation Pioneer'].map(name => (
              <Card key={name} className="min-w-48 text-center flex-shrink-0 space-y-2 bg-gradient-to-br from-indigo-50 to-white">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo to-teal mx-auto" />
                <p className="font-semibold text-text text-sm">{name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Science */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-text text-center mb-12">Built on Science</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Big Five + HEXACO', desc: 'The most validated personality frameworks in academic research.' },
            { title: 'Adaptive IRT', desc: 'Questions calibrate to your response patterns, maximizing precision in fewer questions.' },
            { title: 'Behavioral Inference', desc: 'Response time and revision patterns reveal what self-report misses.' },
            { title: 'Normative Benchmarks', desc: 'Every score contextualized against general adult population percentiles.' },
          ].map(({ title, desc }) => (
            <Card key={title} glass className="space-y-2">
              <h3 className="font-semibold text-indigo">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 6: Report Preview */}
      <section className="bg-gradient-to-br from-indigo to-indigo-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white space-y-6">
          <h2 className="text-3xl font-bold">An 11-Section Deep Report</h2>
          <p className="text-indigo-200">Archetype Profile · Psychological Fingerprint · Cognitive Profile · Motivational DNA · Career Intelligence · Leadership Profile · Team Compatibility · Founder Score · Work Environment · Growth Roadmap</p>
          <Link href="/results/demo" className="inline-block bg-white text-indigo px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
            See Sample Report →
          </Link>
        </div>
      </section>

      {/* Section 7: For Companies */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="teal">Enterprise</Badge>
            <h2 className="text-3xl font-bold text-text">Built for Team Intelligence</h2>
            <p className="text-slate-600">Kairos Enterprise gives HR teams and founders a scientific lens into candidate potential, team composition, and organizational capability gaps.</p>
            <Link href="/enterprise" className="inline-block border border-teal text-teal px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors">
              Learn More →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Trait-based hiring','Team compatibility matrix','Leadership potential scoring','Culture fit analysis'].map(feature => (
              <div key={feature} className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-600">{feature}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Pricing preview */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-10">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['Sections 1–2', 'No account required', 'Archetype + Fingerprint'] },
              { name: 'Professional', price: '$29/mo', features: ['Full 11-section report', 'Retakes', 'Growth tracking'], highlight: true },
              { name: 'Enterprise', price: 'Custom', features: ['Candidate assessments', 'Team dashboard', 'API access'] },
            ].map(({ name, price, features, highlight }) => (
              <Card key={name} className={highlight ? 'border-2 border-indigo' : ''}>
                <div className="space-y-3">
                  <p className="font-bold text-text text-lg">{name}</p>
                  <p className="text-3xl font-bold text-indigo">{price}</p>
                  <ul className="space-y-1">{features.map(f => <li key={f} className="text-sm text-slate-600 flex gap-2"><span className="text-teal">✓</span>{f}</li>)}</ul>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-6">Free forever for individuals during early access.</p>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-4xl font-bold text-text">Ready to know your moment?</h2>
        <p className="text-slate-500 text-lg">12 minutes to your complete Human Potential Intelligence Profile.</p>
        <Link href="/assessment" className="inline-block bg-indigo text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors">
          Take the Free Assessment
        </Link>
      </section>
    </div>
  )
}
