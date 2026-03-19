// components/home/CompetitorContrast.tsx
const contrasts = [
  {
    title: 'Method',
    others: 'Fixed questionnaires with gameable answers',
    kairos: 'Adaptive IRT — questions calibrate to your responses in real time',
  },
  {
    title: 'Depth',
    others: '4–5 broad types or letter combinations',
    kairos: '29 dimensions across cognitive, behavioral, motivational and leadership axes',
  },
  {
    title: 'Behavioral Layer',
    others: 'Self-report only — you say what you think you are',
    kairos: 'Response latency and revision patterns scored — catches what you\'d never admit',
  },
]

export function CompetitorContrast() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
      <div className="text-center mb-14">
        <h2 className="text-2xl md:text-5xl font-bold text-text mb-4">
          Other tests tell you a story.<br />Kairos tells you the truth.
        </h2>
        <p className="text-slate-500 text-lg">The difference isn&apos;t just depth — it&apos;s methodology.</p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {contrasts.map(({ title, others, kairos }) => (
          <div key={title} className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-3 border-r border-slate-100">
                <p className="text-xs font-medium text-slate-400 mb-1">Others</p>
                <p className="text-sm text-slate-500">{others}</p>
              </div>
              <div className="px-4 py-3 bg-indigo/5">
                <p className="text-xs font-medium text-indigo mb-1">Kairos</p>
                <p className="text-sm text-indigo font-medium">{kairos}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden md:block">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_48px_1fr] mb-3 px-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right pr-4">Everyone else</p>
          <div />
          <p className="text-xs font-semibold text-indigo uppercase tracking-wider pl-4">Kairos</p>
        </div>

        <div className="space-y-3">
          {contrasts.map(({ title, others, kairos }) => (
            <div key={title} className="grid grid-cols-[1fr_48px_1fr] items-stretch rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              {/* Others */}
              <div className="bg-slate-50 px-6 py-5 flex items-center justify-end">
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1 font-medium">{title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{others}</p>
                </div>
              </div>
              {/* vs divider */}
              <div className="flex items-center justify-center bg-white border-x border-slate-100">
                <span className="text-xs font-bold text-slate-300">vs</span>
              </div>
              {/* Kairos */}
              <div className="bg-indigo px-6 py-5 flex items-center">
                <div>
                  <p className="text-xs text-indigo-300 mb-1 font-medium">{title}</p>
                  <p className="text-sm text-white font-medium leading-relaxed">{kairos}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-slate-400 mt-8 text-sm italic">
        Most popular assessments measure broad buckets. Kairos measures you.
      </p>
    </section>
  )
}
