import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { getReleaseScopedRoadmap } from '@/lib/release-learning-content';
import { isRouteSurfaceEnabledInCurrentBuild, isSeriesEnabledInCurrentBuild } from '@/lib/release-server-scope';

/**
 * Keep old bookmarks working while the homepage owns the only start route.
 */
export function generateStaticParams() { return localeStaticParams(); }

export default async function StartHereRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('home')) notFound();
  const hasLearnerStart = isSeriesEnabledInCurrentBuild('ai-engineer-roadmap')
    || Boolean(getReleaseScopedRoadmap()?.stages.some(stage => stage.number === '00'))
    || [
      'no-code-starter-lab',
      'coding-starter-lab',
      'labs',
      'resources',
      'portfolio-evidence-planner',
      'interview-lab'
    ].some(isRouteSurfaceEnabledInCurrentBuild);
  const destination = `/${lang}${hasLearnerStart ? '#learner-start' : '#start-here'}`;
  return <section className="shell page"><p><Link href={destination}>Continue to AI.DOG</Link></p></section>;
}
