// components/home/Testimonials.tsx

// PLACEHOLDER — replace all quotes, names, and roles with real user data
const testimonials = [
  {
    quote: "I'd been applying to the wrong roles for two years. My Kairos report showed me I score in the 91st percentile for Strategic Vision but low on Execution Drive — I stopped chasing ops roles and landed a strategy position in six weeks.",
    name: 'Marcus T.',
    role: 'Operations → Strategy',
    tag: 'London',
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    quote: "We use Kairos before every senior hire. The behavioral inference layer catches candidates who interview well but are misaligned on actual work style.",
    name: 'Priya S.',
    role: 'Head of Talent',
    tag: 'Series B startup',
    color: 'bg-teal-50 text-teal-700',
  },
  {
    quote: "I thought I knew myself. The Psychological Fingerprint section showed me a conflict between my stated values and how I actually make decisions under pressure.",
    name: 'Daniel R.',
    role: 'Founder',
    tag: 'Berlin',
    color: 'bg-violet-50 text-violet-700',
  },
]

export function Testimonials() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-14">
          What people do with their results
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          {/* Featured — spans 2 cols */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg flex flex-col justify-between overflow-hidden">
            <div>
              <span className="text-7xl text-indigo/10 font-serif leading-none block -mb-2 select-none" aria-hidden="true">&ldquo;</span>
              <p className="text-slate-700 text-lg leading-relaxed mt-2">{testimonials[0].quote}</p>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo font-bold">{testimonials[0].name[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-text text-sm">{testimonials[0].name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">{testimonials[0].role}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${testimonials[0].color}`}>{testimonials[0].tag}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller stacked */}
          <div className="space-y-5">
            {testimonials.slice(1).map(t => (
              <div key={t.name} className="bg-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <p className="text-slate-300 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-5">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-300 font-bold text-xs">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{t.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-400 text-xs">{t.role}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${t.color}`}>{t.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
