'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/assessment/QuestionCard'
import { ProgressBar } from '@/components/assessment/ProgressBar'
import { ProcessingScreen } from '@/components/assessment/ProcessingScreen'
import type { Question } from '@/lib/types'

type Phase = 'intro' | 'questions' | 'processing' | 'error'

export default function AssessmentPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [sessionToken, setSessionToken] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [total, setTotal] = useState(40)
  const [error, setError] = useState('')

  const questionDisplayTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    questionDisplayTimeRef.current = Date.now()
  }, [currentIdx])

  const startAssessment = async () => {
    try {
      const res = await fetch('/api/assessment/start', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to start assessment')
      const data = await res.json()
      localStorage.setItem('kairos_session', data.sessionToken)
      setSessionToken(data.sessionToken)
      setQuestions(data.questions)
      setTotal(data.questions.length)
      setPhase('questions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }

  const handleAnswer = useCallback(async (value: unknown) => {
    const question = questions[currentIdx]
    const responseTimeMs = Date.now() - questionDisplayTimeRef.current
    try {
      const res = await fetch('/api/assessment/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          questionCode: question.code,
          value,
          responseTimeMs,
          revised: false,
        }),
      })
      const data = await res.json()
      setAnswered(a => a + 1)

      if (data.nextQuestion) {
        setQuestions(q => [...q, data.nextQuestion])
        setTotal(data.progress.total)
        setCurrentIdx(i => i + 1)
      } else if (currentIdx + 1 < questions.length) {
        setCurrentIdx(i => i + 1)
      } else {
        setPhase('processing')
        const processingStart = Date.now()
        const completeRes = await fetch('/api/assessment/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        })
        const completeData = await completeRes.json()
        if (!completeRes.ok || !completeData.resultId) {
          throw new Error(completeData.error ?? 'Failed to process results')
        }
        const elapsed = Date.now() - processingStart
        if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed))
        router.push(`/results/${completeData.resultId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
    }
  }, [questions, currentIdx, sessionToken, router])

  if (phase === 'processing') return <ProcessingScreen />

  if (phase === 'error') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
        <p className="text-slate-600">{error}</p>
        <button onClick={() => setPhase('intro')} className="text-indigo underline">Try again</button>
      </div>
    </div>
  )

  if (phase === 'intro') return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-bold text-text">Know Your Moment.</h1>
        <p className="text-lg text-slate-600">A scientifically grounded assessment of 29 dimensions that shape who you are and where you&apos;re going. ~12 minutes.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={startAssessment}
            className="bg-indigo text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition-colors"
          >
            Begin Assessment
          </button>
        </div>
        <p className="text-sm text-slate-400">No account required · Free · ~40–82 questions</p>
      </div>
    </div>
  )

  const currentQuestion = questions[currentIdx]
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-xl mx-auto px-6 py-12 space-y-8">
        <ProgressBar answered={answered} total={total} />
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  )
}
