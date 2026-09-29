import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReaderJourneyNavigation } from '@/components/reader-journey-links';
import Search, { type ResourceSearchFilterState } from '@/components/search';
import { getResourceSearchEntries } from '@/lib/content';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

// Static hosting renders the canonical unfiltered catalogue. Request-time
// filtering remains available in the Cloudflare runtime.
export const dynamic = 'force-static';

const resourceCopy: Record<Locale, { eyebrow: string; title: string; intro: string }> = canonicalLocaleRecord({
  'zh-HK': { eyebrow: '資源庫', title: '所有指南', intro: '按主題、格式或技能搜尋整個資源庫；每篇指南都會連回一個可落手做的下一步。' },
  'zh-TW': { eyebrow: '資源庫', title: '所有指南', intro: '依主題、格式或技能搜尋整個資源庫；每篇指南都會連回一個可實作的下一步。' },
  'zh-Hans': { eyebrow: '资源库', title: '全部指南', intro: '按主题、格式或技能搜索整个资源库；每篇指南都会连回一个可动手做的下一步。' },
  en: { eyebrow: 'LIBRARY', title: 'All guides', intro: 'Search the whole library by topic, format, or skill. Every guide points to a practical next step.' }
});

const RESOURCE_PAGE_SIZE = 12;

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = resourceCopy[lang];
  const path = `/${lang}/resources`;
  return { title: copy.title, description: copy.intro, alternates: localizedAlternates(path), ...pageSocialMetadata({ title: copy.title, description: copy.intro, path }) };
}

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function resourceFilters(searchParams: Record<string, string | string[] | undefined>): ResourceSearchFilterState {
  const query = (firstSearchParam(searchParams.q) ?? '').trim().slice(0, 160);
  const requestedType = firstSearchParam(searchParams.type) ?? 'all';
  const requestedCategory = firstSearchParam(searchParams.category) ?? 'all';
  const requestedFreshness = firstSearchParam(searchParams.freshness) ?? 'all';
  const requestedAudience = firstSearchParam(searchParams.audience) ?? 'all';
  const requestedEffort = firstSearchParam(searchParams.effort) ?? 'all';
  const type = ['all', 'deep-dive', 'tutorial', 'portfolio-build', 'resource-guide'].includes(requestedType) ? requestedType : 'all';
  const category = ['all', 'ai-engineering-interviews', 'ai-engineering-foundations', 'ai-engineering-career', 'portfolio-evidence', 'professional-workflows', 'low-code-ai-builders', 'ai-for-coders', 'resources-opportunities'].includes(requestedCategory) ? requestedCategory : 'all';
  const freshness = ['all', '90', '365'].includes(requestedFreshness) ? requestedFreshness : 'all';
  const audience = ['all', 'non-coder', 'developer'].includes(requestedAudience) ? requestedAudience : 'all';
  const effort = ['all', 'quick', 'session', 'project'].includes(requestedEffort) ? requestedEffort : 'all';
  return { query, type, category, freshness, audience, effort };
}

function resourcePage(searchParams: Record<string, string | string[] | undefined>) {
  const rawPage = firstSearchParam(searchParams.page) ?? '1';
  if (!/^\d+$/.test(rawPage)) return 1;
  return Math.min(Math.max(Number.parseInt(rawPage, 10), 1), 1000);
}

export default async function Resources({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('resources')) notFound();
  const resolvedSearchParams = await searchParams;
  const filters = resourceFilters(resolvedSearchParams);
  const matchingArticles = getResourceSearchEntries(lang, filters);
  const totalPages = Math.max(1, Math.ceil(matchingArticles.length / RESOURCE_PAGE_SIZE));
  const currentPage = Math.min(resourcePage(resolvedSearchParams), totalPages);
  const firstArticleIndex = (currentPage - 1) * RESOURCE_PAGE_SIZE;
  const visibleArticles = matchingArticles.slice(firstArticleIndex, firstArticleIndex + RESOURCE_PAGE_SIZE);
  const copy = resourceCopy[lang];
  return <div className="shell page"><header className="page-header"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p></header><ReaderJourneyNavigation locale={lang}/><Search articles={visibleArticles} locale={lang} filters={filters} totalResults={matchingArticles.length} currentPage={currentPage} totalPages={totalPages} pageSize={RESOURCE_PAGE_SIZE}/></div>;
}
