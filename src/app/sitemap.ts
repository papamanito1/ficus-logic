import type { MetadataRoute } from 'next'
import { getActiveJobs } from '@/data/careers'
import { getPublishedPosts } from '@/data/insights'

const BASE_URL = 'https://ficuslogic.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BASE_URL}/somika-ai`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/leadership-hiring`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/niche-hiring`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/industries`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/global-presence`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/insights`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.6 },
  ]

  const jobPages = getActiveJobs().map((job) => ({
    url: `${BASE_URL}/careers/${job.slug}`,
    lastModified: new Date(job.postedDate),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const blogPages = getPublishedPosts().map((post) => ({
    url: `${BASE_URL}/insights/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...jobPages, ...blogPages]
}
