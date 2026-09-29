/** Public locale contract. Legacy regional Traditional-Chinese inputs are normalized at boundaries. */
export const LOCALES = ['zh-Hant', 'zh-Hans', 'en'] as const;
export type Locale = typeof LOCALES[number];
export type StaticAssetLocale = 'zh-TW' | 'zh-Hans' | 'en';

/**
 * Generated downloads retain their reviewed source-locale filenames. The
 * public zh-Hant experience uses the written Traditional-Chinese assets while
 * legacy Hong Kong filenames remain available only for compatibility.
 */
export function staticAssetLocale(locale: Locale): StaticAssetLocale {
  return locale === 'zh-Hant' ? 'zh-TW' : locale;
}

export function staticAssetHref(href: string): string {
  return href
    .replace(/\.zh-(?:Hant|HK)(?=\.)/g, '.zh-TW')
    .replace(/\/zh-(?:Hant|HK)(?=\.|\/|$)/g, '/zh-TW');
}

export const LEGACY_TRADITIONAL_LOCALES = ['zh-HK', 'zh-TW'] as const;
export type LegacyTraditionalLocale = typeof LEGACY_TRADITIONAL_LOCALES[number];
export type LocaleSource = Locale | LegacyTraditionalLocale;
export type LocaleSourceRecord<Value> = Record<'zh-Hans' | 'en', Value> &
  Partial<Record<'zh-Hant' | LegacyTraditionalLocale, Value>>;

/**
 * Converts source locale records into the public locale contract. A dedicated
 * zh-Hant value wins; otherwise use the reviewed written Traditional-Chinese
 * source. Colloquial zh-HK source values must not silently reach the public
 * zh-Hant route.
 */
export function canonicalLocaleRecord<Value>(source: LocaleSourceRecord<Value>): Record<Locale, Value> {
  const traditional = source['zh-Hant'] ?? source['zh-TW'];

  if (traditional === undefined) {
    throw new Error('Written Traditional-Chinese content is required for a public locale record.');
  }

  return {
    'zh-Hant': normalizeLocaleContent(traditional),
    'zh-Hans': normalizeLocaleContent(source['zh-Hans']),
    en: normalizeLocaleContent(source.en),
  };
}

/**
 * Deeply normalizes legacy source payloads before they enter runtime public
 * content. Source JSON may retain regional keys for editorial provenance, but
 * rendered data must expose only the neutral zh-Hant contract.
 */
export function normalizeLocaleContent<Value>(value: Value): Value {
  if (typeof value === 'string') {
    return value
      .replace(/^(?:zh-HK|zh-TW|zh-MO)$/, 'zh-Hant')
      .replace(/\/zh-(?:HK|TW)(?=\.|\/|$)/g, '/zh-Hant')
      .replace(/\.zh-(?:HK|TW)(?=\.)/g, '.zh-Hant')
      .replace(/(?:繁體中文|繁中)（(?:香港|台灣)）/g, '繁體中文') as Value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeLocaleContent(item)) as Value;
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const normalized = Object.fromEntries(
      Object.entries(source)
        .filter(([key]) => key !== 'zh-HK' && key !== 'zh-TW' && key !== 'zh-MO')
        .map(([key, item]) => [key, normalizeLocaleContent(item)]),
    ) as Record<string, unknown>;
    const hasRegionalTraditionalSource = 'zh-HK' in source || 'zh-TW' in source || 'zh-MO' in source;
    const traditional = source['zh-Hant'] ?? source['zh-TW'];

    if (hasRegionalTraditionalSource && traditional === undefined) {
      throw new Error('Written Traditional-Chinese content is required when normalizing a regional Traditional-Chinese source.');
    }

    if (traditional !== undefined) {
      normalized['zh-Hant'] = normalizeLocaleContent(traditional);
    }

    return normalized as Value;
  }

  return value;
}
export const CATEGORY_IDS = ['ai-engineering-interviews', 'ai-engineering-foundations', 'ai-engineering-career', 'portfolio-evidence', 'professional-workflows', 'low-code-ai-builders', 'ai-for-coders', 'resources-opportunities'] as const;
export type CategoryId = typeof CATEGORY_IDS[number];
export type ArticleType = 'deep-dive' | 'tutorial' | 'portfolio-build' | 'resource-guide';
export type ResourceAudience = 'non-coder' | 'developer';
export type ResourceEffort = 'quick' | 'session' | 'project';
export type DownloadAsset = { id: string; locale: Locale; label: string; href: string; format: 'pdf' | 'markdown'; version: string };
export type PortfolioRepository = {
  url: string;
  ref: string;
  testedCommand: string;
  sourceLanguage: 'en';
  readmeUrls: Record<Locale, string>;
  verifiedAt: string;
};
export type ArticleMeta = {
  id: string; slug: string; type: ArticleType; categoryId: CategoryId; tags: string[];
  status: 'draft' | 'review' | 'approved'; visibility: 'public'; learningObjectives: string[];
  sourceUrls: string[]; relatedArticleSlugs?: string[]; relatedThreadUrls?: string[]; downloads: DownloadAsset[];
  portfolioRepository?: PortfolioRepository;
  publishedAt: string; updatedAt: string; reviewedAt: string; reviewBy: string;
  translations: Record<Locale, { title: string; description: string }>;
};
export type ResourceSearchEntry = Pick<ArticleMeta, 'id' | 'slug' | 'type' | 'categoryId' | 'tags' | 'updatedAt'> & {
  title: string;
  description: string;
  audiences: ResourceAudience[];
  effort: ResourceEffort;
  estimatedMinutes: number;
};
export type LabCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  workflowPath?: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: Array<{
      id: string;
      title: string;
      text: string;
      href: string;
      action: string;
    }>;
    boundary: string;
  };
  kits: Array<{
    title: string;
    kind: string;
    text: string;
    steps: string[];
    demonstrates: { technical: string[]; nonTechnical: string[] };
    articleSlug?: string;
    internalRoute?: string;
    action: string;
  }>;
  note: string;
};
export type LabMeta = {
  id: string;
  status: 'review' | 'approved';
  visibility: 'public';
  updatedAt: string;
  reviewBy: string;
  relatedArticleSlugs: string[];
  translations: Record<Locale, LabCopy>;
};
export type ReaderPathCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  browse: string;
  paths: Array<{
    title: string;
    description: string;
    action: string;
    kind: 'series' | 'labs' | 'article' | 'planner' | 'interview-lab';
    target: string;
  }>;
};
export type ReaderPathMeta = {
  id: string;
  status: 'review' | 'approved';
  visibility: 'public';
  updatedAt: string;
  reviewBy: string;
  relatedArticleSlugs: string[];
  translations: Record<Locale, ReaderPathCopy>;
};
