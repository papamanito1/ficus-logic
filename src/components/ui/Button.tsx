'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

const sizeClasses = {
  sm: 'px-5 py-2.5 text-xs',
  md: 'px-8 py-3.5 text-sm',
  lg: 'px-10 py-4 text-base',
}

const variantClasses = {
  primary:
    'inline-flex items-center justify-center font-medium tracking-wide bg-accent-500 text-white rounded-full transition-colors duration-300 hover:bg-accent-600',
  secondary:
    'inline-flex items-center justify-center font-medium tracking-wide bg-transparent text-neutral-900 rounded-full border border-neutral-300 transition-colors duration-300 hover:border-neutral-900 hover:bg-neutral-50',
  ghost:
    'inline-flex items-center gap-2 font-medium tracking-wide text-neutral-900 transition-colors duration-300 hover:text-accent-500',
}

function ArrowIcon() {
  return (
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
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className,
  onClick,
  type = 'button',
}: ButtonProps) {
  const classes = cn(
    variantClasses[variant],
    variant !== 'ghost' && sizeClasses[size],
    'group',
    className,
  )

  const motionProps = {
    whileHover: variant === 'ghost' ? {} : { scale: 1.02, y: -1 },
    whileTap: variant === 'ghost' ? {} : { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {children}
          {variant === 'ghost' && <ArrowIcon />}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
      {variant === 'ghost' && <ArrowIcon />}
    </motion.button>
  )
}
