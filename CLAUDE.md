# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build (runs TypeScript + ESLint — must pass for Vercel deploy)
npm run lint       # ESLint check
npm test           # Full Jest test suite
npx jest __tests__/scoring.test.ts  # Run a single test file
```

Build errors block Vercel deployment. Common causes from past failures: `@typescript-eslint/no-explicit-any`, `react/no-unescaped-entities`, strict null checks on optional props.

## Architecture

**Kairos** is a psychometric assessment platform. Users complete an adaptive 36-dimension assessment, receive an archetype, and get an 11-section report with progressive auth gating.

### Stack
- Next.js 14 App Router · TypeScript strict · Tailwind CSS · Supabase (Postgres + Auth) · Recharts · Framer Motion · Vercel

### Route Groups
- `app/(app)/` — authenticated pages (dashboard, profile) — redirect to `/login` if no session
- `app/(auth)/` — login, signup
- `app/assessment/` — public, no auth required
- `app/results/[id]/` — public fetch, client-side auth gate after section 2
- `app/api/assessment/` — start, respond, complete, link

### Assessment Engine

**Three phases:**

1. **Start** (`/api/assessment/start`) — creates `assessments` row with `session_token` + `user_id` (set immediately if logged in, else null), returns 80 shuffled calibration questions (Tier 1).

2. **Respond** (`/api/assessment/respond`) — upserts response, computes interim scores, returns `nextQuestion` if confidence threshold not met (top archetype composite < 75 or margin < 8), otherwise returns null. Max 52 adaptive questions (132 total hard cap). Client advances **optimistically** — the lock (`submittingRef`) is released immediately after advancing so the next question is instantly clickable; API call fires in background.

3. **Complete** (`/api/assessment/complete`) — computes final 36 dimension scores (`lib/scoring.ts`), inference modifiers (`lib/inference.ts`), HPIF composites (`lib/hpif.ts`), cosine-distance archetype match (`lib/archetypes.ts`), writes to `results` table.

### Dimension System

36 dimensions defined in `lib/dimensions.ts` as `DimensionMeta[]`. One slug (`founder_potential`) is excluded from display — the active set is 35 bars on the chart.

- **20 Major** dimensions (indigo, higher predictive weight)
- **15 Supporting** dimensions (teal)
- **6 tiers** map to behavioral clusters: Tier 1=Foundation, 2=Cognitive, 3=Motivational, 4=Interpersonal, 5=Career, 6=Growth
- `lib/norms.ts` provides `getPercentile(slug, score)` for percentile conversion

### Visualization

`components/charts/RadarChart.tsx` exports `DimensionRadarChart` — a **custom pure SVG radial bar chart** (no Recharts). 35 arc bars grouped into 6 tier clusters, colored Major (indigo `#3730A3`) vs Supporting (teal `#0F766E`). Hover shows score, percentile, description tooltip. Angular math: `BAR_SLOT = (360 - 6×4.5°) / 35 ≈ 9.51°` per slot.

### Results & Auth Gate

`/results/[id]/page.tsx` (server): fetches result via service client, checks session, passes `isAuthenticated` prop to `ResultsClient`. This prop is critical — without it the auth gate races against an async session check and may block logged-in users.

`ResultsClient.tsx`: renders 11 `ReportSection` components. An `IntersectionObserver` on a sentinel at the bottom of Section 2 triggers the `AuthGateOverlay` blur for unauthenticated users scrolling past it. Sections 1–2 are always visible.

### Supabase Patterns

Two clients in `lib/supabase/server.ts`:
- `createClient()` — cookie-based, respects RLS, use for auth checks
- `createServiceClient()` — service role key, bypasses RLS, use for admin queries

**Important:** Supabase nested join syntax (e.g., `.select('id, results(id, archetype)')`) silently returns empty arrays in this project. Always use two separate queries and merge in code:
```ts
const { data: assessments } = await serviceClient.from('assessments').select('id, completed_at').eq('user_id', uid)
const { data: results } = await serviceClient.from('results').select('id, archetype, assessment_id').in('assessment_id', ids)
const map = new Map(results.map(r => [r.assessment_id, r]))
```

**Patching JSONB columns** (e.g. scores): use the merge operator to avoid overwriting:
```sql
UPDATE results SET scores = scores || '{"key": value}'::jsonb WHERE id = '...';
```

### Session Linking

Anonymous users can take assessments (`user_id = null`). Linking happens:
- On `SIGNED_IN` auth event in `ResultsClient` → calls `/api/assessment/link` with `localStorage.getItem('kairos_session')`
- On `getSession()` mount check in `ResultsClient` (for already-logged-in users)
- `/api/assessment/start` sets `user_id` immediately if the user is already authenticated

### Tailwind Colors
Custom palette: `indigo` (#3730A3, primary), `teal` (#0F766E, secondary), `bg` (#F8FAFC), `text` (#1E293B).

### Key Data Shapes
- `DimensionScores` — `Record<DimensionSlug, number>` (36 dimensions, 0–100 scale, snake_case keys)
- `AssessmentResult` — includes `scores`, `hpif_profile`, `archetype` (slug), `match_score`, `inference_data`
- `ArchetypeDefinition` — content injected server-side from `lib/archetypes.ts` before passing to client

### Environment Variables
| Variable | Use |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to client |
