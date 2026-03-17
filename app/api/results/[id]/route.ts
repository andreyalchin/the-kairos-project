import { getResult } from '@/lib/getResult'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getResult(params.id)
    if (!result) return Response.json({ error: 'Not found' }, { status: 404 })

    return Response.json(result, {
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: msg }, { status: 500 })
  }
}
