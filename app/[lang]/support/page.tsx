import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SupportCard } from '@/components/support-card';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { supportCopy } from '@/lib/support';

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = supportCopy[lang];
  const path = `/${lang}/support`;
  return {
    title: copy.pageTitle,
    description: copy.pageIntro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.pageTitle, description: copy.pageIntro, path })
  };
}

export default async function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('support')) notFound();
  const copy = supportCopy[lang];
  return <div className="article-shell page support-page">
    <header className="page-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.pageTitle}</h1>
      <p>{copy.pageIntro}</p>
    </header>
    <SupportCard locale={lang} />
    <article className="prose support-details">
      <h2>{copy.useOfSupportTitle}</h2>
      <p>{copy.useOfSupport}</p>
    </article>
  </div>;
}
