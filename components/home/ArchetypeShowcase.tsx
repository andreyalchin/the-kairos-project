// components/home/ArchetypeShowcase.tsx
import Link from 'next/link'

const archetypes = [
  {
    name: 'Strategic Visionary',
    desc: 'Sees 10 moves ahead. Builds systems others can\'t yet imagine.',
    palette: { bg: 'bg-indigo-50', border: 'border-indigo-200/60', title: 'text-indigo-800', symbol: 'text-indigo-400' },
    symbol: '◈',
    featured: true,
  },
  {
    name: 'Empathetic Leader',
    desc: 'Reads rooms. Turns tension into trust.',
    palette: { bg: 'bg-pink-50', border: 'border-pink-200/60', title: 'text-pink-800', symbol: 'text-pink-400' },
    symbol: '◉',
    featured: false,
  },
  {
    name: 'Systematic Builder',
    desc: 'Executes where others theorize. Precision over speed.',
    palette: { bg: 'bg-teal-50', border: 'border-teal-200/60', title: 'text-teal-800', symbol: 'text-teal-400' },
    symbol: '⬡',
    featured: false,
  },
  {
    name: 'Creative Catalyst',
    desc: 'Connects ideas across domains no one else links.',
    palette: { bg: 'bg-amber-50', border: 'border-amber-200/60', title: 'text-amber-800', symbol: 'text-amber-400' },
    symbol: '✦',
    featured: false,
  },
  {
    name: 'Analytical Architect',
    desc: 'Finds the flaw before the plan launches.',
    palette: { bg: 'bg-cyan-50', border: 'border-cyan-200/60', title: 'text-cyan-800', symbol: 'text-cyan-400' },
    symbol: '◎',
    featured: true,
  },
  {
    name: 'Innovation Pioneer',
    desc: 'Comfortable in the unknown. Thrives at zero-to-one.',
    palette: { bg: 'bg-violet-50', border: 'border-violet-200/60', title: 'text-violet-800', symbol: 'text-violet-400' },
    symbol: '◐',
    featured: false,
  },
]

export function ArchetypeShowcase() {
  return (
    <section className="bg-bg py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-text text-center mb-4">32 Human Archetypes</h2>
        <p className="text-slate-500 text-center mb-14 text-lg max-w-xl mx-auto">
          Each archetype is a precise pattern of dimensions — not a horoscope, not a bucket.
        </p>

        {/* Bento grid — featured cards span 2 rows via row-span */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-auto">
          {archetypes.map(({ name, desc, palette, symbol, featured }) => (
            <div
              key={name}
              className={`
                ${featured ? 'row-span-1 md:row-span-2' : ''}
                ${palette.bg} ${palette.border}
                rounded-2xl border p-6 flex flex-col justify-between
                hover:-translate-y-1 transition-transform duration-200 shadow-sm
              `}
            >
              <div>
                <span className={`text-3xl ${palette.symbol} block mb-4`}>{symbol}</span>
                <p className={`font-bold text-base mb-2 ${palette.title}`}>{name}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
              {featured && (
                <p className={`text-xs font-semibold ${palette.symbol} mt-6 uppercase tracking-wider`}>
                  Featured archetype
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm text-indigo font-semibold">
          <Link href="/assessment" className="hover:underline">+ 26 more archetypes — take the assessment to find yours →</Link>
        </p>
      </div>
    </section>
  )
}
