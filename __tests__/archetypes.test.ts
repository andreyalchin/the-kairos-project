// __tests__/archetypes.test.ts
import { assignArchetype, ARCHETYPES } from '@/lib/archetypes'
import type { DimensionScores } from '@/lib/types'

const highOpenessLeader: DimensionScores = {
  openness: 90, conscientiousness: 55, extraversion: 65, agreeableness: 60,
  emotional_stability: 70, honesty_humility: 68, cognitive_agility: 85,
  executive_function: 70, attention_control: 65, systems_thinking: 75,
  creative_intelligence: 72, achievement_drive: 80, risk_tolerance: 75,
  autonomy_need: 70, purpose_orientation: 78, competitive_drive: 68,
  social_influence: 72, conflict_navigation: 65, communication_style: 50,
  collaboration_signature: 58, leadership_drive: 88, founder_potential: 75,
  strategic_orientation: 82, specialist_generalist: 65, innovation_index: 78,
  psychological_resilience: 72, growth_mindset: 80, adaptability_quotient: 74,
  learning_agility: 76,
}

describe('assignArchetype', () => {
  it('returns a slug that exists in ARCHETYPES', () => {
    const result = assignArchetype(highOpenessLeader, ARCHETYPES)
    expect(ARCHETYPES.find(a => a.slug === result.archetype)).toBeDefined()
  })
  it('returns matchScore between 0 and 100', () => {
    const result = assignArchetype(highOpenessLeader, ARCHETYPES)
    expect(result.matchScore).toBeGreaterThanOrEqual(0)
    expect(result.matchScore).toBeLessThanOrEqual(100)
  })
  it('assigns strategic_visionary for high openness + leadership + cognitive_agility', () => {
    const result = assignArchetype(highOpenessLeader, ARCHETYPES)
    expect(result.archetype).toBe('strategic_visionary')
  })
  it('ARCHETYPES has exactly 32 entries', () => {
    expect(ARCHETYPES).toHaveLength(32)
  })
})
