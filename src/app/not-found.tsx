import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="container-narrow text-center py-32">
        <p className="text-sm font-medium tracking-widest uppercase text-neutral-400 mb-6">
          404
        </p>
        <h1 className="text-display-md text-neutral-900 mb-6">
          Page not found.
        </h1>
        <p className="text-body-lg max-w-md mx-auto mb-10">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </main>
  )
}
