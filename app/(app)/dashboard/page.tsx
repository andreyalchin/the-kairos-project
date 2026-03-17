import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: assessments } = await supabase
    .from('assessments')
    .select('id, completed_at, results(id, archetype, match_score)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Your Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user.email}</p>
        </div>
        {!assessments?.length ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-slate-500">You haven&apos;t taken an assessment yet.</p>
            <Link href="/assessment" className="bg-indigo text-white px-6 py-3 rounded-xl font-semibold inline-block hover:bg-indigo-600">
              Take Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {(assessments as { id: string; completed_at: string; results?: { id: string; archetype?: string; match_score?: number }[] }[]).map((a) => (
              <div key={a.id} className="bg-white rounded-2xl p-6 border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-text capitalize">{a.results?.[0]?.archetype?.replace(/_/g,' ') ?? 'Assessment'}</p>
                  <p className="text-slate-500 text-sm">{a.results?.[0]?.match_score}% match · {new Date(a.completed_at).toLocaleDateString()}</p>
                </div>
                <Link href={`/results/${a.results?.[0]?.id}`} className="text-indigo text-sm hover:underline">View Report →</Link>
              </div>
            ))}
          </div>
        )}
        <div className="text-center">
          <Link href="/assessment" className="text-sm text-indigo hover:underline">Retake Assessment</Link>
        </div>
      </div>
    </div>
  )
}
