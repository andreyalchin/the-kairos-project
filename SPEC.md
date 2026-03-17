# Kairos — Human Potential Intelligence Platform
## Design Specification · 2026-03-12

---

## 1. Project Overview

**Kairos** is a venture-scale Human Potential Intelligence Platform that measures personality, cognition, motivation, and career trajectory through a scientifically grounded adaptive assessment. It targets three audiences simultaneously: individual users (public launch), enterprise hiring teams (B2B), and investors (demo-ready).

**Tagline:** Know your moment.

**North Star:** Outcompete 16Personalities, Gallup CliftonStrengths, Plum, Aptitude Index, and TraitLab on scientific credibility, predictive power, and report depth.

**2-day build target:** Production-quality MVP. See Section 15 for explicit Stub vs Full scope.

**Pre-authored assets:** The 82 assessment questions and the full content blocks for 3 archetypes (Strategic Visionary, Empathetic Leader, Systematic Builder) are authored as part of this spec and provided to the developer as data files — they are not written during the build. See Section 5 (question bank) and Section 14 (archetype content).

---

## 2. Brand

| Element | Value |
|---------|-------|
| Name | Kairos |
| Tagline | Know your moment. |
| Voice | Scientific authority meets human warmth. Direct, empowering, precise. |
| Aesthetic | Light-first, glassmorphism cards, premium SaaS (Apple × Linear × Vercel) |

### Color Palette (WCAG AA compliant)

| Role | Name | Hex | Contrast on BG |
|------|------|-----|----------------|
| Primary | Deep Indigo | `#3730A3` | 10:1 AAA |
| Secondary | Teal | `#0F766E` | 7.1:1 AAA |
| Accent | Electric Blue | `#2563EB` | 5.9:1 AA |
| Background | Off-White | `#F8FAFC` | — |
| Text | Charcoal | `#1E293B` | 13.5:1 AAA |

### Typography
- **Display + UI:** Geist — loaded via `next/font/local` using the woff2 files in `app/fonts/`
- **Data + scores:** Geist Mono — same loading strategy
- **Scale:** 4xl hero → 3xl section → 2xl subsection → base body

### Tailwind Configuration
Custom theme values in `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      indigo: { DEFAULT: '#3730A3', ... },
      teal: { DEFAULT: '#0F766E', ... },
      blue: { DEFAULT: '#2563EB', ... },
      bg: '#F8FAFC',
      text: '#1E293B',
    },
    fontFamily: {
      sans: ['var(--font-geist)', ...defaultTheme.fontFamily.sans],
      mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
    },
  }
}
```
Glassmorphism utility class: `glass` = `bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm`

---

## 3. Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Auth + DB | Supabase (PostgreSQL + Auth + RLS) |
| Supabase client | `@supabase/ssr` |
| Icons | Lucide React |
| Deployment | Vercel |

**Auth system: Supabase Auth only.** No NextAuth. Supabase Auth handles email/password and Google OAuth natively. Sessions are managed via `@supabase/ssr` cookie-based sessions.

### Project Structure

```
kairos/
├── middleware.ts                 # REQUIRED: Supabase SSR session refresh + rate limiting
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing page
│   │   ├── science/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── enterprise/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/
│   │   ├── dashboard/page.tsx
│   │   └── profile/page.tsx
│   ├── assessment/page.tsx
│   ├── results/[id]/page.tsx
│   ├── admin/page.tsx            # Stubbed
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── assessment/
│       │   ├── start/route.ts
│       │   ├── respond/route.ts
│       │   └── complete/route.ts
│       └── results/[id]/route.ts
├── components/
│   ├── layout/                   # Header, Footer, LayoutShell
│   ├── assessment/               # QuestionCard, ProgressBar, ProcessingScreen
│   │   └── question-types/       # Likert, ForcedChoice, Situational, etc.
│   ├── report/                   # ReportSection1 through ReportSection11
│   ├── charts/                   # RadarChart, GaugeChart, BarChart
│   └── ui/                       # Button, Card, Badge, Modal, Overlay
├── lib/
│   ├── scoring.ts                # Dimension scoring engine
│   ├── archetypes.ts             # 32 archetype definitions + assignment algorithm
│   ├── questions.ts              # 82 questions as TypeScript array (source of truth)
│   ├── inference.ts              # Behavioral inference modifiers
│   ├── norms.ts                  # Normative percentile lookup tables
│   ├── hpif.ts                   # HPIF 6-layer computation
│   ├── types.ts                  # All TypeScript types
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       └── server.ts             # Server Supabase client (SSR)
└── supabase/
    └── migrations/
        ├── 001_schema.sql        # All table definitions
        └── 002_seed_questions.sql # Questions seeded from lib/questions.ts via script
```

### middleware.ts (REQUIRED)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// MVP rate limit store — resets on Edge cold start; replace with Vercel KV post-MVP
const rateLimitStore = new Map<string, { ts: number; count: number }>()

export async function middleware(request: NextRequest) {
  // 1. Supabase SSR session refresh (required — prevents silent logout after JWT expiry)
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )
  await supabase.auth.getUser() // refreshes session cookie

  // 2. Rate limiting: /api/assessment/start — max 5 per IP per hour
  // MVP: header-check stub — block only if the route is /api/assessment/start
  if (request.nextUrl.pathname === '/api/assessment/start') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    // In-memory Map is reset per Edge cold start — acceptable for MVP.
    // Replace with Vercel KV post-MVP for persistent rate limiting.
    const key = `rl:${ip}`
    const now = Date.now()
    const window = 60 * 60 * 1000 // 1 hour
    const entry = rateLimitStore.get(key)
    if (entry && entry.count >= 5 && now - entry.ts < window) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
    rateLimitStore.set(key, entry && now - entry.ts < window
      ? { ts: entry.ts, count: entry.count + 1 }
      : { ts: now, count: 1 })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Data Flow

1. User arrives at `/` → clicks "Take the Free Assessment"
2. Browser calls `POST /api/assessment/start` → server generates `session_token = crypto.randomUUID()`, creates `assessments` row → returns `{ assessmentId, sessionToken, questions: Question[] }` (first 40 calibration questions)
3. `sessionToken` stored in `localStorage` under key `kairos_session`
4. User answers questions; each answer calls `POST /api/assessment/respond` with `{ sessionToken, questionCode, value, responseTimeMs, revised }`
5. After 40 questions: respond endpoint returns interim scores + next targeted question (or null if all dimensions are confident)
6. On final answer: browser calls `POST /api/assessment/complete` with `{ sessionToken }` → server runs scoring → writes `results` row → returns `{ resultId }`
7. Browser navigates to `/results/[resultId]`
8. Results page SSR: fetches results via service role client → renders Sections 1–11
9. Auth gate overlay appears when the Section 2 component's bottom edge scrolls out of the viewport (IntersectionObserver on a sentinel element at the bottom of Section 2)
10. User signs up → `signUp()` → server action `claimAssessment(sessionToken, userId)` sets `assessments.user_id` → overlay unmounts via Framer Motion exit
11. Returning users: Supabase session cookie restores access; `/dashboard` lists their results

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-side only, never exposed to client
```

---

## 4. Database Schema

```sql
-- 001_schema.sql

CREATE TABLE profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name    text,
  role         text,
  linkedin_url text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE assessments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users(id),  -- NULL until sign-up
  session_token  text NOT NULL UNIQUE,
  status         text DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  started_at     timestamptz DEFAULT now(),
  completed_at   timestamptz
);

CREATE TABLE questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,  -- stable slug e.g. 'O_01', 'CA_03'
  text           text NOT NULL,
  type           text NOT NULL CHECK (type IN (
                   'likert','forced_choice','situational',
                   'frequency','rank_order','allocation','visual','timed'
                 )),
  dimension      text NOT NULL,         -- target dimension slug (always one per question)
  tier           integer NOT NULL CHECK (tier BETWEEN 1 AND 6),
  options        jsonb NOT NULL,
  weight         float DEFAULT 1.0,
  reverse_scored boolean DEFAULT false,
  calibration    boolean DEFAULT false, -- true = included in first 40
  order_index    integer,
  is_active      boolean DEFAULT true
);
CREATE INDEX questions_dimension_idx ON questions(dimension);
CREATE INDEX questions_calibration_idx ON questions(calibration);

-- Construct pair table: links two question codes that measure the same construct
-- Used by inference engine to detect inconsistency
CREATE TABLE question_construct_pairs (
  question_a text REFERENCES questions(code),
  question_b text REFERENCES questions(code),
  PRIMARY KEY (question_a, question_b)
);

CREATE TABLE responses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id    uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_code    text REFERENCES questions(code),
  value            jsonb NOT NULL,
  response_time_ms integer,
  revised          boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  UNIQUE(assessment_id, question_code)
);

CREATE TABLE results (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  uuid REFERENCES assessments(id) UNIQUE,
  scores         jsonb NOT NULL,       -- { openness: 78, conscientiousness: 82, ... }
  hpif_profile   jsonb NOT NULL,       -- see Section 7
  archetype      text NOT NULL,        -- slug e.g. 'strategic_visionary'
  match_score    integer NOT NULL,     -- 0-100, winning archetype composite score (see Section 6)
  inference_data jsonb,                -- { avg_response_ms, revision_rate, consistency_score }
  created_at     timestamptz DEFAULT now()
);
-- No direct user_id on results — identity flows through assessments.user_id
-- RLS: join through assessments to get user_id

-- RLS Policies

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own" ON assessments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role all" ON assessments
  USING (auth.role() = 'service_role');

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own responses" ON responses
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "service role all" ON responses
  USING (auth.role() = 'service_role');

ALTER TABLE results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own results" ON results
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "service role all" ON results
  USING (auth.role() = 'service_role');

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON questions FOR SELECT USING (true);

ALTER TABLE question_construct_pairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role all" ON question_construct_pairs
  USING (auth.role() = 'service_role');
-- Pairs are only ever read server-side via service role; anon key has no access.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own" ON profiles FOR UPDATE USING (auth.uid() = user_id);
```

**Anonymous write strategy:** All writes during anonymous assessment use the **service role key on the server** (route handlers only — never in browser code). The `session_token` in the request body is the lookup key for anonymous rows.

**Question seeding:** `lib/questions.ts` is the source of truth (TypeScript array). A seed script (`scripts/seed-questions.ts`) reads from it and upserts into the `questions` table via the service role client. Run once per environment setup.

### questions.options JSON schema by type

```jsonc
// likert / frequency — always exactly 5 options
{ "labels": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] }

// forced_choice — exactly 2 options, ALWAYS scoring only the question's single dimension
// 'a' maps to value 1 (low end), 'b' maps to value 5 (high end)
{ "a": "I prefer detailed plans", "b": "I prefer open-ended exploration" }
// Note: forced_choice questions always have one dimension. Option A = low score,
// option B = high score for that dimension. Reverse-scored flag applies normally.

// situational / timed — options pre-scored 1, 2.3, 3.7, 5 in order
{ "scenario": "...", "choices": ["A: ...", "B: ...", "C: ...", "D: ..."],
  "scores": [1, 2.3, 3.7, 5] }

// rank_order — ALWAYS exactly 4 items
{ "items": ["Autonomy", "Recognition", "Stability", "Impact"],
  "target_item_index": 0 }
// Only the target item's rank is scored. rank 1=5, 2=3.7, 3=2.3, 4=1.

// allocation — target_item_index indicates which item maps to this dimension
{ "items": ["Learning", "Earning", "Influence", "Security"], "total": 100,
  "target_item_index": 0 }
// value stored = integer 0–100 (points allocated to target item)
// Scoring: (value / 100) × 5

// visual — 4 SVG image options in public/assessment/images/
{ "images": ["abstract_a.svg", "abstract_b.svg", "abstract_c.svg", "abstract_d.svg"],
  "scores": [5, 1, 3, 2] }
// scores array maps image index → dimension value (1–5), defined per question

// construct_pair — mark in question_construct_pairs table, not in options
```

---

## 5. Assessment Design

### 29 Dimensions across 6 Tiers

**Tier 1 — Core Personality (Big Five + HEXACO)**
1. `openness` — Openness to Experience
2. `conscientiousness` — Conscientiousness
3. `extraversion` — Extraversion
4. `agreeableness` — Agreeableness
5. `emotional_stability` — Emotional Stability
6. `honesty_humility` — Honesty-Humility (HEXACO)

**Tier 2 — Cognitive Architecture**
7. `cognitive_agility` — Pattern recognition, abstract reasoning
8. `executive_function` — Working memory, cognitive control
9. `attention_control` — Focus depth, distraction resistance
10. `systems_thinking` — Complexity navigation, holistic reasoning
11. `creative_intelligence` — Divergent thinking, novel connection-making

**Tier 3 — Motivational DNA**
12. `achievement_drive` — Mastery vs performance orientation
13. `risk_tolerance` — Behavioral economics framework
14. `autonomy_need` — Self-Determination Theory
15. `purpose_orientation` — Intrinsic vs extrinsic motivation
16. `competitive_drive` — Social comparison motivation

**Tier 4 — Behavioral Expression**
17. `social_influence` — Persuasion style, leadership presence
18. `conflict_navigation` — Assertive ↔ accommodating spectrum
19. `communication_style` — Analytical ↔ expressive continuum (scalar 0–100; 0=analytical, 100=expressive)
20. `collaboration_signature` — Independent ↔ interdependent continuum

Note: `communication_style` is a scalar (0–100 continuum from Analytical to Expressive). The display label is computed in the report layer:
- 0–25: "Analytical"
- 26–50: "Driver"
- 51–75: "Amiable"
- 76–100: "Expressive"

**Tier 5 — Leadership & Career Potential**
21. `leadership_drive` — Vision, initiative, influence orientation
22. `founder_potential` — Composite: risk + creativity + resilience + drive (see Section 7)
23. `strategic_orientation` — Long-term vision vs tactical execution
24. `specialist_generalist` — 0=pure specialist, 100=pure generalist (consistent key throughout)
25. `innovation_index` — Disruption tolerance + creative risk appetite

**Tier 6 — Resilience & Growth**
26. `psychological_resilience` — Recovery from failure
27. `growth_mindset` — Fixed vs growth (Dweck)
28. `adaptability_quotient` — Response to change
29. `learning_agility` — New domain acquisition speed

### Question Bank: 82 questions

| Type | Count | MVP status |
|------|-------|-----------|
| Likert (1–5) | 25 | Full |
| Forced Choice | 15 | Full |
| Situational Judgment | 10 | Full |
| Behavioral Frequency | 10 | Full |
| Rank Order | 8 | Full (always 4 items each) |
| Resource Allocation | 6 | Full |
| Visual/Abstract | 4 | Stub (static SVGs, heuristic scores) |
| Timed Scenario | 4 | Full |
| **Total** | **82** | |

**Calibration set:** Exactly 40 questions marked `calibration = true`. Distribution: 1–2 per dimension. Every dimension has at least 1 calibration question. The 40 calibration questions are the question bank entries with the lowest `order_index` values per dimension (i.e., the first question for each dimension by order is always a calibration question).

**Construct pairs:** Pairs of questions that measure the same construct from different angles, used by the inference engine to detect inconsistency. Each pair is a row in `question_construct_pairs`. For example, `O_01` ("I enjoy exploring abstract ideas") and `O_07` ("I prefer concrete, practical tasks" — reverse scored) form a pair for the `openness` dimension. All 82 questions participate in at most one construct pair.

**Visual question UI:** 4 questions, each showing 4 abstract SVG images in a 2×2 grid. User taps/clicks to select. Images live in `public/assessment/images/visual_q{1-4}_{a-d}.svg`. Interaction: selected image gets indigo border ring. Submitted on selection (no confirm button).

### Adaptive Engine (Simplified IRT)

1. **Phase 1:** Serve all 40 `calibration = true` questions in `order_index` order (shuffled within tier)
2. **Interim scoring:** After phase 1, compute raw dimension scores
3. **Ambiguous zone:** Dimensions with score in [35, 65] are flagged for expansion
4. **Targeted expansion:** For each flagged dimension, add up to 3 non-calibration questions (from the remaining 42) ordered by `order_index`
5. **Termination:** Stop when no dimension is in [35, 65] OR all 82 questions served
6. **Average result:** ~55 questions, ~12 minutes

### Scoring Formula

**Per response:**
```typescript
// value: raw integer from response (1-5 for likert/frequency, pre-mapped for others)
const normalizedValue = question.reverse_scored ? (6 - rawValue) : rawValue
const weightedValue = normalizedValue * question.weight
```

**Dimension score (0–100):**
```typescript
const rawScore = sum(responses_for_dimension.map(r => r.weightedValue))
const maxPossible = sum(responses_for_dimension.map(r => 5 * r.question.weight))
const dimensionScore = (rawScore / maxPossible) * 100
```

**Type-specific raw value extraction:**
- `likert` / `frequency`: `value` = integer 1–5 directly
- `forced_choice`: `value` = 1 (chose A) or 5 (chose B)
- `situational` / `timed`: `value` = index 0–3; mapped via `options.scores[index]`
- `rank_order`: `value` = rank assigned to `target_item_index`; mapped: rank1→5, rank2→3.7, rank3→2.3, rank4→1
- `allocation`: `value` = integer 0–100 (points on target item); mapped: `value / 100 * 5`
- `visual`: `value` = index 0–3; mapped via `options.scores[index]`

### Behavioral Inference (lib/inference.ts)

```typescript
interface InferenceInput {
  responses: Array<{
    questionCode: string
    value: number           // normalized 1-5
    responseTimeMs: number
    revised: boolean
    dimension: string
  }>
  constructPairs: Array<{ questionA: string; questionB: string }>
}

interface InferenceOutput {
  avgResponseMs: number
  revisionRate: number       // 0-1
  consistencyScore: number   // 0-1 (1 = perfectly consistent)
  speedModifier: number      // applied to all dimension scores (-2 to +2)
  consistencyPenalty: number // applied to inconsistent dimensions (0 or -5)
}

function computeInference(input: InferenceInput): InferenceOutput
```

**Inconsistency detection:** For each construct pair (A, B), both questions measure the same dimension. Normalize both responses to 0–1 range. If `|normalizedA - normalizedB| > 0.6`, the pair is inconsistent. `inconsistencyRate = inconsistentPairs / totalPairs`.

**Modifiers:**
```typescript
consistencyPenalty = inconsistencyRate > 0.3 ? -5 : 0
speedModifier = medianResponseMs < 800 ? +2 : medianResponseMs > 8000 ? -2 : 0
finalScore = clamp(dimensionScore + consistencyPenalty + speedModifier, 0, 100)
```

---

## 6. Archetype Assignment Algorithm

```typescript
interface ArchetypeDimensionWeight {
  dimension: keyof DimensionScores
  weight: number
  direction: 'high' | 'low'
}

interface ArchetypeDefinition {
  slug: string
  name: string
  signature: ArchetypeDimensionWeight[]
  // ... content fields
}

function assignArchetype(scores: DimensionScores, archetypes: ArchetypeDefinition[]) {
  const composites = archetypes.map(archetype => {
    const totalWeight = archetype.signature.reduce((s, d) => s + d.weight, 0)
    const weightedScore = archetype.signature.reduce((s, d) => {
      const score = d.direction === 'high' ? scores[d.dimension] : 100 - scores[d.dimension]
      return s + score * d.weight
    }, 0)
    const composite = weightedScore / totalWeight // 0-100
    return { slug: archetype.slug, composite }
  })

  composites.sort((a, b) => b.composite - a.composite)
  const winner = composites[0]
  const runnerUp = composites[1]

  // Tie-break: if within 2 points, pick the one whose first signature dimension
  // with direction:'high' has the higher raw score in the user's scores.
  const resolvedSlug = (winner.composite - runnerUp.composite < 2)
    ? resolveByPrimaryDimension(winner.slug, runnerUp.slug, scores, archetypes)
    : winner.slug

  return {
    archetype: resolvedSlug,
    matchScore: Math.round(winner.composite), // 0-100, stored in results.match_score
  }
}

function resolveByPrimaryDimension(
  slugA: string, slugB: string,
  scores: DimensionScores,
  archetypes: ArchetypeDefinition[]
): string {
  const getPrimaryScore = (slug: string) => {
    const def = archetypes.find(a => a.slug === slug)!
    const primary = def.signature.find(d => d.direction === 'high')
    return primary ? scores[primary.dimension] : 0
  }
  return getPrimaryScore(slugA) >= getPrimaryScore(slugB) ? slugA : slugB
}
```

**Match confidence score:** `matchScore` is the raw composite score of the winning archetype (0–100). Displayed in the UI as e.g. "87% match." No additional transformation.

---

## 7. HPIF Profile JSON Schema & Computation

All 6 layers are computed in `lib/hpif.ts` and written to `results.hpif_profile`.

**Layer composite formula:** Unweighted average of constituent dimension scores.
```typescript
const composite = mean(constituentDimensions.map(d => scores[d]))
```

**`founder_potential`** is not a raw dimension — it is a composite computed from:
`mean([risk_tolerance, creative_intelligence, psychological_resilience, achievement_drive])`.
It is computed before archetype assignment and stored in `scores` alongside the other 28 raw dimensions.

```typescript
interface HpifProfile {
  cognitive_operating_system: {
    primary_style: string  // computed: score >= 70 = "Analytical-Convergent", 40-69 = "Balanced", < 40 = "Intuitive-Divergent"
    description: string    // 1 sentence template: "You process information through {style}, prioritizing {strength}."
    scores: Pick<DimensionScores, 'cognitive_agility' | 'executive_function' | 'attention_control'>
    composite: number
  }
  motivational_architecture: {
    primary_driver: string  // dimension with highest score among the 4 constituents: label from MOTIVATION_LABELS map
    secondary_driver: string
    description: string
    scores: Pick<DimensionScores, 'achievement_drive' | 'purpose_orientation' | 'autonomy_need' | 'competitive_drive'>
    composite: number
  }
  behavioral_expression: {
    social_style: string   // derived from communication_style scalar: "Analytical" | "Driver" | "Amiable" | "Expressive"
    description: string
    scores: Pick<DimensionScores, 'extraversion' | 'agreeableness' | 'conflict_navigation' | 'communication_style'>
    composite: number
  }
  growth_vector: {
    trajectory: string   // composite >= 70: "Accelerating", 40-69: "Steady", < 40: "Developing"
    ceiling: string      // composite >= 70: "High", 40-69: "Moderate — with targeted development", < 40: "Significant growth opportunity"
    scores: Pick<DimensionScores, 'growth_mindset' | 'adaptability_quotient' | 'learning_agility' | 'psychological_resilience'>
    composite: number
  }
  career_potential_matrix: {
    leadership_score: number      // = leadership_drive score
    founder_score: number         // = founder_potential composite
    strategic_vs_tactical: number // = strategic_orientation score (0=tactical, 100=strategic)
    specialist_vs_generalist: number // = specialist_generalist score (0=specialist, 100=generalist)
    leadership_tier: 'Emerging' | 'Rising' | 'Established' | 'Visionary'
    // tier thresholds: <40 Emerging, 40-59 Rising, 60-79 Established, 80+ Visionary
    founder_tier: 'Operator' | 'Builder' | 'Founder' | 'Serial Founder'
    // tier thresholds: <40 Operator, 40-59 Builder, 60-79 Founder, 80+ Serial Founder
  }
  team_compatibility: {
    team_role: 'Architect' | 'Catalyst' | 'Executor' | 'Harmonizer' | 'Challenger' | 'Navigator'
    // role assignment: highest composite among tier-based groupings:
    // Architect: systems_thinking + strategic_orientation
    // Catalyst: creative_intelligence + innovation_index
    // Executor: conscientiousness + achievement_drive
    // Harmonizer: agreeableness + collaboration_signature
    // Challenger: conflict_navigation + competitive_drive
    // Navigator: cognitive_agility + leadership_drive
    collaboration_style: string   // template string from team_role
    remote_orientation: 'Remote-first' | 'Hybrid' | 'In-person'
    // autonomy_need >= 70: Remote-first; 40-69: Hybrid; < 40: In-person
    team_size_preference: 'Solo' | 'Small (2-8)' | 'Mid (9-30)' | 'Large (30+)'
    // autonomy_need + collaboration_signature combined scoring
    best_partners: string[]       // top 3 archetype slugs — from archetype definition, NOT stored in DB
    growth_partners: string[]     // from archetype definition
    friction_archetypes: string[] // from archetype definition
  }
}
```

**Team compatibility content (best_partners, growth_partners, friction_archetypes):** These are static properties of each `ArchetypeDefinition` in `lib/archetypes.ts`. They are NOT stored in the `results.hpif_profile` DB column. They are fetched at report render time from the archetype definition matching `results.archetype`. This avoids denormalization.

---

## 8. Normative Percentile Lookup (lib/norms.ts)

```typescript
// Structure: dimension → sorted array of { score, percentile } breakpoints
// Interpolate linearly between breakpoints
type NormTable = Record<string, Array<{ score: number; percentile: number }>>

const NORMS: NormTable = {
  openness: [
    { score: 0, percentile: 1 },
    { score: 30, percentile: 10 },
    { score: 45, percentile: 25 },
    { score: 55, percentile: 50 },
    { score: 65, percentile: 75 },
    { score: 75, percentile: 90 },
    { score: 100, percentile: 99 },
  ],
  // ... one entry per dimension
}

export function getPercentile(dimension: string, score: number): number
// Linear interpolation between nearest breakpoints
```

Source: Published Big Five and HEXACO normative research literature (general adult population). Not computed from user base.

---

## 9. Full Report Structure (11 Sections)

All sections adapt to the user's archetype: color accent, illustration, language, icons.

### Auth Gate Implementation

The auth gate is triggered when the **bottom of Section 2** scrolls out of the viewport. Implementation:

```tsx
// At the bottom of the Section 2 component:
<div ref={sentinelRef} id="section-2-sentinel" />

// IntersectionObserver watches the sentinel
// When sentinel leaves viewport (scrolled past): show gate overlay
// Gate is a fixed full-screen div with backdrop-blur-md bg-white/60
// Gate unmounts via Framer Motion AnimatePresence exit animation on auth success
// Sections 3–11 are always rendered in the DOM (not conditionally)
// A CSS filter (blur + pointer-events: none) is applied to sections 3–11 while gate is active
// On auth success: CSS filter removed with a transition, gate div exits
```

### Section 1 — Archetype Hero
- Full-width hero card with archetype illustration (`/public/archetypes/{slug}.svg`)
- Archetype name + subtitle + 3-word signature
- Match confidence score (from `results.matchScore` — see Section 6)
- 3 defining trait badges
- Archetype-resonant quote (hardcoded in `lib/archetypes.ts`)
- Rarity stat — hardcoded per archetype in `lib/archetypes.ts`

### Section 2 — Psychological Fingerprint
- Recharts `RadarChart` of all 29 dimensions grouped by tier (6 groups)
- Score (0–100) + percentile per dimension (from `lib/norms.ts`)
- Highlighted superpowers (top 3 dimension scores) + blind spots (bottom 2)
- **Auth gate sentinel at bottom of this section**

### Section 3 — Deep Archetype Profile *(post-auth)*
- Who You Are, How You Think, What Drives You, How You Show Up, Your Shadow Side — hardcoded prose per archetype in `lib/archetypes.ts`
- Famous Examples (4–5) — hardcoded per archetype
- Archetype Rarity — hardcoded per archetype

### Section 4 — Cognitive Profile
- 5 dimension score cards: icon + animated arc gauge + percentile + insight string
- Insights are template strings with `{score}` and `{percentile}` interpolation
- Templates defined per dimension in `lib/archetypes.ts` (shared across archetypes — not archetype-specific)

### Section 5 — Motivational Architecture
- Top 5 drivers: dimensions with highest scores from Tier 3, labeled via `MOTIVATION_LABELS`
- Bottom 5 drains: lowest Tier 3 scores
- Ideal work conditions, reward ranking, warning signals — hardcoded per archetype

### Section 6 — Career Intelligence
- Primary verticals (3) + secondary verticals (4) — hardcoded per archetype
- Career environment scores — hardcoded per archetype
- Dream Roles (3) — hardcoded per archetype
- Career trajectory — hardcoded per archetype

### Section 7 — Leadership Profile
- From `hpif_profile.career_potential_matrix.leadership_score` + `leadership_tier`
- Leadership style, strengths, blind spots, development path — hardcoded per archetype

### Section 8 — Team Intelligence
- `team_role` from `hpif_profile.team_compatibility`
- `best_partners`, `growth_partners`, `friction_archetypes` — from `lib/archetypes.ts` at render time
- `remote_orientation`, `team_size_preference` — computed from scores

### Section 9 — Founder & Entrepreneur Profile
- `founder_score` + `founder_tier` from `hpif_profile.career_potential_matrix`
- Founder style, co-founder archetypes — hardcoded per archetype

### Section 10 — Work Environment Match
- 7 environment cards computed from dimension scores (formulas in `hpif.ts`)

### Section 11 — Growth Roadmap
- Top 3 development areas: lowest 3 dimension scores, with per-dimension content from `lib/archetypes.ts`
- 90-Day Challenge, 1-Year Vision, resources, skills — hardcoded per archetype

### Processing Screen
- Shown for **minimum 2 seconds**, dismissed when `POST /api/assessment/complete` resolves (whichever is later)
- CSS keyframe animation: 3 concentric rings in indigo/teal, pulsing outward
- Copy: "Kairos is mapping your potential…" (animated ellipsis)
- No external animation library required (pure CSS)

---

## 10. API Routes

### `POST /api/assessment/start`
```typescript
// Body: none
// Auth: none (service role key used server-side)
// Returns: { assessmentId: string, sessionToken: string, questions: Question[] }
// Creates assessments row, returns 40 calibration questions shuffled within tiers
```

### `POST /api/assessment/respond`
```typescript
// Body: { sessionToken: string, questionCode: string, value: JsonValue,
//          responseTimeMs: number, revised: boolean }
// Auth: validated by session_token match to an in-progress assessment
// Returns: { nextQuestion: Question | null, progress: { answered: number, total: number } }
// Logic: upsert response; after 40 responses, run interim scoring;
//        return next targeted question from ambiguous dimensions, or null if done
```

### `POST /api/assessment/complete`
```typescript
// Body: { sessionToken: string }
// Auth: session_token match
// Validates: all 29 dimensions have >= 1 response
// Runs: computeScores() → computeInference() → computeHpif() → assignArchetype()
// Writes: results row
// Updates: assessments.status = 'completed', assessments.completed_at = now()
// Returns: { resultId: string }
```

### `GET /api/results/[id]`
```typescript
// Auth: none — results are public by UUID (not sensitive; UUID is effectively a secret)
// Uses service role client to bypass RLS for this public endpoint
// Returns: full results row + archetype content from lib/archetypes.ts
// Cache: { cache: 'force-cache' } — results are immutable once written
```

### Server Action: `claimAssessment`
```typescript
// app/(auth)/signup/actions.ts
// Called after successful Supabase signUp()
// Reads sessionToken from form data
// Updates: assessments SET user_id = newUserId WHERE session_token = sessionToken
//          AND user_id IS NULL (prevent claiming someone else's assessment)
```

---

## 11. Pages

### Landing Page (`/`)
1. Hero — headline, subhead, CTA "Take the Free Assessment" (indigo), secondary "See a sample report" → `/results/[demo-id]` (pre-seeded demo result), CSS mesh gradient
2. Social proof bar — hardcoded: "10,000+ assessments · 32 archetypes · Built on Big Five + HEXACO"
3. How It Works — 3 steps, Lucide icons
4. Archetype Showcase — horizontal scroll of 6 archetype cards
5. Science Section — 4 pillars
6. Report Preview — static mockup image of results dashboard
7. For Companies teaser
8. Pricing preview — all 5 tiers (condensed)
9. Final CTA

### Assessment (`/assessment`)
- Intro screen + progress bar + question cards + processing screen
- All 8 question type UIs in `components/assessment/question-types/`
- Framer Motion `AnimatePresence` on question cards (slide right→left)

### Results (`/results/[id]`)
- SSR via `GET /api/results/[id]`
- Sections 1–11 always rendered in DOM
- Auth gate overlay on Section 2 boundary (IntersectionObserver)
- Sign-up form inline; `claimAssessment` server action on success

### Other Pages
- `/science` — Static content, HPIF framework, research references
- `/pricing` — 5 tiers, fixed prices, no Stripe at MVP
- `/enterprise` — Team intelligence pitch, static CTA
- `/dashboard` — Results summary card, retake CTA (stubbed growth tracking)
- `/profile` — Static: name, email, past assessments list
- `/login` + `/signup`
- `/admin` — Stubbed placeholder

---

## 12. Auth & Session Flow

**Supabase Auth config:**
- Email/password: enabled
- Google OAuth: enabled (Google Cloud OAuth app required — configure in Supabase dashboard)
- Session: cookie-based via `@supabase/ssr`
- `middleware.ts` refreshes session on every request (prevents silent logout after JWT expiry)

**Gate position:** After Section 2 (Psychological Fingerprint) — sentinel element at bottom of Section 2

**Free vs Professional at MVP:** All signed-up users see the full 11-section report. Stripe payment integration is deferred. The Free tier (Sections 1–2 without sign-up) vs Professional (full report after sign-up) distinction is enforced via the auth gate — sign-up is free, and all users are effectively Professional at MVP. The pricing page communicates this as "Free forever for individuals during early access."

---

## 13. Pricing

| Tier | Price | Target | Includes |
|------|-------|--------|---------|
| Free | $0 | Individuals | Sections 1–2 (no sign-up required) |
| Professional | $29/mo | Individuals | Full report, retakes, growth tracking |
| Corporate | $25/candidate | HR teams | Candidate assessments, hiring dashboard |
| Recruiter Network | $499/mo | Recruiters | Trait-based candidate search (post-MVP) |
| Talent API | $1/analysis | Developers | API access (post-MVP) |

MVP enforcement: auth gate = free → professional gating. Stripe deferred.

---

## 14. 32 Archetypes

Archetype content is defined in `lib/archetypes.ts` as an array of `ArchetypeDefinition` objects.

**MVP content status:**
- **3 fully written:** Strategic Visionary, Empathetic Leader, Systematic Builder
- **29 stubs:** Archetype name + signature + 1-paragraph description + top 3 career verticals + team role. Full prose marked "Coming Soon — early access."

| # | Slug | Name | Primary Dimensions |
|---|------|------|--------------------|
| 1 | `strategic_visionary` | Strategic Visionary | openness + leadership_drive + cognitive_agility |
| 2 | `empathetic_leader` | Empathetic Leader | agreeableness + leadership_drive + emotional_stability |
| 3 | `systematic_builder` | Systematic Builder | conscientiousness + honesty_humility + leadership_drive |
| 4 | `creative_catalyst` | Creative Catalyst | openness + extraversion + creative_intelligence |
| 5 | `analytical_architect` | Analytical Architect | cognitive_agility + conscientiousness + systems_thinking |
| 6 | `resilient_executor` | Resilient Executor | emotional_stability + conscientiousness + leadership_drive |
| 7 | `innovation_pioneer` | Innovation Pioneer | innovation_index + openness + risk_tolerance |
| 8 | `collaborative_harmonizer` | Collaborative Harmonizer | agreeableness + collaboration_signature + extraversion |
| 9 | `independent_specialist` | Independent Specialist | autonomy_need + cognitive_agility + conscientiousness |
| 10 | `adaptive_generalist` | Adaptive Generalist | adaptability_quotient + learning_agility + openness |
| 11 | `servant_leader` | Servant Leader | purpose_orientation + agreeableness + leadership_drive |
| 12 | `competitive_achiever` | Competitive Achiever | competitive_drive + achievement_drive + leadership_drive |
| 13 | `diplomatic_bridge_builder` | Diplomatic Bridge-Builder | agreeableness + conflict_navigation + social_influence |
| 14 | `courageous_disruptor` | Courageous Disruptor | risk_tolerance + innovation_index + extraversion |
| 15 | `methodical_perfectionist` | Methodical Perfectionist | conscientiousness + executive_function + attention_control |
| 16 | `inspirational_motivator` | Inspirational Motivator | extraversion + social_influence + purpose_orientation |
| 17 | `pragmatic_problem_solver` | Pragmatic Problem-Solver | cognitive_agility + strategic_orientation + emotional_stability |
| 18 | `visionary_entrepreneur` | Visionary Entrepreneur | founder_potential + openness + risk_tolerance |
| 19 | `data_driven_strategist` | Data-Driven Strategist | cognitive_agility + strategic_orientation + conscientiousness |
| 20 | `empowering_coach` | Empowering Coach | agreeableness + growth_mindset + leadership_drive |
| 21 | `bold_risk_taker` | Bold Risk-Taker | risk_tolerance + competitive_drive + extraversion |
| 22 | `thoughtful_synthesizer` | Thoughtful Synthesizer | systems_thinking + openness + honesty_humility |
| 23 | `dynamic_connector` | Dynamic Connector | extraversion + social_influence + agreeableness |
| 24 | `quiet_authority` | Quiet Authority | leadership_drive + honesty_humility + conscientiousness (low extraversion) |
| 25 | `systematic_innovator` | Systematic Innovator | conscientiousness + innovation_index + cognitive_agility |
| 26 | `compassionate_challenger` | Compassionate Challenger | agreeableness + conflict_navigation + openness |
| 27 | `strategic_operator` | Strategic Operator | strategic_orientation + conscientiousness + executive_function |
| 28 | `creative_technologist` | Creative Technologist | creative_intelligence + cognitive_agility + innovation_index |
| 29 | `cultural_architect` | Cultural Architect | agreeableness + social_influence + honesty_humility |
| 30 | `resilient_pioneer` | Resilient Pioneer | psychological_resilience + risk_tolerance + leadership_drive |
| 31 | `intellectual_explorer` | Intellectual Explorer | openness + learning_agility + systems_thinking |
| 32 | `transformational_catalyst` | Transformational Catalyst | leadership_drive + growth_mindset + innovation_index |

---

## 15. MVP Scope: Full vs Stubbed

| Feature | MVP Status | Notes |
|---------|-----------|-------|
| Landing page | **Full** | All 9 sections |
| 7 question type UIs (excl. visual) | **Full** | |
| Visual/Abstract question UI | **Stub** | Static SVGs, tap to select |
| Adaptive engine | **Simplified** | Calibration + ambiguous zone expansion |
| Scoring engine (29 dimensions) | **Full** | |
| Behavioral inference modifiers | **Full** | response time + consistency |
| Archetype assignment | **Full** | Composite score algorithm |
| HPIF 6-layer computation | **Full** | |
| Results page shell (11 sections) | **Full** | Layout + components |
| 3 archetypes full content | **Full** | Pre-authored, provided as data |
| 29 archetype stubs | **Full** | Name + stub prose + verticals |
| Radar chart (29 dims) | **Full** | Grouped by tier |
| Processing screen | **Full** | CSS animation, 2s minimum |
| Auth gate (Section 2 boundary) | **Full** | IntersectionObserver + Framer |
| Supabase Auth (email) | **Full** | |
| Google OAuth | **Full** | Requires Google Cloud setup |
| `claimAssessment` server action | **Full** | |
| `/science` page | **Full** | Static |
| `/pricing` page | **Full** | Static, no Stripe |
| `/enterprise` page | **Full** | Static |
| `/dashboard` | **Stub** | Results card + retake CTA only |
| `/profile` | **Stub** | Static display |
| Demo result (pre-seeded) | **Full** | For "See sample report" CTA |
| PDF export | **Deferred** | Post-MVP |
| Shareable social cards | **Deferred** | Post-MVP |
| `/admin` dashboard | **Stub** | Placeholder page |
| Stripe payments | **Deferred** | Post-MVP |
| Full IRT calibration | **Deferred** | Needs pilot data |
| Neo4j graph | **Deferred** | Post-MVP |
| Talent API | **Deferred** | Post-MVP |
| Recruiter marketplace | **Deferred** | Post-MVP |

---

## 16. Security

- **Supabase RLS** on all tables (service role key server-side only — never in browser bundle)
- **Supabase Auth** — bcrypt handled by Supabase internally
- **`middleware.ts`** — session refresh on every request via `@supabase/ssr`
- **HTTPS** — enforced by Vercel
- **Rate limiting** — `/api/assessment/start`: max 5/IP/hour via Vercel Edge middleware
- **Input sanitization** — all form inputs trimmed and length-validated before DB write
- **CSRF** — Next.js Server Actions include built-in CSRF protection
- **XSS** — React JSX escaping; no `dangerouslySetInnerHTML`
- **No sensitive PII** — only name + email stored; raw response values are numeric

---

## 17. Future Phases (Post-MVP)

- Human Potential Graph (Neo4j)
- Talent Intelligence API
- AI Career Coach Marketplace
- Talent Discovery Network (recruiter search)
- PDF report export
- Team Assessment (org-level)
- Adaptive retesting + growth tracking
- Stripe payment integration
- Full IRT calibration with pilot data
- Complete 32 archetype content blocks

---

## 18. Competitive Differentiation

| Competitor | Their Limit | Kairos Advantage |
|-----------|-------------|-----------------|
| 16Personalities | MBTI (not validated), 4 letters, no career prediction | 29 validated dimensions, 32 archetypes, career trajectory |
| Gallup CliftonStrengths | 34 static strengths, no prediction | Dynamic dimensions + inference + career + team |
| Plum | 4 traits, B2B only, thin report | 29 dimensions, consumer + enterprise, 11-section deep report |
| Aptitude Index | Cognitive only | Full-spectrum: cognitive + personality + motivation + career |
| TraitLab | Academic, not actionable | Deep science + archetypes + career paths + team + growth |
