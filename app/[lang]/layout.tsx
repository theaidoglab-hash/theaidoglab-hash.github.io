import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Footer, Header } from '@/components/site';
import { isLocale } from '@/lib/i18n';
import { pageSocialMetadata } from '@/lib/site-metadata';
import { LOCALES } from '@/lib/types';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// A preview must remain undiscoverable. `npm run build:release` checks the
// same explicit owner gate before it reaches this build-time metadata branch.
const allowPublicIndexing = process.env.OWNER_PUBLICATION_APPROVED === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_ORIGIN || 'https://preview.invalid'),
  title: { default: 'AI.DOG Learning & Portfolio Library', template: '%s · AI.DOG' },
  description: 'Evidence-led guides for learning AI, designing systems, and building portfolio work another person can inspect.',
  robots: { index: allowPublicIndexing, follow: allowPublicIndexing },
  ...pageSocialMetadata({
    title: 'AI.DOG Learning & Portfolio Library',
    description: 'Evidence-led guides for learning AI, designing systems, and building portfolio work another person can inspect.',
    path: '/en'
  })
};

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <>
    <Header locale={lang} />
    <main id="main-content" lang={lang} tabIndex={-1}>{children}</main>
    <Footer locale={lang} />
  </>;
}
