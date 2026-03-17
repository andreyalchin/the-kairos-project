# Kairos Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Kairos — a production-quality Human Potential Intelligence Platform with adaptive assessment, 29-dimension scoring, 32 archetypes, and an 11-section deep report.

**Architecture:** Next.js 14 App Router + Supabase Auth/DB + anonymous-session assessment flow + SSR results page with IntersectionObserver auth gate after Section 2.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts, Supabase (@supabase/ssr), Lucide React, Jest (unit tests for lib/), Vercel

---

## File Map

| File | Responsibility |
|------|---------------|
| `middleware.ts` | Supabase SSR session refresh + in-memory rate limiting |
| `lib/types.ts` | All TypeScript interfaces |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client (SSR) |
| `lib/questions.ts` | 82 questions — source of truth |
| `lib/norms.ts` | Normative percentile lookup + interpolation |
| `lib/scoring.ts` | Per-dimension score computation (0–100) |
| `lib/inference.ts` | Behavioral inference modifiers |
| `lib/hpif.ts` | 6-layer HPIF profile computation |
| `lib/archetypes.ts` | 32 archetype definitions + assignment algorithm |
| `app/api/assessment/start/route.ts` | Create assessment, return calibration questions |
| `app/api/assessment/respond/route.ts` | Upsert response, return next question |
| `app/api/assessment/complete/route.ts` | Score + write results |
| `app/api/results/[id]/route.ts` | Fetch results + archetype content |
| `app/(auth)/signup/actions.ts` | `claimAssessment` server action |
| `components/assessment/question-types/` | 8 question type UIs |
| `components/assessment/QuestionCard.tsx` | Wraps question type, handles submit |
| `components/assessment/ProgressBar.tsx` | Progress indicator |
| `components/assessment/ProcessingScreen.tsx` | 2s CSS animation |
| `components/report/ReportSection[1-11].tsx` | 11 report sections |
| `components/report/AuthGate.tsx` | IntersectionObserver gate + Framer exit |
| `components/charts/` | RadarChart, GaugeChart, BarChart wrappers |
| `components/ui/` | Button, Card, Badge, Modal |
| `components/layout/` | Header, Footer, LayoutShell |
| `supabase/migrations/001_schema.sql` | All table + RLS definitions |
| `scripts/seed-questions.ts` | Upsert questions from lib/questions.ts |

---

## Chunk 1: Project Foundation

### Task 1: Initialize Next.js project with all dependencies

**Files:**
- Create: `package.json` (via npx)
- Create: `tailwind.config.ts`
- Create: `app/globals.css`

- [ ] **Step 1: Initialize project**

```bash
cd /Users/andrey/Desktop/ClaudeCodeTest/kairos
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --yes
```

Expected: Next.js 14 project scaffolded

- [ ] **Step 2: Install dependencies**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm install @supabase/supabase-js @supabase/ssr framer-motion recharts lucide-react
npm install --save-dev jest @types/jest jest-environment-jsdom ts-jest
```

- [ ] **Step 3: Add jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
}
export default config
```

- [ ] **Step 4: Add test script to package.json**

```json
"scripts": {
  "test": "jest"
}
```

- [ ] **Step 5: Initialize git repo and add .gitignore entries**

`create-next-app` initializes git automatically. Verify `.gitignore` contains:
```
.env.local
.env*.local
```
If not present, add them manually.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 + all dependencies"
```

---

### Task 2: Tailwind config + global styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#3730A3',
          50: '#EEEDFC', 100: '#D4D3F8', 200: '#A9A7F1',
          300: '#7E7CEA', 400: '#5350E4', 500: '#3730A3',
          600: '#2C2683', 700: '#211C63', 800: '#161242', 900: '#0B0921',
        },
        teal: {
          DEFAULT: '#0F766E',
          50: '#E6F7F6', 100: '#C0EBE8', 200: '#81D7D1',
          300: '#42C3BB', 400: '#1FA89F', 500: '#0F766E',
          600: '#0C5E58', 700: '#094742', 800: '#062F2C', 900: '#031816',
        },
        blue: { DEFAULT: '#2563EB' },
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        text: { DEFAULT: '#1E293B', muted: '#64748B' },
      },
      fontFamily: {
        sans: ['var(--font-geist)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Replace globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-bg text-text font-sans; }
}

@layer components {
  .glass {
    @apply bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm;
  }
}

/* Processing screen animation */
@keyframes ring-pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}
.ring-animate { animation: ring-pulse 2s ease-out infinite; }
.ring-animate-delay-1 { animation: ring-pulse 2s ease-out 0.5s infinite; }
.ring-animate-delay-2 { animation: ring-pulse 2s ease-out 1s infinite; }
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: Tailwind brand config + global styles + CSS animations"
```

---

### Task 3: lib/types.ts

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write types**

```typescript
// lib/types.ts

export type QuestionType =
  | 'likert' | 'forced_choice' | 'situational' | 'frequency'
  | 'rank_order' | 'allocation' | 'visual' | 'timed'

export type DimensionSlug =
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

export type DimensionScores = Record<DimensionSlug, number>

export interface QuestionOptions {
  // likert / frequency
  labels?: string[]
  // forced_choice
  a?: string; b?: string
  // situational / timed
  scenario?: string; choices?: string[]; scores?: number[]
  // rank_order / allocation
  items?: string[]; target_item_index?: number; total?: number
  // visual
  images?: string[]
}

export interface Question {
  id: string
  code: string
  text: string
  type: QuestionType
  dimension: DimensionSlug
  tier: 1 | 2 | 3 | 4 | 5 | 6
  options: QuestionOptions
  weight: number
  reverse_scored: boolean
  calibration: boolean
  order_index: number
  is_active: boolean
}

export interface Response {
  questionCode: string
  value: number | string | number[]
  responseTimeMs: number
  revised: boolean
  dimension: DimensionSlug
}

export interface InferenceOutput {
  avgResponseMs: number
  revisionRate: number
  consistencyScore: number
  speedModifier: number
  consistencyPenalty: number
}

export interface ArchetypeDimensionWeight {
  dimension: DimensionSlug
  weight: number
  direction: 'high' | 'low'
}

export interface ArchetypeDefinition {
  slug: string
  name: string
  subtitle: string
  signature3Words: string[]
  quote: string
  rarity: string
  description: string
  signature: ArchetypeDimensionWeight[]
  // Full content (3 archetypes only at MVP):
  who_you_are?: string
  how_you_think?: string
  what_drives_you?: string
  how_you_show_up?: string
  shadow_side?: string
  famous_examples?: string[]
  career_verticals_primary?: string[]
  career_verticals_secondary?: string[]
  dream_roles?: string[]
  career_trajectory?: string
  leadership_style?: string
  leadership_strengths?: string[]
  leadership_blind_spots?: string[]
  ideal_work_conditions?: string[]
  reward_ranking?: string[]
  warning_signals?: string[]
  development_areas?: Record<string, string>
  challenge_90_day?: string
  vision_1_year?: string
  // Team compatibility (fetched at render, not stored in DB)
  best_partners: string[]
  growth_partners: string[]
  friction_archetypes: string[]
  team_role: 'Architect' | 'Catalyst' | 'Executor' | 'Harmonizer' | 'Challenger' | 'Navigator'
}

export interface HpifProfile {
  cognitive_operating_system: {
    primary_style: string; description: string
    scores: Partial<DimensionScores>; composite: number
  }
  motivational_architecture: {
    primary_driver: string; secondary_driver: string; description: string
    scores: Partial<DimensionScores>; composite: number
  }
  behavioral_expression: {
    social_style: string; description: string
    scores: Partial<DimensionScores>; composite: number
  }
  growth_vector: {
    trajectory: string; ceiling: string
    scores: Partial<DimensionScores>; composite: number
  }
  career_potential_matrix: {
    leadership_score: number; founder_score: number
    strategic_vs_tactical: number; specialist_vs_generalist: number
    leadership_tier: 'Emerging' | 'Rising' | 'Established' | 'Visionary'
    founder_tier: 'Operator' | 'Builder' | 'Founder' | 'Serial Founder'
  }
  team_compatibility: {
    team_role: string; collaboration_style: string
    remote_orientation: 'Remote-first' | 'Hybrid' | 'In-person'
    team_size_preference: 'Solo' | 'Small (2-8)' | 'Mid (9-30)' | 'Large (30+)'
    best_partners: string[]; growth_partners: string[]; friction_archetypes: string[]
  }
}

export interface AssessmentResult {
  id: string
  assessment_id: string
  scores: DimensionScores
  hpif_profile: HpifProfile
  archetype: string          // winning archetype slug only — secondary archetype is post-MVP
  match_score: number        // 0-100 composite score of winning archetype
  inference_data: InferenceOutput
  created_at: string
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add all TypeScript types"
```

---

## Chunk 2: Supabase Clients + Middleware

### Task 4: Supabase clients + middleware + layout

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `middleware.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create .env.local** ⚠️ HUMAN GATE — requires manual action

This step cannot be automated. Go to Supabase dashboard → your project → Project Settings → API and copy the values.

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Do not proceed to Step 6 (build verification) until real values are in `.env.local`. `.env.local` must not be committed to git.

- [ ] **Step 2: Create lib/supabase/client.ts**

```typescript
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create lib/supabase/server.ts**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cs) {
          try { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
          catch {}
        },
      },
    }
  )
}

export async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cs) {
          try { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
          catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 4: Create middleware.ts** (exact from spec)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const rateLimitStore = new Map<string, { ts: number; count: number }>()

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )
  await supabase.auth.getUser()

  if (request.nextUrl.pathname === '/api/assessment/start') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const key = `rl:${ip}`
    const now = Date.now()
    const window = 60 * 60 * 1000
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

- [ ] **Step 5: Update app/layout.tsx**

Using Inter from next/font/google as the Geist stand-in for MVP. The CSS variable `--font-geist` is used throughout so swapping to local Geist woff2 post-launch requires only changing this file.

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Using Inter as Geist stand-in for MVP. To use real Geist post-launch:
// 1. Download Geist woff2 files to app/fonts/
// 2. Replace with: const geist = localFont({ src: './fonts/GeistVF.woff2', variable: '--font-geist' })
const inter = Inter({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

export const metadata: Metadata = {
  title: 'Kairos — Know your moment.',
  description: 'Discover your Human Potential Intelligence Profile. 29 dimensions, 32 archetypes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Verify build** (requires real .env.local values from Step 1)

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm run build
```

Expected: clean compile. If build fails with Supabase URL errors, verify `.env.local` has real values (not placeholder strings).

- [ ] **Step 7: Commit**

```bash
git add lib/supabase/ middleware.ts app/layout.tsx
git commit -m "feat: Supabase clients, middleware, app layout"
```

---

## Chunk 3: Database Schema + Question Bank

### Task 5: DB schema via Supabase MCP

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create migration file** (exact from spec Section 4)

```sql
-- supabase/migrations/001_schema.sql

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
  user_id        uuid REFERENCES auth.users(id),
  session_token  text NOT NULL UNIQUE,
  status         text DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  started_at     timestamptz DEFAULT now(),
  completed_at   timestamptz
);

CREATE TABLE questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code           text NOT NULL UNIQUE,
  text           text NOT NULL,
  type           text NOT NULL CHECK (type IN (
                   'likert','forced_choice','situational',
                   'frequency','rank_order','allocation','visual','timed'
                 )),
  dimension      text NOT NULL,
  tier           integer NOT NULL CHECK (tier BETWEEN 1 AND 6),
  options        jsonb NOT NULL,
  weight         float DEFAULT 1.0,
  reverse_scored boolean DEFAULT false,
  calibration    boolean DEFAULT false,
  order_index    integer,
  is_active      boolean DEFAULT true
);
CREATE INDEX questions_dimension_idx ON questions(dimension);
CREATE INDEX questions_calibration_idx ON questions(calibration);

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
  scores         jsonb NOT NULL,
  hpif_profile   jsonb NOT NULL,
  archetype      text NOT NULL,
  match_score    integer NOT NULL,
  inference_data jsonb,
  created_at     timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own" ON assessments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role all" ON assessments
  USING (auth.role() = 'service_role');

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own responses" ON responses
  FOR SELECT USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );
CREATE POLICY "service role all" ON responses
  USING (auth.role() = 'service_role');

ALTER TABLE results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth users read own results" ON results
  FOR SELECT USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );
CREATE POLICY "service role all" ON results
  USING (auth.role() = 'service_role');

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON questions FOR SELECT USING (true);

ALTER TABLE question_construct_pairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role all" ON question_construct_pairs
  USING (auth.role() = 'service_role');

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own" ON profiles FOR UPDATE USING (auth.uid() = user_id);
```

- [ ] **Step 2: Apply migration via Supabase MCP**

Use the Supabase MCP tool `apply_migration` with the SQL above. Provide:
- `project_id`: from Supabase dashboard URL
- `name`: `001_schema`
- `query`: full SQL content above

Verify all 5 tables created with no errors.

- [ ] **Step 3: Commit migration file**

```bash
git add supabase/migrations/001_schema.sql
git commit -m "feat: database schema with RLS policies"
```

---

### Task 6: lib/questions.ts — 82-question bank

**Files:**
- Create: `lib/questions.ts`

The 82 questions cover 29 dimensions across 8 types. Below is the full structure with all 82 questions. Each question has:
- `code`: stable slug like `O_01` (Openness q1), `CA_03` (Cognitive Agility q3)
- `calibration: true` for the first question per dimension (29 questions) + 11 additional calibration questions for higher-frequency dimensions
- `order_index`: sequential within dimension (lower = served first)

Dimension code prefixes: O=openness, C=conscientiousness, E=extraversion, A=agreeableness, ES=emotional_stability, HH=honesty_humility, CA=cognitive_agility, EF=executive_function, AC=attention_control, ST=systems_thinking, CI=creative_intelligence, AD=achievement_drive, RT=risk_tolerance, AN=autonomy_need, PO=purpose_orientation, CD=competitive_drive, SI=social_influence, CN=conflict_navigation, CS=communication_style, CO=collaboration_signature, LD=leadership_drive, SO=strategic_orientation, SG=specialist_generalist, II=innovation_index, PR=psychological_resilience, GM=growth_mindset, AQ=adaptability_quotient, LA=learning_agility

- [ ] **Step 1: Create lib/questions.ts** with the full 82-question array. Below is the complete set:

```typescript
// lib/questions.ts
import type { Question } from './types'

export const QUESTIONS: Question[] = [
  // === TIER 1: CORE PERSONALITY ===

  // Openness (3 questions)
  { id: '', code: 'O_01', text: 'I enjoy exploring abstract ideas and concepts.', type: 'likert', dimension: 'openness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'O_02', text: 'I prefer concrete, practical tasks over theoretical ones.', type: 'likert', dimension: 'openness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'O_03', text: 'When given free time, which would you rather do?', type: 'forced_choice', dimension: 'openness', tier: 1, options: { a: 'Read about a familiar topic I know well', b: 'Explore a completely new subject I know nothing about' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Conscientiousness (3 questions)
  { id: '', code: 'C_01', text: 'I complete tasks thoroughly, even when no one is watching.', type: 'likert', dimension: 'conscientiousness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'C_02', text: 'How often do you follow through on commitments you make to yourself?', type: 'frequency', dimension: 'conscientiousness', tier: 1, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'C_03', text: 'I tend to leave tasks unfinished when they become difficult.', type: 'likert', dimension: 'conscientiousness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 3, is_active: true },

  // Extraversion (3 questions)
  { id: '', code: 'E_01', text: 'Social gatherings energize rather than drain me.', type: 'likert', dimension: 'extraversion', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'E_02', text: 'After a long day of meetings, I feel:', type: 'forced_choice', dimension: 'extraversion', tier: 1, options: { a: 'Drained and need quiet time alone', b: 'Energized and ready for more conversation' }, weight: 1.2, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'E_03', text: 'How often do you initiate conversations with people you don\'t know?', type: 'frequency', dimension: 'extraversion', tier: 1, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Agreeableness (3 questions)
  { id: '', code: 'A_01', text: 'I find it easy to see situations from other people\'s perspectives.', type: 'likert', dimension: 'agreeableness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'A_02', text: 'I prioritize team harmony even when I disagree with the direction.', type: 'likert', dimension: 'agreeableness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'A_03', text: 'Your team disagrees with your recommendation. You:', type: 'situational', dimension: 'agreeableness', tier: 1, options: { scenario: 'Your team strongly disagrees with your recommendation.', choices: ['A: Stand firm — you\'ve done the analysis', 'B: Find a compromise that partially addresses both views', 'C: Defer to the team — consensus matters more', 'D: Escalate to leadership to decide'], scores: [1, 3.7, 5, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Emotional Stability (3 questions)
  { id: '', code: 'ES_01', text: 'I remain calm when things go wrong unexpectedly.', type: 'likert', dimension: 'emotional_stability', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'ES_02', text: 'I worry about making mistakes even after the fact.', type: 'likert', dimension: 'emotional_stability', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'ES_03', text: 'How quickly do you recover emotionally from a setback at work?', type: 'frequency', dimension: 'emotional_stability', tier: 1, options: { labels: ['Very Slowly (days)','Slowly','Moderately','Quickly','Very Quickly (hours)'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Honesty-Humility (3 questions)
  { id: '', code: 'HH_01', text: 'I avoid taking credit for outcomes that involved significant help from others.', type: 'likert', dimension: 'honesty_humility', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'HH_02', text: 'I would bend rules slightly if I was confident no one would find out.', type: 'likert', dimension: 'honesty_humility', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'HH_03', text: 'Which matters more to you?', type: 'forced_choice', dimension: 'honesty_humility', tier: 1, options: { a: 'Being seen as successful and impressive', b: 'Acting with integrity even when it costs you' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 2: COGNITIVE ARCHITECTURE ===

  // Cognitive Agility (3 questions)
  { id: '', code: 'CA_01', text: 'I enjoy switching between different types of problems rapidly.', type: 'likert', dimension: 'cognitive_agility', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CA_02', text: 'You have 60 seconds to decide which abstract pattern completes the sequence:', type: 'timed', dimension: 'cognitive_agility', tier: 2, options: { scenario: 'Rank the options by how logically they complete the pattern: Circle-Square-Triangle-?', choices: ['A: Pentagon (adds sides)', 'B: Circle (repeats first)', 'C: Star (breaks pattern)', 'D: Hexagon (adds sides differently)'], scores: [5, 2.3, 1, 3.7] }, weight: 1.3, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CA_03', text: 'When facing a complex problem, I naturally break it into components.', type: 'likert', dimension: 'cognitive_agility', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Executive Function (3 questions)
  { id: '', code: 'EF_01', text: 'I can keep multiple competing priorities organized without losing track.', type: 'likert', dimension: 'executive_function', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'EF_02', text: 'How often do you start a task but get pulled to another before finishing?', type: 'frequency', dimension: 'executive_function', tier: 2, options: { labels: ['Almost Always','Usually','Sometimes','Rarely','Almost Never'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'EF_03', text: 'You have 3 deadlines tomorrow and an unexpected crisis today. You:', type: 'timed', dimension: 'executive_function', tier: 2, options: { scenario: 'Three deadlines tomorrow, unexpected crisis today.', choices: ['A: Handle the crisis first, then work late on deadlines', 'B: Triage — delegate the crisis, protect the most critical deadline', 'C: Communicate delays proactively, focus on the crisis', 'D: Push through all simultaneously'], scores: [2.3, 5, 3.7, 1] }, weight: 1.3, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Attention Control (3 questions)
  { id: '', code: 'AC_01', text: 'I can focus deeply for hours without needing breaks.', type: 'likert', dimension: 'attention_control', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AC_02', text: 'Notifications and interruptions significantly disrupt my concentration.', type: 'likert', dimension: 'attention_control', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AC_03', text: 'How often do you achieve a state of deep focus (flow) at work?', type: 'frequency', dimension: 'attention_control', tier: 2, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Systems Thinking (3 questions)
  { id: '', code: 'ST_01', text: 'When analyzing a problem, I naturally consider second and third-order effects.', type: 'likert', dimension: 'systems_thinking', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'ST_02', text: 'I find it easy to identify the root cause of complex organizational problems.', type: 'likert', dimension: 'systems_thinking', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'ST_03', text: 'Rank these approaches to solving a recurring team problem:', type: 'rank_order', dimension: 'systems_thinking', tier: 2, options: { items: ['Map the system to find root cause', 'Fix the immediate symptom quickly', 'Ask why 5 times before acting', 'Try multiple solutions in parallel'], target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Creative Intelligence (3 questions)
  { id: '', code: 'CI_01', text: 'I regularly make unexpected connections between unrelated fields.', type: 'likert', dimension: 'creative_intelligence', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CI_02', text: 'When brainstorming, I generate more ideas than I could ever use.', type: 'likert', dimension: 'creative_intelligence', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CI_03', text: 'Which visual pattern feels most natural to your thinking style?', type: 'visual', dimension: 'creative_intelligence', tier: 2, options: { images: ['visual_q1_a.svg','visual_q1_b.svg','visual_q1_c.svg','visual_q1_d.svg'], scores: [3, 5, 1, 4] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 3: MOTIVATIONAL DNA ===

  // Achievement Drive (3 questions)
  { id: '', code: 'AD_01', text: 'I push myself to exceed expectations, not just meet them.', type: 'likert', dimension: 'achievement_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AD_02', text: 'Allocate 100 points across what motivates you most at work:', type: 'allocation', dimension: 'achievement_drive', tier: 3, options: { items: ['Achieving excellence', 'Being liked by colleagues', 'Financial reward', 'Making an impact'], total: 100, target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AD_03', text: 'I feel restless when I\'m not working toward a challenging goal.', type: 'likert', dimension: 'achievement_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Risk Tolerance (3 questions)
  { id: '', code: 'RT_01', text: 'I would rather pursue a 30% chance at $100K than a guaranteed $25K.', type: 'likert', dimension: 'risk_tolerance', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'RT_02', text: 'A promising startup offers you equity + lower base salary. Your current job is stable. You:', type: 'situational', dimension: 'risk_tolerance', tier: 3, options: { scenario: 'A promising startup offers equity + lower salary vs your stable current job.', choices: ['A: Decline — stability is more valuable', 'B: Ask for more data before deciding', 'C: Negotiate a transition period, then join', 'D: Join immediately — upside is worth it'], scores: [1, 2.3, 3.7, 5] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'RT_03', text: 'How often do you make significant decisions with incomplete information?', type: 'frequency', dimension: 'risk_tolerance', tier: 3, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Autonomy Need (3 questions)
  { id: '', code: 'AN_01', text: 'I do my best work when I have full control over how I approach a task.', type: 'likert', dimension: 'autonomy_need', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AN_02', text: 'Frequent check-ins and status updates help me stay on track.', type: 'likert', dimension: 'autonomy_need', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AN_03', text: 'Which working structure do you prefer?', type: 'forced_choice', dimension: 'autonomy_need', tier: 3, options: { a: 'Clear expectations, regular feedback, team accountability', b: 'Open mandate, self-directed priorities, minimal oversight' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Purpose Orientation (3 questions)
  { id: '', code: 'PO_01', text: 'I need my work to contribute to something larger than personal gain.', type: 'likert', dimension: 'purpose_orientation', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'PO_02', text: 'Allocate 100 points across what you\'d want your legacy to reflect:', type: 'allocation', dimension: 'purpose_orientation', tier: 3, options: { items: ['Making a meaningful difference', 'Building wealth', 'Achieving recognition', 'Mastering a craft'], total: 100, target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'PO_03', text: 'A high-paying job with no clear social impact would feel unfulfilling to me.', type: 'likert', dimension: 'purpose_orientation', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Competitive Drive (3 questions)
  { id: '', code: 'CD_01', text: 'Knowing others are ahead of me motivates me to work harder.', type: 'likert', dimension: 'competitive_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CD_02', text: 'I keep track of how my performance compares to peers and benchmarks.', type: 'frequency', dimension: 'competitive_drive', tier: 3, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CD_03', text: 'Winning matters more to me than just participating.', type: 'likert', dimension: 'competitive_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 4: BEHAVIORAL EXPRESSION ===

  // Social Influence (3 questions)
  { id: '', code: 'SI_01', text: 'I naturally take the lead in group discussions.', type: 'likert', dimension: 'social_influence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'SI_02', text: 'People often adopt my recommendations without much persuasion.', type: 'likert', dimension: 'social_influence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'SI_03', text: 'Rank your preferred approach to getting buy-in from stakeholders:', type: 'rank_order', dimension: 'social_influence', tier: 4, options: { items: ['Present data and let it speak', 'Tell a compelling story', 'Build relationships first', 'Make it their idea'], target_item_index: 1 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Conflict Navigation (3 questions)
  { id: '', code: 'CN_01', text: 'I address disagreements directly rather than avoiding them.', type: 'likert', dimension: 'conflict_navigation', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CN_02', text: 'A colleague publicly criticizes your work in a meeting. You:', type: 'situational', dimension: 'conflict_navigation', tier: 4, options: { scenario: 'A colleague publicly criticizes your work during a team meeting.', choices: ['A: Stay silent — address it privately later', 'B: Calmly defend your work with evidence in the moment', 'C: Ask clarifying questions to understand their concern', 'D: Acknowledge the critique and commit to improvement'], scores: [1, 5, 3.7, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CN_03', text: 'I find it uncomfortable to push back on someone senior to me.', type: 'likert', dimension: 'conflict_navigation', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 3, is_active: true },

  // Communication Style (3 questions)
  { id: '', code: 'CS_01', text: 'I prefer data-backed arguments over emotionally resonant stories.', type: 'likert', dimension: 'communication_style', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CS_02', text: 'When presenting, I lead with the human story rather than the metrics.', type: 'likert', dimension: 'communication_style', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CS_03', text: 'Which visual pattern feels most natural to your communication style?', type: 'visual', dimension: 'communication_style', tier: 4, options: { images: ['visual_q2_a.svg','visual_q2_b.svg','visual_q2_c.svg','visual_q2_d.svg'], scores: [1, 3, 5, 4] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Collaboration Signature (3 questions)
  { id: '', code: 'CO_01', text: 'I produce my best work independently rather than in groups.', type: 'likert', dimension: 'collaboration_signature', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CO_02', text: 'Allocate 100 points across your preferred working modes:', type: 'allocation', dimension: 'collaboration_signature', tier: 4, options: { items: ['Solo deep work', 'Collaborative team sessions', 'Pair/duo work', 'Large group workshops'], total: 100, target_item_index: 1 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CO_03', text: 'I feel more productive in a team environment than working alone.', type: 'likert', dimension: 'collaboration_signature', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 5: LEADERSHIP & CAREER ===

  // Leadership Drive (3 questions)
  { id: '', code: 'LD_01', text: 'I naturally step up to lead when a group lacks direction.', type: 'likert', dimension: 'leadership_drive', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'LD_02', text: 'I prefer being in a position where I set direction rather than execute it.', type: 'likert', dimension: 'leadership_drive', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'LD_03', text: 'Rank your preference for role in a new initiative:', type: 'rank_order', dimension: 'leadership_drive', tier: 5, options: { items: ['Lead it — set vision and strategy', 'Execute it — deliver with excellence', 'Advise it — provide expertise', 'Support it — enable others to succeed'], target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Strategic Orientation (3 questions)
  { id: '', code: 'SO_01', text: 'I think in years and decades rather than weeks and months.', type: 'likert', dimension: 'strategic_orientation', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'SO_02', text: 'I get more energy from defining where we\'re going than from optimizing current operations.', type: 'likert', dimension: 'strategic_orientation', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'SO_03', text: 'A competitor launches a superior product. You prioritize:', type: 'situational', dimension: 'strategic_orientation', tier: 5, options: { scenario: 'A competitor just launched a superior product in your market.', choices: ['A: Respond tactically — improve your current product quickly', 'B: Reframe the market — position around a different dimension', 'C: Analyze long-term — is this category worth winning?', 'D: Accelerate roadmap — execute planned strategy faster'], scores: [1, 3.7, 5, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Specialist-Generalist (2 questions)
  { id: '', code: 'SG_01', text: 'I prefer going very deep in one domain over being broadly competent across many.', type: 'likert', dimension: 'specialist_generalist', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'SG_02', text: 'Which do you find more valuable in your career so far?', type: 'forced_choice', dimension: 'specialist_generalist', tier: 5, options: { a: 'Developing deep expertise in my core domain', b: 'Building diverse skills across many domains' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },

  // Innovation Index (3 questions)
  { id: '', code: 'II_01', text: 'I am drawn to problems that have no established solutions.', type: 'likert', dimension: 'innovation_index', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'II_02', text: 'I get frustrated when teams resist new approaches in favor of "how we\'ve always done it."', type: 'likert', dimension: 'innovation_index', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'II_03', text: 'Which visual pattern most represents your approach to innovation?', type: 'visual', dimension: 'innovation_index', tier: 5, options: { images: ['visual_q3_a.svg','visual_q3_b.svg','visual_q3_c.svg','visual_q3_d.svg'], scores: [2, 5, 3, 1] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 6: RESILIENCE & GROWTH ===

  // Psychological Resilience (3 questions)
  { id: '', code: 'PR_01', text: 'After a major failure, I recover and try again relatively quickly.', type: 'likert', dimension: 'psychological_resilience', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'PR_02', text: 'Your most important project fails publicly. You:', type: 'situational', dimension: 'psychological_resilience', tier: 6, options: { scenario: 'Your most important project fails publicly and visibly.', choices: ['A: Withdraw temporarily to process and recover', 'B: Immediately analyze what went wrong and share learnings', 'C: Reframe it as a stepping stone and move forward', 'D: Double down — find a way to salvage or rebuild'], scores: [1, 3.7, 5, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'PR_03', text: 'I use setbacks as learning opportunities more than as sources of discouragement.', type: 'likert', dimension: 'psychological_resilience', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Growth Mindset (3 questions)
  { id: '', code: 'GM_01', text: 'I believe my core abilities can be substantially developed with effort.', type: 'likert', dimension: 'growth_mindset', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'GM_02', text: 'How often do you deliberately seek out difficult challenges to grow?', type: 'frequency', dimension: 'growth_mindset', tier: 6, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'GM_03', text: 'Which do you believe more strongly?', type: 'forced_choice', dimension: 'growth_mindset', tier: 6, options: { a: 'People have a natural ceiling on how much they can change', b: 'With the right approach, anyone can develop almost any skill' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Adaptability Quotient (3 questions)
  { id: '', code: 'AQ_01', text: 'I thrive in rapidly changing environments.', type: 'likert', dimension: 'adaptability_quotient', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AQ_02', text: 'Unexpected pivots in direction energize rather than frustrate me.', type: 'likert', dimension: 'adaptability_quotient', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AQ_03', text: 'Rank these scenarios by how comfortable you\'d feel:', type: 'rank_order', dimension: 'adaptability_quotient', tier: 6, options: { items: ['Your role scope doubles unexpectedly', 'Your team restructures with a new manager', 'Your company pivots to a new market', 'Your project scope is cut in half'], target_item_index: 2 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Learning Agility (3 questions)
  { id: '', code: 'LA_01', text: 'I can become reasonably proficient at a new skill within weeks.', type: 'likert', dimension: 'learning_agility', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'LA_02', text: 'How quickly do you typically feel productive in a completely new domain?', type: 'frequency', dimension: 'learning_agility', tier: 6, options: { labels: ['Very Slowly (months)','Slowly','Moderately','Quickly','Very Quickly (weeks)'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'LA_03', text: 'Which visual pattern best represents how you learn new things?', type: 'visual', dimension: 'learning_agility', tier: 6, options: { images: ['visual_q4_a.svg','visual_q4_b.svg','visual_q4_c.svg','visual_q4_d.svg'], scores: [3, 1, 5, 2] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
]

// Construct pairs: same-construct question pairs for inconsistency detection
export const CONSTRUCT_PAIRS: Array<{ questionA: string; questionB: string }> = [
  { questionA: 'O_01', questionB: 'O_02' },       // openness pair
  { questionA: 'C_01', questionB: 'C_03' },       // conscientiousness pair
  { questionA: 'E_01', questionB: 'E_02' },       // extraversion pair
  { questionA: 'ES_01', questionB: 'ES_02' },     // emotional stability pair
  { questionA: 'HH_01', questionB: 'HH_02' },     // honesty-humility pair
  { questionA: 'EF_01', questionB: 'EF_02' },     // executive function pair
  { questionA: 'AC_01', questionB: 'AC_02' },     // attention control pair
  { questionA: 'AN_01', questionB: 'AN_02' },     // autonomy need pair
  { questionA: 'CN_01', questionB: 'CN_03' },     // conflict navigation pair
  { questionA: 'CS_01', questionB: 'CS_02' },     // communication style pair
  { questionA: 'CO_01', questionB: 'CO_03' },     // collaboration pair
  { questionA: 'SG_01', questionB: 'SG_02' },     // specialist-generalist pair
  { questionA: 'GM_01', questionB: 'GM_03' },     // growth mindset pair
]

// Calibration coverage: 29 dimensions × 1 base question + 11 high-priority extras = 40 total calibration questions.
// All calibration flags are already set in the array above.
```

- [ ] **Step 2: Verify question count**

```bash
# Count questions in the file
grep -c "code: '" lib/questions.ts
```
Expected: 82 (check each dimension has correct count)

- [ ] **Step 3: Create seed script**

```typescript
// scripts/seed-questions.ts
import { createClient } from '@supabase/supabase-js'
import { QUESTIONS, CONSTRUCT_PAIRS } from '../lib/questions'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  // Upsert questions (strip id field — DB generates it)
  const rows = QUESTIONS.map(({ id: _id, ...q }) => q)
  const { error: qErr } = await supabase.from('questions').upsert(rows, { onConflict: 'code' })
  if (qErr) throw qErr
  console.log(`Seeded ${rows.length} questions`)

  // Upsert construct pairs
  const { error: pErr } = await supabase.from('question_construct_pairs')
    .upsert(CONSTRUCT_PAIRS.map(p => ({ question_a: p.questionA, question_b: p.questionB })))
  if (pErr) throw pErr
  console.log(`Seeded ${CONSTRUCT_PAIRS.length} construct pairs`)
}

seed().catch(console.error)
```

- [ ] **Step 4: Run seed script**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx ts-node --project tsconfig.json scripts/seed-questions.ts
```

Expected: "Seeded 82 questions" + "Seeded 13 construct pairs"

- [ ] **Step 5: Commit**

```bash
git add lib/questions.ts scripts/seed-questions.ts
git commit -m "feat: 82-question bank with construct pairs + seed script"
```

---

## Chunk 4: Core Logic Libraries

### Task 7: lib/norms.ts + tests

**Files:**
- Create: `lib/norms.ts`
- Create: `__tests__/norms.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// __tests__/norms.test.ts
import { getPercentile } from '@/lib/norms'

describe('getPercentile', () => {
  it('returns 50 for median openness score of 55', () => {
    expect(getPercentile('openness', 55)).toBe(50)
  })
  it('returns 1 for score of 0', () => {
    expect(getPercentile('openness', 0)).toBe(1)
  })
  it('returns 99 for score of 100', () => {
    expect(getPercentile('openness', 100)).toBe(99)
  })
  it('interpolates linearly between breakpoints', () => {
    // Between score 45 (p25) and 55 (p50): score 50 → p37.5
    expect(getPercentile('openness', 50)).toBeCloseTo(37.5, 0)
  })
  it('throws for unknown dimension', () => {
    expect(() => getPercentile('nonexistent', 50)).toThrow()
  })
})
```

- [ ] **Step 2: Run test — verify fails**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx jest __tests__/norms.test.ts
```
Expected: FAIL (module not found)

- [ ] **Step 3: Implement lib/norms.ts**

```typescript
// lib/norms.ts
type NormTable = Record<string, Array<{ score: number; percentile: number }>>

// Breakpoints from published Big Five / HEXACO normative literature (general adult population)
const NORMS: NormTable = {
  openness:             [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 45, percentile: 25 },{ score: 55, percentile: 50 },{ score: 65, percentile: 75 },{ score: 75, percentile: 90 },{ score: 100, percentile: 99 }],
  conscientiousness:    [{ score: 0, percentile: 1 },{ score: 35, percentile: 10 },{ score: 50, percentile: 25 },{ score: 60, percentile: 50 },{ score: 72, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  extraversion:         [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 55, percentile: 50 },{ score: 68, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  agreeableness:        [{ score: 0, percentile: 1 },{ score: 38, percentile: 10 },{ score: 52, percentile: 25 },{ score: 63, percentile: 50 },{ score: 74, percentile: 75 },{ score: 84, percentile: 90 },{ score: 100, percentile: 99 }],
  emotional_stability:  [{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 40, percentile: 25 },{ score: 55, percentile: 50 },{ score: 68, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  honesty_humility:     [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 48, percentile: 25 },{ score: 60, percentile: 50 },{ score: 72, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  cognitive_agility:    [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 55, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  executive_function:   [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 44, percentile: 25 },{ score: 57, percentile: 50 },{ score: 69, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  attention_control:    [{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 40, percentile: 25 },{ score: 53, percentile: 50 },{ score: 66, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  systems_thinking:     [{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 53, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  creative_intelligence:[{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 38, percentile: 25 },{ score: 51, percentile: 50 },{ score: 64, percentile: 75 },{ score: 76, percentile: 90 },{ score: 100, percentile: 99 }],
  achievement_drive:    [{ score: 0, percentile: 1 },{ score: 32, percentile: 10 },{ score: 47, percentile: 25 },{ score: 60, percentile: 50 },{ score: 73, percentile: 75 },{ score: 83, percentile: 90 },{ score: 100, percentile: 99 }],
  risk_tolerance:       [{ score: 0, percentile: 1 },{ score: 22, percentile: 10 },{ score: 36, percentile: 25 },{ score: 50, percentile: 50 },{ score: 64, percentile: 75 },{ score: 76, percentile: 90 },{ score: 100, percentile: 99 }],
  autonomy_need:        [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 56, percentile: 50 },{ score: 69, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  purpose_orientation:  [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 46, percentile: 25 },{ score: 59, percentile: 50 },{ score: 72, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  competitive_drive:    [{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  social_influence:     [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 55, percentile: 50 },{ score: 68, percentile: 75 },{ score: 79, percentile: 90 },{ score: 100, percentile: 99 }],
  conflict_navigation:  [{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 53, percentile: 50 },{ score: 66, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  communication_style:  [{ score: 0, percentile: 1 },{ score: 18, percentile: 10 },{ score: 30, percentile: 25 },{ score: 50, percentile: 50 },{ score: 70, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  collaboration_signature:[{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  leadership_drive:     [{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  founder_potential:    [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 33, percentile: 25 },{ score: 48, percentile: 50 },{ score: 62, percentile: 75 },{ score: 75, percentile: 90 },{ score: 100, percentile: 99 }],
  strategic_orientation:[{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  specialist_generalist:[{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  innovation_index:     [{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  psychological_resilience:[{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  growth_mindset:       [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 44, percentile: 25 },{ score: 58, percentile: 50 },{ score: 71, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  adaptability_quotient:[{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 76, percentile: 90 },{ score: 100, percentile: 99 }],
  learning_agility:     [{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
}

export function getPercentile(dimension: string, score: number): number {
  const table = NORMS[dimension]
  if (!table) throw new Error(`Unknown dimension: ${dimension}`)
  const clamped = Math.max(0, Math.min(100, score))
  for (let i = 0; i < table.length - 1; i++) {
    const lo = table[i], hi = table[i + 1]
    if (clamped >= lo.score && clamped <= hi.score) {
      const t = (clamped - lo.score) / (hi.score - lo.score)
      return Math.round(lo.percentile + t * (hi.percentile - lo.percentile))
    }
  }
  return table[table.length - 1].percentile
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx jest __tests__/norms.test.ts
```
Expected: 5 tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/norms.ts __tests__/norms.test.ts
git commit -m "feat: normative percentile lookup with linear interpolation"
```

---

### Task 8: lib/scoring.ts + tests

**Files:**
- Create: `lib/scoring.ts`
- Create: `__tests__/scoring.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/scoring.test.ts
import { extractRawValue, computeScores } from '@/lib/scoring'
import type { Question, Response } from '@/lib/types'

const likertQ: Question = {
  id: '1', code: 'O_01', text: '', type: 'likert', dimension: 'openness',
  tier: 1, options: { labels: [] }, weight: 1.0, reverse_scored: false,
  calibration: true, order_index: 1, is_active: true
}

describe('extractRawValue', () => {
  it('returns numeric value directly for likert', () => {
    expect(extractRawValue({ ...likertQ, type: 'likert' }, 4)).toBe(4)
  })
  it('reverses score for reverse_scored likert', () => {
    expect(extractRawValue({ ...likertQ, reverse_scored: true }, 4)).toBe(2)
  })
  it('maps forced_choice: a=1, b=5', () => {
    const q: Question = { ...likertQ, type: 'forced_choice', options: { a: 'X', b: 'Y' } }
    expect(extractRawValue(q, 'a')).toBe(1)
    expect(extractRawValue(q, 'b')).toBe(5)
  })
  it('maps rank_order: rank1→5, rank2→3.7, rank3→2.3, rank4→1', () => {
    const q: Question = { ...likertQ, type: 'rank_order', options: { items: [], target_item_index: 0 } }
    expect(extractRawValue(q, 1)).toBe(5)
    expect(extractRawValue(q, 2)).toBe(3.7)
    expect(extractRawValue(q, 3)).toBe(2.3)
    expect(extractRawValue(q, 4)).toBe(1)
  })
  it('maps allocation: value/100*5', () => {
    const q: Question = { ...likertQ, type: 'allocation', options: { items: [], total: 100, target_item_index: 0 } }
    expect(extractRawValue(q, 60)).toBeCloseTo(3.0)
  })
  it('maps situational by index into options.scores', () => {
    const q: Question = { ...likertQ, type: 'situational', options: { scenario: '', choices: [], scores: [1, 2.3, 3.7, 5] } }
    expect(extractRawValue(q, 2)).toBe(3.7)
  })
})

describe('computeScores', () => {
  it('computes dimension score as 0-100', () => {
    const responses: Response[] = [
      { questionCode: 'O_01', value: 4, responseTimeMs: 2000, revised: false, dimension: 'openness' },
      { questionCode: 'O_02', value: 5, responseTimeMs: 1500, revised: false, dimension: 'openness' },
    ]
    const questions = [
      { ...likertQ, code: 'O_01' },
      { ...likertQ, code: 'O_02', reverse_scored: true },
    ]
    const scores = computeScores(responses, questions)
    // O_01: raw=4, weight=1 → 4; O_02: reverse 5→1, weight=1 → 1; total=5, max=10 → 50%
    expect(scores.openness).toBe(50)
  })
})
```

- [ ] **Step 2: Run test — verify fails**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx jest __tests__/scoring.test.ts
```
Expected: FAIL

- [ ] **Step 3: Implement lib/scoring.ts**

```typescript
// lib/scoring.ts
import type { Question, Response, DimensionScores } from './types'

const RANK_MAP: Record<number, number> = { 1: 5, 2: 3.7, 3: 2.3, 4: 1 }

export function extractRawValue(question: Question, value: unknown): number {
  let raw: number
  switch (question.type) {
    case 'likert':
    case 'frequency':
      raw = Number(value)
      break
    case 'forced_choice':
      raw = value === 'a' ? 1 : 5
      break
    case 'situational':
    case 'timed': {
      const idx = Number(value)
      raw = question.options.scores![idx]
      break
    }
    case 'rank_order':
      raw = RANK_MAP[Number(value)] ?? 1
      break
    case 'allocation':
      raw = (Number(value) / 100) * 5
      break
    case 'visual': {
      const idx = Number(value)
      raw = question.options.scores![idx]
      break
    }
    default:
      raw = Number(value)
  }
  return question.reverse_scored ? 6 - raw : raw
}

export function computeScores(
  responses: Response[],
  questions: Question[]
): Partial<DimensionScores> {
  const qMap = new Map(questions.map(q => [q.code, q]))
  const byDimension = new Map<string, { weighted: number; maxPossible: number }>()

  for (const r of responses) {
    const q = qMap.get(r.questionCode)
    if (!q) continue
    const raw = extractRawValue(q, r.value)
    const weighted = raw * q.weight
    const max = 5 * q.weight
    const entry = byDimension.get(q.dimension) ?? { weighted: 0, maxPossible: 0 }
    byDimension.set(q.dimension, {
      weighted: entry.weighted + weighted,
      maxPossible: entry.maxPossible + max,
    })
  }

  const scores: Partial<DimensionScores> = {}
  for (const [dim, { weighted, maxPossible }] of byDimension) {
    scores[dim as keyof DimensionScores] = Math.round((weighted / maxPossible) * 100)
  }
  return scores
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx jest __tests__/scoring.test.ts
```
Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add lib/scoring.ts __tests__/scoring.test.ts
git commit -m "feat: scoring engine with per-type value extraction"
```

---

### Task 9: lib/inference.ts + tests

**Files:**
- Create: `lib/inference.ts`
- Create: `__tests__/inference.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/inference.test.ts
import { computeInference } from '@/lib/inference'

const baseInput = {
  responses: [
    { questionCode: 'O_01', value: 4, responseTimeMs: 1000, revised: false, dimension: 'openness' },
    { questionCode: 'O_02', value: 1, responseTimeMs: 1200, revised: false, dimension: 'openness' },
    { questionCode: 'C_01', value: 5, responseTimeMs: 900, revised: true, dimension: 'conscientiousness' },
  ],
  constructPairs: [{ questionA: 'O_01', questionB: 'O_02' }],
}

describe('computeInference', () => {
  it('computes avgResponseMs correctly', () => {
    const result = computeInference(baseInput)
    expect(result.avgResponseMs).toBeCloseTo((1000 + 1200 + 900) / 3, 0)
  })
  it('computes revisionRate as proportion of revised', () => {
    const result = computeInference(baseInput)
    expect(result.revisionRate).toBeCloseTo(1 / 3, 2)
  })
  it('detects inconsistency: O_01=4 (norm 0.75) vs O_02=1 (norm 0) → diff=0.75 > 0.6', () => {
    const result = computeInference(baseInput)
    expect(result.consistencyScore).toBeLessThan(1)
  })
  it('applies consistency penalty when inconsistency rate > 0.3', () => {
    // 1 pair, 1 inconsistent → rate = 1.0 > 0.3 → penalty = -5
    const result = computeInference(baseInput)
    expect(result.consistencyPenalty).toBe(-5)
  })
  it('applies speedModifier +2 for fast responses < 800ms median', () => {
    const fastInput = {
      responses: baseInput.responses.map(r => ({ ...r, responseTimeMs: 500 })),
      constructPairs: [],
    }
    expect(computeInference(fastInput).speedModifier).toBe(2)
  })
  it('applies speedModifier -2 for slow responses > 8000ms median', () => {
    const slowInput = {
      responses: baseInput.responses.map(r => ({ ...r, responseTimeMs: 9000 })),
      constructPairs: [],
    }
    expect(computeInference(slowInput).speedModifier).toBe(-2)
  })
})
```

- [ ] **Step 2: Run test — verify fails**

```bash
npx jest __tests__/inference.test.ts
```

- [ ] **Step 3: Implement lib/inference.ts**

```typescript
// lib/inference.ts
import type { InferenceOutput } from './types'

interface InferenceInput {
  responses: Array<{
    questionCode: string; value: number; responseTimeMs: number
    revised: boolean; dimension: string
  }>
  constructPairs: Array<{ questionA: string; questionB: string }>
}

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function computeInference(input: InferenceInput): InferenceOutput {
  const { responses, constructPairs } = input
  if (responses.length === 0) {
    return { avgResponseMs: 0, revisionRate: 0, consistencyScore: 1, speedModifier: 0, consistencyPenalty: 0 }
  }

  const times = responses.map(r => r.responseTimeMs)
  const avgResponseMs = times.reduce((s, t) => s + t, 0) / times.length
  const revisionRate = responses.filter(r => r.revised).length / responses.length

  const valueMap = new Map(responses.map(r => [r.questionCode, r.value]))
  let inconsistentCount = 0
  for (const { questionA, questionB } of constructPairs) {
    const a = valueMap.get(questionA)
    const b = valueMap.get(questionB)
    if (a !== undefined && b !== undefined) {
      const normA = (a - 1) / 4  // normalize 1-5 → 0-1
      const normB = (b - 1) / 4
      if (Math.abs(normA - normB) > 0.6) inconsistentCount++
    }
  }

  const inconsistencyRate = constructPairs.length > 0 ? inconsistentCount / constructPairs.length : 0
  const consistencyScore = 1 - inconsistencyRate
  const consistencyPenalty = inconsistencyRate > 0.3 ? -5 : 0

  const med = median(times)
  const speedModifier = med < 800 ? 2 : med > 8000 ? -2 : 0

  return { avgResponseMs, revisionRate, consistencyScore, speedModifier, consistencyPenalty }
}
```

- [ ] **Step 4: Run test — verify passes**

```bash
npx jest __tests__/inference.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/inference.ts __tests__/inference.test.ts
git commit -m "feat: behavioral inference engine (consistency + speed modifiers)"
```

---

### Task 10: lib/hpif.ts + lib/archetypes.ts + tests

**Files:**
- Create: `lib/hpif.ts`
- Create: `lib/archetypes.ts`
- Create: `__tests__/hpif.test.ts`
- Create: `__tests__/archetypes.test.ts`

- [ ] **Step 1: Write failing tests for hpif**

```typescript
// __tests__/hpif.test.ts
import { computeHpif } from '@/lib/hpif'
import type { DimensionScores } from '@/lib/types'

const mockScores: DimensionScores = {
  openness: 80, conscientiousness: 75, extraversion: 60, agreeableness: 70,
  emotional_stability: 65, honesty_humility: 72, cognitive_agility: 78,
  executive_function: 74, attention_control: 68, systems_thinking: 82,
  creative_intelligence: 76, achievement_drive: 85, risk_tolerance: 70,
  autonomy_need: 65, purpose_orientation: 88, competitive_drive: 72,
  social_influence: 65, conflict_navigation: 60, communication_style: 45,
  collaboration_signature: 58, leadership_drive: 78, founder_potential: 0, // computed
  strategic_orientation: 80, specialist_generalist: 60, innovation_index: 74,
  psychological_resilience: 72, growth_mindset: 85, adaptability_quotient: 70,
  learning_agility: 76,
}

describe('computeHpif', () => {
  it('computes founder_potential as mean of 4 dimensions', () => {
    const result = computeHpif(mockScores)
    const expected = Math.round((70 + 76 + 72 + 85) / 4) // risk+creative+resilience+achievement
    expect(result.scores.founder_potential).toBe(expected)
  })
  it('assigns cognitive_operating_system.primary_style "Analytical-Convergent" for composite >= 70', () => {
    const result = computeHpif(mockScores)
    // cognitive composite = mean(78, 74, 68) = 73.3
    expect(result.hpif.cognitive_operating_system.primary_style).toBe('Analytical-Convergent')
    expect(result.hpif.cognitive_operating_system.composite).toBeGreaterThanOrEqual(70)
  })
  it('assigns leadership_tier "Visionary" for leadership_drive >= 80', () => {
    const highLD = { ...mockScores, leadership_drive: 82 }
    const result = computeHpif(highLD)
    expect(result.hpif.career_potential_matrix.leadership_tier).toBe('Visionary')
  })
  it('assigns founder_tier based on founder_potential score', () => {
    const result = computeHpif(mockScores)
    const fp = result.scores.founder_potential
    if (fp >= 80) expect(result.hpif.career_potential_matrix.founder_tier).toBe('Serial Founder')
    else if (fp >= 60) expect(result.hpif.career_potential_matrix.founder_tier).toBe('Founder')
    else if (fp >= 40) expect(result.hpif.career_potential_matrix.founder_tier).toBe('Builder')
    else expect(result.hpif.career_potential_matrix.founder_tier).toBe('Operator')
  })
  it('derives remote_orientation from autonomy_need', () => {
    const result = computeHpif(mockScores) // autonomy_need=65 → Hybrid
    expect(result.hpif.team_compatibility.remote_orientation).toBe('Hybrid')
  })
})
```

- [ ] **Step 2: Write failing tests for archetypes**

```typescript
// __tests__/archetypes.test.ts
import { assignArchetype, ARCHETYPES } from '@/lib/archetypes'
import type { DimensionScores } from '@/lib/types'

const highOpenessLeader: DimensionScores = {
  openness: 90, conscientiousness: 55, extraversion: 65, agreeableness: 60,
  emotional_stability: 70, honesty_humility: 68, cognitive_agility: 85,
  executive_function: 70, attention_control: 65, systems_thinking: 75,
  creative_intelligence: 72, achievement_drive: 80, risk_tolerance: 75,
  autonomy_need: 70, purpose_orientation: 78, competitive_drive: 68,
  social_influence: 72, conflict_navigation: 65, communication_style: 50,
  collaboration_signature: 58, leadership_drive: 88, founder_potential: 75,
  strategic_orientation: 82, specialist_generalist: 65, innovation_index: 78,
  psychological_resilience: 72, growth_mindset: 80, adaptability_quotient: 74,
  learning_agility: 76,
}

describe('assignArchetype', () => {
  it('returns a slug that exists in ARCHETYPES', () => {
    const result = assignArchetype(highOpenessLeader, ARCHETYPES)
    expect(ARCHETYPES.find(a => a.slug === result.archetype)).toBeDefined()
  })
  it('returns matchScore between 0 and 100', () => {
    const result = assignArchetype(highOpenessLeader, ARCHETYPES)
    expect(result.matchScore).toBeGreaterThanOrEqual(0)
    expect(result.matchScore).toBeLessThanOrEqual(100)
  })
  it('assigns strategic_visionary for high openness + leadership + cognitive_agility', () => {
    const result = assignArchetype(highOpenessLeader, ARCHETYPES)
    expect(result.archetype).toBe('strategic_visionary')
  })
  it('ARCHETYPES has exactly 32 entries', () => {
    expect(ARCHETYPES).toHaveLength(32)
  })
})
```

- [ ] **Step 3: Run tests — verify fail**

```bash
npx jest __tests__/hpif.test.ts __tests__/archetypes.test.ts
```

- [ ] **Step 4: Implement lib/hpif.ts**

```typescript
// lib/hpif.ts
import type { DimensionScores, HpifProfile } from './types'

function mean(nums: number[]) { return nums.reduce((s, n) => s + n, 0) / nums.length }

export function computeHpif(rawScores: DimensionScores): {
  scores: DimensionScores; hpif: HpifProfile
} {
  // Compute founder_potential before anything else
  const founder_potential = Math.round(mean([
    rawScores.risk_tolerance,
    rawScores.creative_intelligence,
    rawScores.psychological_resilience,
    rawScores.achievement_drive,
  ]))
  const scores: DimensionScores = { ...rawScores, founder_potential }

  // 1. Cognitive OS
  const cogScores = [scores.cognitive_agility, scores.executive_function, scores.attention_control]
  const cogComposite = Math.round(mean(cogScores))
  const cogStyle = cogComposite >= 70 ? 'Analytical-Convergent' : cogComposite >= 40 ? 'Balanced' : 'Intuitive-Divergent'

  // 2. Motivational Architecture
  const motScores = [scores.achievement_drive, scores.purpose_orientation, scores.autonomy_need, scores.competitive_drive]
  const motComposite = Math.round(mean(motScores))
  const MOTIVATION_LABELS: Record<string, string> = {
    achievement_drive: 'Achievement', purpose_orientation: 'Purpose',
    autonomy_need: 'Autonomy', competitive_drive: 'Competition',
  }
  const motDims = Object.entries({
    achievement_drive: scores.achievement_drive, purpose_orientation: scores.purpose_orientation,
    autonomy_need: scores.autonomy_need, competitive_drive: scores.competitive_drive,
  }).sort(([, a], [, b]) => b - a)
  const primaryDriver = MOTIVATION_LABELS[motDims[0][0]]
  const secondaryDriver = MOTIVATION_LABELS[motDims[1][0]]

  // 3. Behavioral Expression
  const beScores = [scores.extraversion, scores.agreeableness, scores.conflict_navigation, scores.communication_style]
  const beComposite = Math.round(mean(beScores))
  const cs = scores.communication_style
  const socialStyle = cs <= 25 ? 'Analytical' : cs <= 50 ? 'Driver' : cs <= 75 ? 'Amiable' : 'Expressive'

  // 4. Growth Vector
  const gvScores = [scores.growth_mindset, scores.adaptability_quotient, scores.learning_agility, scores.psychological_resilience]
  const gvComposite = Math.round(mean(gvScores))
  const trajectory = gvComposite >= 70 ? 'Accelerating' : gvComposite >= 40 ? 'Steady' : 'Developing'
  const ceiling = gvComposite >= 70 ? 'High' : gvComposite >= 40 ? 'Moderate — with targeted development' : 'Significant growth opportunity'

  // 5. Career Potential Matrix
  const ldScore = scores.leadership_drive
  const ldTier = ldScore >= 80 ? 'Visionary' : ldScore >= 60 ? 'Established' : ldScore >= 40 ? 'Rising' : 'Emerging'
  const fpScore = scores.founder_potential
  const fpTier = fpScore >= 80 ? 'Serial Founder' : fpScore >= 60 ? 'Founder' : fpScore >= 40 ? 'Builder' : 'Operator'

  // 6. Team Compatibility
  const teamRoleScores = {
    Architect: mean([scores.systems_thinking, scores.strategic_orientation]),
    Catalyst: mean([scores.creative_intelligence, scores.innovation_index]),
    Executor: mean([scores.conscientiousness, scores.achievement_drive]),
    Harmonizer: mean([scores.agreeableness, scores.collaboration_signature]),
    Challenger: mean([scores.conflict_navigation, scores.competitive_drive]),
    Navigator: mean([scores.cognitive_agility, scores.leadership_drive]),
  }
  const teamRole = Object.entries(teamRoleScores).sort(([, a], [, b]) => b - a)[0][0] as HpifProfile['team_compatibility']['team_role']

  const an = scores.autonomy_need
  const remoteOrientation = an >= 70 ? 'Remote-first' : an >= 40 ? 'Hybrid' : 'In-person'

  const combined = scores.autonomy_need + scores.collaboration_signature
  const teamSizePref = combined < 80 ? 'Solo' : combined < 120 ? 'Small (2-8)' : combined < 160 ? 'Mid (9-30)' : 'Large (30+)'

  const hpif: HpifProfile = {
    cognitive_operating_system: {
      primary_style: cogStyle,
      description: `You process information through ${cogStyle.toLowerCase()}, prioritizing systematic analysis and pattern recognition.`,
      scores: { cognitive_agility: scores.cognitive_agility, executive_function: scores.executive_function, attention_control: scores.attention_control },
      composite: cogComposite,
    },
    motivational_architecture: {
      primary_driver: primaryDriver, secondary_driver: secondaryDriver,
      description: `Your primary motivational driver is ${primaryDriver}, fueled by ${secondaryDriver}.`,
      scores: { achievement_drive: scores.achievement_drive, purpose_orientation: scores.purpose_orientation, autonomy_need: scores.autonomy_need, competitive_drive: scores.competitive_drive },
      composite: motComposite,
    },
    behavioral_expression: {
      social_style: socialStyle,
      description: `Your communication style is ${socialStyle}, shaping how you build relationships and influence others.`,
      scores: { extraversion: scores.extraversion, agreeableness: scores.agreeableness, conflict_navigation: scores.conflict_navigation, communication_style: scores.communication_style },
      composite: beComposite,
    },
    growth_vector: {
      trajectory, ceiling,
      scores: { growth_mindset: scores.growth_mindset, adaptability_quotient: scores.adaptability_quotient, learning_agility: scores.learning_agility, psychological_resilience: scores.psychological_resilience },
      composite: gvComposite,
    },
    career_potential_matrix: {
      leadership_score: ldScore, founder_score: fpScore,
      strategic_vs_tactical: scores.strategic_orientation,
      specialist_vs_generalist: scores.specialist_generalist,
      leadership_tier: ldTier as HpifProfile['career_potential_matrix']['leadership_tier'],
      founder_tier: fpTier as HpifProfile['career_potential_matrix']['founder_tier'],
    },
    team_compatibility: {
      team_role: teamRole, collaboration_style: `${teamRole}s bring ${teamRole === 'Architect' ? 'structural thinking and long-term vision' : 'their unique strengths'} to the team.`,
      remote_orientation: remoteOrientation,
      team_size_preference: teamSizePref,
      best_partners: [], growth_partners: [], friction_archetypes: [], // filled at render from lib/archetypes.ts
    },
  }

  return { scores, hpif }
}
```

- [ ] **Step 5: Implement lib/archetypes.ts** (32 archetypes — 3 full, 29 stubbed)

```typescript
// lib/archetypes.ts
import type { ArchetypeDefinition, DimensionScores } from './types'

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    slug: 'strategic_visionary',
    name: 'Strategic Visionary',
    subtitle: 'The architect of possible futures',
    signature3Words: ['Visionary', 'Decisive', 'Systemic'],
    quote: 'The best way to predict the future is to create it.',
    rarity: 'Found in 4.2% of assessments',
    description: 'Strategic Visionaries see the world as a system of patterns to decode and futures to design. They combine high openness with strategic orientation and cognitive agility to identify non-obvious opportunities others miss.',
    signature: [
      { dimension: 'openness', weight: 1.5, direction: 'high' },
      { dimension: 'leadership_drive', weight: 1.5, direction: 'high' },
      { dimension: 'cognitive_agility', weight: 1.3, direction: 'high' },
      { dimension: 'strategic_orientation', weight: 1.4, direction: 'high' },
      { dimension: 'systems_thinking', weight: 1.2, direction: 'high' },
    ],
    who_you_are: 'You are a rare combination of visionary thinking and decisive leadership. You see systems where others see noise, patterns where others see chaos. Your mind naturally operates at a strategic altitude — you\'re less interested in how things work today and more interested in how they could work tomorrow.',
    how_you_think: 'Your cognitive signature is integrative synthesis. You pull information from disparate fields and find the unifying principle. You think in second-order effects, always asking "and then what?" Your working memory holds complex models, and you shift between abstraction and execution fluidly.',
    what_drives_you: 'You are driven by the opportunity to build something that outlasts you. Legacy matters. You seek roles where your ideas have real-world impact at scale. Tactical execution energizes you only when it serves a larger vision.',
    how_you_show_up: 'In meetings, you often raise the altitude of the conversation — asking "why are we solving this problem" before diving into solutions. You\'re decisive when you\'ve built your mental model. You inspire through clarity of vision rather than emotional appeals.',
    shadow_side: 'Your greatest liability is impatience with execution details. You may generate more ideas than your team can implement. At low emotional stability, you risk becoming disconnected from operational reality and frustrating collaborators who need clear direction.',
    famous_examples: ['Elon Musk', 'Jeff Bezos', 'Reed Hastings', 'Steve Jobs', 'Jensen Huang'],
    career_verticals_primary: ['Technology & AI', 'Venture Capital', 'Strategic Consulting'],
    career_verticals_secondary: ['Policy & Government', 'Media & Publishing', 'Education Reform', 'Healthcare Innovation'],
    dream_roles: ['Chief Strategy Officer', 'Founder/CEO', 'General Partner (VC)'],
    career_trajectory: 'Strategic Visionaries often start in high-cognitive-demand roles (engineering, research, strategy consulting), move into general management, and peak as founders, C-suite executives, or institutional investors.',
    leadership_style: 'Visionary-Directive',
    leadership_strengths: ['Sets compelling long-term direction', 'Builds high-trust executive teams', 'Navigates ambiguity decisively'],
    leadership_blind_spots: ['May overlook implementation complexity', 'Can undervalue "slow" execution work'],
    ideal_work_conditions: ['High autonomy', 'Strategic mandate', 'Access to decision-makers'],
    reward_ranking: ['Impact at scale', 'Intellectual challenge', 'Autonomy'],
    warning_signals: ['Micro-management', 'Short-term-only thinking', 'Politics over merit'],
    development_areas: {
      conscientiousness: 'Your execution orientation needs deliberate development. Set weekly tactical reviews to translate your strategic clarity into milestones.',
      agreeableness: 'Practice stakeholder listening before presenting conclusions. Your ideas land better when others feel heard first.',
    },
    challenge_90_day: 'Identify one long-horizon problem in your current context and build a 3-year view with 90-day milestones. Share it with three people who will give you honest feedback.',
    vision_1_year: 'By this time next year, you will have led at least one initiative from concept to measurable impact, and built a system others can operate without you.',
    best_partners: ['empathetic_leader', 'systematic_builder', 'resilient_executor'],
    growth_partners: ['methodical_perfectionist', 'collaborative_harmonizer'],
    friction_archetypes: ['methodical_perfectionist', 'quiet_authority'],
    team_role: 'Architect',
  },
  {
    slug: 'empathetic_leader',
    name: 'Empathetic Leader',
    subtitle: 'The human force multiplier',
    signature3Words: ['Empathetic', 'Inspiring', 'Grounded'],
    quote: 'Leadership is not about being in charge. It\'s about taking care of those in your charge.',
    rarity: 'Found in 5.8% of assessments',
    description: 'Empathetic Leaders build trust at scale. They combine high agreeableness with leadership drive and emotional stability to create environments where people do their best work.',
    signature: [
      { dimension: 'agreeableness', weight: 1.5, direction: 'high' },
      { dimension: 'leadership_drive', weight: 1.4, direction: 'high' },
      { dimension: 'emotional_stability', weight: 1.3, direction: 'high' },
      { dimension: 'social_influence', weight: 1.2, direction: 'high' },
      { dimension: 'purpose_orientation', weight: 1.2, direction: 'high' },
    ],
    who_you_are: 'You lead from genuine care. Where others see headcount, you see people with aspirations, fears, and potential. Your teams consistently rate you as one of the best leaders they\'ve worked with — because you actually invest in them as humans.',
    how_you_think: 'Your thinking is integrative and people-centered. You naturally model how decisions will affect individuals and teams before you make them. You are strong at reading rooms, sensing tension, and finding the path that honors both results and relationships.',
    what_drives_you: 'You are driven by impact through people. Watching someone you\'ve mentored succeed is more rewarding than personal acclaim. Purpose and meaning are non-negotiables — you need to believe in what you\'re building.',
    how_you_show_up: 'You show up as a present, attentive listener. In conflict, you seek understanding before judgment. You celebrate others\' wins loudly and take responsibility for failures quietly. You build loyalty through consistency and genuine care.',
    shadow_side: 'Your empathy can become a liability under pressure. You may delay difficult decisions to preserve relationships. You can be manipulated by those who exploit your care. High-conflict environments drain you disproportionately.',
    famous_examples: ['Satya Nadella', 'Jacinda Ardern', 'Howard Schultz', 'Brené Brown', 'Pat Gelsinger'],
    career_verticals_primary: ['People Operations & HR', 'Education & Coaching', 'Healthcare Leadership'],
    career_verticals_secondary: ['Non-profit Leadership', 'Community Organizations', 'Customer Success', 'Team-based Product Management'],
    dream_roles: ['Chief People Officer', 'CEO (people-intensive industries)', 'Executive Coach'],
    career_trajectory: 'Empathetic Leaders often move through roles with high human contact — teaching, consulting, team leadership — into executive roles where their ability to build culture and retain talent becomes a competitive advantage.',
    leadership_style: 'Servant-Transformational',
    leadership_strengths: ['Builds high-trust team culture', 'Retains top talent', 'Navigates org change with minimal disruption'],
    leadership_blind_spots: ['May delay hard performance conversations', 'Can sacrifice clarity for kindness'],
    ideal_work_conditions: ['Mission-driven culture', 'Team stability', 'Psychological safety'],
    reward_ranking: ['Team success', 'Purpose alignment', 'Recognition for impact'],
    warning_signals: ['Pure profit-over-people culture', 'High turnover norms', 'Backstabbing politics'],
    development_areas: {
      conflict_navigation: 'Practice delivering difficult feedback directly. Start with low-stakes conversations and build your tolerance for constructive tension.',
      strategic_orientation: 'Invest time weekly in long-horizon thinking. Your people focus can crowd out strategic planning.',
    },
    challenge_90_day: 'Have the three most difficult conversations you\'ve been avoiding. Document what you learned about yourself and the other person after each one.',
    vision_1_year: 'Build a team or organization where at least three people will later describe you as the leader who changed their career trajectory.',
    best_partners: ['strategic_visionary', 'systematic_builder', 'analytical_architect'],
    growth_partners: ['courageous_disruptor', 'competitive_achiever'],
    friction_archetypes: ['bold_risk_taker', 'competitive_achiever'],
    team_role: 'Harmonizer',
  },
  {
    slug: 'systematic_builder',
    name: 'Systematic Builder',
    subtitle: 'The architect of reliable systems',
    signature3Words: ['Methodical', 'Principled', 'Reliable'],
    quote: 'Excellence is not a destination but a continuous journey that never ends.',
    rarity: 'Found in 6.1% of assessments',
    description: 'Systematic Builders create the infrastructure that lets organizations scale. They combine high conscientiousness with integrity and leadership drive to build systems, processes, and teams that work reliably under pressure.',
    signature: [
      { dimension: 'conscientiousness', weight: 1.5, direction: 'high' },
      { dimension: 'honesty_humility', weight: 1.3, direction: 'high' },
      { dimension: 'leadership_drive', weight: 1.2, direction: 'high' },
      { dimension: 'executive_function', weight: 1.3, direction: 'high' },
      { dimension: 'systems_thinking', weight: 1.2, direction: 'high' },
    ],
    who_you_are: 'You are the reason things actually get done. Where others cast visions, you build the systems that turn vision into reality. Your teams trust you because you always follow through. When you say something will happen, it happens.',
    how_you_think: 'You think in processes and systems. You naturally decompose complex goals into trackable milestones. You have high working memory for operational details and can hold multiple projects in parallel without losing threads.',
    what_drives_you: 'You are driven by building things that last. Sustainable excellence matters more to you than fast wins. You take pride in the craftsmanship of your work — the invisible excellence that others take for granted until it\'s missing.',
    how_you_show_up: 'Reliable, prepared, direct. You show up with data and clear recommendations. You follow through on every commitment. You hold others to the same standard — kindly, but clearly.',
    shadow_side: 'Your systems orientation can make you resistant to necessary disruption. You may prioritize process adherence over adaptive response. Under pressure, you can become rigid when flexibility is needed.',
    famous_examples: ['Tim Cook', 'Sheryl Sandberg', 'Jamie Dimon', 'Mary Barra', 'Jensen Huang (execution side)'],
    career_verticals_primary: ['Operations & Supply Chain', 'Engineering Management', 'Finance & Accounting'],
    career_verticals_secondary: ['Product Management', 'Healthcare Administration', 'Government', 'Manufacturing'],
    dream_roles: ['COO', 'VP Engineering', 'Chief of Staff', 'Program Director'],
    career_trajectory: 'Systematic Builders excel in execution-heavy roles early, move into operations leadership, and reach COO or equivalent roles where they operationalize the vision of more strategic partners.',
    leadership_style: 'Operational-Principled',
    leadership_strengths: ['Builds reliable execution systems', 'Develops high-trust accountability culture', 'Manages complexity without drama'],
    leadership_blind_spots: ['Can resist necessary pivots', 'May prioritize completeness over speed'],
    ideal_work_conditions: ['Clear objectives', 'Stable organizational context', 'Room to build proper systems'],
    reward_ranking: ['Mastery', 'Integrity alignment', 'Reliable outcomes'],
    warning_signals: ['Constant chaos without structure', 'Ethical grey zones', 'Promises broken regularly'],
    development_areas: {
      openness: 'Challenge yourself monthly with something entirely outside your process comfort zone — a creative project, an ambiguous problem with no playbook.',
      risk_tolerance: 'Practice making decisions with 70% of your ideal information. Perfect data is often a delay tactic.',
    },
    challenge_90_day: 'Identify one system or process you\'ve been managing manually and build a scalable version. Document what broke along the way.',
    vision_1_year: 'Create a playbook or system that enables one person you\'ve developed to deliver at the level you currently operate.',
    best_partners: ['strategic_visionary', 'creative_catalyst', 'innovation_pioneer'],
    growth_partners: ['adaptive_generalist', 'courageous_disruptor'],
    friction_archetypes: ['bold_risk_taker', 'courageous_disruptor'],
    team_role: 'Executor',
  },
  // === STUBS: archetypes 4–32 ===
  ...([
    { slug: 'creative_catalyst', name: 'Creative Catalyst', subtitle: 'The spark that ignites possibility', sig: [{ d: 'openness', w: 1.5 }, { d: 'extraversion', w: 1.3 }, { d: 'creative_intelligence', w: 1.5 }], role: 'Catalyst' as const, partners: ['strategic_visionary', 'analytical_architect', 'systematic_builder'] },
    { slug: 'analytical_architect', name: 'Analytical Architect', subtitle: 'The builder of rigorous frameworks', sig: [{ d: 'cognitive_agility', w: 1.5 }, { d: 'conscientiousness', w: 1.3 }, { d: 'systems_thinking', w: 1.5 }], role: 'Architect' as const, partners: ['empathetic_leader', 'strategic_visionary', 'resilient_executor'] },
    { slug: 'resilient_executor', name: 'Resilient Executor', subtitle: 'The force that gets it done', sig: [{ d: 'emotional_stability', w: 1.5 }, { d: 'conscientiousness', w: 1.3 }, { d: 'leadership_drive', w: 1.2 }], role: 'Executor' as const, partners: ['strategic_visionary', 'creative_catalyst', 'innovation_pioneer'] },
    { slug: 'innovation_pioneer', name: 'Innovation Pioneer', subtitle: 'The first across every frontier', sig: [{ d: 'innovation_index', w: 1.5 }, { d: 'openness', w: 1.4 }, { d: 'risk_tolerance', w: 1.3 }], role: 'Catalyst' as const, partners: ['systematic_builder', 'analytical_architect', 'strategic_visionary'] },
    { slug: 'collaborative_harmonizer', name: 'Collaborative Harmonizer', subtitle: 'The glue that holds teams together', sig: [{ d: 'agreeableness', w: 1.5 }, { d: 'collaboration_signature', w: 1.4 }, { d: 'extraversion', w: 1.2 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'resilient_executor', 'analytical_architect'] },
    { slug: 'independent_specialist', name: 'Independent Specialist', subtitle: 'The deepest well of expertise', sig: [{ d: 'autonomy_need', w: 1.5 }, { d: 'cognitive_agility', w: 1.3 }, { d: 'conscientiousness', w: 1.3 }], role: 'Executor' as const, partners: ['collaborative_harmonizer', 'empathetic_leader', 'strategic_visionary'] },
    { slug: 'adaptive_generalist', name: 'Adaptive Generalist', subtitle: 'The master of every context', sig: [{ d: 'adaptability_quotient', w: 1.5 }, { d: 'learning_agility', w: 1.4 }, { d: 'openness', w: 1.3 }], role: 'Navigator' as const, partners: ['independent_specialist', 'methodical_perfectionist', 'systematic_builder'] },
    { slug: 'servant_leader', name: 'Servant Leader', subtitle: 'The leader who leads by serving', sig: [{ d: 'purpose_orientation', w: 1.5 }, { d: 'agreeableness', w: 1.4 }, { d: 'leadership_drive', w: 1.2 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'resilient_executor', 'systematic_builder'] },
    { slug: 'competitive_achiever', name: 'Competitive Achiever', subtitle: 'The relentless pursuit of winning', sig: [{ d: 'competitive_drive', w: 1.5 }, { d: 'achievement_drive', w: 1.4 }, { d: 'leadership_drive', w: 1.2 }], role: 'Challenger' as const, partners: ['strategic_visionary', 'systematic_builder', 'analytical_architect'] },
    { slug: 'diplomatic_bridge_builder', name: 'Diplomatic Bridge-Builder', subtitle: 'The architect of consensus', sig: [{ d: 'agreeableness', w: 1.4 }, { d: 'conflict_navigation', w: 1.5 }, { d: 'social_influence', w: 1.3 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'resilient_executor', 'innovation_pioneer'] },
    { slug: 'courageous_disruptor', name: 'Courageous Disruptor', subtitle: 'The one who breaks the mold', sig: [{ d: 'risk_tolerance', w: 1.5 }, { d: 'innovation_index', w: 1.4 }, { d: 'extraversion', w: 1.2 }], role: 'Challenger' as const, partners: ['systematic_builder', 'analytical_architect', 'resilient_executor'] },
    { slug: 'methodical_perfectionist', name: 'Methodical Perfectionist', subtitle: 'The guardian of quality', sig: [{ d: 'conscientiousness', w: 1.5 }, { d: 'executive_function', w: 1.4 }, { d: 'attention_control', w: 1.3 }], role: 'Executor' as const, partners: ['creative_catalyst', 'innovation_pioneer', 'adaptive_generalist'] },
    { slug: 'inspirational_motivator', name: 'Inspirational Motivator', subtitle: 'The energy that elevates rooms', sig: [{ d: 'extraversion', w: 1.5 }, { d: 'social_influence', w: 1.4 }, { d: 'purpose_orientation', w: 1.3 }], role: 'Catalyst' as const, partners: ['systematic_builder', 'analytical_architect', 'methodical_perfectionist'] },
    { slug: 'pragmatic_problem_solver', name: 'Pragmatic Problem-Solver', subtitle: 'The one who just makes it work', sig: [{ d: 'cognitive_agility', w: 1.4 }, { d: 'strategic_orientation', w: 1.3 }, { d: 'emotional_stability', w: 1.3 }], role: 'Navigator' as const, partners: ['strategic_visionary', 'creative_catalyst', 'inspirational_motivator'] },
    { slug: 'visionary_entrepreneur', name: 'Visionary Entrepreneur', subtitle: 'The builder of new worlds', sig: [{ d: 'founder_potential', w: 1.5 }, { d: 'openness', w: 1.3 }, { d: 'risk_tolerance', w: 1.4 }], role: 'Catalyst' as const, partners: ['systematic_builder', 'resilient_executor', 'analytical_architect'] },
    { slug: 'data_driven_strategist', name: 'Data-Driven Strategist', subtitle: 'The mind that turns data into direction', sig: [{ d: 'cognitive_agility', w: 1.4 }, { d: 'strategic_orientation', w: 1.4 }, { d: 'conscientiousness', w: 1.2 }], role: 'Architect' as const, partners: ['inspirational_motivator', 'empathetic_leader', 'collaborative_harmonizer'] },
    { slug: 'empowering_coach', name: 'Empowering Coach', subtitle: 'The multiplier of human potential', sig: [{ d: 'agreeableness', w: 1.4 }, { d: 'growth_mindset', w: 1.5 }, { d: 'leadership_drive', w: 1.2 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'competitive_achiever', 'courageous_disruptor'] },
    { slug: 'bold_risk_taker', name: 'Bold Risk-Taker', subtitle: 'The one who bets on the future', sig: [{ d: 'risk_tolerance', w: 1.5 }, { d: 'competitive_drive', w: 1.3 }, { d: 'extraversion', w: 1.2 }], role: 'Challenger' as const, partners: ['systematic_builder', 'methodical_perfectionist', 'analytical_architect'] },
    { slug: 'thoughtful_synthesizer', name: 'Thoughtful Synthesizer', subtitle: 'The connector of disparate ideas', sig: [{ d: 'systems_thinking', w: 1.5 }, { d: 'openness', w: 1.3 }, { d: 'honesty_humility', w: 1.2 }], role: 'Architect' as const, partners: ['inspirational_motivator', 'creative_catalyst', 'bold_risk_taker'] },
    { slug: 'dynamic_connector', name: 'Dynamic Connector', subtitle: 'The hub of every network', sig: [{ d: 'extraversion', w: 1.5 }, { d: 'social_influence', w: 1.4 }, { d: 'agreeableness', w: 1.2 }], role: 'Catalyst' as const, partners: ['independent_specialist', 'methodical_perfectionist', 'systematic_builder'] },
    { slug: 'quiet_authority', name: 'Quiet Authority', subtitle: 'The leader who leads without noise', sig: [{ d: 'leadership_drive', w: 1.4 }, { d: 'honesty_humility', w: 1.3 }, { d: 'conscientiousness', w: 1.3 }], role: 'Navigator' as const, partners: ['creative_catalyst', 'dynamic_connector', 'inspirational_motivator'] },
    { slug: 'systematic_innovator', name: 'Systematic Innovator', subtitle: 'The engineer of breakthrough', sig: [{ d: 'conscientiousness', w: 1.3 }, { d: 'innovation_index', w: 1.5 }, { d: 'cognitive_agility', w: 1.3 }], role: 'Architect' as const, partners: ['empathetic_leader', 'collaborative_harmonizer', 'servant_leader'] },
    { slug: 'compassionate_challenger', name: 'Compassionate Challenger', subtitle: 'The critic who cares deeply', sig: [{ d: 'agreeableness', w: 1.3 }, { d: 'conflict_navigation', w: 1.4 }, { d: 'openness', w: 1.3 }], role: 'Challenger' as const, partners: ['strategic_visionary', 'analytical_architect', 'data_driven_strategist'] },
    { slug: 'strategic_operator', name: 'Strategic Operator', subtitle: 'The executor of bold vision', sig: [{ d: 'strategic_orientation', w: 1.4 }, { d: 'conscientiousness', w: 1.3 }, { d: 'executive_function', w: 1.4 }], role: 'Executor' as const, partners: ['creative_catalyst', 'innovation_pioneer', 'bold_risk_taker'] },
    { slug: 'creative_technologist', name: 'Creative Technologist', subtitle: 'The artist who builds', sig: [{ d: 'creative_intelligence', w: 1.5 }, { d: 'cognitive_agility', w: 1.3 }, { d: 'innovation_index', w: 1.4 }], role: 'Catalyst' as const, partners: ['servant_leader', 'empowering_coach', 'collaborative_harmonizer'] },
    { slug: 'cultural_architect', name: 'Cultural Architect', subtitle: 'The designer of belonging', sig: [{ d: 'agreeableness', w: 1.4 }, { d: 'social_influence', w: 1.4 }, { d: 'honesty_humility', w: 1.3 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'innovation_pioneer', 'courageous_disruptor'] },
    { slug: 'resilient_pioneer', name: 'Resilient Pioneer', subtitle: 'The one who keeps going', sig: [{ d: 'psychological_resilience', w: 1.5 }, { d: 'risk_tolerance', w: 1.3 }, { d: 'leadership_drive', w: 1.3 }], role: 'Challenger' as const, partners: ['methodical_perfectionist', 'systematic_builder', 'quiet_authority'] },
    { slug: 'intellectual_explorer', name: 'Intellectual Explorer', subtitle: 'The eternal student of everything', sig: [{ d: 'openness', w: 1.4 }, { d: 'learning_agility', w: 1.5 }, { d: 'systems_thinking', w: 1.3 }], role: 'Navigator' as const, partners: ['competitive_achiever', 'bold_risk_taker', 'resilient_pioneer'] },
    { slug: 'transformational_catalyst', name: 'Transformational Catalyst', subtitle: 'The agent of deep change', sig: [{ d: 'leadership_drive', w: 1.4 }, { d: 'growth_mindset', w: 1.5 }, { d: 'innovation_index', w: 1.3 }], role: 'Catalyst' as const, partners: ['strategic_operator', 'data_driven_strategist', 'quiet_authority'] },
  ] as const).map(stub => ({
    slug: stub.slug,
    name: stub.name,
    subtitle: stub.subtitle,
    signature3Words: [stub.name.split(' ')[0], 'Driven', 'Focused'],
    quote: 'Know your moment.',
    rarity: 'Coming soon',
    description: `${stub.name}s are currently in early access. Full profile content — including deep psychological analysis, career intelligence, and growth roadmap — will be available in the next release.`,
    signature: stub.sig.map(s => ({ dimension: s.d as any, weight: s.w, direction: 'high' as const })),
    career_verticals_primary: ['Coming Soon'],
    career_verticals_secondary: [],
    dream_roles: ['Coming Soon'],
    best_partners: stub.partners,
    growth_partners: [],
    friction_archetypes: [],
    team_role: stub.role,
  })),
]

export function assignArchetype(scores: DimensionScores, archetypes: ArchetypeDefinition[] = ARCHETYPES) {
  const composites = archetypes.map(archetype => {
    const totalWeight = archetype.signature.reduce((s, d) => s + d.weight, 0)
    const weightedScore = archetype.signature.reduce((s, d) => {
      const score = d.direction === 'high' ? scores[d.dimension] : 100 - scores[d.dimension]
      return s + score * d.weight
    }, 0)
    return { slug: archetype.slug, composite: weightedScore / totalWeight }
  })

  composites.sort((a, b) => b.composite - a.composite)
  const winner = composites[0]
  const runnerUp = composites[1]

  const resolvedSlug = (winner.composite - runnerUp.composite < 2)
    ? resolveByPrimaryDimension(winner.slug, runnerUp.slug, scores, archetypes)
    : winner.slug

  return { archetype: resolvedSlug, matchScore: Math.round(winner.composite) }
}

function resolveByPrimaryDimension(
  slugA: string, slugB: string, scores: DimensionScores, archetypes: ArchetypeDefinition[]
): string {
  const getPrimaryScore = (slug: string) => {
    const def = archetypes.find(a => a.slug === slug)!
    const primary = def.signature.find(d => d.direction === 'high')
    return primary ? scores[primary.dimension] : 0
  }
  return getPrimaryScore(slugA) >= getPrimaryScore(slugB) ? slugA : slugB
}
```

- [ ] **Step 6: Run tests — verify pass**

```bash
npx jest __tests__/hpif.test.ts __tests__/archetypes.test.ts
```
Expected: all tests pass

- [ ] **Step 7: Run all tests**

```bash
npx jest
```
Expected: all 4 test files pass

- [ ] **Step 8: Commit**

```bash
git add lib/hpif.ts lib/archetypes.ts __tests__/hpif.test.ts __tests__/archetypes.test.ts
git commit -m "feat: HPIF 6-layer computation + 32 archetype definitions + assignment algorithm"
```

---

## Chunk 5: API Routes

### Task 11: /api/assessment/start + /api/assessment/respond + /api/assessment/complete

**Files:**
- Create: `app/api/assessment/start/route.ts`
- Create: `app/api/assessment/respond/route.ts`
- Create: `app/api/assessment/complete/route.ts`

- [ ] **Step 1: Create app/api/assessment/start/route.ts**

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS } from '@/lib/questions'
import type { Question } from '@/lib/types'

// Shuffle within each tier to randomize calibration question order
function shuffleWithinTiers(questions: Question[]): Question[] {
  const byTier = new Map<number, Question[]>()
  questions.forEach(q => {
    const arr = byTier.get(q.tier) ?? []
    arr.push(q)
    byTier.set(q.tier, arr)
  })
  const result: Question[] = []
  for (let tier = 1; tier <= 6; tier++) {
    const arr = byTier.get(tier) ?? []
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    result.push(...arr)
  }
  return result
}

export async function POST() {
  try {
    const supabase = await createServiceClient()
    const sessionToken = crypto.randomUUID()

    const { data: assessment, error } = await supabase
      .from('assessments')
      .insert({ session_token: sessionToken })
      .select('id')
      .single()

    if (error) throw error

    const calibrationQuestions = shuffleWithinTiers(
      QUESTIONS.filter(q => q.calibration && q.is_active)
    )

    return Response.json({
      assessmentId: assessment.id,
      sessionToken,
      questions: calibrationQuestions,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create app/api/assessment/respond/route.ts**

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS } from '@/lib/questions'
import { computeScores } from '@/lib/scoring'
import type { Response as AssessmentResponse } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { sessionToken, questionCode, value, responseTimeMs, revised } = await req.json()
    if (!sessionToken || !questionCode || value === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Validate session token
    const { data: assessment, error: aErr } = await supabase
      .from('assessments')
      .select('id, status')
      .eq('session_token', sessionToken)
      .eq('status', 'in_progress')
      .single()
    if (aErr || !assessment) return Response.json({ error: 'Invalid session' }, { status: 404 })

    // Upsert response
    await supabase.from('responses').upsert({
      assessment_id: assessment.id,
      question_code: questionCode,
      value: JSON.stringify(value),
      response_time_ms: responseTimeMs ?? null,
      revised: revised ?? false,
    }, { onConflict: 'assessment_id,question_code' })

    // Count answered questions
    const { data: responses } = await supabase
      .from('responses')
      .select('question_code, value')
      .eq('assessment_id', assessment.id)
    const answeredCount = responses?.length ?? 0

    // After calibration phase: compute interim scores, find ambiguous dimensions
    let nextQuestion = null
    if (answeredCount >= 40) {
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

      // Find dimensions in ambiguous zone [35, 65]
      const ambiguous = Object.entries(scores)
        .filter(([, s]) => s !== undefined && s >= 35 && s <= 65)
        .map(([dim]) => dim)

      // Find next unanswered question from ambiguous dimension
      const nextQ = QUESTIONS
        .filter(q => !q.calibration && !answeredCodes.has(q.code) && q.is_active && ambiguous.includes(q.dimension))
        .sort((a, b) => a.order_index - b.order_index)[0]
      nextQuestion = nextQ ?? null
    }

    const totalQuestions = nextQuestion === null && answeredCount >= 40
      ? answeredCount  // done
      : Math.max(40, answeredCount + (nextQuestion ? 1 : 0))

    return Response.json({
      nextQuestion,
      progress: { answered: answeredCount, total: totalQuestions },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
```

- [ ] **Step 3: Create app/api/assessment/complete/route.ts**

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS, CONSTRUCT_PAIRS } from '@/lib/questions'
import { computeScores } from '@/lib/scoring'
import { computeInference } from '@/lib/inference'
import { computeHpif } from '@/lib/hpif'
import { assignArchetype, ARCHETYPES } from '@/lib/archetypes'
import type { DimensionScores, Response as AssessmentResponse } from '@/lib/types'

const REQUIRED_DIMENSIONS = QUESTIONS.reduce((acc, q) => acc.add(q.dimension), new Set<string>())

export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json()
    if (!sessionToken) return Response.json({ error: 'Missing sessionToken' }, { status: 400 })

    const supabase = await createServiceClient()

    const { data: assessment, error: aErr } = await supabase
      .from('assessments')
      .select('id, status')
      .eq('session_token', sessionToken)
      .eq('status', 'in_progress')
      .single()
    if (aErr || !assessment) return Response.json({ error: 'Invalid session' }, { status: 404 })

    const { data: rawResponses } = await supabase
      .from('responses')
      .select('question_code, value, response_time_ms, revised')
      .eq('assessment_id', assessment.id)

    if (!rawResponses?.length) return Response.json({ error: 'No responses found' }, { status: 400 })

    // Validate all 29 dimensions have at least 1 response
    const answeredDims = new Set(
      rawResponses.map(r => QUESTIONS.find(q => q.code === r.question_code)?.dimension).filter(Boolean)
    )
    const missing = [...REQUIRED_DIMENSIONS].filter(d => d !== 'founder_potential' && !answeredDims.has(d))
    if (missing.length > 0) {
      return Response.json({ error: `Missing responses for: ${missing.join(', ')}` }, { status: 400 })
    }

    // Map responses
    const responses: AssessmentResponse[] = rawResponses.map(r => ({
      questionCode: r.question_code,
      value: JSON.parse(r.value),
      responseTimeMs: r.response_time_ms ?? 0,
      revised: r.revised ?? false,
      dimension: QUESTIONS.find(q => q.code === r.question_code)!.dimension,
    }))

    // Score
    const partialScores = computeScores(responses, QUESTIONS)

    // Inference modifiers
    const inference = computeInference({ responses, constructPairs: CONSTRUCT_PAIRS })

    // Apply modifiers to all raw dimension scores
    const modifiedScores: Partial<DimensionScores> = {}
    for (const [dim, score] of Object.entries(partialScores)) {
      if (score !== undefined) {
        modifiedScores[dim as keyof DimensionScores] = Math.max(0, Math.min(100,
          score + inference.consistencyPenalty + inference.speedModifier
        ))
      }
    }

    // Compute HPIF (also computes founder_potential)
    const { scores: fullScores, hpif } = computeHpif(modifiedScores as DimensionScores)

    // Assign archetype
    const { archetype, matchScore } = assignArchetype(fullScores, ARCHETYPES)

    // Write results
    const { data: result, error: rErr } = await supabase
      .from('results')
      .insert({
        assessment_id: assessment.id,
        scores: fullScores,
        hpif_profile: hpif,
        archetype,
        match_score: matchScore,
        inference_data: {
          avgResponseMs: inference.avgResponseMs,
          revisionRate: inference.revisionRate,
          consistencyScore: inference.consistencyScore,
        },
      })
      .select('id')
      .single()

    if (rErr) throw rErr

    // Mark assessment complete
    await supabase.from('assessments').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', assessment.id)

    return Response.json({ resultId: result.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create app/api/results/[id]/route.ts**

```typescript
import { createServiceClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/archetypes'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServiceClient()

    const { data: result, error } = await supabase
      .from('results')
      .select('*, assessments(id, user_id)')
      .eq('id', params.id)
      .single()

    if (error || !result) return Response.json({ error: 'Not found' }, { status: 404 })

    // Attach team_compatibility content from lib/archetypes.ts at render time
    const archetypeDef = ARCHETYPES.find(a => a.slug === result.archetype)
    const enriched = {
      ...result,
      archetypeContent: archetypeDef ?? null,
      hpif_profile: {
        ...result.hpif_profile,
        team_compatibility: {
          ...result.hpif_profile.team_compatibility,
          best_partners: archetypeDef?.best_partners ?? [],
          growth_partners: archetypeDef?.growth_partners ?? [],
          friction_archetypes: archetypeDef?.friction_archetypes ?? [],
        },
      },
    }

    return Response.json(enriched, {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
```

- [ ] **Step 5: Create app/(auth)/signup/actions.ts** (claimAssessment server action)

```typescript
'use server'
import { createServiceClient } from '@/lib/supabase/server'

export async function claimAssessment(sessionToken: string, userId: string) {
  if (!sessionToken || !userId) return
  const supabase = await createServiceClient()
  await supabase
    .from('assessments')
    .update({ user_id: userId })
    .eq('session_token', sessionToken)
    .is('user_id', null)  // prevent claiming others' assessments
}
```

- [ ] **Step 6: Verify build passes**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm run build
```

Expected: clean compile

- [ ] **Step 7: Commit**

```bash
git add app/api/ app/'(auth)'/signup/actions.ts
git commit -m "feat: API routes (start, respond, complete, results) + claimAssessment action"
```

---

## Chunk 6: UI Primitives + Assessment Components

### Task 12: UI primitives

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Badge.tsx`

- [ ] **Step 1: Create components/ui/Button.tsx**

```tsx
import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo disabled:opacity-50',
        {
          primary: 'bg-indigo text-white hover:bg-indigo-600',
          secondary: 'bg-teal text-white hover:bg-teal-600',
          ghost: 'text-text hover:bg-indigo-50',
          outline: 'border border-indigo text-indigo hover:bg-indigo-50',
        }[variant],
        { sm: 'h-8 px-3 text-sm', md: 'h-10 px-5 text-base', lg: 'h-12 px-8 text-lg' }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create lib/utils.ts**

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install deps:
```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm install clsx tailwind-merge
```

- [ ] **Step 3: Create components/ui/Card.tsx**

```tsx
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl p-6',
      glass ? 'glass' : 'bg-white shadow-sm border border-slate-100',
      className
    )}>
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Create components/ui/Badge.tsx**

```tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'indigo' | 'teal' | 'blue' | 'neutral'
  className?: string
}

export function Badge({ children, variant = 'indigo', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
      {
        indigo: 'bg-indigo-50 text-indigo',
        teal: 'bg-teal-50 text-teal',
        blue: 'bg-blue-50 text-blue',
        neutral: 'bg-slate-100 text-slate-600',
      }[variant],
      className
    )}>
      {children}
    </span>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/ lib/utils.ts
git commit -m "feat: UI primitives (Button, Card, Badge)"
```

---

### Task 13: Question type components (8 types)

**Files:**
- Create: `components/assessment/question-types/LikertQuestion.tsx`
- Create: `components/assessment/question-types/FrequencyQuestion.tsx`
- Create: `components/assessment/question-types/ForcedChoiceQuestion.tsx`
- Create: `components/assessment/question-types/SituationalQuestion.tsx`
- Create: `components/assessment/question-types/TimedQuestion.tsx`
- Create: `components/assessment/question-types/RankOrderQuestion.tsx`
- Create: `components/assessment/question-types/AllocationQuestion.tsx`
- Create: `components/assessment/question-types/VisualQuestion.tsx`

Each component receives `question: Question` and `onAnswer: (value: unknown) => void`. They submit on final interaction (no separate confirm button, except RankOrder and Allocation which have a "Confirm" button).

- [ ] **Step 1: Create LikertQuestion.tsx + FrequencyQuestion.tsx** (same shape, different labels)

```tsx
// components/assessment/question-types/LikertQuestion.tsx
'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function LikertQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const labels = question.options.labels ?? []

  const handleSelect = (val: number) => {
    setSelected(val)
    setTimeout(() => onAnswer(val), 300) // brief visual feedback delay
  }

  return (
    <div className="space-y-3">
      {labels.map((label, i) => {
        const val = i + 1
        return (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            className={cn(
              'w-full text-left px-5 py-3 rounded-xl border transition-all',
              selected === val
                ? 'border-indigo bg-indigo-50 text-indigo font-medium'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
            )}
          >
            <span className="text-sm text-slate-400 mr-3">{val}</span>{label}
          </button>
        )
      })}
    </div>
  )
}
```

```tsx
// components/assessment/question-types/FrequencyQuestion.tsx
'use client'
export { LikertQuestion as FrequencyQuestion } from './LikertQuestion'
// Frequency uses identical UI — same 5-option list. Re-export with alias.
```

- [ ] **Step 2: Create ForcedChoiceQuestion.tsx**

```tsx
// components/assessment/question-types/ForcedChoiceQuestion.tsx
'use client'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function ForcedChoiceQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: 'a' | 'b') => void }) {
  const { a, b } = question.options
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {([['a', a], ['b', b]] as const).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onAnswer(key)}
          className="px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo hover:bg-indigo-50 transition-all text-left"
        >
          <span className="block text-xs font-bold uppercase tracking-wider text-indigo mb-2">{key.toUpperCase()}</span>
          <span className="text-base text-text">{label}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create SituationalQuestion.tsx**

```tsx
// components/assessment/question-types/SituationalQuestion.tsx
'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function SituationalQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const { scenario, choices = [] } = question.options

  const handleSelect = (idx: number) => {
    setSelected(idx)
    setTimeout(() => onAnswer(idx), 300)
  }

  return (
    <div className="space-y-4">
      {scenario && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 italic">
          {scenario}
        </div>
      )}
      <div className="space-y-2">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={cn(
              'w-full text-left px-5 py-3 rounded-xl border transition-all',
              selected === idx
                ? 'border-indigo bg-indigo-50 text-indigo font-medium'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            )}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create TimedQuestion.tsx**

```tsx
// components/assessment/question-types/TimedQuestion.tsx
'use client'
import { useState, useEffect } from 'react'
import { SituationalQuestion } from './SituationalQuestion'
import type { Question } from '@/lib/types'

export function TimedQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); onAnswer(0); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onAnswer])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Time remaining</span>
        <span className={`font-mono text-lg font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-indigo'}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo transition-all duration-1000"
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>
      <SituationalQuestion question={question} onAnswer={onAnswer} />
    </div>
  )
}
```

- [ ] **Step 5: Create RankOrderQuestion.tsx**

```tsx
// components/assessment/question-types/RankOrderQuestion.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Question } from '@/lib/types'

export function RankOrderQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const items = question.options.items ?? []
  const targetIdx = question.options.target_item_index ?? 0
  const [ranked, setRanked] = useState<string[]>([...items])

  const move = (from: number, to: number) => {
    const arr = [...ranked]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setRanked(arr)
  }

  const handleConfirm = () => {
    const targetItem = items[targetIdx]
    const rank = ranked.indexOf(targetItem) + 1 // 1-indexed
    onAnswer(rank)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Drag to rank from most to least preferred (1 = top):</p>
      <div className="space-y-2">
        {ranked.map((item, idx) => (
          <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-indigo text-white text-xs flex items-center justify-center font-bold">
              {idx + 1}
            </span>
            <span className="flex-1 text-text">{item}</span>
            <div className="flex flex-col gap-1">
              <button onClick={() => idx > 0 && move(idx, idx - 1)} className="text-slate-400 hover:text-indigo text-xs">↑</button>
              <button onClick={() => idx < ranked.length - 1 && move(idx, idx + 1)} className="text-slate-400 hover:text-indigo text-xs">↓</button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleConfirm} className="w-full">Confirm Ranking</Button>
    </div>
  )
}
```

- [ ] **Step 6: Create AllocationQuestion.tsx**

```tsx
// components/assessment/question-types/AllocationQuestion.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Question } from '@/lib/types'

export function AllocationQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const items = question.options.items ?? []
  const targetIdx = question.options.target_item_index ?? 0
  const total = question.options.total ?? 100
  const [values, setValues] = useState<number[]>(items.map(() => Math.floor(total / items.length)))

  const remaining = total - values.reduce((s, v) => s + v, 0)
  const isValid = remaining === 0

  const handleChange = (idx: number, val: number) => {
    const clamped = Math.max(0, Math.min(val, val + remaining))
    const updated = [...values]
    updated[idx] = clamped
    setValues(updated)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Distribute {total} points across these areas:</p>
      {items.map((item, idx) => (
        <div key={item} className="flex items-center gap-4">
          <span className="w-36 text-sm text-text">{item}</span>
          <input
            type="range" min={0} max={total} value={values[idx]}
            onChange={e => handleChange(idx, Number(e.target.value))}
            className="flex-1 accent-indigo"
          />
          <span className="w-10 text-right font-mono text-indigo font-bold">{values[idx]}</span>
        </div>
      ))}
      <div className={`text-sm ${remaining === 0 ? 'text-teal' : 'text-red-500'}`}>
        {remaining === 0 ? 'All points allocated ✓' : `${Math.abs(remaining)} points ${remaining > 0 ? 'remaining' : 'over'}`}
      </div>
      <Button onClick={() => onAnswer(values[targetIdx])} disabled={!isValid} className="w-full">
        Confirm Allocation
      </Button>
    </div>
  )
}
```

- [ ] **Step 7: Create VisualQuestion.tsx**

```tsx
// components/assessment/question-types/VisualQuestion.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function VisualQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const images = question.options.images ?? []

  const handleSelect = (idx: number) => {
    setSelected(idx)
    setTimeout(() => onAnswer(idx), 400)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((src, idx) => (
        <button
          key={src}
          onClick={() => handleSelect(idx)}
          className={cn(
            'aspect-square rounded-2xl border-4 overflow-hidden transition-all',
            selected === idx ? 'border-indigo scale-105 shadow-lg' : 'border-transparent hover:border-indigo-300'
          )}
        >
          <Image
            src={`/assessment/images/${src}`}
            alt={`Option ${idx + 1}`}
            width={200} height={200}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Commit question type components**

```bash
git add components/assessment/question-types/
git commit -m "feat: 8 question type UI components"
```

---

### Task 14: QuestionCard, ProgressBar, ProcessingScreen + assessment/page.tsx

**Files:**
- Create: `components/assessment/QuestionCard.tsx`
- Create: `components/assessment/ProgressBar.tsx`
- Create: `components/assessment/ProcessingScreen.tsx`
- Create: `app/assessment/page.tsx`

- [ ] **Step 1: Create ProgressBar.tsx**

```tsx
// components/assessment/ProgressBar.tsx
interface ProgressBarProps { answered: number; total: number }

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Question {answered + 1} of ~{total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo to-teal rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ProcessingScreen.tsx**

```tsx
// components/assessment/ProcessingScreen.tsx
export function ProcessingScreen() {
  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-50">
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute w-32 h-32 rounded-full border-4 border-indigo ring-animate opacity-60" />
        <div className="absolute w-24 h-24 rounded-full border-4 border-teal ring-animate-delay-1 opacity-50" />
        <div className="absolute w-16 h-16 rounded-full border-4 border-blue ring-animate-delay-2 opacity-40" />
        <div className="w-10 h-10 rounded-full bg-indigo" />
      </div>
      <h2 className="mt-10 text-2xl font-bold text-text">Kairos is mapping your potential</h2>
      <p className="mt-2 text-slate-500 text-base">Analyzing 29 dimensions across 6 layers<span className="animate-pulse">…</span></p>
    </div>
  )
}
```

- [ ] **Step 3: Create QuestionCard.tsx**

```tsx
// components/assessment/QuestionCard.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { LikertQuestion } from './question-types/LikertQuestion'
import { FrequencyQuestion } from './question-types/FrequencyQuestion'
import { ForcedChoiceQuestion } from './question-types/ForcedChoiceQuestion'
import { SituationalQuestion } from './question-types/SituationalQuestion'
import { TimedQuestion } from './question-types/TimedQuestion'
import { RankOrderQuestion } from './question-types/RankOrderQuestion'
import { AllocationQuestion } from './question-types/AllocationQuestion'
import { VisualQuestion } from './question-types/VisualQuestion'
import type { Question } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  onAnswer: (value: unknown) => void
}

const TIER_LABELS = ['Core Personality', 'Cognitive Architecture', 'Motivational DNA', 'Behavioral Expression', 'Leadership & Career', 'Resilience & Growth']

export function QuestionCard({ question, questionNumber, onAnswer }: QuestionCardProps) {
  const QuestionComponent = {
    likert: LikertQuestion,
    frequency: FrequencyQuestion,
    forced_choice: ForcedChoiceQuestion,
    situational: SituationalQuestion,
    timed: TimedQuestion,
    rank_order: RankOrderQuestion,
    allocation: AllocationQuestion,
    visual: VisualQuestion,
  }[question.type] as React.ComponentType<{ question: Question; onAnswer: (v: any) => void }>

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.code}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            {TIER_LABELS[question.tier - 1]}
          </p>
          <h2 className="text-xl font-semibold text-text leading-snug">{question.text}</h2>
        </div>
        <QuestionComponent question={question} onAnswer={onAnswer} />
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Create app/assessment/page.tsx**

```tsx
// app/assessment/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/assessment/QuestionCard'
import { ProgressBar } from '@/components/assessment/ProgressBar'
import { ProcessingScreen } from '@/components/assessment/ProcessingScreen'
import type { Question } from '@/lib/types'

type Phase = 'intro' | 'questions' | 'processing' | 'error'

export default function AssessmentPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [sessionToken, setSessionToken] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [total, setTotal] = useState(40)
  const [error, setError] = useState('')

  const startAssessment = async () => {
    try {
      const res = await fetch('/api/assessment/start', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to start assessment')
      const data = await res.json()
      localStorage.setItem('kairos_session', data.sessionToken)
      setSessionToken(data.sessionToken)
      setQuestions(data.questions)
      setTotal(data.questions.length)
      setPhase('questions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }

  const handleAnswer = useCallback(async (value: unknown) => {
    const question = questions[currentIdx]
    const startTime = Date.now()
    try {
      const res = await fetch('/api/assessment/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          questionCode: question.code,
          value,
          responseTimeMs: Date.now() - startTime,
          revised: false,
        }),
      })
      const data = await res.json()
      setAnswered(a => a + 1)

      if (data.nextQuestion) {
        setQuestions(q => [...q, data.nextQuestion])
        setTotal(data.progress.total)
        setCurrentIdx(i => i + 1)
      } else if (currentIdx + 1 < questions.length) {
        setCurrentIdx(i => i + 1)
      } else {
        // Assessment complete
        setPhase('processing')
        const processingStart = Date.now()
        const completeRes = await fetch('/api/assessment/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        })
        const completeData = await completeRes.json()
        // Enforce 2-second minimum processing display
        const elapsed = Date.now() - processingStart
        if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed))
        router.push(`/results/${completeData.resultId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }, [questions, currentIdx, sessionToken, router])

  if (phase === 'processing') return <ProcessingScreen />

  if (phase === 'error') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
        <p className="text-slate-600">{error}</p>
        <button onClick={() => setPhase('intro')} className="text-indigo underline">Try again</button>
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-bold text-text">Know Your Moment.</h1>
        <p className="text-lg text-slate-600">A scientifically grounded assessment of 29 dimensions that shape who you are and where you're going. ~12 minutes.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={startAssessment}
            className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors"
          >
            Begin Assessment
          </button>
        </div>
        <p className="text-sm text-slate-400">No account required · Free · ~40–82 questions</p>
      </div>
    </div>
  )

  const currentQuestion = questions[currentIdx]
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-xl mx-auto px-6 py-12 space-y-8">
        <ProgressBar answered={answered} total={total} />
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create placeholder SVGs for visual questions**

```bash
mkdir -p public/assessment/images
# Create 16 placeholder SVGs (4 questions × 4 images each)
for q in 1 2 3 4; do
  for opt in a b c d; do
    cat > public/assessment/images/visual_q${q}_${opt}.svg << 'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F8FAFC"/>
  <circle cx="100" cy="100" r="60" fill="none" stroke="#3730A3" stroke-width="3"/>
</svg>
SVG
  done
done
```

Note: Replace placeholder SVGs with actual abstract pattern images before launch. Each image should suggest different cognitive/personality orientations.

- [ ] **Step 6: Verify build**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm run build
```

Expected: clean compile

- [ ] **Step 7: Commit**

```bash
git add components/assessment/ app/assessment/ public/assessment/
git commit -m "feat: assessment UI — 8 question types, QuestionCard, ProgressBar, ProcessingScreen"
```

---

## Chunk 7: Results Report + Auth Gate

### Task 15: Chart components

**Files:**
- Create: `components/charts/RadarChart.tsx`
- Create: `components/charts/GaugeChart.tsx`
- Create: `components/charts/BarChart.tsx`

- [ ] **Step 1: Create RadarChart.tsx** (29-dimension radar grouped by tier)

```tsx
// components/charts/RadarChart.tsx
'use client'
import { RadarChart as RechartsRadar, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { DimensionScores } from '@/lib/types'

const DIMENSION_LABELS: Record<string, string> = {
  openness: 'Openness', conscientiousness: 'Conscientiousness', extraversion: 'Extraversion',
  agreeableness: 'Agreeableness', emotional_stability: 'Emotional Stability', honesty_humility: 'Honesty',
  cognitive_agility: 'Cognitive Agility', executive_function: 'Executive Function',
  attention_control: 'Attention Control', systems_thinking: 'Systems Thinking',
  creative_intelligence: 'Creativity', achievement_drive: 'Achievement', risk_tolerance: 'Risk Tolerance',
  autonomy_need: 'Autonomy', purpose_orientation: 'Purpose', competitive_drive: 'Competition',
  social_influence: 'Social Influence', conflict_navigation: 'Conflict Nav.', communication_style: 'Communication',
  collaboration_signature: 'Collaboration', leadership_drive: 'Leadership', founder_potential: 'Founder',
  strategic_orientation: 'Strategic', specialist_generalist: 'Generalist', innovation_index: 'Innovation',
  psychological_resilience: 'Resilience', growth_mindset: 'Growth Mindset',
  adaptability_quotient: 'Adaptability', learning_agility: 'Learning Agility',
}

interface Props { scores: DimensionScores }

export function DimensionRadarChart({ scores }: Props) {
  const data = Object.entries(scores)
    .filter(([key]) => key !== 'founder_potential')
    .map(([key, value]) => ({ subject: DIMENSION_LABELS[key] ?? key, score: value, fullMark: 100 }))

  return (
    <ResponsiveContainer width="100%" height={420}>
      <RechartsRadar data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
        <Radar name="Score" dataKey="score" stroke="#3730A3" fill="#3730A3" fillOpacity={0.2} strokeWidth={2} />
        <Tooltip formatter={(v) => [`${v}`, 'Score']} />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Create GaugeChart.tsx** (arc gauge for individual dimension scores)

```tsx
// components/charts/GaugeChart.tsx
'use client'

interface Props { score: number; label: string; size?: number }

export function GaugeChart({ score, label, size = 120 }: Props) {
  const radius = (size / 2) - 10
  const circumference = Math.PI * radius  // half-circle
  const strokeDashoffset = circumference - (score / 100) * circumference
  const cx = size / 2
  const cy = size / 2 + 10

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* Background arc */}
        <path
          d={`M 10,${cy} A ${radius},${radius} 0 0,1 ${size - 10},${cy}`}
          fill="none" stroke="#E2E8F0" strokeWidth={10} strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d={`M 10,${cy} A ${radius},${radius} 0 0,1 ${size - 10},${cy}`}
          fill="none" stroke="#3730A3" strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#1E293B" fontSize={size * 0.2} fontWeight="bold">
          {score}
        </text>
      </svg>
      <span className="text-xs text-slate-500 text-center">{label}</span>
    </div>
  )
}
```

- [ ] **Step 3: Create BarChart.tsx** (horizontal bar for score comparisons)

```tsx
// components/charts/BarChart.tsx
'use client'

interface BarItem { label: string; score: number; percentile?: number }
interface Props { items: BarItem[]; colorClass?: string }

export function HorizontalBarChart({ items, colorClass = 'bg-indigo' }: Props) {
  return (
    <div className="space-y-3">
      {items.map(({ label, score, percentile }) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-text">{label}</span>
            <span className="text-slate-500">{score}{percentile !== undefined ? ` · p${percentile}` : ''}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClass} rounded-full transition-all duration-700`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/charts/
git commit -m "feat: chart components (RadarChart, GaugeChart, BarChart)"
```

---

### Task 16: ReportSections 1–11 + AuthGate

**Files:**
- Create: `components/report/ReportSection1.tsx` through `ReportSection11.tsx`
- Create: `components/report/AuthGate.tsx`
- Create: `app/results/[id]/page.tsx`

- [ ] **Step 1: Create ReportSection1.tsx** (Archetype Hero)

```tsx
// components/report/ReportSection1.tsx
import { Badge } from '@/components/ui/Badge'
import type { AssessmentResult } from '@/lib/types'
import type { ArchetypeDefinition } from '@/lib/types'

interface Props { result: AssessmentResult; archetype: ArchetypeDefinition }

export function ReportSection1({ result, archetype }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo to-indigo-700 text-white p-8 md:p-12">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,#0F766E,transparent_60%)]" />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-200 text-sm uppercase tracking-widest mb-2">Your Archetype</p>
            <h1 className="text-4xl md:text-5xl font-bold">{archetype.name}</h1>
            <p className="text-indigo-200 text-lg mt-1">{archetype.subtitle}</p>
          </div>
          <div className="text-right">
            <span className="text-5xl font-bold">{result.match_score}%</span>
            <p className="text-indigo-200 text-sm">match confidence</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {archetype.signature3Words.map(w => (
            <Badge key={w} className="bg-white/20 text-white border-white/20">{w}</Badge>
          ))}
        </div>
        <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-indigo-100">
          "{archetype.quote}"
        </blockquote>
        <p className="text-indigo-200 text-sm">{archetype.rarity}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create ReportSection2.tsx** (Psychological Fingerprint + sentinel)

```tsx
// components/report/ReportSection2.tsx
'use client'
import { useRef } from 'react'
import { DimensionRadarChart } from '@/components/charts/RadarChart'
import { HorizontalBarChart } from '@/components/charts/BarChart'
import { getPercentile } from '@/lib/norms'
import type { AssessmentResult } from '@/lib/types'

interface Props { result: AssessmentResult; onSentinelRef: (el: HTMLDivElement | null) => void }

export function ReportSection2({ result, onSentinelRef }: Props) {
  const scores = result.scores
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const superpowers = sorted.slice(0, 3)
  const blindSpots = sorted.slice(-2)

  const barItems = Object.entries(scores)
    .filter(([k]) => k !== 'founder_potential')
    .map(([k, v]) => ({
      label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      score: v,
      percentile: getPercentile(k, v),
    }))

  return (
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold text-text">Your Psychological Fingerprint</h2>
      <DimensionRadarChart scores={scores} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-teal">Superpowers</h3>
          {superpowers.map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span>{k.replace(/_/g, ' ')}</span>
              <span className="font-bold text-teal">{v} · p{getPercentile(k, v)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-500">Growth Areas</h3>
          {blindSpots.map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span>{k.replace(/_/g, ' ')}</span>
              <span className="font-bold text-slate-400">{v} · p{getPercentile(k, v)}</span>
            </div>
          ))}
        </div>
      </div>
      <HorizontalBarChart items={barItems} />
      {/* Auth gate sentinel — IntersectionObserver watches this */}
      <div ref={onSentinelRef} id="section-2-sentinel" className="h-px" />
    </section>
  )
}
```

- [ ] **Step 3: Create ReportSection3.tsx** (Deep Archetype Profile)

```tsx
// components/report/ReportSection3.tsx
import type { ArchetypeDefinition } from '@/lib/types'

export function ReportSection3({ archetype }: { archetype: ArchetypeDefinition }) {
  const sections = [
    { title: 'Who You Are', content: archetype.who_you_are },
    { title: 'How You Think', content: archetype.how_you_think },
    { title: 'What Drives You', content: archetype.what_drives_you },
    { title: 'How You Show Up', content: archetype.how_you_show_up },
    { title: 'Your Shadow Side', content: archetype.shadow_side },
  ].filter(s => s.content)

  const isStub = sections.length === 0

  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Deep Archetype Profile</h2>
      {isStub ? (
        <div className="p-6 rounded-2xl bg-indigo-50 text-indigo text-center">
          <p className="font-semibold">Full profile coming soon</p>
          <p className="text-sm mt-1 text-indigo-600">{archetype.description}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(({ title, content }) => (
            <div key={title} className="space-y-2">
              <h3 className="font-semibold text-indigo">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{content}</p>
            </div>
          ))}
          {archetype.famous_examples && (
            <div>
              <h3 className="font-semibold text-indigo mb-2">Famous Examples</h3>
              <div className="flex flex-wrap gap-2">
                {archetype.famous_examples.map(name => (
                  <span key={name} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo text-sm">{name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Create ReportSections 4–11** (abbreviated for size)

Create each as a standalone component in `components/report/`. Below is the pattern for sections 4–11:

```tsx
// components/report/ReportSection4.tsx — Cognitive Profile
import { GaugeChart } from '@/components/charts/GaugeChart'
import { getPercentile } from '@/lib/norms'
import type { AssessmentResult } from '@/lib/types'

const COG_DIMS = ['cognitive_agility','executive_function','attention_control','systems_thinking','creative_intelligence'] as const

export function ReportSection4({ result }: { result: AssessmentResult }) {
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Cognitive Profile</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {COG_DIMS.map(dim => (
          <GaugeChart key={dim} score={result.scores[dim]} label={dim.replace(/_/g,' ')} />
        ))}
      </div>
      <div className="space-y-3">
        {COG_DIMS.map(dim => (
          <div key={dim} className="flex justify-between text-sm">
            <span className="capitalize">{dim.replace(/_/g,' ')}</span>
            <span className="text-indigo font-medium">{result.scores[dim]} · p{getPercentile(dim, result.scores[dim])}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

```tsx
// components/report/ReportSection5.tsx — Motivational Architecture
import type { AssessmentResult } from '@/lib/types'
const MOT_DIMS = ['achievement_drive','risk_tolerance','autonomy_need','purpose_orientation','competitive_drive'] as const
const LABELS: Record<string, string> = { achievement_drive: 'Achievement Drive', risk_tolerance: 'Risk Tolerance', autonomy_need: 'Autonomy Need', purpose_orientation: 'Purpose Orientation', competitive_drive: 'Competitive Drive' }

export function ReportSection5({ result, archetype }: { result: AssessmentResult; archetype: any }) {
  const sorted = [...MOT_DIMS].sort((a, b) => result.scores[b] - result.scores[a])
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Motivational Architecture</h2>
      <div className="space-y-3">
        <h3 className="font-semibold text-teal">Top Drivers</h3>
        {sorted.slice(0,5).map((d,i) => (
          <div key={d} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-teal text-white text-xs flex items-center justify-center">{i+1}</span>
            <span className="flex-1">{LABELS[d]}</span>
            <span className="font-bold text-teal">{result.scores[d]}</span>
          </div>
        ))}
      </div>
      {archetype.ideal_work_conditions && (
        <div>
          <h3 className="font-semibold text-indigo mb-2">Ideal Work Conditions</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
            {archetype.ideal_work_conditions.map((c: string) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      )}
    </section>
  )
}
```

```tsx
// components/report/ReportSection6.tsx — Career Intelligence
import type { AssessmentResult } from '@/lib/types'
export function ReportSection6({ result, archetype }: { result: AssessmentResult; archetype: any }) {
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Career Intelligence</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-indigo mb-3">Primary Verticals</h3>
          <div className="space-y-2">
            {(archetype.career_verticals_primary ?? []).map((v: string) => (
              <div key={v} className="px-4 py-2 bg-indigo-50 rounded-lg text-indigo text-sm font-medium">{v}</div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-500 mb-3">Secondary Verticals</h3>
          <div className="space-y-2">
            {(archetype.career_verticals_secondary ?? []).map((v: string) => (
              <div key={v} className="px-4 py-2 bg-slate-50 rounded-lg text-slate-600 text-sm">{v}</div>
            ))}
          </div>
        </div>
      </div>
      {archetype.dream_roles && (
        <div>
          <h3 className="font-semibold text-indigo mb-2">Dream Roles</h3>
          <div className="flex flex-wrap gap-2">
            {archetype.dream_roles.map((r: string) => (
              <span key={r} className="px-3 py-1.5 bg-indigo text-white rounded-full text-sm">{r}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
```

```tsx
// components/report/ReportSection7.tsx — Leadership Profile
import type { AssessmentResult } from '@/lib/types'
export function ReportSection7({ result, archetype }: { result: AssessmentResult; archetype: any }) {
  const { leadership_tier, leadership_score } = result.hpif_profile.career_potential_matrix
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Leadership Profile</h2>
      <div className="flex items-center gap-4 p-6 rounded-2xl bg-indigo-50">
        <div>
          <p className="text-4xl font-bold text-indigo">{leadership_score}</p>
          <p className="text-indigo-600 text-sm">Leadership Score</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-indigo">{leadership_tier}</p>
          <p className="text-indigo-600 text-sm">Leadership Tier</p>
        </div>
      </div>
      {archetype.leadership_style && (
        <div><h3 className="font-semibold text-indigo mb-1">Style</h3><p className="text-slate-600">{archetype.leadership_style}</p></div>
      )}
      {archetype.leadership_strengths && (
        <div>
          <h3 className="font-semibold text-teal mb-2">Strengths</h3>
          <ul className="space-y-1">{archetype.leadership_strengths.map((s: string) => <li key={s} className="text-slate-600 text-sm flex gap-2"><span className="text-teal">✓</span>{s}</li>)}</ul>
        </div>
      )}
    </section>
  )
}
```

```tsx
// components/report/ReportSection8.tsx — Team Intelligence
import type { AssessmentResult } from '@/lib/types'
export function ReportSection8({ result, archetype }: { result: AssessmentResult; archetype: any }) {
  const tc = result.hpif_profile.team_compatibility
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Team Intelligence</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Team Role', value: tc.team_role },
          { label: 'Remote Preference', value: tc.remote_orientation },
          { label: 'Team Size', value: tc.team_size_preference },
          { label: 'Style', value: tc.collaboration_style.split(' ')[0] },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-xl bg-white border border-slate-100 text-center">
            <p className="text-lg font-bold text-indigo">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div><h3 className="font-semibold text-teal mb-2">Best Partners</h3>{archetype.best_partners?.map((p: string) => <p key={p} className="text-sm text-slate-600 capitalize">{p.replace(/_/g,' ')}</p>)}</div>
        <div><h3 className="font-semibold text-blue mb-2">Growth Partners</h3>{archetype.growth_partners?.map((p: string) => <p key={p} className="text-sm text-slate-600 capitalize">{p.replace(/_/g,' ')}</p>)}</div>
        <div><h3 className="font-semibold text-slate-500 mb-2">Friction Risk</h3>{archetype.friction_archetypes?.map((p: string) => <p key={p} className="text-sm text-slate-600 capitalize">{p.replace(/_/g,' ')}</p>)}</div>
      </div>
    </section>
  )
}
```

```tsx
// components/report/ReportSection9.tsx — Founder Profile
import type { AssessmentResult } from '@/lib/types'
export function ReportSection9({ result, archetype }: { result: AssessmentResult; archetype: any }) {
  const { founder_score, founder_tier } = result.hpif_profile.career_potential_matrix
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Founder & Entrepreneur Profile</h2>
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-teal-50">
        <div className="text-center">
          <p className="text-4xl font-bold text-teal">{founder_score}</p>
          <p className="text-teal-600 text-sm">Founder Potential</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-teal">{founder_tier}</p>
          <p className="text-teal-600 text-sm">Entrepreneurial Tier</p>
          <p className="text-xs text-teal-500 mt-1">Composite of risk tolerance, creativity, resilience, and drive</p>
        </div>
      </div>
    </section>
  )
}
```

```tsx
// components/report/ReportSection10.tsx — Work Environment Match
import type { AssessmentResult } from '@/lib/types'
export function ReportSection10({ result }: { result: AssessmentResult }) {
  const scores = result.scores
  const environments = [
    { label: 'Fast-paced & Ambiguous', score: Math.round((scores.adaptability_quotient + scores.risk_tolerance) / 2) },
    { label: 'Structured & Predictable', score: Math.round((scores.conscientiousness + 100 - scores.risk_tolerance) / 2) },
    { label: 'Creative & Open', score: Math.round((scores.openness + scores.creative_intelligence) / 2) },
    { label: 'Collaborative & Social', score: Math.round((scores.extraversion + scores.collaboration_signature) / 2) },
    { label: 'Independent & Focused', score: Math.round((scores.autonomy_need + scores.attention_control) / 2) },
    { label: 'Strategic & High-Stakes', score: Math.round((scores.strategic_orientation + scores.leadership_drive) / 2) },
    { label: 'Mission-Driven', score: Math.round((scores.purpose_orientation + scores.growth_mindset) / 2) },
  ]
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Work Environment Match</h2>
      <div className="space-y-3">
        {environments.sort((a,b) => b.score - a.score).map(env => (
          <div key={env.label} className="space-y-1">
            <div className="flex justify-between text-sm"><span>{env.label}</span><span className="font-medium text-indigo">{env.score}</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-gradient-to-r from-indigo to-teal rounded-full" style={{ width: `${env.score}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

```tsx
// components/report/ReportSection11.tsx — Growth Roadmap
import type { AssessmentResult } from '@/lib/types'
export function ReportSection11({ result, archetype }: { result: AssessmentResult; archetype: any }) {
  const scores = result.scores
  const growthDims = Object.entries(scores).sort(([,a],[,b]) => a-b).slice(0,3).map(([k]) => k)
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-text">Growth Roadmap</h2>
      <div className="space-y-4">
        {growthDims.map(dim => (
          <div key={dim} className="p-5 rounded-2xl bg-white border border-slate-100">
            <h3 className="font-semibold text-indigo capitalize mb-1">{dim.replace(/_/g,' ')}</h3>
            <p className="text-sm text-slate-600">{archetype.development_areas?.[dim] ?? `Developing your ${dim.replace(/_/g,' ')} will unlock significant new capability. Focus on deliberate practice in this area.`}</p>
          </div>
        ))}
      </div>
      {archetype.challenge_90_day && (
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
          <h3 className="font-semibold text-indigo mb-1">90-Day Challenge</h3>
          <p className="text-sm text-indigo-800">{archetype.challenge_90_day}</p>
        </div>
      )}
      {archetype.vision_1_year && (
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
          <h3 className="font-semibold text-teal mb-1">1-Year Vision</h3>
          <p className="text-sm text-teal-800">{archetype.vision_1_year}</p>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 5: Create AuthGate.tsx**

```tsx
// components/report/AuthGate.tsx
// AuthGateOverlay: fixed-position sign-up overlay. IntersectionObserver is managed
// by ResultsClient, which passes show=true when the Section 2 sentinel leaves viewport.
'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { claimAssessment } from '@/app/(auth)/signup/actions'

interface Props {
  show: boolean
  sessionToken: string
  onAuthenticated: () => void
}

export function AuthGateOverlay({ show, sessionToken, onAuthenticated }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authErr } = await supabase.auth.signUp({ email, password })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    if (data.user && sessionToken) await claimAssessment(sessionToken, data.user.id)
    onAuthenticated()
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-white/60 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text">Unlock Your Full Report</h2>
              <p className="text-slate-500 mt-2">Create a free account to access your complete 11-section analysis.</p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" required />
              <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" minLength={8} required />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-indigo text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-colors">
                {loading ? 'Creating account…' : 'Unlock Full Report — Free'}
              </button>
            </form>
            <p className="text-xs text-slate-400 text-center">Free forever during early access. No credit card required.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 6: Create app/results/[id]/page.tsx**

```tsx
// app/results/[id]/page.tsx
import { notFound } from 'next/navigation'
import { ReportSection1 } from '@/components/report/ReportSection1'
import { ReportSection2 } from '@/components/report/ReportSection2'
import { ReportSection3 } from '@/components/report/ReportSection3'
import { ReportSection4 } from '@/components/report/ReportSection4'
import { ReportSection5 } from '@/components/report/ReportSection5'
import { ReportSection6 } from '@/components/report/ReportSection6'
import { ReportSection7 } from '@/components/report/ReportSection7'
import { ReportSection8 } from '@/components/report/ReportSection8'
import { ReportSection9 } from '@/components/report/ReportSection9'
import { ReportSection10 } from '@/components/report/ReportSection10'
import { ReportSection11 } from '@/components/report/ReportSection11'
import { ResultsClient } from './ResultsClient'

export default async function ResultsPage({ params }: { params: { id: string } }) {
  // SSR: fetch via internal API route
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/results/${params.id}`, { cache: 'force-cache' })
  if (!res.ok) notFound()
  const data = await res.json()

  return (
    <ResultsClient result={data} archetypeContent={data.archetypeContent} resultId={params.id} />
  )
}
```

```tsx
// app/results/[id]/ResultsClient.tsx
'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { AuthGateOverlay } from '@/components/report/AuthGate'
import { ReportSection1 } from '@/components/report/ReportSection1'
import { ReportSection2 } from '@/components/report/ReportSection2'
import { ReportSection3 } from '@/components/report/ReportSection3'
import { ReportSection4 } from '@/components/report/ReportSection4'
import { ReportSection5 } from '@/components/report/ReportSection5'
import { ReportSection6 } from '@/components/report/ReportSection6'
import { ReportSection7 } from '@/components/report/ReportSection7'
import { ReportSection8 } from '@/components/report/ReportSection8'
import { ReportSection9 } from '@/components/report/ReportSection9'
import { ReportSection10 } from '@/components/report/ReportSection10'
import { ReportSection11 } from '@/components/report/ReportSection11'
import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

interface Props { result: AssessmentResult; archetypeContent: ArchetypeDefinition; resultId: string }

export function ResultsClient({ result, archetypeContent, resultId }: Props) {
  const [authenticated, setAuthenticated] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('kairos_session') ?? '' : ''

  // sentinelRef is passed to ReportSection2, which places it at the section bottom
  const sentinelRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null }
    if (!el) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !authenticated) setShowGate(true)
        else if (entry.isIntersecting) setShowGate(false)
      },
      { threshold: 0 }
    )
    observerRef.current.observe(el)
  }, [authenticated])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-2">
        <ReportSection1 result={result} archetype={archetypeContent} />
        <ReportSection2 result={result} onSentinelRef={sentinelRef} />
        {/* Sections 3–11: always in DOM; blurred while gate is active */}
        <div className={!authenticated && showGate ? 'blur-sm pointer-events-none select-none' : ''} style={{ transition: 'filter 0.3s' }}>
          <ReportSection3 archetype={archetypeContent} />
          <ReportSection4 result={result} />
          <ReportSection5 result={result} archetype={archetypeContent} />
          <ReportSection6 result={result} archetype={archetypeContent} />
          <ReportSection7 result={result} archetype={archetypeContent} />
          <ReportSection8 result={result} archetype={archetypeContent} />
          <ReportSection9 result={result} archetype={archetypeContent} />
          <ReportSection10 result={result} />
          <ReportSection11 result={result} archetype={archetypeContent} />
        </div>
      </div>
      {/* Auth gate overlay — fixed position, rendered outside scroll container */}
      <AuthGateOverlay
        show={showGate && !authenticated}
        sessionToken={sessionToken}
        onAuthenticated={() => { setAuthenticated(true); setShowGate(false) }}
      />
    </div>
  )
}
```

- [ ] **Step 7: Verify build**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm run build
```

Expected: clean compile

- [ ] **Step 8: Commit**

```bash
git add components/report/ components/charts/ app/results/
git commit -m "feat: 11-section results report + AuthGate + chart components"
```

---

## Chunk 8: Auth + Layout + Marketing Pages

### Task 17: Header, Footer, LayoutShell

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/LayoutShell.tsx`

- [ ] **Step 1: Create Header.tsx**

```tsx
// components/layout/Header.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo">Kairos</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-text">
          <Link href="/science" className="hover:text-indigo transition-colors">Science</Link>
          <Link href="/pricing" className="hover:text-indigo transition-colors">Pricing</Link>
          <Link href="/enterprise" className="hover:text-indigo transition-colors">Enterprise</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-indigo">Log in</Link>
          <Link href="/assessment" className="text-sm bg-indigo text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium">
            Take Assessment
          </Link>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create Footer.tsx**

```tsx
// components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-bg py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-bold text-indigo text-lg">Kairos</p>
            <p className="text-slate-500 text-sm mt-1">Know your moment.</p>
          </div>
          <div className="flex gap-12 text-sm text-slate-600">
            <div className="space-y-2">
              <p className="font-medium text-text">Product</p>
              <Link href="/assessment" className="block hover:text-indigo">Assessment</Link>
              <Link href="/pricing" className="block hover:text-indigo">Pricing</Link>
              <Link href="/science" className="block hover:text-indigo">Science</Link>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-text">Company</p>
              <Link href="/enterprise" className="block hover:text-indigo">Enterprise</Link>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-8">© 2026 Kairos. All rights reserved.</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Update app/layout.tsx to wrap with Header + Footer**

```tsx
// app/layout.tsx — updated
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

export const metadata: Metadata = {
  title: 'Kairos — Know your moment.',
  description: 'Discover your Human Potential Intelligence Profile. 29 dimensions, 32 archetypes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/ app/layout.tsx
git commit -m "feat: Header, Footer, updated RootLayout"
```

---

### Task 18: Auth pages + dashboard + profile

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Create: `app/(app)/dashboard/page.tsx`
- Create: `app/(app)/profile/page.tsx`

- [ ] **Step 1: Create app/(auth)/login/page.tsx**

```tsx
// app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [error, setError] = useState(''), [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const supabase = createClient()
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Welcome back</h1>
          <p className="text-slate-500 mt-1">Log in to your Kairos account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-colors">
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/(auth)/signup/page.tsx**

```tsx
// app/(auth)/signup/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { claimAssessment } from './actions'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [name, setName] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authErr } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    // Claim anonymous assessment if one exists
    const sessionToken = localStorage.getItem('kairos_session') ?? ''
    if (data.user && sessionToken) await claimAssessment(sessionToken, data.user.id)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Create your account</h1>
          <p className="text-slate-500 mt-1">Free forever during early access</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-4">
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" required />
          <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" minLength={8} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-colors">
            {loading ? 'Creating account…' : 'Create Account — Free'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create app/(app)/dashboard/page.tsx** (stub)

```tsx
// app/(app)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user's completed assessments
  const { data: assessments } = await supabase
    .from('assessments')
    .select('id, completed_at, results(id, archetype, match_score)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Your Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user.email}</p>
        </div>
        {!assessments?.length ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-slate-500">You haven't taken an assessment yet.</p>
            <Link href="/assessment" className="bg-indigo text-white px-6 py-3 rounded-xl font-semibold inline-block hover:bg-indigo-600">
              Take Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((a: any) => (
              <div key={a.id} className="bg-white rounded-2xl p-6 border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-text capitalize">{a.results?.[0]?.archetype?.replace(/_/g,' ') ?? 'Assessment'}</p>
                  <p className="text-slate-500 text-sm">{a.results?.[0]?.match_score}% match · {new Date(a.completed_at).toLocaleDateString()}</p>
                </div>
                <Link href={`/results/${a.results?.[0]?.id}`} className="text-indigo text-sm hover:underline">View Report →</Link>
              </div>
            ))}
          </div>
        )}
        <div className="text-center">
          <Link href="/assessment" className="text-sm text-indigo hover:underline">Retake Assessment</Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create app/(app)/profile/page.tsx** (stub)

```tsx
// app/(app)/profile/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-text">Your Profile</h1>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
          <div><p className="text-xs text-slate-500 uppercase tracking-wider">Email</p><p className="text-text">{user.email}</p></div>
          <div><p className="text-xs text-slate-500 uppercase tracking-wider">Member since</p><p className="text-text">{new Date(user.created_at).toLocaleDateString()}</p></div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create app/admin/page.tsx** (stub)

```tsx
// app/admin/page.tsx
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Coming soon — internal metrics and assessment management.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add app/'(auth)'/ app/'(app)'/ app/admin/
git commit -m "feat: auth pages (login, signup), dashboard, profile, admin stub"
```

---

### Task 19: Landing page + marketing pages

**Files:**
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/science/page.tsx`
- Create: `app/(marketing)/pricing/page.tsx`
- Create: `app/(marketing)/enterprise/page.tsx`

- [ ] **Step 1: Create app/(marketing)/page.tsx** (9 sections)

```tsx
// app/(marketing)/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,#3730A315,transparent_60%),radial-gradient(ellipse_at_20%_80%,#0F766E10,transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
          <Badge variant="indigo">Now in early access</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-text leading-tight">
            Know your<br /><span className="text-indigo">moment.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The most scientifically rigorous human potential assessment available. 29 dimensions. 32 archetypes. Your complete intelligence profile in 12 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors">
              Take the Free Assessment
            </Link>
            <Link href="/results/demo" className="border border-indigo text-indigo px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors">
              See a Sample Report
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Social proof bar */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm text-slate-500">
          {['10,000+ assessments completed', '32 unique archetypes', '29 validated dimensions', 'Built on Big Five + HEXACO research'].map(stat => (
            <span key={stat} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />{stat}
            </span>
          ))}
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-text text-center mb-12">How Kairos Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Take the Assessment', desc: '40–82 adaptive questions across 29 dimensions. ~12 minutes. No registration required.' },
            { step: '2', title: 'Get Your Profile', desc: 'Our scoring engine analyzes cognitive, motivational, behavioral, and leadership dimensions.' },
            { step: '3', title: 'Unlock Deep Insight', desc: 'Your archetype, HPIF profile, career intelligence, team compatibility, and 90-day growth plan.' },
          ].map(({ step, title, desc }) => (
            <Card key={step} className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo text-white text-xl font-bold flex items-center justify-center mx-auto">{step}</div>
              <h3 className="font-semibold text-text text-lg">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 4: Archetype Showcase */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-4">32 Human Archetypes</h2>
          <p className="text-slate-500 text-center mb-10">Each archetype is a pattern of dimensions that describes who you are and how you operate.</p>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {['Strategic Visionary','Empathetic Leader','Systematic Builder','Creative Catalyst','Analytical Architect','Innovation Pioneer'].map(name => (
              <Card key={name} className="min-w-48 text-center flex-shrink-0 space-y-2 bg-gradient-to-br from-indigo-50 to-white">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo to-teal mx-auto" />
                <p className="font-semibold text-text text-sm">{name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Science */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-text text-center mb-12">Built on Science</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Big Five + HEXACO', desc: 'The most validated personality frameworks in academic research.' },
            { title: 'Adaptive IRT', desc: 'Questions calibrate to your response patterns, maximizing precision in fewer questions.' },
            { title: 'Behavioral Inference', desc: 'Response time and revision patterns reveal what self-report misses.' },
            { title: 'Normative Benchmarks', desc: 'Every score contextualized against general adult population percentiles.' },
          ].map(({ title, desc }) => (
            <Card key={title} glass className="space-y-2">
              <h3 className="font-semibold text-indigo">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 6: Report Preview */}
      <section className="bg-gradient-to-br from-indigo to-indigo-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white space-y-6">
          <h2 className="text-3xl font-bold">An 11-Section Deep Report</h2>
          <p className="text-indigo-200">Archetype Profile · Psychological Fingerprint · Cognitive Profile · Motivational DNA · Career Intelligence · Leadership Profile · Team Compatibility · Founder Score · Work Environment · Growth Roadmap</p>
          <Link href="/results/demo" className="inline-block bg-white text-indigo px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
            See Sample Report →
          </Link>
        </div>
      </section>

      {/* Section 7: For Companies */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="teal">Enterprise</Badge>
            <h2 className="text-3xl font-bold text-text">Built for Team Intelligence</h2>
            <p className="text-slate-600">Kairos Enterprise gives HR teams and founders a scientific lens into candidate potential, team composition, and organizational capability gaps.</p>
            <Link href="/enterprise" className="inline-block border border-teal text-teal px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors">
              Learn More →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Trait-based hiring','Team compatibility matrix','Leadership potential scoring','Culture fit analysis'].map(feature => (
              <div key={feature} className="p-4 bg-white rounded-xl border border-slate-100 text-sm text-slate-600">{feature}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Pricing preview */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text text-center mb-10">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: 'Free', price: '$0', features: ['Sections 1–2', 'No account required', 'Archetype + Fingerprint'] },
              { name: 'Professional', price: '$29/mo', features: ['Full 11-section report', 'Retakes', 'Growth tracking'], highlight: true },
              { name: 'Enterprise', price: 'Custom', features: ['Candidate assessments', 'Team dashboard', 'API access'] },
            ].map(({ name, price, features, highlight }) => (
              <Card key={name} className={highlight ? 'border-2 border-indigo' : ''}>
                <div className="space-y-3">
                  <p className="font-bold text-text text-lg">{name}</p>
                  <p className="text-3xl font-bold text-indigo">{price}</p>
                  <ul className="space-y-1">{features.map(f => <li key={f} className="text-sm text-slate-600 flex gap-2"><span className="text-teal">✓</span>{f}</li>)}</ul>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-6">Free forever for individuals during early access.</p>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-4xl font-bold text-text">Ready to know your moment?</h2>
        <p className="text-slate-500 text-lg">12 minutes to your complete Human Potential Intelligence Profile.</p>
        <Link href="/assessment" className="inline-block bg-indigo text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors">
          Take the Free Assessment
        </Link>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create science/pricing/enterprise pages** (static content)

```tsx
// app/(marketing)/science/page.tsx
export default function SciencePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">The Science of Kairos</h1>
          <p className="text-slate-500 text-lg">Built on decades of validated psychological research.</p>
        </div>
        <div className="space-y-8">
          {[
            { title: 'Big Five Personality Model', body: 'The most replicated and validated personality framework in academic psychology. Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability predict life outcomes across cultures.' },
            { title: 'HEXACO Model', body: 'Adds Honesty-Humility to capture ethical orientation and integrity, which predicts counterproductive work behavior and leadership effectiveness beyond the Big Five.' },
            { title: 'Self-Determination Theory', body: 'Ryan & Deci\'s framework for intrinsic vs extrinsic motivation forms the basis of our Motivational Architecture layer, including autonomy need and purpose orientation.' },
            { title: 'Adaptive Item Response Theory', body: 'Our simplified IRT engine identifies ambiguous dimensions (35–65 range) after calibration and targets additional questions, maximizing measurement precision.' },
            { title: 'Behavioral Inference', body: 'Response time and revision rate provide implicit behavioral signals that complement self-reported answers, detecting socially desirable responding.' },
            { title: 'HPIF Framework', body: 'The Human Potential Intelligence Framework integrates all 29 dimensions into 6 structural layers: Cognitive OS, Motivational Architecture, Behavioral Expression, Growth Vector, Career Potential Matrix, and Team Compatibility.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 space-y-2">
              <h2 className="text-xl font-semibold text-indigo">{title}</h2>
              <p className="text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

```tsx
// app/(marketing)/pricing/page.tsx
import Link from 'next/link'

const TIERS = [
  { name: 'Free', price: '$0', period: '', target: 'Individuals', features: ['Sections 1–2 (no sign-up)', 'Archetype hero', 'Psychological Fingerprint radar'] },
  { name: 'Professional', price: '$29', period: '/month', target: 'Power users', features: ['Full 11-section report', 'Unlimited retakes', 'Growth tracking dashboard', 'PDF export (coming soon)'], cta: 'Get Professional', highlight: true },
  { name: 'Corporate', price: '$25', period: '/candidate', target: 'HR teams', features: ['Candidate assessment portal', 'Hiring dashboard', 'Team compatibility matrix', 'Bulk reporting'] },
  { name: 'Recruiter Network', price: '$499', period: '/month', target: 'Recruiters', features: ['Trait-based candidate search', 'Unlimited assessments', 'API access (limited)'], badge: 'Coming soon' },
  { name: 'Talent API', price: '$1', period: '/analysis', target: 'Developers', features: ['REST API access', 'Full dimension scores', 'Archetype assignment'], badge: 'Coming soon' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">Simple, Transparent Pricing</h1>
          <p className="text-slate-500">Free forever for individuals during early access.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TIERS.map(tier => (
            <div key={tier.name} className={`bg-white rounded-2xl p-6 border space-y-4 ${tier.highlight ? 'border-2 border-indigo' : 'border-slate-100'}`}>
              {tier.badge && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{tier.badge}</span>}
              <div>
                <p className="font-bold text-text">{tier.name}</p>
                <p className="text-sm text-slate-500">{tier.target}</p>
              </div>
              <div className="text-3xl font-bold text-indigo">{tier.price}<span className="text-base font-normal text-slate-400">{tier.period}</span></div>
              <ul className="space-y-2">{tier.features.map(f => <li key={f} className="text-xs text-slate-600 flex gap-1"><span className="text-teal shrink-0">✓</span>{f}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

```tsx
// app/(marketing)/enterprise/page.tsx
import Link from 'next/link'

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">Kairos for Enterprise</h1>
          <p className="text-slate-500 text-lg">Scientific intelligence for hiring teams and organizational leaders.</p>
          <Link href="mailto:enterprise@kairos.ai" className="inline-block bg-indigo text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors">
            Contact Sales
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Trait-Based Hiring', desc: 'Assess candidates against validated dimension profiles for any role — not gut feel, not credentials.' },
            { title: 'Team Composition Analysis', desc: 'Understand your team\'s collective strengths, blind spots, and the archetype gaps that limit performance.' },
            { title: 'Leadership Pipeline', desc: 'Identify high-potential leaders using our Leadership Tier scoring and founder potential composite.' },
            { title: 'Culture Fit Science', desc: 'Match candidates to team composition using archetype compatibility matrices, not vibes.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-slate-100 space-y-2">
              <h2 className="font-semibold text-indigo">{title}</h2>
              <p className="text-slate-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm run build
```

Expected: clean compile

- [ ] **Step 4: Commit**

```bash
git add app/'(marketing)'/ components/layout/
git commit -m "feat: landing page (9 sections) + science, pricing, enterprise pages"
```

---

### Task 20: Demo result seed + deployment

**Files:**
- Create: `scripts/seed-demo-result.ts`

- [ ] **Step 1: Create demo result seed script**

```typescript
// scripts/seed-demo-result.ts
// Creates a demo assessment + result with a fixed UUID for the "See sample report" CTA
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { QUESTIONS, CONSTRUCT_PAIRS } from '../lib/questions'
import { computeScores } from '../lib/scoring'
import { computeInference } from '../lib/inference'
import { computeHpif } from '../lib/hpif'
import { assignArchetype, ARCHETYPES } from '../lib/archetypes'
import type { Response as AssessmentResponse, DimensionScores } from '../lib/types'
dotenv.config({ path: '.env.local' })

const DEMO_RESULT_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_SESSION = 'demo-session-strategic-visionary'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDemo() {
  // Upsert demo assessment
  const { data: assessment } = await supabase
    .from('assessments')
    .upsert({ session_token: DEMO_SESSION, status: 'completed', completed_at: new Date().toISOString() }, { onConflict: 'session_token' })
    .select('id').single()

  if (!assessment) throw new Error('Failed to create demo assessment')

  // Create demo scores weighted toward strategic_visionary
  const mockResponses: AssessmentResponse[] = QUESTIONS.map(q => ({
    questionCode: q.code, value: q.dimension === 'openness' || q.dimension === 'leadership_drive' || q.dimension === 'cognitive_agility' ? 5 :
      q.dimension === 'conscientiousness' || q.dimension === 'emotional_stability' ? 3 : 4,
    responseTimeMs: 2500, revised: false, dimension: q.dimension,
  }))
  const partialScores = computeScores(mockResponses, QUESTIONS)
  const inference = computeInference({ responses: mockResponses, constructPairs: CONSTRUCT_PAIRS })
  const { scores, hpif } = computeHpif(partialScores as DimensionScores)
  const { archetype, matchScore } = assignArchetype(scores, ARCHETYPES)

  // Upsert demo result with fixed UUID
  await supabase.from('results').upsert({
    id: DEMO_RESULT_ID,
    assessment_id: assessment.id,
    scores, hpif_profile: hpif, archetype, match_score: matchScore,
    inference_data: { avgResponseMs: inference.avgResponseMs, revisionRate: inference.revisionRate, consistencyScore: inference.consistencyScore },
  }, { onConflict: 'id' })

  console.log(`Demo result seeded: /results/${DEMO_RESULT_ID}`)
  console.log(`Archetype: ${archetype}, Match: ${matchScore}%`)
}

seedDemo().catch(console.error)
```

- [ ] **Step 1b: Ensure ts-node is installed** (needed for seed scripts)

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm install --save-dev ts-node
```

- [ ] **Step 2: Run demo seed**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx ts-node --project tsconfig.json scripts/seed-demo-result.ts
```

Expected: "Demo result seeded: /results/00000000-0000-0000-0000-000000000001"

- [ ] **Step 3: Update landing page "See Sample Report" link**

The landing page already links to `/results/demo`. Update the redirect: create `app/results/demo/page.tsx`:

```tsx
// app/results/demo/page.tsx
import { redirect } from 'next/navigation'
export default function DemoRedirect() {
  redirect('/results/00000000-0000-0000-0000-000000000001')
}
```

- [ ] **Step 4: Run all tests before deploy**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npx jest
```

Expected: all tests pass (norms, scoring, inference, hpif, archetypes)

- [ ] **Step 5: Production build**

```bash
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
npm run build
```

Expected: clean compile, no type errors

- [ ] **Step 6: Deploy to Vercel**

Set environment variables in Vercel dashboard (or via CLI) before deploying:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL)

```bash
~/.local/bin/vercel --prod --yes
```

- [ ] **Step 7: Smoke test production**

Visit the deployed URL and verify:
1. Landing page loads
2. "Take Assessment" → assessment page → first question appears
3. "See Sample Report" → `/results/00000000-0000-0000-0000-000000000001` loads Section 1 + 2
4. Scroll past Section 2 → Auth gate overlay appears
5. Sign up → gate dismisses → Sections 3–11 visible
6. Dashboard shows completed assessment

- [ ] **Step 8: Final commit**

```bash
git add scripts/seed-demo-result.ts app/results/demo/
git commit -m "feat: demo result seed + deploy"
```

---

## Plan Complete

All 20 tasks across 9 chunks are ready for implementation.

**Execution order:** Chunks must be implemented sequentially. Each chunk's build verification step must pass before proceeding to the next.

**Critical path:** DB schema (Task 5) must be applied before running seed scripts (Tasks 6, 20). All lib/ tests (Tasks 7–10) should pass before API routes (Task 11) are implemented.

**To execute:** Use `superpowers:subagent-driven-development` to implement this plan task by task.
