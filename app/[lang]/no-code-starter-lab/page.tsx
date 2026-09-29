import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoCodeStarterLab from '@/components/no-code-starter-lab';
import { SupportNudge } from '@/components/support-nudge';
import { articlePath, getArticle } from '@/lib/content';
import { noCodeStarterLabCopy } from '@/lib/no-code-starter-lab';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isReleaseAssetEnabledInCurrentBuild, isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = noCodeStarterLabCopy[lang];
  const path = `/${lang}/no-code-starter-lab`;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.title, description: copy.intro, path })
  };
}

export default async function NoCodeStarterLabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab')) notFound();
  const copy = noCodeStarterLabCopy[lang];
  const handoffArticle = getArticle('approval-queue-low-code-portfolio');
  const sourcePackPath = 'templates/no-code-starter-lab/v1/no-code-starter-lab-source-pack.md';
  return <div className="shell page no-code-lab-page">
    <NoCodeStarterLab
      locale={lang}
      copy={copy}
      sourcePackHref={isReleaseAssetEnabledInCurrentBuild('templates', sourcePackPath) ? `/${sourcePackPath}` : undefined}
      handoffArticleHref={handoffArticle ? articlePath(handoffArticle, lang) : undefined}
      portfolioHref={isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner') ? `/${lang}/portfolio-evidence-planner?starter=no-code#portfolio-capstone` : undefined}
    />
    <SupportNudge locale={lang} />
  </div>;
}
