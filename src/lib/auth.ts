import type { NextAuthOptions } from 'next-auth'
import { timingSafeEqual } from 'crypto'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getFelixWorkspaceDomain, isAllowedFelixEmail } from '@/lib/felix-access'

const workspaceDomain = getFelixWorkspaceDomain()

function safePasswordMatch(expected: string, received: string): boolean {
  try {
    const a = Buffer.from(expected, 'utf8')
    const b = Buffer.from(received, 'utf8')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Member',
      credentials: {
        username: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const expectedUser = process.env.MEMBER_USERNAME?.trim()
        const expectedPass = process.env.MEMBER_PASSWORD?.trim()
        if (!expectedUser || !expectedPass) return null
        const u = credentials?.username?.trim() ?? ''
        const p = credentials?.password ?? ''
        if (u !== expectedUser) return null
        if (!safePasswordMatch(expectedPass, p)) return null
        return {
          id: 'member',
          name: 'Member',
          email: 'member@dashboard.local',
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          hd: workspaceDomain,
          prompt: 'select_account',
        },
      },
    }),
  ],
  pages: {
    signIn: '/somika-ai/login',
    error: '/somika-ai/login',
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      if (account?.provider === 'credentials') {
        return true
      }
      const email =
        (profile as { email?: string } | undefined)?.email ?? user?.email ?? null
      return isAllowedFelixEmail(email)
    },
    async jwt({ token, user, profile, account }) {
      if (account?.provider === 'credentials') {
        token.authKind = 'member'
        if (user?.email) token.email = user.email
      } else if (account?.provider === 'google') {
        token.authKind = 'google'
        if (profile && typeof (profile as { email?: string }).email === 'string') {
          token.email = (profile as { email: string }).email
        } else if (user?.email) {
          token.email = user.email
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.email) {
        session.user.email = token.email as string
      }
      session.authKind = token.authKind as 'member' | 'google' | undefined
      return session
    },
  },
}

declare module 'next-auth' {
  interface Session {
    authKind?: 'member' | 'google'
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    email?: string | null
    authKind?: 'member' | 'google'
  }
}
