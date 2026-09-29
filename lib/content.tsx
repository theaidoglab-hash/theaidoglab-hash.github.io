import React from 'react';
import rawArticles from '@/content/articles.json';
import rawBodies from '@/content/article-bodies.json';
import rawLabs from '@/content/labs.json';
import rawReaderPaths from '@/content/reader-paths.json';
import rawCategoryOverrides from '@/content/public-category-overrides.json';
import { extractArticleOutline, parseArticleMarkdownHeading } from './article-outline';
import { createArticleLearningContract } from './article-learning-contract';
import { getActiveReleaseScope } from './release-runtime-scope-current';
import { selectContentForReleaseScope } from './release-content-selection';
import { getScopedSelectionIds } from './release-runtime-scope';
import { buildResourceSearchClauses, matchesResourceSearchClauses, normalizeResourceSearchText } from './resource-search';
import { roadmapArticleContext } from './roadmaps';
import { CATEGORY_IDS, LOCALES, normalizeLocaleContent, type ArticleMeta, type CategoryId, type LabMeta, type Locale, type ReaderPathMeta, type ResourceAudience, type ResourceEffort, type ResourceSearchEntry } from './types';

const categoryOverrides = rawCategoryOverrides as Record<string, CategoryId>;
const rawArticleRecords = normalizeLocaleContent(rawArticles) as unknown as Array<Omit<ArticleMeta, 'categoryId'> & { categoryId: string }>;
const articles = rawArticleRecords.map(article => ({
  ...article,
  categoryId: categoryOverrides[article.id] ?? (article.categoryId as CategoryId)
})) as ArticleMeta[];
const labs = normalizeLocaleContent(rawLabs) as unknown as LabMeta[];
const readerPaths = normalizeLocaleContent(rawReaderPaths) as unknown as ReaderPathMeta[];
const articleBodies = normalizeLocaleContent(rawBodies) as unknown as Record<string, Record<Locale, string>>;

export function getArticles() {
  const scope = getActiveReleaseScope();
  return selectContentForReleaseScope(
    articles,
    getScopedSelectionIds('articles', scope),
  );
}
type ResourceSearchFilters = {
  query?: string;
  type?: string;
  category?: string;
  freshness?: string;
  audience?: string;
  effort?: string;
};

const nonCoderCategories = new Set<CategoryId>([
  'ai-engineering-career',
  'portfolio-evidence',
  'professional-workflows',
  'low-code-ai-builders',
  'resources-opportunities',
]);

const developerCategories = new Set<CategoryId>([
  'ai-engineering-interviews',
  'ai-engineering-foundations',
  'ai-engineering-career',
  'portfolio-evidence',
  'professional-workflows',
  'ai-for-coders',
  'resources-opportunities',
]);

function resourceAudiences(article: ArticleMeta): ResourceAudience[] {
  const audiences: ResourceAudience[] = [];
  if (nonCoderCategories.has(article.categoryId)) audiences.push('non-coder');
  if (developerCategories.has(article.categoryId)) audiences.push('developer');
  return audiences.length ? audiences : ['developer'];
}

function resourceEffort(estimatedMinutes: number): ResourceEffort {
  if (estimatedMinutes <= 30) return 'quick';
  if (estimatedMinutes <= 90) return 'session';
  return 'project';
}

export function getResourceSearchEntries(locale: Locale, filters: ResourceSearchFilters = {}): ResourceSearchEntry[] {
  const availableArticles = getArticles();
  const newestUpdate = Math.max(...availableArticles.map(article => new Date(`${article.updatedAt}T00:00:00Z`).getTime()));
  const queryClauses = buildResourceSearchClauses(filters.query ?? '');
  return availableArticles.map(article => {
    const body = articleBodies[article.id]?.[locale] ?? '';
    const headings = extractArticleOutline(body).map(heading => heading.text);
    const searchText = normalizeResourceSearchText([
      article.translations[locale].title,
      article.translations[locale].description,
      ...article.tags,
      ...article.learningObjectives,
      ...headings,
      body,
    ].join(' '));
    const ageDays = (newestUpdate - new Date(`${article.updatedAt}T00:00:00Z`).getTime()) / 86400000;
    const contract = createArticleLearningContract({
      article,
      body,
      locale,
      roadmapContext: roadmapArticleContext(article.slug),
    });
    const estimatedMinutes = contract.readingMinutes.maximum + contract.practiceMinutes.maximum;
    const audiences = resourceAudiences(article);
    const effort = resourceEffort(estimatedMinutes);
    const matches = matchesResourceSearchClauses(searchText, queryClauses)
      && (!filters.type || filters.type === 'all' || article.type === filters.type)
      && (!filters.category || filters.category === 'all' || article.categoryId === filters.category)
      && (!filters.freshness || filters.freshness === 'all' || ageDays <= Number(filters.freshness))
      && (!filters.audience || filters.audience === 'all' || audiences.includes(filters.audience as ResourceAudience))
      && (!filters.effort || filters.effort === 'all' || effort === filters.effort);
    return {
      matches,
      entry: {
        id: article.id,
        slug: article.slug,
        type: article.type,
        categoryId: article.categoryId,
        tags: article.tags,
        updatedAt: article.updatedAt,
        title: article.translations[locale].title,
        description: article.translations[locale].description,
        audiences,
        effort,
        estimatedMinutes,
      } satisfies ResourceSearchEntry,
    };
  }).filter(result => result.matches).map(result => result.entry);
}
export function getArticle(slug:string) { return getArticles().find(a => a.slug === slug); }
export function getCategoryArticles(category:CategoryId) { return getArticles().filter(a => a.categoryId === category); }
export function getLab(id:string) {
  const scope = getActiveReleaseScope();
  return selectContentForReleaseScope(
    labs,
    getScopedSelectionIds('labs', scope),
  ).find(lab => lab.id === id);
}
export function getReaderPath(id:string) {
  const scope = getActiveReleaseScope();
  return selectContentForReleaseScope(
    readerPaths,
    getScopedSelectionIds('readerPaths', scope),
  ).find(path => path.id === id);
}
export function getRelatedArticles(article:ArticleMeta) {
  const related = new Set(article.relatedArticleSlugs ?? []);
  return getArticles().filter(candidate => candidate.slug !== article.slug && related.has(candidate.slug));
}
export function articlePath(article:ArticleMeta, locale:Locale) { return `/${locale}/articles/${article.slug}`; }

export function readArticle(article:ArticleMeta, locale:Locale) {
  return articleBodies[article.id][locale];
}

function safeContentHref(value:string):string | undefined {
  const href = value.trim();
  if (href.startsWith('#')) return href;
  if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/\\')) return href;
  try {
    return new URL(href).protocol === 'https:' ? href : undefined;
  } catch {
    return undefined;
  }
}

function inline(text:string, key:string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('`')) return <code key={`${key}-${i}`}>{part.slice(1,-1)}</code>;
    if (part.startsWith('**')) return <strong key={`${key}-${i}`}>{part.slice(2,-2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeContentHref(link[2]);
      return href
        ? <a key={`${key}-${i}`} href={href}>{link[1]}</a>
        : <React.Fragment key={`${key}-${i}`}>{link[1]}</React.Fragment>;
    }
    return <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>;
  });
}

type TableAlignment = 'left' | 'center' | 'right' | undefined;

function splitTableRow(line:string) {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return null;

  const hasLeadingPipe = trimmed.startsWith('|');
  let trailingBackslashes = 0;
  for (let index = trimmed.length - 2; index >= 0 && trimmed[index] === '\\'; index -= 1) trailingBackslashes += 1;
  const hasTrailingPipe = trimmed.endsWith('|') && trailingBackslashes % 2 === 0;
  const cells:string[] = [];
  let cell = '';

  for (let index = 0; index < trimmed.length; index += 1) {
    const character = trimmed[index];
    if (character === '\\' && trimmed[index + 1] === '|') {
      cell += '|';
      index += 1;
    } else if (character === '|') {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());

  if (hasLeadingPipe) cells.shift();
  if (hasTrailingPipe) cells.pop();
  return cells.length ? cells : null;
}

function tableAlignment(cell:string):TableAlignment {
  const value = cell.trim();
  if (!/^:?-{3,}:?$/.test(value)) return undefined;
  if (value.startsWith(':') && value.endsWith(':')) return 'center';
  if (value.endsWith(':')) return 'right';
  return 'left';
}

function tableAt(lines:string[], index:number) {
  const headers = splitTableRow(lines[index] ?? '');
  const divider = splitTableRow(lines[index + 1] ?? '');
  if (!headers || !divider || headers.length !== divider.length) return null;

  const alignments = divider.map(tableAlignment);
  if (alignments.some(alignment => !alignment)) return null;

  const rows:string[][] = [];
  let next = index + 2;
  while (next < lines.length) {
    const row = splitTableRow(lines[next]);
    if (!row || row.length !== headers.length) break;
    rows.push(row);
    next += 1;
  }
  return { headers, alignments, rows, next };
}

export function renderMarkdown(markdown:string, tableLabel = 'Scrollable data table', codeLabel = 'Scrollable code block') {
  const lines = markdown.split(/\r?\n/);
  const outline = extractArticleOutline(markdown);
  const nodes:React.ReactNode[] = [];
  let list:string[]=[]; let orderedList:string[]=[]; let quote:string[]=[]; let code:string[]=[]; let inCode=false; let language=''; let outlineIndex=0;
  const flushList=()=>{ if(list.length){ nodes.push(<ul key={`ul-${nodes.length}`}>{list.map((v,i)=><li key={i}>{inline(v,`li-${nodes.length}-${i}`)}</li>)}</ul>); list=[]; }};
  const flushOrderedList=()=>{ if(orderedList.length){ nodes.push(<ol key={`ol-${nodes.length}`}>{orderedList.map((v,i)=><li key={i}>{inline(v,`ol-${nodes.length}-${i}`)}</li>)}</ol>); orderedList=[]; }};
  const flushQuote=()=>{ if(quote.length){ nodes.push(<blockquote key={`q-${nodes.length}`}>{quote.map((v,i)=><p key={i}>{inline(v,`q-${i}`)}</p>)}</blockquote>); quote=[]; }};
  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const line=raw.trimEnd();
    if(line.startsWith('```')) { if(inCode){ nodes.push(<pre key={`pre-${nodes.length}`} role="region" aria-label={codeLabel} tabIndex={0}><code data-language={language}>{code.join('\n')}</code></pre>); code=[]; inCode=false; } else { flushList(); flushOrderedList(); flushQuote(); inCode=true; language=line.slice(3); } continue; }
    if(inCode){ code.push(raw); continue; }
    if(line.startsWith('- ')){ flushQuote(); flushOrderedList(); list.push(line.slice(2)); continue; }
    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    if(orderedItem){ flushQuote(); flushList(); orderedList.push(orderedItem[1]); continue; }
    if(line === '>'){ flushList(); flushOrderedList(); continue; }
    if(line.startsWith('> ')){ flushList(); flushOrderedList(); quote.push(line.slice(2)); continue; }
    flushList(); flushOrderedList(); flushQuote();
    if(!line.trim()) continue;
    const markdownHeading = parseArticleMarkdownHeading(line);
    if(markdownHeading) {
      const outlineHeading = outline[outlineIndex++];
      const Tag = markdownHeading.level === 3 ? 'h3' : 'h2';
      nodes.push(<Tag id={outlineHeading?.id} key={`${Tag}-${nodes.length}`}>{inline(markdownHeading.sourceText,`${Tag}-${nodes.length}`)}</Tag>);
      continue;
    }
    const table = tableAt(lines, index);
    if (table) {
      const tableKey = `table-${nodes.length}`;
      nodes.push(
        <div className="table-scroll" role="region" aria-label={tableLabel} tabIndex={0} key={tableKey}>
          <table>
            <thead>
              <tr>{table.headers.map((cell, cellIndex) => <th key={cellIndex} scope="col" style={{ textAlign: table.alignments[cellIndex] }}>{inline(cell, `${tableKey}-head-${cellIndex}`)}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} style={{ textAlign: table.alignments[cellIndex] }}>{inline(cell, `${tableKey}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>,
      );
      index = table.next - 1;
      continue;
    }
    nodes.push(<p key={`p-${nodes.length}`}>{inline(line,`p-${nodes.length}`)}</p>);
  }
  flushList(); flushOrderedList(); flushQuote();
  return nodes;
}

export function validateRuntimeContent() {
  const ids=new Set<string>(); const slugs=new Set<string>();
  for(const article of articles){
    if(ids.has(article.id)||slugs.has(article.slug)) throw new Error(`Duplicate article: ${article.id}`);
    ids.add(article.id); slugs.add(article.slug);
    if(!CATEGORY_IDS.includes(article.categoryId)) throw new Error(`Invalid category: ${article.id}`);
    for(const locale of LOCALES){
      if(!article.translations[locale]) throw new Error(`Missing translation metadata: ${article.id}/${locale}`);
      if(!articleBodies[article.id]?.[locale]) throw new Error(`Missing article: ${article.id}/${locale}`);
    }
  }
}
