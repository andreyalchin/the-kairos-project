// lib/archetypes.ts
import type { ArchetypeDefinition, DimensionScores } from './types'

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    slug: 'strategic_visionary',
    name: 'Strategic Visionary',
    subtitle: 'The architect of possible futures',
    signature3Words: ['Visionary', 'Decisive', 'Systemic'],
    quote: 'The best way to predict the future is to create it.',
    rarity: 'Found in 4.2% of assessments',
    description: 'Strategic Visionaries see the world as a system of patterns to decode and futures to design. They combine high openness with strategic orientation and cognitive agility to identify non-obvious opportunities others miss.',
    signature: [
      { dimension: 'openness', weight: 1.5, direction: 'high' },
      { dimension: 'leadership_drive', weight: 1.5, direction: 'high' },
      { dimension: 'cognitive_agility', weight: 1.3, direction: 'high' },
      { dimension: 'strategic_orientation', weight: 1.4, direction: 'high' },
      { dimension: 'systems_thinking', weight: 1.2, direction: 'high' },
    ],
    who_you_are: 'You are a rare combination of visionary thinking and decisive leadership. You see systems where others see noise, patterns where others see chaos. Your mind naturally operates at a strategic altitude — you\'re less interested in how things work today and more interested in how they could work tomorrow.',
    how_you_think: 'Your cognitive signature is integrative synthesis. You pull information from disparate fields and find the unifying principle. You think in second-order effects, always asking "and then what?" Your working memory holds complex models, and you shift between abstraction and execution fluidly.',
    what_drives_you: 'You are driven by the opportunity to build something that outlasts you. Legacy matters. You seek roles where your ideas have real-world impact at scale. Tactical execution energizes you only when it serves a larger vision.',
    how_you_show_up: 'In meetings, you often raise the altitude of the conversation — asking "why are we solving this problem" before diving into solutions. You\'re decisive when you\'ve built your mental model. You inspire through clarity of vision rather than emotional appeals.',
    shadow_side: 'Your greatest liability is impatience with execution details. You may generate more ideas than your team can implement. At low emotional stability, you risk becoming disconnected from operational reality and frustrating collaborators who need clear direction.',
    famous_examples: ['Elon Musk', 'Jeff Bezos', 'Reed Hastings', 'Steve Jobs', 'Jensen Huang'],
    career_verticals_primary: ['Technology & AI', 'Venture Capital', 'Strategic Consulting'],
    career_verticals_secondary: ['Policy & Government', 'Media & Publishing', 'Education Reform', 'Healthcare Innovation'],
    dream_roles: ['Chief Strategy Officer', 'Founder/CEO', 'General Partner (VC)'],
    career_trajectory: 'Strategic Visionaries often start in high-cognitive-demand roles (engineering, research, strategy consulting), move into general management, and peak as founders, C-suite executives, or institutional investors.',
    leadership_style: 'Visionary-Directive',
    leadership_strengths: ['Sets compelling long-term direction', 'Builds high-trust executive teams', 'Navigates ambiguity decisively'],
    leadership_blind_spots: ['May overlook implementation complexity', 'Can undervalue "slow" execution work'],
    ideal_work_conditions: ['High autonomy', 'Strategic mandate', 'Access to decision-makers'],
    reward_ranking: ['Impact at scale', 'Intellectual challenge', 'Autonomy'],
    warning_signals: ['Micro-management', 'Short-term-only thinking', 'Politics over merit'],
    development_areas: {
      conscientiousness: 'Your execution orientation needs deliberate development. Set weekly tactical reviews to translate your strategic clarity into milestones.',
      agreeableness: 'Practice stakeholder listening before presenting conclusions. Your ideas land better when others feel heard first.',
    },
    challenge_90_day: 'Identify one long-horizon problem in your current context and build a 3-year view with 90-day milestones. Share it with three people who will give you honest feedback.',
    vision_1_year: 'By this time next year, you will have led at least one initiative from concept to measurable impact, and built a system others can operate without you.',
    best_partners: ['empathetic_leader', 'systematic_builder', 'resilient_executor'],
    growth_partners: ['methodical_perfectionist', 'collaborative_harmonizer'],
    friction_archetypes: ['methodical_perfectionist', 'quiet_authority'],
    team_role: 'Architect',
  },
  {
    slug: 'empathetic_leader',
    name: 'Empathetic Leader',
    subtitle: 'The human force multiplier',
    signature3Words: ['Empathetic', 'Inspiring', 'Grounded'],
    quote: 'Leadership is not about being in charge. It\'s about taking care of those in your charge.',
    rarity: 'Found in 5.8% of assessments',
    description: 'Empathetic Leaders build trust at scale. They combine high agreeableness with leadership drive and emotional stability to create environments where people do their best work.',
    signature: [
      { dimension: 'agreeableness', weight: 1.5, direction: 'high' },
      { dimension: 'leadership_drive', weight: 1.4, direction: 'high' },
      { dimension: 'emotional_stability', weight: 1.3, direction: 'high' },
      { dimension: 'social_influence', weight: 1.2, direction: 'high' },
      { dimension: 'purpose_orientation', weight: 1.2, direction: 'high' },
    ],
    who_you_are: 'You lead from genuine care. Where others see headcount, you see people with aspirations, fears, and potential. Your teams consistently rate you as one of the best leaders they\'ve worked with — because you actually invest in them as humans.',
    how_you_think: 'Your thinking is integrative and people-centered. You naturally model how decisions will affect individuals and teams before you make them. You are strong at reading rooms, sensing tension, and finding the path that honors both results and relationships.',
    what_drives_you: 'You are driven by impact through people. Watching someone you\'ve mentored succeed is more rewarding than personal acclaim. Purpose and meaning are non-negotiables — you need to believe in what you\'re building.',
    how_you_show_up: 'You show up as a present, attentive listener. In conflict, you seek understanding before judgment. You celebrate others\' wins loudly and take responsibility for failures quietly. You build loyalty through consistency and genuine care.',
    shadow_side: 'Your empathy can become a liability under pressure. You may delay difficult decisions to preserve relationships. You can be manipulated by those who exploit your care. High-conflict environments drain you disproportionately.',
    famous_examples: ['Satya Nadella', 'Jacinda Ardern', 'Howard Schultz', 'Brené Brown', 'Pat Gelsinger'],
    career_verticals_primary: ['People Operations & HR', 'Education & Coaching', 'Healthcare Leadership'],
    career_verticals_secondary: ['Non-profit Leadership', 'Community Organizations', 'Customer Success', 'Team-based Product Management'],
    dream_roles: ['Chief People Officer', 'CEO (people-intensive industries)', 'Executive Coach'],
    career_trajectory: 'Empathetic Leaders often move through roles with high human contact — teaching, consulting, team leadership — into executive roles where their ability to build culture and retain talent becomes a competitive advantage.',
    leadership_style: 'Servant-Transformational',
    leadership_strengths: ['Builds high-trust team culture', 'Retains top talent', 'Navigates org change with minimal disruption'],
    leadership_blind_spots: ['May delay hard performance conversations', 'Can sacrifice clarity for kindness'],
    ideal_work_conditions: ['Mission-driven culture', 'Team stability', 'Psychological safety'],
    reward_ranking: ['Team success', 'Purpose alignment', 'Recognition for impact'],
    warning_signals: ['Pure profit-over-people culture', 'High turnover norms', 'Backstabbing politics'],
    development_areas: {
      conflict_navigation: 'Practice delivering difficult feedback directly. Start with low-stakes conversations and build your tolerance for constructive tension.',
      strategic_orientation: 'Invest time weekly in long-horizon thinking. Your people focus can crowd out strategic planning.',
    },
    challenge_90_day: 'Have the three most difficult conversations you\'ve been avoiding. Document what you learned about yourself and the other person after each one.',
    vision_1_year: 'Build a team or organization where at least three people will later describe you as the leader who changed their career trajectory.',
    best_partners: ['strategic_visionary', 'systematic_builder', 'analytical_architect'],
    growth_partners: ['courageous_disruptor', 'competitive_achiever'],
    friction_archetypes: ['bold_risk_taker', 'competitive_achiever'],
    team_role: 'Harmonizer',
  },
  {
    slug: 'systematic_builder',
    name: 'Systematic Builder',
    subtitle: 'The architect of reliable systems',
    signature3Words: ['Methodical', 'Principled', 'Reliable'],
    quote: 'Excellence is not a destination but a continuous journey that never ends.',
    rarity: 'Found in 6.1% of assessments',
    description: 'Systematic Builders create the infrastructure that lets organizations scale. They combine high conscientiousness with integrity and leadership drive to build systems, processes, and teams that work reliably under pressure.',
    signature: [
      { dimension: 'conscientiousness', weight: 1.5, direction: 'high' },
      { dimension: 'honesty_humility', weight: 1.3, direction: 'high' },
      { dimension: 'leadership_drive', weight: 1.2, direction: 'high' },
      { dimension: 'executive_function', weight: 1.3, direction: 'high' },
      { dimension: 'systems_thinking', weight: 1.2, direction: 'high' },
    ],
    who_you_are: 'You are the reason things actually get done. Where others cast visions, you build the systems that turn vision into reality. Your teams trust you because you always follow through. When you say something will happen, it happens.',
    how_you_think: 'You think in processes and systems. You naturally decompose complex goals into trackable milestones. You have high working memory for operational details and can hold multiple projects in parallel without losing threads.',
    what_drives_you: 'You are driven by building things that last. Sustainable excellence matters more to you than fast wins. You take pride in the craftsmanship of your work — the invisible excellence that others take for granted until it\'s missing.',
    how_you_show_up: 'Reliable, prepared, direct. You show up with data and clear recommendations. You follow through on every commitment. You hold others to the same standard — kindly, but clearly.',
    shadow_side: 'Your systems orientation can make you resistant to necessary disruption. You may prioritize process adherence over adaptive response. Under pressure, you can become rigid when flexibility is needed.',
    famous_examples: ['Tim Cook', 'Sheryl Sandberg', 'Jamie Dimon', 'Mary Barra', 'Jensen Huang (execution side)'],
    career_verticals_primary: ['Operations & Supply Chain', 'Engineering Management', 'Finance & Accounting'],
    career_verticals_secondary: ['Product Management', 'Healthcare Administration', 'Government', 'Manufacturing'],
    dream_roles: ['COO', 'VP Engineering', 'Chief of Staff', 'Program Director'],
    career_trajectory: 'Systematic Builders excel in execution-heavy roles early, move into operations leadership, and reach COO or equivalent roles where they operationalize the vision of more strategic partners.',
    leadership_style: 'Operational-Principled',
    leadership_strengths: ['Builds reliable execution systems', 'Develops high-trust accountability culture', 'Manages complexity without drama'],
    leadership_blind_spots: ['Can resist necessary pivots', 'May prioritize completeness over speed'],
    ideal_work_conditions: ['Clear objectives', 'Stable organizational context', 'Room to build proper systems'],
    reward_ranking: ['Mastery', 'Integrity alignment', 'Reliable outcomes'],
    warning_signals: ['Constant chaos without structure', 'Ethical grey zones', 'Promises broken regularly'],
    development_areas: {
      openness: 'Challenge yourself monthly with something entirely outside your process comfort zone — a creative project, an ambiguous problem with no playbook.',
      risk_tolerance: 'Practice making decisions with 70% of your ideal information. Perfect data is often a delay tactic.',
    },
    challenge_90_day: 'Identify one system or process you\'ve been managing manually and build a scalable version. Document what broke along the way.',
    vision_1_year: 'Create a playbook or system that enables one person you\'ve developed to deliver at the level you currently operate.',
    best_partners: ['strategic_visionary', 'creative_catalyst', 'innovation_pioneer'],
    growth_partners: ['adaptive_generalist', 'courageous_disruptor'],
    friction_archetypes: ['bold_risk_taker', 'courageous_disruptor'],
    team_role: 'Executor',
  },
  // === STUBS: archetypes 4–32 ===
  ...([
    { slug: 'creative_catalyst', name: 'Creative Catalyst', subtitle: 'The spark that ignites possibility', sig: [{ d: 'openness', w: 1.5 }, { d: 'extraversion', w: 1.3 }, { d: 'creative_intelligence', w: 1.5 }], role: 'Catalyst' as const, partners: ['strategic_visionary', 'analytical_architect', 'systematic_builder'] },
    { slug: 'analytical_architect', name: 'Analytical Architect', subtitle: 'The builder of rigorous frameworks', sig: [{ d: 'cognitive_agility', w: 1.5 }, { d: 'conscientiousness', w: 1.3 }, { d: 'systems_thinking', w: 1.5 }], role: 'Architect' as const, partners: ['empathetic_leader', 'strategic_visionary', 'resilient_executor'] },
    { slug: 'resilient_executor', name: 'Resilient Executor', subtitle: 'The force that gets it done', sig: [{ d: 'emotional_stability', w: 1.5 }, { d: 'conscientiousness', w: 1.3 }, { d: 'leadership_drive', w: 1.2 }], role: 'Executor' as const, partners: ['strategic_visionary', 'creative_catalyst', 'innovation_pioneer'] },
    { slug: 'innovation_pioneer', name: 'Innovation Pioneer', subtitle: 'The first across every frontier', sig: [{ d: 'innovation_index', w: 1.5 }, { d: 'openness', w: 1.4 }, { d: 'risk_tolerance', w: 1.3 }], role: 'Catalyst' as const, partners: ['systematic_builder', 'analytical_architect', 'strategic_visionary'] },
    { slug: 'collaborative_harmonizer', name: 'Collaborative Harmonizer', subtitle: 'The glue that holds teams together', sig: [{ d: 'agreeableness', w: 1.5 }, { d: 'collaboration_signature', w: 1.4 }, { d: 'extraversion', w: 1.2 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'resilient_executor', 'analytical_architect'] },
    { slug: 'independent_specialist', name: 'Independent Specialist', subtitle: 'The deepest well of expertise', sig: [{ d: 'autonomy_need', w: 1.5 }, { d: 'cognitive_agility', w: 1.3 }, { d: 'conscientiousness', w: 1.3 }], role: 'Executor' as const, partners: ['collaborative_harmonizer', 'empathetic_leader', 'strategic_visionary'] },
    { slug: 'adaptive_generalist', name: 'Adaptive Generalist', subtitle: 'The master of every context', sig: [{ d: 'adaptability_quotient', w: 1.5 }, { d: 'learning_agility', w: 1.4 }, { d: 'openness', w: 1.3 }], role: 'Navigator' as const, partners: ['independent_specialist', 'methodical_perfectionist', 'systematic_builder'] },
    { slug: 'servant_leader', name: 'Servant Leader', subtitle: 'The leader who leads by serving', sig: [{ d: 'purpose_orientation', w: 1.5 }, { d: 'agreeableness', w: 1.4 }, { d: 'leadership_drive', w: 1.2 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'resilient_executor', 'systematic_builder'] },
    { slug: 'competitive_achiever', name: 'Competitive Achiever', subtitle: 'The relentless pursuit of winning', sig: [{ d: 'competitive_drive', w: 1.5 }, { d: 'achievement_drive', w: 1.4 }, { d: 'leadership_drive', w: 1.2 }], role: 'Challenger' as const, partners: ['strategic_visionary', 'systematic_builder', 'analytical_architect'] },
    { slug: 'diplomatic_bridge_builder', name: 'Diplomatic Bridge-Builder', subtitle: 'The architect of consensus', sig: [{ d: 'agreeableness', w: 1.4 }, { d: 'conflict_navigation', w: 1.5 }, { d: 'social_influence', w: 1.3 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'resilient_executor', 'innovation_pioneer'] },
    { slug: 'courageous_disruptor', name: 'Courageous Disruptor', subtitle: 'The one who breaks the mold', sig: [{ d: 'risk_tolerance', w: 1.5 }, { d: 'innovation_index', w: 1.4 }, { d: 'extraversion', w: 1.2 }], role: 'Challenger' as const, partners: ['systematic_builder', 'analytical_architect', 'resilient_executor'] },
    { slug: 'methodical_perfectionist', name: 'Methodical Perfectionist', subtitle: 'The guardian of quality', sig: [{ d: 'conscientiousness', w: 1.5 }, { d: 'executive_function', w: 1.4 }, { d: 'attention_control', w: 1.3 }], role: 'Executor' as const, partners: ['creative_catalyst', 'innovation_pioneer', 'adaptive_generalist'] },
    { slug: 'inspirational_motivator', name: 'Inspirational Motivator', subtitle: 'The energy that elevates rooms', sig: [{ d: 'extraversion', w: 1.5 }, { d: 'social_influence', w: 1.4 }, { d: 'purpose_orientation', w: 1.3 }], role: 'Catalyst' as const, partners: ['systematic_builder', 'analytical_architect', 'methodical_perfectionist'] },
    { slug: 'pragmatic_problem_solver', name: 'Pragmatic Problem-Solver', subtitle: 'The one who just makes it work', sig: [{ d: 'cognitive_agility', w: 1.4 }, { d: 'strategic_orientation', w: 1.3 }, { d: 'emotional_stability', w: 1.3 }], role: 'Navigator' as const, partners: ['strategic_visionary', 'creative_catalyst', 'inspirational_motivator'] },
    { slug: 'visionary_entrepreneur', name: 'Visionary Entrepreneur', subtitle: 'The builder of new worlds', sig: [{ d: 'founder_potential', w: 1.5 }, { d: 'openness', w: 1.3 }, { d: 'risk_tolerance', w: 1.4 }], role: 'Catalyst' as const, partners: ['systematic_builder', 'resilient_executor', 'analytical_architect'] },
    { slug: 'data_driven_strategist', name: 'Data-Driven Strategist', subtitle: 'The mind that turns data into direction', sig: [{ d: 'cognitive_agility', w: 1.4 }, { d: 'strategic_orientation', w: 1.4 }, { d: 'conscientiousness', w: 1.2 }], role: 'Architect' as const, partners: ['inspirational_motivator', 'empathetic_leader', 'collaborative_harmonizer'] },
    { slug: 'empowering_coach', name: 'Empowering Coach', subtitle: 'The multiplier of human potential', sig: [{ d: 'agreeableness', w: 1.4 }, { d: 'growth_mindset', w: 1.5 }, { d: 'leadership_drive', w: 1.2 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'competitive_achiever', 'courageous_disruptor'] },
    { slug: 'bold_risk_taker', name: 'Bold Risk-Taker', subtitle: 'The one who bets on the future', sig: [{ d: 'risk_tolerance', w: 1.5 }, { d: 'competitive_drive', w: 1.3 }, { d: 'extraversion', w: 1.2 }], role: 'Challenger' as const, partners: ['systematic_builder', 'methodical_perfectionist', 'analytical_architect'] },
    { slug: 'thoughtful_synthesizer', name: 'Thoughtful Synthesizer', subtitle: 'The connector of disparate ideas', sig: [{ d: 'systems_thinking', w: 1.5 }, { d: 'openness', w: 1.3 }, { d: 'honesty_humility', w: 1.2 }], role: 'Architect' as const, partners: ['inspirational_motivator', 'creative_catalyst', 'bold_risk_taker'] },
    { slug: 'dynamic_connector', name: 'Dynamic Connector', subtitle: 'The hub of every network', sig: [{ d: 'extraversion', w: 1.5 }, { d: 'social_influence', w: 1.4 }, { d: 'agreeableness', w: 1.2 }], role: 'Catalyst' as const, partners: ['independent_specialist', 'methodical_perfectionist', 'systematic_builder'] },
    { slug: 'quiet_authority', name: 'Quiet Authority', subtitle: 'The leader who leads without noise', sig: [{ d: 'leadership_drive', w: 1.4 }, { d: 'honesty_humility', w: 1.3 }, { d: 'conscientiousness', w: 1.3 }], role: 'Navigator' as const, partners: ['creative_catalyst', 'dynamic_connector', 'inspirational_motivator'] },
    { slug: 'systematic_innovator', name: 'Systematic Innovator', subtitle: 'The engineer of breakthrough', sig: [{ d: 'conscientiousness', w: 1.3 }, { d: 'innovation_index', w: 1.5 }, { d: 'cognitive_agility', w: 1.3 }], role: 'Architect' as const, partners: ['empathetic_leader', 'collaborative_harmonizer', 'servant_leader'] },
    { slug: 'compassionate_challenger', name: 'Compassionate Challenger', subtitle: 'The critic who cares deeply', sig: [{ d: 'agreeableness', w: 1.3 }, { d: 'conflict_navigation', w: 1.4 }, { d: 'openness', w: 1.3 }], role: 'Challenger' as const, partners: ['strategic_visionary', 'analytical_architect', 'data_driven_strategist'] },
    { slug: 'strategic_operator', name: 'Strategic Operator', subtitle: 'The executor of bold vision', sig: [{ d: 'strategic_orientation', w: 1.4 }, { d: 'conscientiousness', w: 1.3 }, { d: 'executive_function', w: 1.4 }], role: 'Executor' as const, partners: ['creative_catalyst', 'innovation_pioneer', 'bold_risk_taker'] },
    { slug: 'creative_technologist', name: 'Creative Technologist', subtitle: 'The artist who builds', sig: [{ d: 'creative_intelligence', w: 1.5 }, { d: 'cognitive_agility', w: 1.3 }, { d: 'innovation_index', w: 1.4 }], role: 'Catalyst' as const, partners: ['servant_leader', 'empowering_coach', 'collaborative_harmonizer'] },
    { slug: 'cultural_architect', name: 'Cultural Architect', subtitle: 'The designer of belonging', sig: [{ d: 'agreeableness', w: 1.4 }, { d: 'social_influence', w: 1.4 }, { d: 'honesty_humility', w: 1.3 }], role: 'Harmonizer' as const, partners: ['strategic_visionary', 'innovation_pioneer', 'courageous_disruptor'] },
    { slug: 'resilient_pioneer', name: 'Resilient Pioneer', subtitle: 'The one who keeps going', sig: [{ d: 'psychological_resilience', w: 1.5 }, { d: 'risk_tolerance', w: 1.3 }, { d: 'leadership_drive', w: 1.3 }], role: 'Challenger' as const, partners: ['methodical_perfectionist', 'systematic_builder', 'quiet_authority'] },
    { slug: 'intellectual_explorer', name: 'Intellectual Explorer', subtitle: 'The eternal student of everything', sig: [{ d: 'openness', w: 1.4 }, { d: 'learning_agility', w: 1.5 }, { d: 'systems_thinking', w: 1.3 }], role: 'Navigator' as const, partners: ['competitive_achiever', 'bold_risk_taker', 'resilient_pioneer'] },
    { slug: 'transformational_catalyst', name: 'Transformational Catalyst', subtitle: 'The agent of deep change', sig: [{ d: 'leadership_drive', w: 1.4 }, { d: 'growth_mindset', w: 1.5 }, { d: 'innovation_index', w: 1.3 }], role: 'Catalyst' as const, partners: ['strategic_operator', 'data_driven_strategist', 'quiet_authority'] },
  ] as const).map(stub => ({
    slug: stub.slug,
    name: stub.name,
    subtitle: stub.subtitle,
    signature3Words: [stub.name.split(' ')[0], 'Driven', 'Focused'],
    quote: 'Know your moment.',
    rarity: 'Coming soon',
    description: `${stub.name}s are currently in early access. Full profile content — including deep psychological analysis, career intelligence, and growth roadmap — will be available in the next release.`,
    signature: stub.sig.map(s => ({ dimension: s.d as import('./types').DimensionSlug, weight: s.w, direction: 'high' as const })),
    career_verticals_primary: ['Coming Soon'],
    career_verticals_secondary: [],
    dream_roles: ['Coming Soon'],
    best_partners: [...stub.partners],
    growth_partners: [],
    friction_archetypes: [],
    team_role: stub.role,
  })),
]

export function assignArchetype(scores: DimensionScores, archetypes: ArchetypeDefinition[] = ARCHETYPES) {
  const composites = archetypes.map(archetype => {
    const totalWeight = archetype.signature.reduce((s, d) => s + d.weight, 0)
    const weightedScore = archetype.signature.reduce((s, d) => {
      const score = d.direction === 'high' ? scores[d.dimension] : 100 - scores[d.dimension]
      return s + score * d.weight
    }, 0)
    return { slug: archetype.slug, composite: weightedScore / totalWeight }
  })

  composites.sort((a, b) => b.composite - a.composite)
  const winner = composites[0]
  const runnerUp = composites[1]

  const resolvedSlug = (winner.composite - runnerUp.composite < 2)
    ? resolveByPrimaryDimension(winner.slug, runnerUp.slug, scores, archetypes)
    : winner.slug

  return { archetype: resolvedSlug, matchScore: Math.round(winner.composite) }
}

function resolveByPrimaryDimension(
  slugA: string, slugB: string, scores: DimensionScores, archetypes: ArchetypeDefinition[]
): string {
  const getPrimaryScore = (slug: string) => {
    const def = archetypes.find(a => a.slug === slug)!
    const primary = def.signature.find(d => d.direction === 'high')
    return primary ? scores[primary.dimension] : 0
  }
  return getPrimaryScore(slugA) >= getPrimaryScore(slugB) ? slugA : slugB
}
