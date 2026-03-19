# Dimension Expansion & Dual-Layer Radar Design

> **For agentic workers:** This is a spec document. Use `superpowers:writing-plans` to convert it into an implementation plan before touching code.

**Goal:** Expand Kairos from 29 to 36 dimensions, add ~203 questions (total ~285), introduce Major/Minor classification, rework the radar chart to dual-layer, raise the assessment confidence threshold to 81%, and update Phase 1 calibration to 80 questions minimum.

---

## 1. Dimension Registry

### New file: `lib/dimensions.ts`

**This file must be created first — all other changes depend on it.** It is a prerequisite for the radar chart, scoring changes, and report section updates.

Exports a `DIMENSIONS` array and derived `MAJOR_DIMS` / `MINOR_DIMS` sets. All existing scattered label/description maps across report sections and the radar chart are replaced by imports from this file.

```ts
import type { DimensionSlug } from './types'

export interface DimensionMeta {
  slug: DimensionSlug
  label: string
  shortLabel: string   // ≤ 12 chars, used on radar axis labels
  description: string
  tier: 1 | 2 | 3 | 4 | 5 | 6
  major: boolean
}

export const DIMENSIONS: DimensionMeta[] = [
  // Big Five + HEXACO (Major)
  { slug: 'openness', label: 'Openness', shortLabel: 'Openness', tier: 1, major: true, description: 'Receptivity to new ideas, experiences, and perspectives.' },
  { slug: 'conscientiousness', label: 'Conscientiousness', shortLabel: 'Conscient.', tier: 1, major: true, description: 'Capacity for discipline, organization, and follow-through.' },
  { slug: 'extraversion', label: 'Extraversion', shortLabel: 'Extraversion', tier: 1, major: true, description: 'Orientation toward social engagement and external stimulation.' },
  { slug: 'agreeableness', label: 'Agreeableness', shortLabel: 'Agreeable.', tier: 1, major: true, description: 'Tendency toward cooperation, empathy, and interpersonal harmony.' },
  { slug: 'emotional_stability', label: 'Emotional Stability', shortLabel: 'Emot. Stab.', tier: 1, major: true, description: 'Resilience under pressure and consistency of emotional response.' },
  { slug: 'honesty_humility', label: 'Honesty-Humility', shortLabel: 'Honesty', tier: 1, major: true, description: 'Commitment to authenticity, integrity, and freedom from self-promotion.' },
  // New workplace Major dims
  { slug: 'emotional_intelligence', label: 'Emotional Intelligence', shortLabel: 'Emot. Intel.', tier: 4, major: true, description: 'Recognizing, understanding, and regulating emotions in self and others.' },
  { slug: 'decision_making', label: 'Decision Making', shortLabel: 'Decisions', tier: 2, major: true, description: 'Quality of judgment under uncertainty, speed/accuracy balance.' },
  { slug: 'execution', label: 'Execution', shortLabel: 'Execution', tier: 3, major: true, description: 'Translating plans into completed outcomes with reliability.' },
  { slug: 'managing_others', label: 'Managing Others', shortLabel: 'Managing', tier: 5, major: true, description: 'Ability to direct, develop, and get results through people.' },
  // Core cognitive (Major)
  { slug: 'cognitive_agility', label: 'Cognitive Agility', shortLabel: 'Cog. Agility', tier: 2, major: true, description: 'Speed and fluidity of adapting thinking across different problem types.' },
  { slug: 'executive_function', label: 'Executive Function', shortLabel: 'Exec. Fn.', tier: 2, major: true, description: 'Planning, organizing, prioritizing, and regulating goal-directed behavior.' },
  { slug: 'systems_thinking', label: 'Systems Thinking', shortLabel: 'Systems', tier: 2, major: true, description: 'Modeling complex interdependencies and emergent patterns.' },
  // Core motivational (Major)
  { slug: 'achievement_drive', label: 'Achievement Drive', shortLabel: 'Achievement', tier: 3, major: true, description: 'Drive to accomplish difficult goals and exceed your own standards.' },
  { slug: 'purpose_orientation', label: 'Purpose Orientation', shortLabel: 'Purpose', tier: 3, major: true, description: 'Degree to which meaning and mission factor into your motivation.' },
  { slug: 'risk_tolerance', label: 'Risk Tolerance', shortLabel: 'Risk', tier: 3, major: true, description: 'Comfort operating in uncertain environments with real downside.' },
  // Career + behavioral (Major)
  { slug: 'leadership_drive', label: 'Leadership Drive', shortLabel: 'Leadership', tier: 5, major: true, description: 'Orientation toward taking charge, setting direction, and developing others.' },
  { slug: 'strategic_orientation', label: 'Strategic Orientation', shortLabel: 'Strategic', tier: 5, major: true, description: 'Capacity for long-horizon planning and competitive positioning.' },
  { slug: 'social_influence', label: 'Social Influence', shortLabel: 'Influence', tier: 4, major: true, description: 'Ability to persuade, inspire, and move others toward shared goals.' },
  { slug: 'conflict_navigation', label: 'Conflict Navigation', shortLabel: 'Conflict Nav.', tier: 4, major: true, description: 'Effectiveness at engaging, managing, and resolving interpersonal tension.' },
  // Supporting cognitive (Minor)
  { slug: 'attention_control', label: 'Attention Control', shortLabel: 'Attention', tier: 2, major: false, description: 'Sustaining focus and managing distraction under cognitive load.' },
  { slug: 'creative_intelligence', label: 'Creative Intelligence', shortLabel: 'Creativity', tier: 2, major: false, description: 'Richness of associative network and capacity for generative thinking.' },
  // Supporting motivational/behavioral (Minor)
  { slug: 'autonomy_need', label: 'Autonomy Need', shortLabel: 'Autonomy', tier: 3, major: false, description: 'Need for self-direction and independence in how you work.' },
  { slug: 'competitive_drive', label: 'Competitive Drive', shortLabel: 'Competitive', tier: 3, major: false, description: 'Need to outperform others and track progress against external benchmarks.' },
  { slug: 'communication_style', label: 'Communication Style', shortLabel: 'Communicat.', tier: 4, major: false, description: 'Approach to expressing ideas and adapting to different audiences.' },
  { slug: 'collaboration_signature', label: 'Collaboration', shortLabel: 'Collaborat.', tier: 4, major: false, description: 'Natural approach to shared work and team dynamics.' },
  // Career supporting (Minor)
  { slug: 'specialist_generalist', label: 'Specialist–Generalist', shortLabel: 'Spec/Gen', tier: 5, major: false, description: 'Orientation toward depth vs. breadth of expertise.' },
  { slug: 'innovation_index', label: 'Innovation Index', shortLabel: 'Innovation', tier: 5, major: false, description: 'Drive and capacity to generate breakthrough ideas and novel solutions.' },
  // Growth/resilience (Minor)
  { slug: 'psychological_resilience', label: 'Psych. Resilience', shortLabel: 'Resilience', tier: 6, major: false, description: 'Capacity to recover, adapt, and grow through adversity.' },
  { slug: 'growth_mindset', label: 'Growth Mindset', shortLabel: 'Growth', tier: 6, major: false, description: 'Belief in the malleability of ability and orientation toward development.' },
  { slug: 'adaptability_quotient', label: 'Adaptability', shortLabel: 'Adaptability', tier: 6, major: false, description: 'Effectiveness at adjusting to changing conditions and new environments.' },
  { slug: 'learning_agility', label: 'Learning Agility', shortLabel: 'Learning', tier: 6, major: false, description: 'Speed and effectiveness of acquiring and applying new knowledge.' },
  // New supporting dims (Minor)
  { slug: 'teamwork', label: 'Teamwork', shortLabel: 'Teamwork', tier: 4, major: false, description: 'Contribution quality and adaptability within collaborative groups.' },
  { slug: 'persuasion', label: 'Persuasion', shortLabel: 'Persuasion', tier: 4, major: false, description: 'Ability to shift beliefs and actions through reasoned influence.' },
  { slug: 'embracing_differences', label: 'Embracing Differences', shortLabel: 'Diversity', tier: 4, major: false, description: 'Openness to diverse perspectives, backgrounds, and working styles.' },
]

export const MAJOR_DIMS = new Set(
  DIMENSIONS.filter(d => d.major).map(d => d.slug)
)
export const MINOR_DIMS = new Set(
  DIMENSIONS.filter(d => !d.major).map(d => d.slug)
)
```

Total: **20 Major + 15 Minor = 35 active radar dimensions** (`founder_potential` remains a derived composite, excluded from radar — unchanged). The `DimensionSlug` union has **36 entries total** (35 active + `founder_potential`). The radar and report sections iterate 35 active dims; the type system tracks all 36 slugs.

---

## 2. Type System Changes (`lib/types.ts`)

Replace the existing `DimensionSlug` union with the full 36-slug version:

```ts
export type DimensionSlug =
  // Existing 29
  | 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness'
  | 'emotional_stability' | 'honesty_humility'
  | 'cognitive_agility' | 'executive_function' | 'attention_control'
  | 'systems_thinking' | 'creative_intelligence'
  | 'achievement_drive' | 'risk_tolerance' | 'autonomy_need'
  | 'purpose_orientation' | 'competitive_drive'
  | 'social_influence' | 'conflict_navigation' | 'communication_style'
  | 'collaboration_signature' | 'leadership_drive'
  | 'founder_potential' | 'strategic_orientation' | 'specialist_generalist'
  | 'innovation_index' | 'psychological_resilience' | 'growth_mindset'
  | 'adaptability_quotient' | 'learning_agility'
  // 7 new
  | 'emotional_intelligence' | 'decision_making' | 'execution'
  | 'managing_others' | 'teamwork' | 'persuasion' | 'embracing_differences'

export type DimensionScores = Record<DimensionSlug, number>
```

This flows through automatically: `DimensionScores`, `Question.dimension`, `Response.dimension`, `ArchetypeDimensionWeight.dimension`, and `HpifProfile` partial scores all expand without further changes.

---

## 3. Question Bank (`lib/questions.ts`)

### Question targets

| Category | Dims | New questions each | Total new |
|----------|------|--------------------|-----------|
| Existing Major dims | 16 (existing only) | +6 | +96 |
| Existing Minor dims | 12 (existing only) | +3 | +36 |
| 4 new Major dims | 4 | 8 each | +32 |
| 3 new Minor dims | 3 | 5 each | +15 |
| Cross-dimensional tiebreakers | — | 4 extra calibration | +4 |
| **Net new** | | | **~183** |
| **Existing** | | | **~82** |
| **Grand total** | | | **~265** |

*(Note: 4 existing Major dims — emotional_intelligence, decision_making, execution, managing_others — are new, so they get 8 questions each counted under "new Major dims". Total is approximately 265, well above the 200+ target.)*

### Phase 1 calibration: exactly 80 questions

**Working math:**
- 16 existing Major dims × 2 calibration flags each = 32
- 4 new Major dims × 2 calibration flags each = 8
- Subtotal Major: **40 calibration questions** (2 per Major dim × 20 dims)
- 15 Minor dims × 2 calibration flags each = 30
- Subtotal Minor: **30 calibration questions** (2 per Minor dim × 15 dims)
- 10 cross-dimensional tiebreaker questions: **10 calibration questions** (10 dims get a 3rd flag)
- **Total Phase 1 calibration: 80** ✓  (40 + 30 + 10 = 80)

Each dimension's calibration target:
- Every Major dim must have exactly **2** calibration-flagged questions (existing dims that already have 2 need no new calibration question; those with only 1 need exactly 1 new calibration-flagged question added)
- Every Minor dim must have exactly **2** calibration-flagged questions (same logic)
- 10 selected dims (mix of Major and Minor, chosen for highest archetype-discriminating power) get a **3rd** calibration question as a tiebreaker

Existing questions already flagged `calibration: true` count toward these targets. Approximately **39 existing calibration flags** remain; ~41 new calibration flags are added.

### Scale format: remove Neutral

All **new** `likert` and `frequency` questions use **4-point scales** (no Neutral midpoint). Existing 5-point questions are **kept as-is** — they coexist in the question bank and are distinguished by `options.labels.length`.

```ts
// New 4-point likert
options: { labels: ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'] }

// New 4-point frequency
options: { labels: ['Almost Never', 'Rarely', 'Usually', 'Almost Always'] }

// Existing 5-point (unchanged — not modified)
options: { labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] }
```

No existing questions are deleted or modified. The scoring layer handles both formats.

**`forced_choice` scoring convention:** New `forced_choice` questions follow the existing convention — choice `a` = negative pole (scores 1), choice `b` = positive pole (scores 5). The existing `forced_choice` handler in `lib/scoring.ts` is scale-independent and requires no changes for new questions.

### Question type distribution for new questions

| Type | Calibration questions | Adaptive-only questions |
|------|-----------------------|-------------------------|
| `likert` (4-pt) | 1 per dim | 2–3 per dim |
| `forced_choice` | 1 per dim | 1 per dim |
| `situational` or `timed` | 0–1 per Major dim | 1 per Major dim |
| `frequency` (4-pt) | 0 | 0–1 per dim |

### New dimension question samples

**Note: The actual question content (183 new questions with codes, types, calibration flags, weights, tier assignments, and answer options) is a separate deliverable that must be completed before Step 4 (lib/questions.ts update) can begin.** The question bank must be drafted and reviewed before implementation. The specs above define the structural requirements; the content itself must be authored separately.

All new question codes follow existing naming convention: `DM_01`, `EI_01`, `EX_01`, `MO_01`, `TW_01`, `PE_01`, `ED_01`, etc.

---

## 4. Scoring Changes (`lib/scoring.ts`)

### 4-point scale normalization — backward compatible

Update `extractRawValue` to normalize by detected scale length:

```ts
case 'likert':
case 'frequency': {
  const val = Number(value)
  const labelCount = question.options.labels?.length ?? 5
  if (labelCount === 4) {
    // 4-point: 1→0, 2→33.3, 3→66.7, 4→100  (linear mapping)
    raw = ((val - 1) / 3) * 5   // normalize to 1–5 range for existing weight math
  } else {
    // 5-point legacy: pass through as-is (1–5)
    raw = val
  }
  break
}
```

This keeps the existing `(weighted / maxPossible) * 100` normalization downstream intact. A 4-point response of 4 maps to raw 5.0; a 5-point response of 5 also maps to raw 5.0. The two scales are comparable.

**Backward compatibility:** Existing results in the database are stored as final 0–100 scores in the `results.scores` JSONB column — they are never re-scored. Existing 5-point questions used in new assessments continue to use the 5-point path. No existing data is affected.

---

## 5. Assessment Engine Changes

### `app/api/assessment/start/route.ts`
No structural changes. `calibrationCount` is derived from `QUESTIONS.filter(q => q.calibration && q.is_active).length` — automatically becomes 80 once questions.ts is updated.

### `app/api/assessment/respond/route.ts`

**5a. Import MAJOR_DIMS:**
```ts
import { MAJOR_DIMS } from '@/lib/dimensions'
```

**5b. Replace `interimConfidence` call and `isConfident` gate:**
```ts
// After computing scores from answered responses:
const majorDimSlugs = [...MAJOR_DIMS] as DimensionSlug[]

const answeredPerDim = majorDimSlugs.reduce((acc, dim) => {
  acc[dim] = responses!.filter(r =>
    QUESTIONS.find(q => q.code === r.question_code)?.dimension === dim
  ).length
  return acc
}, {} as Record<string, number>)

const allMajorDimsCovered = majorDimSlugs.every(d => (answeredPerDim[d] ?? 0) >= 3)

const ambiguousMajorCount = majorDimSlugs.filter(d => {
  const s = scores[d]
  return s !== undefined && s >= 40 && s <= 60
}).length

const { topComposite, margin } = interimConfidence(scores)

// New confidence gate (was: topComposite >= 75 && margin >= 8)
const isConfident =
  topComposite >= 81 &&
  margin >= 10 &&
  ambiguousMajorCount <= 2 &&
  allMajorDimsCovered
```

**5c. Adaptive question selection priority:**
```ts
// Ambiguous dims: any dim with score in 40–60 range (same threshold as confidence gate)
const ambiguous = Object.entries(scores)
  .filter(([, s]) => s !== undefined && s >= 40 && s <= 60)
  .map(([dim]) => dim)

// Priority 1: Unanswered ambiguous Major dims (score 40–60, < 5 answered)
let nextQ = QUESTIONS.filter(q =>
  !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
  MAJOR_DIMS.has(q.dimension) &&
  ambiguous.includes(q.dimension) &&
  (answeredPerDim[q.dimension] ?? 0) < 5
).sort((a, b) => a.order_index - b.order_index)[0]

// Priority 2: Major dims with < 3 answered (coverage floor)
if (!nextQ) nextQ = QUESTIONS.filter(q =>
  !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
  MAJOR_DIMS.has(q.dimension) &&
  (answeredPerDim[q.dimension] ?? 0) < 3
).sort((a, b) => a.order_index - b.order_index)[0]

// Priority 3: Ambiguous Minor dims
if (!nextQ) nextQ = QUESTIONS.filter(q =>
  !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
  ambiguous.includes(q.dimension)
).sort((a, b) => a.order_index - b.order_index)[0]

// Priority 4: Any remaining unanswered question
if (!nextQ) nextQ = QUESTIONS.filter(q =>
  !q.calibration && !answeredCodes.has(q.code) && q.is_active
).sort((a, b) => a.order_index - b.order_index)[0]
```

**5d. Hard cap:**
```ts
// Hard cap: 80 calibration + 52 adaptive = 132 total
const HARD_CAP = 132
if (answeredCount >= HARD_CAP) nextQuestion = null
```

---

## 6. Archetype System (`lib/archetypes.ts`)

**New dimensions do not block archetype assignment.** The `interimConfidence` function initializes all dimensions to 50 before scoring:
```ts
const full = { ...Object.fromEntries(QUESTIONS.map(q => [q.dimension, 50])), ...scores } as DimensionScores
```

New dimensions not yet answered default to 50 (population mean), which is neutral and does not distort archetype composites. Existing archetypes are based on existing dimensions only — new dimensions are not yet in any archetype signature, so they contribute no bias.

**Post-launch:** Archetype signatures should be recalibrated to include the 7 new dimensions once norm data is collected (separate workstream, tracked separately). This is explicitly deferred and does not block this implementation.

---

## 7. Norm Data (`lib/norms.ts`)

Add entries for all 7 new dimensions. New dimensions use a **flat distribution centered at 50** until real data is collected. **Critical:** `getPercentile` in `lib/norms.ts` throws `Error('Unknown dimension: ...')` for any slug not present in the norm table — it does NOT fall back to 50. These norm entries are **mandatory** before any new dimension scores can be rendered in report sections. This step is a hard prerequisite for steps 8–11 in the implementation order.

```ts
// In NORM_PARAMS (or equivalent structure in lib/norms.ts):
emotional_intelligence: { mean: 50, sd: 15 },
decision_making:        { mean: 50, sd: 15 },
execution:              { mean: 50, sd: 15 },
managing_others:        { mean: 50, sd: 15 },
teamwork:               { mean: 50, sd: 15 },
persuasion:             { mean: 50, sd: 15 },
embracing_differences:  { mean: 50, sd: 15 },
```

This means percentile scores for new dimensions will be approximate until real norm data is collected. This is acceptable for launch and disclosed in the report UI with a small "based on early data" note where applicable.

---

## 8. Radar Chart (`components/charts/RadarChart.tsx`)

### Dual-layer implementation

Two `<Radar>` components on the same chart and axis grid. Both use all 35 dimension data points. For each layer, the non-relevant dimensions are set to **50 (population mean)** rather than 0 — keeping both polygons at roughly the same scale so the shapes are visually meaningful.

```tsx
'use client'
import { useState, useEffect } from 'react'
import { RadarChart as RechartsRadar, Radar, PolarGrid, PolarAngleAxis,
         ResponsiveContainer, Tooltip } from 'recharts'
import { DIMENSIONS, MAJOR_DIMS } from '@/lib/dimensions'
import type { DimensionScores } from '@/lib/types'

// Build ordered axis data — grouped by category for visual coherence
const RADAR_ORDER = DIMENSIONS.filter(d => d.slug !== 'founder_potential')

interface Props { scores: DimensionScores }

export function DimensionRadarChart({ scores }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const data = RADAR_ORDER.map(dim => {
    const score = scores[dim.slug] ?? 50
    return {
      subject: dim.shortLabel,
      slug: dim.slug,
      majorScore: MAJOR_DIMS.has(dim.slug) ? score : 50,
      minorScore: !MAJOR_DIMS.has(dim.slug) ? score : 50,
      fullMark: 100,
    }
  })

  const margin = isMobile
    ? { top: 10, right: 25, bottom: 10, left: 25 }
    : { top: 20, right: 80, bottom: 20, left: 80 }

  return (
    <div>
      <ResponsiveContainer width="100%" height={isMobile ? 460 : 520}>
        <RechartsRadar data={data} margin={margin}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={<CustomTick isMobile={isMobile} />}
          />
          <Radar
            name="Major"
            dataKey="majorScore"
            stroke="#3730A3"
            fill="#3730A3"
            fillOpacity={0.22}
            strokeWidth={2}
          />
          <Radar
            name="Minor"
            dataKey="minorScore"
            stroke="#0F766E"
            fill="#0F766E"
            fillOpacity={0.12}
            strokeWidth={1.5}
          />
          <Tooltip formatter={(v, name) => [`${v}`, name === 'Major' ? 'Major dimension' : 'Supporting dimension']} />
        </RechartsRadar>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block opacity-70" style={{ backgroundColor: '#3730A3' }} />
          Major dimensions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block opacity-60" style={{ backgroundColor: '#0F766E' }} />
          Supporting dimensions
        </span>
      </div>
    </div>
  )
}
```

### Custom tick with Major/Minor coloring

```tsx
interface CustomTickProps {
  x?: number
  y?: number
  payload?: { value: string }
  textAnchor?: string
}

function CustomTick({ x = 0, y = 0, payload, textAnchor, isMobile = false }: CustomTickProps & { isMobile?: boolean }) {
  const label = payload?.value ?? ''
  const slug = RADAR_ORDER.find(d => d.shortLabel === label)?.slug
  const isMajor = slug ? MAJOR_DIMS.has(slug) : false

  const fill = isMajor ? '#3730A3' : '#64748B'
  const fontWeight = isMajor ? 600 : 400
  const fontSize = isMobile ? (isMajor ? 9 : 8) : (isMajor ? 10 : 9)

  const words = label.split(' ')
  if (!label || words.length === 1 || label.length <= 10) {
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={fontSize} fontWeight={fontWeight}>
        <tspan x={x} dy="0.355em">{label}</tspan>
      </text>
    )
  }
  const mid = Math.ceil(words.length / 2)
  return (
    <text x={x} y={y} textAnchor={textAnchor} fill={fill} fontSize={fontSize} fontWeight={fontWeight}>
      <tspan x={x} dy="-0.3em">{words.slice(0, mid).join(' ')}</tspan>
      <tspan x={x} dy="1.2em">{words.slice(mid).join(' ')}</tspan>
    </text>
  )
}
```

---

## 9. Report Section Updates

### Section 2 — Psychological Fingerprint

**Superpowers/Growth cards** — sourced from Major dimensions only (stronger signal):
```ts
const sorted = Object.entries(scores)
  .filter(([k]) => MAJOR_DIMS.has(k as DimensionSlug) && k !== 'founder_potential')
  .sort(([, a], [, b]) => b - a)
```

**DimCard** — add major indicator dot:
```tsx
{MAJOR_DIMS.has(slug as DimensionSlug) && (
  <span className="w-1.5 h-1.5 rounded-full bg-indigo inline-block mr-1 flex-shrink-0" />
)}
```

**Dimensions table** — add `M` badge column (desktop only):
```tsx
<th className="hidden sm:table-cell px-4 py-3 text-center font-medium">Type</th>
// ...
<td className="hidden sm:table-cell px-4 py-3 text-center">
  {MAJOR_DIMS.has(item.slug as DimensionSlug)
    ? <span className="text-[10px] font-semibold text-indigo bg-indigo/10 px-1.5 py-0.5 rounded-full">M</span>
    : <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">S</span>
  }
</td>
```

### Minor dimensions in the report

Minor dimensions appear on the radar chart and in the expanded dimensions table in Section 2. They do **not** get dedicated narrative cards in Sections 3–11 — those sections focus on Major dimensions. This is by design: Minor dimensions are contextual, not archetype-determining. The radar provides the visual fingerprint; the table provides the full 35-dimension breakdown.

### New Major dimension placement in report sections

| New dimension | Section | Placement |
|--------------|---------|-----------|
| `emotional_intelligence` | Section 4 (Cognitive Profile) | Add to `COG_DIMS` array; add `COG_LABELS['emotional_intelligence'] = 'Emotional Intelligence'`; add description and `cogInsight()` case (see copy below) |
| `decision_making` | Section 4 (Cognitive Profile) | Add to `COG_DIMS` array; add `COG_LABELS['decision_making'] = 'Decision Making'`; add description and `cogInsight()` case (see copy below) |
| `execution` | Section 5 (Motivational DNA) | Standalone `DimCard`-style card **below** the existing driver/drain pattern — do NOT add to `MOT_DIMS`; `execution` does not participate in driver/drain sorting |
| `managing_others` | Section 7 (Leadership Profile) — `ReportSection7.tsx` | New `DimCard`-style card with MO insight copy, placed after the existing leadership strengths/blind spots block |

#### Section 4 copy for new dims

**`emotional_intelligence` — `COG_DESCRIPTIONS` entry:**
> "Your ability to accurately read emotions in yourself and others and use that awareness to guide behavior. High scorers navigate interpersonal situations with precision — they detect tension early, adapt their approach in real time, and build trust consistently."

**`emotional_intelligence` — `cogInsight()` cases:**
- **high (≥75):** "At {score} ({pStr}), your emotional intelligence is a genuine edge. You read rooms and people with accuracy, adapt your approach in real time, and build trust where others create friction. In leadership and collaboration contexts, this is compounding."
- **mid (50–74):** "Your emotional intelligence score of {score} ({pStr}) is solid. You pick up on emotional cues when you're paying attention and can regulate your responses under moderate pressure. Developing more consistent awareness in high-stakes interactions will move this higher."
- **low (<50):** "At {score} ({pStr}), emotional intelligence is a development area. You may miss interpersonal signals that affect outcomes — not because you lack empathy, but because explicit attention to emotional dynamics isn't yet habitual. This is highly learnable with deliberate practice."

**`decision_making` — `COG_DESCRIPTIONS` entry:**
> "Quality of judgment under uncertainty — how well you balance speed with accuracy, gather the right information without overloading, and commit to choices with appropriate confidence. High scorers make better calls faster with less second-guessing."

**`decision_making` — `cogInsight()` cases:**
- **high (≥75):** "Your decision making score of {score} ({pStr}) reflects strong judgment under uncertainty. You gather sufficient information, commit with appropriate confidence, and avoid the twin traps of analysis paralysis and premature closure. This is a rare and high-leverage capability."
- **mid (50–74):** "At {score} ({pStr}), your decision making is functional but variable. You perform well in familiar domains where your models are calibrated. In novel or high-stakes situations, building explicit decision frameworks — even simple ones — will improve consistency."
- **low (<50):** "Your decision making score of {score} ({pStr}) suggests that judgment under uncertainty is a development priority. You may over-rely on incomplete information, avoid committing until certainty arrives, or reverse decisions under pressure. Deliberate exposure to low-stakes decision practice builds this capacity over time."

New Minor dimensions (`teamwork`, `persuasion`, `embracing_differences`) appear in the expanded dimensions table (Section 2) and radar only. No dedicated report cards — consistent with all other Minor dimensions.

---

## 10. Files Changed (Implementation Order)

| Order | File | Change |
|-------|------|--------|
| 1 | `lib/types.ts` | Add 7 new DimensionSlug values |
| 2 | `lib/dimensions.ts` | **NEW** — full dimension registry |
| 3 | `lib/norms.ts` | Add 7 new dimension norm entries (**mandatory** — getPercentile throws on missing slugs) |
| 4 | `lib/questions.ts` | Add ~183 new questions, maintain calibration count = 80 |
| 5 | `lib/scoring.ts` | 4-point scale detection and normalization |
| 6 | `app/api/assessment/respond/route.ts` | New confidence gate, adaptive priority, ambiguous declaration, hard cap |
| 7 | `components/charts/RadarChart.tsx` | Dual-layer Major/Minor radar; import from lib/dimensions.ts |
| 8 | `components/report/ReportSection2.tsx` | Replace local `DIM_DESCRIPTIONS` constant with import from `lib/dimensions.ts`; Major-only superpowers; M/S badges in table |
| 9 | `components/report/ReportSection4.tsx` | Add `emotional_intelligence` and `decision_making` to local `COG_DIMS` array; add entries to local `COG_LABELS` and `COG_DESCRIPTIONS`; add `cogInsight()` cases with provided copy. Import `MAJOR_DIMS` from `lib/dimensions.ts` if M/S badge logic is added to this section. (Do NOT replace these local arrays with imports — `lib/dimensions.ts` does not export COG-specific structures) |
| 10 | `components/report/ReportSection5.tsx` | Add standalone execution card below existing driver/drain section |
| 11 | `components/report/ReportSection7.tsx` | Add managing_others card (this is the Leadership Profile section — NOT Section 6 which is Career Intelligence) |

---

## 11. Out of Scope

- **Archetype recalibration** — new dims not included in any archetype signature until norm data collected; defaults to 50 and does not bias existing archetype composites
- **HPIF composite updates** — new dimensions not folded into HPIF layer calculations until post-launch recalibration
- **Visual question images** — `type: 'visual'` not used for any new questions; images not yet designed
- **Database migration** — new dimension scores stored in existing `results.scores` JSONB column; no schema changes

---

## 12. Success Criteria

- [ ] `lib/dimensions.ts` exports `DIMENSIONS` (35 entries), `MAJOR_DIMS` (20), `MINOR_DIMS` (15)
- [ ] `lib/types.ts` DimensionSlug union has exactly 36 entries (29 existing + 7 new)
- [ ] `QUESTIONS.filter(q => q.calibration && q.is_active).length === 80`
- [ ] Total question bank has ≥ 265 questions
- [ ] All 4 new Major dimensions have ≥ 8 questions each; all 3 new Minor dimensions have ≥ 5 questions each
- [ ] Assessment completes in 80–132 questions depending on confidence
- [ ] Confidence gate uses: topComposite ≥ 81, margin ≥ 10, ambiguousMajorCount ≤ 2, allMajorDimsCovered
- [ ] Radar renders dual-layer: indigo fill for majorScore, teal fill for minorScore
- [ ] Major dim axis labels render in indigo bold (#3730A3), Minor in slate (#64748B)
- [ ] Superpowers/Growth cards source from Major dims only (20 dims)
- [ ] All 4 new Major dims appear as DimCards in Sections 4–6
- [ ] 5-point legacy question scores remain backward compatible (no existing results broken)
- [ ] `npm run build` passes with 0 TypeScript errors
