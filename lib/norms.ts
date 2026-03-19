// lib/norms.ts
type NormTable = Record<string, Array<{ score: number; percentile: number }>>

// Breakpoints from published Big Five / HEXACO normative literature (general adult population)
const NORMS: NormTable = {
  openness:             [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 45, percentile: 25 },{ score: 55, percentile: 50 },{ score: 65, percentile: 75 },{ score: 75, percentile: 90 },{ score: 100, percentile: 99 }],
  conscientiousness:    [{ score: 0, percentile: 1 },{ score: 35, percentile: 10 },{ score: 50, percentile: 25 },{ score: 60, percentile: 50 },{ score: 72, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  extraversion:         [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 55, percentile: 50 },{ score: 68, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  agreeableness:        [{ score: 0, percentile: 1 },{ score: 38, percentile: 10 },{ score: 52, percentile: 25 },{ score: 63, percentile: 50 },{ score: 74, percentile: 75 },{ score: 84, percentile: 90 },{ score: 100, percentile: 99 }],
  emotional_stability:  [{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 40, percentile: 25 },{ score: 55, percentile: 50 },{ score: 68, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  honesty_humility:     [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 48, percentile: 25 },{ score: 60, percentile: 50 },{ score: 72, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  cognitive_agility:    [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 55, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  executive_function:   [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 44, percentile: 25 },{ score: 57, percentile: 50 },{ score: 69, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  attention_control:    [{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 40, percentile: 25 },{ score: 53, percentile: 50 },{ score: 66, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  systems_thinking:     [{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 53, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  creative_intelligence:[{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 38, percentile: 25 },{ score: 51, percentile: 50 },{ score: 64, percentile: 75 },{ score: 76, percentile: 90 },{ score: 100, percentile: 99 }],
  achievement_drive:    [{ score: 0, percentile: 1 },{ score: 32, percentile: 10 },{ score: 47, percentile: 25 },{ score: 60, percentile: 50 },{ score: 73, percentile: 75 },{ score: 83, percentile: 90 },{ score: 100, percentile: 99 }],
  risk_tolerance:       [{ score: 0, percentile: 1 },{ score: 22, percentile: 10 },{ score: 36, percentile: 25 },{ score: 50, percentile: 50 },{ score: 64, percentile: 75 },{ score: 76, percentile: 90 },{ score: 100, percentile: 99 }],
  autonomy_need:        [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 56, percentile: 50 },{ score: 69, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  purpose_orientation:  [{ score: 0, percentile: 1 },{ score: 30, percentile: 10 },{ score: 46, percentile: 25 },{ score: 59, percentile: 50 },{ score: 72, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  competitive_drive:    [{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  social_influence:     [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 42, percentile: 25 },{ score: 55, percentile: 50 },{ score: 68, percentile: 75 },{ score: 79, percentile: 90 },{ score: 100, percentile: 99 }],
  conflict_navigation:  [{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 53, percentile: 50 },{ score: 66, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  communication_style:  [{ score: 0, percentile: 1 },{ score: 18, percentile: 10 },{ score: 30, percentile: 25 },{ score: 50, percentile: 50 },{ score: 70, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  collaboration_signature:[{ score: 0, percentile: 1 },{ score: 25, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  leadership_drive:     [{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  founder_potential:    [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 33, percentile: 25 },{ score: 48, percentile: 50 },{ score: 62, percentile: 75 },{ score: 75, percentile: 90 },{ score: 100, percentile: 99 }],
  strategic_orientation:[{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  specialist_generalist:[{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  innovation_index:     [{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 77, percentile: 90 },{ score: 100, percentile: 99 }],
  psychological_resilience:[{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  growth_mindset:       [{ score: 0, percentile: 1 },{ score: 28, percentile: 10 },{ score: 44, percentile: 25 },{ score: 58, percentile: 50 },{ score: 71, percentile: 75 },{ score: 82, percentile: 90 },{ score: 100, percentile: 99 }],
  adaptability_quotient:[{ score: 0, percentile: 1 },{ score: 24, percentile: 10 },{ score: 38, percentile: 25 },{ score: 52, percentile: 50 },{ score: 65, percentile: 75 },{ score: 76, percentile: 90 },{ score: 100, percentile: 99 }],
  learning_agility:     [{ score: 0, percentile: 1 },{ score: 26, percentile: 10 },{ score: 40, percentile: 25 },{ score: 54, percentile: 50 },{ score: 67, percentile: 75 },{ score: 78, percentile: 90 },{ score: 100, percentile: 99 }],
  // New dimensions — flat distribution centered at 50 until real data collected
  emotional_intelligence: [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  decision_making:        [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  execution:              [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  managing_others:        [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  teamwork:               [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  persuasion:             [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
  embracing_differences:  [{ score: 0, percentile: 1 },{ score: 20, percentile: 10 },{ score: 35, percentile: 25 },{ score: 50, percentile: 50 },{ score: 65, percentile: 75 },{ score: 80, percentile: 90 },{ score: 100, percentile: 99 }],
}

export function getPercentile(dimension: string, score: number): number {
  const table = NORMS[dimension]
  if (!table) throw new Error(`Unknown dimension: ${dimension}`)
  const clamped = Math.max(0, Math.min(100, score))
  for (let i = 0; i < table.length - 1; i++) {
    const lo = table[i], hi = table[i + 1]
    if (clamped >= lo.score && clamped <= hi.score) {
      const t = (clamped - lo.score) / (hi.score - lo.score)
      return lo.percentile + t * (hi.percentile - lo.percentile)
    }
  }
  return table[table.length - 1].percentile
}
