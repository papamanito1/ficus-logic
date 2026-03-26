'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ImageContainer from '@/components/ui/ImageContainer'
import Card from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/motion'
import type { BlogPost } from '@/data/insights'

interface InsightsContentProps {
  posts: BlogPost[]
  featured: BlogPost[]
  categories: string[]
}

export default function InsightsContent({
  posts,
  featured,
  categories,
}: InsightsContentProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let results = posts
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (activeCategory) {
      results = results.filter((p) => p.category === activeCategory)
    }
    return results
  }, [posts, query, activeCategory])

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 py-32 sm:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(141,198,63,0.12),transparent_50%)]" />
        <div className="container-premium relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={fadeUp}
              className="text-display-lg text-white max-w-4xl mx-auto"
            >
              Perspectives on leadership and talent.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-neutral-400 mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Sharp thinking on hiring intelligence.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      {featured.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
            >
              {featured.slice(0, 2).map((post, i) => (
                <motion.div key={post.slug} variants={fadeUp}>
                  <Card variant="premium" href={`/insights/${post.slug}`} className="overflow-hidden h-full">
                    <ImageContainer
                      src={post.imageUrl}
                      alt={post.title}
                      aspectRatio={i === 0 ? '16/10' : '16/10'}
                      className="!rounded-none"
                      priority
                    />
                    <div className="p-8 lg:p-10">
                      <span className="text-xs font-medium uppercase tracking-widest text-brand-600">
                        {post.category}
                      </span>
                      <h2 className="text-display-sm text-neutral-900 mt-3">
                        {post.title}
                      </h2>
                      <p className="text-body mt-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-6 text-body-sm">
                        <span>{formatDate(post.publishedDate)}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Search + Category Filter */}
      <section className="py-12 bg-neutral-50 border-y border-neutral-200/60">
        <div className="container-premium">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${
                  !activeCategory
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${
                    activeCategory === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((post) => (
                  <motion.div key={post.slug} variants={fadeUp} layout>
                    <Card
                      variant="premium"
                      href={`/insights/${post.slug}`}
                      className="overflow-hidden h-full flex flex-col"
                    >
                      <ImageContainer
                        src={post.imageUrl}
                        alt={post.title}
                        aspectRatio="16/9"
                        className="!rounded-none"
                      />
                      <div className="p-6 lg:p-8 flex flex-col flex-1">
                        <span className="text-xs font-medium uppercase tracking-widest text-brand-600">
                          {post.category}
                        </span>
                        <h3 className="text-lg font-medium text-neutral-900 mt-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-body-sm mt-3 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-6 text-body-sm">
                          <span>{formatDate(post.publishedDate)}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center py-20"
              >
                <p className="text-display-sm text-neutral-300">
                  No articles found.
                </p>
                <p className="text-body mt-4">
                  Try adjusting your search or filter.
                </p>
                <button
                  onClick={() => {
                    setQuery('')
                    setActiveCategory(null)
                  }}
                  className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
