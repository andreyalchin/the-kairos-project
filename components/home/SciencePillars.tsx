// components/home/SciencePillars.tsx

const pillars = [
  {
    title: 'Big Five + HEXACO',
    desc: 'The only two personality frameworks with decades of peer-reviewed validation. Not trends. Not intuition.',
    accent: 'indigo' as const,
    symbol: '◈',
  },
  {
    title: 'Adaptive IRT',
    desc: 'Item Response Theory: questions shift based on your answers. 80-question calibration phase + adaptive targeting — each question is maximally informative for your profile.',
    accent: 'teal' as const,
    symbol: '◎',
  },
  {
    title: 'Behavioral Inference',
    desc: 'Response latency and revision patterns are scored. Hesitation reveals what confidence hides.',
    accent: 'violet' as const,
    symbol: '⬡',
  },
  {
    title: 'Normative Benchmarking',
    desc: 'Your scores placed against a general adult population. Not just "you\'re curious" — you\'re in the 87th percentile.',
    accent: 'amber' as const,
    symbol: '◐',
  },
]

const accentStyles = {
  indigo: { ring: 'border-indigo/30', circle: 'bg-indigo/20 text-indigo-300' },
  teal:   { ring: 'border-teal/30',   circle: 'bg-teal/20 text-teal-300' },
  violet: { ring: 'border-violet-500/30', circle: 'bg-violet-500/20 text-violet-300' },
  amber:  { ring: 'border-amber-500/30',  circle: 'bg-amber-500/20 text-amber-300' },
}

export function SciencePillars() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="max-w-6xl mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-4">
            The science isn&apos;t a feature.<br />It&apos;s the foundation.
          </h2>
          <p className="text-slate-400 text-lg">Built on decades of peer-reviewed research.</p>
        </div>

        {/* 2×2 bento */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {pillars.map(({ title, desc, accent, symbol }) => {
            const s = accentStyles[accent]
            return (
              <div
                key={title}
                className={`rounded-2xl p-7 border ${s.ring} bg-slate-800/60 hover:-translate-y-1 transition-transform duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${s.circle} flex items-center justify-center text-xl flex-shrink-0`}>
                    {symbol}
                  </div>
                  <h3 className="font-bold text-white text-lg">{title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            )
          })}
        </div>

        {/* Pull quote */}
        <div className="relative rounded-2xl bg-indigo/10 border border-indigo/20 px-8 py-10 md:px-14 overflow-hidden">
          <span className="absolute top-4 left-6 text-8xl text-indigo/20 font-serif leading-none select-none pointer-events-none" aria-hidden="true">&ldquo;</span>
          <p className="relative text-white/90 italic text-xl leading-relaxed text-center max-w-3xl mx-auto">
            Kairos uses the same psychometric frameworks deployed by Fortune 500 HR
            departments — accessible to anyone in 12 minutes.
          </p>
          <p className="text-slate-500 text-sm text-center mt-5">— Assessment methodology overview</p>
        </div>

      </div>
    </section>
  )
}
