import type { ReactNode } from 'react'

/** Ensures member routes are not over-pruned on serverless; keeps login reachable after deploy. */
export const dynamic = 'force-dynamic'

export default function MembersLayout({ children }: { children: ReactNode }) {
  return children
}
