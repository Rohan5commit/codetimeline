import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://codetimeline.vercel.app'

const FEATURED_REPOS = [
  { owner: 'facebook', repo: 'react' },
  { owner: 'vercel', repo: 'next.js' },
  { owner: 'expressjs', repo: 'express' },
  { owner: 'vuejs', repo: 'vue' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const static_routes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
  ]

  const timeline_routes: MetadataRoute.Sitemap = FEATURED_REPOS.map(({ owner, repo }) => ({
    url: `${BASE}/timeline/${owner}/${repo}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...static_routes, ...timeline_routes]
}
