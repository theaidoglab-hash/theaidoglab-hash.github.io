import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// Keep the crawler policy aligned with the locale metadata. A local review
// build remains undiscoverable until the owner explicitly approves release.
const allowPublicIndexing = process.env.OWNER_PUBLICATION_APPROVED === 'true';

export default function robots(): MetadataRoute.Robots {
  const origin = (process.env.SITE_ORIGIN || 'https://preview.invalid').replace(/\/$/, '');
  return {
    rules: allowPublicIndexing
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    ...(allowPublicIndexing ? { sitemap: `${origin}/sitemap.xml` } : {})
  };
}
