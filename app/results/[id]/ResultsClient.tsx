'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AuthGateOverlay } from '@/components/report/AuthGate'
import { ReportSection1 } from '@/components/report/ReportSection1'
import { ReportSection2 } from '@/components/report/ReportSection2'
import { ReportSection3 } from '@/components/report/ReportSection3'
import { ReportSection4 } from '@/components/report/ReportSection4'
import { ReportSection5 } from '@/components/report/ReportSection5'
import { ReportSection6 } from '@/components/report/ReportSection6'
import { ReportSection7 } from '@/components/report/ReportSection7'
import { ReportSection8 } from '@/components/report/ReportSection8'
import { ReportSection9 } from '@/components/report/ReportSection9'
import { ReportSection10 } from '@/components/report/ReportSection10'
import { ReportSection11 } from '@/components/report/ReportSection11'
import type { AssessmentResult, ArchetypeDefinition } from '@/lib/types'

interface Props { result: AssessmentResult; archetypeContent: ArchetypeDefinition; resultId: string; isAuthenticated?: boolean }

const DEMO_ID = '00000000-0000-0000-0000-000000000002'

export function ResultsClient({ result, archetypeContent, resultId, isAuthenticated = false }: Props) {
  const isDemo = resultId === DEMO_ID
  const [authenticated, setAuthenticated] = useState(isDemo || isAuthenticated)
  const [showGate, setShowGate] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('kairos_session') ?? '' : ''

  // Link session token and sync auth state
  useEffect(() => {
    if (isDemo) return
    const supabase = createClient()

    // Try to link the current session token regardless of event type
    const tryLink = (token: string) => {
      if (!token) return
      fetch('/api/assessment/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      })
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthenticated(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('kairos_session') ?? '' : ''
        tryLink(token)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('kairos_session') ?? '' : ''
        tryLink(token)
      }
      setAuthenticated(!!session)
    })
    return () => subscription.unsubscribe()
  }, [isDemo])

  const sentinelRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null }
    if (!el) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !authenticated) setShowGate(true)
        else if (entry.isIntersecting) setShowGate(false)
      },
      { threshold: 0 }
    )
    observerRef.current.observe(el)
  }, [authenticated])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <ReportSection1 result={result} archetype={archetypeContent} />
        <ReportSection2 result={result} onSentinelRef={sentinelRef} />
        <div className={!authenticated && showGate ? 'blur-sm pointer-events-none select-none' : ''} style={{ transition: 'filter 0.3s' }}>
          <ReportSection3 archetype={archetypeContent} matchScore={result.match_score} />
          <ReportSection4 result={result} />
          <ReportSection5 result={result} archetype={archetypeContent} />
          <ReportSection6 result={result} archetype={archetypeContent} />
          <ReportSection7 result={result} archetype={archetypeContent} />
          <ReportSection8 result={result} archetype={archetypeContent} />
          <ReportSection9 result={result} archetype={archetypeContent} />
          <ReportSection10 result={result} archetype={archetypeContent} />
          <ReportSection11 result={result} archetype={archetypeContent} />
        </div>
      </div>
      <AuthGateOverlay
        show={showGate && !authenticated}
        sessionToken={sessionToken}
        onAuthenticated={() => { setAuthenticated(true); setShowGate(false) }}
      />
    </div>
  )
}
