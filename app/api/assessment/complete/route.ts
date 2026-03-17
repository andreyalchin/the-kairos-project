import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS, CONSTRUCT_PAIRS } from '@/lib/questions'
import { computeScores, extractRawValue } from '@/lib/scoring'
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

    // Check for existing result (idempotency guard)
    const { data: existing } = await supabase
      .from('results')
      .select('id')
      .eq('assessment_id', assessment.id)
      .maybeSingle()
    if (existing) return Response.json({ resultId: existing.id })

    const { data: rawResponses } = await supabase
      .from('responses')
      .select('question_code, value, response_time_ms, revised')
      .eq('assessment_id', assessment.id)

    if (!rawResponses?.length) return Response.json({ error: 'No responses found' }, { status: 400 })

    // Validate all 29 dimensions have at least 1 response
    const answeredDims = new Set<string>()
    rawResponses.forEach(r => {
      const dim = QUESTIONS.find(q => q.code === r.question_code)?.dimension
      if (dim) answeredDims.add(dim)
    })
    const missing = Array.from(REQUIRED_DIMENSIONS).filter(d => d !== 'founder_potential' && !answeredDims.has(d))
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

    // Inference modifiers — normalize all values to numbers via extractRawValue
    const inferenceResponses = responses.map(r => {
      const question = QUESTIONS.find(q => q.code === r.questionCode)!
      return {
        ...r,
        value: extractRawValue(question, r.value),
      }
    })
    const inference = computeInference({ responses: inferenceResponses, constructPairs: CONSTRUCT_PAIRS })

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
