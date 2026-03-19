import Link from 'next/link'
import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1L17 9L9 17L1 9Z" stroke="#6366f1" strokeWidth="1.5"/>
                <circle cx="9" cy="9" r="2" fill="#6366f1"/>
              </svg>
              <p className="font-bold text-white text-lg">Kairos</p>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[180px]">
              Know your moment. Evidence-based human potential intelligence.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Product</p>
            <div className="space-y-3.5 text-sm text-slate-400">
              <Link href="/assessment" className="block hover:text-white transition-colors">Assessment</Link>
              <Link href="/results/demo" className="block hover:text-white transition-colors">Sample Report</Link>
              <Link href="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Company</p>
            <div className="space-y-3.5 text-sm text-slate-400">
              <Link href="/science" className="block hover:text-white transition-colors">Science</Link>
              <Link href="/enterprise" className="block hover:text-white transition-colors">Enterprise</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Enterprise</p>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              HR &amp; talent teams — reach out for enterprise access.
            </p>
            <Link
              href="mailto:andrey.alchin@gmail.com?subject=HR%20%2F%20Talent%20inquiry%20—%20Kairos"
              className="inline-flex items-center gap-2 bg-indigo text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Mail size={13} />
              Get in touch
            </Link>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 Kairos. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" aria-hidden="true" />
            <p className="text-xs text-slate-500">Built on Big Five · HEXACO · Adaptive IRT</p>
          </div>
        </div>

      </div>
    </footer>
  )
}
