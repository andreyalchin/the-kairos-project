'use server'
import { createServiceClient } from '@/lib/supabase/server'

export async function claimAssessment(sessionToken: string, userId: string) {
  if (!sessionToken || !userId) return
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from('assessments')
    .update({ user_id: userId })
    .eq('session_token', sessionToken)
    .is('user_id', null)  // prevent claiming others' assessments
  if (error) console.error('[claimAssessment] failed:', error.message)
}
