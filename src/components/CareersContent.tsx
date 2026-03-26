'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  searchJobs,
  getUniqueLocations,
  getUniqueDepartments,
} from '@/data/careers'
import { formatDate, truncate } from '@/lib/utils'
import { staggerContainer, fadeUp, viewportConfig } from '@/lib/motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Button from '@/components/ui/Button'

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default function CareersContent() {
  const [query, setQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  const locations = useMemo(() => getUniqueLocations(), [])
  const departments = useMemo(() => getUniqueDepartments(), [])

  const filteredJobs = useMemo(
    () =>
      searchJobs(query, {
        location: locationFilter,
        department: departmentFilter,
      }),
    [query, locationFilter, departmentFilter],
  )

  const hasActiveFilters = query || locationFilter || departmentFilter

  function clearAllFilters() {
    setQuery('')
    setLocationFilter('')
    setDepartmentFilter('')
  }

  const gridRef = useRef<HTMLDivElement>(null)
  const isGridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-400)_0%,_transparent_50%)] opacity-20" />
        <div className="container-premium relative z-10">
          <AnimatedSection>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-brand-400 mb-5">
              Careers
            </p>
            <h1 className="text-display-lg text-white max-w-3xl">
              Build your career in executive search.
            </h1>
            <p className="text-body-lg mt-6 max-w-xl !text-neutral-400">
              Join a team that values precision and depth.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="bg-white border-b border-neutral-200/60 sticky top-0 z-30">
        <div className="container-premium py-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, skill, or location..."
                className="w-full pl-12 pr-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl
                           text-neutral-900 placeholder:text-neutral-400
                           focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                           transition-all duration-200"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="appearance-none w-full lg:w-52 pl-4 pr-10 py-3 text-sm bg-neutral-50 border border-neutral-200
                           rounded-xl text-neutral-900
                           focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                           transition-all duration-200 cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="appearance-none w-full lg:w-52 pl-4 pr-10 py-3 text-sm bg-neutral-50 border border-neutral-200
                           rounded-xl text-neutral-900
                           focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                           transition-all duration-200 cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                             bg-brand-50 text-brand-700 rounded-full
                             hover:bg-brand-100 transition-colors duration-200"
                >
                  &ldquo;{query}&rdquo;
                  <XIcon className="w-3 h-3" />
                </button>
              )}
              {locationFilter && (
                <button
                  onClick={() => setLocationFilter('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                             bg-accent-50 text-accent-700 rounded-full
                             hover:bg-accent-100 transition-colors duration-200"
                >
                  {locationFilter}
                  <XIcon className="w-3 h-3" />
                </button>
              )}
              {departmentFilter && (
                <button
                  onClick={() => setDepartmentFilter('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                             bg-accent-50 text-accent-700 rounded-full
                             hover:bg-accent-100 transition-colors duration-200"
                >
                  {departmentFilter}
                  <XIcon className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900
                           transition-colors duration-200 ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          {filteredJobs.length > 0 ? (
            <>
              <AnimatedSection>
                <p className="text-body-sm mb-10">
                  Showing{' '}
                  <span className="text-neutral-900 font-medium">
                    {filteredJobs.length}
                  </span>{' '}
                  {filteredJobs.length === 1 ? 'role' : 'roles'}
                </p>
              </AnimatedSection>

              <motion.div
                ref={gridRef}
                variants={staggerContainer}
                initial="hidden"
                animate={isGridInView ? 'visible' : 'hidden'}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {filteredJobs.map((job) => (
                  <motion.div key={job.slug} variants={fadeUp}>
                    <Link
                      href={`/careers/${job.slug}`}
                      className="card-premium block p-8 lg:p-10 group hover:-translate-y-1 transition-transform duration-500"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-lg font-medium text-neutral-900 group-hover:text-brand-600 transition-colors duration-300">
                          {job.title}
                        </h3>
                        <span className="shrink-0 text-xs font-medium px-3 py-1 bg-brand-50 text-brand-700 rounded-full">
                          {job.department}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-body-sm mb-5">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPinIcon className="text-neutral-400" />
                          {job.location}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span>{job.employmentType}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{formatDate(job.postedDate)}</span>
                      </div>

                      <p className="text-body-sm leading-relaxed mb-6">
                        {truncate(job.overview, 120)}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:gap-2.5 transition-all duration-300">
                        View Role
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path
                            d="M3.333 8h9.334M8.667 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            /* Empty State */
            <AnimatedSection className="text-center py-16 sm:py-24">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-neutral-200/60 mx-auto mb-6 flex items-center justify-center">
                  <SearchIcon className="text-neutral-400 w-7 h-7" />
                </div>
                <h3 className="text-display-sm text-neutral-900 mb-3">
                  No roles match your search.
                </h3>
                <p className="text-body mb-8">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="secondary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-accent-800 to-accent-700">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-display-md text-white">
              Don&rsquo;t see the right role?
            </h2>
            <p className="text-body-lg mt-5 !text-neutral-400 max-w-xl mx-auto">
              We&rsquo;re always open to exceptional talent.
            </p>
            <div className="mt-10">
              <Button
                href="mailto:careers@ficuslogic.com"
                variant="primary"
                className="!bg-white !text-neutral-900 hover:!bg-neutral-200"
              >
                Get in Touch
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
