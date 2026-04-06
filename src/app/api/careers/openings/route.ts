import { NextResponse } from 'next/server'
import { fetchHireboundCareerOpenings } from '@/lib/hirebound-careers'

export const revalidate = 300

export async function GET() {
  const openings = await fetchHireboundCareerOpenings()
  return NextResponse.json(openings, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
