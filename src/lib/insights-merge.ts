import type { BlogPost } from '@/data/insights'
import { blogPosts } from '@/data/insights'

const KV_KEY = 'insights:delta'

export type InsightsDelta = {
  /** Static `blogPosts` slugs hidden from the public site */
  deletedSlugs: string[]
  /** New or overridden posts (replace static entry by slug) */
  upserts: BlogPost[]
}

const emptyDelta = (): InsightsDelta => ({ deletedSlugs: [], upserts: [] })

export async function loadDelta(): Promise<InsightsDelta> {
  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<string>(KV_KEY)
    if (!raw || typeof raw !== 'string') return emptyDelta()
    const parsed = JSON.parse(raw) as Partial<InsightsDelta>
    return {
      deletedSlugs: Array.isArray(parsed.deletedSlugs) ? parsed.deletedSlugs : [],
      upserts: Array.isArray(parsed.upserts) ? parsed.upserts : [],
    }
  } catch {
    return emptyDelta()
  }
}

export async function saveDelta(delta: InsightsDelta): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(KV_KEY, JSON.stringify(delta))
}

function mergePosts(delta: InsightsDelta): BlogPost[] {
  const deleted = new Set(delta.deletedSlugs)
  const fromStatic = blogPosts.filter((p) => !deleted.has(p.slug))
  const bySlug = new Map<string, BlogPost>()
  for (const p of fromStatic) {
    bySlug.set(p.slug, p)
  }
  for (const p of delta.upserts) {
    bySlug.set(p.slug, p)
  }
  return Array.from(bySlug.values())
}

export async function getMergedAllPosts(): Promise<BlogPost[]> {
  const delta = await loadDelta()
  return mergePosts(delta)
}

export async function getMergedPublishedPosts(): Promise<BlogPost[]> {
  const all = await getMergedAllPosts()
  const now = new Date()
  return all
    .filter((p) => new Date(p.publishedDate) <= now)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
}

export async function getMergedFeaturedPosts(): Promise<BlogPost[]> {
  const published = await getMergedPublishedPosts()
  return published.filter((p) => p.featured)
}

export async function getMergedPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const published = await getMergedPublishedPosts()
  return published.find((p) => p.slug === slug)
}

export async function getMergedCategories(): Promise<string[]> {
  const all = await getMergedAllPosts()
  return [...new Set(all.map((p) => p.category))]
}

export function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function assertValidSlug(slug: string): void {
  if (!slug || !slugPattern.test(slug)) {
    throw new Error('Invalid slug: use lowercase letters, numbers, and hyphens only.')
  }
}

export async function deleteInsightSlug(slug: string): Promise<void> {
  assertValidSlug(slug)
  const delta = await loadDelta()
  const staticSlugs = new Set(blogPosts.map((p) => p.slug))
  if (staticSlugs.has(slug)) {
    if (!delta.deletedSlugs.includes(slug)) delta.deletedSlugs.push(slug)
  }
  delta.upserts = delta.upserts.filter((p) => p.slug !== slug)
  await saveDelta(delta)
}

export async function upsertInsight(post: BlogPost): Promise<void> {
  assertValidSlug(post.slug)
  const delta = await loadDelta()
  delta.deletedSlugs = delta.deletedSlugs.filter((s) => s !== post.slug)
  delta.upserts = delta.upserts.filter((p) => p.slug !== post.slug)
  delta.upserts.push(post)
  await saveDelta(delta)
}
