// components/home/ReportPreview.tsx
import Link from 'next/link'

const sectionNames = [
  'Archetype Profile', 'Psychological Fingerprint', 'Cognitive Profile',
  'Motivational DNA', 'Career Intelligence', 'Leadership Profile',
  'Team Compatibility', 'Founder Score', 'Work Environment', 'Growth Roadmap',
  'Action Plan',
]

const blurredSections = ['Psychological Fingerprint', 'Cognitive Profile', 'Career Intelligence']

export function ReportPreview() {
  return (
    <section className="bg-gradient-to-br from-indigo to-indigo-800 py-20">
      <div className="max-w-4xl mx-auto px-4 text-center text-white space-y-8">
        <h2 className="text-3xl font-bold">An 11-Section Deep Report</h2>

        {/* Angled mockup card */}
        <div className="relative mx-auto max-w-sm" style={{ transform: 'rotate(-2deg)' }}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header bar */}
            <div className="bg-indigo px-6 py-4 flex items-center justify-between">
              <div className="text-left">
                <p className="text-white font-bold text-lg">Strategic Visionary</p>
                <p className="text-indigo-200 text-sm">Your Archetype</p>
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1">
                <p className="text-white text-sm font-semibold">94% match</p>
              </div>
        </div>
            {/* Radar chart stub */}
            <div className="px-6 py-4 bg-indigo-50/50 flex justify-center">
              <svg viewBox="0 0 120 100" className="w-32" fill="none">
                <polygon points="60,10 100,35 100,65 60,90 20,65 20,35" stroke="#3730A3" strokeWidth="1" opacity="0.3"/>
                <polygon points="60,25 82,40 82,60 60,75 38,60 38,40" stroke="#3730A3" strokeWidth="1" opacity="0.5"/>
                <polygon points="60,15 92,32 95,62 60,82 25,62 28,32" fill="#3730A3" fillOpacity="0.1" stroke="#3730A3" strokeWidth="1.5"/>
              </svg>
            </div>
            {/* Blurred section cards */}
            <div className="px-4 pb-4 space-y-3">
              {blurredSections.map(name => (
                <div key={name} className="p-3 rounded-xl bg-slate-50" style={{ filter: 'blur(2px)' }}>
                  <div className="h-2 bg-slate-200 rounded w-3/4 mb-1.5"/>
                  <div className="h-2 bg-slate-100 rounded w-1/2"/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section name pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {sectionNames.map(name => (
            <span key={name} className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
              {name}
            </span>
          ))}
        </div>

        <Link
          href="/results/demo"
          className="inline-block bg-white text-indigo px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
        >
          See your full report — free →
        </Link>
      </div>
    </section>
  )
}
