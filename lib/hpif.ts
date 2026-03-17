// lib/hpif.ts
import type { DimensionScores, HpifProfile } from './types'

function mean(nums: number[]) { return nums.reduce((s, n) => s + n, 0) / nums.length }

export function computeHpif(rawScores: DimensionScores): {
  scores: DimensionScores; hpif: HpifProfile
} {
  // Compute founder_potential before anything else
  const founder_potential = Math.round(mean([
    rawScores.risk_tolerance,
    rawScores.creative_intelligence,
    rawScores.psychological_resilience,
    rawScores.achievement_drive,
  ]))
  const scores: DimensionScores = { ...rawScores, founder_potential }

  // 1. Cognitive OS
  const cogScores = [scores.cognitive_agility, scores.executive_function, scores.attention_control]
  const cogComposite = Math.round(mean(cogScores))
  const cogStyle = cogComposite >= 70 ? 'Analytical-Convergent' : cogComposite >= 40 ? 'Balanced' : 'Intuitive-Divergent'

  // 2. Motivational Architecture
  const motScores = [scores.achievement_drive, scores.purpose_orientation, scores.autonomy_need, scores.competitive_drive]
  const motComposite = Math.round(mean(motScores))
  const MOTIVATION_LABELS: Record<string, string> = {
    achievement_drive: 'Achievement', purpose_orientation: 'Purpose',
    autonomy_need: 'Autonomy', competitive_drive: 'Competition',
  }
  const motDims = Object.entries({
    achievement_drive: scores.achievement_drive, purpose_orientation: scores.purpose_orientation,
    autonomy_need: scores.autonomy_need, competitive_drive: scores.competitive_drive,
  }).sort(([, a], [, b]) => b - a)
  const primaryDriver = MOTIVATION_LABELS[motDims[0][0]]
  const secondaryDriver = MOTIVATION_LABELS[motDims[1][0]]

  // 3. Behavioral Expression
  const beScores = [scores.extraversion, scores.agreeableness, scores.conflict_navigation, scores.communication_style]
  const beComposite = Math.round(mean(beScores))
  const cs = scores.communication_style
  const socialStyle = cs <= 25 ? 'Analytical' : cs <= 50 ? 'Driver' : cs <= 75 ? 'Amiable' : 'Expressive'

  // 4. Growth Vector
  const gvScores = [scores.growth_mindset, scores.adaptability_quotient, scores.learning_agility, scores.psychological_resilience]
  const gvComposite = Math.round(mean(gvScores))
  const trajectory = gvComposite >= 70 ? 'Accelerating' : gvComposite >= 40 ? 'Steady' : 'Developing'
  const ceiling = gvComposite >= 70 ? 'High' : gvComposite >= 40 ? 'Moderate — with targeted development' : 'Significant growth opportunity'

  // 5. Career Potential Matrix
  const ldScore = scores.leadership_drive
  const ldTier = ldScore >= 80 ? 'Visionary' : ldScore >= 60 ? 'Established' : ldScore >= 40 ? 'Rising' : 'Emerging'
  const fpScore = scores.founder_potential
  const fpTier = fpScore >= 80 ? 'Serial Founder' : fpScore >= 60 ? 'Founder' : fpScore >= 40 ? 'Builder' : 'Operator'

  // 6. Team Compatibility
  const teamRoleScores = {
    Architect: mean([scores.systems_thinking, scores.strategic_orientation]),
    Catalyst: mean([scores.creative_intelligence, scores.innovation_index]),
    Executor: mean([scores.conscientiousness, scores.achievement_drive]),
    Harmonizer: mean([scores.agreeableness, scores.collaboration_signature]),
    Challenger: mean([scores.conflict_navigation, scores.competitive_drive]),
    Navigator: mean([scores.cognitive_agility, scores.leadership_drive]),
  }
  const teamRole = Object.entries(teamRoleScores).sort(([, a], [, b]) => b - a)[0][0] as HpifProfile['team_compatibility']['team_role']

  const an = scores.autonomy_need
  const remoteOrientation: HpifProfile['team_compatibility']['remote_orientation'] = an >= 70 ? 'Remote-first' : an >= 40 ? 'Hybrid' : 'In-person'

  const combined = scores.autonomy_need + scores.collaboration_signature
  const teamSizePref: HpifProfile['team_compatibility']['team_size_preference'] = combined < 80 ? 'Solo' : combined < 120 ? 'Small (2-8)' : combined < 160 ? 'Mid (9-30)' : 'Large (30+)'

  const hpif: HpifProfile = {
    cognitive_operating_system: {
      primary_style: cogStyle,
      description: `You process information through ${cogStyle.toLowerCase()}, prioritizing systematic analysis and pattern recognition.`,
      scores: { cognitive_agility: scores.cognitive_agility, executive_function: scores.executive_function, attention_control: scores.attention_control },
      composite: cogComposite,
    },
    motivational_architecture: {
      primary_driver: primaryDriver, secondary_driver: secondaryDriver,
      description: `Your primary motivational driver is ${primaryDriver}, fueled by ${secondaryDriver}.`,
      scores: { achievement_drive: scores.achievement_drive, purpose_orientation: scores.purpose_orientation, autonomy_need: scores.autonomy_need, competitive_drive: scores.competitive_drive },
      composite: motComposite,
    },
    behavioral_expression: {
      social_style: socialStyle,
      description: `Your communication style is ${socialStyle}, shaping how you build relationships and influence others.`,
      scores: { extraversion: scores.extraversion, agreeableness: scores.agreeableness, conflict_navigation: scores.conflict_navigation, communication_style: scores.communication_style },
      composite: beComposite,
    },
    growth_vector: {
      trajectory, ceiling,
      scores: { growth_mindset: scores.growth_mindset, adaptability_quotient: scores.adaptability_quotient, learning_agility: scores.learning_agility, psychological_resilience: scores.psychological_resilience },
      composite: gvComposite,
    },
    career_potential_matrix: {
      leadership_score: ldScore, founder_score: fpScore,
      strategic_vs_tactical: scores.strategic_orientation,
      specialist_vs_generalist: scores.specialist_generalist,
      leadership_tier: ldTier as HpifProfile['career_potential_matrix']['leadership_tier'],
      founder_tier: fpTier as HpifProfile['career_potential_matrix']['founder_tier'],
    },
    team_compatibility: {
      team_role: teamRole, collaboration_style: `${teamRole}s bring ${teamRole === 'Architect' ? 'structural thinking and long-term vision' : 'their unique strengths'} to the team.`,
      remote_orientation: remoteOrientation,
      team_size_preference: teamSizePref,
      best_partners: [], growth_partners: [], friction_archetypes: [], // filled at render from lib/archetypes.ts
    },
  }

  return { scores, hpif }
}
