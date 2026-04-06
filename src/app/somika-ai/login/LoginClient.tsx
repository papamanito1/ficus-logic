'use client'

import { useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SamBadge } from '@/components/somika/SamBadge'
import { getFelixWorkspaceDomain, isAllowedFelixEmail } from '@/lib/felix-access'

const ease = [0.25, 0.4, 0.25, 1] as [number, number, number, number]

export default function LoginClient() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const domain = getFelixWorkspaceDomain()

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return
    if (isAllowedFelixEmail(session.user.email)) return
    void signOut({ callbackUrl: '/somika-ai/login' })
  }, [status, session?.user?.email])

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.email) return
    if (!isAllowedFelixEmail(session.user.email)) return
    window.location.replace('/somika-ai/chat')
  }, [status, session?.user?.email])

  const showAccessDenied =
    error === 'AccessDenied' || error === 'Configuration' || error === 'OAuthAccountNotLinked'

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(27,117,188,0.06),transparent)]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-neutral-200/60 bg-white/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="opacity-90 transition-opacity hover:opacity-100">
            <Image src="/images/logo.png" alt="Ficus Logic" width={120} height={40} className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-800"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-8 flex justify-center">
            <SamBadge size="lg" />
          </div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Ficus Logic
          </p>
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 sm:text-4xl">
            Sign in to FELIX
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
            FELIX is available to Ficus Logic team members only. Use your{' '}
            <span className="font-medium text-neutral-700">@{domain}</span> Google account.
          </p>

          {showAccessDenied && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-left text-[13px] leading-relaxed text-red-900"
            >
              Access was denied. Sign in with an <strong>@{domain}</strong> Google workspace account.
            </div>
          )}

          <div className="mt-10">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/somika-ai/chat' })}
              disabled={status === 'loading'}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-[14px] font-medium text-neutral-900 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {status === 'loading' && (
            <p className="mt-6 text-[13px] text-neutral-400">Checking session…</p>
          )}
        </motion.div>
      </main>
    </div>
  )
}
