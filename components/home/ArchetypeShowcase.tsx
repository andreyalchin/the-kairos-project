// components/home/ArchetypeShowcase.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/Card'

const archetypes = [
  {
    name: 'Strategic Visionary',
    desc: 'Sees 10 moves ahead. Builds systems others can\'t yet imagine.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="#3730A3" strokeWidth="1.5"/>
        <circle cx="24" cy="24" r="2" fill="#3730A3"/>
        <path d="M24 6v4M24 38v4M6 24h4M38 24h4" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18 18l12-6-6 12-12 6z" fill="#3730A3" fillOpacity="0.3"/>
      </svg>
    ),
  },
  {
    name: 'Empathetic Leader',
    desc: 'Reads rooms. Turns tension into trust.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="16" r="5" fill="#3730A3" fillOpacity="0.8"/>
        <circle cx="12" cy="34" r="4" fill="#3730A3" fillOpacity="0.6"/>
        <circle cx="36" cy="34" r="4" fill="#3730A3" fillOpacity="0.6"/>
        <line x1="24" y1="21" x2="12" y2="30" stroke="#3730A3" strokeWidth="1.5"/>
        <line x1="24" y1="21" x2="36" y2="30" stroke="#3730A3" strokeWidth="1.5"/>
        <line x1="12" y1="34" x2="36" y2="34" stroke="#3730A3" strokeWidth="1.5" strokeOpacity="0.4"/>
      </svg>
    ),
  },
  {
    name: 'Systematic Builder',
    desc: 'Executes where others theorize. Precision over speed.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="14" height="14" rx="2" stroke="#3730A3" strokeWidth="1.5"/>
        <rect x="26" y="8" width="14" height="14" rx="2" stroke="#3730A3" strokeWidth="1.5"/>
        <rect x="8" y="26" width="14" height="14" rx="2" stroke="#3730A3" strokeWidth="1.5"/>
        <rect x="26" y="26" width="14" height="14" rx="2" fill="#3730A3" fillOpacity="0.2" stroke="#3730A3" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: 'Creative Catalyst',
    desc: 'Connects ideas across domains no one else links.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 6l3 12h12l-10 8 4 14-9-7-9 7 4-14L9 18h12z" stroke="#3730A3" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Analytical Architect',
    desc: 'Finds the flaw before the plan launches.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 8L40 38H8L24 8Z" stroke="#3730A3" strokeWidth="1.5"/>
        <line x1="16" y1="28" x2="32" y2="28" stroke="#3730A3" strokeWidth="1.5" strokeOpacity="0.5"/>
        <line x1="20" y1="18" x2="28" y2="18" stroke="#3730A3" strokeWidth="1.5" strokeOpacity="0.3"/>
        <circle cx="24" cy="8" r="2" fill="#3730A3"/>
      </svg>
    ),
  },
  {
    name: 'Innovation Pioneer',
    desc: 'Comfortable in the unknown. Thrives at zero-to-one.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="12" stroke="#3730A3" strokeWidth="1.5" strokeDasharray="4 2"/>
        <path d="M24 16v16M18 22l6-6 6 6" stroke="#3730A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export function ArchetypeShowcase() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-text text-center mb-4">32 Human Archetypes</h2>
        <p className="text-slate-500 text-center mb-10">
          Each archetype is a precise pattern of dimensions — not a horoscope, not a bucket.
        </p>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {archetypes.map(({ name, desc, icon }) => (
            <Card
              key={name}
              className="min-w-[180px] flex-shrink-0 text-center space-y-3 bg-gradient-to-br from-indigo-50 to-white"
            >
              <div className="mx-auto w-12 h-12">{icon}</div>
              <p className="font-semibold text-text text-sm">{name}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </Card>
          ))}
        </div>
        <p className="text-center mt-8 text-sm text-indigo font-medium">
          <Link href="/assessment">+ 26 more archetypes →</Link>
        </p>
      </div>
    </section>
  )
}
