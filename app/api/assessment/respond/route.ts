import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS } from '@/lib/questions'
import { ARCHETYPES } from '@/lib/archetypes'
import { computeScores } from '@/lib/scoring'
import type { Response as AssessmentResponse, DimensionScores } from '@/lib/types'

const calibrationCount = QUESTIONS.filter(q => q.calibration && q.is_active).length

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

      const { topComposite, margin } = interimConfidence(scores)
      // Confident result: strong top archetype with clear separation — no more questions needed
      const isConfident = topComposite >= 75 && margin >= 8

      if (!isConfident) {
        // Ambiguous zone: score 30–70 (wider than before to keep probing unclear dimensions)
        const ambiguous = Object.entries(scores)
          .filter(([, s]) => s !== undefined && s >= 30 && s <= 70)
          .map(([dim]) => dim)

        // Priority 1: questions for ambiguous dimensions
        let nextQ = QUESTIONS
          .filter(q => !q.calibration && !answeredCodes.has(q.code) && q.is_active && ambiguous.includes(q.dimension))
          .sort((a, b) => a.order_index - b.order_index)[0]

        // Priority 2: any remaining non-calibration question (keep narrowing the profile)
        if (!nextQ) {
          nextQ = QUESTIONS
            .filter(q => !q.calibration && !answeredCodes.has(q.code) && q.is_active)
            .sort((a, b) => a.order_index - b.order_index)[0]
        }

        nextQuestion = nextQ ?? null
      }
    }

    const totalQuestions = nextQuestion === null && answeredCount >= calibrationCount
      ? answeredCount
      : Math.max(calibrationCount, answeredCount + (nextQuestion ? 1 : 0))

    return Response.json({
      nextQuestion,
      progress: { answered: answeredCount, total: totalQuestions },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
