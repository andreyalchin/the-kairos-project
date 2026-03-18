# Landing Page Redesign — Design Spec

**Date:** 2026-03-18
**Status:** Approved

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
6. How It Works (existing, minor copy lift)
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

**Logo:** "Kairos" in indigo bold. Add a small SVG glyph mark (timing/moment motif) before the wordmark.

**Tagline:** "Human Potential Intelligence" in small slate text beneath the logo.

**Nav links:** Science · Pricing · Enterprise · Log in

**CTA:** "Take the Assessment →" — indigo pill button, always visible on desktop and mobile.

---

### 2. Announcement Bar

Thin dismissible banner above the header.

- Background: teal
- Text (white): *"Early access — full reports free while we grow. No credit card."*
- Dismiss: small ✕ on the right
- Stores dismissed state in `localStorage` so it doesn't reappear on reload

---

### 3. Hero

**Badge:** "Built on Big Five + HEXACO + Adaptive IRT" — indigo pill

**Headline (two lines):**
```
Most personality tests are guessing.
Kairos measures.
```

Large, bold, high contrast. "Kairos measures." on its own line for emphasis.

**Sub-headline:**
> 29 scientifically validated dimensions. 32 distinct archetypes. Behavioral inference that catches what self-report misses. Your complete intelligence profile in 12 minutes — free.

**CTAs:**
- Primary: "Take the Free Assessment →" — indigo filled
- Secondary: "See a Sample Report" — indigo outlined

**Below CTAs (social micro-proof):**
> *No account required · 40–82 adaptive questions · Used by 10,000+ professionals*

Small slate text. Proof comes after the CTA, not before, so it doesn't slow the click.

**Background:** Retain the existing radial gradient (indigo + teal soft blobs). No image needed.

---

### 4. Social Proof Bar

Full-width white strip. Four stat blocks in a row (flex, centered, wraps on mobile):

| Stat | Label |
|---|---|
| 10,847 | Assessments completed |
| 29 | Dimensions measured |
| 32 | Archetypes identified |
| 94% | Accuracy vs Big Five gold standard |

Numbers in indigo bold (text-2xl or text-3xl). Labels in slate-500 text-sm. Separated by faint vertical dividers on desktop.

---

### 5. Competitor Contrast (New Section)

**Headline:** "Other tests tell you a story. Kairos tells you the truth."

Three contrast cards in a grid (md:grid-cols-3):

**Card 1 — Method**
- Others: Fixed questionnaires, gameable answers
- Kairos: Adaptive IRT — questions calibrate to you in real time

**Card 2 — Depth**
- Others: 4–5 broad types or letters
- Kairos: 29 dimensions across cognitive, behavioral, motivational and leadership axes

**Card 3 — Behavioral Layer**
- Others: Self-report only
- Kairos: Response time + revision patterns analyzed — catches what you'd never admit

Each card has a two-row layout: "Others" row (slate, subtle ✗ or muted styling) and "Kairos" row (indigo, ✓ check).

**Closing line (centered, below cards):**
> *Most popular assessments measure broad buckets. Kairos measures you.*

No competitor brand names anywhere in this section.

---

### 6. How It Works

Three steps, existing structure retained. Minor copy improvements:

1. **Take the Assessment** — 40–82 adaptive questions across 29 dimensions. ~12 minutes. No registration required.
2. **Get Your Profile** — Our scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions in real time.
3. **Unlock Deep Insight** — Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan.

---

### 7. Science Pillars

**Headline:** "The science isn't a feature. It's the foundation."

Two-column layout on desktop (md:grid-cols-2 gap-12):

**Left — four methodology pillars:**

- **Big Five + HEXACO** — The only two personality frameworks with decades of peer-reviewed validation. Not trends, not intuition.
- **Adaptive IRT** — Item Response Theory: questions shift based on your answers. 40 adaptive questions beat 200 static ones.
- **Behavioral Inference** — Response latency and revision patterns are scored. Hesitation reveals what confidence hides.
- **Normative Benchmarking** — Scores placed against a general adult population. Not just "you're curious" — you're in the 87th percentile.

**Right — pull quote block:**
> *"Kairos uses the same psychometric frameworks deployed by Fortune 500 HR departments — accessible to anyone in 12 minutes."*
>
> — Assessment methodology overview

Pull quote styled with a left border in indigo, slate background, italic text.

---

### 8. Archetype Showcase

**Headline:** "32 Human Archetypes"
**Sub:** "Each archetype is a precise pattern of dimensions — not a horoscope, not a bucket."

Horizontal scroll of cards (same as existing). Each card gets:
- A geometric SVG icon (unique per archetype — triangle, compass, network, etc.)
- Archetype name (font-semibold)
- One-line description

Six shown by default:

| Archetype | Description |
|---|---|
| Strategic Visionary | Sees 10 moves ahead. Builds systems others can't yet imagine. |
| Empathetic Leader | Reads rooms. Turns tension into trust. |
| Systematic Builder | Executes where others theorize. Precision over speed. |
| Creative Catalyst | Connects ideas across domains no one else links. |
| Analytical Architect | Finds the flaw before the plan launches. |
| Innovation Pioneer | Comfortable in the unknown. Thrives at zero-to-one. |

**Footer link:** "+ 26 more archetypes →" links to `/archetypes` (or scrolls to a future page).

---

### 9. Report Preview

**Headline:** "An 11-Section Deep Report"

Replace the current blue gradient text box with a visual mockup card:

- Styled as a cropped, slightly angled `div` that mimics the report UI
- Dark indigo header bar showing archetype name ("Strategic Visionary") + match score badge
- A mini radar chart stub (static SVG — 6-axis polygon)
- Three blurred/frosted section cards below it suggesting depth
- The whole thing has a drop shadow and slight rotation (transform: rotate(-1deg)) for visual interest

**Section names listed below the mockup** (as a wrapping flex row of pills):
Archetype Profile · Psychological Fingerprint · Cognitive Profile · Motivational DNA · Career Intelligence · Leadership Profile · Team Compatibility · Founder Score · Work Environment · Growth Roadmap · (+ 1 more)

**CTA:** "See your full report — free →" (indigo link)

---

### 10. Testimonials (New Section)

**Headline:** "What people do with their results"

Three quote cards in a grid (md:grid-cols-3). Each card:
- Quote text (italic, text-slate-700)
- Name, role, location (text-sm text-slate-500)
- 5-star rating (static, decorative)

**Quote 1 — Individual:**
> "I'd been applying to the wrong roles for two years. My Kairos report showed me I score in the 91st percentile for Strategic Vision but low on Execution Drive — I stopped chasing ops roles and landed a strategy position in 6 weeks."
> — Marcus T., Operations → Strategy, London

**Quote 2 — HR/Enterprise:**
> "We use Kairos before every senior hire. The behavioral inference layer catches candidates who interview well but are misaligned on actual work style. It's replaced three tools we were paying for separately."
> — Priya S., Head of Talent, Series B startup

**Quote 3 — Founder:**
> "I thought I knew myself. The Psychological Fingerprint section showed me a conflict between my stated values and how I actually make decisions under pressure. That one insight was worth the whole thing."
> — Daniel R., Founder, Berlin

---

### 11. Enterprise

**Badge:** "Enterprise" (teal)
**Headline:** "Built for teams that take talent seriously"
**Sub:** *Kairos Enterprise gives founders and HR leaders a scientific lens into candidate potential, team composition, and capability gaps — not vibes.*

Four feature cards (grid-cols-2 on desktop):
- 🎯 **Trait-based hiring** — Match candidates to role requirements scientifically
- 🔗 **Team compatibility matrix** — See how profiles interact before you build the team
- 📈 **Leadership potential scoring** — Identify who's ready to lead before it's too late
- 🏛️ **Culture fit analysis** — Measure values and work style alignment, not just skills

**CTA:** "Talk to us about Enterprise →" — teal outlined button, links to `/enterprise`

---

### 12. Pricing

Simplified to two tiers during early access. Remove the $29/mo Professional tier to eliminate the conflict with "free forever" messaging elsewhere on the page.

**Headline:** "Simple Pricing"
**Sub:** *Paid plans launching later in 2026. Lock in free access now.*

| | Free | Early Access |
|---|---|---|
| Price | $0 forever | $0 during beta |
| Sections | First 2 report sections | Full 11-section report |
| Account | Not required | Required |
| Features | Archetype + Fingerprint | Retakes · History · Growth tracking · Priority support |
| CTA | Take Free Assessment | Unlock Full Report |

"Early Access" tier has the `border-2 border-indigo` highlight treatment.

---

### 13. Final CTA

**Headline:** "12 minutes. 29 dimensions. One profile that's actually you."
**Sub:** *Join 10,000+ professionals who've stopped guessing about themselves.*
**CTA:** "Take the Free Assessment →" — large indigo button

---

## Components to Create / Modify

| File | Action |
|---|---|
| `app/page.tsx` | Full rewrite |
| `components/layout/Header.tsx` | Add logo glyph + tagline |
| `components/layout/AnnouncementBar.tsx` | New component |
| `components/home/CompetitorContrast.tsx` | New component |
| `components/home/SciencePillars.tsx` | New component |
| `components/home/Testimonials.tsx` | New component |
| `components/home/ReportPreview.tsx` | New component |

## Out of Scope

- `/science`, `/pricing`, `/enterprise` pages (linked from nav but not built here)
- `/archetypes` full listing page
- Mobile-specific animation
- Real user data / testimonials (all copy is illustrative placeholder)

## Placeholder Data Policy

All statistics (10,847 assessments, 94% accuracy), testimonial names, and quotes are illustrative. They are marked with `{/* PLACEHOLDER */}` comments in code so they can be swapped for real data.
