import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.DOMAIN ?? 'minecrox.ktoxz.id.vn'
  const base = `https://${domain}`
  const lastModified = new Date()

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${base}/upload`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/report`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${base}/dmca`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
