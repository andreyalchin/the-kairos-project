'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/science', label: 'Science' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/enterprise', label: 'Enterprise' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open
          ? <X size={20} className="text-text" />
          : <Menu size={20} className="text-text" />
        }
      </button>

      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-bg/95 backdrop-blur-sm border-b border-slate-100 z-40 px-4 py-3 space-y-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-text hover:text-indigo hover:bg-slate-50 rounded-xl transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/assessment"
              onClick={() => setOpen(false)}
              className="block text-center bg-indigo text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
            >
              Take the Free Assessment →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
