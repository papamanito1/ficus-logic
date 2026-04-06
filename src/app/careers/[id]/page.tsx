import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
    title: `${job.title} – ${job.location} | Ficus Logic`,
    description: job.summary
      ? job.summary.slice(0, 160)
      : `${job.title} at ${job.location}. Apply via Ficus Logic.`,
  }
}

export default async function CareerRolePage({ params }: Props) {
  const { id } = await params
  const openings = await fetchHireboundCareerOpenings()
  const job = openings.find((o) => o.id === id)
  if (!job) notFound()

  const summaryParagraphs = job.summary
    ? job.summary.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : []

  const applyEmail = job.applyEmail || 'careers@ficuslogic.com'
  const tags = job.tags && job.tags.length > 0
    ? job.tags
    : [job.department, job.location, job.employmentType].filter(Boolean)

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

          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
              We&rsquo;re Hiring
            </span>
          </div>

          <h1 className="text-display-md text-white max-w-3xl">
            {job.title} &ndash; {job.location}
          </h1>

          {job.hiringFor && (
            <p className="text-body-lg mt-4 max-w-2xl !text-neutral-300">
              {job.hiringFor}
            </p>
          )}
        </div>
      </section>

      {/* Body — LinkedIn-post style */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16">

            {/* Main content */}
            <div className="space-y-8">
              {/* Ficus header */}
              <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
                <Image
                  src="/images/logo.png"
                  alt="Ficus Logic"
                  width={56}
                  height={56}
                  className="h-12 w-auto"
                />
                <div>
                  <p className="font-semibold text-neutral-900">Ficus e-Logic Pvt. Ltd.</p>
                  <p className="text-xs text-neutral-500">
                    Global Executive Search Firm · Posted {formatDate(job.postedDate)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {summaryParagraphs.length > 0 && (
                <div className="space-y-4">
                  {summaryParagraphs.map((p, i) => (
                    <p key={i} className="text-neutral-700 leading-relaxed text-[15px]">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Key highlights — emoji bullet style */}
              <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Location</p>
                    <p className="text-neutral-900 font-medium">{job.location}</p>
                  </div>
                </div>

                {job.experience && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💼</span>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Experience</p>
                      <p className="text-neutral-900 font-medium">{job.experience}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-lg">📋</span>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Role Type</p>
                    <p className="text-neutral-900 font-medium">{job.employmentType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg">🏢</span>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Department</p>
                    <p className="text-neutral-900 font-medium">{job.department}</p>
                  </div>
                </div>

                {job.industry && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔧</span>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Industry</p>
                      <p className="text-neutral-900 font-medium">{job.industry}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Apply section */}
              <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-6 sm:p-8">
                <p className="text-sm font-medium text-neutral-900 mb-2">📧 Apply here</p>
                <a
                  href={`mailto:${applyEmail}`}
                  className="text-brand-600 hover:text-brand-800 font-medium transition-colors break-all"
                >
                  {applyEmail}
                </a>
                {job.externalUrl && job.externalUrl !== `mailto:${applyEmail}` && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-900 mb-2">🔗 Or apply online</p>
                    <a
                      href={job.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-800 font-medium transition-colors break-all text-sm"
                    >
                      Apply on Hirebound →
                    </a>
                  </div>
                )}
              </div>

              {/* Note */}
              {job.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">⚠️ Note:</span> {job.note}
                  </p>
                </div>
              )}

              {/* Client info */}
              <p className="text-sm text-neutral-500 italic">
                A client of Ficus e-Logic (A Global Executive Search Firm)
                {job.industry ? ` in the ${job.industry}` : ''}
              </p>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full"
                    >
                      #{tag.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-28 space-y-6">
                {/* Apply CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-accent-900 to-accent-700 p-6 text-center">
                  <p className="text-sm text-neutral-400 mb-1">Interested in this role?</p>
                  <p className="text-white font-medium mb-5">{job.title}</p>
                  <a
                    href={`mailto:${applyEmail}?subject=Application: ${encodeURIComponent(job.title)} – ${encodeURIComponent(job.location)}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium px-5 py-3 transition-colors mb-3"
                  >
                    Apply via email
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  {job.externalUrl && (
                    <a
                      href={job.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 text-white text-sm font-medium px-5 py-3 hover:bg-white/10 transition-colors"
                    >
                      Apply on Hirebound
                    </a>
                  )}
                </div>

                {/* Quick facts */}
                <div className="rounded-2xl border border-neutral-200 p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">At a glance</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Location</dt>
                      <dd className="text-neutral-900 font-medium">{job.location}</dd>
                    </div>
                    {job.experience && (
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Experience</dt>
                        <dd className="text-neutral-900 font-medium">{job.experience}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Type</dt>
                      <dd className="text-neutral-900 font-medium">{job.employmentType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Department</dt>
                      <dd className="text-neutral-900 font-medium">{job.department}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-neutral-500">Posted</dt>
                      <dd className="text-neutral-900 font-medium">{formatDate(job.postedDate)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Ficus branding */}
                <div className="rounded-2xl bg-neutral-50 p-6 text-sm text-neutral-600">
                  <Image
                    src="/images/logo.png"
                    alt="Ficus Logic"
                    width={120}
                    height={40}
                    className="h-8 w-auto mb-3"
                  />
                  <p className="leading-relaxed">
                    Premium leadership &amp; niche executive search, connecting organisations with
                    transformative talent across industries worldwide.
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
