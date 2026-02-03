import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.DOMAIN ?? 'minecrox.ktoxz.id.vn'
  const base = `https://${domain}`

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/upload', '/terms', '/dmca', '/report'],
      // File pages are private-by-link and set noindex, but we also disallow crawling.
      disallow: ['/files/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
