import type { Metadata } from 'next'
import InsightsContent from '@/components/InsightsContent'
import {
  getMergedCategories,
  getMergedFeaturedPosts,
  getMergedPublishedPosts,
} from '@/lib/insights-merge'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Insights | Ficus Logic',
  description:
    'Perspectives on leadership hiring, market intelligence, and executive search strategy.',
}

export default async function InsightsPage() {
  const posts = await getMergedPublishedPosts()
  const featured = await getMergedFeaturedPosts()
  const categories = await getMergedCategories()

  return <InsightsContent posts={posts} featured={featured} categories={categories} />
}
