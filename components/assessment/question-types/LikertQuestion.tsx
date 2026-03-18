'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function LikertQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const labels = question.options.labels ?? []

  const handleSelect = (val: number) => {
    setSelected(val)
    setTimeout(() => onAnswer(val), 150)
  }

  return (
    <div className="space-y-3">
      {labels.map((label, i) => {
        const val = i + 1
        return (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            className={cn(
              'w-full text-left px-5 py-3 rounded-xl border transition-all',
              selected === val
                ? 'border-indigo bg-indigo-50 text-indigo font-medium'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
            )}
          >
            <span className="text-sm text-slate-400 mr-3">{val}</span>{label}
          </button>
        )
      })}
    </div>
  )
}
