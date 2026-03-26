import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActiveJobs, getJobBySlug } from '@/data/careers'
import { formatDate } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getActiveJobs().map((job) => ({ slug: job.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const job = getJobBySlug(slug)
  if (!job) return { title: 'Role Not Found | Ficus Logic' }

  return {
    title: `${job.title} | Careers | Ficus Logic`,
    description: job.overview,
  }
}

function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params
  const job = getJobBySlug(slug)
  if (!job) notFound()

  const relatedJobs = getActiveJobs()
    .filter((j) => j.slug !== job.slug)
    .slice(0, 3)

  const applyMailto = `mailto:careers@ficuslogic.com?subject=${encodeURIComponent(`Application — ${job.title}`)}`

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 pt-44 pb-20 sm:pt-52 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-400)_0%,_transparent_50%)] opacity-20" />
        <div className="container-premium relative z-10">
          <AnimatedSection>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200 mb-8"
            >
              <ArrowLeftIcon />
              All Roles
            </Link>

            <h1 className="text-display-lg text-white max-w-3xl">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 text-sm text-neutral-400">
              <span className="inline-flex items-center gap-2">
                <MapPinIcon />
                {job.location}
              </span>
              <span className="text-neutral-700">·</span>
              <span className="inline-flex items-center gap-2">
                <BriefcaseIcon />
                {job.department}
              </span>
              <span className="text-neutral-700">·</span>
              <span>{job.employmentType}</span>
              <span className="text-neutral-700">·</span>
              <span>{job.experience}</span>
              <span className="text-neutral-700">·</span>
              <span className="inline-flex items-center gap-2">
                <CalendarIcon />
                {formatDate(job.postedDate)}
              </span>
            </div>

            <div className="mt-10">
              <Button
                href={applyMailto}
                variant="primary"
                className="!bg-white !text-neutral-900 hover:!bg-neutral-200"
              >
                Apply Now
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-3xl">
            {/* Overview */}
            <AnimatedSection>
              <h2 className="text-display-sm text-neutral-900 mb-5">
                Overview
              </h2>
              <p className="text-body-lg leading-relaxed">{job.overview}</p>
              <div className="divider my-12" />
            </AnimatedSection>

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <AnimatedSection delay={0.1}>
                <h2 className="text-display-sm text-neutral-900 mb-6">
                  Responsibilities
                </h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex gap-4 text-body">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="divider my-12" />
              </AnimatedSection>
            )}

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <AnimatedSection delay={0.15}>
                <h2 className="text-display-sm text-neutral-900 mb-6">
                  Requirements
                </h2>
                <ul className="space-y-4">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex gap-4 text-body">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="divider my-12" />
              </AnimatedSection>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <AnimatedSection delay={0.2}>
                <h2 className="text-display-sm text-neutral-900 mb-6">
                  Key Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Apply CTA */}
            <AnimatedSection delay={0.25} className="mt-16 pt-12 border-t border-neutral-200/60">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-xl font-medium text-neutral-900">
                    Interested in this role?
                  </h3>
                  <p className="text-body-sm mt-1">
                    Reach out with your profile and experience.
                  </p>
                </div>
                <Button href={applyMailto} variant="primary" className="sm:ml-auto">
                  Apply Now
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related Roles */}
      {relatedJobs.length > 0 && (
        <section className="section-padding-sm bg-neutral-50">
          <div className="container-premium">
            <AnimatedSection>
              <h2 className="text-display-sm text-neutral-900 mb-10">
                Other open roles
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((related, i) => (
                <AnimatedSection key={related.slug} delay={i * 0.08}>
                  <Card variant="premium" href={`/careers/${related.slug}`} className="p-8">
                    <span className="text-xs font-medium px-3 py-1 bg-brand-50 text-brand-700 rounded-full">
                      {related.department}
                    </span>
                    <h3 className="text-lg font-medium text-neutral-900 mt-4 mb-3">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-body-sm">
                      <MapPinIcon />
                      {related.location}
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-12 text-center">
              <Button href="/careers" variant="ghost">
                View All Roles
              </Button>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  )
}
