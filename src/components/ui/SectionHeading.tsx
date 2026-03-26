'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  heading?: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const alignClasses = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div ref={ref} className={cn('max-w-3xl', alignClasses, className)}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-xs sm:text-sm font-medium uppercase tracking-widest text-accent-500 mb-4"
        >
          {eyebrow}
        </motion.p>
      )}

      {heading && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1],
            delay: eyebrow ? 0.1 : 0,
          }}
          className="text-display-md text-neutral-900"
        >
          {heading}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1],
            delay: eyebrow && heading ? 0.2 : heading ? 0.1 : 0,
          }}
          className="text-body-lg mt-5"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
