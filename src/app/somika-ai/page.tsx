'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { SamBadge } from '@/components/somika/SamBadge'

const ease = [0.25, 0.4, 0.25, 1] as [number, number, number, number]

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
}
const heroChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
}

const capabilities = [
  {
    title: 'Intelligent Sourcing',
    description: 'Scans talent pools across platforms and surfaces candidates human search would miss.',
  },
  {
    title: 'Context-Aware Matching',
    description: 'Goes beyond keywords. Understands role context, seniority signals, and leadership fit.',
  },
  {
    title: 'Market Intelligence',
    description: 'Maps compensation benchmarks, talent density, and candidate mobility patterns in real time.',
  },
  {
    title: 'Pipeline Analytics',
    description: 'Real-time dashboards with funnel visibility. Every decision backed by data.',
  },
  {
    title: 'Bias Reduction',
    description: 'Structured evaluation criteria. Consistent scoring. Fairer, defensible shortlists.',
  },
  {
    title: 'CSV Export',
    description: 'Download ranked candidate lists instantly. Ready for your ATS or executive review.',
  },
]

function StatementSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 sm:py-40 lg:py-52 bg-white">
      <div className="container-narrow" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs sm:text-sm font-medium uppercase tracking-widest text-accent-500 mb-8 text-center"
        >
          The Platform
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="text-display-lg sm:text-display-xl text-neutral-900 text-center max-w-4xl mx-auto leading-[1.1]"
        >
          AI built for search firms.
          <br />
          <span className="text-neutral-400">Not job boards.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
          className="text-body-lg text-center max-w-2xl mx-auto mt-8"
        >
          SAM augments your search consultants with intelligence.
          Not a replacement. A force multiplier.
        </motion.p>
      </div>
    </section>
  )
}

function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-36 bg-neutral-50 overflow-hidden">
      <div className="container-premium">
        <motion.div style={{ y, scale, opacity }} className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white border border-neutral-200/60 shadow-2xl shadow-neutral-900/8 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-neutral-50 border-b border-neutral-200/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-neutral-300" />
                <div className="w-3 h-3 rounded-full bg-neutral-300" />
                <div className="w-3 h-3 rounded-full bg-neutral-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-lg bg-white border border-neutral-200/60 text-[11px] text-neutral-400 font-medium">
                  ficuslogic.com/somika-ai/chat
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* Chat preview */}
            <div className="px-8 sm:px-12 py-10 sm:py-14 space-y-6">
              {/* Status bar with logo */}
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/logo.png" alt="Ficus Logic" width={120} height={40} className="h-7 w-auto" />
                <div className="w-px h-5 bg-neutral-200" />
                <SamBadge size="sm" />
                <span className="text-sm font-semibold text-neutral-900">SAM</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-400" />
                  <span className="text-[11px] text-neutral-400">Ready</span>
                </div>
              </div>

              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-neutral-950 px-5 py-3.5">
                  <p className="text-[14px] text-white/90 leading-relaxed">
                    Senior React Developer, Bangalore — 5+ years, TypeScript, Node.js
                  </p>
                </div>
              </div>

              {/* Assistant message */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <SamBadge size="sm" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-neutral-800 font-semibold">Role Blueprint: Senior React Developer</p>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">
                    Based on your requirements, I&apos;ve prepared a comprehensive sourcing plan targeting
                    Bangalore&apos;s senior frontend talent pool with TypeScript + Node.js expertise...
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[11px] font-medium text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-100">Boolean Query</span>
                    <span className="text-[11px] font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">12 Candidates</span>
                    <span className="text-[11px] font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">CSV Ready</span>
                  </div>
                </div>
              </div>

              {/* Input preview */}
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/60 bg-neutral-50 px-5 py-3.5">
                  <span className="flex-1 text-[14px] text-neutral-300">Describe the role or paste a job description...</span>
                  <div className="h-8 w-8 rounded-xl bg-neutral-950 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const steps = [
    {
      number: '01',
      title: 'Describe',
      headline: 'One conversation starts everything.',
      body: 'Paste a job description or simply describe the role in natural language. SAM understands seniority, domain context, and location nuance.',
    },
    {
      number: '02',
      title: 'Research',
      headline: 'AI does the heavy lifting.',
      body: 'SAM generates sourcing strategies, Boolean search queries, multi-wave outreach plans, and ranked candidate profiles — in seconds.',
    },
    {
      number: '03',
      title: 'Export',
      headline: 'Results ready for action.',
      body: 'Review ranked shortlists with fit scores. Download as CSV. Feed directly into your ATS or share with hiring managers.',
    },
  ]

  return (
    <section className="py-32 sm:py-40 lg:py-52 bg-white" ref={ref}>
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 lg:mb-28"
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-accent-500 mb-4">
            How It Works
          </p>
          <h2 className="text-display-md text-neutral-900">
            Three steps. One conversation.
          </h2>
        </motion.div>

        <div className="space-y-24 lg:space-y-32 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                <div className="lg:col-span-4 flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-950 flex items-center justify-center text-white text-lg font-light lg:mb-5">
                    {step.number}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                    {step.title}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <h3 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight mb-4">
                    {step.headline}
                  </h3>
                  <p className="text-body-lg max-w-xl">
                    {step.body}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 sm:py-40 lg:py-52 bg-neutral-950 text-white" ref={ref}>
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 lg:mb-28"
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-accent-400 mb-4">
            Capabilities
          </p>
          <h2 className="text-display-md text-white">
            What SAM brings to
            <br />
            <span className="text-neutral-500">every mandate.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800 rounded-3xl overflow-hidden">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="bg-neutral-950 p-10 lg:p-12 group hover:bg-neutral-900 transition-colors duration-500"
            >
              <h3 className="text-lg font-medium text-white mb-4 group-hover:text-accent-400 transition-colors duration-500">
                {cap.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NumbersSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const stats = [
    { value: '<30s', label: 'Time to first shortlist' },
    { value: '5x', label: 'Faster than manual sourcing' },
    { value: '100%', label: 'Structured, auditable output' },
  ]

  return (
    <section className="py-28 sm:py-36 lg:py-44 bg-white" ref={ref}>
      <div className="container-narrow">
        <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: i * 0.15 }}
              className="px-8 sm:px-12 lg:px-20 py-8 sm:py-0 text-center"
            >
              <p className="text-5xl sm:text-6xl font-light text-neutral-900 tracking-tight mb-3">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-500 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function SamAIPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 60])

  return (
    <>
      {/* ── Hero — Full Viewport ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,117,188,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(141,198,63,0.08),transparent_50%)]" />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="container-premium relative z-10 text-center pt-44 pb-20">
          <motion.div initial="hidden" animate="visible" variants={heroStagger}>
            {/* Logo — large and prominent */}
            <motion.div variants={heroChild} className="relative mb-12 inline-block">
              <div className="absolute inset-0 blur-[100px] opacity-25 bg-gradient-to-br from-accent-400 to-brand-400 rounded-full scale-[2]" />
              <Image
                src="/images/logo.png"
                alt="Ficus Logic"
                width={500}
                height={160}
                className="relative mx-auto h-[100px] sm:h-[130px] lg:h-[160px] w-auto drop-shadow-2xl brightness-200"
                priority
              />
            </motion.div>

            <motion.div variants={heroChild} className="mb-8">
              <span className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-widest uppercase text-neutral-500 border border-neutral-800 rounded-full px-5 py-2 bg-neutral-900/50 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                AI-Powered Recruitment
              </span>
            </motion.div>

            <motion.h1
              variants={heroChild}
              className="text-6xl sm:text-7xl lg:text-[100px] font-light tracking-[-0.04em] text-white leading-[0.95]"
            >
              SAM
            </motion.h1>

            <motion.p
              variants={heroChild}
              className="text-xl sm:text-2xl text-neutral-500 mt-8 max-w-xl mx-auto leading-relaxed font-light"
            >
              Recruitment intelligence that thinks
              <br className="hidden sm:block" />
              the way your best consultants do.
            </motion.p>

            <motion.div variants={heroChild} className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/somika-ai/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-10 py-4 text-[15px] font-medium tracking-wide
                           bg-white text-neutral-900 rounded-full
                           transition-all duration-500
                           hover:shadow-2xl hover:shadow-white/10 hover:scale-[1.03]
                           active:scale-[0.98]"
              >
                Try SAM
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </Link>
              <Button href="/contact" variant="ghost" className="!text-neutral-500 hover:!text-white">
                Reach Us
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-neutral-700 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-neutral-600" />
          </motion.div>
        </motion.div>
      </section>

      <StatementSection />
      <ProductShowcase />
      <HowItWorks />
      <CapabilitiesSection />
      <NumbersSection />

      {/* ── Final CTA ── */}
      <section className="py-32 sm:py-40 lg:py-52 bg-neutral-950">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="relative mb-12 inline-block">
              <div className="absolute inset-0 blur-[80px] opacity-20 bg-gradient-to-br from-accent-400 to-brand-400 rounded-full scale-[2]" />
              <Image
                src="/images/logo.png"
                alt="Ficus Logic"
                width={300}
                height={100}
                className="relative mx-auto h-[70px] sm:h-[80px] w-auto brightness-200"
              />
            </div>
            <h2 className="text-display-lg text-white">
              Ready to see it
              <br />
              <span className="text-neutral-600">in action?</span>
            </h2>
            <p className="text-lg sm:text-xl text-neutral-500 mt-8 leading-relaxed max-w-lg mx-auto">
              Open SAM. Describe any role.
              <br />
              Results in seconds.
            </p>
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/somika-ai/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-10 py-4 text-[15px] font-medium tracking-wide
                           bg-white text-neutral-900 rounded-full
                           transition-all duration-500
                           hover:shadow-2xl hover:shadow-white/10 hover:scale-[1.03]
                           active:scale-[0.98]"
              >
                Try SAM
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </Link>
              <Button
                href="/contact"
                variant="ghost"
                className="!text-neutral-500 hover:!text-white"
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
