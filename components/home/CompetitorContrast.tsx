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
    <section className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-text text-center mb-4">
        Other tests tell you a story. Kairos tells you the truth.
      </h2>
      <p className="text-slate-500 text-center mb-12">
        The difference isn&apos;t just depth — it&apos;s methodology.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {contrasts.map(({ title, others, kairos }) => (
          <div key={title} className="rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <p className="font-semibold text-text text-sm">{title}</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-3 items-start min-h-[54px]">
                <span className="text-slate-300 font-bold mt-0.5">✕</span>
                <p className="text-sm text-slate-400">{others}</p>
              </div>
              <div className="flex gap-3 items-start bg-indigo-50 rounded-xl px-3 py-2 min-h-[72px]">
                <span className="text-indigo font-bold mt-0.5">✓</span>
                <p className="text-sm text-text font-medium">{kairos}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-slate-500 mt-8 text-sm italic">
        Most popular assessments measure broad buckets. Kairos measures you.
      </p>
    </section>
  )
}
