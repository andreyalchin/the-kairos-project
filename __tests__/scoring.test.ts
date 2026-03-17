// __tests__/scoring.test.ts
import { extractRawValue, computeScores } from '@/lib/scoring'
import type { Question, Response } from '@/lib/types'

const likertQ: Question = {
  id: '1', code: 'O_01', text: '', type: 'likert', dimension: 'openness',
  tier: 1, options: { labels: [] }, weight: 1.0, reverse_scored: false,
  calibration: true, order_index: 1, is_active: true
}

describe('extractRawValue', () => {
  it('returns numeric value directly for likert', () => {
    expect(extractRawValue({ ...likertQ, type: 'likert' }, 4)).toBe(4)
  })
  it('reverses score for reverse_scored likert', () => {
    expect(extractRawValue({ ...likertQ, reverse_scored: true }, 4)).toBe(2)
  })
  it('maps forced_choice: a=1, b=5', () => {
    const q: Question = { ...likertQ, type: 'forced_choice', options: { a: 'X', b: 'Y' } }
    expect(extractRawValue(q, 'a')).toBe(1)
    expect(extractRawValue(q, 'b')).toBe(5)
  })
  it('maps rank_order: rank1→5, rank2→3.7, rank3→2.3, rank4→1', () => {
    const q: Question = { ...likertQ, type: 'rank_order', options: { items: [], target_item_index: 0 } }
    expect(extractRawValue(q, 1)).toBe(5)
    expect(extractRawValue(q, 2)).toBe(3.7)
    expect(extractRawValue(q, 3)).toBe(2.3)
    expect(extractRawValue(q, 4)).toBe(1)
  })
  it('maps allocation: value/100*5', () => {
    const q: Question = { ...likertQ, type: 'allocation', options: { items: [], total: 100, target_item_index: 0 } }
    expect(extractRawValue(q, 60)).toBeCloseTo(3.0)
  })
  it('maps situational by index into options.scores', () => {
    const q: Question = { ...likertQ, type: 'situational', options: { scenario: '', choices: [], scores: [1, 2.3, 3.7, 5] } }
    expect(extractRawValue(q, 2)).toBe(3.7)
  })
})

describe('computeScores', () => {
  it('computes dimension score as 0-100', () => {
    const responses: Response[] = [
      { questionCode: 'O_01', value: 4, responseTimeMs: 2000, revised: false, dimension: 'openness' },
      { questionCode: 'O_02', value: 5, responseTimeMs: 1500, revised: false, dimension: 'openness' },
    ]
    const questions = [
      { ...likertQ, code: 'O_01' },
      { ...likertQ, code: 'O_02', reverse_scored: true },
    ]
    const scores = computeScores(responses, questions)
    // O_01: raw=4, weight=1 → 4; O_02: reverse 5→1, weight=1 → 1; total=5, max=10 → 50%
    expect(scores.openness).toBe(50)
  })
})
