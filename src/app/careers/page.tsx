import type { Metadata } from 'next'
import CareersContent from '@/components/CareersContent'

export const metadata: Metadata = {
  title: 'Careers | Ficus Logic',
  description:
    'Reset your talent priorities with us. Explore current opportunities at Ficus Logic.',
}

export default function CareersPage() {
  return <CareersContent />
}
