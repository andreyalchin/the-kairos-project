import { createServiceClient } from '@/lib/supabase/server'
import { QUESTIONS } from '@/lib/questions'
import { ARCHETYPES } from '@/lib/archetypes'
import { computeScores } from '@/lib/scoring'
import { MAJOR_DIMS } from '@/lib/dimensions'
import type { Response as AssessmentResponse, DimensionScores, DimensionSlug } from '@/lib/types'

const calibrationCount = QUESTIONS.filter(q => q.calibration && q.is_active).length
const HARD_CAP = 132 // 80 calibration + 52 adaptive max

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

      // New confidence gate
      const majorDimSlugs = Array.from(MAJOR_DIMS) as DimensionSlug[]

      const answeredPerDim = majorDimSlugs.reduce((acc, dim) => {
        acc[dim] = responses!.filter(r =>
          QUESTIONS.find(q => q.code === r.question_code)?.dimension === dim
        ).length
        return acc
      }, {} as Record<string, number>)

      const allMajorDimsCovered = majorDimSlugs.every(d => (answeredPerDim[d] ?? 0) >= 3)

      const ambiguousMajorCount = majorDimSlugs.filter(d => {
        const s = scores[d]
        return s !== undefined && s >= 40 && s <= 60
      }).length

      const { topComposite, margin } = interimConfidence(scores)

      const isConfident =
        topComposite >= 81 &&
        margin >= 10 &&
        ambiguousMajorCount <= 2 &&
        allMajorDimsCovered

      if (!isConfident && answeredCount < HARD_CAP) {
        // Ambiguous zone for question selection (40-60 range)
        const ambiguous = Object.entries(scores)
          .filter(([, s]) => s !== undefined && s >= 40 && s <= 60)
          .map(([dim]) => dim)

        // Priority 1: Unanswered ambiguous Major dims (score 40–60, < 5 answered)
        let nextQ = QUESTIONS.filter(q =>
          !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
          MAJOR_DIMS.has(q.dimension as DimensionSlug) &&
          ambiguous.includes(q.dimension) &&
          (answeredPerDim[q.dimension] ?? 0) < 5
        ).sort((a, b) => a.order_index - b.order_index)[0]

        // Priority 2: Major dims with < 3 answered (coverage floor)
        if (!nextQ) nextQ = QUESTIONS.filter(q =>
          !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
          MAJOR_DIMS.has(q.dimension as DimensionSlug) &&
          (answeredPerDim[q.dimension] ?? 0) < 3
        ).sort((a, b) => a.order_index - b.order_index)[0]

        // Priority 3: Ambiguous Minor dims
        if (!nextQ) nextQ = QUESTIONS.filter(q =>
          !q.calibration && !answeredCodes.has(q.code) && q.is_active &&
          ambiguous.includes(q.dimension)
        ).sort((a, b) => a.order_index - b.order_index)[0]

        // Priority 4: Any remaining unanswered question
        if (!nextQ) nextQ = QUESTIONS.filter(q =>
          !q.calibration && !answeredCodes.has(q.code) && q.is_active
        ).sort((a, b) => a.order_index - b.order_index)[0]

        nextQuestion = nextQ ?? null
      }
    }

    const totalQuestions = nextQuestion === null && answeredCount >= calibrationCount
      ? answeredCount
      : Math.max(calibrationCount, answeredCount + (nextQuestion ? 1 : 0))

    return Response.json({
      nextQuestion,
      progress: { answered: answeredCount, total: Math.min(totalQuestions, HARD_CAP) },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
