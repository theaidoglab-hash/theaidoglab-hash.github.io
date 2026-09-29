import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioEvidencePlanner from '@/components/portfolio-evidence-planner';
import { PortfolioCapstonePath } from '@/components/portfolio-capstone-path';
import { PortfolioEvidenceHandoffCard } from '@/components/portfolio-evidence-handoff-card';
import { PortfolioWorkedExamples } from '@/components/portfolio-worked-examples';
import { SupportNudge } from '@/components/support-nudge';
import { BUILD_LAB_CASE_IDS, buildLabCaseSelectorCopy, type BuildLabCaseId } from '@/lib/build-lab-case-selector';
import { articlePath, getArticle, getArticles } from '@/lib/content';
import { portfolioEvidencePlannerCopy, type PortfolioShapeId } from '@/lib/portfolio-evidence-planner';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild, isScopedReleaseBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { canonicalLocaleRecord } from '@/lib/types';

// Static hosting has no request-time query rendering. The interactive planner
// restores an optional starter selection in the browser after hydration.
export const dynamic = 'force-static';

const starterShape: Record<BuildLabCaseId, PortfolioShapeId> = {
  'no-code': 'approval',
  // The coding starter is a bounded review-route exercise: a human decides
  // whether a fictional request is ready for review, needs revision, or must
  // be blocked. Keep its planner handoff on that same decision, rather than
  // silently changing it into the unrelated batch-recovery pattern.
  'coding-starter': 'approval',
  approval: 'approval',
  retrieval: 'draft',
  reliability: 'reliability',
  'predictive-ml': 'triage',
  'public-data-eval': 'public-data',
  'public-statistics': 'context-brief',
};

const referenceDisclosureCopy = canonicalLocaleRecord({
  'zh-HK': { title: '需要例子時才展開', text: '查看完整示例同交接檢查；先完成上面一個規劃與 capstone 步驟都可以。' },
  'zh-TW': { title: '需要範例時再展開', text: '查看完整範例與交接檢查；也可以先完成上方一個規劃與 capstone 步驟。' },
  'zh-Hans': { title: '需要示例时再展开', text: '查看完整示例与交接检查；也可以先完成上方一个规划与 capstone 步骤。' },
  en: { title: 'Open examples only when needed', text: 'Browse the full examples and handoff checks, or first complete one planning and capstone step above.' },
});

const quickStartCopy = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '15 分鐘起步',
    title: '先寫一張起步卡，不用現在完成整份規劃',
    intro: '設定計時器，直接喺下面填三個答案；未想到嘅位可以先留空。',
    fields: [
      { id: 'decision', label: '這份作品幫哪個虛構角色作哪個決定？', help: '只寫角色同決定；不要填公司、人名、客戶或真實工作資料。', placeholder: '例如：虛構覆核員要決定一份虛構要求可否變成草稿。' },
      { id: 'current', label: '現時怎樣簡單處理？', help: '寫人手、試算表或清單等做法；不用提模型或工具。', placeholder: '例如：先由人逐項讀資料，再決定是否交人覆核。' },
      { id: 'human-boundary', label: '哪一件事必須由人作最後決定？', help: '同時寫下負責角色；一件不能自動做嘅事已足夠。', placeholder: '例如：虛構覆核員決定是否採用草稿；工具不可聯絡任何人。' },
    ],
    localBoundary: '這三個答案只留喺目前頁面；重新整理會清空，本站不會儲存或傳送內容。',
    completion: '寫好你目前知道嘅三格後，這張 15 分鐘起步卡便完成；它不代表作品、測試或證據已完成。',
    fullPlanner: {
      eyebrow: '下一步：另預留較長時間',
      title: '之後才做完整規劃',
      text: '完整規劃會比較最多三個方向；每個方向要做六項項目檢查（共 12 分）並填五項量度說明。可以分段做，不屬於上面 15 分鐘起步。',
      action: '開始較長的完整規劃',
    },
  },
  'zh-TW': {
    eyebrow: '15 分鐘起步',
    title: '先寫一張起步卡，不用現在完成整份規劃',
    intro: '設定計時器，直接在下方填三個答案；還沒想到的地方可以先留空。',
    fields: [
      { id: 'decision', label: '這份作品幫哪個虛構角色做哪個決定？', help: '只寫角色與決定；不要填公司、人名、客戶或真實工作資料。', placeholder: '例如：虛構覆核員要決定一份虛構需求能否變成草稿。' },
      { id: 'current', label: '目前怎麼簡單處理？', help: '寫人工作業、試算表或清單等做法；不用提模型或工具。', placeholder: '例如：先由人逐項閱讀資料，再決定是否交給人覆核。' },
      { id: 'human-boundary', label: '哪一件事必須由人做最後決定？', help: '同時寫下負責角色；一件不能自動做的事已足夠。', placeholder: '例如：虛構覆核員決定是否採用草稿；工具不能聯絡任何人。' },
    ],
    localBoundary: '這三個答案只留在目前頁面；重新整理會清空，本站不會儲存或傳送內容。',
    completion: '寫好你目前知道的三格後，這張 15 分鐘起步卡就完成了；它不代表作品、測試或證據已完成。',
    fullPlanner: {
      eyebrow: '下一步：另預留較長時間',
      title: '之後才做完整規劃',
      text: '完整規劃會比較最多三個方向；每個方向要做六項專案檢查（共 12 分）並填五項衡量說明。可以分段做，不屬於上方 15 分鐘起步。',
      action: '開始較長的完整規劃',
    },
  },
  'zh-Hans': {
    eyebrow: '15 分钟起步',
    title: '先写一张起步卡，不用现在完成整份规划',
    intro: '设定计时器，直接在下方填三个答案；还没想到的地方可以先留空。',
    fields: [
      { id: 'decision', label: '这份作品帮哪个虚构角色作哪个决定？', help: '只写角色和决定；不要填公司、人名、客户或真实工作资料。', placeholder: '例如：虚构审核员要决定一份虚构需求能否变成草稿。' },
      { id: 'current', label: '现在怎样简单处理？', help: '写人工、表格或清单等做法；不用提模型或工具。', placeholder: '例如：先由人逐项阅读资料，再决定是否交人复核。' },
      { id: 'human-boundary', label: '哪一件事必须由人作最后决定？', help: '同时写下负责角色；一件不能自动做的事已经足够。', placeholder: '例如：虚构审核员决定是否采用草稿；工具不能联络任何人。' },
    ],
    localBoundary: '这三个答案只留在当前页面；重新整理会清空，本站不会储存或传送内容。',
    completion: '写好你目前知道的三格后，这张 15 分钟起步卡就完成了；它不代表作品、测试或证据已完成。',
    fullPlanner: {
      eyebrow: '下一步：另预留较长时间',
      title: '之后才做完整规划',
      text: '完整规划会比较最多三个方向；每个方向要做六项项目检查（共 12 分）并填五项衡量说明。可以分段做，不属于上方 15 分钟起步。',
      action: '开始较长的完整规划',
    },
  },
  en: {
    eyebrow: '15-MINUTE START',
    title: 'Write one start card, not the whole portfolio plan',
    intro: 'Set a timer and fill the three answers below. Leave a blank when you do not know yet.',
    fields: [
      { id: 'decision', label: 'Which fictional role does this project help make which decision?', help: 'Write only a role and a decision. Do not enter a company, person, client, or real work data.', placeholder: 'For example: a fictional reviewer decides whether a fictional request can become a draft.' },
      { id: 'current', label: 'How is this handled simply today?', help: 'Describe a manual, spreadsheet, or checklist approach. Do not name a model or tool.', placeholder: 'For example: a person reads each item, then decides whether it needs human review.' },
      { id: 'human-boundary', label: 'What must a person make the final decision about?', help: 'Name the responsible role too. One action that cannot be automated is enough.', placeholder: 'For example: the fictional reviewer decides whether to use a draft; the tool cannot contact anyone.' },
    ],
    localBoundary: 'These three answers stay on this page only. Refreshing clears them; this site does not store or send them.',
    completion: 'Writing what you know in these three boxes completes this 15-minute start card. It does not mean the project, tests, or evidence are complete.',
    fullPlanner: {
      eyebrow: 'NEXT: A LONGER SESSION',
      title: 'Do the full plan later',
      text: 'The full planner compares up to three directions. Each direction has six project checks (scored out of 12) plus five measurement details. You can complete it in stages; it is not part of this 15-minute start.',
      action: 'Start the longer full planner',
    },
  },
});

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = portfolioEvidencePlannerCopy[lang];
  const path = `/${lang}/portfolio-evidence-planner`;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.title, description: copy.intro, path })
  };
}

export default async function PortfolioEvidencePlannerPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ starter?: string | string[] }>;
}) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner')) notFound();
  const scopedRelease = isScopedReleaseBuild();
  const availableArticles = getArticles();
  const roleArticle = getArticle('choose-an-ai-engineering-path');
  const proofArticle = getArticle('build-a-github-portfolio-proof-pack');
  const labsEnabled = isRouteSurfaceEnabledInCurrentBuild('labs');
  const noCodeEnabled = isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab');
  const codingEnabled = isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab');
  const requestedStarter = Array.isArray(query.starter) ? query.starter[0] : query.starter;
  const starterCaseId = requestedStarter && BUILD_LAB_CASE_IDS.includes(requestedStarter as BuildLabCaseId)
    ? requestedStarter as BuildLabCaseId
    : undefined;
  const starterTitle = starterCaseId ? buildLabCaseSelectorCopy[lang].cases[starterCaseId].title : undefined;
  const standaloneStarterHref = starterCaseId === 'coding-starter' && codingEnabled
    ? `/${lang}/coding-starter-lab`
    : starterCaseId === 'no-code' && noCodeEnabled
      ? `/${lang}/no-code-starter-lab#no-code-lab-setup-title`
      : noCodeEnabled
        ? `/${lang}/no-code-starter-lab#no-code-lab-setup-title`
        : codingEnabled
          ? `/${lang}/coding-starter-lab`
          : undefined;
  const runnableHref = labsEnabled
    ? `/${lang}/labs${starterCaseId ? `?case=${starterCaseId}#lab-case-selector-title` : ''}`
    : standaloneStarterHref;
  const referenceCopy = referenceDisclosureCopy[lang];
  const quickCopy = quickStartCopy[lang];
  return <div className="shell page planner-page">
    <PortfolioEvidencePlanner
      locale={lang}
      canExploreExamples={labsEnabled}
      canReadWorkedExamples={!scopedRelease}
      initialShape={starterCaseId ? starterShape[starterCaseId] : undefined}
      sourceStarterTitle={starterTitle}
      availableArticleSlugs={availableArticles.map(article => article.slug)}
      quickStart={<section id="portfolio-quick-start" className="planner-step planner-gap" aria-labelledby="portfolio-quick-start-title" tabIndex={-1}>
        <div className="planner-step-heading">
          <p className="eyebrow">{quickCopy.eyebrow}</p>
          <h2 className="planner-section-title" id="portfolio-quick-start-title">{quickCopy.title}</h2>
          <p>{quickCopy.intro}</p>
        </div>
        <div>
          <div className="planner-source-detail-fields" role="group" aria-labelledby="portfolio-quick-start-title">
            {quickCopy.fields.map(field => {
              const fieldId = `portfolio-quick-start-${field.id}`;
              return <label className="planner-control" htmlFor={fieldId} key={field.id}>
                <span>{field.label}</span>
                <small>{field.help}</small>
                <textarea id={fieldId} name={fieldId} rows={3} maxLength={360} placeholder={field.placeholder} autoComplete="off" />
              </label>;
            })}
          </div>
          <p className="planner-score-help" role="note">{quickCopy.localBoundary}</p>
          <p className="planner-score-help">{quickCopy.completion}</p>
          <section className="planner-source-details" aria-labelledby="portfolio-quick-start-full-title">
            <p className="eyebrow">{quickCopy.fullPlanner.eyebrow}</p>
            <h3 className="planner-source-details-heading" id="portfolio-quick-start-full-title">{quickCopy.fullPlanner.title}</h3>
            <p className="planner-source-details-help">{quickCopy.fullPlanner.text}</p>
            <p><a className="button secondary" href="#portfolio-projects">{quickCopy.fullPlanner.action} <span aria-hidden>→</span></a></p>
          </section>
        </div>
      </section>}
    />
    <PortfolioCapstonePath
      locale={lang}
      runnableHref={runnableHref}
      starterTitle={starterTitle}
      roleArticleHref={roleArticle ? articlePath(roleArticle, lang) : undefined}
      proofArticleHref={proofArticle ? articlePath(proofArticle, lang) : undefined}
    />
    {!scopedRelease ? <details className="portfolio-reference-disclosure">
      <summary><strong>{referenceCopy.title}</strong><span>{referenceCopy.text}</span></summary>
      <div className="portfolio-reference-disclosure__content">
        <PortfolioWorkedExamples locale={lang} />
        <PortfolioEvidenceHandoffCard locale={lang} />
      </div>
    </details> : null}
    <SupportNudge locale={lang} />
  </div>;
}
