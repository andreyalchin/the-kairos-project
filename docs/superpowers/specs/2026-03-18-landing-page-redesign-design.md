# Landing Page Redesign — Design Spec

**Date:** 2026-03-18
**Status:** Approved (v2 — post review)

## Goal

Rebuild the Kairos landing page to convert all three primary audiences — individuals (self-discovery), ambitious professionals (competitive edge), and HR/founders (enterprise evaluation) — using a confident challenger brand strategy that establishes scientific authority, creates emotional resonance, and positions Kairos against weaker category competitors without naming them.

## Positioning Strategy

**Approach: Confident Challenger Brand**

Open with a bold attack on the category ("Most personality tests are guessing"), plant the flag ("Kairos measures"), then deliver scientific credibility and personal payoff. Science and emotion are woven together throughout — not siloed. Testimonials lead with concrete outcomes, not feelings. The report preview is visual, not a list of section names.

## Page Structure

Sections in order:

1. Header (redesigned)
2. Announcement bar (new)
3. Hero
4. Social proof bar
5. Competitor contrast (new)
6. How It Works
7. Science pillars (upgraded)
8. Archetype showcase (upgraded)
9. Report preview (upgraded)
10. Testimonials (new)
11. Enterprise
12. Pricing (simplified)
13. Final CTA

---

## Section Specifications

### 1. Header

**Logo:** "Kairos" in indigo bold (text-xl font-bold). Prepend a small inline SVG glyph — a diamond shape with a center dot:

```svg
<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M9 1L17 9L9 17L1 9Z" stroke="#3730A3" strokeWidth="1.5" fill="none"/>
  <circle cx="9" cy="9" r="2" fill="#3730A3"/>
</svg>
```

Place the SVG inline, `mr-2`, vertically centered with the wordmark.

**Tagline:** `<p className="text-xs text-slate-400 leading-none mt-0.5">Human Potential Intelligence</p>` — stacked beneath the wordmark inside the logo link block.

**Nav links (desktop only, `hidden md:flex`):** Science · Pricing · Enterprise

All three link to `/science`, `/pricing`, `/enterprise` respectively. These pages don't exist yet — use standard `href` links (they will 404 until built, which is acceptable for now). Do not disable or stub them.

**Auth area:** `<UserNav />` (existing component, unchanged)

**CTA:** "Take the Assessment →" — `bg-indigo text-white px-4 py-2 rounded-lg text-sm font-medium` — links to `/assessment`. Visible on all screen sizes. The existing UserNav already renders this button when the user is not logged in; when logged in it renders "New Assessment." This behavior is unchanged.

---

### 2. Announcement Bar

New component: `components/layout/AnnouncementBar.tsx`

- Renders above `<Header />` in `app/layout.tsx`
- Full-width, `bg-teal text-white text-sm text-center py-2 px-4`
- Content: *"Early access — full reports free while we grow. No credit card required."*
- Dismiss button: `<button>` with `<X size={14} />` from lucide-react, absolutely positioned right side
- localStorage key: `kairos_announcement_dismissed`
- On mount: read key; if `"true"`, render `null`
- On dismiss click: set key to `"true"`, hide component
- Must be a `'use client'` component

---

### 3. Hero

**Layout:** `text-center`, `max-w-6xl mx-auto px-4 pt-24 pb-20 space-y-8`

**Background:** Retain existing radial gradient.

**Badge:**
```tsx
<Badge variant="indigo">Built on Big Five + HEXACO + Adaptive IRT</Badge>
```

**Headline:**
```tsx
<h1 className="text-5xl md:text-7xl font-bold text-text leading-tight">
  Most personality tests<br />are <span className="text-slate-400">guessing.</span><br />
  Kairos <span className="text-indigo">measures.</span>
</h1>
```
"guessing." in slate-400 (muted, implies weakness). "measures." in indigo (confident).

**Sub-headline:**
```tsx
<p className="text-xl text-slate-600 max-w-2xl mx-auto">
  29 scientifically validated dimensions. 32 distinct archetypes.
  Behavioral inference that catches what self-report misses.
  Your complete intelligence profile in 12 minutes — free.
</p>
```
Note: "12 minutes" is illustrative placeholder. {/* PLACEHOLDER: replace with validated timing */}

**CTAs:**
```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link href="/assessment" className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold ...">
    Take the Free Assessment
  </Link>
  <Link href="/results/demo" className="border border-indigo text-indigo px-8 py-4 rounded-xl text-lg font-semibold ...">
    See a Sample Report
  </Link>
</div>
```

**Below CTAs:**
```tsx
<p className="text-sm text-slate-400">
  No account required · 40–82 adaptive questions · Used by 10,000+ professionals {/* PLACEHOLDER */}
</p>
```

---

### 4. Social Proof Bar

Full-width white strip: `border-y border-slate-100 bg-white py-6`

Four stat blocks in a flex row, centered, wrapping on mobile (`flex flex-wrap justify-center gap-8 md:gap-16`):

Each block:
```tsx
<div className="text-center">
  <p className="text-3xl font-bold text-indigo">{value}</p>
  <p className="text-sm text-slate-500 mt-1">{label}</p>
</div>
```

Stats: {/* PLACEHOLDER — all four values */}

| Value | Label |
|---|---|
| 10,847 | Assessments completed |
| 29 | Dimensions measured |
| 32 | Archetypes identified |
| Big Five + HEXACO | Scientific foundation |

Note: Remove the "94% accuracy" stat — this is a specific scientific claim that requires a citation source. Replace with "Big Five + HEXACO" foundation label which is accurate and verifiable. The previous "94% accuracy vs Big Five gold standard" is removed from the spec.

Dividers between stats on desktop: `hidden md:block w-px h-8 bg-slate-200 self-center`

---

### 5. Competitor Contrast

New component: `components/home/CompetitorContrast.tsx`

**Section wrapper:** `max-w-6xl mx-auto px-4 py-20`

**Headline:** `"Other tests tell you a story. Kairos tells you the truth."` — `text-3xl font-bold text-text text-center mb-4`

**Sub:** `"The difference isn't just depth — it's methodology."` — `text-slate-500 text-center mb-12`

**Three cards** in `grid md:grid-cols-3 gap-6`:

Each card has two rows inside:
- "Others" row: `bg-slate-50 rounded-xl p-4 mb-3` with a subtle `✕` in slate-400 and muted text
- "Kairos" row: `bg-indigo-50 rounded-xl p-4` with a `✓` in indigo and confident text

**Card 1 — Method:**
- Others: Fixed questionnaires with gameable answers
- Kairos: Adaptive IRT — questions calibrate to your responses in real time

**Card 2 — Depth:**
- Others: 4–5 broad types or letter combinations
- Kairos: 29 dimensions across cognitive, behavioral, motivational and leadership axes

**Card 3 — Behavioral Layer:**
- Others: Self-report only — you say what you think you are
- Kairos: Response latency and revision patterns scored — catches what you'd never admit

**Closing line (centered, below cards):**
```tsx
<p className="text-center text-slate-500 mt-8 text-sm italic">
  Most popular assessments measure broad buckets. Kairos measures you.
</p>
```

No competitor brand names anywhere in this section or this file.

---

### 6. How It Works

Existing structure retained. Copy updates only (inline in `app/page.tsx`):

1. **Take the Assessment** — 40–82 adaptive questions across 29 dimensions. No registration required.
2. **Get Your Profile** — The scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions in real time.
3. **Unlock Deep Insight** — Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan.

---

### 7. Science Pillars

New component: `components/home/SciencePillars.tsx`

**Section wrapper:** `max-w-6xl mx-auto px-4 py-20`

**Headline:** `"The science isn't a feature. It's the foundation."` — centered, `text-3xl font-bold text-text mb-12`

**Layout:** `grid md:grid-cols-2 gap-12 items-start`

**Left column — four methodology pillars** (space-y-6):

Each pillar:
```tsx
<div className="space-y-1">
  <h3 className="font-semibold text-text">{title}</h3>
  <p className="text-sm text-slate-600">{description}</p>
</div>
```

Pillars:

| Title | Description |
|---|---|
| Big Five + HEXACO | The only two personality frameworks with decades of peer-reviewed validation. Not trends. Not intuition. |
| Adaptive IRT | Item Response Theory: questions shift based on your answers. 40 adaptive questions beat 200 static ones. |
| Behavioral Inference | Response latency and revision patterns are scored. Hesitation reveals what confidence hides. |
| Normative Benchmarking | Your scores placed against a general adult population. Not just "you're curious" — you're in the 87th percentile. |

**Right column — pull quote block:**
```tsx
<div className="border-l-4 border-indigo pl-6 bg-slate-50 rounded-r-xl py-6 pr-6">
  <p className="text-slate-700 italic text-lg leading-relaxed">
    "Kairos uses the same psychometric frameworks deployed by Fortune 500 HR
    departments — accessible to anyone in 12 minutes."
  </p>
  <p className="text-sm text-slate-400 mt-4">— Assessment methodology overview</p>
</div>
```

---

### 8. Archetype Showcase

New component: `components/home/ArchetypeShowcase.tsx`

**Section wrapper:** `bg-white py-20`

**Headline:** `"32 Human Archetypes"` — centered, text-3xl font-bold

**Sub:** `"Each archetype is a precise pattern of dimensions — not a horoscope, not a bucket."` — centered, text-slate-500 mb-10

**Horizontal scroll container:** `flex gap-4 overflow-x-auto pb-4 scroll-smooth`

Six archetype cards, each `min-w-[180px] flex-shrink-0`:

Each card structure:
```tsx
<Card className="text-center space-y-3 bg-gradient-to-br from-indigo-50 to-white">
  {/* SVG icon — 48x48, mx-auto */}
  <p className="font-semibold text-text text-sm">{name}</p>
  <p className="text-xs text-slate-500">{description}</p>
</Card>
```

**Six archetypes with inline SVG icons:**

**Strategic Visionary** — compass icon:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="18" stroke="#3730A3" strokeWidth="1.5"/>
  <circle cx="24" cy="24" r="2" fill="#3730A3"/>
  <path d="M24 6v4M24 38v4M6 24h4M38 24h4" stroke="#3730A3" strokeWidth="1.5" strokeLinecap="round"/>
  <path d="M18 18l12 -6-6 12-12 6z" fill="#3730A3" opacity="0.3"/>
</svg>
```
Description: *"Sees 10 moves ahead. Builds systems others can't yet imagine."*

**Empathetic Leader** — connected nodes icon:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="16" r="5" fill="#3730A3" opacity="0.8"/>
  <circle cx="12" cy="34" r="4" fill="#3730A3" opacity="0.6"/>
  <circle cx="36" cy="34" r="4" fill="#3730A3" opacity="0.6"/>
  <line x1="24" y1="21" x2="12" y2="30" stroke="#3730A3" strokeWidth="1.5"/>
  <line x1="24" y1="21" x2="36" y2="30" stroke="#3730A3" strokeWidth="1.5"/>
  <line x1="12" y1="34" x2="36" y2="34" stroke="#3730A3" strokeWidth="1.5" opacity="0.4"/>
</svg>
```
Description: *"Reads rooms. Turns tension into trust."*

**Systematic Builder** — grid icon:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect x="8" y="8" width="14" height="14" rx="2" stroke="#3730A3" strokeWidth="1.5"/>
  <rect x="26" y="8" width="14" height="14" rx="2" stroke="#3730A3" strokeWidth="1.5"/>
  <rect x="8" y="26" width="14" height="14" rx="2" stroke="#3730A3" strokeWidth="1.5"/>
  <rect x="26" y="26" width="14" height="14" rx="2" fill="#3730A3" opacity="0.2" stroke="#3730A3" strokeWidth="1.5"/>
</svg>
```
Description: *"Executes where others theorize. Precision over speed."*

**Creative Catalyst** — lightning/starburst icon:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <path d="M24 6l3 12h12l-10 8 4 14-9-7-9 7 4-14L9 18h12z" stroke="#3730A3" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
</svg>
```
Description: *"Connects ideas across domains no one else links."*

**Analytical Architect** — triangle/pyramid icon:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <path d="M24 8L40 38H8L24 8Z" stroke="#3730A3" strokeWidth="1.5" fill="none"/>
  <line x1="16" y1="28" x2="32" y2="28" stroke="#3730A3" strokeWidth="1.5" opacity="0.5"/>
  <line x1="20" y1="18" x2="28" y2="18" stroke="#3730A3" strokeWidth="1.5" opacity="0.3"/>
  <circle cx="24" cy="8" r="2" fill="#3730A3"/>
</svg>
```
Description: *"Finds the flaw before the plan launches."*

**Innovation Pioneer** — arrow breaking out of circle icon:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="12" stroke="#3730A3" strokeWidth="1.5" strokeDasharray="4 2"/>
  <path d="M24 16v16M18 22l6-6 6 6" stroke="#3730A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
```
Description: *"Comfortable in the unknown. Thrives at zero-to-one."*

**Footer link:**
```tsx
<p className="text-center mt-8 text-sm text-indigo font-medium cursor-pointer">
  + 26 more archetypes →
</p>
```
Links to `/archetypes` (page does not exist yet — `href="/archetypes"` is acceptable).

**Scroll behavior:** Standard CSS horizontal scroll (`overflow-x-auto`). No scroll-snap, no navigation arrows, no auto-scroll. Works by drag/swipe on mobile and scroll on desktop. This is sufficient for MVP.

---

### 9. Report Preview

New component: `components/home/ReportPreview.tsx`

**Section wrapper:** `bg-gradient-to-br from-indigo to-indigo-800 py-20`

**Inner layout:** `max-w-4xl mx-auto px-4 text-center text-white space-y-8`

**Headline:** `"An 11-Section Deep Report"` — text-3xl font-bold

**Visual mockup card** (the centerpiece):
```tsx
<div className="relative mx-auto max-w-sm" style={{ transform: 'rotate(-2deg)' }}>
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
    {/* Header bar */}
    <div className="bg-indigo px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-white font-bold text-lg">Strategic Visionary</p>
        <p className="text-indigo-200 text-sm">Your Archetype</p>
      </div>
      <div className="bg-white/20 rounded-full px-3 py-1">
        <p className="text-white text-sm font-semibold">94% match</p>
      </div>
    </div>
    {/* Radar chart stub — static SVG hexagon */}
    <div className="px-6 py-4 bg-indigo-50/50">
      <svg viewBox="0 0 120 100" className="w-32 mx-auto" fill="none">
        <polygon points="60,10 100,35 100,65 60,90 20,65 20,35" stroke="#3730A3" strokeWidth="1" opacity="0.3"/>
        <polygon points="60,25 82,40 82,60 60,75 38,60 38,40" stroke="#3730A3" strokeWidth="1" opacity="0.5"/>
        <polygon points="60,15 92,32 95,62 60,82 25,62 28,32" fill="#3730A3" fillOpacity="0.1" stroke="#3730A3" strokeWidth="1.5"/>
      </svg>
    </div>
    {/* Blurred section cards */}
    {['Psychological Fingerprint', 'Cognitive Profile', 'Career Intelligence'].map(name => (
      <div key={name} className="mx-4 mb-3 p-3 rounded-xl bg-slate-50 blur-[2px]">
        <div className="h-2 bg-slate-200 rounded w-3/4 mb-1"/>
        <div className="h-2 bg-slate-100 rounded w-1/2"/>
      </div>
    ))}
    <div className="h-4"/>
  </div>
</div>
```

**Section name pills** (below the card):
```tsx
<div className="flex flex-wrap justify-center gap-2 mt-8">
  {['Archetype Profile','Psychological Fingerprint','Cognitive Profile','Motivational DNA',
    'Career Intelligence','Leadership Profile','Team Compatibility','Founder Score',
    'Work Environment','Growth Roadmap'].map(name => (
    <span key={name} className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">{name}</span>
  ))}
</div>
```

**CTA:**
```tsx
<Link href="/results/demo" className="inline-block bg-white text-indigo px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
  See your full report — free →
</Link>
```

---

### 10. Testimonials

New component: `components/home/Testimonials.tsx`

**Section wrapper:** `bg-white py-20`

**Headline:** `"What people do with their results"` — centered, text-3xl font-bold mb-12

**Grid:** `grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4`

Each card (`Card` component with default styling):
```tsx
<Card className="space-y-4">
  {/* Stars */}
  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" stroke="none"/>)}</div>
  {/* Quote */}
  <p className="text-slate-700 italic text-sm leading-relaxed">"{quote}"</p>
  {/* Attribution */}
  <div>
    <p className="font-semibold text-text text-sm">{name}</p>
    <p className="text-xs text-slate-400">{role}</p>
  </div>
</Card>
```

Three testimonials: {/* PLACEHOLDER — replace with real user quotes when available */}

**Quote 1 — Individual:**
- Quote: *"I'd been applying to the wrong roles for two years. My Kairos report showed me I score in the 91st percentile for Strategic Vision but low on Execution Drive — I stopped chasing ops roles and landed a strategy position in six weeks."*
- Name: Marcus T.
- Role: Operations → Strategy, London

**Quote 2 — HR/Enterprise:**
- Quote: *"We use Kairos before every senior hire. The behavioral inference layer catches candidates who interview well but are misaligned on actual work style. It's replaced three tools we were paying for separately."*
- Name: Priya S.
- Role: Head of Talent, Series B startup

**Quote 3 — Founder:**
- Quote: *"I thought I knew myself. The Psychological Fingerprint section showed me a conflict between my stated values and how I actually make decisions under pressure. That one insight was worth the whole thing."*
- Name: Daniel R.
- Role: Founder, Berlin

Import `Star` from `lucide-react`.

---

### 11. Enterprise

Existing section, copy and structure upgraded inline in `app/page.tsx`.

**Badge:** `<Badge variant="teal">Enterprise</Badge>`

**Headline:** `"Built for teams that take talent seriously"`

**Sub:** *"Kairos Enterprise gives founders and HR leaders a scientific lens into candidate potential, team composition, and capability gaps — not vibes."*

**Four feature cards** (`grid grid-cols-2 gap-4`):

Each card: `<div className="p-4 bg-white rounded-xl border border-slate-100 space-y-1">`

| Icon | Title | Description |
|---|---|---|
| `<Target size={16} className="text-indigo"/>` | Trait-based hiring | Match candidates to role requirements scientifically |
| `<Network size={16} className="text-indigo"/>` | Team compatibility | See how profiles interact before you build the team |
| `<TrendingUp size={16} className="text-indigo"/>` | Leadership scoring | Identify who's ready to lead before it's too late |
| `<Building size={16} className="text-indigo"/>` | Culture fit analysis | Measure values and work style alignment, not just skills |

Import `Target`, `Network`, `TrendingUp`, `Building2` from `lucide-react`.

**CTA:** `"Talk to us about Enterprise →"` — teal outlined button, `href="/enterprise"`

---

### 12. Pricing

Simplified to two tiers during early access.

**Headline:** `"Simple Pricing"` — centered

**Sub:** `"Paid plans launching later in 2026. Lock in free access now."` — centered, slate-500

**Two-column grid** `grid md:grid-cols-2 gap-6 max-w-2xl mx-auto`:

**Tier 1 — Free:**
- Price: $0 forever
- Features: First 2 report sections · No account required · Archetype + Fingerprint
- CTA: "Take Free Assessment" → `/assessment`
- No highlight border

**Tier 2 — Early Access:**
- Price: $0 during beta
- Badge: `<Badge variant="teal">Most Popular</Badge>`
- Features: Full 11-section report · Requires account · Retakes + history · Growth tracking · Priority support
- CTA: "Unlock Full Report" → `/assessment`
- Highlight: `border-2 border-indigo`

The key differentiator between tiers: Free gives sections 1–2 without account; Early Access gives all 11 sections but requires an account. This maps to the existing auth gate in the product.

**Note below grid:** `"Free forever for individuals during early access."` — slate-400, text-sm

---

### 13. Final CTA

**Section wrapper:** `max-w-6xl mx-auto px-4 py-20 text-center space-y-6`

**Headline:** `"12 minutes. 29 dimensions. One profile that's actually you."`

**Sub:** `"Join 10,000+ professionals who've stopped guessing about themselves."` {/* PLACEHOLDER */}

**CTA:** "Take the Free Assessment →" — large indigo button, `href="/assessment"`

---

## Components to Create / Modify

| File | Action |
|---|---|
| `app/page.tsx` | Full rewrite — all sections inline except new components below |
| `app/layout.tsx` | Add `<AnnouncementBar />` above `<Header />` |
| `components/layout/Header.tsx` | Add logo glyph SVG + tagline |
| `components/layout/AnnouncementBar.tsx` | New — dismissible teal banner |
| `components/home/CompetitorContrast.tsx` | New — Others vs Kairos 3-card section |
| `components/home/SciencePillars.tsx` | New — 2-column science section |
| `components/home/ArchetypeShowcase.tsx` | New — horizontal scroll archetype cards |
| `components/home/ReportPreview.tsx` | New — visual mockup card on indigo gradient |
| `components/home/Testimonials.tsx` | New — 3 outcome-led quote cards |

## Out of Scope

- `/science`, `/pricing`, `/enterprise`, `/archetypes` pages (linked but not built)
- Mobile-specific animations
- Real user data, real testimonials, validated timing stats

## Placeholder Data Policy

All statistics (10,847 assessments, 10,000+ professionals, "12 minutes"), testimonial names, and quotes are illustrative placeholders. Every placeholder is marked with a `{/* PLACEHOLDER */}` comment in the code so they can be found and swapped for real data.

The "94% accuracy vs Big Five gold standard" stat has been removed from the spec — it is a specific scientific claim requiring a citation source that does not currently exist. It is replaced with "Big Five + HEXACO" as the fourth social proof stat, which is accurate and requires no citation.
