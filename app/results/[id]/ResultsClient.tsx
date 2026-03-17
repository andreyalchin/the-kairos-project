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

interface Props { result: AssessmentResult; archetypeContent: ArchetypeDefinition; resultId: string }

export function ResultsClient({ result, archetypeContent }: Props) {
  const [authenticated, setAuthenticated] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('kairos_session') ?? '' : ''

  // Check for existing Supabase session on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthenticated(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

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
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-2">
        <ReportSection1 result={result} archetype={archetypeContent} />
        <ReportSection2 result={result} onSentinelRef={sentinelRef} />
        <div className={!authenticated && showGate ? 'blur-sm pointer-events-none select-none' : ''} style={{ transition: 'filter 0.3s' }}>
          <ReportSection3 archetype={archetypeContent} />
          <ReportSection4 result={result} />
          <ReportSection5 result={result} archetype={archetypeContent} />
          <ReportSection6 result={result} archetype={archetypeContent} />
          <ReportSection7 result={result} archetype={archetypeContent} />
          <ReportSection8 result={result} archetype={archetypeContent} />
          <ReportSection9 result={result} archetype={archetypeContent} />
          <ReportSection10 result={result} />
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
