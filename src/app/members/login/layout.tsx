import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Member sign in | Ficus Logic',
  robots: { index: false, follow: false },
}

export default function MemberLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
