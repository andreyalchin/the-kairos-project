import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

type AssessmentWithResult = {
  id: string
  completed_at: string
  results?: {
    id: string
    archetype?: string
    match_score?: number
    scores?: Record<string, number>
  }[]
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()

  const { data: assessments } = await serviceClient
    .from('assessments')
    .select('id, completed_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  const assessmentIds = (assessments ?? []).map(a => a.id)

  const { data: results } = assessmentIds.length > 0
    ? await serviceClient
        .from('results')
        .select('id, archetype, match_score, scores, assessment_id')
        .in('assessment_id', assessmentIds)
    : { data: [] }

  const resultMap = new Map((results ?? []).map(r => [r.assessment_id, r]))

  const merged: AssessmentWithResult[] = (assessments ?? []).map(a => ({
    id: a.id,
    completed_at: a.completed_at,
    results: resultMap.has(a.id) ? [resultMap.get(a.id)!] : [],
  }))

  return (
    <ProfileClient
      user={{
        id: user.id,
        email: user.email ?? '',
        created_at: user.created_at,
        user_metadata: user.user_metadata,
      }}
      assessments={merged}
    />
  )
}
