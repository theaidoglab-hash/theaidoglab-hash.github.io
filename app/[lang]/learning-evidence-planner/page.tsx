import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LearningEvidencePlanner from '@/components/learning-evidence-planner';
import { SupportNudge } from '@/components/support-nudge';
import { learningEvidencePlannerCopy } from '@/lib/learning-evidence-planner';
import { learningEvidenceProbeCopy } from '@/lib/learning-evidence-probe';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = learningEvidencePlannerCopy[lang];
  const path = `/${lang}/learning-evidence-planner`;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.title, description: copy.intro, path })
  };
}

export default async function LearningEvidencePlannerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('learning-evidence-planner')) notFound();
  return <div className="shell page planner-page"><LearningEvidencePlanner locale={lang} probeCopy={learningEvidenceProbeCopy[lang]} /><SupportNudge locale={lang} /></div>;
}
