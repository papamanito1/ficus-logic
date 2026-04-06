import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { HireboundCareerOpening } from '@/lib/hirebound-careers'
import { fetchHireboundSourceOpenings } from '@/lib/hirebound-careers'
import { isMemberDashboardSession } from '@/lib/member-session'
import { isKvConfigured } from '@/lib/insights-merge'
import {
  hideCareerOpeningId,
  loadCareersDelta,
  mergeCareerOpenings,
  removeManualCareerRole,
  unhideCareerOpeningId,
  upsertManualCareerRole,
} from '@/lib/careers-merge'
import { buildOpeningFromCareerPageUrl } from '@/lib/hirebound-career-page-url'

function parseRole(raw: unknown): HireboundCareerOpening {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid role')
  const o = raw as Record<string, unknown>
  const id = String(o.id ?? '').trim()
  const title = String(o.title ?? '').trim()
  if (!id || !title) throw new Error('id and title required')
  return {
    id,
    title,
    location: String(o.location ?? 'Location TBC').trim(),
    department: String(o.department ?? 'General').trim(),
    employmentType: String(o.employmentType ?? 'Full-time').trim(),
    postedDate: String(o.postedDate ?? new Date().toISOString().slice(0, 10)).trim(),
    summary: String(o.summary ?? '').trim(),
    externalUrl: String(
      o.externalUrl ?? 'https://in.app.hirebound.io/hb/openings',
    ).trim(),
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isMemberDashboardSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const base = await fetchHireboundSourceOpenings()
  const delta = await loadCareersDelta()
  const merged = mergeCareerOpenings(base, delta)
  return NextResponse.json({
    base,
    delta,
    merged,
    kvConfigured: isKvConfigured(),
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!isMemberDashboardSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: 'Vercel KV is not configured (KV_REST_API_URL / KV_REST_API_TOKEN).' },
      { status: 503 },
    )
  }

  try {
    const body = (await req.json()) as {
      action?: string
      id?: string
      role?: unknown
      careerPageUrl?: string
    }
    if (body.action === 'hide') {
      const id = String(body.id ?? '').trim()
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
      await hideCareerOpeningId(id)
      revalidatePath('/careers')
      revalidatePath('/')
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'unhide') {
      const id = String(body.id ?? '').trim()
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
      await unhideCareerOpeningId(id)
      revalidatePath('/careers')
      revalidatePath('/')
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'upsertManual') {
      const role = parseRole(body.role)
      await upsertManualCareerRole(role)
      revalidatePath('/careers')
      revalidatePath('/')
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'importCareerPageUrl') {
      const url = String(body.careerPageUrl ?? '').trim()
      if (!url) return NextResponse.json({ error: 'careerPageUrl required' }, { status: 400 })
      const base = await fetchHireboundSourceOpenings()
      const role = await buildOpeningFromCareerPageUrl(url, base)
      await upsertManualCareerRole(role)
      revalidatePath('/careers')
      revalidatePath('/')
      return NextResponse.json({ ok: true, role })
    }
    if (body.action === 'removeManual') {
      const id = String(body.id ?? '').trim()
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
      await removeManualCareerRole(id)
      revalidatePath('/careers')
      revalidatePath('/')
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
