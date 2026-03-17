import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const rateLimitStore = new Map<string, { ts: number; count: number }>()

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )
  await supabase.auth.getUser()

  if (request.nextUrl.pathname === '/api/assessment/start') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    const key = `rl:${ip}`
    const now = Date.now()
    const window = 60 * 60 * 1000
    const entry = rateLimitStore.get(key)
    if (entry && entry.count >= 5 && now - entry.ts < window) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
    rateLimitStore.set(key, entry && now - entry.ts < window
      ? { ts: entry.ts, count: entry.count + 1 }
      : { ts: now, count: 1 })
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
