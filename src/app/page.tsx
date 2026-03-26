'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import ImageContainer from '@/components/ui/ImageContainer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { industries } from '@/data/partners'
import { getActiveJobs } from '@/data/careers'
import { getFeaturedPosts } from '@/data/insights'
import { staggerContainer, fadeUp, viewportConfig } from '@/lib/motion'
import { formatDate } from '@/lib/utils'

const jobs = getActiveJobs().slice(0, 3)
const featuredPosts = getFeaturedPosts().slice(0, 2)

const values = [
  {
    title: 'Mandate Clarity',
    description: 'Every search starts with deep understanding.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Market Depth',
    description: 'Real networks. Not database guesswork.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M20 6v28M6 20h28" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="6" r="3" fill="currentColor" />
        <circle cx="6" cy="20" r="3" fill="currentColor" />
        <circle cx="34" cy="20" r="3" fill="currentColor" />
        <circle cx="20" cy="34" r="3" fill="currentColor" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Closure Discipline',
    description: 'Aligned stakeholders. Decisive timelines.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path
          d="M12 20l6 6 12-12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

const processSteps = [
  { number: '01', title: 'Define', description: 'Sharp mandate. Clear context.' },
  { number: '02', title: 'Map', description: 'Market intelligence. Real networks.' },
  { number: '03', title: 'Evaluate', description: 'Rigorous assessment. Cultural fit.' },
  { number: '04', title: 'Close', description: 'Stakeholder alignment. Decisive action.' },
]

const stats = [
  { value: '6+', label: 'Countries' },
  { value: '3', label: 'Continents' },
  { value: '25+', label: 'Partner Network' },
]

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
}

const ease = [0.25, 0.4, 0.25, 1] as [number, number, number, number]

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
}

const heroItemFast = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(141,198,63,0.15),transparent_50%)]" />

        <div className="container-premium relative z-10 text-center py-20">
          <motion.div initial="hidden" animate="visible" variants={heroStagger}>
            <motion.h1
              variants={heroItem}
              className="text-display-xl text-white max-w-4xl mx-auto"
            >
              Leadership hiring needs
              <br />
              sharper judgment.
            </motion.h1>

            <motion.p
              variants={heroItemFast}
              className="text-lg sm:text-xl text-neutral-400 mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Niche search needs real market depth.
            </motion.p>

            <motion.div
              variants={heroItemFast}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
            >
              <Button
                href="/contact"
                variant="primary"
                className="!bg-white !text-neutral-900 hover:!bg-neutral-200"
              >
                Reach Us
              </Button>
              <Button
                href="/leadership-hiring"
                variant="secondary"
                className="!border-white/30 !text-white hover:!border-white hover:!bg-white/10"
              >
                Our Approach
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Leadership Value Proposition ── */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Leadership Hiring"
            heading="We hire where precision changes outcomes."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 lg:mt-20"
          >
            {values.map((v) => (
              <motion.div key={v.title} variants={fadeUp}>
                <Card variant="surface" className="p-8 lg:p-10 text-center">
                  <div className="inline-flex items-center justify-center text-accent-500 mb-6">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-3">
                    {v.title}
                  </h3>
                  <p className="text-body">{v.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Niche Specialization ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <SectionHeading
                eyebrow="Niche Practices"
                heading="High-context roles need specialist search."
                align="left"
              />
              <div className="mt-8 space-y-4">
                <p className="text-body-lg">
                  Generic search fails for specialist mandates.
                </p>
                <p className="text-body">
                  Domain depth builds candidate trust.
                </p>
                <p className="text-body">
                  We cover regulated and technical roles.
                </p>
                <p className="text-body">Precision over volume. Always.</p>
              </div>
              <div className="mt-10">
                <Button href="/niche-hiring" variant="ghost">
                  Explore Niche Practices
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ImageContainer
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop"
                alt="Executive team collaborating in a modern boardroom"
                aspectRatio="3/2"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Industry Expertise ── */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Industries"
            heading="Depth across sectors that matter."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 lg:mt-20"
          >
            {industries.map((ind) => (
              <motion.div key={ind.slug} variants={fadeUp}>
                <Card
                  variant="premium"
                  href={`/industries/${ind.slug}`}
                  className="p-8"
                >
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-body-sm">{ind.subtitle}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="text-center mt-12">
            <Button href="/industries" variant="ghost">
              View All Industries
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Search Methodology ── */}
      <section className="section-padding bg-accent-800">
        <div className="container-premium">
          <AnimatedSection>
            <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-brand-300 mb-4 text-center">
              Our Process
            </p>
            <h2 className="text-display-md text-white text-center max-w-3xl mx-auto">
              Disciplined search. Calibrated judgment.
            </h2>
          </AnimatedSection>

          <div className="relative mt-16 lg:mt-24">
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-accent-600" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6"
            >
              {processSteps.map((step) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-700 border border-accent-600 text-white text-lg font-light mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-accent-200 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Global Presence ── */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            eyebrow="Global Reach"
            heading="Search capability across borders."
            subtitle="Mandates don't respect borders. Neither do we."
          />

          <AnimatedSection delay={0.2}>
            <div className="flex items-center justify-center divide-x divide-neutral-200 mt-16 lg:mt-20">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-6 sm:px-10 lg:px-16 text-center"
                >
                  <p className="text-4xl sm:text-5xl font-light text-accent-500 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-body-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="text-center mt-12" delay={0.3}>
            <Button href="/global-presence" variant="ghost">
              Our Global Presence
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Careers Preview ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Join Us"
            heading="Build your career in executive search."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 lg:mt-20"
          >
            {jobs.map((job) => (
              <motion.div key={job.slug} variants={fadeUp}>
                <Card
                  variant="premium"
                  href={`/careers/${job.slug}`}
                  className="p-8"
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-accent-500 mb-3">
                    {job.department}
                  </p>
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">
                    {job.title}
                  </h3>
                  <p className="text-body-sm">{job.location}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="text-center mt-12">
            <Button href="/careers" variant="ghost">
              View All Roles
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Insights Preview ── */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Insights"
            heading="Perspectives on leadership and talent."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 lg:mt-20"
          >
            {featuredPosts.map((post) => (
              <motion.div key={post.slug} variants={fadeUp}>
                <Card
                  variant="premium"
                  href={`/insights/${post.slug}`}
                  className="overflow-hidden"
                >
                  <ImageContainer
                    src={post.imageUrl}
                    alt={post.title}
                    aspectRatio="16/9"
                    className="!rounded-none"
                  />
                  <div className="p-8">
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                      <span className="font-medium uppercase tracking-widest text-accent-500">
                        {post.category}
                      </span>
                      <span className="w-px h-3 bg-neutral-300" />
                      <span>{formatDate(post.publishedDate)}</span>
                      <span className="w-px h-3 bg-neutral-300" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-medium text-neutral-900 mb-3 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-body-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="text-center mt-12">
            <Button href="/insights" variant="ghost">
              Read All Insights
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section-padding bg-gradient-to-r from-brand-400 to-teal-400">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-display-lg text-white">
              Ready to find your next leader?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mt-6 leading-relaxed">
              Let&apos;s talk about your mandate.
            </p>
            <div className="mt-10">
              <Button
                href="/contact"
                variant="primary"
                className="!bg-white !text-neutral-900 hover:!bg-neutral-100"
              >
                Reach Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
