import type { Metadata } from 'next'
import { getPublishedPosts, getFeaturedPosts, getCategories } from '@/data/insights'
import InsightsContent from '@/components/InsightsContent'

export const metadata: Metadata = {
  title: 'Insights | Ficus Logic',
  description:
    'Perspectives on leadership hiring, market intelligence, and executive search strategy.',
}

export default function InsightsPage() {
  const posts = getPublishedPosts()
  const featured = getFeaturedPosts()
  const categories = getCategories()

  return <InsightsContent posts={posts} featured={featured} categories={categories} />
}
