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
  const submittingRef = useRef(false)

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
    if (submittingRef.current) return
    submittingRef.current = true
    const question = questions[currentIdx]
    const responseTimeMs = Date.now() - questionDisplayTimeRef.current
    const nextAlreadyLoaded = currentIdx + 1 < questions.length

    // Optimistically advance when next question is already available
    if (nextAlreadyLoaded) {
      setAnswered(a => a + 1)
      setCurrentIdx(i => i + 1)
      submittingRef.current = false  // release lock so next question is immediately clickable
    }

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

      if (data.nextQuestion) {
        setQuestions(q => [...q, data.nextQuestion])
        setTotal(data.progress.total)
        if (!nextAlreadyLoaded) {
          setAnswered(a => a + 1)
          setCurrentIdx(i => i + 1)
        }
      } else if (!nextAlreadyLoaded) {
        if (currentIdx + 1 < questions.length) {
          setAnswered(a => a + 1)
          setCurrentIdx(i => i + 1)
        } else {
          setAnswered(a => a + 1)
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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setPhase('error')
      submittingRef.current = false
    } finally {
      if (!nextAlreadyLoaded) submittingRef.current = false
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
    <div className="min-h-screen bg-bg">

      {/* Dark hero */}
      <div className="relative overflow-hidden bg-slate-900 py-24 text-center">
        <span className="absolute right-8 bottom-0 text-[14rem] font-black text-white/5 leading-none select-none pointer-events-none" aria-hidden="true">36</span>
        <div className="relative max-w-2xl mx-auto px-4 space-y-5">
          <p className="text-teal text-xs font-semibold uppercase tracking-widest">Free · No account required</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Know Your Moment.</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            36 validated dimensions across cognitive, motivational, behavioral, and leadership axes. One complete profile — built on real science.
          </p>
          <div className="pt-2">
            <button
              onClick={startAssessment}
              className="bg-indigo text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 hover:scale-105 transition-all"
            >
              Begin Assessment
            </button>
          </div>
          <p className="text-slate-500 text-sm">~12 minutes · ~80–132 adaptive questions</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-indigo py-10">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-16">
          {([
            { num: '36', label: 'Dimensions measured' },
            { num: '32', label: 'Archetypes identified' },
            { num: '80+', label: 'Calibration questions' },
            { num: '6', label: 'Behavioral clusters' },
          ] as const).map(({ num, label }) => (
            <div key={num} className="text-center">
              <p className="text-3xl font-black text-white">{num}</p>
              <p className="text-xs text-indigo-200 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What you get */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-10">What you get</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { title: 'Your Archetype', desc: '1 of 32 profiles built from cosine-distance matching across all 36 dimensions.', cls: 'border-indigo/20 bg-indigo-50' },
            { title: 'HPIF Profile', desc: '6-layer behavioral framework: cognitive, motivational, behavioral, growth, career, and team.', cls: 'border-teal/20 bg-teal-50' },
            { title: 'Growth Roadmap', desc: 'Your 3 development priorities, 90-day challenge, and 1-year vision.', cls: 'border-violet-200/50 bg-violet-50' },
          ].map(({ title, desc, cls }) => (
            <div key={title} className={`rounded-2xl border p-5 hover:-translate-y-1 transition-transform duration-200 ${cls}`}>
              <p className="font-semibold text-text mb-2">{title}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
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
