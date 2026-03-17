import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use service client so RLS on results doesn't silently block the join
  const serviceClient = createServiceClient()
  const { data: assessments } = await serviceClient
    .from('assessments')
    .select('id, completed_at, results(id, archetype, match_score)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  type Assessment = {
    id: string
    completed_at: string
    results?: { id: string; archetype?: string; match_score?: number }[]
  }

  const list = (assessments ?? []) as Assessment[]

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">My Reports</h1>
            <p className="text-slate-500 mt-1">{user.email}</p>
          </div>
          <Link
            href="/assessment"
            className="flex items-center gap-2 bg-indigo text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
          >
            <Plus size={15} />
            New Assessment
          </Link>
        </div>

        {/* Reports list */}
        {list.length === 0 ? (
          <div className="text-center py-20 space-y-5 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto">
              <FileText size={28} className="text-indigo" />
            </div>
            <div>
              <p className="font-semibold text-text">No assessments yet</p>
              <p className="text-slate-400 text-sm mt-1">Take the assessment to get your full Human Potential profile.</p>
            </div>
            <Link href="/assessment" className="inline-block bg-indigo text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors">
              Take Assessment
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((a, i) => {
              const result = a.results?.[0]
              const archetypeName = result?.archetype?.replace(/_/g, ' ') ?? 'Assessment'
              const date = new Date(a.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              return (
                <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between hover:border-indigo/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-indigo" />
                    </div>
                    <div>
                      <p className="font-semibold text-text capitalize">{archetypeName}</p>
                      <p className="text-slate-400 text-sm">
                        {result?.match_score ? `${result.match_score}% match · ` : ''}{date}
                        {i === 0 && <span className="ml-2 text-xs bg-indigo/10 text-indigo px-2 py-0.5 rounded-full font-medium">Latest</span>}
                      </p>
                    </div>
                  </div>
                  {result?.id ? (
                    <Link
                      href={`/results/${result.id}`}
                      className="flex items-center gap-1.5 text-indigo text-sm font-medium hover:underline shrink-0"
                    >
                      View Report <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="text-slate-300 text-sm">No report</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
