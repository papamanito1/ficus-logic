'use client'

import { Suspense, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') ?? '/members'

  useEffect(() => {
    if (status === 'authenticated' && session?.authKind === 'member') {
      router.replace(callbackUrl.startsWith('/') ? callbackUrl : '/members')
    }
  }, [status, session, router, callbackUrl])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const res = await signIn('credentials', {
        username: username.trim(),
        password,
        redirect: false,
      })
      if (res?.error) {
        setError('Invalid login or member access is not configured on this server.')
        setPending(false)
        return
      }
      router.replace(callbackUrl.startsWith('/') ? callbackUrl : '/members')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
      setPending(false)
    }
  }

  if (status === 'loading') {
    return (
      <p className="text-sm text-neutral-600 text-center py-12">Loading…</p>
    )
  }

  if (status === 'authenticated' && session?.authKind === 'member') {
    return null
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="max-w-md mx-auto rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
    >
      <h1 className="text-xl font-medium text-neutral-900">Member sign in</h1>
      <p className="text-sm text-neutral-600 mt-2">
        Authorized members can update Insights and Careers on the live site.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <label className="block mt-6 text-sm">
        <span className="text-neutral-600">Login</span>
        <input
          autoComplete="username"
          className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>

      <label className="block mt-4 text-sm">
        <span className="text-neutral-600">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <div className="mt-8 flex flex-col gap-3">
        <Button type="submit" variant="primary" className="w-full justify-center">
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>
        <Link
          href="/"
          className="text-center text-sm text-neutral-500 hover:text-neutral-800"
        >
          Back to site
        </Link>
      </div>
    </form>
  )
}

export default function MemberLoginPage() {
  return (
    <div className="min-h-[70vh] bg-neutral-50 section-padding">
      <div className="container-narrow">
        <Suspense
          fallback={
            <p className="text-sm text-neutral-600 text-center py-12">Loading…</p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
