'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

const sizeClass = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-16 w-16',
} as const

export interface SamAvatarProps {
  size?: keyof typeof sizeClass
  className?: string
}

/** Cute cartoon face for SAM — scales cleanly at sm / md / lg. */
export function SamAvatar({ size = 'sm', className }: SamAvatarProps) {
  const uid = useId().replace(/:/g, '')
  const gradId = `sam-face-${uid}`

  return (
    <span
      className={cn(
        'inline-flex shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-neutral-200/90',
        sizeClass[size],
        className,
      )}
      role="img"
      aria-label="SAM"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="6" y1="5" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF9F2" />
            <stop offset="1" stopColor="#FFE8D6" />
          </linearGradient>
        </defs>
        {/* Face */}
        <circle cx="16" cy="16" r="15" fill={`url(#${gradId})`} />
        {/* Rosy cheeks */}
        <ellipse cx="9" cy="18.5" rx="3.2" ry="2.2" fill="#F9A8A8" opacity="0.45" />
        <ellipse cx="23" cy="18.5" rx="3.2" ry="2.2" fill="#F9A8A8" opacity="0.45" />
        {/* Eyes — soft brand blue */}
        <ellipse cx="11.2" cy="13" rx="3" ry="3.6" fill="#1B75BC" />
        <ellipse cx="20.8" cy="13" rx="3" ry="3.6" fill="#1B75BC" />
        <ellipse cx="12.2" cy="11.8" rx="1.1" ry="1.3" fill="white" opacity="0.95" />
        <ellipse cx="21.8" cy="11.8" rx="1.1" ry="1.3" fill="white" opacity="0.95" />
        {/* Friendly smile */}
        <path
          d="M10.5 20.2c1.8 2.4 4.2 3.6 5.5 3.6s3.7-1.2 5.5-3.6"
          stroke="#334155"
          strokeWidth="1.25"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tiny hair tuft */}
        <path
          d="M14 3.5c1.2 1.8 2.8 2.4 4 2.2 1-.2 1.8-1 2.2-2"
          stroke="#8DC63F"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )
}
