'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { claimAssessment } from './actions'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [name, setName] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authErr } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    const sessionToken = localStorage.getItem('kairos_session') ?? ''
    if (data.user && sessionToken) await claimAssessment(sessionToken, data.user.id)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Create your account</h1>
          <p className="text-slate-500 mt-1">Free forever during early access</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-4">
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" required />
          <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" minLength={8} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-colors">
            {loading ? 'Creating account…' : 'Create Account — Free'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
