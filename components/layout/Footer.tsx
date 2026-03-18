import Link from 'next/link'
import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-bg py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-bold text-indigo text-lg">Kairos</p>
            <p className="text-slate-500 text-sm mt-1">Know your moment.</p>
          </div>
          <div className="flex gap-12 text-sm text-slate-600">
            <div className="space-y-2">
              <p className="font-medium text-text">Product</p>
              <Link href="/assessment" className="block hover:text-indigo">Assessment</Link>
              <Link href="/pricing" className="block hover:text-indigo">Pricing</Link>
              <Link href="/science" className="block hover:text-indigo">Science</Link>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-text">Company</p>
              <Link href="/enterprise" className="block hover:text-indigo">Enterprise</Link>
            </div>
          </div>
        </div>

        {/* HR / Hiring Manager contact strip */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text">HR &amp; Talent Teams</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Interested in using Kairos for hiring or team assessment? Reach out directly.
            </p>
          </div>
          <Link
            href="mailto:andrey.alchin@gmail.com?subject=HR%20%2F%20Talent%20inquiry%20—%20Kairos"
            className="inline-flex items-center gap-2 bg-indigo text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-colors whitespace-nowrap"
          >
            <Mail size={15} />
            Get in touch
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-8">© 2026 Kairos. All rights reserved.</p>
      </div>
    </footer>
  )
}
