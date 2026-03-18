# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build (runs TypeScript + ESLint — must pass for Vercel deploy)
npm run lint       # ESLint check
npm test           # Jest test suite
```

Build errors block Vercel deployment. Common causes from past failures: `@typescript-eslint/no-explicit-any`, `react/no-unescaped-entities`, strict null checks on optional props.

## Architecture

**Kairos** is a psychometric assessment platform. Users complete an adaptive 29-dimension assessment, receive an archetype, and get an 11-section report with progressive auth gating.

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

1. **Start** (`/api/assessment/start`) — creates `assessments` row with `session_token` + `user_id` (set immediately if logged in, else null), returns 40 shuffled calibration questions (Tier 1).

2. **Respond** (`/api/assessment/respond`) — upserts response, computes interim scores, returns `nextQuestion` if confidence threshold not met (top archetype composite < 75 or margin < 8), otherwise returns null. Client advances **optimistically** — the lock (`submittingRef`) is released immediately after advancing so the next question is instantly clickable; API call fires in background.

3. **Complete** (`/api/assessment/complete`) — computes final 29 dimension scores (`lib/scoring.ts`), inference modifiers (`lib/inference.ts`), HPIF composites (`lib/hpif.ts`), cosine-distance archetype match (`lib/archetypes.ts`), writes to `results` table.

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

### Session Linking

Anonymous users can take assessments (`user_id = null`). Linking happens:
- On `SIGNED_IN` auth event in `ResultsClient` → calls `/api/assessment/link` with `localStorage.getItem('kairos_session')`
- On `getSession()` mount check in `ResultsClient` (for already-logged-in users)
- `/api/assessment/start` sets `user_id` immediately if the user is already authenticated

### Tailwind Colors
Custom palette: `indigo` (#3730A3, primary), `teal` (#0F766E, secondary), `bg` (#F8FAFC), `text` (#1E293B).

### Key Data Shapes
- `DimensionScores` — `Record<string, number>` (29 dimensions, 0–100 scale, snake_case keys)
- `AssessmentResult` — includes `scores`, `hpif_profile`, `archetype` (slug), `match_score`, `inference_data`
- `ArchetypeDefinition` — content injected server-side from `lib/archetypes.ts` before passing to client

### Environment Variables
| Variable | Use |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to client |
