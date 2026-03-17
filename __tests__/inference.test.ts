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
