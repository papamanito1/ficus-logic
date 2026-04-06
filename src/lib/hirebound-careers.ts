/**
 * Hirebound career listings for /careers.
 *
 * Configure in Vercel / .env (never commit tokens):
 * - HIREBOUND_BEARER_TOKEN — API token (Bearer) from Hirebound / your admin
 * - HIREBOUND_API_BASE — default https://inapiprod.hirebound.io
 * - HIREBOUND_TENANT — default hb (from /hb/openings)
 *
 * Optional override (skips Hirebound API):
 * - HIREBOUND_OPENINGS_JSON_URL — HTTPS URL returning JSON array or { data: [...] }
 * - HIREBOUND_OPENING_BY_ID_PATH — optional, e.g. /hb/openings/{id} (default tries common paths)
 *
 * Public URL template for “View role” / Apply (browser):
 * - NEXT_PUBLIC_HIREBOUND_JOB_URL_TEMPLATE — must include {id}; default
 *   https://in.app.hirebound.io/hb/openings/{id}
 */

export interface HireboundCareerOpening {
  id: string
  title: string
  location: string
  department: string
  employmentType: string
  postedDate: string
  summary: string
  externalUrl: string
}

function getJobUrlTemplate(): string {
  return (
    process.env.NEXT_PUBLIC_HIREBOUND_JOB_URL_TEMPLATE ??
    'https://in.app.hirebound.io/hb/openings/{id}'
  )
}

function externalUrlForOpening(id: string): string {
  return getJobUrlTemplate().replace(/\{id\}/g, id)
}

function pickString(...vals: (unknown)[]): string {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

function pickId(raw: Record<string, unknown>): string {
  const id = raw._id ?? raw.id ?? raw.openingId
  return typeof id === 'string' ? id : String(id ?? '')
}

function normalizeOpening(raw: Record<string, unknown>): HireboundCareerOpening | null {
  const id = pickId(raw)
  if (!id) return null

  const title = pickString(raw.title, raw.jobTitle, raw.name, raw.roleTitle)
  if (!title) return null

  const status = pickString(raw.status, raw.state, raw.openingStatus, 'active').toLowerCase()
  if (['closed', 'archived', 'draft', 'inactive', 'filled'].includes(status)) return null

  let loc = pickString(raw.location, raw.workLocation, raw.city)
  if (!loc && raw.location && typeof raw.location === 'object') {
    const l = raw.location as { label?: string; name?: string }
    loc = pickString(l.label, l.name)
  }

  const department = pickString(raw.department, raw.team, raw.function, raw.vertical, 'General')

  const employmentType = pickString(
    raw.employmentType,
    raw.jobType,
    raw.type,
    'Full-time',
  )

  const postedRaw = pickString(
    raw.postedDate,
    raw.createdAt,
    raw.publishedAt,
    raw.updatedAt,
  )
  const postedDate = postedRaw ? postedRaw.slice(0, 10) : new Date().toISOString().slice(0, 10)

  const summary = pickString(
    raw.overview,
    raw.description,
    raw.summary,
    raw.jdSummary,
    '',
  )

  const external =
    pickString(raw.externalUrl, raw.applyUrl, raw.careerPageUrl) || externalUrlForOpening(id)

  return {
    id,
    title,
    location: loc || 'Location TBC',
    department,
    employmentType,
    postedDate,
    summary,
    externalUrl: external,
  }
}

function extractArray(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[]
  if (payload && typeof payload === 'object') {
    const o = payload as Record<string, unknown>
    const data = o.data ?? o.openings ?? o.results ?? o.items
    if (Array.isArray(data)) return data as Record<string, unknown>[]
  }
  return []
}

async function fetchJsonFromUrl(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    next: { revalidate: 300 },
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`Hirebound JSON fetch failed: ${res.status}`)
  }
  return res.json()
}

async function fetchFromConfiguredJsonUrl(): Promise<HireboundCareerOpening[] | null> {
  const url = process.env.HIREBOUND_OPENINGS_JSON_URL?.trim()
  if (!url) return null
  const json = await fetchJsonFromUrl(url)
  return extractArray(json)
    .map((row) => normalizeOpening(row))
    .filter((x): x is HireboundCareerOpening => x !== null)
}

async function fetchFromHireboundApi(): Promise<HireboundCareerOpening[]> {
  const token = process.env.HIREBOUND_BEARER_TOKEN?.trim()
  if (!token) return []

  const base = (process.env.HIREBOUND_API_BASE ?? 'https://inapiprod.hirebound.io').replace(/\/$/, '')
  const tenant = (process.env.HIREBOUND_TENANT ?? 'hb').replace(/^\//, '').replace(/\/$/, '')

  const path = process.env.HIREBOUND_OPENINGS_PATH?.trim() || `/${tenant}/openings`
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`

  const json = await fetchJsonFromUrl(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      tenantid: tenant,
    },
  })

  return extractArray(json)
    .map((row) => normalizeOpening(row))
    .filter((x): x is HireboundCareerOpening => x !== null)
}

function unwrapOpeningPayload(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object') return null
  const o = json as Record<string, unknown>
  const data = o.data
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>
  }
  if (typeof o._id === 'string' || typeof o.id === 'string' || typeof o.title === 'string') {
    return o
  }
  return null
}

/**
 * Fetch a single opening by id when HIREBOUND_BEARER_TOKEN is set.
 * Tries common REST paths; returns null if not found or unauthenticated.
 */
export async function fetchHireboundOpeningById(id: string): Promise<HireboundCareerOpening | null> {
  const token = process.env.HIREBOUND_BEARER_TOKEN?.trim()
  if (!token || !id.trim()) return null

  const base = (process.env.HIREBOUND_API_BASE ?? 'https://inapiprod.hirebound.io').replace(/\/$/, '')
  const tenant = (process.env.HIREBOUND_TENANT ?? 'hb').replace(/^\//, '').replace(/\/$/, '')
  const enc = encodeURIComponent(id.trim())

  const paths = [
    process.env.HIREBOUND_OPENING_BY_ID_PATH?.trim()?.replace(/\{id\}/g, id.trim()),
    `/${tenant}/openings/${enc}`,
    `/${tenant}/opening/${enc}`,
  ].filter(Boolean) as string[]

  for (const path of paths) {
    const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          tenantid: tenant,
          Accept: 'application/json',
        },
        next: { revalidate: 0 },
      })
      if (!res.ok) continue
      const json: unknown = await res.json()
      const row = unwrapOpeningPayload(json)
      if (row) {
        const opening = normalizeOpening(row)
        if (opening && opening.id === id.trim()) return opening
        if (opening && pickId(row) === id.trim()) return opening
        if (opening) return { ...opening, id: id.trim() }
      }
    } catch {
      continue
    }
  }
  return null
}

/** Raw feed from Hirebound API or JSON URL (no member dashboard merge). */
export async function fetchHireboundSourceOpenings(): Promise<HireboundCareerOpening[]> {
  try {
    const fromJson = await fetchFromConfiguredJsonUrl()
    if (fromJson !== null) return sortByPostedDate(fromJson)

    const fromApi = await fetchFromHireboundApi()
    return sortByPostedDate(fromApi)
  } catch {
    return []
  }
}

/** Public careers list: Hirebound/JSON feed plus member dashboard overrides. */
export async function fetchHireboundCareerOpenings(): Promise<HireboundCareerOpening[]> {
  const { loadCareersDelta, mergeCareerOpenings } = await import('@/lib/careers-merge')
  const base = await fetchHireboundSourceOpenings()
  const delta = await loadCareersDelta()
  return mergeCareerOpenings(base, delta)
}

function sortByPostedDate(openings: HireboundCareerOpening[]): HireboundCareerOpening[] {
  return [...openings].sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
  )
}

export function hireboundListingsPublicUrl(): string {
  return process.env.NEXT_PUBLIC_HIREBOUND_LISTINGS_URL ?? 'https://in.app.hirebound.io/hb/openings'
}
