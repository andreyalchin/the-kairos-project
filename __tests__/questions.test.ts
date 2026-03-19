// __tests__/questions.test.ts
import { QUESTIONS } from '@/lib/questions'

describe('QUESTIONS bank', () => {
  it('has calibration count of exactly 80', () => {
    const count = QUESTIONS.filter(q => q.calibration && q.is_active).length
    expect(count).toBe(80)
  })
  it('every active question has a unique code', () => {
    const codes = QUESTIONS.filter(q => q.is_active).map(q => q.code)
    expect(new Set(codes).size).toBe(codes.length)
  })
  it('all 7 new dimensions have at least 5 questions each', () => {
    const newDims = ['emotional_intelligence', 'decision_making', 'execution',
      'managing_others', 'teamwork', 'persuasion', 'embracing_differences']
    for (const dim of newDims) {
      const count = QUESTIONS.filter(q => q.dimension === dim && q.is_active).length
      expect(count).toBeGreaterThanOrEqual(5)
    }
  })
  it('all 4 new Major dimensions have at least 8 questions each', () => {
    const newMajors = ['emotional_intelligence', 'decision_making', 'execution', 'managing_others']
    for (const dim of newMajors) {
      const count = QUESTIONS.filter(q => q.dimension === dim && q.is_active).length
      expect(count).toBeGreaterThanOrEqual(8)
    }
  })
})
