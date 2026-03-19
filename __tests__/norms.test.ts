// __tests__/norms.test.ts
import { getPercentile } from '@/lib/norms'

describe('getPercentile', () => {
  it('returns 50 for median openness score of 55', () => {
    expect(getPercentile('openness', 55)).toBe(50)
  })
  it('returns 1 for score of 0', () => {
    expect(getPercentile('openness', 0)).toBe(1)
  })
  it('returns 99 for score of 100', () => {
    expect(getPercentile('openness', 100)).toBe(99)
  })
  it('interpolates linearly between breakpoints', () => {
    // Between score 45 (p25) and 55 (p50): score 50 → p37.5
    expect(getPercentile('openness', 50)).toBeCloseTo(37.5, 0)
  })
  it('throws for unknown dimension', () => {
    expect(() => getPercentile('nonexistent', 50)).toThrow()
  })
  it('returns ~50th percentile for score of 50 on new dimensions', () => {
    const newDims = [
      'emotional_intelligence', 'decision_making', 'execution',
      'managing_others', 'teamwork', 'persuasion', 'embracing_differences',
    ]
    for (const dim of newDims) {
      expect(getPercentile(dim, 50)).toBeCloseTo(50, 0)
    }
  })
  it('does not throw for any new dimension slug', () => {
    const newDims = [
      'emotional_intelligence', 'decision_making', 'execution',
      'managing_others', 'teamwork', 'persuasion', 'embracing_differences',
    ]
    for (const dim of newDims) {
      expect(() => getPercentile(dim, 50)).not.toThrow()
    }
  })
})
