import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getFelixWorkspaceDomain, isAllowedFelixEmail } from '@/lib/felix-access'

const workspaceDomain = getFelixWorkspaceDomain()

export const authOptions: NextAuthOptions = {
  providers: [
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
    async signIn({ user, profile }) {
      const email =
        (profile as { email?: string } | undefined)?.email ?? user?.email ?? null
      return isAllowedFelixEmail(email)
    },
    async jwt({ token, user, profile }) {
      if (profile && typeof (profile as { email?: string }).email === 'string') {
        token.email = (profile as { email: string }).email
      } else if (user?.email) {
        token.email = user.email
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
      return session
    },
  },
}

declare module 'next-auth' {
  interface Session {
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
  }
}
