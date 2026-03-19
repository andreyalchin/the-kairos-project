// components/home/ReportPreview.tsx
import Link from 'next/link'

const sectionNames = [
  'Archetype Profile', 'Psychological Fingerprint', 'Cognitive Profile',
  'Motivational DNA', 'Career Intelligence', 'Leadership Profile',
  'Team Compatibility', 'Founder Score', 'Work Environment', 'Growth Roadmap',
  'Action Plan',
]

export function ReportPreview() {
  return (
    <section className="bg-gradient-to-br from-indigo to-indigo-900 py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">An 11-Section Deep Report</h2>
          <p className="text-indigo-200 text-lg">Every dimension scored. Every insight explained.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Mockup card */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-full max-w-xs" style={{ transform: 'rotate(-1.5deg)' }}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-indigo px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-xl">Strategic Visionary</p>
                  <p className="text-indigo-200 text-sm mt-0.5">Your Archetype · Rarity: 4.2%</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                  <div className="relative bg-white/20 rounded-full px-3 py-1.5">
                    <p className="text-white text-sm font-bold">94% match</p>
                  </div>
                </div>
              </div>
              {/* Radar stub */}
              <div className="px-6 py-5 bg-indigo-50/60 flex justify-center">
                <svg viewBox="0 0 140 120" className="w-36" fill="none">
                  <polygon points="70,10 116,37 116,83 70,110 24,83 24,37" stroke="#3730A3" strokeWidth="1" opacity="0.15"/>
                  <polygon points="70,28 98,44 98,76 70,92 42,76 42,44" stroke="#3730A3" strokeWidth="1" opacity="0.25"/>
                  <polygon points="70,16 108,38 111,76 70,100 29,76 32,38" fill="#3730A3" fillOpacity="0.08" stroke="#3730A3" strokeWidth="1.5"/>
                  <polygon points="70,22 102,40 104,75 70,96 36,75 38,40" fill="#3730A3" fillOpacity="0.12" stroke="#3730A3" strokeWidth="1"/>
                </svg>
              </div>
              {/* Section rows */}
              <div className="px-4 pb-5 pt-2 space-y-2">
                {[
                  { label: 'Cognitive OS', value: 'Analytical-Convergent', color: 'bg-indigo-100 text-indigo-700' },
                  { label: 'Primary Driver', value: 'Achievement', color: 'bg-teal-100 text-teal-700' },
                  { label: 'Leadership Tier', value: 'Visionary', color: 'bg-violet-100 text-violet-700' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500">{label}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{value}</span>
                  </div>
                ))}
                {/* Blurred locked section */}
                <div className="px-3 py-2 bg-slate-50 rounded-xl" style={{ filter: 'blur(3px)', userSelect: 'none' }}>
                  <div className="h-2.5 bg-slate-200 rounded w-2/3 mb-1.5" />
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Section list */}
          <div className="mt-10 md:mt-0 flex-1">
            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-5">What&apos;s inside</p>
            <div className="space-y-2">
              {sectionNames.map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${i < 2 ? 'bg-white/15' : 'bg-white/5'}`}
                >
                  <span className="text-xs font-bold text-indigo-300 w-5 text-center">{i + 1}</span>
                  <p className={`text-sm font-medium ${i < 2 ? 'text-white' : 'text-indigo-200'}`}>{name}</p>
                  {i >= 2 && (
                    <span className="ml-auto text-xs bg-white/10 text-indigo-300 px-2 py-0.5 rounded-full">Auth required</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/results/demo"
                className="inline-block bg-white text-indigo px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 hover:scale-105 transition-all"
              >
                See your full report — free →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
