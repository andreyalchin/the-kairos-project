'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Question } from '@/lib/types'

export function RankOrderQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const items = question.options.items ?? []
  const targetIdx = question.options.target_item_index ?? 0
  const [ranked, setRanked] = useState<string[]>([...items])

  const move = (from: number, to: number) => {
    const arr = [...ranked]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setRanked(arr)
  }

  const handleConfirm = () => {
    const targetItem = items[targetIdx]
    const rank = ranked.indexOf(targetItem) + 1
    onAnswer(rank)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Drag to rank from most to least preferred (1 = top):</p>
      <div className="space-y-2">
        {ranked.map((item, idx) => (
          <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-indigo text-white text-xs flex items-center justify-center font-bold">
              {idx + 1}
            </span>
            <span className="flex-1 text-text">{item}</span>
            <div className="flex flex-col gap-1">
              <button onClick={() => idx > 0 && move(idx, idx - 1)} className="text-slate-400 hover:text-indigo text-xs">↑</button>
              <button onClick={() => idx < ranked.length - 1 && move(idx, idx + 1)} className="text-slate-400 hover:text-indigo text-xs">↓</button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleConfirm} className="w-full">Confirm Ranking</Button>
    </div>
  )
}
