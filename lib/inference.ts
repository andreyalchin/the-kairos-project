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
