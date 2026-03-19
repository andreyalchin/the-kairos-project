// __tests__/dimensions.test.ts
import { DIMENSIONS, MAJOR_DIMS, MINOR_DIMS } from '@/lib/dimensions'

describe('DIMENSIONS registry', () => {
  it('has exactly 35 active entries (founder_potential excluded)', () => {
    expect(DIMENSIONS).toHaveLength(35)
  })
  it('has exactly 20 major dimensions', () => {
    expect(MAJOR_DIMS.size).toBe(20)
  })
  it('has exactly 15 minor dimensions', () => {
    expect(MINOR_DIMS.size).toBe(15)
  })
  it('every entry has required fields', () => {
    for (const d of DIMENSIONS) {
      expect(d.slug).toBeTruthy()
      expect(d.label).toBeTruthy()
      expect(d.shortLabel.length).toBeLessThanOrEqual(12)
      expect(d.description).toBeTruthy()
      expect([true, false]).toContain(d.major)
    }
  })
  it('no duplicate slugs', () => {
    const slugs = DIMENSIONS.map(d => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
