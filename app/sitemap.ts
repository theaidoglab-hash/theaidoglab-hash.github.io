import type { MetadataRoute } from 'next';
import { getArticles, getLab } from '@/lib/content';
import { getReleaseScopedInterviewTopics } from '@/lib/release-learning-content';
import { getReleaseScopedSeries, isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { CATEGORY_IDS, LOCALES } from '@/lib/types';

export const dynamic = 'force-static';

function localizedUrls(origin: string, suffix: string) {
  return {
    ...Object.fromEntries(LOCALES.map(locale => [locale, `${origin}/${locale}${suffix}`])),
    'x-default': `${origin}/zh-Hant${suffix}`
  };
}

function localizedEntries(origin: string, suffix: string, lastModified: Date): MetadataRoute.Sitemap {
  return LOCALES.map(locale => ({
    url: `${origin}/${locale}${suffix}`,
    lastModified,
    alternates: { languages: localizedUrls(origin, suffix) }
  }));
}

function newestCategoryUpdate(category: string, articles: ReturnType<typeof getArticles>) {
  const timestamps = articles
    .filter(article => article.categoryId === category)
    .map(article => Date.parse(article.updatedAt));
  return new Date(timestamps.length ? Math.max(...timestamps) : Date.parse('2026-09-22'));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = (process.env.SITE_ORIGIN || 'https://preview.invalid').replace(/\/$/, '');
  const articles = getArticles();
  const routeEnabled = isRouteSurfaceEnabledInCurrentBuild;
  const staticRoutes = [
    { suffix: '', updatedAt: '2026-09-26', surface: 'home' },
    { suffix: '/interview-lab', updatedAt: '2026-09-25', surface: 'interview-lab' },
    { suffix: '/learning-evidence-planner', updatedAt: '2026-09-25', surface: 'learning-evidence-planner' },
    { suffix: '/portfolio-evidence-planner', updatedAt: '2026-09-25', surface: 'portfolio-evidence-planner' },
    { suffix: '/no-code-starter-lab', updatedAt: '2026-09-25', surface: 'no-code-starter-lab' },
    { suffix: '/coding-starter-lab', updatedAt: '2026-09-25', surface: 'coding-starter-lab' },
    { suffix: '/resources', updatedAt: '2026-09-22', surface: 'resources' },
    { suffix: '/support', updatedAt: '2026-09-22', surface: 'support' },
    { suffix: '/about', updatedAt: '2026-09-22', surface: 'about' },
    { suffix: '/privacy', updatedAt: '2026-09-22', surface: 'privacy' }
  ];
  const staticEntries = staticRoutes
    .filter(route => routeEnabled(route.surface))
    .flatMap(route => localizedEntries(origin, route.suffix, new Date(route.updatedAt)));

  const lab = getLab('build-lab');
  const labEntries = lab && routeEnabled('labs') ? localizedEntries(origin, '/labs', new Date(lab.updatedAt)) : [];
  const seriesEntries = routeEnabled('series')
    ? getReleaseScopedSeries()
      .filter(seriesItem => seriesItem.id !== 'ai-engineer-interviews')
      .flatMap(seriesItem => localizedEntries(origin, `/series/${seriesItem.id}`, new Date(seriesItem.updatedAt)))
    : [];
  const categoryEntries = routeEnabled('categories')
    ? CATEGORY_IDS.flatMap(category => localizedEntries(origin, `/categories/${category}`, newestCategoryUpdate(category, articles)))
    : [];
  const interviewEntries = routeEnabled('interview-lab')
    ? getReleaseScopedInterviewTopics().flatMap(topic => localizedEntries(origin, `/interview-lab/${topic.slug}`, new Date('2026-09-24')))
    : [];
  const articleEntries = routeEnabled('article-downloads')
    ? articles
      .flatMap(article => localizedEntries(origin, `/articles/${article.slug}`, new Date(article.updatedAt)))
    : [];

  return [...staticEntries, ...labEntries, ...seriesEntries, ...categoryEntries, ...interviewEntries, ...articleEntries];
}
