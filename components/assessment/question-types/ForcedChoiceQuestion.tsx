'use client'
import type { Question } from '@/lib/types'

export function ForcedChoiceQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: 'a' | 'b') => void }) {
  const { a, b } = question.options
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {([['a', a], ['b', b]] as const).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onAnswer(key)}
          className="px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo hover:bg-indigo-50 transition-all text-left"
        >
          <span className="block text-xs font-bold uppercase tracking-wider text-indigo mb-2">{key.toUpperCase()}</span>
          <span className="text-base text-text">{label}</span>
        </button>
      ))}
    </div>
  )
}
