// lib/questions.ts
import type { Question } from './types'

export const QUESTIONS: Question[] = [
  // === TIER 1: CORE PERSONALITY ===

  // Openness (3 questions)
  { id: '', code: 'O_01', text: 'I enjoy exploring abstract ideas and concepts.', type: 'likert', dimension: 'openness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'O_02', text: 'I prefer concrete, practical tasks over theoretical ones.', type: 'likert', dimension: 'openness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'O_03', text: 'When given free time, which would you rather do?', type: 'forced_choice', dimension: 'openness', tier: 1, options: { a: 'Read about a familiar topic I know well', b: 'Explore a completely new subject I know nothing about' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Conscientiousness (3 questions)
  { id: '', code: 'C_01', text: 'I complete tasks thoroughly, even when no one is watching.', type: 'likert', dimension: 'conscientiousness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'C_02', text: 'How often do you follow through on commitments you make to yourself?', type: 'frequency', dimension: 'conscientiousness', tier: 1, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'C_03', text: 'I tend to leave tasks unfinished when they become difficult.', type: 'likert', dimension: 'conscientiousness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 3, is_active: true },

  // Extraversion (3 questions)
  { id: '', code: 'E_01', text: 'Social gatherings energize rather than drain me.', type: 'likert', dimension: 'extraversion', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'E_02', text: 'After a long day of meetings, I feel:', type: 'forced_choice', dimension: 'extraversion', tier: 1, options: { a: 'Drained and need quiet time alone', b: 'Energized and ready for more conversation' }, weight: 1.2, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'E_03', text: 'How often do you initiate conversations with people you don\'t know?', type: 'frequency', dimension: 'extraversion', tier: 1, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Agreeableness (3 questions)
  { id: '', code: 'A_01', text: 'I find it easy to see situations from other people\'s perspectives.', type: 'likert', dimension: 'agreeableness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'A_02', text: 'I prioritize team harmony even when I disagree with the direction.', type: 'likert', dimension: 'agreeableness', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'A_03', text: 'Your team disagrees with your recommendation. You:', type: 'situational', dimension: 'agreeableness', tier: 1, options: { scenario: 'Your team strongly disagrees with your recommendation.', choices: ['A: Stand firm — you\'ve done the analysis', 'B: Find a compromise that partially addresses both views', 'C: Defer to the team — consensus matters more', 'D: Escalate to leadership to decide'], scores: [1, 3.7, 5, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Emotional Stability (3 questions)
  { id: '', code: 'ES_01', text: 'I remain calm when things go wrong unexpectedly.', type: 'likert', dimension: 'emotional_stability', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'ES_02', text: 'I worry about making mistakes even after the fact.', type: 'likert', dimension: 'emotional_stability', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'ES_03', text: 'How quickly do you recover emotionally from a setback at work?', type: 'frequency', dimension: 'emotional_stability', tier: 1, options: { labels: ['Very Slowly (days)','Slowly','Moderately','Quickly','Very Quickly (hours)'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Honesty-Humility (3 questions)
  { id: '', code: 'HH_01', text: 'I avoid taking credit for outcomes that involved significant help from others.', type: 'likert', dimension: 'honesty_humility', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'HH_02', text: 'I would bend rules slightly if I was confident no one would find out.', type: 'likert', dimension: 'honesty_humility', tier: 1, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'HH_03', text: 'Which matters more to you?', type: 'forced_choice', dimension: 'honesty_humility', tier: 1, options: { a: 'Being seen as successful and impressive', b: 'Acting with integrity even when it costs you' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 2: COGNITIVE ARCHITECTURE ===

  // Cognitive Agility (3 questions)
  { id: '', code: 'CA_01', text: 'I enjoy switching between different types of problems rapidly.', type: 'likert', dimension: 'cognitive_agility', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CA_02', text: 'You have 60 seconds to decide which abstract pattern completes the sequence:', type: 'timed', dimension: 'cognitive_agility', tier: 2, options: { scenario: 'Rank the options by how logically they complete the pattern: Circle-Square-Triangle-?', choices: ['A: Pentagon (adds sides)', 'B: Circle (repeats first)', 'C: Star (breaks pattern)', 'D: Hexagon (adds sides differently)'], scores: [5, 2.3, 1, 3.7] }, weight: 1.3, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CA_03', text: 'When facing a complex problem, I naturally break it into components.', type: 'likert', dimension: 'cognitive_agility', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Executive Function (3 questions)
  { id: '', code: 'EF_01', text: 'I can keep multiple competing priorities organized without losing track.', type: 'likert', dimension: 'executive_function', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'EF_02', text: 'How often do you start a task but get pulled to another before finishing?', type: 'frequency', dimension: 'executive_function', tier: 2, options: { labels: ['Almost Always','Usually','Sometimes','Rarely','Almost Never'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'EF_03', text: 'You have 3 deadlines tomorrow and an unexpected crisis today. You:', type: 'timed', dimension: 'executive_function', tier: 2, options: { scenario: 'Three deadlines tomorrow, unexpected crisis today.', choices: ['A: Handle the crisis first, then work late on deadlines', 'B: Triage — delegate the crisis, protect the most critical deadline', 'C: Communicate delays proactively, focus on the crisis', 'D: Push through all simultaneously'], scores: [2.3, 5, 3.7, 1] }, weight: 1.3, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Attention Control (3 questions)
  { id: '', code: 'AC_01', text: 'I can focus deeply for hours without needing breaks.', type: 'likert', dimension: 'attention_control', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AC_02', text: 'Notifications and interruptions significantly disrupt my concentration.', type: 'likert', dimension: 'attention_control', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AC_03', text: 'How often do you achieve a state of deep focus (flow) at work?', type: 'frequency', dimension: 'attention_control', tier: 2, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Systems Thinking (3 questions)
  { id: '', code: 'ST_01', text: 'When analyzing a problem, I naturally consider second and third-order effects.', type: 'likert', dimension: 'systems_thinking', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'ST_02', text: 'I find it easy to identify the root cause of complex organizational problems.', type: 'likert', dimension: 'systems_thinking', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'ST_03', text: 'Rank these approaches to solving a recurring team problem:', type: 'rank_order', dimension: 'systems_thinking', tier: 2, options: { items: ['Map the system to find root cause', 'Fix the immediate symptom quickly', 'Ask why 5 times before acting', 'Try multiple solutions in parallel'], target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Creative Intelligence (3 questions)
  { id: '', code: 'CI_01', text: 'I regularly make unexpected connections between unrelated fields.', type: 'likert', dimension: 'creative_intelligence', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CI_02', text: 'When brainstorming, I generate more ideas than I could ever use.', type: 'likert', dimension: 'creative_intelligence', tier: 2, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CI_03', text: 'Which visual pattern feels most natural to your thinking style?', type: 'visual', dimension: 'creative_intelligence', tier: 2, options: { images: ['visual_q1_a.svg','visual_q1_b.svg','visual_q1_c.svg','visual_q1_d.svg'], scores: [3, 5, 1, 4] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 3: MOTIVATIONAL DNA ===

  // Achievement Drive (3 questions)
  { id: '', code: 'AD_01', text: 'I push myself to exceed expectations, not just meet them.', type: 'likert', dimension: 'achievement_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AD_02', text: 'Allocate 100 points across what motivates you most at work:', type: 'allocation', dimension: 'achievement_drive', tier: 3, options: { items: ['Achieving excellence', 'Being liked by colleagues', 'Financial reward', 'Making an impact'], total: 100, target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AD_03', text: 'I feel restless when I\'m not working toward a challenging goal.', type: 'likert', dimension: 'achievement_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Risk Tolerance (3 questions)
  { id: '', code: 'RT_01', text: 'I would rather pursue a 30% chance at $100K than a guaranteed $25K.', type: 'likert', dimension: 'risk_tolerance', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'RT_02', text: 'A promising startup offers you equity + lower base salary. Your current job is stable. You:', type: 'situational', dimension: 'risk_tolerance', tier: 3, options: { scenario: 'A promising startup offers equity + lower salary vs your stable current job.', choices: ['A: Decline — stability is more valuable', 'B: Ask for more data before deciding', 'C: Negotiate a transition period, then join', 'D: Join immediately — upside is worth it'], scores: [1, 2.3, 3.7, 5] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'RT_03', text: 'How often do you make significant decisions with incomplete information?', type: 'frequency', dimension: 'risk_tolerance', tier: 3, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Autonomy Need (3 questions)
  { id: '', code: 'AN_01', text: 'I do my best work when I have full control over how I approach a task.', type: 'likert', dimension: 'autonomy_need', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AN_02', text: 'Frequent check-ins and status updates help me stay on track.', type: 'likert', dimension: 'autonomy_need', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AN_03', text: 'Which working structure do you prefer?', type: 'forced_choice', dimension: 'autonomy_need', tier: 3, options: { a: 'Clear expectations, regular feedback, team accountability', b: 'Open mandate, self-directed priorities, minimal oversight' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Purpose Orientation (3 questions)
  { id: '', code: 'PO_01', text: 'I need my work to contribute to something larger than personal gain.', type: 'likert', dimension: 'purpose_orientation', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'PO_02', text: 'Allocate 100 points across what you\'d want your legacy to reflect:', type: 'allocation', dimension: 'purpose_orientation', tier: 3, options: { items: ['Making a meaningful difference', 'Building wealth', 'Achieving recognition', 'Mastering a craft'], total: 100, target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'PO_03', text: 'A high-paying job with no clear social impact would feel unfulfilling to me.', type: 'likert', dimension: 'purpose_orientation', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Competitive Drive (3 questions)
  { id: '', code: 'CD_01', text: 'Knowing others are ahead of me motivates me to work harder.', type: 'likert', dimension: 'competitive_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CD_02', text: 'I keep track of how my performance compares to peers and benchmarks.', type: 'frequency', dimension: 'competitive_drive', tier: 3, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CD_03', text: 'Winning matters more to me than just participating.', type: 'likert', dimension: 'competitive_drive', tier: 3, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 4: BEHAVIORAL EXPRESSION ===

  // Social Influence (3 questions)
  { id: '', code: 'SI_01', text: 'I naturally take the lead in group discussions.', type: 'likert', dimension: 'social_influence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'SI_02', text: 'People often adopt my recommendations without much persuasion.', type: 'likert', dimension: 'social_influence', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'SI_03', text: 'Rank your preferred approach to getting buy-in from stakeholders:', type: 'rank_order', dimension: 'social_influence', tier: 4, options: { items: ['Present data and let it speak', 'Tell a compelling story', 'Build relationships first', 'Make it their idea'], target_item_index: 1 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Conflict Navigation (3 questions)
  { id: '', code: 'CN_01', text: 'I address disagreements directly rather than avoiding them.', type: 'likert', dimension: 'conflict_navigation', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CN_02', text: 'A colleague publicly criticizes your work in a meeting. You:', type: 'situational', dimension: 'conflict_navigation', tier: 4, options: { scenario: 'A colleague publicly criticizes your work during a team meeting.', choices: ['A: Stay silent — address it privately later', 'B: Calmly defend your work with evidence in the moment', 'C: Ask clarifying questions to understand their concern', 'D: Acknowledge the critique and commit to improvement'], scores: [1, 5, 3.7, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CN_03', text: 'I find it uncomfortable to push back on someone senior to me.', type: 'likert', dimension: 'conflict_navigation', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: false, order_index: 3, is_active: true },

  // Communication Style (3 questions)
  { id: '', code: 'CS_01', text: 'I prefer data-backed arguments over emotionally resonant stories.', type: 'likert', dimension: 'communication_style', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CS_02', text: 'When presenting, I lead with the human story rather than the metrics.', type: 'likert', dimension: 'communication_style', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CS_03', text: 'Which visual pattern feels most natural to your communication style?', type: 'visual', dimension: 'communication_style', tier: 4, options: { images: ['visual_q2_a.svg','visual_q2_b.svg','visual_q2_c.svg','visual_q2_d.svg'], scores: [1, 3, 5, 4] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Collaboration Signature (3 questions)
  { id: '', code: 'CO_01', text: 'I produce my best work independently rather than in groups.', type: 'likert', dimension: 'collaboration_signature', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'CO_02', text: 'Allocate 100 points across your preferred working modes:', type: 'allocation', dimension: 'collaboration_signature', tier: 4, options: { items: ['Solo deep work', 'Collaborative team sessions', 'Pair/duo work', 'Large group workshops'], total: 100, target_item_index: 1 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'CO_03', text: 'I feel more productive in a team environment than working alone.', type: 'likert', dimension: 'collaboration_signature', tier: 4, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 5: LEADERSHIP & CAREER ===

  // Leadership Drive (3 questions)
  { id: '', code: 'LD_01', text: 'I naturally step up to lead when a group lacks direction.', type: 'likert', dimension: 'leadership_drive', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'LD_02', text: 'I prefer being in a position where I set direction rather than execute it.', type: 'likert', dimension: 'leadership_drive', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'LD_03', text: 'Rank your preference for role in a new initiative:', type: 'rank_order', dimension: 'leadership_drive', tier: 5, options: { items: ['Lead it — set vision and strategy', 'Execute it — deliver with excellence', 'Advise it — provide expertise', 'Support it — enable others to succeed'], target_item_index: 0 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Strategic Orientation (3 questions)
  { id: '', code: 'SO_01', text: 'I think in years and decades rather than weeks and months.', type: 'likert', dimension: 'strategic_orientation', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'SO_02', text: 'I get more energy from defining where we\'re going than from optimizing current operations.', type: 'likert', dimension: 'strategic_orientation', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'SO_03', text: 'A competitor launches a superior product. You prioritize:', type: 'situational', dimension: 'strategic_orientation', tier: 5, options: { scenario: 'A competitor just launched a superior product in your market.', choices: ['A: Respond tactically — improve your current product quickly', 'B: Reframe the market — position around a different dimension', 'C: Analyze long-term — is this category worth winning?', 'D: Accelerate roadmap — execute planned strategy faster'], scores: [1, 3.7, 5, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Specialist-Generalist (2 questions)
  { id: '', code: 'SG_01', text: 'I prefer going very deep in one domain over being broadly competent across many.', type: 'likert', dimension: 'specialist_generalist', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: true, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'SG_02', text: 'Which do you find more valuable in your career so far?', type: 'forced_choice', dimension: 'specialist_generalist', tier: 5, options: { a: 'Developing deep expertise in my core domain', b: 'Building diverse skills across many domains' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },

  // Innovation Index (3 questions)
  { id: '', code: 'II_01', text: 'I am drawn to problems that have no established solutions.', type: 'likert', dimension: 'innovation_index', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'II_02', text: 'I get frustrated when teams resist new approaches in favor of "how we\'ve always done it."', type: 'likert', dimension: 'innovation_index', tier: 5, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'II_03', text: 'Which visual pattern most represents your approach to innovation?', type: 'visual', dimension: 'innovation_index', tier: 5, options: { images: ['visual_q3_a.svg','visual_q3_b.svg','visual_q3_c.svg','visual_q3_d.svg'], scores: [2, 5, 3, 1] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // === TIER 6: RESILIENCE & GROWTH ===

  // Psychological Resilience (3 questions)
  { id: '', code: 'PR_01', text: 'After a major failure, I recover and try again relatively quickly.', type: 'likert', dimension: 'psychological_resilience', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'PR_02', text: 'Your most important project fails publicly. You:', type: 'situational', dimension: 'psychological_resilience', tier: 6, options: { scenario: 'Your most important project fails publicly and visibly.', choices: ['A: Withdraw temporarily to process and recover', 'B: Immediately analyze what went wrong and share learnings', 'C: Reframe it as a stepping stone and move forward', 'D: Double down — find a way to salvage or rebuild'], scores: [1, 3.7, 5, 2.3] }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'PR_03', text: 'I use setbacks as learning opportunities more than as sources of discouragement.', type: 'likert', dimension: 'psychological_resilience', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 3, is_active: true },

  // Growth Mindset (3 questions)
  { id: '', code: 'GM_01', text: 'I believe my core abilities can be substantially developed with effort.', type: 'likert', dimension: 'growth_mindset', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'GM_02', text: 'How often do you deliberately seek out difficult challenges to grow?', type: 'frequency', dimension: 'growth_mindset', tier: 6, options: { labels: ['Almost Never','Rarely','Sometimes','Usually','Almost Always'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 2, is_active: true },
  { id: '', code: 'GM_03', text: 'Which do you believe more strongly?', type: 'forced_choice', dimension: 'growth_mindset', tier: 6, options: { a: 'People have a natural ceiling on how much they can change', b: 'With the right approach, anyone can develop almost any skill' }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Adaptability Quotient (3 questions)
  { id: '', code: 'AQ_01', text: 'I thrive in rapidly changing environments.', type: 'likert', dimension: 'adaptability_quotient', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'AQ_02', text: 'Unexpected pivots in direction energize rather than frustrate me.', type: 'likert', dimension: 'adaptability_quotient', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'AQ_03', text: 'Rank these scenarios by how comfortable you\'d feel:', type: 'rank_order', dimension: 'adaptability_quotient', tier: 6, options: { items: ['Your role scope doubles unexpectedly', 'Your team restructures with a new manager', 'Your company pivots to a new market', 'Your project scope is cut in half'], target_item_index: 2 }, weight: 1.2, reverse_scored: false, calibration: false, order_index: 3, is_active: true },

  // Learning Agility (3 questions)
  { id: '', code: 'LA_01', text: 'I can become reasonably proficient at a new skill within weeks.', type: 'likert', dimension: 'learning_agility', tier: 6, options: { labels: ['Strongly Disagree','Disagree','Neutral','Agree','Strongly Agree'] }, weight: 1.0, reverse_scored: false, calibration: true, order_index: 1, is_active: true },
  { id: '', code: 'LA_02', text: 'How quickly do you typically feel productive in a completely new domain?', type: 'frequency', dimension: 'learning_agility', tier: 6, options: { labels: ['Very Slowly (months)','Slowly','Moderately','Quickly','Very Quickly (weeks)'] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 2, is_active: true },
  { id: '', code: 'LA_03', text: 'Which visual pattern best represents how you learn new things?', type: 'visual', dimension: 'learning_agility', tier: 6, options: { images: ['visual_q4_a.svg','visual_q4_b.svg','visual_q4_c.svg','visual_q4_d.svg'], scores: [3, 1, 5, 2] }, weight: 1.0, reverse_scored: false, calibration: false, order_index: 3, is_active: true },
]

// Construct pairs: same-construct question pairs for inconsistency detection
export const CONSTRUCT_PAIRS: Array<{ questionA: string; questionB: string }> = [
  { questionA: 'O_01', questionB: 'O_02' },       // openness pair
  { questionA: 'C_01', questionB: 'C_03' },       // conscientiousness pair
  { questionA: 'E_01', questionB: 'E_02' },       // extraversion pair
  { questionA: 'ES_01', questionB: 'ES_02' },     // emotional stability pair
  { questionA: 'HH_01', questionB: 'HH_02' },     // honesty-humility pair
  { questionA: 'EF_01', questionB: 'EF_02' },     // executive function pair
  { questionA: 'AC_01', questionB: 'AC_02' },     // attention control pair
  { questionA: 'AN_01', questionB: 'AN_02' },     // autonomy need pair
  { questionA: 'CN_01', questionB: 'CN_03' },     // conflict navigation pair
  { questionA: 'CS_01', questionB: 'CS_02' },     // communication style pair
  { questionA: 'CO_01', questionB: 'CO_03' },     // collaboration pair
  { questionA: 'SG_01', questionB: 'SG_02' },     // specialist-generalist pair
  { questionA: 'GM_01', questionB: 'GM_03' },     // growth mindset pair
]

// Calibration coverage: 29 dimensions × 1 base question + 11 high-priority extras = 40 total calibration questions.
// All calibration flags are already set in the array above.
