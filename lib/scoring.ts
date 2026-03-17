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
  byDimension.forEach(({ weighted, maxPossible }, dim) => {
    scores[dim as keyof DimensionScores] = Math.round((weighted / maxPossible) * 100)
  })
  return scores
}
