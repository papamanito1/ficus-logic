import { NextResponse } from 'next/server'
import { getMergedPublishedPosts } from '@/lib/insights-merge'

export const revalidate = 60

export async function GET() {
  const posts = await getMergedPublishedPosts()
  return NextResponse.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
