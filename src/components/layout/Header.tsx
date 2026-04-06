'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { navigation } from '@/data/navigation'
import { cn } from '@/lib/utils'

interface HeaderProps {
  transparent?: boolean
}

export default function Header({ transparent: _transparent = true }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-[box-shadow,background-color,border-color] duration-500 ease-out',
          'border-b border-neutral-200/50 bg-white',
          scrolled && 'border-neutral-200/70 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.08)]',
        )}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between gap-4 py-3 sm:py-3.5">
            <Link
              href="/"
              className="relative shrink-0 rounded-lg outline-none ring-offset-2 transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-accent-500/40"
            >
              <Image
                src="/images/logo.png"
                alt="Ficus Logic"
                width={560}
                height={186}
                className="h-20 w-auto sm:h-24 lg:h-32"
                priority
              />
            </Link>

            {/* Desktop navigation — member login is beside CTA so it is not clipped when the bar is full */}
            <nav className="hidden lg:flex min-w-0 flex-1 items-center justify-end gap-1 pr-2 xl:gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {navigation
                .filter((item) => item.href !== '/members/login')
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[12px] font-medium tracking-[0.02em] text-neutral-500',
                      'transition-colors duration-200 hover:bg-neutral-100/90 hover:text-neutral-900',
                      'xl:px-3.5 xl:text-[13px]',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>

            {/* Desktop: Member login + CTA (always visible) */}
            <div className="hidden lg:flex shrink-0 items-center gap-3 pl-2">
              <Link
                href="/members/login"
                className="shrink-0 whitespace-nowrap text-[12px] font-medium tracking-wide text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline xl:text-[13px]"
              >
                Member login
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-[13px] font-medium tracking-wide text-white shadow-sm ring-1 ring-neutral-900/5 transition-all duration-300 hover:bg-neutral-800 hover:shadow-md hover:ring-neutral-900/10"
              >
                Work with Us
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative flex h-11 w-11 items-center justify-center rounded-xl text-neutral-800 transition-colors hover:bg-neutral-100/90"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="flex flex-col gap-[5px]">
                <span
                  className={cn(
                    'block h-[1.5px] w-5 bg-neutral-900 transition-all duration-300 origin-center',
                    mobileOpen && 'rotate-45 translate-y-[6.5px]',
                  )}
                />
                <span
                  className={cn(
                    'block h-[1.5px] w-5 bg-neutral-900 transition-all duration-300',
                    mobileOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'block h-[1.5px] w-5 bg-neutral-900 transition-all duration-300 origin-center',
                    mobileOpen && '-rotate-45 -translate-y-[6.5px]',
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-neutral-950/25 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-[min(100vw-3rem,22rem)] max-w-sm border-l border-neutral-200/80 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),-24px_0_48px_-12px_rgba(15,23,42,0.12)] lg:hidden"
            >
              <div className="flex h-full flex-col px-6 pb-8 pt-28 sm:pt-32">
                <nav className="flex flex-col gap-0.5">
                  {navigation.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.28 }}
                    >
                      <Link
                        href={item.href}
                        {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl py-3.5 pl-1 text-[15px] font-medium tracking-[0.01em] text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto border-t border-neutral-100 pt-6">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex w-full items-center justify-center rounded-full py-3.5 text-[14px] font-medium shadow-sm"
                  >
                    Work with Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
