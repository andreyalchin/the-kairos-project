// components/home/Testimonials.tsx
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'

// PLACEHOLDER — replace all quotes, names, and roles with real user data
const testimonials = [
  {
    quote: "I'd been applying to the wrong roles for two years. My Kairos report showed me I score in the 91st percentile for Strategic Vision but low on Execution Drive — I stopped chasing ops roles and landed a strategy position in six weeks.",
    name: 'Marcus T.',
    role: 'Operations → Strategy, London',
  },
  {
    quote: "We use Kairos before every senior hire. The behavioral inference layer catches candidates who interview well but are misaligned on actual work style. It's replaced three tools we were paying for separately.",
    name: 'Priya S.',
    role: 'Head of Talent, Series B startup',
  },
  {
    quote: "I thought I knew myself. The Psychological Fingerprint section showed me a conflict between my stated values and how I actually make decisions under pressure. That one insight was worth the whole thing.",
    name: 'Daniel R.',
    role: 'Founder, Berlin',
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-text text-center mb-12">
          What people do with their results
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role }) => (
            <Card key={name} className="space-y-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" stroke="none" />
                ))}
              </div>
              <p className="text-slate-700 italic text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-text text-sm">{name}</p>
                <p className="text-xs text-slate-400">{role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
