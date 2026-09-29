import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuildLabCaseSelector } from '@/components/build-lab-case-selector';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { PortfolioVerificationReceipt } from '@/components/portfolio-verification-receipt';
import { getArticle, getLab } from '@/lib/content';
import {
  BUILD_LAB_CASE_IDS,
  buildLabCaseSelectorCopy,
  buildLabCaseSelectorMetaCopy,
  codingStarterNextStepCopy,
  type BuildLabCaseId,
} from '@/lib/build-lab-case-selector';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { getPortfolioExampleReceipt } from '@/lib/portfolio-example-receipts';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { canonicalLocaleRecord, type LabCopy } from '@/lib/types';

// Static hosting has no request-time query rendering. The selector restores
// an optional `case` value in the browser after hydration.
export const dynamic = 'force-static';

const lab = getLab('build-lab');
const demonstrationLabels = canonicalLocaleRecord({
  'zh-HK': { details: '需要時打開步驟同證據', technical: '實作會練到乜', nonTechnical: '交畀人睇時要交代乜', repository: '查看 GitHub 專案', readme: '閱讀 README', repositoryUnavailableTitle: '範例套件現況', repositoryUnavailableBadge: '只限本地練習檔同固定測試資料；未有經核實公開 repo。', repositoryUnavailableText: '部分案例暫時只提供本地練習檔。公開安全覆核和發佈完成前，本站唔會附上 GitHub 連結，亦唔會編造 URL。', boundary: '界限' },
  'zh-TW': { details: '需要時展開步驟與證據', technical: '程式與測試會顯示什麼', nonTechnical: '用在工作上，還要交代什麼', repository: '查看 GitHub 專案', readme: '閱讀 README', repositoryUnavailableTitle: '範例套件現況', repositoryUnavailableBadge: '只限本機練習檔與固定測試資料；尚未有經核實公開 repo。', repositoryUnavailableText: '部分案例暫時只提供本機練習檔。公開安全覆核與發布完成前，本站不會附上 GitHub 連結，也不會編造 URL。', boundary: '限制' },
  'zh-Hans': { details: '需要时展开步骤与证据', technical: '程序与测试会显示什么', nonTechnical: '用在工作上，还要交代什么', repository: '查看 GitHub 项目', readme: '阅读 README', repositoryUnavailableTitle: '示例套件现况', repositoryUnavailableBadge: '只限本地练习档与固定测试资料；尚未有经核实公开 repo。', repositoryUnavailableText: '部分案例暂时只提供本地练习档。公开安全复核与发布完成前，本站不会附上 GitHub 链接，也不会编造 URL。', boundary: '边界' },
  en: { details: 'Open the steps and evidence when needed', technical: 'What the code and tests show', nonTechnical: 'What still needs explaining before it is used for work', repository: 'View the GitHub project', readme: 'Read the README', repositoryUnavailableTitle: 'Example package status', repositoryUnavailableBadge: 'Local fixture only; no verified public repository yet.', repositoryUnavailableText: 'Some examples remain local, fixture-only learning material. The site will add a verified source link only after the owner has completed a public-safety review and publication; it does not invent GitHub URLs.', boundary: 'Boundary' }
});

const labDirectoryCopy = canonicalLocaleRecord({
  'zh-HK': { title: '比較全部 Lab 同完整學習步驟', text: '先用上面嘅選擇器揀一個案例。只有當你要比較其他案例，或規劃下一個項目時，才打開呢份目錄。' },
  'zh-TW': { title: '比較全部 Lab 與完整學習步驟', text: '先用上方選擇器選一個案例。只有當你要比較其他案例，或規劃下一個專案時，才展開這份目錄。' },
  'zh-Hans': { title: '比较全部 Lab 和完整学习步骤', text: '先用上方选择器选一个案例。只有当你要比较其他案例，或规划下一个项目时，才展开这份目录。' },
  en: { title: 'Compare every Lab and the full learning sequence', text: 'Choose one case with the selector above first. Open this directory only to compare other cases or plan the next project.' },
});

function buildLabKitAnchor(kit: LabCopy['kits'][number]) {
  if (kit.articleSlug) return `build-lab-kit-${kit.articleSlug}`;
  return kit.internalRoute === '/no-code-starter-lab'
    ? 'build-lab-kit-no-code-starter-lab'
    : 'build-lab-kit-coding-starter-lab';
}

function isLabDestinationEnabled(href: string) {
  if (href.startsWith('/articles/')) {
    return isRouteSurfaceEnabledInCurrentBuild('article-downloads') && Boolean(getArticle(href.slice('/articles/'.length)));
  }
  if (href === '/no-code-starter-lab') return isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab');
  if (href === '/coding-starter-lab') return isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab');
  if (href === '/portfolio-evidence-planner') return isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner');
  return isRouteSurfaceEnabledInCurrentBuild('__local-only-lab-link__');
}

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !lab) return {};
  const t = lab.translations[lang];
  const path = `/${lang}/labs`;
  return {
    title: t.title,
    description: t.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: t.title, description: t.intro, path })
  };
}

export default async function Labs({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ case?: string | string[] }>;
}) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(lang) || !lab || !isRouteSurfaceEnabledInCurrentBuild('labs')) notFound();
  const t = lab.translations[lang];
  const labels = demonstrationLabels[lang];
  const visibleWorkflowSteps = t.workflowPath?.steps.filter(step => isLabDestinationEnabled(step.href)) ?? [];
  const visibleKits = t.kits.filter(kit => isLabDestinationEnabled(kit.internalRoute ?? `/articles/${kit.articleSlug}`));
  const availableCaseIds = BUILD_LAB_CASE_IDS.filter(id => isLabDestinationEnabled(buildLabCaseSelectorCopy[lang].cases[id].href)) as BuildLabCaseId[];
  const requestedCase = Array.isArray(query.case) ? query.case[0] : query.case;
  const initialCaseId = requestedCase && availableCaseIds.includes(requestedCase as BuildLabCaseId)
    ? requestedCase as BuildLabCaseId
    : undefined;
  const hasUnpublishedReference = visibleKits.some(kit => kit.articleSlug && !getArticle(kit.articleSlug)?.portfolioRepository);
  const directoryCopy = labDirectoryCopy[lang];
  return <div className="shell page">
    <FragmentAnchorScroll />
    <header className="page-header"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></header>
    <aside className="lab-note skills-hub-entry"><p className="eyebrow">Skills Hub</p><p>{lang === 'zh-Hant' ? '搵 skill 同觀察 Agent skill 趨勢嘅外部入口。' : lang === 'en' ? 'An external hub for finding skills and watching Agent-skill trends.' : '搜尋 skill 與觀察 Agent skill 趨勢的外部入口。'}</p><Link className="button secondary" href={`/${lang}/labs/skills-hub`}>{lang === 'zh-Hant' ? '睇 Skills Hub' : lang === 'en' ? 'View Skills Hub' : '查看 Skills Hub'}</Link></aside>
    {availableCaseIds.length ? <BuildLabCaseSelector locale={lang} copy={buildLabCaseSelectorCopy[lang]} metaCopy={buildLabCaseSelectorMetaCopy[lang]} codingStarterNextStep={codingStarterNextStepCopy[lang]} availableCaseIds={availableCaseIds} initialCaseId={initialCaseId} canPlanPortfolio={isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner')} /> : null}
    {(visibleWorkflowSteps.length || visibleKits.length) ? <details className="portfolio-reference-disclosure build-lab-directory">
      <summary><strong>{directoryCopy.title}</strong><span>{directoryCopy.text}</span></summary>
      <div className="portfolio-reference-disclosure__content">
        {t.workflowPath && visibleWorkflowSteps.length ? <section className="build-lab-workflow-path" aria-labelledby="build-lab-workflow-path-title">
          <header>
            <p className="eyebrow">{t.workflowPath.eyebrow}</p>
            <h2 id="build-lab-workflow-path-title">{t.workflowPath.title}</h2>
            <p>{t.workflowPath.intro}</p>
          </header>
          <ol>{visibleWorkflowSteps.map((step, index) => <li id={step.id} key={step.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p><Link className="text-link" href={`/${lang}${step.href}`}>{step.action} <span aria-hidden>→</span></Link></div>
          </li>)}</ol>
          <p className="build-lab-workflow-path-boundary" role="note">{t.workflowPath.boundary}</p>
        </section> : null}
        {hasUnpublishedReference && <aside className="lab-repository-overview" role="note"><p className="eyebrow">{labels.repositoryUnavailableTitle}</p><p>{labels.repositoryUnavailableText}</p></aside>}
        {visibleKits.length ? <section className="lab-grid" aria-label={t.eyebrow}>{visibleKits.map((kit, index) => {
          const article = kit.articleSlug ? getArticle(kit.articleSlug) : undefined;
          const project = article?.portfolioRepository;
          const receipt = kit.articleSlug ? getPortfolioExampleReceipt(kit.articleSlug) : undefined;
          const primaryHref = kit.internalRoute ? '/' + lang + kit.internalRoute : '/' + lang + '/articles/' + kit.articleSlug;
          return <article id={buildLabKitAnchor(kit)} className="lab-card" key={kit.title}>
            <p className="eyebrow">0{index + 1} · {kit.kind}</p><h2>{kit.title}</h2><p>{kit.text}</p>
            <details className="lab-card-disclosure">
              <summary>{labels.details}</summary>
              <ol>{kit.steps.map(step => <li key={step}>{step}</li>)}</ol>
              <div className="lab-demonstration">
                <section><h3>{labels.technical}</h3><ul>{kit.demonstrates.technical.map(item => <li key={item}>{item}</li>)}</ul></section>
                <section><h3>{labels.nonTechnical}</h3><ul>{kit.demonstrates.nonTechnical.map(item => <li key={item}>{item}</li>)}</ul></section>
              </div>
            </details>
            <div className="lab-actions"><Link className="button primary" href={primaryHref}>{kit.action}</Link>{project ? <><a className="button secondary" href={project.url} target="_blank" rel="noreferrer">{labels.repository} ↗</a><a className="text-link" href={project.readmeUrls[lang]} target="_blank" rel="noreferrer">{labels.readme} ↗</a></> : kit.articleSlug && (receipt ? <PortfolioVerificationReceipt articleSlug={kit.articleSlug} locale={lang} compact /> : <p className="lab-repository-unavailable" role="note"><strong>{labels.repositoryUnavailableTitle}.</strong> {labels.repositoryUnavailableBadge}</p>)}</div>
          </article>;
        })}</section> : null}
      </div>
    </details> : null}
    <aside className="lab-note"><p className="eyebrow">{labels.boundary}</p><p>{t.note}</p></aside>
  </div>;
}
