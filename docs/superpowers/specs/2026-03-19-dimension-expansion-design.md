# Dimension Expansion & Dual-Layer Radar Design

> **For agentic workers:** This is a spec document. Use `superpowers:writing-plans` to convert it into an implementation plan before touching code.

**Goal:** Expand Kairos from 29 to 36 dimensions, add ~203 questions (total ~285), introduce Major/Minor classification, rework the radar chart to dual-layer, raise the assessment confidence threshold to 81%, and update Phase 1 calibration to 80 questions minimum.

---

## 1. Dimension Registry

### New file: `lib/dimensions.ts`

Single source of truth for all 36 dimensions. Exports a `DIMENSIONS` array and a `MAJOR_DIMS` / `MINOR_DIMS` derived set. All existing scattered label/description maps across report sections and the radar chart are replaced by imports from this file.

```ts
export interface DimensionMeta {
  slug: DimensionSlug
  label: string
  shortLabel: string   // ≤ 12 chars, used on radar axis
  description: string
  tier: 1 | 2 | 3 | 4 | 5 | 6
  major: boolean
}

export const DIMENSIONS: DimensionMeta[] = [ ... ]

export const MAJOR_DIMS = new Set(
  DIMENSIONS.filter(d => d.major).map(d => d.slug)
)
export const MINOR_DIMS = new Set(
  DIMENSIONS.filter(d => !d.major).map(d => d.slug)
)
```

### Major dimensions (20)

| # | Slug | Label | Tier |
|---|------|-------|------|
| 1 | `openness` | Openness | 1 |
| 2 | `conscientiousness` | Conscientiousness | 1 |
| 3 | `extraversion` | Extraversion | 1 |
| 4 | `agreeableness` | Agreeableness | 1 |
| 5 | `emotional_stability` | Emotional Stability | 1 |
| 6 | `honesty_humility` | Honesty-Humility | 1 |
| 7 | `cognitive_agility` | Cognitive Agility | 2 |
| 8 | `executive_function` | Executive Function | 2 |
| 9 | `systems_thinking` | Systems Thinking | 2 |
| 10 | `achievement_drive` | Achievement Drive | 3 |
| 11 | `purpose_orientation` | Purpose Orientation | 3 |
| 12 | `risk_tolerance` | Risk Tolerance | 3 |
| 13 | `leadership_drive` | Leadership Drive | 5 |
| 14 | `strategic_orientation` | Strategic Orientation | 5 |
| 15 | `social_influence` | Social Influence | 4 |
| 16 | `conflict_navigation` | Conflict Navigation | 4 |
| 17 | `emotional_intelligence` | Emotional Intelligence | 4 (new) |
| 18 | `decision_making` | Decision Making | 2 (new) |
| 19 | `execution` | Execution | 3 (new) |
| 20 | `managing_others` | Managing Others | 5 (new) |

### Minor dimensions (16)

| # | Slug | Label | Tier |
|---|------|-------|------|
| 21 | `attention_control` | Attention Control | 2 |
| 22 | `creative_intelligence` | Creative Intelligence | 2 |
| 23 | `autonomy_need` | Autonomy Need | 3 |
| 24 | `competitive_drive` | Competitive Drive | 3 |
| 25 | `communication_style` | Communication Style | 4 |
| 26 | `collaboration_signature` | Collaboration | 4 |
| 27 | `specialist_generalist` | Specialist–Generalist | 5 |
| 28 | `innovation_index` | Innovation Index | 5 |
| 29 | `psychological_resilience` | Psych. Resilience | 6 |
| 30 | `growth_mindset` | Growth Mindset | 6 |
| 31 | `adaptability_quotient` | Adaptability | 6 |
| 32 | `learning_agility` | Learning Agility | 6 |
| 33 | `teamwork` | Teamwork | 4 (new) |
| 34 | `persuasion` | Persuasion | 4 (new) |
| 35 | `embracing_differences` | Embracing Differences | 4 (new) |

*(36th dimension: `founder_potential` remains a derived composite, not a standalone radar dimension — unchanged)*

---

## 2. Type System Changes (`lib/types.ts`)

Add 7 new slugs to the `DimensionSlug` union:

```ts
| 'emotional_intelligence' | 'decision_making' | 'execution'
| 'managing_others' | 'teamwork' | 'persuasion' | 'embracing_differences'
```

No other type changes required. `DimensionScores = Record<DimensionSlug, number>` automatically expands.

---

## 3. Question Bank (`lib/questions.ts`)

### Question targets

| Category | Count | Per-dim target | Total |
|----------|-------|---------------|-------|
| 20 existing Major dims | — | +6 new questions each | +120 |
| 12 existing Minor dims | — | +3 new questions each | +36 |
| 4 new Major dims | — | 8 questions each | +32 |
| 3 new Minor dims | — | 5 questions each | +15 |
| **Net new** | | | **~203** |
| **Grand total** | | | **~285** |

### Scale format change: remove Neutral option

All `likert` and `frequency` questions use **4-point scales** (no Neutral midpoint):

```ts
// likert
options: { labels: ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'] }

// frequency
options: { labels: ['Almost Never', 'Rarely', 'Usually', 'Almost Always'] }
```

Scoring maps: 1 → 0, 2 → 25, 3 → 75, 4 → 100 (raw, before weight). Reverse-scored: invert.

### Question type distribution per dimension

| Type | Calibration | Adaptive | Rationale |
|------|-------------|----------|-----------|
| `likert` (4-pt) | 1–2 | 2–3 | Broad self-report |
| `forced_choice` | 1 | 1 | High discrimination, low social desirability bias |
| `situational` or `timed` | 1 (Major only) | 1 | Highest discrimination, ~1.5× likert signal |
| `frequency` (4-pt) | 0–1 | 0–1 | Behavioral frequency |
| `rank_order` | 0 | 0–1 | Multi-signal capture |

Major dimension calibration set: 3 questions — 1 likert + 1 forced_choice + 1 situational/timed
Minor dimension calibration set: 2 questions — 1 likert + 1 forced_choice

This yields: (20 × 3) + (16 × 2) = 60 + 32 = **92 calibration flags**, but distributed across 80 unique questions because some questions serve double duty as high-discrimination items.

**Wait — revised target:** Strict 80 calibration questions (Phase 1 minimum):
- 20 Major dims × 3 = 60 calibration questions for Major dims
- 16 Minor dims × 1 = 16 calibration questions for Minor dims (just 1 each, Phase 2 fills the rest)
- **Total Phase 1: 76 questions** — rounded to 80 with 4 cross-dimensional tiebreaker questions

### Calibration flag assignment
- `calibration: true` on the highest-discrimination question per dimension
- Major dims: top 2 questions flagged as calibration (60 Phase 1 slots for Major)
- Minor dims: top 1 question flagged as calibration (16 Phase 1 slots for Minor)
- 4 additional high-signal questions (timed/situational) flagged as calibration tiebreakers
- **Total calibration-flagged: 80**

### New dimension question samples

**`emotional_intelligence` (8 questions, 2 calibration)**
```
EI_01 [cal]: When someone is visibly upset, I adjust my approach without being asked. [likert, 4-pt]
EI_02 [cal]: You notice a colleague's tone shift mid-meeting. You: [forced_choice]
  a: Continue as planned — their emotions aren't your responsibility
  b: Acknowledge the shift and check in privately after
EI_03: I can accurately identify what I'm feeling before reacting. [likert, 4-pt]
EI_04: How often do you notice emotional undercurrents in a room before others verbalize them? [frequency]
EI_05: A colleague becomes defensive during your feedback. You: [situational, scores: 1/2.3/3.7/5]
  A: Back off — the message wasn't landing anyway
  B: Reframe the feedback as a question
  C: Name the dynamic directly and ask what would help
  D: End the conversation and revisit when they're calmer
EI_06: I find it easy to regulate my emotions during high-pressure situations. [likert, 4-pt]
EI_07: Which approach best reflects how you process others' emotions? [forced_choice]
  a: I observe behavior and infer what's happening internally
  b: I ask directly how people are feeling
EI_08: After conflict, I can re-engage productively without residual tension. [likert, 4-pt]
```

**`decision_making` (8 questions, 2 calibration)**
```
DM_01 [cal]: I make confident decisions even when data is incomplete. [likert, 4-pt]
DM_02 [cal]: You need to decide between two options with equal evidence. You: [forced_choice]
  a: Wait for more information before committing
  b: Commit to the option that feels directionally right and course-correct
DM_03: How often do you second-guess decisions after making them? [frequency, reverse-scored]
DM_04: I apply a consistent framework when evaluating major decisions. [likert, 4-pt]
DM_05: A major decision must be made in 10 minutes with 60% of ideal information. You: [timed, scores: 1/2.3/3.7/5]
  A: Request an extension — better to delay than decide poorly
  B: Make the call, document assumptions, plan for correction
  C: Delegate to whoever has the most context
  D: Use a rapid pros/cons list and commit
DM_06: I distinguish well between reversible and irreversible decisions. [likert, 4-pt]
DM_07: Which best describes your decision style? [forced_choice]
  a: I prefer to optimize — gathering enough data to maximize the chance of the right answer
  b: I prefer to satisfice — finding a good-enough answer fast and moving
DM_08: I feel comfortable owning the consequences of decisions I've made. [likert, 4-pt]
```

**`execution` (8 questions, 2 calibration)**
```
EX_01 [cal]: I consistently deliver on commitments I make to others. [likert, 4-pt]
EX_02 [cal]: When a project stalls, I: [forced_choice]
  a: Diagnose the blocker before taking action
  b: Start moving on any unblocked part while diagnosing
EX_03: How often do projects under your ownership finish on or ahead of schedule? [frequency]
EX_04: I maintain output quality even when energy or motivation is low. [likert, 4-pt]
EX_05: Three parallel workstreams are all behind. You: [situational, scores: 1/2.3/3.7/5]
  A: Focus entirely on the most critical one
  B: Reprioritize and cut scope on the lowest-value stream
  C: Communicate delays, renegotiate deadlines, protect quality
  D: Push hard on all three simultaneously
EX_06: I break large goals into concrete daily or weekly actions automatically. [likert, 4-pt]
EX_07: Which better describes your output style? [forced_choice]
  a: I do fewer things but finish them completely
  b: I work across many things and hand off when good enough
EX_08: I hold myself accountable to self-imposed deadlines even without external pressure. [likert, 4-pt]
```

**`managing_others` (8 questions, 2 calibration)**
```
MO_01 [cal]: I get results through people as effectively as through my own direct effort. [likert, 4-pt]
MO_02 [cal]: A team member isn't performing. You: [forced_choice]
  a: Give direct feedback with specific expectations and a timeline
  b: First understand what's blocking them before setting expectations
MO_03: How often do people you manage exceed your initial expectations? [frequency]
MO_04: I adapt my management style based on each person's experience and motivation. [likert, 4-pt]
MO_05: A high-performer on your team says they're bored and considering leaving. You: [situational, scores: 1/2.3/3.7/5]
  A: Offer a pay increase
  B: Have a candid conversation about what they'd need to stay engaged
  C: Create a stretch project aligned to their ambitions
  D: Accelerate their promotion timeline
MO_06: I find developing others as rewarding as achieving personal milestones. [likert, 4-pt]
MO_07: Which management philosophy fits you more? [forced_choice]
  a: Set clear expectations and hold people to them rigorously
  b: Create conditions where people self-direct toward the right outcomes
MO_08: I can give hard feedback in a way that strengthens rather than damages the relationship. [likert, 4-pt]
```

**`teamwork` (5 questions, 1 calibration)**
```
TW_01 [cal]: I actively support teammates even when it doesn't directly benefit my own output. [likert, 4-pt]
TW_02: I adjust my working style to fit the needs of the team rather than expecting others to adjust to me. [likert, 4-pt]
TW_03: How often do teammates seek your input or help on their work? [frequency]
TW_04: Which describes your natural team role? [forced_choice]
  a: I drive the work forward and keep the team accountable
  b: I create the conditions for others to do their best work
TW_05: When the team makes a decision you disagree with, you: [situational, scores: 1/2.3/3.7/5]
  A: Comply silently
  B: Voice your concern once, then commit to the decision
  C: Continue advocating until you're heard
  D: Escalate outside the team
```

**`persuasion` (5 questions, 1 calibration)**
```
PE_01 [cal]: I can shift someone's position without them feeling pressured. [likert, 4-pt]
PE_02: I tailor how I frame ideas based on what each audience values. [likert, 4-pt]
PE_03: How often do you successfully change someone's mind on an important issue? [frequency]
PE_04: Which influence approach fits you more naturally? [forced_choice]
  a: I build the case with logic and evidence
  b: I connect emotionally to what the other person cares about
PE_05: A senior stakeholder is skeptical of your proposal. You: [situational, scores: 1/2.3/3.7/5]
  A: Present more data
  B: Find a champion who already has their trust
  C: Ask what would need to be true for them to support it
  D: Reduce scope to something they can say yes to
```

**`embracing_differences` (5 questions, 1 calibration)**
```
ED_01 [cal]: I actively seek input from people whose backgrounds and perspectives differ from mine. [likert, 4-pt]
ED_02: Working with people who think very differently from me energizes rather than frustrates me. [likert, 4-pt]
ED_03: How often do you change your view based on input from someone with a different background? [frequency]
ED_04: Which approach better reflects how you engage with difference? [forced_choice]
  a: I focus on what we have in common to build common ground
  b: I lean into the difference — that's where the interesting insight lives
ED_05: Your team has a persistent clash between two people with opposing working styles. You: [situational, scores: 1/2.3/3.7/5]
  A: Separate them into different workstreams
  B: Mediate and establish working agreements
  C: Name the dynamic to the full team and build shared norms
  D: Let it resolve naturally — teams self-organize
```

---

## 4. Scoring Changes (`lib/scoring.ts`)

### 4-point scale value mapping

Update `extractRawValue` to normalize 4-point likert/frequency to 0–100:

```ts
case 'likert':
case 'frequency':
  // 4-point scale: 1→0, 2→33, 3→67, 4→100
  // 5-point scale (legacy): 1→0, 2→25, 3→50, 4→75, 5→100
  const isLegacy = question.options.labels?.length === 5
  raw = isLegacy
    ? ((Number(value) - 1) / 4) * 100
    : ((Number(value) - 1) / 3) * 100
  break
```

This ensures backward compatibility with existing results in the database (legacy 5-point questions) while new questions score on 4-point.

---

## 5. Assessment Engine Changes

### `app/api/assessment/start/route.ts`
No structural changes. Calibration count derived dynamically from `QUESTIONS.filter(q => q.calibration && q.is_active).length` — automatically becomes 80 when questions are updated.

### `app/api/assessment/respond/route.ts`

**Adaptive question selection priority:**
```ts
// Priority 1: Ambiguous Major dims (40–60 range) with < 5 answered
// Priority 2: Major dims with < 3 answered questions
// Priority 3: Ambiguous Minor dims (40–60 range)
// Priority 4: Any remaining unanswered question
// Hard cap: 132 total questions
```

**Revised confidence gate:**
```ts
import { MAJOR_DIMS } from '@/lib/dimensions'

const majorDimSlugs = [...MAJOR_DIMS]

const answeredPerDim = majorDimSlugs.reduce((acc, dim) => {
  acc[dim] = responses.filter(r =>
    QUESTIONS.find(q => q.code === r.question_code)?.dimension === dim
  ).length
  return acc
}, {} as Record<string, number>)

const allMajorDimsCovered = majorDimSlugs.every(d => (answeredPerDim[d] ?? 0) >= 3)

const ambiguousMajorCount = majorDimSlugs
  .filter(d => {
    const s = scores[d as DimensionSlug]
    return s !== undefined && s >= 40 && s <= 60
  }).length

const isConfident =
  topComposite >= 81 &&
  margin >= 10 &&
  ambiguousMajorCount <= 2 &&
  allMajorDimsCovered
```

**Hard cap:**
```ts
const HARD_CAP = 132
if (answeredCount >= HARD_CAP) nextQuestion = null
```

---

## 6. Radar Chart (`components/charts/RadarChart.tsx`)

### Dual-layer implementation

Two `<Radar>` components on the same chart and axis grid:

```tsx
// Layer 1: Major dimensions — indigo, more opaque
<Radar
  name="Major"
  dataKey="majorScore"    // actual score for major dims, 50 (neutral) for minor
  stroke="#3730A3"
  fill="#3730A3"
  fillOpacity={0.22}
  strokeWidth={2}
/>

// Layer 2: Minor dimensions — teal, lighter
<Radar
  name="Minor"
  dataKey="minorScore"    // actual score for minor dims, 50 (neutral) for major
  stroke="#0F766E"
  fill="#0F766E"
  fillOpacity={0.12}
  strokeWidth={1.5}
/>
```

Data shape per axis point:
```ts
{
  subject: dim.shortLabel,
  majorScore: MAJOR_DIMS.has(dim.slug) ? score : 50,
  minorScore: MINOR_DIMS.has(dim.slug) ? score : 50,
  fullMark: 100,
}
```

Setting non-active dimensions to 50 (population mean) rather than 0 keeps both polygons at roughly the same scale, making the shape meaningful rather than a collapsed star.

### Axis label coloring

Custom `<CustomTick>` component reads `MAJOR_DIMS` to set fill:
```ts
const fill = MAJOR_DIMS.has(slug) ? '#3730A3' : '#64748B'
const fontWeight = MAJOR_DIMS.has(slug) ? 600 : 400
```

Label order around perimeter (35 dims, grouped):
1. Big Five + HEXACO (6)
2. New workplace Major dims (4)
3. Core cognitive Major (3)
4. Core motivational Major (3)
5. Career + behavioral Major (4)
6. Minor dims (15, in tier order)

### Legend
```tsx
<div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
  <span className="flex items-center gap-1.5">
    <span className="w-3 h-3 rounded-sm bg-indigo inline-block opacity-70" />
    Major dimensions
  </span>
  <span className="flex items-center gap-1.5">
    <span className="w-3 h-3 rounded-sm bg-teal inline-block opacity-60" />
    Supporting dimensions
  </span>
</div>
```

### Mobile
- `height: 460` mobile / `520` desktop
- `fontSize: 8` mobile / `9` desktop for minor labels, `10` major labels
- Margins: `{ top: 10, right: 25, bottom: 10, left: 25 }` mobile

---

## 7. Report Section Updates

### Section 2 — Psychological Fingerprint

**Superpowers/Growth Area cards** — sourced from Major dimensions only:
```ts
const sorted = Object.entries(scores)
  .filter(([k]) => MAJOR_DIMS.has(k as DimensionSlug))
  .sort(([, a], [, b]) => b - a)
const superpowers = sorted.slice(0, 3)
const growthAreas = sorted.slice(-2)
```

**DimCard** — add major indicator:
```tsx
{MAJOR_DIMS.has(slug) && (
  <span className="w-1.5 h-1.5 rounded-full bg-indigo inline-block mr-1" />
)}
```

**Dimensions table** — add `Major` badge column (desktop only):
```tsx
<td className="hidden sm:table-cell px-4 py-3 text-center">
  {MAJOR_DIMS.has(item.slug) && (
    <span className="text-[10px] font-semibold text-indigo bg-indigo/10 px-1.5 py-0.5 rounded-full">M</span>
  )}
</td>
```

### Sections 5–11 — New dimension placement

| New dimension | Placed in |
|--------------|-----------|
| `emotional_intelligence` | Section 4 (Cognitive Profile) |
| `decision_making` | Section 4 (Cognitive Profile) |
| `execution` | Section 5 (Motivational DNA) |
| `managing_others` | Section 6 (Leadership Profile) |
| `teamwork` | Section 7 (Team Compatibility) |
| `persuasion` | Section 6 (Leadership Profile) |
| `embracing_differences` | Section 7 (Team Compatibility) |

Each new dimension gets a `DimCard`-style card using the same pattern as existing dims in each section.

---

## 8. Files Changed

| File | Change |
|------|--------|
| `lib/dimensions.ts` | **NEW** — dimension registry, MAJOR_DIMS, MINOR_DIMS |
| `lib/types.ts` | Add 7 new DimensionSlug values |
| `lib/questions.ts` | Add ~203 new questions, 4-point scale on new questions |
| `lib/scoring.ts` | 4-point scale normalization, backward compat for 5-point |
| `lib/norms.ts` | Add norm data for 7 new dimensions |
| `lib/hpif.ts` | Include new dimensions in HPIF composite calculations |
| `app/api/assessment/respond/route.ts` | New confidence gate, adaptive priority, hard cap |
| `components/charts/RadarChart.tsx` | Dual-layer Major/Minor radar |
| `components/report/ReportSection2.tsx` | Major-only superpowers, M badge in table |
| `components/report/ReportSection4.tsx` | Add emotional_intelligence, decision_making cards |
| `components/report/ReportSection5.tsx` | Add execution card |
| `components/report/ReportSection6.tsx` | Add managing_others, persuasion cards |
| `components/report/ReportSection7.tsx` | Add teamwork, embracing_differences cards |

---

## 9. Out of Scope

- Archetype recalibration (new dims don't affect existing archetype signatures — can be done post-launch)
- Database schema changes (new dimension scores store in existing `results.scores` JSONB column — no migration needed)
- Norm data for new dimensions is initialized to population mean (50) until real data is collected
- Visual question type (`type: 'visual'`) not used for new dimensions — images not yet designed

---

## 10. Success Criteria

- [ ] All 285 questions present in `lib/questions.ts`, each with correct `calibration` flag
- [ ] Exactly 80 questions flagged `calibration: true`
- [ ] 7 new DimensionSlug values compile without TypeScript errors
- [ ] Assessment completes in 80–132 questions depending on confidence
- [ ] Radar chart renders dual-layer with indigo (Major) and teal (Minor) fills
- [ ] Major dim axis labels render in indigo bold, Minor in slate regular
- [ ] Superpowers/Growth cards source from Major dims only
- [ ] All 7 new dimensions appear in relevant report sections
- [ ] Legacy 5-point question scores remain backward compatible
- [ ] `npm run build` passes with 0 errors
