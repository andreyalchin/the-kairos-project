# Dimension Expansion & Dual-Layer Radar Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Kairos from 29 to 36 scored dimensions, add a Major/Minor classification system, rework the radar chart to dual-layer, raise the confidence threshold to 81%, and update calibration to 80 Phase 1 questions.

**Architecture:** A new `lib/dimensions.ts` registry becomes the single source of truth for dimension metadata (label, description, major/minor flag), replacing scattered local constants across report sections and the radar chart. All structural changes (types, scoring, engine, UI) are implemented with stub question content for the 7 new dimensions — full question content authoring is a separate workstream.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Jest, Recharts

---

## ⚠️ Important Pre-Task Notes

**Question bank content:** Task 4 adds minimal stub questions (2 calibration + 3 additional per new dim) to unblock structural testing. Stub text is clearly marked `[PLACEHOLDER]`. Full quality content must be authored separately before launch.

**Run commands:** On Windows with Git Bash, prefix npm commands:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```

**Test runner:** `npm test` — runs Jest from `__tests__/` directory.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `lib/types.ts` | Modify | Add 7 new DimensionSlug values |
| `lib/dimensions.ts` | **Create** | Full dimension registry — single source of truth |
| `lib/norms.ts` | Modify | Add 7 new dimension norm entries |
| `lib/scoring.ts` | Modify | 4-point scale detection in extractRawValue |
| `lib/questions.ts` | Modify | Stub questions for 7 new dims + calibration count = 80 |
| `app/api/assessment/respond/route.ts` | Modify | New confidence gate, ambiguous array, adaptive priorities, hard cap |
| `components/charts/RadarChart.tsx` | Replace | Dual-layer Major/Minor radar |
| `components/report/ReportSection2.tsx` | Modify | Replace DIM_DESCRIPTIONS with import; Major-only superpowers; M/S badges |
| `components/report/ReportSection4.tsx` | Modify | Add EI + DM to COG_DIMS arrays and cogInsight() |
| `components/report/ReportSection5.tsx` | Modify | Add standalone execution card below existing content |
| `components/report/ReportSection7.tsx` | Modify | Add managing_others card |

---

## Task 1: Type System + Dimension Registry

**Files:**
- Modify: `lib/types.ts:7-19`
- Create: `lib/dimensions.ts`
- Create: `__tests__/dimensions.test.ts`

### Step 1: Add failing test for DimensionSlug count and DIMENSIONS registry

- [ ] Create `__tests__/dimensions.test.ts`:

```ts
// __tests__/dimensions.test.ts
import { DIMENSIONS, MAJOR_DIMS, MINOR_DIMS } from '@/lib/dimensions'

describe('DIMENSIONS registry', () => {
  it('has exactly 35 active entries (founder_potential excluded)', () => {
    expect(DIMENSIONS).toHaveLength(35)
  })
  it('has exactly 20 major dimensions', () => {
    expect(MAJOR_DIMS.size).toBe(20)
  })
  it('has exactly 15 minor dimensions', () => {
    expect(MINOR_DIMS.size).toBe(15)
  })
  it('every entry has required fields', () => {
    for (const d of DIMENSIONS) {
      expect(d.slug).toBeTruthy()
      expect(d.label).toBeTruthy()
      expect(d.shortLabel.length).toBeLessThanOrEqual(12)
      expect(d.description).toBeTruthy()
      expect([true, false]).toContain(d.major)
    }
  })
  it('no duplicate slugs', () => {
    const slugs = DIMENSIONS.map(d => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
```

- [ ] Run test — expect FAIL (module not found):
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=dimensions
```
Expected: `Cannot find module '@/lib/dimensions'`

### Step 2: Update DimensionSlug in lib/types.ts

- [ ] Replace lines 7–19 of `lib/types.ts` with:

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
  | 'collaboration_signature'
  | 'leadership_drive' | 'founder_potential' | 'strategic_orientation'
  | 'specialist_generalist' | 'innovation_index'
  | 'psychological_resilience' | 'growth_mindset'
  | 'adaptability_quotient' | 'learning_agility'
  // 7 new
  | 'emotional_intelligence' | 'decision_making' | 'execution'
  | 'managing_others' | 'teamwork' | 'persuasion' | 'embracing_differences'
```

### Step 3: Create lib/dimensions.ts

- [ ] Create `lib/dimensions.ts`:

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

### Step 4: Run tests — expect pass

- [ ] Run tests:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=dimensions
```
Expected: All 5 tests PASS

### Step 5: Skip build verification — defer to Task 4

> **Do NOT run build verification here.** Adding 7 new `DimensionSlug` values causes TypeScript strict mode to require all `DimensionScores` objects to include the new keys. This will produce TS errors in files that construct `DimensionScores` directly, until question stubs and scoring updates are in place (Task 4). Build verification is deferred to after Task 5.

### Step 6: Commit

- [ ] Commit:
```bash
git add lib/types.ts lib/dimensions.ts __tests__/dimensions.test.ts
git commit -m "feat: add 7 new DimensionSlugs and DIMENSIONS registry (lib/dimensions.ts)"
```

---

## Task 2: Norm Data

**Files:**
- Modify: `lib/norms.ts:35` (insert before closing brace)
- Modify: `__tests__/norms.test.ts` (add coverage for new dims)

### Step 1: Add failing test for new dimension norm lookups

- [ ] Add to `__tests__/norms.test.ts` (after the existing tests):

```ts
  it('returns ~50th percentile for score of 50 on new dimensions', () => {
    const newDims = [
      'emotional_intelligence', 'decision_making', 'execution',
      'managing_others', 'teamwork', 'persuasion', 'embracing_differences',
    ]
    for (const dim of newDims) {
      expect(getPercentile(dim, 50)).toBeCloseTo(50, 0)
    }
  })
  it('does not throw for any new dimension slug', () => {
    const newDims = [
      'emotional_intelligence', 'decision_making', 'execution',
      'managing_others', 'teamwork', 'persuasion', 'embracing_differences',
    ]
    for (const dim of newDims) {
      expect(() => getPercentile(dim, 50)).not.toThrow()
    }
  })
```

- [ ] Run test — expect FAIL:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=norms
```
Expected: `Unknown dimension: emotional_intelligence`

### Step 2: Add norm entries to lib/norms.ts

- [ ] In `lib/norms.ts`, insert the 7 new entries before the closing `}` of the `NORMS` object (after the `learning_agility` line):

```ts
  // New dimensions — flat distribution centered at 50 until real data collected
  emotional_intelligence: [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  decision_making:        [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  execution:              [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  managing_others:        [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  teamwork:               [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  persuasion:             [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  embracing_differences:  [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
```

### Step 3: Run tests — expect pass

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=norms
```
Expected: All tests PASS

### Step 4: Commit

- [ ] Commit:
```bash
git add lib/norms.ts __tests__/norms.test.ts
git commit -m "feat: add norm entries for 7 new dimensions (flat prior at 50)"
```

---

## Task 3: 4-Point Scale Scoring

**Files:**
- Modify: `lib/scoring.ts:9-11`
- Modify: `__tests__/scoring.test.ts`

### Step 1: Add failing tests for 4-point scale normalization

- [ ] Add to `__tests__/scoring.test.ts` after the existing `extractRawValue` tests:

```ts
  it('normalizes 4-point likert to 1-5 range: 1→1.0, 2→2.33, 3→3.67, 4→5.0', () => {
    const q4: Question = { ...likertQ, options: { labels: ['SD', 'D', 'A', 'SA'] } }
    expect(extractRawValue(q4, 1)).toBeCloseTo(1.0, 1)
    expect(extractRawValue(q4, 2)).toBeCloseTo(2.33, 1)
    expect(extractRawValue(q4, 3)).toBeCloseTo(3.67, 1)
    expect(extractRawValue(q4, 4)).toBeCloseTo(5.0, 1)
  })
  it('leaves 5-point likert (legacy) unchanged', () => {
    const q5: Question = { ...likertQ, options: { labels: ['SD', 'D', 'N', 'A', 'SA'] } }
    expect(extractRawValue(q5, 4)).toBe(4)
  })
  it('4-point max equals 5-point max (both produce raw=5)', () => {
    const q4: Question = { ...likertQ, options: { labels: ['SD', 'D', 'A', 'SA'] } }
    const q5: Question = { ...likertQ, options: { labels: ['SD', 'D', 'N', 'A', 'SA'] } }
    expect(extractRawValue(q4, 4)).toBeCloseTo(extractRawValue(q5, 5), 1)
  })
```

- [ ] Run — expect FAIL:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=scoring
```
Expected: `Expected: 1.0, Received: 1` (4-point currently treated as 5-point)

### Step 2: Update extractRawValue in lib/scoring.ts

- [ ] Replace lines 9–11 of `lib/scoring.ts`:

```ts
    case 'likert':
    case 'frequency': {
      const val = Number(value)
      const labelCount = question.options.labels?.length ?? 5
      if (labelCount === 4) {
        // 4-point: 1→1, 2→2.33, 3→3.67, 4→5 (linear map onto 1-5 range)
        raw = ((val - 1) / 3) * 4 + 1
      } else {
        // 5-point legacy: pass through as-is
        raw = val
      }
      break
    }
```

> **Note on formula:** The spec document contains a different formula (`((val-1)/3)*5`). That formula maps `1→0` which breaks the `(weighted/maxPossible)*100` downstream math (max = `5 * weight`, but min response produces `0` not `1`). The formula above (`((val-1)/3)*4+1`) is the correct implementation — it maps `1→1, 2→2.33, 3→3.67, 4→5`, preserving exact parity with the 5-point scale's `1→1` and `5→5` endpoints. **Use this plan's formula, not the spec's.**

### Step 3: Run tests — expect pass

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=scoring
```
Expected: All tests PASS (including new and existing)

### Step 4: Commit

- [ ] Commit:
```bash
git add lib/scoring.ts __tests__/scoring.test.ts
git commit -m "feat: add 4-point likert/frequency scale support in extractRawValue"
```

---

## Task 4: Question Bank Stubs

**Files:**
- Modify: `lib/questions.ts` (append to end)
- Modify/Create: `__tests__/questions.test.ts`

> **Content note:** This task adds placeholder questions to reach `calibrationCount === 80` and unblock structural testing. Stub questions use `[PLACEHOLDER]` prefix text. Replace all `[PLACEHOLDER]` questions with quality content before launch.

### Step 1: Add failing test for question bank requirements

- [ ] Create `__tests__/questions.test.ts`:

```ts
// __tests__/questions.test.ts
import { QUESTIONS } from '@/lib/questions'

describe('QUESTIONS bank', () => {
  it('has calibration count of exactly 80', () => {
    const count = QUESTIONS.filter(q => q.calibration && q.is_active).length
    expect(count).toBe(80)
  })
  it('every active question has a unique code', () => {
    const codes = QUESTIONS.filter(q => q.is_active).map(q => q.code)
    expect(new Set(codes).size).toBe(codes.length)
  })
  it('all 7 new dimensions have at least 5 questions each', () => {
    const newDims = ['emotional_intelligence', 'decision_making', 'execution',
      'managing_others', 'teamwork', 'persuasion', 'embracing_differences']
    for (const dim of newDims) {
      const count = QUESTIONS.filter(q => q.dimension === dim && q.is_active).length
      expect(count).toBeGreaterThanOrEqual(5)
    }
  })
  it('all 4 new Major dimensions have at least 8 questions each', () => {
    const newMajors = ['emotional_intelligence', 'decision_making', 'execution', 'managing_others']
    for (const dim of newMajors) {
      const count = QUESTIONS.filter(q => q.dimension === dim && q.is_active).length
      expect(count).toBeGreaterThanOrEqual(8)
    }
  })
})
```

- [ ] Run — expect FAIL:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=questions
```
Expected: calibration count fails (current count ~39, not 80)

### Step 2: Audit existing calibration counts

- [ ] Before adding questions, check which existing dims need a 2nd calibration question. Run this one-liner from the project root:

```bash
export PATH="/c/Program Files/nodejs:$PATH" && node -e "
const { QUESTIONS } = require('./lib/questions');
const counts = {};
QUESTIONS.filter(q=>q.calibration&&q.is_active).forEach(q=>{counts[q.dimension]=(counts[q.dimension]||0)+1});
console.log(JSON.stringify(counts, null, 2));
console.log('Total:', QUESTIONS.filter(q=>q.calibration&&q.is_active).length);
"
```

Expected output: Shows which dims have 1 vs 2 calibration questions. Dims with 1 need a 2nd calibration-flagged question added.

### Step 3: Add new questions to lib/questions.ts

- [ ] Append the following to `lib/questions.ts`. This block adds:
  - 8 questions each for the 4 new Major dims
  - 5 questions each for the 3 new Minor dims
  - 2nd calibration questions for existing dims that the Step 2 audit shows have only 1
  - 10 tiebreaker calibration questions spread across high-discriminating dims

```ts
  // === NEW MAJOR DIMS ===

  // Emotional Intelligence (8 questions — 2 calibration)
  { id: '', code: 'EI_01', text: '[PLACEHOLDER] I can accurately identify what emotion I am feeling in a given moment.', type: 'likert', dimension: 'emotional_intelligence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'EI_02', text: '[PLACEHOLDER] I notice when someone\'s mood shifts even if they say nothing.', type: 'likert', dimension: 'emotional_intelligence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'EI_03', text: '[PLACEHOLDER] I can manage my emotional reactions even under significant pressure.', type: 'likert', dimension: 'emotional_intelligence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'EI_04', text: '[PLACEHOLDER] I find it difficult to stay composed when others are visibly upset.', type: 'likert', dimension: 'emotional_intelligence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'EI_05', text: '[PLACEHOLDER] How often do you adjust your communication style based on someone else\'s emotional state?', type: 'frequency', dimension: 'emotional_intelligence', tier: 4, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 5, is_active: true },
  { id: '', code: 'EI_06', text: '[PLACEHOLDER] Which matters more to you in a conflict?', type: 'forced_choice', dimension: 'emotional_intelligence', tier: 4, options: { a: 'Establishing the correct facts of the situation', b: 'Making sure each person feels heard before resolving it' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 6, is_active: true },
  { id: '', code: 'EI_07', text: '[PLACEHOLDER] I recognize when my own emotions are influencing my judgment.', type: 'likert', dimension: 'emotional_intelligence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 7, is_active: true },
  { id: '', code: 'EI_08', text: '[PLACEHOLDER] A colleague is visibly withdrawn. You notice but they say they\'re fine. You:', type: 'situational', dimension: 'emotional_intelligence', tier: 4, options: { scenario: 'A colleague is withdrawn; they say they\'re fine.', choices: ['A: Take them at their word', 'B: Check in privately later', 'C: Bring it up in front of the group', 'D: Mention it to your manager'], scores: [2.3, 5, 1, 3.7] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 8, is_active: true },

  // Decision Making (8 questions — 2 calibration)
  { id: '', code: 'DM_01', text: '[PLACEHOLDER] I make decisions confidently even when information is incomplete.', type: 'likert', dimension: 'decision_making', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'DM_02', text: '[PLACEHOLDER] I often second-guess decisions I have already made.', type: 'likert', dimension: 'decision_making', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'DM_03', text: '[PLACEHOLDER] How often do you delay a decision because you feel you need more data?', type: 'frequency', dimension: 'decision_making', tier: 2, options: { labels: ['Almost Always','Usually','Rarely','Almost Never'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'DM_04', text: '[PLACEHOLDER] When I am wrong about a decision, I recognize it quickly.', type: 'likert', dimension: 'decision_making', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'DM_05', text: '[PLACEHOLDER] I find it harder to decide when no option is clearly correct.', type: 'likert', dimension: 'decision_making', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 5, is_active: true },
  { id: '', code: 'DM_06', text: '[PLACEHOLDER] Which approach do you prefer?', type: 'forced_choice', dimension: 'decision_making', tier: 2, options: { a: 'Gather more data until you\'re highly confident', b: 'Decide with 70% confidence and adjust as you learn' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 6, is_active: true },
  { id: '', code: 'DM_07', text: '[PLACEHOLDER] I commit to a path and resist the urge to revisit it unnecessarily.', type: 'likert', dimension: 'decision_making', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 7, is_active: true },
  { id: '', code: 'DM_08', text: '[PLACEHOLDER] Two strategies are equally viable. The team needs a decision in 5 minutes. You:', type: 'timed', dimension: 'decision_making', tier: 2, options: { scenario: 'Two equally viable strategies; need a decision in 5 minutes.', choices: ['A: Pick one and commit', 'B: Ask for 30 more minutes', 'C: Choose the safer option', 'D: Split the approach'], scores: [5, 1, 2.3, 3.7] }, weight: 1.3, reverse_scored: false, calibration: false, order_index: 8, is_active: true },

  // Execution (8 questions — 2 calibration)
  { id: '', code: 'EX_01', text: '[PLACEHOLDER] I consistently follow through on commitments I make to others.', type: 'likert', dimension: 'execution', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'EX_02', text: '[PLACEHOLDER] I deliver results even when the path to completion is unclear.', type: 'likert', dimension: 'execution', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'EX_03', text: '[PLACEHOLDER] How often do projects you own get completed on time?', type: 'frequency', dimension: 'execution', tier: 3, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'EX_04', text: '[PLACEHOLDER] I get things done without needing external accountability or reminders.', type: 'likert', dimension: 'execution', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'EX_05', text: '[PLACEHOLDER] I often have good ideas but struggle to convert them into completed work.', type: 'likert', dimension: 'execution', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 5, is_active: true },
  { id: '', code: 'EX_06', text: '[PLACEHOLDER] Which describes you more accurately?', type: 'forced_choice', dimension: 'execution', tier: 3, options: { a: 'Strong at generating and starting things', b: 'Strong at finishing and delivering things' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 6, is_active: true },
  { id: '', code: 'EX_07', text: '[PLACEHOLDER] I break large projects into small concrete steps before starting.', type: 'likert', dimension: 'execution', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 7, is_active: true },
  { id: '', code: 'EX_08', text: '[PLACEHOLDER] A project you own is behind. The deadline is tomorrow. You:', type: 'situational', dimension: 'execution', tier: 3, options: { scenario: 'Project is behind, deadline is tomorrow.', choices: ['A: Work through the night to finish', 'B: Scope down to the critical deliverable and cut the rest', 'C: Communicate proactively and ask for an extension', 'D: Deliver what you have and note gaps clearly'], scores: [3.7, 5, 2.3, 1] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 8, is_active: true },

  // Managing Others (8 questions — 2 calibration)
  { id: '', code: 'MO_01', text: '[PLACEHOLDER] I enjoy coaching and developing the people who work with me.', type: 'likert', dimension: 'managing_others', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'MO_02', text: '[PLACEHOLDER] I find it natural to hold people accountable without damaging the relationship.', type: 'likert', dimension: 'managing_others', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'MO_03', text: '[PLACEHOLDER] How often do you give direct feedback when someone\'s work falls short?', type: 'frequency', dimension: 'managing_others', tier: 5, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'MO_04', text: '[PLACEHOLDER] I prefer doing work myself rather than delegating it to someone else.', type: 'likert', dimension: 'managing_others', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'MO_05', text: '[PLACEHOLDER] I adapt my management style based on the individual I am working with.', type: 'likert', dimension: 'managing_others', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 5, is_active: true },
  { id: '', code: 'MO_06', text: '[PLACEHOLDER] Which type of management work energizes you more?', type: 'forced_choice', dimension: 'managing_others', tier: 5, options: { a: 'Setting direction and strategy', b: 'Developing people and coaching' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 6, is_active: true },
  { id: '', code: 'MO_07', text: '[PLACEHOLDER] I find underperformance conversations uncomfortable to initiate.', type: 'likert', dimension: 'managing_others', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 7, is_active: true },
  { id: '', code: 'MO_08', text: '[PLACEHOLDER] A direct report repeatedly misses deadlines despite reminders. You:', type: 'situational', dimension: 'managing_others', tier: 5, options: { scenario: 'Direct report repeatedly misses deadlines despite reminders.', choices: ['A: Have a direct performance conversation and set clear consequences', 'B: Dig into the root cause — workload, skill, or motivation', 'C: Reassign the work to someone more reliable', 'D: Escalate to HR'], scores: [3.7, 5, 2.3, 1] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 8, is_active: true },

  // === NEW MINOR DIMS ===

  // Teamwork (5 questions — 2 calibration)
  { id: '', code: 'TW_01', text: '[PLACEHOLDER] I actively adapt my working style to fit the needs of the team.', type: 'likert', dimension: 'teamwork', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'TW_02', text: '[PLACEHOLDER] I prioritize the team\'s success over my individual recognition.', type: 'likert', dimension: 'teamwork', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'TW_03', text: '[PLACEHOLDER] How often do you proactively help teammates without being asked?', type: 'frequency', dimension: 'teamwork', tier: 4, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'TW_04', text: '[PLACEHOLDER] I tend to work better independently than as part of a group.', type: 'likert', dimension: 'teamwork', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'TW_05', text: '[PLACEHOLDER] Which describes your preference?', type: 'forced_choice', dimension: 'teamwork', tier: 4, options: { a: 'Working closely and collaboratively with others throughout a project', b: 'Working independently and syncing with others at key checkpoints' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 5, is_active: true },

  // Persuasion (5 questions — 2 calibration)
  { id: '', code: 'PE_01', text: '[PLACEHOLDER] I can change someone\'s mind using logic and reasoned argument.', type: 'likert', dimension: 'persuasion', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'PE_02', text: '[PLACEHOLDER] I find it difficult to convince others when they are resistant.', type: 'likert', dimension: 'persuasion', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'PE_03', text: '[PLACEHOLDER] How often are you the one who shifts a group\'s direction in a discussion?', type: 'frequency', dimension: 'persuasion', tier: 4, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'PE_04', text: '[PLACEHOLDER] I tailor my arguments to what matters most to the specific person I am persuading.', type: 'likert', dimension: 'persuasion', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'PE_05', text: '[PLACEHOLDER] Which do you rely on more to persuade others?', type: 'forced_choice', dimension: 'persuasion', tier: 4, options: { a: 'Data, evidence, and logical argument', b: 'Stories, emotion, and relationship' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 5, is_active: true },

  // Embracing Differences (5 questions — 2 calibration)
  { id: '', code: 'ED_01', text: '[PLACEHOLDER] I actively seek out perspectives from people with very different backgrounds than mine.', type: 'likert', dimension: 'embracing_differences', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'ED_02', text: '[PLACEHOLDER] I feel uncomfortable when people operate very differently from how I do.', type: 'likert', dimension: 'embracing_differences', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'ED_03', text: '[PLACEHOLDER] How often do you change your approach based on someone\'s cultural or personal background?', type: 'frequency', dimension: 'embracing_differences', tier: 4, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
  { id: '', code: 'ED_04', text: '[PLACEHOLDER] I believe diverse teams produce better outcomes than homogeneous ones.', type: 'likert', dimension: 'embracing_differences', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 4, is_active: true },
  { id: '', code: 'ED_05', text: '[PLACEHOLDER] Which would you enjoy more?', type: 'forced_choice', dimension: 'embracing_differences', tier: 4, options: { a: 'Working with a team of people who think very similarly to you', b: 'Working with a team of people with radically different backgrounds and perspectives' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 5, is_active: true },

  // === CALIBRATION BOOSTERS ===
  // Add 2nd calibration question to existing dims that currently have only 1,
  // AND add 10 tiebreaker calibration questions across high-discriminating dims.
  //
  // IMPORTANT: Run the Step 2 audit first to confirm which dims need boosting.
  // The entries below cover the most likely candidates based on initial review.
  // Add or remove as needed to reach exactly 80 calibration flags total.

  // Openness — 2nd calibration (O_01 is the only existing one)
  { id: '', code: 'O_04', text: '[PLACEHOLDER] I regularly read or explore content well outside my professional area.', type: 'likert', dimension: 'openness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },

  // Honesty-Humility — 2nd calibration (HH_01 is the only existing one)
  { id: '', code: 'HH_04', text: '[PLACEHOLDER] I will tell someone an uncomfortable truth rather than stay silent.', type: 'likert', dimension: 'honesty_humility', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },

  // Executive Function — 2nd calibration (EF_01 is the only existing one)
  { id: '', code: 'EF_04', text: '[PLACEHOLDER] I regularly plan my week ahead rather than responding to what comes up.', type: 'frequency', dimension: 'executive_function', tier: 2, options: { labels: ['Almost Never','Rarely','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },

  // Attention Control — 2nd calibration (AC_01 is the only existing one)
  { id: '', code: 'AC_04', text: '[PLACEHOLDER] I can ignore distractions and stay on task even in a noisy environment.', type: 'likert', dimension: 'attention_control', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },

  // Systems Thinking — 2nd calibration (ST_01 is the only existing one)
  { id: '', code: 'ST_04', text: '[PLACEHOLDER] When solving a problem, I naturally consider how the solution affects other parts of the system.', type: 'likert', dimension: 'systems_thinking', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },

  // === CALIBRATION BOOSTERS — 12 existing dims that have only 1 calibration question ===
  // Each gets a 2nd calibration-flagged question to satisfy the 2-per-dim target.
  // These bring the total to: 39 (existing) + 14 (new dims ×2) + 5 (openness/HH/EF/AC/ST) + 12 (below) + 10 (tiebreakers) = 80

  { id: '', code: 'CI_04', text: '[PLACEHOLDER] I regularly generate ideas that surprise even myself.', type: 'likert', dimension: 'creative_intelligence', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'AN_04', text: '[PLACEHOLDER] I need significant independence in how I approach my work to perform at my best.', type: 'likert', dimension: 'autonomy_need', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'PO_04', text: '[PLACEHOLDER] Work that lacks a meaningful purpose fails to hold my engagement over time.', type: 'likert', dimension: 'purpose_orientation', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'CD_04', text: '[PLACEHOLDER] Knowing how my performance compares to others motivates me.', type: 'likert', dimension: 'competitive_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'CN_04', text: '[PLACEHOLDER] I address interpersonal tension directly rather than hoping it resolves on its own.', type: 'likert', dimension: 'conflict_navigation', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'CS_04', text: '[PLACEHOLDER] I naturally adapt the way I communicate depending on my audience.', type: 'likert', dimension: 'communication_style', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'CO_04', text: '[PLACEHOLDER] I do my best work as part of a collaborative team rather than alone.', type: 'likert', dimension: 'collaboration_signature', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'SO_04', text: '[PLACEHOLDER] I naturally think in terms of long-term trajectories rather than immediate tasks.', type: 'likert', dimension: 'strategic_orientation', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'SG_04', text: '[PLACEHOLDER] I prefer going deep in one area over being broadly capable across many areas.', type: 'forced_choice', dimension: 'specialist_generalist', tier: 5, options: { a: 'Go deep — become world-class in one domain', b: 'Go broad — develop range across many domains' }, weight: 1.2, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'II_04', text: '[PLACEHOLDER] I frequently come up with novel solutions others haven\'t considered.', type: 'likert', dimension: 'innovation_index', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'AQ_04', text: '[PLACEHOLDER] I adjust quickly when circumstances change unexpectedly.', type: 'likert', dimension: 'adaptability_quotient', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },
  { id: '', code: 'LA_04', text: '[PLACEHOLDER] I pick up new skills noticeably faster than most people I work with.', type: 'likert', dimension: 'learning_agility', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 10, is_active: true },

  // Tiebreakers — 10 calibration questions spread across high-discriminating dims
  // (These give 3rd calibration flags to the dims most useful for archetype disambiguation)
  { id: '', code: 'TB_01', text: '[PLACEHOLDER] Taking significant personal risk energizes rather than intimidates me.', type: 'likert', dimension: 'risk_tolerance', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 50, is_active: true },
  { id: '', code: 'TB_02', text: '[PLACEHOLDER] I am driven by a desire to have impact beyond my immediate responsibilities.', type: 'likert', dimension: 'achievement_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 51, is_active: true },
  { id: '', code: 'TB_03', text: '[PLACEHOLDER] I naturally gravitate toward taking charge in unstructured situations.', type: 'likert', dimension: 'leadership_drive', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 52, is_active: true },
  { id: '', code: 'TB_04', text: '[PLACEHOLDER] I prefer having wide latitude over how I approach my work.', type: 'likert', dimension: 'autonomy_need', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 53, is_active: true },
  { id: '', code: 'TB_05', text: '[PLACEHOLDER] I feel most motivated when my work connects to a mission I believe in.', type: 'likert', dimension: 'purpose_orientation', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 54, is_active: true },
  { id: '', code: 'TB_06', text: '[PLACEHOLDER] I think in terms of long-term trajectories more than immediate tasks.', type: 'likert', dimension: 'strategic_orientation', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 55, is_active: true },
  { id: '', code: 'TB_07', text: '[PLACEHOLDER] I can move people toward a shared goal without formal authority.', type: 'likert', dimension: 'social_influence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 56, is_active: true },
  { id: '', code: 'TB_08', text: '[PLACEHOLDER] I tend to approach conflict directly rather than avoiding it.', type: 'likert', dimension: 'conflict_navigation', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 57, is_active: true },
  { id: '', code: 'TB_09', text: '[PLACEHOLDER] I regularly bounce back from setbacks faster than most people I know.', type: 'likert', dimension: 'psychological_resilience', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 58, is_active: true },
  { id: '', code: 'TB_10', text: '[PLACEHOLDER] I see failure primarily as feedback rather than a verdict on my ability.', type: 'likert', dimension: 'growth_mindset', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 59, is_active: true },
```

> **After adding the above:** Run the Step 2 audit again (`node -e ...`) to confirm calibration count equals exactly 80. The expected arithmetic: 39 (existing) + 14 (new dims ×2) + 5 (openness/HH/EF/AC/ST boosters) + 12 (12-dim boosters above) + 10 (tiebreakers TB_01–TB_10) = **80**. If the count is off, the Step 2 audit output will show which dim still has only 1 calibration question — add a stub for it.

### Step 4: Run tests — expect pass

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test -- --testPathPattern=questions
```
Expected: All tests PASS (calibration count = 80, all new dims have ≥ 5/8 questions)

- [ ] If calibration count is off, run the audit node command and add/remove `calibration: true` flags until exactly 80.

### Step 5: Run full test suite

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test
```
Expected: All tests PASS

### Step 6: Commit

- [ ] Commit:
```bash
git add lib/questions.ts __tests__/questions.test.ts
git commit -m "feat: add stub questions for 7 new dimensions, reach calibrationCount=80"
```

---

## Task 5: Assessment Engine — New Confidence Gate

**Files:**
- Modify: `app/api/assessment/respond/route.ts:1-107`

> No new tests for this task (integration test requires Supabase). Verify via manual test after deploy. The structural change is isolated to the confidence gate and question selection logic.

### Step 1: Read current file state

- [ ] Read `app/api/assessment/respond/route.ts` to confirm current state (lines 1–107).

### Step 2: Update the respond route

- [ ] Replace lines 1–107 of `app/api/assessment/respond/route.ts`:

```ts
import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS } from '@/lib/questions'
import { ARCHETYPES } from '@/lib/archetypes'
import { computeScores } from '@/lib/scoring'
import { MAJOR_DIMS } from '@/lib/dimensions'
import type { Response as AssessmentResponse, DimensionScores, DimensionSlug } from '@/lib/types'

const calibrationCount = QUESTIONS.filter(q => q.calibration && q.is_active).length
const HARD_CAP = 132 // 80 calibration + 52 adaptive max

// Compute top-2 archetype composites from interim scores to assess confidence
function interimConfidence(scores: Partial<DimensionScores>): { topComposite: number; margin: number } {
  const full = { ...Object.fromEntries(QUESTIONS.map(q => [q.dimension, 50])), ...scores } as DimensionScores
  const composites = ARCHETYPES.map(a => {
    const totalWeight = a.signature.reduce((s, d) => s + d.weight, 0)
    const weighted = a.signature.reduce((s, d) => {
      const v = d.direction === 'high' ? full[d.dimension] : 100 - full[d.dimension]
      return s + v * d.weight
    }, 0)
    return weighted / totalWeight
  }).sort((a, b) => b - a)
  return { topComposite: composites[0], margin: composites[0] - composites[1] }
}

export async function POST(req: Request) {
  try {
    const { sessionToken, questionCode, value, responseTimeMs, revised } = await req.json()
    if (!sessionToken || !questionCode || value === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: assessment, error: aErr } = await supabase
      .from('assessments')
      .select('id, status')
      .eq('session_token', sessionToken)
      .eq('status', 'in_progress')
      .single()
    if (aErr || !assessment) return Response.json({ error: 'Invalid session' }, { status: 404 })

    const { error: uErr } = await supabase.from('responses').upsert({
      assessment_id: assessment.id,
      question_code: questionCode,
      value: JSON.stringify(value),
      response_time_ms: responseTimeMs ?? null,
      revised: revised ?? false,
    }, { onConflict: 'assessment_id,question_code' })
    if (uErr) throw uErr

    const { data: responses } = await supabase
      .from('responses')
      .select('question_code, value')
      .eq('assessment_id', assessment.id)
    const answeredCount = responses?.length ?? 0

    let nextQuestion = null

    if (answeredCount >= calibrationCount) {
      const answeredCodes = new Set(responses!.map(r => r.question_code))
      const answeredQuestions = QUESTIONS.filter(q => answeredCodes.has(q.code))
      const mappedResponses: AssessmentResponse[] = responses!.map(r => ({
        questionCode: r.question_code,
        value: JSON.parse(r.value),
        responseTimeMs: 0,
        revised: false,
        dimension: QUESTIONS.find(q => q.code === r.question_code)!.dimension,
      }))
      const scores = computeScores(mappedResponses, answeredQuestions)

      // New confidence gate
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

      const isConfident =
        topComposite >= 81 &&
        margin >= 10 &&
        ambiguousMajorCount <= 2 &&
        allMajorDimsCovered

      if (!isConfident && answeredCount < HARD_CAP) {
        // Ambiguous zone for question selection (40-60 range)
        const ambiguous = Object.entries(scores)
          .filter(([, s]) => s !== undefined && s >= 40 && s <= 60)
          .map(([dim]) => dim)

        // Priority 1: Unanswered ambiguous Major dims (score 40–60, < 5 answered)
        let nextQ = QUESTIONS.filter(q =>
          !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
          MAJOR_DIMS.has(q.dimension as DimensionSlug) &&
          ambiguous.includes(q.dimension) &&
          (answeredPerDim[q.dimension] ?? 0) < 5
        ).sort((a, b) => a.order_index - b.order_index)[0]

        // Priority 2: Major dims with < 3 answered (coverage floor)
        if (!nextQ) nextQ = QUESTIONS.filter(q =>
          !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
          MAJOR_DIMS.has(q.dimension as DimensionSlug) &&
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

        nextQuestion = nextQ ?? null
      }
    }

    const totalQuestions = nextQuestion === null && answeredCount >= calibrationCount
      ? answeredCount
      : Math.max(calibrationCount, answeredCount + (nextQuestion ? 1 : 0))

    return Response.json({
      nextQuestion,
      progress: { answered: answeredCount, total: Math.min(totalQuestions, HARD_CAP) },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
```

### Step 3: Verify build passes

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: No TypeScript errors

### Step 4: Commit

- [ ] Commit:
```bash
git add app/api/assessment/respond/route.ts
git commit -m "feat: raise confidence threshold to 81/10, add major dims coverage gate and hard cap 132"
```

---

## Task 6: Dual-Layer Radar Chart

**Files:**
- Replace: `components/charts/RadarChart.tsx`

### Step 1: Read current RadarChart.tsx

- [ ] Read `components/charts/RadarChart.tsx` to confirm current state.

### Step 2: Replace with dual-layer implementation

- [ ] Replace the entire content of `components/charts/RadarChart.tsx`:

```tsx
'use client'
import { useState, useEffect } from 'react'
import { RadarChart as RechartsRadar, Radar, PolarGrid, PolarAngleAxis,
         ResponsiveContainer, Tooltip } from 'recharts'
import { DIMENSIONS, MAJOR_DIMS } from '@/lib/dimensions'
import type { DimensionScores, DimensionSlug } from '@/lib/types'

interface CustomTickProps {
  x?: number
  y?: number
  payload?: { value: string }
  textAnchor?: string
}

// Ordered list of all 35 active dims (founder_potential excluded)
const RADAR_ORDER = DIMENSIONS.filter(d => d.slug !== 'founder_potential')

function CustomTick({ x = 0, y = 0, payload, textAnchor, isMobile = false }: CustomTickProps & { isMobile?: boolean }) {
  const label = payload?.value ?? ''
  const slug = RADAR_ORDER.find(d => d.shortLabel === label)?.slug
  const isMajor = slug ? MAJOR_DIMS.has(slug as DimensionSlug) : false

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
      majorScore: MAJOR_DIMS.has(dim.slug as DimensionSlug) ? score : 50,
      minorScore: !MAJOR_DIMS.has(dim.slug as DimensionSlug) ? score : 50,
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

### Step 3: Verify build

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: No TypeScript errors

### Step 4: Commit

- [ ] Commit:
```bash
git add components/charts/RadarChart.tsx
git commit -m "feat: dual-layer radar chart — Major (indigo) and Minor (teal) dimension layers"
```

---

## Task 7: ReportSection2 — Major-Only Superpowers + DIM_DESCRIPTIONS Migration

**Files:**
- Modify: `components/report/ReportSection2.tsx`

### Step 1: Read current ReportSection2.tsx

- [ ] Read `components/report/ReportSection2.tsx` lines 1–50 to confirm current `DIM_DESCRIPTIONS` shape and imports.

### Step 2: Update ReportSection2.tsx

Make three changes in one edit:
1. Replace local `DIM_DESCRIPTIONS` constant with import from `lib/dimensions.ts`
2. Filter superpowers/growth cards to Major dims only
3. Add M/S badge column to dimensions table

- [ ] Replace the imports block (lines 1–7) with:

```tsx
'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { DimensionRadarChart } from '@/components/charts/RadarChart'
import { getPercentile } from '@/lib/norms'
import { DIMENSIONS, MAJOR_DIMS } from '@/lib/dimensions'
import type { AssessmentResult, DimensionSlug } from '@/lib/types'
```

- [ ] Delete the entire `DIM_DESCRIPTIONS` constant (lines 9–39) and replace with a derived lookup that also preserves `founder_potential` (which is excluded from `DIMENSIONS` but may appear in `result.scores`):

```tsx
const DIM_DESCRIPTIONS: Record<string, string> = {
  ...Object.fromEntries(DIMENSIONS.map(d => [d.slug, d.description])),
  founder_potential: 'Composite readiness to build, lead, and sustain new ventures.',
}
```

- [ ] In the `ReportSection2` function, replace the `sorted` computation (currently `Object.entries(scores).filter(([k]) => k !== 'founder_potential').sort(...)`) with:

```tsx
const sorted = Object.entries(scores)
  .filter(([k]) => MAJOR_DIMS.has(k as DimensionSlug))
  .sort(([, a], [, b]) => b - a)
```

- [ ] In `DimCard`, add the major indicator dot before the label span. Locate the `<span className={...}>{label}</span>` inside DimCard and wrap it:

```tsx
<span className={`text-sm font-semibold ${isSuper ? 'text-teal-800' : 'text-slate-600'}`}>
  {MAJOR_DIMS.has(slug as DimensionSlug) && (
    <span className="w-1.5 h-1.5 rounded-full bg-indigo inline-block mr-1.5 align-middle flex-shrink-0" />
  )}
  {label}
</span>
```

- [ ] In `DimensionsTable`, add the Type column header after the Score header:

```tsx
<th className="hidden sm:table-cell px-4 py-3 text-center font-medium w-10">Type</th>
```

- [ ] In `DimensionsTable`, add the Type column cell after the Score cell:

```tsx
<td className="hidden sm:table-cell px-4 py-3 text-center">
  {MAJOR_DIMS.has(item.slug as DimensionSlug)
    ? <span className="text-[10px] font-semibold text-indigo bg-indigo/10 px-1.5 py-0.5 rounded-full">M</span>
    : <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">S</span>
  }
</td>
```

### Step 3: Verify build

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: No errors

### Step 4: Commit

- [ ] Commit:
```bash
git add components/report/ReportSection2.tsx
git commit -m "feat: ReportSection2 — Major-only superpowers, M/S badges, DIM_DESCRIPTIONS from registry"
```

---

## Task 8: ReportSection4 — Add EI and DM Cards

**Files:**
- Modify: `components/report/ReportSection4.tsx`

### Step 1: Read current ReportSection4.tsx

- [ ] Read `components/report/ReportSection4.tsx` to confirm `COG_DIMS`, `COG_LABELS`, `COG_DESCRIPTIONS`, `cogInsight` structure.

### Step 2: Add EI and DM to COG_DIMS

- [ ] Replace the `COG_DIMS` line (line 6) with:

```tsx
const COG_DIMS: DimensionSlug[] = ['cognitive_agility', 'executive_function', 'attention_control', 'systems_thinking', 'creative_intelligence', 'emotional_intelligence', 'decision_making']
```

### Step 3: Add EI and DM labels

- [ ] Add to `COG_LABELS` (inside the existing Record):

```ts
  emotional_intelligence: 'Emotional Intelligence',
  decision_making: 'Decision Making',
```

### Step 4: Add EI and DM descriptions

- [ ] Add to `COG_DESCRIPTIONS` (inside the existing Record):

```ts
  emotional_intelligence: 'Your ability to accurately read emotions in yourself and others and use that awareness to guide behavior. High scorers navigate interpersonal situations with precision — they detect tension early, adapt their approach in real time, and build trust consistently.',
  decision_making: 'Quality of judgment under uncertainty — how well you balance speed with accuracy, gather the right information without overloading, and commit to choices with appropriate confidence. High scorers make better calls faster with less second-guessing.',
```

### Step 5: Add cogInsight() cases for EI and DM

- [ ] Add two cases to `cogInsight()` before the `default:` case:

```ts
    case 'emotional_intelligence':
      return band === 'high'
        ? `At ${score} (${pStr}), your emotional intelligence is a genuine edge. You read rooms and people with accuracy, adapt your approach in real time, and build trust where others create friction. In leadership and collaboration contexts, this is compounding.`
        : band === 'mid'
        ? `Your emotional intelligence score of ${score} (${pStr}) is solid. You pick up on emotional cues when you're paying attention and can regulate your responses under moderate pressure. Developing more consistent awareness in high-stakes interactions will move this higher.`
        : `At ${score} (${pStr}), emotional intelligence is a development area. You may miss interpersonal signals that affect outcomes — not because you lack empathy, but because explicit attention to emotional dynamics isn't yet habitual. This is highly learnable with deliberate practice.`
    case 'decision_making':
      return band === 'high'
        ? `Your decision making score of ${score} (${pStr}) reflects strong judgment under uncertainty. You gather sufficient information, commit with appropriate confidence, and avoid the twin traps of analysis paralysis and premature closure. This is a rare and high-leverage capability.`
        : band === 'mid'
        ? `At ${score} (${pStr}), your decision making is functional but variable. You perform well in familiar domains where your models are calibrated. In novel or high-stakes situations, building explicit decision frameworks — even simple ones — will improve consistency.`
        : `Your decision making score of ${score} (${pStr}) suggests that judgment under uncertainty is a development priority. You may over-rely on incomplete information, avoid committing until certainty arrives, or reverse decisions under pressure. Deliberate exposure to low-stakes decision practice builds this capacity over time.`
```

### Step 6: Verify build

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: No errors

### Step 7: Commit

- [ ] Commit:
```bash
git add components/report/ReportSection4.tsx
git commit -m "feat: ReportSection4 — add Emotional Intelligence and Decision Making cards"
```

---

## Task 9: ReportSection5 — Add Execution Card

**Files:**
- Modify: `components/report/ReportSection5.tsx`

### Step 1: Read current ReportSection5.tsx

- [ ] Read `components/report/ReportSection5.tsx` lines 37–157 to confirm the JSX return structure.

### Step 2: Add execution insight constants

- [ ] Add the following constants after the existing `LOW_SIGNALS` block (before the `export function` line):

```tsx
const EXECUTION_INSIGHT = {
  high: 'Your execution score reflects a strong ability to translate intentions into completed outcomes. You follow through on commitments reliably, navigate ambiguity without losing momentum, and deliver results others can count on. This is among the most leveraged capabilities in any high-performance context.',
  mid: 'Your execution is solid in familiar territory. You deliver reliably when the path is clear and expectations are explicit. Where you can grow: strengthening your follow-through in ambiguous situations where the definition of done is yours to set.',
  low: 'Execution is a development priority. You may have strong ideas and good intentions that don\'t consistently convert into finished outcomes. Focus on reducing the gap between starting and completing by building explicit accountability structures into your workflow.',
}
```

### Step 3: Add execution card to JSX

- [ ] Find the closing `</div>` of the "What Drains You" section in `ReportSection5.tsx` (before the `{archetype.reward_ranking && ...}` block) and add the execution card after it:

```tsx
          {/* Execution — standalone Major dimension card */}
          {result.scores.execution !== undefined && (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-text">Execution</h3>
                <p className="text-xs text-slate-400 mt-0.5">How reliably you translate plans and intentions into completed outcomes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-text">Execution</span>
                  <span className="text-indigo font-bold text-sm">{result.scores.execution} · p{Math.round(getPercentile('execution', result.scores.execution))}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-indigo rounded-full" style={{ width: `${result.scores.execution}%` }} />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {result.scores.execution >= 75 ? EXECUTION_INSIGHT.high
                    : result.scores.execution >= 50 ? EXECUTION_INSIGHT.mid
                    : EXECUTION_INSIGHT.low}
                </p>
              </div>
            </div>
          )}
```

### Step 4: Add getPercentile import

- [ ] Check the imports at the top of `ReportSection5.tsx`. If `getPercentile` is not imported, add it:

```tsx
import { getPercentile } from '@/lib/norms'
```

### Step 5: Verify build

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: No errors

### Step 6: Commit

- [ ] Commit:
```bash
git add components/report/ReportSection5.tsx
git commit -m "feat: ReportSection5 — add standalone Execution dimension card"
```

---

## Task 10: ReportSection7 — Add Managing Others Card

**Files:**
- Modify: `components/report/ReportSection7.tsx`

### Step 1: Read current ReportSection7.tsx

- [ ] Read `components/report/ReportSection7.tsx` lines 78–108 to confirm the end of the leadership strengths/blind spots section.

### Step 2: Add managing_others insight constants

- [ ] Add after the `SOCIAL_STYLE_DESCRIPTIONS` block (before `export function ReportSection7`):

```tsx
const MANAGING_OTHERS_INSIGHT = {
  high: 'Your managing others score reflects a strong natural orientation toward leading and developing people. You hold others accountable without damaging relationships, adapt your style to the individual, and create environments where people grow. These are rare capabilities that compound over time.',
  mid: 'Your managing others score reflects real potential that is still developing. You can lead effectively in familiar contexts but may find high-stakes people situations — performance management, direct feedback, developing underperformers — less natural. Targeted practice in these areas will build this into a genuine strength.',
  low: 'Managing others is a development area. You may prefer contributing independently over directing others, or find accountability conversations uncomfortable to initiate. This is entirely learnable — most strong managers developed this deliberately rather than naturally.',
}
```

### Step 3: Add managing_others card to JSX

- [ ] Find the closing `</div>` of the leadership strengths/blind spots grid (the last `</div>` before the outer `</div>` closing the p-4/p-6/p-8 content area) and add the card after it:

```tsx
        {result.scores.managing_others !== undefined && (
          <div className="space-y-3">
            <h3 className="font-semibold text-text">Managing Others</h3>
            <div className="p-4 rounded-xl bg-white border border-slate-100 hover:-translate-y-1 transition-transform duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm text-text">Managing Others</span>
                <span className="text-indigo font-bold text-sm">{result.scores.managing_others} · p{Math.round(getPercentile('managing_others', result.scores.managing_others))}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-indigo rounded-full" style={{ width: `${result.scores.managing_others}%` }} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {result.scores.managing_others >= 75 ? MANAGING_OTHERS_INSIGHT.high
                  : result.scores.managing_others >= 50 ? MANAGING_OTHERS_INSIGHT.mid
                  : MANAGING_OTHERS_INSIGHT.low}
              </p>
            </div>
          </div>
        )}
```

### Step 4: Add getPercentile import

- [ ] Check the imports of `ReportSection7.tsx`. If `getPercentile` is not imported, add it:

```tsx
import { getPercentile } from '@/lib/norms'
```

### Step 5: Verify build

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: No errors

### Step 6: Run full test suite

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm test
```
Expected: All tests PASS

### Step 7: Final build verification

- [ ] Run:
```bash
export PATH="/c/Program Files/nodejs:$PATH" && npm run build
```
Expected: Build succeeds, 0 TypeScript errors, 0 ESLint errors

### Step 8: Commit

- [ ] Commit:
```bash
git add components/report/ReportSection7.tsx
git commit -m "feat: ReportSection7 — add Managing Others dimension card to Leadership Profile"
```

---

## Post-Implementation Checklist

- [ ] `QUESTIONS.filter(q => q.calibration && q.is_active).length === 80` ✓
- [ ] `DIMENSIONS.length === 35`, `MAJOR_DIMS.size === 20`, `MINOR_DIMS.size === 15` ✓
- [ ] `lib/types.ts` DimensionSlug union has 36 entries ✓
- [ ] All 7 new dimensions have norm entries in `lib/norms.ts` ✓
- [ ] Radar renders 35-axis dual-layer chart ✓
- [ ] Superpowers/Growth cards source from Major dims only ✓
- [ ] M/S badges appear in expanded dimensions table ✓
- [ ] EI + DM appear as cards in Section 4 ✓
- [ ] Execution card appears in Section 5 ✓
- [ ] Managing Others card appears in Section 7 ✓
- [ ] `npm run build` passes 0 TypeScript + ESLint errors ✓
- [ ] `npm test` — all tests pass ✓

## Content Debt (separate workstream)

All questions added in Task 4 with `[PLACEHOLDER]` prefix must be replaced with quality content before launch:
- 8 questions × 4 new Major dims = 32 placeholder questions
- 5 questions × 3 new Minor dims = 15 placeholder questions
- 15 calibration booster/tiebreaker questions
- Additionally: 6 extra questions per 16 existing Major dims (+96) and 3 per 12 existing Minor dims (+36) for full question bank coverage — not required for the MVP of this feature but should be tracked
