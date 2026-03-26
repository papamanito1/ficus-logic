import type { Metadata } from 'next'
import CareersContent from '@/components/CareersContent'

export const metadata: Metadata = {
  title: 'Careers | Ficus Logic',
  description:
    'Build your career in executive search. Explore open roles at Ficus Logic.',
}

export default function CareersPage() {
  return <CareersContent />
}
