import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublishedPosts, getPostBySlug } from '@/data/insights'
import { formatDate } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Card from '@/components/ui/Card'
import ImageContainer from '@/components/ui/ImageContainer'
import Button from '@/components/ui/Button'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found | Ficus Logic' }

  return {
    title: `${post.title} | Ficus Logic`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author],
      images: [{ url: post.imageUrl, width: 1200, height: 630 }],
    },
  }
}

function renderContent(content: string) {
  const blocks = content.split('\n\n')

  return blocks.map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={i}
          className="text-display-sm text-neutral-900 mt-12 mb-6"
        >
          {trimmed.replace('## ', '')}
        </h2>
      )
    }

    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '))
      return (
        <ul key={i} className="space-y-2 my-6 pl-6">
          {items.map((item, j) => (
            <li
              key={j}
              className="text-lg leading-relaxed text-neutral-700 list-disc"
            >
              {item.replace('- ', '')}
            </li>
          ))}
        </ul>
      )
    }

    const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold text-neutral-900">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={j}>{part}</span>
    })

    return (
      <p key={i} className="text-lg leading-relaxed text-neutral-700 my-5">
        {rendered}
      </p>
    )
  })
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getPublishedPosts()
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  return (
    <>
      {/* Article Hero */}
      <section className="relative bg-gradient-to-br from-accent-900 via-accent-800 to-accent-700 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(141,198,63,0.12),transparent_50%)]" />
        <div className="container-narrow relative z-10">
          <AnimatedSection>
            <span className="text-xs font-medium uppercase tracking-widest text-brand-500">
              {post.category}
            </span>
            <h1 className="text-display-md text-white mt-5 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-8 text-sm text-neutral-400">
              <span>{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span>{formatDate(post.publishedDate)}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span>{post.readTime}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Image */}
      {post.imageUrl && (
        <section className="bg-white">
          <div className="container-narrow -mt-8 sm:-mt-12">
            <AnimatedSection delay={0.1}>
              <ImageContainer
                src={post.imageUrl}
                alt={post.title}
                aspectRatio="2/1"
                priority
              />
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Article Body */}
      <article className="section-padding bg-white">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            <div className="max-w-3xl mx-auto">
              {renderContent(post.content)}
            </div>
          </AnimatedSection>

          {/* Tags */}
          {post.tags.length > 0 && (
            <AnimatedSection delay={0.2}>
              <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-neutral-200/60">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="container-premium">
            <AnimatedSection>
              <h2 className="text-display-sm text-neutral-900 text-center mb-16">
                Continue reading.
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((relPost, i) => (
                <AnimatedSection key={relPost.slug} delay={i * 0.08}>
                  <Card
                    variant="premium"
                    href={`/insights/${relPost.slug}`}
                    className="overflow-hidden h-full"
                  >
                    <ImageContainer
                      src={relPost.imageUrl}
                      alt={relPost.title}
                      aspectRatio="16/9"
                      className="!rounded-none"
                    />
                    <div className="p-6 lg:p-8">
                      <span className="text-xs font-medium uppercase tracking-widest text-brand-600">
                        {relPost.category}
                      </span>
                      <h3 className="text-lg font-medium text-neutral-900 mt-3 line-clamp-2">
                        {relPost.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-4 text-body-sm">
                        <span>{formatDate(relPost.publishedDate)}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{relPost.readTime}</span>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="py-12 bg-white border-t border-neutral-200/60">
        <div className="container-narrow text-center">
          <Button href="/insights" variant="ghost">
            All Insights
          </Button>
        </div>
      </section>
    </>
  )
}
