import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'

type PartialRole = {
  title?: string
  location?: string
  department?: string
  employmentType?: string
  summary?: string
  postedDate?: string
}

function extractJsonLd(html: string): PartialRole | null {
  const matches = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  for (const m of matches) {
    try {
      const data = JSON.parse(m[1]) as Record<string, unknown>
      const job = data['@type'] === 'JobPosting' ? data : null
      if (!job) continue
      const loc = job.jobLocation as Record<string, unknown> | undefined
      const addr = (loc?.address ?? loc) as Record<string, unknown> | undefined
      const locationStr = [addr?.addressLocality, addr?.addressRegion, addr?.addressCountry]
        .filter(Boolean)
        .join(', ')
      const desc = typeof job.description === 'string'
        ? job.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        : undefined
      return {
        title: typeof job.title === 'string' ? job.title : undefined,
        location: locationStr || (typeof job.jobLocation === 'string' ? job.jobLocation : undefined),
        employmentType: typeof job.employmentType === 'string' ? job.employmentType : undefined,
        summary: desc ? desc.slice(0, 800) : undefined,
        postedDate: typeof job.datePosted === 'string' ? job.datePosted.slice(0, 10) : undefined,
      }
    } catch { continue }
  }
  return null
}

function extractNextData(html: string): PartialRole | null {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) return null
  try {
    const data = JSON.parse(match[1]) as Record<string, unknown>
    const props = (data.props as Record<string, unknown>)?.pageProps as Record<string, unknown>
    if (!props) return null
    const position = (props.position ?? props.opening ?? props.job ?? props.data) as Record<string, unknown> | undefined
    if (!position || typeof position !== 'object') return null
    const title = typeof position.title === 'string' ? position.title
      : typeof position.jobTitle === 'string' ? position.jobTitle : undefined
    const loc = position.location
    const locationStr = typeof loc === 'string' ? loc
      : typeof loc === 'object' && loc !== null ? (loc as Record<string, unknown>).label as string | undefined
      : undefined
    const desc = typeof position.description === 'string' ? position.description
      : typeof position.overview === 'string' ? position.overview
      : typeof position.summary === 'string' ? position.summary : undefined
    return {
      title,
      location: locationStr,
      department: typeof position.department === 'string' ? position.department : undefined,
      employmentType: typeof position.employmentType === 'string' ? position.employmentType : undefined,
      summary: desc ? desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800) : undefined,
      postedDate: typeof position.postedDate === 'string' ? position.postedDate.slice(0, 10)
        : typeof position.createdAt === 'string' ? position.createdAt.slice(0, 10) : undefined,
    }
  } catch { return null }
}

function extractOgTags(html: string): PartialRole | null {
  const title = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1]
    ?? html.match(/<title>([^<]+)<\/title>/i)?.[1]
  const desc = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i)?.[1]
    ?? html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1]
  if (!title && !desc) return null
  return {
    title: title?.replace(/\s*[\|–\-]\s*.+$/, '').trim(),
    summary: desc,
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  if (!token || (token as { authKind?: string }).authKind !== 'member') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { url?: string }
  const url = String(body.url ?? '').trim()
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FicusLogicBot/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Career page returned ${resp.status}. Enter the job details manually.`, partial: {} },
        { status: 200 },
      )
    }

    const html = await resp.text()
    const partial: PartialRole =
      extractJsonLd(html) ?? extractNextData(html) ?? extractOgTags(html) ?? {}

    return NextResponse.json({ ok: true, partial })
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach the career page. Enter details manually. (${err instanceof Error ? err.message : 'fetch failed'})`, partial: {} },
      { status: 200 },
    )
  }
}
