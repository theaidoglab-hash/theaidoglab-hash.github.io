import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CodingStarterLab from '@/components/coding-starter-lab';
import { SupportNudge } from '@/components/support-nudge';
import { codingStarterLabAgentPromptPack, codingStarterLabAssets, codingStarterLabCopy, codingStarterLabReferenceAsset, codingStarterLabSourcePack } from '@/lib/coding-starter-lab';
import { articlePath, getArticle } from '@/lib/content';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = codingStarterLabCopy[lang];
  const path = `/${lang}/coding-starter-lab`;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.title, description: copy.intro, path })
  };
}

export default async function CodingStarterLabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab')) notFound();
  const copy = codingStarterLabCopy[lang];
  const handoffArticle = getArticle('use-ai-as-a-coding-partner-with-proof');
  return <div className="shell page coding-lab-page">
    <CodingStarterLab
      copy={copy}
      codingStarterLabAssets={codingStarterLabAssets(lang)}
      codingStarterLabReferenceAsset={codingStarterLabReferenceAsset(lang)}
      codingStarterLabAgentPromptPack={codingStarterLabAgentPromptPack()}
      codingStarterLabSourcePack={codingStarterLabSourcePack()}
      handoffArticleHref={handoffArticle ? articlePath(handoffArticle, lang) : undefined}
      portfolioHref={isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner') ? `/${lang}/portfolio-evidence-planner?starter=coding-starter#portfolio-capstone` : undefined}
    />
    <SupportNudge locale={lang} />
  </div>;
}
