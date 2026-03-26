'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'premium' | 'surface'
  href?: string
}

const variantClasses = {
  premium:
    'bg-white border border-neutral-200/60 rounded-2xl transition-all duration-500 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5',
  surface:
    'bg-neutral-50 rounded-2xl transition-all duration-500 hover:bg-neutral-100/80',
}

export default function Card({
  children,
  className,
  variant = 'premium',
  href,
}: CardProps) {
  const classes = cn(variantClasses[variant], className)

  if (href) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Link href={href} className={cn(classes, 'block')}>
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={classes}
    >
      {children}
    </motion.div>
  )
}
