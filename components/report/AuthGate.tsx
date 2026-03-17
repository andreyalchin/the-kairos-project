'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { claimAssessment } from '@/app/(auth)/signup/actions'

interface Props {
  show: boolean
  sessionToken: string
  onAuthenticated: () => void
}

export function AuthGateOverlay({ show, sessionToken, onAuthenticated }: Props) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()

    if (mode === 'login') {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) { setError(authErr.message); setLoading(false); return }
    } else {
      const { data, error: authErr } = await supabase.auth.signUp({ email, password })
      if (authErr) { setError(authErr.message); setLoading(false); return }
      if (data.user && sessionToken) await claimAssessment(sessionToken, data.user.id)
    }

    onAuthenticated()
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-white/60 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text">
                {mode === 'signup' ? 'Unlock Your Full Report' : 'Welcome Back'}
              </h2>
              <p className="text-slate-500 mt-2">
                {mode === 'signup'
                  ? 'Create a free account to access your complete 11-section analysis.'
                  : 'Sign in to continue reading your report.'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none" required />
              <input type="password" placeholder={mode === 'signup' ? 'Password (min 8 chars)' : 'Password'}
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo outline-none"
                minLength={mode === 'signup' ? 8 : undefined} required />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-indigo text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-colors">
                {loading ? '…' : mode === 'signup' ? 'Unlock Full Report — Free' : 'Sign In'}
              </button>
            </form>
            <p className="text-sm text-slate-500 text-center">
              {mode === 'signup' ? (
                <>Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError('') }} className="text-indigo font-medium hover:underline">Sign in</button>
                </>
              ) : (
                <>New here?{' '}
                  <button onClick={() => { setMode('signup'); setError('') }} className="text-indigo font-medium hover:underline">Create account</button>
                </>
              )}
            </p>
            {mode === 'signup' && (
              <p className="text-xs text-slate-400 text-center">Free forever during early access. No credit card required.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
