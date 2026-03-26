import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SAM | Ficus Logic',
  description:
    "SAM is Ficus Logic's AI recruitment assistant — sourcing strategy, Boolean strings for LinkedIn and Naukri, and disciplined search methodology.",
}

export default function SamAILayout({ children }: { children: React.ReactNode }) {
  return children
}
