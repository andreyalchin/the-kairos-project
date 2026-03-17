import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json()
    if (!sessionToken) return Response.json({ error: 'Missing sessionToken' }, { status: 400 })

    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) return Response.json({ error: 'Not authenticated' }, { status: 401 })

    const supabase = createServiceClient()
    await supabase
      .from('assessments')
      .update({ user_id: user.id })
      .eq('session_token', sessionToken)
      .is('user_id', null)

    return Response.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
