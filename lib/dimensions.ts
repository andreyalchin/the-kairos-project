import type { DimensionSlug } from './types'

export interface DimensionMeta {
  slug: DimensionSlug
  label: string
  shortLabel: string   // ≤ 12 chars, used on radar axis labels
  description: string
  tier: 1 | 2 | 3 | 4 | 5 | 6
  major: boolean
}

export const DIMENSIONS: DimensionMeta[] = [
  // Big Five + HEXACO (Major)
  { slug: 'openness', label: 'Openness', shortLabel: 'Openness', tier: 1, major: true, description: 'Receptivity to new ideas, experiences, and perspectives.' },
  { slug: 'conscientiousness', label: 'Conscientiousness', shortLabel: 'Conscient.', tier: 1, major: true, description: 'Capacity for discipline, organization, and follow-through.' },
  { slug: 'extraversion', label: 'Extraversion', shortLabel: 'Extraversion', tier: 1, major: true, description: 'Orientation toward social engagement and external stimulation.' },
  { slug: 'agreeableness', label: 'Agreeableness', shortLabel: 'Agreeable.', tier: 1, major: true, description: 'Tendency toward cooperation, empathy, and interpersonal harmony.' },
  { slug: 'emotional_stability', label: 'Emotional Stability', shortLabel: 'Emot. Stab.', tier: 1, major: true, description: 'Resilience under pressure and consistency of emotional response.' },
  { slug: 'honesty_humility', label: 'Honesty-Humility', shortLabel: 'Honesty', tier: 1, major: true, description: 'Commitment to authenticity, integrity, and freedom from self-promotion.' },
  // New workplace Major dims
  { slug: 'emotional_intelligence', label: 'Emotional Intelligence', shortLabel: 'Emot. Intel.', tier: 4, major: true, description: 'Recognizing, understanding, and regulating emotions in self and others.' },
  { slug: 'decision_making', label: 'Decision Making', shortLabel: 'Decisions', tier: 2, major: true, description: 'Quality of judgment under uncertainty, speed/accuracy balance.' },
  { slug: 'execution', label: 'Execution', shortLabel: 'Execution', tier: 3, major: true, description: 'Translating plans into completed outcomes with reliability.' },
  { slug: 'managing_others', label: 'Managing Others', shortLabel: 'Managing', tier: 5, major: true, description: 'Ability to direct, develop, and get results through people.' },
  // Core cognitive (Major)
  { slug: 'cognitive_agility', label: 'Cognitive Agility', shortLabel: 'Cog. Agility', tier: 2, major: true, description: 'Speed and fluidity of adapting thinking across different problem types.' },
  { slug: 'executive_function', label: 'Executive Function', shortLabel: 'Exec. Fn.', tier: 2, major: true, description: 'Planning, organizing, prioritizing, and regulating goal-directed behavior.' },
  { slug: 'systems_thinking', label: 'Systems Thinking', shortLabel: 'Systems', tier: 2, major: true, description: 'Modeling complex interdependencies and emergent patterns.' },
  // Core motivational (Major)
  { slug: 'achievement_drive', label: 'Achievement Drive', shortLabel: 'Achievement', tier: 3, major: true, description: 'Drive to accomplish difficult goals and exceed your own standards.' },
  { slug: 'purpose_orientation', label: 'Purpose Orientation', shortLabel: 'Purpose', tier: 3, major: true, description: 'Degree to which meaning and mission factor into your motivation.' },
  { slug: 'risk_tolerance', label: 'Risk Tolerance', shortLabel: 'Risk', tier: 3, major: true, description: 'Comfort operating in uncertain environments with real downside.' },
  // Career + behavioral (Major)
  { slug: 'leadership_drive', label: 'Leadership Drive', shortLabel: 'Leadership', tier: 5, major: true, description: 'Orientation toward taking charge, setting direction, and developing others.' },
  { slug: 'strategic_orientation', label: 'Strategic Orientation', shortLabel: 'Strategic', tier: 5, major: true, description: 'Capacity for long-horizon planning and competitive positioning.' },
  { slug: 'social_influence', label: 'Social Influence', shortLabel: 'Influence', tier: 4, major: true, description: 'Ability to persuade, inspire, and move others toward shared goals.' },
  { slug: 'conflict_navigation', label: 'Conflict Navigation', shortLabel: 'Conflict Nav', tier: 4, major: true, description: 'Effectiveness at engaging, managing, and resolving interpersonal tension.' },
  // Supporting cognitive (Minor)
  { slug: 'attention_control', label: 'Attention Control', shortLabel: 'Attention', tier: 2, major: false, description: 'Sustaining focus and managing distraction under cognitive load.' },
  { slug: 'creative_intelligence', label: 'Creative Intelligence', shortLabel: 'Creativity', tier: 2, major: false, description: 'Richness of associative network and capacity for generative thinking.' },
  // Supporting motivational/behavioral (Minor)
  { slug: 'autonomy_need', label: 'Autonomy Need', shortLabel: 'Autonomy', tier: 3, major: false, description: 'Need for self-direction and independence in how you work.' },
  { slug: 'competitive_drive', label: 'Competitive Drive', shortLabel: 'Competitive', tier: 3, major: false, description: 'Need to outperform others and track progress against external benchmarks.' },
  { slug: 'communication_style', label: 'Communication Style', shortLabel: 'Communicat.', tier: 4, major: false, description: 'Approach to expressing ideas and adapting to different audiences.' },
  { slug: 'collaboration_signature', label: 'Collaboration', shortLabel: 'Collaborat.', tier: 4, major: false, description: 'Natural approach to shared work and team dynamics.' },
  // Career supporting (Minor)
  { slug: 'specialist_generalist', label: 'Specialist\u2013Generalist', shortLabel: 'Spec/Gen', tier: 5, major: false, description: 'Orientation toward depth vs. breadth of expertise.' },
  { slug: 'innovation_index', label: 'Innovation Index', shortLabel: 'Innovation', tier: 5, major: false, description: 'Drive and capacity to generate breakthrough ideas and novel solutions.' },
  // Growth/resilience (Minor)
  { slug: 'psychological_resilience', label: 'Psych. Resilience', shortLabel: 'Resilience', tier: 6, major: false, description: 'Capacity to recover, adapt, and grow through adversity.' },
  { slug: 'growth_mindset', label: 'Growth Mindset', shortLabel: 'Growth', tier: 6, major: false, description: 'Belief in the malleability of ability and orientation toward development.' },
  { slug: 'adaptability_quotient', label: 'Adaptability', shortLabel: 'Adaptability', tier: 6, major: false, description: 'Effectiveness at adjusting to changing conditions and new environments.' },
  { slug: 'learning_agility', label: 'Learning Agility', shortLabel: 'Learning', tier: 6, major: false, description: 'Speed and effectiveness of acquiring and applying new knowledge.' },
  // New supporting dims (Minor)
  { slug: 'teamwork', label: 'Teamwork', shortLabel: 'Teamwork', tier: 4, major: false, description: 'Contribution quality and adaptability within collaborative groups.' },
  { slug: 'persuasion', label: 'Persuasion', shortLabel: 'Persuasion', tier: 4, major: false, description: 'Ability to shift beliefs and actions through reasoned influence.' },
  { slug: 'embracing_differences', label: 'Embracing Differences', shortLabel: 'Diversity', tier: 4, major: false, description: 'Openness to diverse perspectives, backgrounds, and working styles.' },
]

export const MAJOR_DIMS = new Set(
  DIMENSIONS.filter(d => d.major).map(d => d.slug)
)
export const MINOR_DIMS = new Set(
  DIMENSIONS.filter(d => !d.major).map(d => d.slug)
)
