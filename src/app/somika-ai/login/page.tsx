import { Suspense } from 'react'
import LoginClient from './LoginClient'

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
      <p className="text-[13px] text-neutral-400">Loading…</p>
    </div>
  )
}

export default function FelixLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  )
}
