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
