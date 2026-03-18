import Link from 'next/link'
import { UserNav } from './UserNav'

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 1L17 9L9 17L1 9Z" stroke="#3730A3" strokeWidth="1.5"/>
            <circle cx="9" cy="9" r="2" fill="#3730A3"/>
          </svg>
          <div>
            <p className="text-xl font-bold text-indigo leading-none">Kairos</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">Human Potential Intelligence</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-text">
          <Link href="/" className="hover:text-indigo transition-colors">Home</Link>
          <Link href="/science" className="hover:text-indigo transition-colors">Science</Link>
          <Link href="/pricing" className="hover:text-indigo transition-colors">Pricing</Link>
          <Link href="/enterprise" className="hover:text-indigo transition-colors">Enterprise</Link>
        </nav>
        <div className="flex items-center gap-3">
          <UserNav />
        </div>
      </div>
    </header>
  )
}
