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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          'bg-white/95 backdrop-blur-md',
          scrolled && 'shadow-sm shadow-neutral-900/5',
        )}
      >
        <div className="container-premium">
          <div className="flex items-center justify-between h-[140px]">
            {/* Logo */}
            <Link href="/" className="relative shrink-0">
              <Image
                src="/images/logo.png"
                alt="Ficus Logic"
                width={480}
                height={160}
                className="h-[130px] w-auto"
                priority
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="px-3 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-colors duration-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20"
              >
                Reach Us
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
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
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-[85vw] max-w-sm bg-white shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full pt-40 pb-8 px-8">
                <nav className="flex flex-col gap-1">
                  {navigation.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 text-[15px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors border-b border-neutral-100"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Reach Us
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
