import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

export const metadata: Metadata = {
  title: 'Kairos — Know your moment.',
  description: 'Discover your Human Potential Intelligence Profile. 29 dimensions, 32 archetypes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
