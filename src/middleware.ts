import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { isAllowedFelixEmail } from '@/lib/felix-access'

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        if (path === '/somika-ai/login') return true
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
