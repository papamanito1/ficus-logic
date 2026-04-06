import type { HireboundCareerOpening } from '@/lib/hirebound-careers'
import { fetchHireboundOpeningById } from '@/lib/hirebound-careers'

const CAREER_PAGE_HOST = /^(?:www\.)?careerpage\.hirebound\.io$/i

/** Shown on ficuslogic.com careers for roles imported from a Hirebound career page link. */
export const FICUS_CAREERS_DEPARTMENT = 'Ficus Logic'

const BRAND_SUMMARY_PREFIX =
  'Listed on Ficus e-Logic careers. Apply via the Hirebound link below for the full role details.\n\n'

export type ParsedCareerPageUrl = {
  orgSlug: string
  positionId: string
  canonicalUrl: string
}

export function parseHireboundCareerPageUrl(input: string): ParsedCareerPageUrl | null {
  const raw = input.trim()
  if (!raw) return null
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  const host = u.hostname
  if (!CAREER_PAGE_HOST.test(host)) return null
  const match = u.pathname.replace(/\/+$/, '').match(/^\/org\/([^/]+)\/position\/([^/?#]+)$/i)
  if (!match) return null
  const orgSlug = match[1].trim()
  const positionId = match[2].trim()
  if (!orgSlug || !positionId) return null
  const canonicalUrl = `https://careerpage.hirebound.io/org/${encodeURIComponent(
    orgSlug,
  )}/position/${encodeURIComponent(positionId)}/`
  return { orgSlug, positionId, canonicalUrl }
}

function applyFicusBranding(
  base: HireboundCareerOpening,
  canonicalUrl: string,
  positionId: string,
): HireboundCareerOpening {
  const summaryBody = base.summary?.trim() ?? ''
  const summary = summaryBody
    ? `${BRAND_SUMMARY_PREFIX}${summaryBody}`
    : `${BRAND_SUMMARY_PREFIX}Open position at Ficus e-Logic.`

  return {
    ...base,
    id: positionId,
    department: FICUS_CAREERS_DEPARTMENT,
    externalUrl: canonicalUrl,
    summary,
  }
}

function findInFeed(
  positionId: string,
  feed: HireboundCareerOpening[],
): HireboundCareerOpening | null {
  const direct = feed.find((o) => o.id === positionId)
  if (direct) return direct
  return (
    feed.find(
      (o) =>
        o.externalUrl.includes(positionId) ||
        o.externalUrl.includes(encodeURIComponent(positionId)),
    ) ?? null
  )
}

/**
 * Build a manual careers entry from a Hirebound career-page URL.
 * Resolves title/location/etc. from the live feed, then Hirebound API (if token set), else placeholders.
 */
export async function buildOpeningFromCareerPageUrl(
  inputUrl: string,
  feedOpenings: HireboundCareerOpening[],
): Promise<HireboundCareerOpening> {
  const parsed = parseHireboundCareerPageUrl(inputUrl)
  if (!parsed) {
    throw new Error(
      'Invalid URL. Use a Hirebound career page link like https://careerpage.hirebound.io/org/your-org/position/{id}/',
    )
  }

  const { positionId, canonicalUrl } = parsed

  const fromFeed = findInFeed(positionId, feedOpenings)
  if (fromFeed) {
    return applyFicusBranding(fromFeed, canonicalUrl, positionId)
  }

  const fromApi = await fetchHireboundOpeningById(positionId)
  if (fromApi) {
    return applyFicusBranding(fromApi, canonicalUrl, positionId)
  }

  const today = new Date().toISOString().slice(0, 10)
  return {
    id: positionId,
    title: 'Open position — click to view & apply',
    location: 'View on Hirebound',
    department: FICUS_CAREERS_DEPARTMENT,
    employmentType: 'Full-time',
    postedDate: today,
    summary: `${BRAND_SUMMARY_PREFIX}Click the link to view the full job description and apply via our Hirebound careers page.`,
    externalUrl: canonicalUrl,
  }
}
