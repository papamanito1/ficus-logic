import type { Session } from 'next-auth'

export function isMemberDashboardSession(session: Session | null): boolean {
  return session?.authKind === 'member'
}
