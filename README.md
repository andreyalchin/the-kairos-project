# The Kairos Project

**Human Potential Intelligence Platform** — a psychometric assessment that measures 29 psychological dimensions, computes a behavioral profile, and delivers a personalized 11-section report with archetype classification.

Live: [kairosproject.vercel.app](https://kairosproject.vercel.app)

---

## What It Does

Users complete an adaptive assessment of 83 questions across 8 question types (Likert, forced-choice, situational, timed, rank-order, allocation, frequency, visual). The engine tracks response timing and revision behavior alongside explicit answers to build a richer behavioral signal.

After completing the assessment, users receive a full report covering:

- **HPIF Profile** — High Performance Intelligence Framework scores across 5 composite dimensions
- **Archetype classification** — matched to 1 of 32 archetypes (e.g. Strategic Visionary, Analytical Architect) with a match confidence score
- **29-dimension radar breakdown** — openness, conscientiousness, emotional stability, leadership drive, cognitive agility, and 24 more
- **Cognitive inference signals** — average response time, revision rate, consistency score derived from construct pair comparisons
- **Team compatibility** — best partners, growth partners, and friction archetypes
- **Growth edges, blind spots, decision-making style, communication patterns, stress response, and ideal environment** (sections 4–11)

The first 2 report sections are public. Sections 3–11 are gated behind authentication using an IntersectionObserver blur pattern — the gate appears naturally as the user scrolls.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Auth & Database | Supabase (PostgreSQL + Auth + RLS) |
| Supabase SSR | @supabase/ssr |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Assessment Engine

- **83 questions** across 8 types, weighted per dimension
- **Adaptive IRT logic** — ambiguous zone [35, 65] triggers targeted follow-up after 40 calibration questions
- **Scoring** — weighted normalization per dimension → 0–100 scale
- **HPIF computation** — 5 composite scores derived from dimension clusters
- **Inference layer** — response time, revision rate, and construct-pair consistency computed separately from self-report scores
- **Archetype matching** — cosine-style distance across dimension weights mapped to 32 archetypes

---

## Database (Supabase / PostgreSQL)

Four tables with Row Level Security:

- `assessments` — session token, status, completion timestamp, user_id (nullable for anonymous)
- `responses` — per-question answers with response time and revision flag
- `results` — computed scores, HPIF profile, archetype, match score, inference data
- `questions` — seeded question bank (83 rows)

Anonymous users can complete the full assessment. Auth is required only to access the gated sections of the report.

---

## Project Structure

```
app/                    # Next.js App Router pages and API routes
  api/assessment/       # start, respond, complete endpoints
  api/results/[id]/     # result fetch endpoint
  assessment/           # assessment UI
  results/[id]/         # report page
  (auth)/               # login / signup
  (app)/                # dashboard, profile
components/
  assessment/           # question type components, progress, processing screen
  charts/               # RadarChart, GaugeChart, BarChart
  report/               # 11 report section components + AuthGate
  layout/               # Header, Footer
  ui/                   # Button, Card, Badge primitives
lib/
  questions.ts          # question bank + construct pairs
  scoring.ts            # weighted dimension scoring
  inference.ts          # behavioral signal computation
  hpif.ts               # HPIF composite score computation
  archetypes.ts         # 32 archetype definitions
  getResult.ts          # shared server-side result loader
scripts/
  seed-questions.ts     # seeds question bank to Supabase
  seed-demo-result.ts   # seeds fixed demo result (UUID: 00000000-0000-0000-0000-000000000001)
supabase/migrations/    # SQL schema
```

---

Unit tests cover scoring, HPIF computation, inference, norms, and archetype matching.
