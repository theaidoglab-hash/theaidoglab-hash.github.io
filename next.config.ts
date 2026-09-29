import type { NextConfig } from 'next';

const githubPagesBuild = process.env.GITHUB_PAGES === 'true';
const staticSiteOrigin = process.env.GITHUB_PAGES_SITE_ORIGIN ?? process.env.SITE_ORIGIN ?? '';

const nextConfig: NextConfig = {
  // Next's static-render workers only receive values explicitly exposed in
  // config. Keep the non-secret release inputs deterministic in the emitted
  // metadata, sitemap, RSS feed and robots.txt.
  env: githubPagesBuild ? {
    SITE_ORIGIN: staticSiteOrigin,
    AIDOG_RELEASE_BUILD: process.env.AIDOG_RELEASE_BUILD ?? '',
    OWNER_PUBLICATION_APPROVED: process.env.OWNER_PUBLICATION_APPROVED ?? '',
    PRIVACY_EMAIL: process.env.PRIVACY_EMAIL ?? ''
  } : undefined,
  // GitHub Pages can only serve files. This build mode deliberately emits no
  // Worker/server bundle, leaving waitlist collection and server-only practice
  // loading unavailable until there is an approved backend.
  ...(githubPagesBuild ? {
    output: 'export' as const,
    trailingSlash: true,
    images: { unoptimized: true }
  } : {
    async headers() {
      return [{
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'DENY' }
        ]
      }];
    }
  })
};

export default nextConfig;
