import {
  portfolioEvidencePlannerCopy,
  portfolioLocalExampleCopy,
  portfolioRunnableStarterCopy,
  portfolioWorkedExampleCopy,
  type PortfolioLocalExample,
  type PortfolioRunnableStarter,
  type PortfolioWorkedExample,
} from '@/lib/portfolio-evidence-planner';
import { getPortfolioExampleReceipts } from '@/lib/portfolio-example-receipts';
import { articlePath, getArticle } from '@/lib/content';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord, staticAssetHref, staticAssetLocale } from '@/lib/types';

const disclosureCopy: Record<Locale, { label: string; action: string }> = canonicalLocaleRecord({
  'zh-HK': { label: '完整案例', action: '展開做法、固定 cases 同界線' },
  'zh-TW': { label: '完整案例', action: '展開做法、固定案例與界線' },
  'zh-Hans': { label: '完整案例', action: '展开做法、固定案例与边界' },
  en: { label: 'FULL CASE', action: 'Open the method, fixed cases, and boundary' },
});

const starterIndexCopy: Record<Locale, { eyebrow: string; title: string; intro: string; guide: string; commands: string }> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '由一個練習開始',
    title: '六個可以自己跑嘅作品集 starter',
    intro: '每個 zip 都只用固定虛構資料，同埋附上本機檢查指令。跑到 pass，只代表你喺呢批 cases 重做咗練習；唔代表真實資料、模型表現、商業價值或 deployment 已獲證明。',
    guide: '睇完整 build guide',
    commands: '練習包入面可跑'
  },
  'zh-TW': {
    eyebrow: '從一份練習開始',
    title: '六個可以自行執行的作品集 starter',
    intro: '每個 zip 只使用固定虛構資料，並附有本機檢查指令。跑到 pass，只代表你在這批 cases 重做了練習；不代表真實資料、模型表現、商業價值或 deployment 已獲證明。',
    guide: '查看完整 build guide',
    commands: '練習包內可執行'
  },
  'zh-Hans': {
    eyebrow: '从一份练习开始',
    title: '六个可以自行运行的作品集 starter',
    intro: '每个 zip 只使用固定虚构资料，并附有本地检查指令。运行到 pass，只代表你在这批 cases 重做了练习；不代表真实资料、模型表现、商业价值或 deployment 已获证明。',
    guide: '查看完整 build guide',
    commands: '练习包内可运行'
  },
  en: {
    eyebrow: 'START WITH ONE EXERCISE',
    title: 'Six portfolio starters you can run yourself',
    intro: 'Each zip uses fixed fictional material and includes local check commands. A passing run only means you repeated the exercise on those cases; it does not establish real data quality, model behaviour, business value, or deployment.',
    guide: 'Read the full build guide',
    commands: 'Run inside the starter'
  }
});

const flagshipGuideCopy: Record<Locale, { eyebrow: string; title: string; intro: string; boundary: string; guide: string; worksheet: string }> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '先集中一個主力案例',
    title: '未開第二個 project 前，先砌好呢六格',
    intro: '如果你而家有幾個半完成想法，先用呢篇指南揀一個有限問題，再留下決定、資料界線、簡單起點、固定情境、停低位同交接。',
    boundary: '呢份工作紙只幫你整理本機學習證據；唔會建立 repository、上載資料，亦唔會證明商業成果或 production readiness。',
    guide: '閱讀主力案例指南',
    worksheet: '下載六格工作紙'
  },
  'zh-TW': {
    eyebrow: '先集中一個主力案例',
    title: '還沒開始第二個 project 前，先完成這六格',
    intro: '如果你現在有幾個半完成的想法，先用這篇指南選一個有限問題，再留下決策、資料邊界、簡單起點、固定情境、停止點與交接。',
    boundary: '這份工作表只幫你整理本機學習證據；不會建立 repository、上傳資料，也不會證明商業成果或 production readiness。',
    guide: '閱讀主力案例指南',
    worksheet: '下載六格工作表'
  },
  'zh-Hans': {
    eyebrow: '先集中一个主力案例',
    title: '开始第二个 project 前，先完成这六格',
    intro: '如果你现在有几个半完成的想法，先用这篇指南选一个有限问题，再留下决策、数据边界、简单起点、固定情境、停止点与交接。',
    boundary: '这份工作表只帮你整理本地学习证据；不会建立 repository、上传资料，也不会证明商业成果或 production readiness。',
    guide: '阅读主力案例指南',
    worksheet: '下载六格工作表'
  },
  en: {
    eyebrow: 'FOCUS ONE FLAGSHIP CASE',
    title: 'Finish these six rows before opening a second project',
    intro: 'If you have several half-finished ideas, use this guide to choose one bounded problem and record its decision, data boundary, simple start, fixed situations, stop point, and hand-off.',
    boundary: 'This worksheet only helps organise local learning evidence. It does not create a repository, upload data, or establish a business outcome or production readiness.',
    guide: 'Read the flagship-case guide',
    worksheet: 'Download the six-row worksheet'
  }
});

function PortfolioFlagshipGuide({ locale }: { locale: Locale }) {
  const article = getArticle('build-one-flagship-ai-portfolio-project');
  if (!article) return null;

  const copy = flagshipGuideCopy[locale];
  const boundaryId = 'portfolio-flagship-guide-boundary';
  const worksheetHref = `/downloads/flagship-portfolio-architecture/v1/${staticAssetLocale(locale)}.pdf`;

  return <section className="portfolio-flagship-guide" aria-labelledby="portfolio-flagship-guide-title">
    <div>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h3 id="portfolio-flagship-guide-title">{copy.title}</h3>
      <p>{copy.intro}</p>
      <p id={boundaryId} className="portfolio-flagship-guide__boundary" role="note">{copy.boundary}</p>
    </div>
    <div className="portfolio-flagship-guide__actions">
      <a className="button primary" href={articlePath(article, locale)}>{copy.guide} <span aria-hidden>→</span></a>
      <a className="text-link" href={worksheetHref} download aria-describedby={boundaryId}>{copy.worksheet} <span aria-hidden>↓</span></a>
    </div>
  </section>;
}

function PortfolioStarterIndex({ locale }: { locale: Locale }) {
  const copy = starterIndexCopy[locale];
  const starters = getPortfolioExampleReceipts().flatMap(receipt => {
    const article = getArticle(receipt.articleSlug);
    const starter = receipt.readerStarter;
    return article && starter ? [{ articleHref: articlePath(article, locale), receipt, starter }] : [];
  });

  if (!starters.length) return null;

  return <section className="portfolio-starter-index" aria-labelledby="portfolio-starter-index-title">
    <header>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h3 id="portfolio-starter-index-title">{copy.title}</h3>
      <p>{copy.intro}</p>
    </header>
    <ul>
      {starters.map(({ articleHref, receipt, starter }) => {
        const starterCopy = starter.copy[locale];
        return <li key={receipt.exampleId}>
          <article>
            <h4>{starterCopy.title}</h4>
            <p>{starterCopy.text}</p>
            <p className="portfolio-starter-index__boundary" role="note">{starterCopy.boundary}</p>
            <p className="portfolio-starter-index__commands"><span>{copy.commands}</span>{starter.commands.map(command => <code key={command}>{command}</code>)}</p>
            <div className="portfolio-starter-index__actions">
              <a className="button secondary" href={starter.downloadHref} download>{starterCopy.download} <span aria-hidden>↓</span></a>
              <a className="text-link" href={articleHref}>{copy.guide} <span aria-hidden>→</span></a>
            </div>
          </article>
        </li>;
      })}
    </ul>
  </section>;
}

function WorkedEvidencePack({ example }: { example: PortfolioWorkedExample }) {
  return <section className="planner-worked-example" aria-labelledby="portfolio-worked-example-title">
    <header className="planner-worked-example-header">
      <p className="eyebrow">{example.eyebrow}</p>
      <h3 id="portfolio-worked-example-title">{example.title}</h3>
      <p>{example.intro}</p>
      <p className="planner-worked-availability" role="note">{example.availability}</p>
      <p className="planner-worked-boundary" role="note">{example.boundary}</p>
    </header>

    <nav className="planner-worked-guides" aria-labelledby="portfolio-worked-guides-title">
      <h3 id="portfolio-worked-guides-title">{example.guideHeading}</h3>
      <ul>{example.guideLinks.map(link => <li key={link.href}><a href={link.href}>{link.label} <span aria-hidden>→</span></a></li>)}</ul>
    </nav>

    <section className="planner-worked-decision" aria-labelledby="portfolio-worked-decision-title">
      <h3 id="portfolio-worked-decision-title">{example.decisionHeading}</h3>
      <dl>{example.decisionCards.map(card => <div key={card.label}><dt>{card.label}</dt><dd>{card.value}</dd></div>)}</dl>
    </section>

    <section className="planner-worked-data" aria-labelledby="portfolio-worked-data-title">
      <header><h3 id="portfolio-worked-data-title">{example.dataHeading}</h3><p>{example.dataIntro}</p></header>
      <dl>{example.dataFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      <ul className="planner-worked-links">{example.dataLinks.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden>↗</span></a></li>)}</ul>
    </section>

    <section className="planner-worked-flow" aria-labelledby="portfolio-worked-flow-title">
      <h3 id="portfolio-worked-flow-title">{example.flowHeading}</h3>
      <ol>{example.flow.map(step => <li key={step.title}><article><h4>{step.title}</h4><p>{step.text}</p><code>{step.artefact}</code></article></li>)}</ol>
    </section>

    <section className="planner-worked-evidence" aria-labelledby="portfolio-worked-evidence-title">
      <h3 id="portfolio-worked-evidence-title">{example.evidenceHeading}</h3>
      <div>
        <section><h4>{example.technicalHeading}</h4><ul>{example.technical.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>{example.nonTechnicalHeading}</h4><ul>{example.nonTechnical.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
    </section>

    <section className="planner-worked-eval" aria-labelledby="portfolio-worked-eval-title">
      <div><h3 id="portfolio-worked-eval-title">{example.evalHeading}</h3><p>{example.evalIntro}</p></div>
      <ul>{example.evalCases.map(item => <li key={item}>{item}</li>)}</ul>
      <aside><h4>{example.fixtureHeading}</h4><p>{example.fixtureText}</p></aside>
    </section>

    <section className="planner-worked-delta" aria-labelledby="portfolio-worked-delta-title">
      <div><h3 id="portfolio-worked-delta-title">{example.deltaHeading}</h3><p>{example.deltaText}</p></div>
      <ul>{example.deltaRules.map(rule => <li key={rule}>{rule}</li>)}</ul>
    </section>

    <section className="planner-worked-build" aria-labelledby="portfolio-worked-build-title">
      <header><h3 id="portfolio-worked-build-title">{example.selfLearnHeading}</h3><p>{example.selfLearnIntro}</p></header>
      <ol>{example.selfLearnSteps.map(step => <li key={step.title}><article><h4>{step.title}</h4><p>{step.text}</p><code>{step.artefact}</code></article></li>)}</ol>
    </section>

    <aside className="planner-worked-nonclaims"><h3>{example.noClaimsHeading}</h3><p>{example.noClaims}</p></aside>
  </section>;
}

function LocalPortfolioExamplePack({ example }: { example: PortfolioLocalExample }) {
  return <section id="workforce-signal-brief" className="planner-local-example" aria-labelledby="portfolio-local-example-title">
    <header className="planner-local-example-header">
      <p className="eyebrow">{example.eyebrow}</p>
      <h3 id="portfolio-local-example-title">{example.title}</h3>
      <p>{example.intro}</p>
      <p className="planner-local-availability" role="note">{example.availability}</p>
      <p className="planner-local-boundary" role="note">{example.boundary}</p>
    </header>

    <section className="planner-local-starter" aria-labelledby="portfolio-local-starter-title">
      <div>
        <h3 id="portfolio-local-starter-title">{example.starter.title}</h3>
        <p>{example.starter.text}</p>
        <p id="portfolio-local-starter-boundary" className="planner-local-starter-boundary" role="note">{example.starter.boundary}</p>
      </div>
      <div className="planner-local-starter-actions">
        <a className="button secondary" href={example.starter.href} download aria-describedby="portfolio-local-starter-boundary">{example.starter.action} <span aria-hidden>↓</span></a>
        <a className="text-link" href={staticAssetHref(example.starter.worksheetHref)} download aria-describedby="portfolio-local-starter-boundary">{example.starter.worksheetAction} <span aria-hidden>↓</span></a>
      </div>
    </section>

    <div className="planner-local-foundation">
      <section aria-labelledby="portfolio-local-source-title">
        <h3 id="portfolio-local-source-title">{example.sourceHeading}</h3>
        <ul>{example.source.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="planner-local-source-links">{example.sourceLinks.map((link, index) => <span key={link.href}>{index > 0 ? ' · ' : ''}<a href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden>↗</span></a></span>)}</p>
      </section>
      <section aria-labelledby="portfolio-local-decision-title">
        <h3 id="portfolio-local-decision-title">{example.decisionHeading}</h3>
        <ul>{example.decision.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
    </div>

    <section className="planner-local-evidence" aria-labelledby="portfolio-local-evidence-title">
      <h3 id="portfolio-local-evidence-title">{example.evidenceHeading}</h3>
      <div>
        <section><h4>{example.technicalHeading}</h4><ul>{example.technical.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>{example.deliveryHeading}</h4><ul>{example.delivery.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
    </section>

    <section className="planner-local-frameworks" aria-labelledby="portfolio-local-framework-title">
      <header><h3 id="portfolio-local-framework-title">{example.frameworkHeading}</h3><p>{example.frameworkIntro}</p></header>
      <ol>{example.frameworks.map(item => <li key={item.title}><article><h4>{item.title}</h4><p>{item.text}</p></article></li>)}</ol>
    </section>

    <nav className="planner-local-further" aria-labelledby="portfolio-local-further-title">
      <h3 id="portfolio-local-further-title">{example.furtherHeading}</h3>
      <ul>{example.furtherLinks.map(link => <li key={link.href}><a href={link.href}>{link.label} <span aria-hidden>→</span></a></li>)}</ul>
    </nav>
  </section>;
}

function RunnablePortfolioStarter({ starter }: { starter: PortfolioRunnableStarter }) {
  return <section id="renewal-triage-starter" className="planner-local-example" aria-labelledby="renewal-triage-starter-title">
    <header className="planner-local-example-header">
      <p className="eyebrow">{starter.eyebrow}</p>
      <h3 id="renewal-triage-starter-title">{starter.title}</h3>
      <p>{starter.intro}</p>
    </header>

    <section className="planner-local-starter" aria-labelledby="renewal-triage-download-title">
      <div>
        <h3 id="renewal-triage-download-title">{starter.downloadTitle}</h3>
        <p>{starter.downloadText}</p>
        <p id="renewal-triage-starter-boundary" className="planner-local-starter-boundary" role="note">{starter.boundary}</p>
      </div>
      <div className="planner-local-starter-actions">
        <a className="button primary" download href={starter.downloadHref} aria-describedby="renewal-triage-starter-boundary">{starter.download} <span aria-hidden>↓</span></a>
        <a className="text-link" href={staticAssetHref(starter.readmeHref)}>{starter.readme} <span aria-hidden>→</span></a>
      </div>
    </section>

    <section className="planner-local-evidence" aria-labelledby="renewal-triage-evidence-title">
      <h3 id="renewal-triage-evidence-title">{starter.evidenceHeading}</h3>
      <div>
        <section><h4>{starter.technicalHeading}</h4><ul>{starter.technical.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>{starter.deliveryHeading}</h4><ul>{starter.delivery.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
    </section>

    <aside className="planner-local-boundary planner-runnable-starter-next" role="note"><h3>{starter.nextHeading}</h3><p>{starter.nextText}</p></aside>
  </section>;
}

function ExampleDisclosure({ locale, title, children }: { locale: Locale; title: string; children: ReactNode }) {
  const copy = disclosureCopy[locale];
  return <details className="planner-example-disclosure">
    <summary>
      <span>{copy.label}</span>
      <strong>{title}</strong>
      <small>{copy.action} <span aria-hidden>↓</span></small>
    </summary>
    <div className="planner-example-disclosure__content">{children}</div>
  </details>;
}

/**
 * Case studies stay in the server-rendered page so the interactive planner
 * ships only its form logic. They remain available on the same route, but are
 * deliberately collapsed until a reader chooses one to study.
 */
export function PortfolioWorkedExamples({ locale }: { locale: Locale }) {
  const copy = portfolioEvidencePlannerCopy[locale];
  const workedExample = portfolioWorkedExampleCopy[locale];
  const localExample = portfolioLocalExampleCopy[locale];
  const runnableStarter = portfolioRunnableStarterCopy[locale];

  return <section id="portfolio-worked-examples" className="planner-examples" aria-labelledby="portfolio-worked-examples-title" tabIndex={-1}>
    <header className="planner-examples-header">
      <p className="eyebrow">{copy.workedExamplesEyebrow}</p>
      <h2 id="portfolio-worked-examples-title">{copy.workedExamplesHeading}</h2>
      <p>{copy.workedExamplesIntro}</p>
    </header>
    <PortfolioFlagshipGuide locale={locale} />
    <PortfolioStarterIndex locale={locale} />
    <ExampleDisclosure locale={locale} title={workedExample.title}><WorkedEvidencePack example={workedExample} /></ExampleDisclosure>
    <ExampleDisclosure locale={locale} title={localExample.title}><LocalPortfolioExamplePack example={localExample} /></ExampleDisclosure>
    <ExampleDisclosure locale={locale} title={runnableStarter.title}><RunnablePortfolioStarter starter={runnableStarter} /></ExampleDisclosure>
  </section>;
}
