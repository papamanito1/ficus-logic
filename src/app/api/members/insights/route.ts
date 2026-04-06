import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { BlogPost } from '@/data/insights'
import { isMemberDashboardSession } from '@/lib/member-session'
import {
  deleteInsightSlug,
  getMergedAllPosts,
  isKvConfigured,
  upsertInsight,
} from '@/lib/insights-merge'

function parseBlogPost(raw: unknown): BlogPost {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid body')
  const o = raw as Record<string, unknown>
  const slug = String(o.slug ?? '').trim()
  const title = String(o.title ?? '').trim()
  const excerpt = String(o.excerpt ?? '').trim()
  const content = String(o.content ?? '').trim()
  const category = String(o.category ?? '').trim()
  const author = String(o.author ?? 'Ficus Logic').trim()
  const publishedDate = String(o.publishedDate ?? '').trim()
  const readTime = String(o.readTime ?? '5 min read').trim()
  const featured = Boolean(o.featured)
  const imageUrl = String(o.imageUrl ?? '').trim()
  const tags = Array.isArray(o.tags)
    ? o.tags.map((t) => String(t).trim()).filter(Boolean)
    : typeof o.tags === 'string'
      ? o.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []
  if (!slug || !title || !content) throw new Error('slug, title, and content are required')
  return {
    slug,
    title,
    excerpt: excerpt || title,
    content,
    category: category || 'Insights',
    tags,
    author,
    publishedDate: publishedDate || new Date().toISOString().slice(0, 10),
    readTime,
    featured,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isMemberDashboardSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const posts = await getMergedAllPosts()
  return NextResponse.json({ posts, kvConfigured: isKvConfigured() })
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
    const body = (await req.json()) as { action?: string; slug?: string; post?: unknown }
    if (body.action === 'delete') {
      const slug = String(body.slug ?? '').trim()
      if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
      await deleteInsightSlug(slug)
      revalidatePath('/insights')
      revalidatePath(`/insights/${slug}`)
      revalidatePath('/')
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'upsert') {
      const post = parseBlogPost(body.post)
      await upsertInsight(post)
      revalidatePath('/insights')
      revalidatePath(`/insights/${post.slug}`)
      revalidatePath('/')
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
