import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { QUESTIONS, CONSTRUCT_PAIRS } from '../lib/questions'
import { computeScores, extractRawValue } from '../lib/scoring'
import { computeInference } from '../lib/inference'
import { computeHpif } from '../lib/hpif'
import { assignArchetype, ARCHETYPES } from '../lib/archetypes'
import type { Response as AssessmentResponse, DimensionScores } from '../lib/types'
dotenv.config({ path: '.env.local' })

const DEMO_RESULT_ID = '00000000-0000-0000-0000-000000000002'
const DEMO_SESSION = 'demo-session-strategic-visionary'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDemo() {
  const { data: assessment } = await supabase
    .from('assessments')
    .upsert({ session_token: DEMO_SESSION, status: 'completed', completed_at: new Date().toISOString() }, { onConflict: 'session_token' })
    .select('id').single()

  if (!assessment) throw new Error('Failed to create demo assessment')

  const mockResponses: AssessmentResponse[] = QUESTIONS.map(q => {
    let value: string | number
    if (q.type === 'forced_choice') {
      value = 'a'
    } else if (q.type === 'situational' || q.type === 'timed' || q.type === 'visual') {
      value = 0  // first choice index, always valid
    } else if (q.type === 'rank_order') {
      value = 1  // top rank
    } else if (q.type === 'allocation') {
      value = 50
    } else {
      // likert / frequency: 1–5 — bias toward strategic_visionary signature dims
      const highDims = ['openness', 'leadership_drive', 'cognitive_agility', 'strategic_orientation', 'systems_thinking']
      value = highDims.includes(q.dimension) ? 5
        : q.dimension === 'conscientiousness' || q.dimension === 'emotional_stability' ? 3 : 4
    }
    return { questionCode: q.code, value, responseTimeMs: 2500, revised: false, dimension: q.dimension }
  })

  const partialScores = computeScores(mockResponses, QUESTIONS)
  const inferenceResponses = mockResponses.map(r => {
    const question = QUESTIONS.find(q => q.code === r.questionCode)!
    return { ...r, value: extractRawValue(question, r.value) }
  })
  const inference = computeInference({ responses: inferenceResponses, constructPairs: CONSTRUCT_PAIRS })
  const { scores, hpif } = computeHpif(partialScores as DimensionScores)
  const { matchScore } = assignArchetype(scores, ARCHETYPES)

  await supabase.from('results').upsert({
    id: DEMO_RESULT_ID,
    assessment_id: assessment.id,
    scores,
    hpif_profile: hpif,
    archetype: 'strategic_visionary',  // force demo to the fully-written archetype
    match_score: matchScore,
    inference_data: {
      avgResponseMs: inference.avgResponseMs,
      revisionRate: inference.revisionRate,
      consistencyScore: inference.consistencyScore,
    },
  }, { onConflict: 'id' })

  console.log(`Demo result seeded: /results/${DEMO_RESULT_ID}`)
  console.log(`Archetype: strategic_visionary, Match: ${matchScore}%`)
}

seedDemo().catch(console.error)
