import Link from 'next/link'

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
        <p className="text-xs text-slate-400 mt-8">© 2026 Kairos. All rights reserved.</p>
      </div>
    </footer>
  )
}
