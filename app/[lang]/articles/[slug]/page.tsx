import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleLearningContract } from '@/components/article-learning-contract';
import { InferenceRequestPathLab } from '@/components/inference-request-path-lab';
import { PortfolioVerificationReceipt } from '@/components/portfolio-verification-receipt';
import { RoadmapStageProgressControl } from '@/components/roadmap-progress';
import { LanguageSwitch } from '@/components/site';
import { createArticleLearningContract } from '@/lib/article-learning-contract';
import { extractArticleOutline } from '@/lib/article-outline';
import { splitTrailingRelatedLinks } from '@/lib/article-trailing-links';
import { getArticle, getArticles, getRelatedArticles, readArticle, renderMarkdown } from '@/lib/content';
import { articleTypes, categories, isLocale, ui } from '@/lib/i18n';
import { getReleaseScopedRoadmap } from '@/lib/release-learning-content';
import { isReleaseAssetEnabledInCurrentBuild, isRouteSurfaceEnabledInCurrentBuild, isSeriesEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { primaryArticleForRoadmapStage, roadmapArticleContext } from '@/lib/roadmaps';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { LOCALES, canonicalLocaleRecord, staticAssetLocale } from '@/lib/types';

const projectCopy = canonicalLocaleRecord({
  'zh-HK': { eyebrow: '可重跑的參考實作', title: '想自己核對，可以睇呢份參考程式', text: '程式碼用英文寫，README 有各語言版本；所有資料都係合成，唔會連到真實系統。', repository: '開啟 GitHub 專案', readme: '閱讀 README', command: '已核對指令', verified: '最近核對' },
  'zh-TW': { eyebrow: '可重跑的參考實作', title: '想自行核對，可以看這份參考程式', text: '程式碼以英文編寫，README 有各語言版本；所有資料都是合成資料，不會連接真實系統。', repository: '開啟 GitHub 專案', readme: '閱讀 README', command: '已核對指令', verified: '最近核對' },
  'zh-Hans': { eyebrow: '可重跑的参考实现', title: '想自行核对，可以看这份参考程序', text: '代码以英文编写，README 有各语言版本；所有资料都是合成资料，不会连接真实系统。', repository: '打开 GitHub 项目', readme: '阅读 README', command: '已核对命令', verified: '最近核对' },
  en: { eyebrow: 'PROJECT SOURCE', title: 'Inspect the rerunnable reference implementation', text: 'The source code is English, with translated README editions. It contains synthetic material only and does not connect to a live system.', repository: 'Open the GitHub project', readme: 'Read the README', command: 'Verified command', verified: 'Last checked' }
});

const projectUnavailableCopy = canonicalLocaleRecord({
  'zh-HK': { eyebrow: '範例實作現況', title: '完整範例暫時未有公開版本', text: '完整範例而家只用本地固定測試資料學習，未有經負責人覆核的公開 GitHub 專案。完成公開安全覆核後，網站先會加上來源連結；而家唔會編造 URL。' },
  'zh-TW': { eyebrow: '範例實作現況', title: '完整範例暫時未有公開版本', text: '配套學習材料目前只在本機以固定測試資料存在，尚未有經負責人覆核的公開 GitHub 專案。完成公開安全覆核後，網站才會加入來源連結；目前不會編造 URL。' },
  'zh-Hans': { eyebrow: '示例实现现况', title: '完整示例暂时没有公开版本', text: '配套学习材料目前只在本地以固定测试资料存在，尚未有经负责人核对的公开 GitHub 项目。完成公开安全复核后，网站才会加入来源链接；目前不会编造 URL。' },
  en: { eyebrow: 'PROJECT SOURCE', title: 'This reference has no public source package yet', text: 'Any companion learning package currently remains local, fixture-only material, and there is no verified public repository for this reference. The site will add a source link only after the owner publishes and reviews it; it does not invent GitHub URLs.' }
});

const tableCopy = canonicalLocaleRecord({
  'zh-HK': '可橫向捲動的資料表',
  'zh-TW': '可橫向捲動的資料表',
  'zh-Hans': '可横向滚动的数据表',
  en: 'Scrollable data table'
});

const codeCopy = canonicalLocaleRecord({
  'zh-HK': '可橫向捲動的程式碼區塊',
  'zh-TW': '可橫向捲動的程式碼區塊',
  'zh-Hans': '可横向滚动的代码区块',
  en: 'Scrollable code block'
});

const outlineCopy = canonicalLocaleRecord({
  'zh-HK': { label: '本頁內容', context: '路線位置與本頁目錄', alternatives: '其他相關指南' },
  'zh-TW': { label: '本頁內容', context: '路線位置與本頁目錄', alternatives: '其他相關指南' },
  'zh-Hans': { label: '本页内容', context: '路线位置与本页目录', alternatives: '其他相关指南' },
  en: { label: 'On this page', context: 'Route position and page contents', alternatives: 'Other related guides' }
});

const learningCopy = canonicalLocaleRecord({
  'zh-HK': {
    roadmap: 'AI 工程學習路線',
    current: (number: string) => `第 ${number} 站`,
    back: '返回今站 roadmap 卡片',
    usedIn: '呢份導讀會喺以下站點用到',
    openStage: '返回 roadmap 站點',
    previous: '上一站',
    next: '下一站',
  },
  'zh-TW': {
    roadmap: 'AI 工程學習路線',
    current: (number: string) => `第 ${number} 站`,
    back: '返回本站 roadmap 卡片',
    usedIn: '這份導讀會在以下站點使用',
    openStage: '返回 roadmap 站點',
    previous: '上一站',
    next: '下一站',
  },
  'zh-Hans': {
    roadmap: 'AI 工程学习路线',
    current: (number: string) => `第 ${number} 站`,
    back: '返回本站 roadmap 卡片',
    usedIn: '这份导读会在以下站点使用',
    openStage: '返回 roadmap 站点',
    previous: '上一站',
    next: '下一站',
  },
  en: {
    roadmap: 'AI engineering roadmap',
    current: (number: string) => `Stage ${number}`,
    back: 'Back to this roadmap stage',
    usedIn: 'This guide is used in more than one stage',
    openStage: 'Open roadmap stage',
    previous: 'Previous stage',
    next: 'Next stage',
  },
});

const downloadCopy = canonicalLocaleRecord({
  'zh-HK': { pdf: (title: string) => `下載「${title}」PDF`, markdown: (title: string) => `下載「${title}」Markdown 檔案` },
  'zh-TW': { pdf: (title: string) => `下載「${title}」PDF`, markdown: (title: string) => `下載「${title}」Markdown 檔案` },
  'zh-Hans': { pdf: (title: string) => `下载“${title}”PDF`, markdown: (title: string) => `下载“${title}”Markdown 文件` },
  en: { pdf: (title: string) => `Download ${title} as PDF`, markdown: (title: string) => `Download ${title} as Markdown` }
});

const sourceMetaCopy = canonicalLocaleRecord({
  'zh-HK': { reviewed: '最近核對', nextReview: '下次檢查' },
  'zh-TW': { reviewed: '最近核對', nextReview: '下次檢查' },
  'zh-Hans': { reviewed: '最近核对', nextReview: '下次检查' },
  en: { reviewed: 'Last checked', nextReview: 'Next review' }
});

const mentionedLinksCopy = canonicalLocaleRecord({
  'zh-HK': { summary: '本文提及的延伸連結（可選）', note: '如果你已經揀好下一步，可以略過。' },
  'zh-TW': { summary: '本文提及的延伸連結（可選）', note: '如果你已經選好下一步，可以略過。' },
  'zh-Hans': { summary: '本文提及的延伸链接（可选）', note: '如果已经选好下一步，可以略过。' },
  en: { summary: 'Optional links mentioned in this guide', note: 'Skip this if you have already chosen your next step.' }
});

const sourceHosts: Record<string, string> = {
  'airc.nist.gov': 'NIST AI RMF',
  'arxiv.org': 'arXiv',
  'cyber.gov.au': 'Australian Cyber Security Centre',
  'developers.google.com': 'Google Developers',
  'developers.openai.com': 'OpenAI Developer Docs',
  'docs.github.com': 'GitHub Docs',
  'docs.x.ai': 'xAI Docs',
  'github.com': 'GitHub',
  'huggingface.co': 'Hugging Face',
  'learn.chatgpt.com': 'ChatGPT Learn',
  'learn.microsoft.com': 'Microsoft Learn',
  'martinfowler.com': 'Martin Fowler',
  'modelcontextprotocol.io': 'Model Context Protocol',
  'nist.gov': 'NIST',
  'nexford.edu': 'Nexford University',
  'owasp.org': 'OWASP',
  'promptfoo.dev': 'Promptfoo',
  'scikit-learn.org': 'scikit-learn'
};

function sourceLinkLabel(url: string) {
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^www\./, '');
  const host = sourceHosts[hostname] ?? hostname;
  const lastSegment = parsed.pathname.split('/').filter(Boolean).at(-1);
  if (!lastSegment) return host;
  const page = decodeURIComponent(lastSegment)
    .replace(/\.(?:html?|json|md)$/i, '')
    .replace(/[-_]/g, ' ');
  return page ? `${host} — ${page}` : host;
}

const compactBoundaryHeadings = new Set([
  '邊界',
  '边界',
  'boundary',
  '邊界與來源說明',
  '边界与来源说明',
  'boundary and source note',
  '來源與邊界說明',
  '邊界與更新說明',
  '边界与更新说明',
  'boundary and update note',
]);

function splitCompactBoundary(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  let finalHeadingIndex = -1;
  let finalHeading = '';
  lines.forEach((line, index) => {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      finalHeadingIndex = index;
      finalHeading = match[1].trim();
    }
  });
  if (finalHeadingIndex < 0 || !compactBoundaryHeadings.has(finalHeading.toLocaleLowerCase())) {
    return { main: markdown } as const;
  }
  const outlineItem = extractArticleOutline(markdown).findLast(item => item.level === 2 && item.text === finalHeading);
  return {
    main: lines.slice(0, finalHeadingIndex).join('\n').trimEnd(),
    boundary: lines.slice(finalHeadingIndex + 1).join('\n').trim(),
    boundaryHeading: finalHeading,
    boundaryId: outlineItem?.id,
  } as const;
}

export function generateStaticParams() {
  return LOCALES.flatMap(lang => getArticles().map(article => ({ lang, slug: article.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = getArticle(slug);
  if (!isLocale(lang) || !article) return {};
  const copy = article.translations[lang];
  const path = `/${lang}/articles/${slug}`;
  return {
    title: copy.title,
    description: copy.description,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.title, description: copy.description, path, type: 'article' })
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const article = getArticle(slug);
  if (!isLocale(lang) || !article || !isRouteSurfaceEnabledInCurrentBuild('article-downloads')) notFound();
  const copy = article.translations[lang];
  const category = categories[article.categoryId][lang];
  const body = readArticle(article, lang);
  const finalTrailingLinks = splitTrailingRelatedLinks(body);
  const bodySections = splitCompactBoundary(finalTrailingLinks.main);
  const mainTrailingLinks = splitTrailingRelatedLinks(bodySections.main);
  const relatedLinkMarkdown = [mainTrailingLinks.links, finalTrailingLinks.links]
    .filter((value): value is string => Boolean(value))
    .join('\n\n');
  const outlineBody = 'boundary' in bodySections
    ? [mainTrailingLinks.main, `## ${bodySections.boundaryHeading}`, bodySections.boundary ?? ''].join('\n\n')
    : mainTrailingLinks.main;
  const outline = extractArticleOutline(outlineBody);
  const related = getRelatedArticles(article);
  const project = article.portfolioRepository;
  const projectLabels = projectCopy[lang];
  const unavailableProjectLabels = projectUnavailableCopy[lang];
  const downloadLabels = downloadCopy[lang];
  const sourceMeta = sourceMetaCopy[lang];
  const mentionedLinks = mentionedLinksCopy[lang];
  const learning = learningCopy[lang];
  const articleRoadmapContext = roadmapArticleContext(slug);
  const learningContract = createArticleLearningContract({
    article,
    body,
    locale: lang,
    roadmapContext: articleRoadmapContext,
  });
  const scopedRoadmap = isSeriesEnabledInCurrentBuild('ai-engineer-roadmap') ? getReleaseScopedRoadmap() : null;
  const roadmapContext = scopedRoadmap ? roadmapArticleContext(slug, scopedRoadmap) : undefined;
  const roadmapStage = roadmapContext?.stage;
  const previousRoadmapArticle = roadmapContext?.previousStage ? primaryArticleForRoadmapStage(roadmapContext.previousStage) : undefined;
  const nextRoadmapArticle = roadmapContext?.nextStage ? primaryArticleForRoadmapStage(roadmapContext.nextStage) : undefined;
  const downloadLocale = staticAssetLocale(lang);
  const downloadAssets = [
    {
      format: 'pdf' as const,
      path: `downloads/${article.id}/v1/${downloadLocale}.pdf`,
      label: downloadLabels.pdf(copy.title),
    },
    {
      format: 'md' as const,
      path: `downloads/${article.id}/v1/${downloadLocale}.md`,
      label: downloadLabels.markdown(copy.title),
    },
  ].filter(asset => isReleaseAssetEnabledInCurrentBuild('downloads', asset.path));
  const resourceHint = lang === 'en' ? 'Use the editable worksheet or print the one-page PDF.' : lang === 'zh-Hans' ? '下载可编辑工作表，或打印单页 PDF。' : '下載可編輯工作表，或列印單頁 PDF。';
  const relatedCopy = lang === 'en' ? { eyebrow: 'KEEP LEARNING', title: 'Related reading', read: 'Read guide' } : lang === 'zh-Hans' ? { eyebrow: '延伸学习', title: '相关阅读', read: '阅读指南' } : { eyebrow: '延伸學習', title: '相關閱讀', read: '閱讀指南' };

  return <div className="article-shell">
    <header className="article-header">
      {isRouteSurfaceEnabledInCurrentBuild('categories') ? <Link className="category-label" href={`/${lang}/categories/${article.categoryId}`}>{category.name}</Link> : <span className="category-label">{category.name}</span>}
      <h1>{copy.title}</h1>
      <p className="article-dek">{copy.description}</p>
      <div className="article-meta"><span>{articleTypes[lang][article.type]}</span><span>{ui[lang].updated as string} {article.updatedAt}</span></div>
      <LanguageSwitch locale={lang} slug={slug} />
    </header>
    <ArticleLearningContract contract={learningContract} locale={lang} />
    {slug === 'inference-memory-scheduling-and-serving-engines' ? <InferenceRequestPathLab locale={lang} /> : null}
    {(roadmapContext || outline.length >= 3) && <details className="article-context-disclosure">
      <summary>{outlineCopy[lang].context}</summary>
      {roadmapContext ? <>
        <nav className="article-outline article-roadmap-context" aria-label={learning.roadmap}>
          <p>{learning.roadmap}{roadmapStage ? <> · {learning.current(roadmapStage.number)}</> : <> · {learning.usedIn}</>}</p>
          {roadmapStage ? <ol>
            <li><Link href={`/${lang}/series/ai-engineer-roadmap?phase=${roadmapStage.phase}#roadmap-stage-${roadmapStage.number}`}>{learning.back}: {roadmapStage.title[lang]} <span aria-hidden>↑</span></Link></li>
            {roadmapContext.previousStage && previousRoadmapArticle ? <li><Link href={`/${lang}/articles/${previousRoadmapArticle.target}`}>{learning.previous}: {roadmapContext.previousStage.number} · {roadmapContext.previousStage.title[lang]} <span aria-hidden>←</span></Link></li> : null}
            {roadmapContext.nextStage && nextRoadmapArticle ? <li><Link href={`/${lang}/articles/${nextRoadmapArticle.target}`}>{learning.next}: {roadmapContext.nextStage.number} · {roadmapContext.nextStage.title[lang]} <span aria-hidden>→</span></Link></li> : null}
          </ol> : <ol>{roadmapContext.stages.map(stage => <li key={stage.id}><Link href={`/${lang}/series/ai-engineer-roadmap?phase=${stage.phase}#roadmap-stage-${stage.number}`}>{learning.openStage}: {stage.number} · {stage.title[lang]} <span aria-hidden>↑</span></Link></li>)}</ol>}
        </nav>
        {roadmapStage ? <RoadmapStageProgressControl stageId={roadmapStage.id} number={roadmapStage.number} locale={lang} /> : null}
      </> : null}
      {outline.length >= 3 && <nav className="article-outline" aria-label={outlineCopy[lang].label}>
        <p>{outlineCopy[lang].label}</p>
        <ol>{outline.map(item => <li className={`article-outline-level-${item.level}`} key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol>
      </nav>}
    </details>}
    <article className="prose">
      {renderMarkdown(mainTrailingLinks.main, tableCopy[lang], codeCopy[lang])}
      {'boundary' in bodySections ? <details className="prose-boundary">
        <summary id={bodySections.boundaryId}>{bodySections.boundaryHeading}</summary>
        <div>{renderMarkdown(bodySections.boundary ?? '', tableCopy[lang], codeCopy[lang])}</div>
      </details> : null}
    </article>
    {project ? <aside className="project-source">
      <div><p className="eyebrow">{projectLabels.eyebrow}</p><h2>{projectLabels.title}</h2><p>{projectLabels.text}</p><p className="project-verification"><span>{projectLabels.command}</span> <code>{project.testedCommand}</code><br /><span>{projectLabels.verified}</span> {project.verifiedAt}</p></div>
      <div className="project-source-actions"><a className="button primary" href={project.url} target="_blank" rel="noreferrer">{projectLabels.repository} ↗</a><a className="button secondary" href={project.readmeUrls[lang]} target="_blank" rel="noreferrer">{projectLabels.readme} ↗</a></div>
    </aside> : article.type === 'portfolio-build' && <aside className="project-source project-source--unavailable" role="note">
      <div><p className="eyebrow">{unavailableProjectLabels.eyebrow}</p><h2>{unavailableProjectLabels.title}</h2><p>{unavailableProjectLabels.text}</p></div>
      <PortfolioVerificationReceipt articleSlug={article.slug} locale={lang} />
    </aside>}
    {related.length > 0 && <section className="related-reading">
      <p className="eyebrow">{relatedCopy.eyebrow}</p><h2>{relatedCopy.title}</h2>
      <div>{related.slice(0, 1).map(item => <Link key={item.id} href={`/${lang}/articles/${item.slug}`}><span>{categories[item.categoryId][lang].name}</span><strong>{item.translations[lang].title}</strong><small>{relatedCopy.read} →</small></Link>)}</div>
      {related.length > 1 ? <details className="related-reading-alternatives"><summary>{outlineCopy[lang].alternatives}</summary><div>{related.slice(1).map(item => <Link key={item.id} href={`/${lang}/articles/${item.slug}`}><span>{categories[item.categoryId][lang].name}</span><strong>{item.translations[lang].title}</strong><small>{relatedCopy.read} →</small></Link>)}</div></details> : null}
    </section>}
    {relatedLinkMarkdown ? <details className="article-mentioned-links">
      <summary>{mentionedLinks.summary}</summary>
      <div className="prose article-mentioned-links-content">
        <p>{mentionedLinks.note}</p>
        {renderMarkdown(relatedLinkMarkdown, tableCopy[lang], codeCopy[lang])}
      </div>
    </details> : null}
    {downloadAssets.length ? <aside className="downloads">
      <div><p className="eyebrow">{ui[lang].download as string}</p><h2>{copy.title}</h2><p>{resourceHint}</p></div>
      <div className="download-actions">{downloadAssets.map(asset => <a className={`button ${asset.format === 'pdf' ? 'primary' : 'secondary'}`} download href={`/${asset.path}`} aria-label={asset.label} key={asset.path}>{asset.format === 'pdf' ? 'PDF' : 'Markdown'}</a>)}</div>
    </aside> : null}
    <section className="sources"><h2>{ui[lang].source as string}</h2><p><strong>{sourceMeta.reviewed}</strong> {article.reviewedAt} · <strong>{sourceMeta.nextReview}</strong> {article.reviewBy}</p><ul>{article.sourceUrls.map(url => <li key={url}><a href={url} rel="noreferrer" title={url}>{sourceLinkLabel(url)}</a></li>)}</ul></section>
  </div>;
}
