import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<unknown>('careers:delta')
    const typeOf = typeof raw
    const isNull = raw === null
    const first200 = typeof raw === 'string' ? raw.slice(0, 200) : JSON.stringify(raw)?.slice(0, 200)
    let parsed: unknown = raw
    let depth = 0
    let parseError: string | null = null
    while (typeof parsed === 'string' && depth < 5) {
      try { parsed = JSON.parse(parsed); depth++ } catch (e) { parseError = String(e); break }
    }
    const hasManualRoles = parsed && typeof parsed === 'object' && !Array.isArray(parsed) && 'manualRoles' in (parsed as Record<string, unknown>)
    const count = hasManualRoles ? ((parsed as { manualRoles: unknown[] }).manualRoles?.length ?? -1) : -1
    return NextResponse.json({ typeOf, isNull, depth, hasManualRoles, count, parseError, first200 })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { action?: string; delta?: unknown }
  if (body.action === 'write' && body.delta) {
    const { kv } = await import('@vercel/kv')
    await kv.set('careers:delta', body.delta)
    return NextResponse.json({ ok: true, wrote: true })
  }
  if (body.action === 'fix') {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<unknown>('careers:delta')
    let parsed: unknown = raw
    let depth = 0
    while (typeof parsed === 'string' && depth < 5) {
      try { parsed = JSON.parse(parsed); depth++ } catch { break }
    }
    if (!parsed || typeof parsed !== 'object') {
      return NextResponse.json({ error: 'Could not unwrap', typeGot: typeof parsed, depth })
    }
    await kv.set('careers:delta', parsed)
    return NextResponse.json({ ok: true, depth, fixed: true })
  }
  return NextResponse.json({ error: 'send action: fix or write' })
}
