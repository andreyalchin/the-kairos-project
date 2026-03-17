// lib/types.ts

export type QuestionType =
  | 'likert' | 'forced_choice' | 'situational' | 'frequency'
  | 'rank_order' | 'allocation' | 'visual' | 'timed'

export type DimensionSlug =
  | 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness'
  | 'emotional_stability' | 'honesty_humility'
  | 'cognitive_agility' | 'executive_function' | 'attention_control'
  | 'systems_thinking' | 'creative_intelligence'
  | 'achievement_drive' | 'risk_tolerance' | 'autonomy_need'
  | 'purpose_orientation' | 'competitive_drive'
  | 'social_influence' | 'conflict_navigation' | 'communication_style'
  | 'collaboration_signature'
  | 'leadership_drive' | 'founder_potential' | 'strategic_orientation'
  | 'specialist_generalist' | 'innovation_index'
  | 'psychological_resilience' | 'growth_mindset'
  | 'adaptability_quotient' | 'learning_agility'

export type DimensionScores = Record<DimensionSlug, number>

export interface QuestionOptions {
  // likert / frequency
  labels?: string[]
  // forced_choice
  a?: string; b?: string
  // situational / timed
  scenario?: string; choices?: string[]; scores?: number[]
  // rank_order / allocation
  items?: string[]; target_item_index?: number; total?: number
  // visual
  images?: string[]
}

export interface Question {
  id: string
  code: string
  text: string
  type: QuestionType
  dimension: DimensionSlug
  tier: 1 | 2 | 3 | 4 | 5 | 6
  options: QuestionOptions
  weight: number
  reverse_scored: boolean
  calibration: boolean
  order_index: number
  is_active: boolean
}

export interface Response {
  questionCode: string
  value: number | string | number[]
  responseTimeMs: number
  revised: boolean
  dimension: DimensionSlug
}

export interface InferenceOutput {
  avgResponseMs: number
  revisionRate: number
  consistencyScore: number
  speedModifier: number
  consistencyPenalty: number
}

export interface ArchetypeDimensionWeight {
  dimension: DimensionSlug
  weight: number
  direction: 'high' | 'low'
}

export interface ArchetypeDefinition {
  slug: string
  name: string
  subtitle: string
  signature3Words: string[]
  quote: string
  rarity: string
  description: string
  signature: ArchetypeDimensionWeight[]
  // Full content (3 archetypes only at MVP):
  who_you_are?: string
  how_you_think?: string
  what_drives_you?: string
  how_you_show_up?: string
  shadow_side?: string
  famous_examples?: string[]
  career_verticals_primary?: string[]
  career_verticals_secondary?: string[]
  dream_roles?: string[]
  career_trajectory?: string
  leadership_style?: string
  leadership_strengths?: string[]
  leadership_blind_spots?: string[]
  ideal_work_conditions?: string[]
  reward_ranking?: string[]
  warning_signals?: string[]
  development_areas?: Record<string, string>
  challenge_90_day?: string
  vision_1_year?: string
  // Team compatibility (fetched at render, not stored in DB)
  best_partners: string[]
  growth_partners: string[]
  friction_archetypes: string[]
  team_role: 'Architect' | 'Catalyst' | 'Executor' | 'Harmonizer' | 'Challenger' | 'Navigator'
}

export interface HpifProfile {
  cognitive_operating_system: {
    primary_style: string; description: string
    scores: Partial<DimensionScores>; composite: number
  }
  motivational_architecture: {
    primary_driver: string; secondary_driver: string; description: string
    scores: Partial<DimensionScores>; composite: number
  }
  behavioral_expression: {
    social_style: string; description: string
    scores: Partial<DimensionScores>; composite: number
  }
  growth_vector: {
    trajectory: string; ceiling: string
    scores: Partial<DimensionScores>; composite: number
  }
  career_potential_matrix: {
    leadership_score: number; founder_score: number
    strategic_vs_tactical: number; specialist_vs_generalist: number
    leadership_tier: 'Emerging' | 'Rising' | 'Established' | 'Visionary'
    founder_tier: 'Operator' | 'Builder' | 'Founder' | 'Serial Founder'
  }
  team_compatibility: {
    team_role: string; collaboration_style: string
    remote_orientation: 'Remote-first' | 'Hybrid' | 'In-person'
    team_size_preference: 'Solo' | 'Small (2-8)' | 'Mid (9-30)' | 'Large (30+)'
    best_partners: string[]; growth_partners: string[]; friction_archetypes: string[]
  }
}

export interface AssessmentResult {
  id: string
  assessment_id: string
  scores: DimensionScores
  hpif_profile: HpifProfile
  archetype: string          // winning archetype slug only — secondary archetype is post-MVP
  match_score: number        // 0-100 composite score of winning archetype
  inference_data: InferenceOutput
  created_at: string
}
