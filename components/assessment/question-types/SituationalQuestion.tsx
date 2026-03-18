'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function SituationalQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const { scenario, choices = [] } = question.options

  const handleSelect = (idx: number) => {
    setSelected(idx)
    setTimeout(() => onAnswer(idx), 150)
  }

  return (
    <div className="space-y-4">
      {scenario && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 italic">
          {scenario}
        </div>
      )}
      <div className="space-y-2">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={cn(
              'w-full text-left px-5 py-3 rounded-xl border transition-all',
              selected === idx
                ? 'border-indigo bg-indigo-50 text-indigo font-medium'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            )}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
