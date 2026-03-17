// __tests__/hpif.test.ts
import { computeHpif } from '@/lib/hpif'
import type { DimensionScores } from '@/lib/types'

const mockScores: DimensionScores = {
  openness: 80, conscientiousness: 75, extraversion: 60, agreeableness: 70,
  emotional_stability: 65, honesty_humility: 72, cognitive_agility: 78,
  executive_function: 74, attention_control: 68, systems_thinking: 82,
  creative_intelligence: 76, achievement_drive: 85, risk_tolerance: 70,
  autonomy_need: 65, purpose_orientation: 88, competitive_drive: 72,
  social_influence: 65, conflict_navigation: 60, communication_style: 45,
  collaboration_signature: 58, leadership_drive: 78, founder_potential: 0, // computed
  strategic_orientation: 80, specialist_generalist: 60, innovation_index: 74,
  psychological_resilience: 72, growth_mindset: 85, adaptability_quotient: 70,
  learning_agility: 76,
}

describe('computeHpif', () => {
  it('computes founder_potential as mean of 4 dimensions', () => {
    const result = computeHpif(mockScores)
    const expected = Math.round((70 + 76 + 72 + 85) / 4) // risk+creative+resilience+achievement
    expect(result.scores.founder_potential).toBe(expected)
  })
  it('assigns cognitive_operating_system.primary_style "Analytical-Convergent" for composite >= 70', () => {
    const result = computeHpif(mockScores)
    // cognitive composite = mean(78, 74, 68) = 73.3
    expect(result.hpif.cognitive_operating_system.primary_style).toBe('Analytical-Convergent')
    expect(result.hpif.cognitive_operating_system.composite).toBeGreaterThanOrEqual(70)
  })
  it('assigns leadership_tier "Visionary" for leadership_drive >= 80', () => {
    const highLD = { ...mockScores, leadership_drive: 82 }
    const result = computeHpif(highLD)
    expect(result.hpif.career_potential_matrix.leadership_tier).toBe('Visionary')
  })
  it('assigns founder_tier based on founder_potential score', () => {
    const result = computeHpif(mockScores)
    const fp = result.scores.founder_potential
    if (fp >= 80) expect(result.hpif.career_potential_matrix.founder_tier).toBe('Serial Founder')
    else if (fp >= 60) expect(result.hpif.career_potential_matrix.founder_tier).toBe('Founder')
    else if (fp >= 40) expect(result.hpif.career_potential_matrix.founder_tier).toBe('Builder')
    else expect(result.hpif.career_potential_matrix.founder_tier).toBe('Operator')
  })
  it('derives remote_orientation from autonomy_need', () => {
    const result = computeHpif(mockScores) // autonomy_need=65 → Hybrid
    expect(result.hpif.team_compatibility.remote_orientation).toBe('Hybrid')
  })
})
