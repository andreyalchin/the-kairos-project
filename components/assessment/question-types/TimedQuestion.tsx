'use client'
import { useState, useEffect } from 'react'
import { SituationalQuestion } from './SituationalQuestion'
import type { Question } from '@/lib/types'

export function TimedQuestion({ question, onAnswer }: { question: Question; onAnswer: (v: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); onAnswer(0); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onAnswer])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Time remaining</span>
        <span className={`font-mono text-lg font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-indigo'}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo transition-all duration-1000"
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>
      <SituationalQuestion question={question} onAnswer={onAnswer} />
    </div>
  )
}
