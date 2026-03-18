'use client'
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LikertQuestion } from './question-types/LikertQuestion'
import { FrequencyQuestion } from './question-types/FrequencyQuestion'
import { ForcedChoiceQuestion } from './question-types/ForcedChoiceQuestion'
import { SituationalQuestion } from './question-types/SituationalQuestion'
import { TimedQuestion } from './question-types/TimedQuestion'
import { RankOrderQuestion } from './question-types/RankOrderQuestion'
import { AllocationQuestion } from './question-types/AllocationQuestion'
import { VisualQuestion } from './question-types/VisualQuestion'
import type { Question } from '@/lib/types'

interface QuestionCardProps {
  question: Question
  questionNumber?: number
  onAnswer: (value: unknown) => void
}

const TIER_LABELS = ['Core Personality', 'Cognitive Architecture', 'Motivational DNA', 'Behavioral Expression', 'Leadership & Career', 'Resilience & Growth']

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const QuestionComponent = {
    likert: LikertQuestion,
    frequency: FrequencyQuestion,
    forced_choice: ForcedChoiceQuestion,
    situational: SituationalQuestion,
    timed: TimedQuestion,
    rank_order: RankOrderQuestion,
    allocation: AllocationQuestion,
    visual: VisualQuestion,
  }[question.type] as React.ComponentType<{ question: Question; onAnswer: (v: unknown) => void }>

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.code}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.15 }}
        className="space-y-6"
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            {TIER_LABELS[question.tier - 1]}
          </p>
          <h2 className="text-xl font-semibold text-text leading-snug">{question.text}</h2>
        </div>
        <QuestionComponent question={question} onAnswer={onAnswer} />
      </motion.div>
    </AnimatePresence>
  )
}
