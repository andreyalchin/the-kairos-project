'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function UserNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return (
      <>
        <Link href="/login" className="text-sm text-slate-600 hover:text-indigo whitespace-nowrap">Log in</Link>
        <Link href="/assessment" className="text-sm bg-indigo text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium whitespace-nowrap">
          <span className="sm:hidden">Take Test</span>
          <span className="hidden sm:inline">Take Assessment</span>
        </Link>
      </>
    )
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'KA'

  return (
    <div ref={ref} className="relative flex items-center gap-3">
      <Link href="/assessment" className="text-sm bg-indigo text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium hidden md:inline-block">
        New Assessment
      </Link>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-indigo text-white text-xs font-bold flex items-center justify-center">
          {initials}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard size={15} className="text-indigo" />
            My Reports
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-slate-50 transition-colors"
          >
            <User size={15} className="text-indigo" />
            Profile
          </Link>
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
