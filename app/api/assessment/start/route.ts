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
    const supabase = createServiceClient()
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
