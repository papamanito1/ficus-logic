import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchHireboundCareerOpenings } from '@/lib/hirebound-careers'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const openings = await fetchHireboundCareerOpenings()
  const job = openings.find((o) => o.id === id)
  if (!job) return { title: 'Role not found | Ficus Logic' }
  return {
    title: `${job.title} | Ficus Logic`,
    description: job.summary
      ? job.summary.slice(0, 160)
      : `${job.title} — ${job.department} · ${job.location}. Apply via Ficus Logic.`,
  }
}

export default async function CareerRolePage({ params }: Props) {
  const { id } = await params
  const openings = await fetchHireboundCareerOpenings()
  const job = openings.find((o) => o.id === id)
  if (!job) notFound()

  const paragraphs = job.summary
    ? job.summary
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 pt-36 pb-16 sm:pt-44 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-400)_0%,_transparent_50%)] opacity-20" />
        <div className="container-narrow relative z-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10.667 8H5.333M8 10.667 5.333 8 8 5.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All openings
          </Link>

          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-brand-400 mb-4">
            Career Opportunity
          </p>
          <h1 className="text-display-md text-white max-w-3xl">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-neutral-400">
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {job.location}
            </span>
            <span className="text-neutral-600">·</span>
            <span>{job.department}</span>
            <span className="text-neutral-600">·</span>
            <span>{job.employmentType}</span>
            <span className="text-neutral-600">·</span>
            <span>Posted {formatDate(job.postedDate)}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">

            {/* Description */}
            <div>
              {paragraphs.length > 0 ? (
                <div className="prose prose-neutral max-w-none">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-neutral-700 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600 leading-relaxed">
                  Please visit the Hirebound career page for full role details.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-28 space-y-6">
                {/* Apply CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-accent-900 to-accent-700 p-6 text-center">
                  <p className="text-sm text-neutral-400 mb-1">Ready to apply?</p>
                  <p className="text-white font-medium mb-4">{job.title}</p>
                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-5 py-3 transition-colors"
                  >
                    Apply now
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <p className="text-xs text-neutral-500 mt-3">You&rsquo;ll be taken to our Hirebound page</p>
                </div>

                {/* Role details */}
                <div className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Role details</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-neutral-500">Department</dt>
                      <dd className="text-neutral-900 font-medium mt-0.5">{job.department}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Location</dt>
                      <dd className="text-neutral-900 font-medium mt-0.5">{job.location}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Type</dt>
                      <dd className="text-neutral-900 font-medium mt-0.5">{job.employmentType}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Posted</dt>
                      <dd className="text-neutral-900 font-medium mt-0.5">{formatDate(job.postedDate)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Ficus branding */}
                <div className="rounded-2xl bg-neutral-50 p-6 text-sm text-neutral-600">
                  <p className="font-medium text-neutral-900 mb-1">Ficus e-Logic Pvt. Ltd.</p>
                  <p className="leading-relaxed">
                    Premium leadership &amp; niche executive search, connecting organisations with
                    transformative talent across industries.
                  </p>
                  <Link
                    href="/about"
                    className="inline-block mt-3 text-accent-600 hover:text-accent-800 font-medium transition-colors"
                  >
                    About us →
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-10 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-neutral-900 font-medium">Not the right role?</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                Browse all open positions or reach out directly.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                All openings
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
