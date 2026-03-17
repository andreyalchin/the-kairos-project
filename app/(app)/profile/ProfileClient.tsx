'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, FileText, Pencil, Check, X } from 'lucide-react'

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

type Props = {
  user: {
    id: string
    email: string
    created_at: string
    user_metadata?: { full_name?: string }
  }
  assessments: AssessmentWithResult[]
}

function getInitials(name: string | undefined, email: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }
  return email[0].toUpperCase()
}

function getTop3Dimensions(scores: Record<string, number> | undefined) {
  if (!scores) return []
  return Object.entries(scores)
    .filter(([k]) => k !== 'founder_potential')
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k, v]) => ({
      label: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      score: v,
    }))
}

function MiniRadar() {
  return (
    <svg width="56" height="56" viewBox="0 0 60 60" className="opacity-80">
      <polygon
        points="30,5 55,20 55,40 30,55 5,40 5,20"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <polygon
        points="30,13 47,23 47,37 30,47 13,37 13,23"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      <polygon
        points="30,7 50,21 49,42 30,52 10,40 12,20"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function ProfileClient({ user, assessments }: Props) {
  const supabase = createClient()

  const [displayName, setDisplayName] = useState(user.user_metadata?.full_name ?? '')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(displayName)
  const [savingName, setSavingName] = useState(false)

  const [editingEmail, setEditingEmail] = useState(false)
  const [emailInput, setEmailInput] = useState(user.email)
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')

  const [passwordMessage, setPasswordMessage] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

  const latestAssessment = assessments[0]
  const latestResult = latestAssessment?.results?.[0]
  const archetypeName = latestResult?.archetype
    ? latestResult.archetype.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : null
  const top3 = getTop3Dimensions(latestResult?.scores)
  const initials = getInitials(displayName, user.email)
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  async function saveName() {
    setSavingName(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: nameInput.trim() } })
    setSavingName(false)
    if (!error) {
      setDisplayName(nameInput.trim())
      setEditingName(false)
    }
  }

  function cancelNameEdit() {
    setNameInput(displayName)
    setEditingName(false)
  }

  async function saveEmail() {
    setSavingEmail(true)
    setEmailMessage('')
    const { error } = await supabase.auth.updateUser({ email: emailInput.trim() })
    setSavingEmail(false)
    if (!error) {
      setEmailMessage('Confirmation email sent. Check your inbox.')
      setEditingEmail(false)
    } else {
      setEmailMessage(error.message)
    }
  }

  function cancelEmailEdit() {
    setEmailInput(user.email)
    setEditingEmail(false)
    setEmailMessage('')
  }

  async function sendPasswordReset() {
    setSendingReset(true)
    setPasswordMessage('')
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    setSendingReset(false)
    setPasswordMessage(error ? error.message : 'Reset email sent. Check your inbox.')
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

        {/* ── Hero Card ── */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#3730A3] to-[#6366f1] p-6 text-white shadow-lg">

          {/* Mini radar — top right */}
          <div className="absolute top-4 right-4">
            <MiniRadar />
          </div>

          {/* Avatar + name + email */}
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white select-none">
                {initials}
              </div>
              <button
                onClick={() => { setEditingName(true); setNameInput(displayName) }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors"
                aria-label="Edit display name"
              >
                <Pencil size={11} className="text-white" />
              </button>
            </div>

            {/* Name + email + member since */}
            <div className="flex-1 min-w-0 pt-1">
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelNameEdit() }}
                    className="bg-white/20 text-white placeholder-white/50 rounded-lg px-3 py-1 text-sm font-semibold w-full max-w-[200px] outline-none border border-white/40 focus:border-white"
                    placeholder="Your name"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors disabled:opacity-50"
                    aria-label="Save name"
                  >
                    <Check size={13} className="text-white" />
                  </button>
                  <button
                    onClick={cancelNameEdit}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors"
                    aria-label="Cancel"
                  >
                    <X size={13} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-bold leading-tight truncate">
                    {displayName || user.email.split('@')[0]}
                  </p>
                  <button
                    onClick={() => { setEditingName(true); setNameInput(displayName) }}
                    className="text-xs text-white/60 hover:text-white underline underline-offset-2 transition-colors shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="text-white/70 text-sm truncate">{user.email}</p>
              <p className="text-white/50 text-xs mt-1">Member since {memberSince}</p>
            </div>
          </div>

          {/* Archetype + top 3 dims */}
          {(archetypeName || top3.length > 0) && (
            <div className="mt-5 pt-4 border-t border-white/20 space-y-3">
              {archetypeName && (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-xs uppercase tracking-wider">Latest archetype</span>
                  <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {archetypeName}
                    {latestResult?.match_score ? ` · ${latestResult.match_score}%` : ''}
                  </span>
                </div>
              )}
              {top3.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {top3.map(({ label, score }) => (
                    <span
                      key={label}
                      className="bg-white/10 border border-white/20 text-white text-xs px-2.5 py-1 rounded-full"
                    >
                      {label} <span className="opacity-70">{score}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Account Settings ── */}
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
          <div className="px-6 py-4">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Account Settings</h2>
          </div>

          {/* Display name row */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Display Name</p>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelNameEdit() }}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-text w-full max-w-[220px] outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                    placeholder="Your name"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName}
                    className="text-sm font-medium text-indigo hover:text-indigo-700 disabled:opacity-50"
                  >
                    {savingName ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={cancelNameEdit}
                    className="text-sm text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-text text-sm">{displayName || <span className="text-slate-400">Not set</span>}</p>
              )}
            </div>
            {!editingName && (
              <button
                onClick={() => { setEditingName(true); setNameInput(displayName) }}
                className="text-sm font-medium text-indigo hover:text-indigo-700 shrink-0"
              >
                Edit
              </button>
            )}
          </div>

          {/* Email row */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
              {editingEmail ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEmail(); if (e.key === 'Escape') cancelEmailEdit() }}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-text w-full max-w-[260px] outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                    />
                    <button
                      onClick={saveEmail}
                      disabled={savingEmail}
                      className="text-sm font-medium text-indigo hover:text-indigo-700 disabled:opacity-50 shrink-0"
                    >
                      {savingEmail ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEmailEdit}
                      className="text-sm text-slate-400 hover:text-slate-600 shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                  {emailMessage && (
                    <p className="text-xs text-slate-500">{emailMessage}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-text text-sm truncate">{user.email}</p>
                  {emailMessage && (
                    <p className="text-xs text-teal mt-0.5">{emailMessage}</p>
                  )}
                </div>
              )}
            </div>
            {!editingEmail && (
              <button
                onClick={() => { setEditingEmail(true); setEmailInput(user.email) }}
                className="text-sm font-medium text-indigo hover:text-indigo-700 shrink-0"
              >
                Change
              </button>
            )}
          </div>

          {/* Password row */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Password</p>
              {passwordMessage ? (
                <p className="text-xs text-teal">{passwordMessage}</p>
              ) : (
                <p className="text-text text-sm">••••••••</p>
              )}
            </div>
            <button
              onClick={sendPasswordReset}
              disabled={sendingReset}
              className="text-sm font-medium text-indigo hover:text-indigo-700 disabled:opacity-50 shrink-0"
            >
              {sendingReset ? 'Sending…' : 'Change'}
            </button>
          </div>

          {/* Member since row */}
          <div className="px-6 py-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Member Since</p>
            <p className="text-text text-sm">{memberSince}</p>
          </div>
        </div>

        {/* ── Assessment History ── */}
        <div className="bg-white rounded-2xl border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Assessment History</h2>
          </div>

          {assessments.length === 0 ? (
            <div className="px-6 py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto">
                <FileText size={20} className="text-indigo" />
              </div>
              <p className="text-slate-500 text-sm">No assessments yet.</p>
              <Link
                href="/assessment"
                className="inline-block text-sm font-medium text-indigo hover:text-indigo-700 underline underline-offset-2"
              >
                Take your first assessment
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {assessments.map((a, i) => {
                const result = a.results?.[0]
                const name = result?.archetype
                  ? result.archetype.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                  : 'Assessment'
                const date = new Date(a.completed_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
                return (
                  <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-indigo" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-text text-sm capitalize">{name}</p>
                          {i === 0 && (
                            <span className="text-xs bg-indigo/10 text-indigo px-2 py-0.5 rounded-full font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {result?.match_score ? `${result.match_score}% match · ` : ''}
                          {date}
                        </p>
                      </div>
                    </div>
                    {result?.id ? (
                      <Link
                        href={`/results/${result.id}`}
                        className="flex items-center gap-1 text-indigo text-sm font-medium hover:underline shrink-0"
                      >
                        View Full Report <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <span className="text-slate-300 text-sm shrink-0">No report</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
