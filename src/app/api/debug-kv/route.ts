import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<unknown>('careers:delta')
    const typeOf = typeof raw
    const isStr = typeof raw === 'string'
    let parsed: unknown = raw
    if (isStr) {
      try { parsed = JSON.parse(raw as string) } catch { parsed = 'PARSE_FAILED' }
    }
    const pType = typeof parsed
    const hasManualRoles = parsed && typeof parsed === 'object' && 'manualRoles' in (parsed as Record<string, unknown>)
    const count = hasManualRoles ? (parsed as { manualRoles: unknown[] }).manualRoles.length : -1
    return NextResponse.json({ typeOf, isStr, pType, hasManualRoles, count, sample: JSON.stringify(raw).slice(0, 200) })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
