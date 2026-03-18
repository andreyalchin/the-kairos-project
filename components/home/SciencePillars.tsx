// components/home/SciencePillars.tsx
const pillars = [
  {
    title: 'Big Five + HEXACO',
    desc: 'The only two personality frameworks with decades of peer-reviewed validation. Not trends. Not intuition.',
  },
  {
    title: 'Adaptive IRT',
    desc: 'Item Response Theory: questions shift based on your answers. 40 adaptive questions beat 200 static ones.',
  },
  {
    title: 'Behavioral Inference',
    desc: 'Response latency and revision patterns are scored. Hesitation reveals what confidence hides.',
  },
  {
    title: 'Normative Benchmarking',
    desc: 'Your scores placed against a general adult population. Not just "you\'re curious" — you\'re in the 87th percentile.',
  },
]

export function SciencePillars() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-text text-center mb-12">
        The science isn&apos;t a feature. It&apos;s the foundation.
      </h2>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          {pillars.map(({ title, desc }) => (
            <div key={title} className="space-y-1">
              <h3 className="font-semibold text-text">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-indigo pl-6 bg-slate-50 rounded-r-2xl py-6 pr-6">
          <p className="text-slate-700 italic text-lg leading-relaxed">
            &ldquo;Kairos uses the same psychometric frameworks deployed by Fortune 500 HR
            departments — accessible to anyone in 12 minutes.&rdquo;
          </p>
          <p className="text-sm text-slate-400 mt-4">— Assessment methodology overview</p>
        </div>
      </div>
    </section>
  )
}
