import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<unknown>('careers:delta')
    const typeOf = typeof raw
    let parsed: unknown = raw
    let depth = 0
    while (typeof parsed === 'string' && depth < 3) {
      try { parsed = JSON.parse(parsed); depth++ } catch { break }
    }
    const hasManualRoles = parsed && typeof parsed === 'object' && 'manualRoles' in (parsed as Record<string, unknown>)
    const count = hasManualRoles ? (parsed as { manualRoles: unknown[] }).manualRoles.length : -1
    return NextResponse.json({ typeOf, depth, hasManualRoles, count })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { action?: string }
  if (body.action !== 'fix') return NextResponse.json({ error: 'send action: fix' })
  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<unknown>('careers:delta')
    let parsed: unknown = raw
    let depth = 0
    while (typeof parsed === 'string' && depth < 5) {
      try { parsed = JSON.parse(parsed); depth++ } catch { break }
    }
    if (!parsed || typeof parsed !== 'object') {
      return NextResponse.json({ error: 'Could not parse delta', raw: typeof raw })
    }
    await kv.set('careers:delta', parsed)
    return NextResponse.json({ ok: true, depth, fixed: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
