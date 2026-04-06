import type { Metadata } from 'next'
import CareersContent from '@/components/CareersContent'
import { fetchHireboundCareerOpenings } from '@/lib/hirebound-careers'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Careers | Ficus Logic',
  description:
    'Reset your talent priorities with us. Explore current opportunities at Ficus Logic.',
}

export default async function CareersPage() {
  const openings = await fetchHireboundCareerOpenings()
  return <CareersContent openings={openings} />
}
