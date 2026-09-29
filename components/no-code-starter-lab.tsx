'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AiAppCourseGate } from '@/components/ai-app-course-gate';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { NoCodePersonalCaseBuilderGate } from '@/components/no-code-personal-case-builder-gate';
import type { NoCodeLabTestCase, NoCodeStarterLabCopy } from '@/lib/no-code-starter-lab';
import type { Locale } from '@/lib/types';

type CopyState = 'success' | 'error';
type CopyFeedback = { target: string; state: CopyState } | null;

function noCodeStarterLabCsv(copy: NoCodeStarterLabCopy) {
  const headers = ['request_id', 'item', 'requested_quantity', 'stock_on_hand', 'quote_status', 'delivery_window', 'reason', 'source_status'];
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return [headers.join(','), ...copy.rows.map(row => [
    row.requestId,
    row.item,
    row.requestedQuantity,
    row.stockOnHand,
    row.quoteStatus,
    row.deliveryWindow,
    row.reason,
    row.sourceStatus
  ].map(escape).join(','))].join('\n');
}

function downloadText(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 0);
}

function CopyStatus({ copy, feedback, target }: { copy: NoCodeStarterLabCopy; feedback: CopyFeedback; target: string }) {
  if (feedback?.target !== target) return null;
  return <p className={`no-code-lab-copy-status no-code-lab-copy-status--${feedback.state}`} role="status" aria-live="polite" aria-atomic="true">{feedback.state === 'success' ? copy.copySuccess : copy.copyError}</p>;
}

function AssetCard({ asset, copy, feedback, onCopy }: { asset: NoCodeStarterLabCopy['assets'][number]; copy: NoCodeStarterLabCopy; feedback: CopyFeedback; onCopy: (target: string, content: string) => void }) {
  const copyTarget = `asset:${asset.id}`;
  return <article id={`no-code-lab-asset-${asset.id}`} className="no-code-lab-asset">
    <div><h3>{asset.title}</h3><p>{asset.description}</p></div>
    <div className="no-code-lab-actions">
      <button type="button" className="button secondary" aria-label={`${copy.copyAction}: ${asset.title}`} onClick={() => onCopy(copyTarget, asset.content)}>{copy.copyAction}</button>
      <button type="button" className="button secondary" aria-label={`${copy.downloadAction}: ${asset.title}`} onClick={() => downloadText(asset.fileName, asset.content, 'text/markdown')}>{copy.downloadAction}</button>
    </div>
    <CopyStatus copy={copy} feedback={feedback} target={copyTarget} />
    <details open={asset.id === 'reviewerRecord'}>
      <summary>{asset.fileName}</summary>
      <pre role="region" aria-label={asset.title} tabIndex={0}><code>{asset.content}</code></pre>
    </details>
  </article>;
}

function TestCaseCard({ testCase, copy }: { testCase: NoCodeLabTestCase; copy: NoCodeStarterLabCopy }) {
  return <article id={`no-code-lab-case-${testCase.id.toLowerCase()}`} className="no-code-lab-test-case">
    <p className="eyebrow">{testCase.id}</p>
    <h4>{testCase.title}</h4>
    <details open>
      <summary>{copy.testInputLabel}</summary>
      <pre role="region" aria-label={`${copy.testInputLabel}: ${testCase.id}`} tabIndex={0}><code>{testCase.input}</code></pre>
    </details>
    <details className="no-code-lab-answer-reveal">
      <summary>{copy.answerReveal.summary}</summary>
      <p>{copy.answerReveal.intro}</p>
      <div className="no-code-lab-test-reference">
        <p><strong>{copy.expectedOutcomeLabel}</strong><span>{testCase.expectedRoute}</span></p>
        <div><h5>{copy.expectedChecksLabel}</h5><ul>{testCase.expectedChecks.map(check => <li key={check}>{check}</li>)}</ul></div>
      </div>
    </details>
  </article>;
}

function StaticDraftReview({ copy }: { copy: NoCodeStarterLabCopy }) {
  const sample = copy.reviewSample;
  return <section className="no-code-lab-section no-code-lab-review-sample" aria-labelledby="no-code-lab-review-sample-title">
    <div className="no-code-lab-section-heading"><p className="eyebrow">{sample.eyebrow}</p><h2 id="no-code-lab-review-sample-title">{sample.title}</h2><p>{sample.intro}</p></div>
    <div className="no-code-lab-review-sample-grid">
      <section><h3>{sample.requestShapeLabel}</h3><pre role="region" aria-label={sample.requestShapeLabel} tabIndex={0}><code>{sample.requestShape}</code></pre></section>
      <section><h3>{sample.draftLabel}</h3><pre role="region" aria-label={sample.draftLabel} tabIndex={0}><code>{sample.draft}</code></pre></section>
    </div>
    <p className="no-code-lab-review-question">{sample.question}</p>
    <details className="no-code-lab-answer-reveal no-code-lab-review-answer">
      <summary>{sample.answerSummary}</summary>
      <div className="no-code-lab-test-reference"><h3>{sample.answerTitle}</h3><ul>{sample.answer.map(item => <li key={item}>{item}</li>)}</ul></div>
    </details>
  </section>;
}

function FirstRun({ copy }: { copy: NoCodeStarterLabCopy }) {
  const firstRun = copy.firstRun;

  return <section className="no-code-lab-first-run" aria-labelledby="no-code-lab-first-run-title">
    <p className="eyebrow">{firstRun.eyebrow}</p>
    <h2 id="no-code-lab-first-run-title">{firstRun.title}</h2>
    <p>{firstRun.intro}</p>
    <ol>{firstRun.steps.map(step => <li key={step}>{step}</li>)}</ol>
    <aside role="note">{firstRun.expected}</aside>
    <div className="no-code-lab-actions">
      <a className="button secondary" href="#no-code-lab-case-ac-01">{firstRun.manualAction}</a>
      <a className="button secondary" href="#no-code-lab-manual-title">{firstRun.fullExerciseAction}</a>
      <a className="button secondary" href="#no-code-personal-case-builder-title">{firstRun.personalCaseAction}</a>
    </div>
  </section>;
}

export default function NoCodeStarterLab({
  locale,
  copy,
  sourcePackHref,
  handoffArticleHref,
  portfolioHref,
}: {
  locale: Locale;
  copy: NoCodeStarterLabCopy;
  sourcePackHref?: string;
  handoffArticleHref?: string;
  portfolioHref?: string;
}) {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const copyClearTimeout = useRef<number | null>(null);
  const csv = noCodeStarterLabCsv(copy);
  const planPrompt = `${copy.prompt}\n\n## ${copy.draftPromptCsvHeading}\n${csv}`;
  const reviewerRecord = copy.assets.find(asset => asset.id === 'reviewerRecord');

  useEffect(() => () => {
    if (copyClearTimeout.current !== null) window.clearTimeout(copyClearTimeout.current);
  }, []);

  function showCopyState(target: string, nextState: CopyState) {
    setCopyFeedback({ target, state: nextState });
    if (copyClearTimeout.current !== null) window.clearTimeout(copyClearTimeout.current);
    copyClearTimeout.current = window.setTimeout(() => {
      setCopyFeedback(null);
      copyClearTimeout.current = null;
    }, 4000);
  }

  async function copyText(target: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      showCopyState(target, 'success');
    } catch {
      showCopyState(target, 'error');
    }
  }

  return <section className="no-code-starter-lab" aria-labelledby="no-code-starter-lab-title">
    <FragmentAnchorScroll />
    <header className="no-code-lab-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="no-code-starter-lab-title">{copy.title}</h1>
      <p>{copy.intro}</p>
      <aside className="no-code-lab-boundary" role="note">{copy.boundary}</aside>
      <section className="no-code-lab-working-terms" aria-labelledby="no-code-lab-working-terms-title">
        <p className="eyebrow">{copy.workingTerms.eyebrow}</p>
        <h2 id="no-code-lab-working-terms-title">{copy.workingTerms.title}</h2>
        <p>{copy.workingTerms.intro}</p>
        <dl>{copy.workingTerms.terms.map(term => <div key={term.term}><dt>{term.term}</dt><dd>{term.definition}</dd></div>)}</dl>
      </section>
      <nav className="no-code-lab-quick-links" aria-label={copy.quickLinks.label}>
        <a className="button secondary" href="#no-code-lab-first-run-title">{copy.quickLinks.manual}</a>
        <a className="button secondary" href="#no-code-lab-manual-title">{copy.quickLinks.fullExercise}</a>
        <a className="button secondary" href="#no-code-personal-case-builder-title">{copy.quickLinks.personalCase}</a>
      </nav>
    </header>

    <FirstRun copy={copy} />

    {sourcePackHref ? <div className="no-code-lab-source-pack"><a className="button secondary" href={sourcePackHref} download>{copy.sourcePack.action}</a><p>{copy.sourcePack.note}</p></div> : null}

    <section className="starter-lab-practice-map" aria-labelledby="no-code-lab-practice-map-title">
      <p className="eyebrow">{copy.practiceMap.eyebrow}</p>
      <h2 id="no-code-lab-practice-map-title">{copy.practiceMap.title}</h2>
      <div className="starter-lab-practice-map-grid">
        <section><h3>{copy.practiceMap.workflowTitle}</h3><ul>{copy.practiceMap.workflow.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h3>{copy.practiceMap.decisionTitle}</h3><ul>{copy.practiceMap.decision.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
    </section>

    <section className="no-code-lab-section" aria-labelledby="no-code-lab-setup-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.setup}</p><h2 id="no-code-lab-setup-title">{copy.setupTitle}</h2></div>
      <ol className="no-code-lab-setup">{copy.setup.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    </section>

    <section className="no-code-lab-section" aria-labelledby="no-code-lab-data-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.data}</p><h2 id="no-code-lab-data-title">{copy.dataTitle}</h2><p>{copy.dataIntro}</p></div>
      <p className="no-code-lab-data-notice" role="note">{copy.dataNotice}</p>
      <div className="no-code-lab-table" role="region" aria-label={copy.tableLabel} tabIndex={0}>
        <table>
          <thead><tr>{Object.entries(copy.tableHeaders).map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead>
          <tbody>{copy.rows.map(row => <tr key={row.requestId}>
            <td>{row.requestId}</td><td>{row.item}</td><td>{row.requestedQuantity}</td><td>{row.stockOnHand}</td><td>{row.quoteStatus}</td><td>{row.deliveryWindow}</td><td>{row.reason}</td><td>{row.sourceStatus}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="no-code-lab-actions">
        <button type="button" className="button secondary" onClick={() => downloadText(copy.csvFileName, csv, 'text/csv')}>{copy.csvDownload}</button>
        <button type="button" className="button secondary" onClick={() => copyText('csv', csv)}>{copy.csvCopy}</button>
      </div>
      <CopyStatus copy={copy} feedback={copyFeedback} target="csv" />
    </section>

    <section className="no-code-lab-section no-code-lab-manual" aria-labelledby="no-code-lab-manual-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.manual}</p><h2 id="no-code-lab-manual-title">{copy.manualTitle}</h2><p>{copy.manualIntro}</p></div>
      {reviewerRecord ? <article className="no-code-lab-asset no-code-lab-inline-record">
        <div><h3>{reviewerRecord.title}</h3><p>{reviewerRecord.description}</p></div>
        <details>
          <summary>{copy.manualRecordAction}</summary>
          <p>{copy.manualRecordHint}</p>
          <div className="no-code-lab-actions">
            <button type="button" className="button secondary" aria-label={`${copy.manualRecordCopy}: ${reviewerRecord.title}`} onClick={() => copyText('manual-record', reviewerRecord.content)}>{copy.manualRecordCopy}</button>
          </div>
          <CopyStatus copy={copy} feedback={copyFeedback} target="manual-record" />
          <pre role="region" aria-label={reviewerRecord.title} tabIndex={0}><code>{reviewerRecord.content}</code></pre>
        </details>
      </article> : null}
      <ol className="no-code-lab-manual-steps">{copy.manualSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
      <div className="no-code-lab-test-cases" aria-labelledby="no-code-lab-test-cases-title">
        <div><h3 id="no-code-lab-test-cases-title">{copy.testCasesTitle}</h3><p>{copy.testCasesIntro}</p></div>
        <div>{copy.testCases.map(testCase => <TestCaseCard key={testCase.id} testCase={testCase} copy={copy} />)}</div>
      </div>
    </section>

    <section className="no-code-lab-section" aria-labelledby="no-code-lab-assets-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.assets}</p><h2 id="no-code-lab-assets-title">{copy.assetsTitle}</h2><p>{copy.assetsIntro}</p></div>
      <div className="no-code-lab-assets">{copy.assets.map(asset => <AssetCard key={asset.id} asset={asset} copy={copy} feedback={copyFeedback} onCopy={copyText} />)}</div>
    </section>

    <StaticDraftReview copy={copy} />

    <NoCodePersonalCaseBuilderGate locale={locale} />

    <AiAppCourseGate locale={locale} />

    <section className="no-code-lab-section no-code-lab-prompt-section" aria-labelledby="no-code-lab-prompt-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.prompt}</p><h2 id="no-code-lab-prompt-title">{copy.optionalChatTitle}</h2><p>{copy.optionalChatIntro}</p></div>
      <div className="no-code-lab-prompt">
        <h3>{copy.promptTitle}</h3>
        <p>{copy.promptIntro}</p>
        <div className="no-code-lab-actions">
          <button type="button" className="button secondary" onClick={() => copyText('plan-prompt', planPrompt)}>{copy.promptCopy}</button>
          <button type="button" className="button secondary" onClick={() => downloadText(copy.promptFileName, planPrompt, 'text/plain')}>{copy.promptDownload}</button>
        </div>
        <CopyStatus copy={copy} feedback={copyFeedback} target="plan-prompt" />
        <pre role="region" aria-label={copy.promptTitle} tabIndex={0}><code>{planPrompt}</code></pre>
      </div>
    </section>

    <section className="no-code-lab-section no-code-lab-output" aria-labelledby="no-code-lab-output-title">
      <p className="eyebrow">{copy.sectionEyebrows.output}</p><h2 id="no-code-lab-output-title">{copy.outputTitle}</h2>
      <ul>{copy.outputItems.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <aside className="no-code-lab-handoff" aria-labelledby="no-code-lab-handoff-title">
      <p className="eyebrow">{copy.sectionEyebrows.handoff}</p><h2 id="no-code-lab-handoff-title">{copy.handoffTitle}</h2><p>{copy.handoffText}</p>
      {handoffArticleHref || portfolioHref ? <div className="no-code-lab-actions">
        {handoffArticleHref ? <Link className="button secondary" href={handoffArticleHref}>{copy.handoffAction} <span aria-hidden>→</span></Link> : null}
        {portfolioHref ? <Link className="button secondary" href={portfolioHref}>{copy.portfolioAction} <span aria-hidden>→</span></Link> : null}
      </div> : null}
    </aside>
  </section>;
}
