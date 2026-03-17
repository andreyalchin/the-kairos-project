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
    .select('id, completed_at, results(id, archetype, match_score, scores)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  return (
    <ProfileClient
      user={{
        id: user.id,
        email: user.email ?? '',
        created_at: user.created_at,
        user_metadata: user.user_metadata,
      }}
      assessments={(assessments ?? []) as AssessmentWithResult[]}
    />
  )
}
