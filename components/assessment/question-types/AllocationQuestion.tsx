'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Question } from '@/lib/types'

export function AllocationQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const items = question.options.items ?? []
  const targetIdx = question.options.target_item_index ?? 0
  const total = question.options.total ?? 100
  const [values, setValues] = useState<number[]>(items.map(() => Math.floor(total / items.length)))

  const remaining = total - values.reduce((s, v) => s + v, 0)
  const isValid = remaining === 0

  const handleChange = (idx: number, val: number) => {
    const clamped = Math.max(0, Math.min(val, values[idx] + remaining))
    const updated = [...values]
    updated[idx] = clamped
    setValues(updated)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Distribute {total} points across these areas:</p>
      {items.map((item, idx) => (
        <div key={item} className="flex items-center gap-4">
          <span className="w-36 text-sm text-text">{item}</span>
          <input
            type="range" min={0} max={total} value={values[idx]}
            onChange={e => handleChange(idx, Number(e.target.value))}
            className="flex-1 accent-indigo"
          />
          <span className="w-10 text-right font-mono text-indigo font-bold">{values[idx]}</span>
        </div>
      ))}
      <div className={`text-sm ${remaining === 0 ? 'text-teal' : 'text-red-500'}`}>
        {remaining === 0 ? 'All points allocated ✓' : `${Math.abs(remaining)} points ${remaining > 0 ? 'remaining' : 'over'}`}
      </div>
      <Button onClick={() => onAnswer(values[targetIdx])} disabled={!isValid} className="w-full">
        Confirm Allocation
      </Button>
    </div>
  )
}
