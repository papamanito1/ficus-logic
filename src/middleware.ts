import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAllowedFelixEmail } from '@/lib/felix-access'

function isPublicFelixPath(pathname: string): boolean {
  if (pathname === '/somika-ai/login') return true
  if (pathname === '/somika-ai' || pathname === '/somika-ai/') return true
  return false
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (path.startsWith('/members')) {
    if (path === '/members/login') {
      return NextResponse.next()
    }
    if (token?.authKind !== 'member') {
      const u = new URL('/members/login', req.url)
      u.searchParams.set('callbackUrl', path + req.nextUrl.search)
      return NextResponse.redirect(u)
    }
    return NextResponse.next()
  }

  if (path.startsWith('/somika-ai')) {
    if (isPublicFelixPath(path)) {
      return NextResponse.next()
    }
    const email = token?.email as string | undefined
    if (!email || !isAllowedFelixEmail(email)) {
      return NextResponse.redirect(new URL('/somika-ai/login', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/somika-ai', '/somika-ai/:path*', '/members', '/members/:path*'],
}
