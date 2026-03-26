'use client'

import { motion } from 'framer-motion'

interface PageHeroProps {
  heading: string
  subtitle?: string
}

const ease: [number, number, number, number] = [0.25, 0.4, 0.25, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export default function PageHero({ heading, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 py-32 sm:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(141,198,63,0.12),transparent_50%)]" />

      <div className="container-premium relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1
            variants={item}
            className="text-display-lg text-white max-w-4xl mx-auto"
          >
            {heading}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={item}
              className="text-lg sm:text-xl text-neutral-400 mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
