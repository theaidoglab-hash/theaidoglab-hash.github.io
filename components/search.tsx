import Link from 'next/link';
import { Fragment } from 'react';
import type { Locale, ResourceSearchEntry } from '@/lib/types';
import { CATEGORY_IDS } from '@/lib/types';
import { articleTypes, categories, ui } from '@/lib/i18n';

export type ResourceSearchFilterState = {
  query: string;
  type: string;
  category: string;
  freshness: string;
  audience: string;
  effort: string;
};

function resourcePageHref(locale: Locale, filters: ResourceSearchFilterState, page: number) {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.type !== 'all') params.set('type', filters.type);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.freshness !== 'all') params.set('freshness', filters.freshness);
  if (filters.audience !== 'all') params.set('audience', filters.audience);
  if (filters.effort !== 'all') params.set('effort', filters.effort);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/${locale}/resources${query ? `?${query}` : ''}#resource-results`;
}

function visiblePageNumbers(currentPage: number, totalPages: number) {
  const candidates = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...candidates].filter(page => page >= 1 && page <= totalPages).sort((left, right) => left - right);
}

function SearchArticleCard({ article, locale }: { article: ResourceSearchEntry; locale: Locale }) {
  const category = categories[article.categoryId][locale];
  const learnerCopy = locale === 'en'
    ? { nonCoder: 'No code required', developer: 'Developer route', both: 'Code or no-code', minutes: `${article.estimatedMinutes} min total` }
    : locale === 'zh-Hans'
      ? { nonCoder: '不需要写代码', developer: '开发者路线', both: '写或不写代码均可', minutes: `共约 ${article.estimatedMinutes} 分钟` }
      : { nonCoder: '毋須寫程式', developer: '開發者路線', both: '寫或不寫程式皆可', minutes: `合共約 ${article.estimatedMinutes} 分鐘` };
  const audienceLabel = article.audiences.length > 1 ? learnerCopy.both : article.audiences[0] === 'non-coder' ? learnerCopy.nonCoder : learnerCopy.developer;
  return <article className="article-card">
    <div className="card-meta"><span>{category.name}</span><span>{audienceLabel}</span><span>{learnerCopy.minutes}</span><span>{articleTypes[locale][article.type]}</span></div>
    <div className="card-copy"><h2><Link href={`/${locale}/articles/${article.slug}`}>{article.title}</Link></h2><p>{article.description}</p><div className="tags">{article.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></div>
    <Link className="text-link" href={`/${locale}/articles/${article.slug}`}>{ui[locale].read as string}<span className="sr-only">: {article.title}</span> <span aria-hidden>→</span></Link>
  </article>;
}

function ShortGuideEmptyState({ locale, filters, clearLabel }: { locale: Locale; filters: ResourceSearchFilterState; clearLabel: string }) {
  const copy = locale === 'en'
    ? {
        title: 'No matching guide currently fits the selected 30-minute limit.',
        detail: 'The 30-minute filter is still selected. Rather than call a longer guide a 30-minute task, choose a longer session or a bounded local starter below.',
        longerSession: 'See guides for a longer session (up to 90 minutes)',
        starterIntro: 'If you only have 15 minutes, choose the local start that matches you:',
        nonCoderStarter: 'Start the 15-minute no-code practice',
        developerCodingStarter: 'Judge two fixed coding review cases in 15 minutes (no download or code)',
        developerPortfolioStarter: 'Write a portfolio start card in 15 minutes'
      }
    : locale === 'zh-Hans'
      ? {
          title: '目前没有符合所选 30 分钟上限的指南。',
          detail: '30 分钟筛选仍会保留。不会把更长的指南说成 30 分钟任务；你可以选择较长时段，或从下面一个范围明确的本地起点开始。',
          longerSession: '查看较长时段的指南（90 分钟内）',
          starterIntro: '如果你只有 15 分钟，请按自己情况选择一个本地起点：',
          nonCoderStarter: '开始 15 分钟无代码练习',
          developerCodingStarter: '用 15 分钟判断两个固定的程序复核案例（不用下载或写程序）',
          developerPortfolioStarter: '用 15 分钟写一张作品起步卡'
        }
      : {
          title: '目前未有符合所選 30 分鐘上限的指南。',
          detail: '30 分鐘篩選仍會保留。唔會把更長的指南說成 30 分鐘任務；你可以選擇較長時段，或由下面一個範圍明確的本機起點開始。',
          longerSession: '查看較長時段的指南（90 分鐘內）',
          starterIntro: '如果你只有 15 分鐘，請按自己情況選一個本機起點：',
          nonCoderStarter: '開始 15 分鐘無程式練習',
          developerCodingStarter: '用 15 分鐘判斷兩個固定程式覆核案例（毋須下載或寫程式）',
          developerPortfolioStarter: '用 15 分鐘寫一張作品起步卡'
        };
  const longerSessionHref = resourcePageHref(locale, {
    query: '',
    type: 'all',
    category: 'all',
    freshness: 'all',
    audience: filters.audience,
    effort: 'session'
  }, 1);
  const showNonCoderStarter = filters.audience !== 'developer';
  const showDeveloperStarters = filters.audience !== 'non-coder';

  return <div className="empty">
    <p>{copy.title}</p>
    <p>{copy.detail}</p>
    <p><Link className="text-link" href={longerSessionHref}>{copy.longerSession} <span aria-hidden>→</span></Link></p>
    <p>{copy.starterIntro}</p>
    {showNonCoderStarter ? <p><Link className="text-link" href={`/${locale}/no-code-starter-lab#no-code-lab-manual-title`}>{copy.nonCoderStarter} <span aria-hidden>→</span></Link></p> : null}
    {showDeveloperStarters ? <p><Link className="text-link" href={`/${locale}/coding-starter-lab#coding-starter-lab-quick-title`}>{copy.developerCodingStarter} <span aria-hidden>→</span></Link></p> : null}
    {showDeveloperStarters ? <p><Link className="text-link" href={`/${locale}/portfolio-evidence-planner#portfolio-quick-start`}>{copy.developerPortfolioStarter} <span aria-hidden>→</span></Link></p> : null}
    <Link className="text-link" href={`/${locale}/resources#resource-search`}>{clearLabel} <span aria-hidden>→</span></Link>
  </div>;
}

export default function Search({ articles, locale, filters, totalResults, currentPage, totalPages, pageSize }: { articles: ResourceSearchEntry[]; locale: Locale; filters: ResourceSearchFilterState; totalResults: number; currentPage: number; totalPages: number; pageSize: number }) {
  const filterCopy=locale==='en'?{formats:'All formats',categories:'All outcomes',dates:'Any update date',days90:'Updated in 90 days',year:'Updated in 12 months',audiences:'Any coding level',nonCoder:'No code required',developer:'Developer route',efforts:'Any time commitment',quick:'Up to 30 minutes',session:'Up to 90 minutes',project:'Multi-session project'}:locale==='zh-Hans'?{formats:'所有格式',categories:'所有成果方向',dates:'所有更新日期',days90:'90 天内更新',year:'12 个月内更新',audiences:'所有编程程度',nonCoder:'不需要写代码',developer:'开发者路线',efforts:'所有时间长度',quick:'30 分钟内',session:'90 分钟内',project:'需要多次完成'}:{formats:'所有格式',categories:'所有成果方向',dates:'所有更新日期',days90:'90 天內更新',year:'12 個月內更新',audiences:'所有程式程度',nonCoder:'毋須寫程式',developer:'開發者路線',efforts:'所有時間長度',quick:'30 分鐘內',session:'90 分鐘內',project:'需要分段完成'};
  const labelCopy=locale==='en'?{keywords:'Keywords',format:'Format',category:'Outcome',updated:'Updated',audience:'Coding level',effort:'Time needed'}:locale==='zh-Hans'?{keywords:'关键词',format:'格式',category:'预期成果',updated:'更新时间',audience:'编程程度',effort:'所需时间'}:{keywords:'關鍵字',format:'格式',category:'預期成果',updated:'更新時間',audience:'程式程度',effort:'所需時間'};
  const actionCopy=locale==='en'?{submit:'Search',clear:'Clear filters',results:'Guide results'}:locale==='zh-Hans'?{submit:'搜索',clear:'清除筛选',results:'指南结果'}:locale==='zh-Hant'?{submit:'搜尋',clear:'清除篩選',results:'指南結果'}:{submit:'搜尋',clear:'清除篩選',results:'指南結果'};
  const paginationCopy=locale==='en'?{label:'Guide result pages',previous:'Previous',next:'Next',page:(page:number)=>`Page ${page}`}:locale==='zh-Hans'?{label:'指南结果分页',previous:'上一页',next:'下一页',page:(page:number)=>`第 ${page} 页`}:locale==='zh-Hant'?{label:'指南結果分頁',previous:'上一頁',next:'下一頁',page:(page:number)=>`第 ${page} 頁`}:{label:'指南結果分頁',previous:'上一頁',next:'下一頁',page:(page:number)=>`第 ${page} 頁`};
  const firstResult=totalResults ? (currentPage - 1) * pageSize + 1 : 0;
  const lastResult=totalResults ? firstResult + articles.length - 1 : 0;
  const resultCopy=locale==='en'
    ? `${totalResults} ${totalResults===1?'guide':'guides'} match. Showing ${firstResult}–${lastResult}.`
    : locale==='zh-Hans'
      ? `目前找到 ${totalResults} 篇指南，显示第 ${firstResult} 至 ${lastResult} 篇。`
      : locale==='zh-Hant'
        ? `目前找到 ${totalResults} 篇指南，顯示第 ${firstResult} 至 ${lastResult} 篇。`
        : `而家搵到 ${totalResults} 篇指南，顯示第 ${firstResult} 至 ${lastResult} 篇。`;
  const hasActiveFilters=Boolean(filters.query)||filters.type!=='all'||filters.category!=='all'||filters.freshness!=='all'||filters.audience!=='all'||filters.effort!=='all';
  const pages=visiblePageNumbers(currentPage,totalPages);
  return <>
    <section id="resource-search" className="search-block" aria-label={ui[locale].search as string}>
      <form className="search-controls" action={`/${locale}/resources#resource-results`} method="get">
        <label className="search-field search-field--query"><span>{labelCopy.keywords}</span><input type="search" name="q" defaultValue={filters.query} maxLength={160} placeholder={ui[locale].search as string}/></label>
        <label className="search-field"><span>{labelCopy.audience}</span><select name="audience" defaultValue={filters.audience}><option value="all">{filterCopy.audiences}</option><option value="non-coder">{filterCopy.nonCoder}</option><option value="developer">{filterCopy.developer}</option></select></label>
        <label className="search-field"><span>{labelCopy.effort}</span><select name="effort" defaultValue={filters.effort}><option value="all">{filterCopy.efforts}</option><option value="quick">{filterCopy.quick}</option><option value="session">{filterCopy.session}</option><option value="project">{filterCopy.project}</option></select></label>
        <label className="search-field"><span>{labelCopy.format}</span><select name="type" defaultValue={filters.type}><option value="all">{filterCopy.formats}</option>{Object.entries(articleTypes[locale]).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
        <label className="search-field"><span>{labelCopy.category}</span><select name="category" defaultValue={filters.category}><option value="all">{filterCopy.categories}</option>{CATEGORY_IDS.map(id=><option key={id} value={id}>{categories[id][locale].name}</option>)}</select></label>
        <label className="search-field"><span>{labelCopy.updated}</span><select name="freshness" defaultValue={filters.freshness}><option value="all">{filterCopy.dates}</option><option value="90">{filterCopy.days90}</option><option value="365">{filterCopy.year}</option></select></label>
        <div className="search-actions"><button className="button primary" type="submit">{actionCopy.submit}</button>{hasActiveFilters?<Link className="search-clear" href={`/${locale}/resources#resource-search`}>{actionCopy.clear}</Link>:null}</div>
      </form>
      <p className="search-result-count" role="status">{resultCopy}</p>
    </section>
    <section id="resource-results" className="search-results" aria-label={actionCopy.results}>
      {articles.length
        ? <div className="article-grid">{articles.map(article=><SearchArticleCard key={article.id} article={article} locale={locale}/>)}</div>
        : filters.effort === 'quick'
          ? <ShortGuideEmptyState locale={locale} filters={filters} clearLabel={actionCopy.clear}/>
          : <div className="empty"><p>{ui[locale].noResults as string}</p><Link className="text-link" href={`/${locale}/resources#resource-search`}>{actionCopy.clear} <span aria-hidden>→</span></Link></div>}
      {totalPages>1?<nav className="resource-pagination" aria-label={paginationCopy.label}>
        {currentPage>1?<Link rel="prev" href={resourcePageHref(locale,filters,currentPage-1)}>{paginationCopy.previous}</Link>:<span aria-disabled="true">{paginationCopy.previous}</span>}
        <ol>{pages.map((page,index)=><Fragment key={page}>{index>0&&page-pages[index-1]>1?<li className="resource-pagination__gap" aria-hidden="true">…</li>:null}<li><Link href={resourcePageHref(locale,filters,page)} aria-current={page===currentPage?'page':undefined} aria-label={paginationCopy.page(page)}>{page}</Link></li></Fragment>)}</ol>
        {currentPage<totalPages?<Link rel="next" href={resourcePageHref(locale,filters,currentPage+1)}>{paginationCopy.next}</Link>:<span aria-disabled="true">{paginationCopy.next}</span>}
      </nav>:null}
    </section>
  </>;
}
