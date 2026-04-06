/**
 * FELIX is limited to Google accounts on the Ficus Logic workspace domain.
 * Set NEXT_PUBLIC_FELIX_WORKSPACE_DOMAIN and/or ALLOWED_GOOGLE_WORKSPACE_DOMAIN (e.g. ficuslogic.com).
 */
export function getFelixWorkspaceDomain(): string {
  return (
    process.env.NEXT_PUBLIC_FELIX_WORKSPACE_DOMAIN ??
    process.env.ALLOWED_GOOGLE_WORKSPACE_DOMAIN ??
    'ficuslogic.com'
  )
    .replace(/^@/, '')
    .toLowerCase()
}

export function isAllowedFelixEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const domain = getFelixWorkspaceDomain()
  return email.toLowerCase().endsWith(`@${domain}`)
}
