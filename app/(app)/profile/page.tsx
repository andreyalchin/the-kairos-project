import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-text">Your Profile</h1>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
          <div><p className="text-xs text-slate-500 uppercase tracking-wider">Email</p><p className="text-text">{user.email}</p></div>
          <div><p className="text-xs text-slate-500 uppercase tracking-wider">Member since</p><p className="text-text">{new Date(user.created_at).toLocaleDateString()}</p></div>
        </div>
      </div>
    </div>
  )
}
