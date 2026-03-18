# Kairos — Human Potential Intelligence Platform

A full-stack psychometric assessment platform built on Next.js 14, Supabase, and a custom scoring engine. Users complete an adaptive 40–82 question assessment across 29 psychological dimensions, receive a 32-archetype classification, and get an 11-section personalized report with progressive auth gating.

**Live:** [kairosproject.vercel.app](https://kairosproject.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Assessment Engine](#assessment-engine)
- [Scoring Pipeline](#scoring-pipeline)
- [API Routes](#api-routes)
- [Database](#database)
- [Auth & Session Linking](#auth--session-linking)
- [Report System](#report-system)
- [Frontend](#frontend)
- [Pages](#pages)
- [Testing](#testing)
- [Local Development](#local-development)

---

## Overview

Kairos measures personality through a multi-method psychometric engine that combines self-report scoring with behavioral inference signals derived from response timing and revision behavior. Unlike static questionnaires, the engine adapts question selection in real time based on archetype confidence — it terminates early when the result is clear, and probes further when dimensions are ambiguous.

The output is a structured intelligence profile covering cognitive style, motivational architecture, behavioral expression, career potential, and team compatibility — rendered as a gated 11-section report.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, RSC + client components) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS with custom design tokens |
| Animation | Framer Motion, HTML5 Canvas (custom particle engine) |
| Charts | Recharts (RadarChart, GaugeChart, BarChart) |
| Auth & Database | Supabase (PostgreSQL + Auth + Row Level Security) |
| Supabase SSR | @supabase/ssr (cookie-based session on server and client) |
| Icons | Lucide React |
| Deployment | Vercel (automatic on push to `main`) |
| Testing | Jest |

---

## Architecture

```
app/
├── page.tsx                    # Landing page — all marketing sections
├── assessment/                 # Full-page assessment UI (public)
├── results/
│   ├── [id]/                   # Parameterized report page (server + client)
│   └── demo/                   # Hardcoded UUID redirect to sample report
├── (auth)/
│   ├── login/
│   └── signup/
├── (app)/
│   ├── dashboard/              # Authenticated — lists past assessments
│   └── profile/               # Authenticated — account management
├── admin/                      # Protected admin view
└── api/
    ├── assessment/
    │   ├── start/              # POST — create session, return calibration questions
    │   ├── respond/            # POST — upsert response, return next question or null
    │   ├── complete/           # POST — score, compute HPIF, assign archetype, write results
    │   └── link/               # POST — link anonymous session to authenticated user
    └── results/[id]/           # GET — fetch result by UUID

components/
├── assessment/                 # QuestionCard, ProgressBar, ProcessingScreen
│   └── question-types/         # 8 question type components (Likert, Forced Choice, etc.)
├── report/                     # 11 ReportSection components + AuthGate overlay
├── charts/                     # RadarChart, GaugeChart, BarChart
├── home/                       # Landing page sections + HeroCanvas particle animation
├── layout/                     # Header, Footer, AnnouncementBar, UserNav
└── ui/                         # Badge, Button, Card, InfoTip primitives

lib/
├── questions.ts                # Question bank (83 questions) + construct pairs
├── scoring.ts                  # Weighted dimension scoring across 8 question types
├── inference.ts                # Behavioral signal computation (timing, revision, consistency)
├── hpif.ts                     # HPIF composite score computation (6 dimensions)
├── archetypes.ts               # 32 archetype definitions + cosine-distance assignment
├── norms.ts                    # Percentile norms for score interpretation
├── types.ts                    # Shared TypeScript types
├── getResult.ts                # Server-side result loader (shared across routes)
└── supabase/
    ├── client.ts               # Browser-side Supabase client
    └── server.ts               # Cookie-based client + service-role client

supabase/migrations/            # SQL schema migrations
scripts/
├── seed-questions.ts           # Seeds question bank to Supabase
└── seed-demo-result.ts         # Seeds fixed demo result row
```

### Route Groups

- `app/(app)/` — authenticated pages; middleware redirects to `/login` if no session
- `app/(auth)/` — login / signup
- `app/assessment/` — public, no auth required
- `app/results/[id]/` — public fetch; client-side auth gate triggers after section 2

---

## Assessment Engine

### Question Bank

83 questions across 8 question types, each mapped to one of 29 psychological dimensions:

| Type | Mechanism |
|---|---|
| `likert` | 1–5 agreement scale |
| `forced_choice` | Binary A/B selection maps to 1 or 5 |
| `situational` | Scenario with 3–4 options, each carrying a fixed score |
| `timed` | Same as situational but response time is a scored signal |
| `rank_order` | 4-item ranking; position maps to weighted score (5, 3.7, 2.3, 1) |
| `allocation` | Slider distributes 100 points; value normalized to 0–5 scale |
| `frequency` | 1–5 frequency scale (never → always) |
| `visual` | Image-based selection with option scores |

Questions carry `weight`, `reverse_scored`, `calibration`, and `tier` flags. Reverse scoring is applied at extraction (`6 - raw`) before weighting.

### Adaptive IRT Logic

Assessment runs in two phases:

**Phase 1 — Calibration (40 questions):** All questions flagged `calibration: true`, shuffled within each tier (1–6) to control difficulty sequencing.

**Phase 2 — Adaptive follow-up (0–42 questions):** After calibration, the engine computes interim scores and evaluates archetype confidence:

```
topComposite ≥ 75 AND margin ≥ 8  →  confident result, stop
otherwise                           →  select next question
```

Confidence uses a weighted cosine composite across all 32 archetypes against interim dimension scores. Follow-up selection priority:

1. Questions targeting dimensions scoring in the ambiguous zone [30, 70]
2. Any remaining non-calibration question (ordered by `order_index`)

The engine terminates early when confident and exhausts all available questions when not. Typical completion is 40–82 questions.

### 29 Dimensions

Organized across 6 clusters:

| Cluster | Dimensions |
|---|---|
| Big Five core | openness, conscientiousness, extraversion, agreeableness, emotional\_stability |
| HEXACO | honesty\_humility |
| Cognitive | cognitive\_agility, executive\_function, attention\_control, systems\_thinking, creative\_intelligence |
| Motivational | achievement\_drive, risk\_tolerance, autonomy\_need, purpose\_orientation, competitive\_drive |
| Interpersonal | social\_influence, conflict\_navigation, communication\_style, collaboration\_signature |
| Career/Leadership | leadership\_drive, founder\_potential, strategic\_orientation, specialist\_generalist, innovation\_index |
| Resilience | psychological\_resilience, growth\_mindset, adaptability\_quotient, learning\_agility |

---

## Scoring Pipeline

Each API call to `/api/assessment/complete` runs the full pipeline in sequence:

### 1. Raw Score Extraction (`lib/scoring.ts`)

`extractRawValue()` normalizes each answer to a 1–5 numeric value, applying question-type-specific logic and reverse scoring. Scores are accumulated per dimension as `(weighted_sum / max_possible) × 100`.

### 2. Behavioral Inference (`lib/inference.ts`)

Three signals computed independently of self-report:

- **Response time:** median response across questions. Below 800ms → `speedModifier +2` (high decisiveness). Above 8000ms → `−2`.
- **Revision rate:** proportion of questions where the user changed their answer. Stored as a signal but not currently penalized.
- **Construct consistency:** paired questions measuring the same construct from opposite angles. If normalized values diverge by > 0.6 on more than 30% of pairs → `consistencyPenalty −5` applied to all dimension scores.

Construct pairs are defined in `lib/questions.ts` as `CONSTRUCT_PAIRS`.

### 3. HPIF Composite (`lib/hpif.ts`)

Six composite dimensions derived from dimension score clusters:

| HPIF Dimension | Inputs | Output |
|---|---|---|
| Cognitive Operating System | cognitive\_agility, executive\_function, attention\_control | Style label (Analytical-Convergent / Balanced / Intuitive-Divergent) + composite score |
| Motivational Architecture | achievement\_drive, purpose\_orientation, autonomy\_need, competitive\_drive | Primary + secondary driver labels |
| Behavioral Expression | extraversion, agreeableness, conflict\_navigation, communication\_style | Social style (Analytical / Driver / Amiable / Expressive) |
| Growth Vector | growth\_mindset, adaptability\_quotient, learning\_agility, psychological\_resilience | Trajectory (Accelerating / Steady / Developing) + ceiling |
| Career Potential Matrix | leadership\_drive, founder\_potential, strategic\_orientation, specialist\_generalist | Leadership tier (Emerging → Visionary) + Founder tier (Operator → Serial Founder) |
| Team Compatibility | systems\_thinking, creative\_intelligence, conscientiousness, agreeableness, and others | Team role (Architect / Catalyst / Executor / Harmonizer / Challenger / Navigator) + remote orientation + team size preference |

`founder_potential` is a derived dimension computed from the mean of risk\_tolerance, creative\_intelligence, psychological\_resilience, and achievement\_drive — not directly answered by any question.

### 4. Archetype Assignment (`lib/archetypes.ts`)

Each archetype defines a `signature` — a list of dimensions with `weight` and `direction` (`high` / `low`). The assignment algorithm:

```
composite(archetype) = Σ(dimension_value_directional × weight) / Σ(weights)
```

Where `dimension_value_directional = score` if `direction = 'high'`, or `100 - score` if `direction = 'low'`.

The archetype with the highest composite wins. Match score = the winning composite (0–100). All 32 archetypes are evaluated; the result is the top match.

---

## API Routes

### `POST /api/assessment/start`

Creates an `assessments` row with a `session_token` UUID. Sets `user_id` immediately if the user is authenticated. Returns the full calibration question set (shuffled within tiers).

**Response:**
```json
{
  "assessmentId": "uuid",
  "sessionToken": "uuid",
  "questions": [/* Question[] */]
}
```

### `POST /api/assessment/respond`

Upserts a response row. After calibration is complete, computes interim scores and evaluates archetype confidence to determine whether another question is needed.

Optimistic client design: the UI advances to the next question immediately on user selection; this API call fires in the background. The lock (`submittingRef`) releases immediately so the next question is clickable before the network round-trip completes.

**Request:**
```json
{
  "sessionToken": "uuid",
  "questionCode": "OPN001",
  "value": 4,
  "responseTimeMs": 1240,
  "revised": false
}
```

**Response:**
```json
{
  "nextQuestion": null,
  "progress": { "answered": 40, "total": 40 }
}
```

### `POST /api/assessment/complete`

Full scoring pipeline: fetch all responses → extract raw values → compute inference → apply modifiers → compute HPIF → assign archetype → write `results` row → mark assessment `completed`. Idempotent: returns existing result ID if called more than once.

**Response:**
```json
{ "resultId": "uuid" }
```

### `POST /api/assessment/link`

Links an anonymous assessment session (stored in `localStorage` as `kairos_session`) to a newly authenticated user. Called on `SIGNED_IN` auth event in `ResultsClient` so users don't lose results taken before login.

### `GET /api/results/[id]`

Fetches result by UUID using the service-role client (bypasses RLS). Returns the full result including `scores`, `hpif_profile`, `archetype`, `match_score`, and `inference_data`.

---

## Database

PostgreSQL via Supabase with Row Level Security enabled on all tables.

### Tables

**`assessments`**
```sql
id              uuid PRIMARY KEY
session_token   uuid UNIQUE NOT NULL
user_id         uuid REFERENCES auth.users (nullable — anonymous users)
status          text DEFAULT 'in_progress' ('in_progress' | 'completed')
completed_at    timestamptz
created_at      timestamptz
```

**`responses`**
```sql
id              uuid PRIMARY KEY
assessment_id   uuid REFERENCES assessments
question_code   text NOT NULL
value           text NOT NULL        -- JSON-serialized (supports all answer types)
response_time_ms integer
revised         boolean DEFAULT false
UNIQUE (assessment_id, question_code)  -- upsert target
```

**`results`**
```sql
id              uuid PRIMARY KEY
assessment_id   uuid REFERENCES assessments UNIQUE
scores          jsonb NOT NULL       -- DimensionScores (29 keys)
hpif_profile    jsonb NOT NULL       -- HpifProfile (6 composite dimensions)
archetype       text NOT NULL        -- winning archetype slug
match_score     integer              -- 0-100
inference_data  jsonb                -- avgResponseMs, revisionRate, consistencyScore
created_at      timestamptz
```

**`questions`** — seeded question bank (83 rows, managed via `scripts/seed-questions.ts`)

### Two Supabase Clients (`lib/supabase/server.ts`)

| Client | Auth | RLS | Usage |
|---|---|---|---|
| `createClient()` | Cookie-based | Enforced | Auth checks, user-scoped reads |
| `createServiceClient()` | Service role key | Bypassed | Admin writes, cross-user reads, all API routes |

**Note:** Supabase nested join syntax (`.select('id, results(id)')`) silently returns empty arrays in this project. All cross-table queries use two separate queries merged in application code.

---

## Auth & Session Linking

Anonymous users can complete the full assessment without an account. The flow:

1. `/api/assessment/start` stores `assessmentId` + `sessionToken` in `localStorage` as `kairos_session`
2. `user_id` in `assessments` is null for anonymous sessions
3. When the user authenticates (login or signup), `ResultsClient` detects the `SIGNED_IN` auth event and calls `/api/assessment/link` with the stored session token
4. The link route writes the user's ID to the assessment row
5. The dashboard then surfaces the result in the user's history

If the user was already authenticated when they started, `/api/assessment/start` sets `user_id` immediately — no linking needed.

### Report Auth Gate

`/results/[id]/page.tsx` (Server Component) fetches the result and checks the session, passing `isAuthenticated` as a prop to `ResultsClient`. The prop is critical — without it, an async `getSession()` race condition would transiently block authenticated users.

`ResultsClient` renders all 11 `ReportSection` components. An `IntersectionObserver` monitors a sentinel element at the bottom of Section 2. When an unauthenticated user scrolls past it, `AuthGateOverlay` appears — a frosted blur over the remaining content with a sign-up prompt. Sections 1–2 are always fully visible.

---

## Report System

The report renders 11 sections, each a standalone client component:

| Section | Content |
|---|---|
| 1 | Archetype identity — name, subtitle, rarity, 3-word signature, description, quote |
| 2 | 29-dimension radar chart + HPIF composite overview |
| 3 | Cognitive Operating System — style, subscores, description |
| 4 | Motivational Architecture — primary + secondary driver, subscores |
| 5 | Behavioral Expression — social style, communication pattern |
| 6 | Growth Vector — trajectory, ceiling, growth dimension breakdown |
| 7 | Career Potential Matrix — leadership tier, founder tier, tactical/strategic axis |
| 8 | Team Compatibility — team role, remote orientation, team size preference, best/friction archetypes |
| 9 | Behavioral inference signals — response time, revision rate, consistency score |
| 10 | Development areas + 90-day challenge |
| 11 | Action Plan + 1-year vision |

**Auth gate:** Sections 3–11 are progressively blurred for unauthenticated users. The gate activates via `IntersectionObserver` — no layout shift, no pre-render hiding.

**Demo report:** `/results/demo` redirects to a fixed UUID with a seeded `strategic_visionary` result, allowing anyone to preview the full report without completing the assessment.

---

## Frontend

### HeroCanvas (`components/home/HeroCanvas.tsx`)

A 1800-particle interactive canvas that fills the hero header. Built entirely with the HTML5 Canvas API and `requestAnimationFrame` — no external animation library.

**Behaviors:**
- **At rest:** particles drift with subtle Brownian motion, held near their home position by a spring force. Rendered at low opacity (indigo)
- **On cursor movement:** particles within `PUSH_RADIUS` (75px) receive a velocity impulse proportional to cursor speed — no click required
- **On hover (55px radius):** particles bloom from indigo to their assigned archetype color (one of 8 palette colors distributed across the particle set)
- **On click:** radial velocity burst (200px radius) — pure physics, no color change
- **On mouse leave:** all active particles fade back to indigo over 2–4 seconds via per-particle `colorSpeed`

**Implementation details:**
- All animation state held in `useRef` — zero React re-renders during animation
- `ResizeObserver` handles responsive canvas sizing with `devicePixelRatio` support
- Mouse events attached to `window` (not the canvas) to receive events through the text overlay stacked above
- Particle init uses a rejection-sampling loop to keep the center text zone sparse (~10% density) while fully populating the left/right flanks
- Visibility API pauses the loop when the tab is hidden

### Question Components (`components/assessment/question-types/`)

Eight distinct components, one per question type. Each handles its own input model and emits a normalized value to the parent `QuestionCard`.

### Chart Components (`components/charts/`)

- `RadarChart` — Recharts `RadarChart` with custom dot renderer, animated fill, and dimension label mapping
- `GaugeChart` — SVG arc gauge for composite scores
- `BarChart` — Horizontal bar chart for dimension subscores

### UI Primitives (`components/ui/`)

`Badge`, `Button`, `Card`, `InfoTip` — thin wrappers over Tailwind classes with variant props. No external component library.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero with particle canvas, social proof, competitor contrast, how-it-works, science pillars, archetype showcase, report preview, testimonials, enterprise teaser, pricing teaser, CTA |
| `/assessment` | Adaptive assessment — question flow, progress bar, processing screen |
| `/results/[id]` | 11-section report with progressive auth gate |
| `/results/demo` | Sample report (Strategic Visionary, match score 87) |
| `/science` | Methodology — Big Five, HEXACO, SDT, IRT, behavioral inference; 16 peer-reviewed citations with DOI links |
| `/pricing` | 5 tiers (Free / Individual / Corporate / Recruiter / API) with roadmap feature breakdown and FAQ |
| `/enterprise` | HR value proposition — validity comparison table, 7 use-case cards, 4-step workflow, 7 academic citations |
| `/dashboard` | Authenticated — past assessment history with archetype and date |
| `/profile` | Authenticated — account details |
| `/login` | Email/password login + OAuth |
| `/signup` | Registration |

---

## Testing

Unit tests cover the core scoring and intelligence pipeline:

```bash
npm test
```

Test coverage:
- `scoring.ts` — `extractRawValue` across all question types, reverse scoring, weighted aggregation
- `hpif.ts` — composite computations, tier boundary conditions, team role assignment
- `inference.ts` — response time modifier thresholds, construct pair consistency penalty
- `norms.ts` — percentile norm lookup
- `archetypes.ts` — archetype assignment, cosine composite correctness

---

## Local Development

**Prerequisites:** Node.js 18+, a Supabase project.

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Run migrations
npx supabase db push

# Seed question bank
npx ts-node scripts/seed-questions.ts

# Seed demo result
npx ts-node scripts/seed-demo-result.ts

# Start dev server
npm run dev
```

**Build:**

```bash
npm run build   # TypeScript + ESLint — must pass for Vercel deployment
npm run lint    # ESLint only
```

Build errors block Vercel deployment. Common causes from past failures: `@typescript-eslint/no-explicit-any`, `react/no-unescaped-entities`, strict null checks on optional props.

---

## Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + Server | Public anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role key — never expose to client |
