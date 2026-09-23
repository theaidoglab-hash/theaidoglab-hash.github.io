export const LOCALES = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'] as const;
export type Locale = typeof LOCALES[number];
export const CATEGORY_IDS = ['australia-ai-career', 'roles-pathways', 'portfolio-evidence', 'professional-workflows', 'resources-opportunities'] as const;
export type CategoryId = typeof CATEGORY_IDS[number];
export type ArticleType = 'deep-dive' | 'tutorial' | 'portfolio-build' | 'resource-guide';
export type DownloadAsset = { id: string; locale: Locale; label: string; href: string; format: 'pdf' | 'markdown'; version: string };
export type ArticleMeta = {
  id: string; slug: string; type: ArticleType; categoryId: CategoryId; tags: string[];
  status: 'draft' | 'review' | 'approved'; visibility: 'public'; learningObjectives: string[];
  sourceUrls: string[]; relatedThreadUrls?: string[]; downloads: DownloadAsset[];
  publishedAt: string; updatedAt: string; reviewedAt: string; reviewBy: string;
  translations: Record<Locale, { title: string; description: string }>;
};
