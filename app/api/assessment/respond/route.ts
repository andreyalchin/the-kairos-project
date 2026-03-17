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
    const { error: uErr } = await supabase.from('responses').upsert({
      assessment_id: assessment.id,
      question_code: questionCode,
      value: JSON.stringify(value),
      response_time_ms: responseTimeMs ?? null,
      revised: revised ?? false,
    }, { onConflict: 'assessment_id,question_code' })
    if (uErr) throw uErr

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
