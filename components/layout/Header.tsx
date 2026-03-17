import Link from 'next/link'
import { UserNav } from './UserNav'

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo">Kairos</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-text">
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
