# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Kairos landing page with challenger brand positioning, scientific credibility, and new sections (announcement bar, competitor contrast, testimonials, visual report preview, upgraded archetypes) to convert individuals, professionals, and HR/founders.

**Architecture:** All new landing sections are extracted into focused components under `components/home/`. `app/page.tsx` is a thin orchestrator that imports and sequences them. `app/layout.tsx` gains an `AnnouncementBar` above the existing `Header`. No new routes or API changes required.

**Tech Stack:** Next.js 14 App Router · TypeScript strict · Tailwind CSS (custom palette: indigo=#3730A3, teal=#0F766E, bg=#F8FAFC, text=#1E293B) · lucide-react · existing `<Card>` and `<Badge>` components from `components/ui/`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/layout.tsx` | Modify | Add `<AnnouncementBar />` above `<Header />` |
| `app/page.tsx` | Full rewrite | Orchestrate all sections in order |
| `components/layout/Header.tsx` | Modify | Add logo glyph SVG + tagline |
| `components/layout/AnnouncementBar.tsx` | Create | Dismissible teal early-access banner |
| `components/home/CompetitorContrast.tsx` | Create | Others vs Kairos 3-card section |
| `components/home/SciencePillars.tsx` | Create | 2-column science section with pull quote |
| `components/home/ArchetypeShowcase.tsx` | Create | Horizontal scroll archetype cards with SVG icons |
| `components/home/ReportPreview.tsx` | Create | Angled visual mockup card on indigo gradient |
| `components/home/Testimonials.tsx` | Create | 3 outcome-led quote cards |

---

### Task 1: AnnouncementBar component

**Files:**
- Create: `components/layout/AnnouncementBar.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/layout/AnnouncementBar.tsx
'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'kairos_announcement_dismissed'

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative bg-teal text-white text-sm text-center py-2 px-10">
      Early access — full reports free while we grow. No credit card required.
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Add to layout above Header**

In `app/layout.tsx`, import and add `<AnnouncementBar />` directly above `<Header />`:

```tsx
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
// ...
<body>
  <AnnouncementBar />
  <Header />
  <main>{children}</main>
  <Footer />
  <Analytics />
  <SpeedInsights />
</body>
```

- [ ] **Step 3: Verify it renders**

Run `npm run dev`. Visit `http://localhost:3000`. Confirm teal bar appears at top with dismiss ✕. Click ✕ — bar disappears. Reload — bar stays hidden (localStorage). Open DevTools → Application → Local Storage → clear `kairos_announcement_dismissed` → reload → bar reappears.

- [ ] **Step 4: Commit**

```bash
git add components/layout/AnnouncementBar.tsx app/layout.tsx
git commit -m "feat: add dismissible early-access announcement bar"
```

---

### Task 2: Header logo glyph + tagline

**Files:**
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: Update the logo block**

Replace the existing logo `<Link>` in `components/layout/Header.tsx`:

```tsx
// Before:
<Link href="/" className="text-xl font-bold text-indigo">Kairos</Link>

// After:
<Link href="/" className="flex items-center gap-2">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 1L17 9L9 17L1 9Z" stroke="#3730A3" strokeWidth="1.5"/>
    <circle cx="9" cy="9" r="2" fill="#3730A3"/>
  </svg>
  <div>
    <p className="text-xl font-bold text-indigo leading-none">Kairos</p>
    <p className="text-xs text-slate-400 leading-none mt-0.5">Human Potential Intelligence</p>
  </div>
</Link>
```

- [ ] **Step 2: Verify visually**

Run `npm run dev`. Confirm diamond glyph + "Kairos" + "Human Potential Intelligence" tagline renders correctly at the top-left. Check mobile — logo should not overflow or wrap awkwardly.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat: add logo glyph and tagline to header"
```

---

### Task 3: CompetitorContrast component

**Files:**
- Create: `components/home/CompetitorContrast.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
          <div key={title} className="rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <p className="font-semibold text-text text-sm">{title}</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-slate-300 font-bold mt-0.5">✕</span>
                <p className="text-sm text-slate-400">{others}</p>
              </div>
              <div className="flex gap-3 items-start bg-indigo-50 rounded-xl px-3 py-2">
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
```

- [ ] **Step 2: Commit**

```bash
git add components/home/CompetitorContrast.tsx
git commit -m "feat: add CompetitorContrast section"
```

---

### Task 4: SciencePillars component

**Files:**
- Create: `components/home/SciencePillars.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/home/SciencePillars.tsx
git commit -m "feat: add SciencePillars section"
```

---

### Task 5: ArchetypeShowcase component

**Files:**
- Create: `components/home/ArchetypeShowcase.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/home/ArchetypeShowcase.tsx
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
          <a href="/archetypes">+ 26 more archetypes →</a>
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ArchetypeShowcase.tsx
git commit -m "feat: add ArchetypeShowcase with SVG icons and descriptions"
```

---

### Task 6: ReportPreview component

**Files:**
- Create: `components/home/ReportPreview.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/home/ReportPreview.tsx
import Link from 'next/link'

const sectionNames = [
  'Archetype Profile', 'Psychological Fingerprint', 'Cognitive Profile',
  'Motivational DNA', 'Career Intelligence', 'Leadership Profile',
  'Team Compatibility', 'Founder Score', 'Work Environment', 'Growth Roadmap',
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
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ReportPreview.tsx
git commit -m "feat: add ReportPreview visual mockup section"
```

---

### Task 7: Testimonials component

**Files:**
- Create: `components/home/Testimonials.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/home/Testimonials.tsx
git commit -m "feat: add Testimonials section with outcome-led quotes"
```

---

### Task 8: Rewrite app/page.tsx

**Files:**
- Modify: `app/page.tsx` (full rewrite)

This task assembles all components into the final page in the correct order. Do NOT import components that don't exist yet — all previous tasks must be complete first.

- [ ] **Step 1: Rewrite app/page.tsx**

```tsx
// app/page.tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Target, Network, TrendingUp, Building2 } from 'lucide-react'
import { CompetitorContrast } from '@/components/home/CompetitorContrast'
import { SciencePillars } from '@/components/home/SciencePillars'
import { ArchetypeShowcase } from '@/components/home/ArchetypeShowcase'
import { ReportPreview } from '@/components/home/ReportPreview'
import { Testimonials } from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,#3730A315,transparent_60%),radial-gradient(ellipse_at_20%_80%,#0F766E10,transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
          <Badge variant="indigo">Built on Big Five + HEXACO + Adaptive IRT</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-text leading-tight">
            Most personality tests<br />
            are <span className="text-slate-400">guessing.</span><br />
            Kairos <span className="text-indigo">measures.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            29 scientifically validated dimensions. 32 distinct archetypes. Behavioral
            inference that catches what self-report misses. Your complete intelligence
            profile in 12 minutes — free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              Take the Free Assessment
            </Link>
            <Link
              href="/results/demo"
              className="border border-indigo text-indigo px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              See a Sample Report
            </Link>
          </div>
          {/* PLACEHOLDER: replace 10,000+ with real verified number */}
          <p className="text-sm text-slate-400">
            No account required · 40–82 adaptive questions · Used by 10,000+ professionals
          </p>
        </div>
      </section>

      {/* ── Social Proof Bar ── */}
      <section className="border-y border-slate-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
          {/* PLACEHOLDER: replace all four values with real verified stats */}
          {[
            { value: '10,847', label: 'Assessments completed' },
            { value: '29', label: 'Dimensions measured' },
            { value: '32', label: 'Archetypes identified' },
            { value: 'Big Five + HEXACO', label: 'Scientific foundation' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-indigo">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitor Contrast ── */}
      <CompetitorContrast />

      {/* ── How It Works ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-12">How Kairos Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Take the Assessment',
                desc: '40–82 adaptive questions across 29 dimensions. No registration required.',
              },
              {
                step: '2',
                title: 'Get Your Profile',
                desc: 'The scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions in real time.',
              },
              {
                step: '3',
                title: 'Unlock Deep Insight',
                desc: 'Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan.',
              },
            ].map(({ step, title, desc }) => (
              <Card key={step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo text-white text-xl font-bold flex items-center justify-center mx-auto">
                  {step}
                </div>
                <h3 className="font-semibold text-text text-lg">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Science Pillars ── */}
      <SciencePillars />

      {/* ── Archetype Showcase ── */}
      <ArchetypeShowcase />

      {/* ── Report Preview ── */}
      <ReportPreview />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Enterprise ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="teal">Enterprise</Badge>
            <h2 className="text-3xl font-bold text-text">
              Built for teams that take talent seriously
            </h2>
            <p className="text-slate-600">
              Kairos Enterprise gives founders and HR leaders a scientific lens into
              candidate potential, team composition, and capability gaps — not vibes.
            </p>
            <Link
              href="/enterprise"
              className="inline-block border border-teal text-teal px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
            >
              Talk to us about Enterprise →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Target size={16} className="text-indigo" />, title: 'Trait-based hiring', desc: 'Match candidates to role requirements scientifically' },
              { icon: <Network size={16} className="text-indigo" />, title: 'Team compatibility', desc: 'See how profiles interact before you build the team' },
              { icon: <TrendingUp size={16} className="text-indigo" />, title: 'Leadership scoring', desc: 'Identify who\'s ready to lead before it\'s too late' },
              { icon: <Building2 size={16} className="text-indigo" />, title: 'Culture fit analysis', desc: 'Measure values and work style alignment, not just skills' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-4 bg-white rounded-xl border border-slate-100 space-y-1.5">
                {icon}
                <p className="font-medium text-text text-sm">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-3">Simple Pricing</h2>
          <p className="text-slate-500 text-center mb-10">
            Paid plans launching later in 2026. Lock in free access now.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <div className="space-y-4">
                <p className="font-bold text-text text-lg">Free</p>
                <p className="text-3xl font-bold text-indigo">$0 <span className="text-sm font-normal text-slate-400">forever</span></p>
                <ul className="space-y-1.5">
                  {['First 2 report sections', 'No account required', 'Archetype + Fingerprint'].map(f => (
                    <li key={f} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-teal">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/assessment"
                  className="block text-center border border-indigo text-indigo px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Take Free Assessment
                </Link>
              </div>
            </Card>
            <Card className="border-2 border-indigo">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-text text-lg">Early Access</p>
                  <Badge variant="teal">Most Popular</Badge>
                </div>
                <p className="text-3xl font-bold text-indigo">$0 <span className="text-sm font-normal text-slate-400">during beta</span></p>
                <ul className="space-y-1.5">
                  {[
                    'Full 11-section report',
                    'Requires free account',
                    'Retakes + history',
                    'Growth tracking',
                    'Priority support',
                  ].map(f => (
                    <li key={f} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-teal">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/assessment"
                  className="block text-center bg-indigo text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
                >
                  Unlock Full Report
                </Link>
              </div>
            </Card>
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">
            Free forever for individuals during early access.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-4xl font-bold text-text">
          12 minutes. 29 dimensions. One profile that&apos;s actually you.
        </h2>
        {/* PLACEHOLDER: replace 10,000+ with real verified number */}
        <p className="text-slate-500 text-lg">
          Join 10,000+ professionals who&apos;ve stopped guessing about themselves.
        </p>
        <Link
          href="/assessment"
          className="inline-block bg-indigo text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Take the Free Assessment
        </Link>
      </section>

    </div>
  )
}
```

- [ ] **Step 2: Run the build to check for TypeScript/ESLint errors**

```bash
npm run build
```

Expected: build completes with no errors. If TypeScript errors appear, fix them before continuing. Common issues: missing imports, unescaped entities (use `&apos;` `&ldquo;` `&rdquo;`), lucide icon names.

- [ ] **Step 3: Verify the page in browser**

Run `npm run dev`. Visit `http://localhost:3000`. Walk through the page top to bottom and confirm:
- Announcement bar appears (teal, dismissible)
- Hero headline renders with correct color split (slate-300 / indigo)
- Social proof bar shows 4 stat blocks
- Competitor contrast shows 3 cards with ✕/✓ rows
- How It Works shows 3 numbered cards
- Science pillars shows 2-column layout with pull quote
- Archetype showcase shows 6 cards with SVG icons, horizontal scroll works
- Report preview shows angled card on indigo gradient
- Testimonials shows 3 quote cards with stars
- Enterprise shows icon feature cards
- Pricing shows 2 tiers with correct feature lists
- Final CTA renders correctly

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite landing page with challenger brand positioning"
```

---

### Task 9: Push and verify Vercel deploy

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Monitor Vercel build**

Check Vercel dashboard or run:
```bash
vercel --prod 2>/dev/null || echo "Check Vercel dashboard for deploy status"
```

Expected: build passes (same as local `npm run build`). If it fails, read the error log — common causes are TypeScript strict null violations or unescaped entities that were missed locally.

- [ ] **Step 3: Smoke test production URL**

Visit the production URL. Confirm the announcement bar, hero, and all new sections render correctly.
