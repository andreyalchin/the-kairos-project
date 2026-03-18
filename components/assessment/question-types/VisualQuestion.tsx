'use client'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/types'

export function VisualQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const images = question.options.images ?? []

  const handleSelect = (idx: number) => {
    setSelected(idx)
    setTimeout(() => onAnswer(idx), 200)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((src, idx) => (
        <button
          key={src}
          onClick={() => handleSelect(idx)}
          className={cn(
            'aspect-square rounded-2xl border-4 overflow-hidden transition-all',
            selected === idx ? 'border-indigo scale-105 shadow-lg' : 'border-transparent hover:border-indigo-300'
          )}
        >
          <Image
            src={`/assessment/images/${src}`}
            alt={`Option ${idx + 1}`}
            width={200} height={200}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}
