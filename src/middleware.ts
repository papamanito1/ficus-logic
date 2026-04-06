import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { isAllowedFelixEmail } from '@/lib/felix-access'

/** Public FELIX marketing page; chat and all other /somika-ai/* routes need workspace login. */
function isPublicFelixPath(pathname: string): boolean {
  if (pathname === '/somika-ai/login') return true
  if (pathname === '/somika-ai' || pathname === '/somika-ai/') return true
  return false
}

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        if (isPublicFelixPath(path)) return true
        const email = token?.email as string | undefined
        if (!email || !isAllowedFelixEmail(email)) return false
        return true
      },
    },
    pages: {
      signIn: '/somika-ai/login',
    },
  }
)

export const config = {
  matcher: ['/somika-ai', '/somika-ai/:path*'],
}
