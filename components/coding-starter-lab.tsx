'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import type { CodingStarterLabCopy, CodingStarterLabSourceAsset } from '@/lib/coding-starter-lab';

type CopyState = 'success' | 'error';
type CopyFeedback = { target: string; state: CopyState } | null;

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

function CopyStatus({ copy, feedback, target }: {
  copy: CodingStarterLabCopy;
  feedback: CopyFeedback;
  target: string;
}) {
  if (feedback?.target !== target) return null;
  return <p className={`no-code-lab-copy-status no-code-lab-copy-status--${feedback.state}`} role="status" aria-live="polite" aria-atomic="true">{feedback.state === 'success' ? copy.copySuccess : copy.copyError}</p>;
}

function AssetCard({ asset, copy, feedback, onCopy }: {
  asset: CodingStarterLabSourceAsset & { title: string; description: string };
  copy: CodingStarterLabCopy;
  feedback: CopyFeedback;
  onCopy: (target: string, content: string) => void;
}) {
  const copyTarget = `asset:${asset.id}`;
  return <article className="no-code-lab-asset">
    <div><h3>{asset.title}</h3><p>{asset.description}</p></div>
    <div className="no-code-lab-actions">
      <button type="button" className="button secondary" aria-label={`${copy.copyAction}: ${asset.title}`} onClick={() => onCopy(copyTarget, asset.content)}>{copy.copyAction}</button>
      <button type="button" className="button secondary" aria-label={`${copy.downloadAction}: ${asset.fileName}`} onClick={() => downloadText(asset.fileName, asset.content, 'text/plain')}>{copy.downloadAction}</button>
    </div>
    <CopyStatus copy={copy} feedback={feedback} target={copyTarget} />
    <details>
      <summary>{asset.fileName}</summary>
      <pre role="region" aria-label={asset.title} tabIndex={0}><code>{asset.content}</code></pre>
    </details>
  </article>;
}

export default function CodingStarterLab({
  copy,
  codingStarterLabAssets: assets,
  codingStarterLabReferenceAsset: referenceAsset,
  codingStarterLabAgentPromptPack: agentPromptPack,
  codingStarterLabSourcePack: sourcePack,
  handoffArticleHref,
  portfolioHref,
}: {
  copy: CodingStarterLabCopy;
  codingStarterLabAssets: Array<CodingStarterLabSourceAsset & { title: string; description: string }>;
  codingStarterLabReferenceAsset: CodingStarterLabSourceAsset & { title: string; description: string };
  codingStarterLabAgentPromptPack: string;
  codingStarterLabSourcePack: string;
  handoffArticleHref?: string;
  portfolioHref?: string;
}) {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const [baselineRecorded, setBaselineRecorded] = useState(false);
  const [answersRevealed, setAnswersRevealed] = useState(false);
  const copyClearTimeout = useRef<number | null>(null);
  const referenceReveal = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => {
    if (copyClearTimeout.current !== null) window.clearTimeout(copyClearTimeout.current);
  }, []);

  useEffect(() => {
    if (answersRevealed) referenceReveal.current?.focus();
  }, [answersRevealed]);

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

  return <section className="coding-starter-lab no-code-starter-lab" aria-labelledby="coding-starter-lab-title">
    <FragmentAnchorScroll />
    <header className="no-code-lab-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="coding-starter-lab-title">{copy.title}</h1>
      <p>{copy.intro}</p>
      <aside className="no-code-lab-boundary" role="note">{copy.boundary}</aside>
    </header>

    <section className="no-code-lab-section no-code-lab-manual" aria-labelledby="coding-starter-lab-quick-title">
      <div className="no-code-lab-section-heading">
        <p className="eyebrow">{copy.quickStart.eyebrow}</p>
        <h2 id="coding-starter-lab-quick-title">{copy.quickStart.title}</h2>
        <p>{copy.quickStart.intro}</p>
      </div>
      <ol className="no-code-lab-manual-steps">{copy.quickStart.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
      <details className="no-code-lab-boundary">
        <summary>{copy.quickStart.referenceTitle}</summary>
        <p>{copy.quickStart.reference}</p>
      </details>
      <aside className="no-code-lab-data-notice" role="note">{copy.quickStart.boundary}</aside>
      <div className="no-code-lab-actions"><a className="button secondary" href="#coding-starter-lab-setup-title">{copy.quickStart.fullLabAction} <span aria-hidden>→</span></a></div>
    </section>

    <section className="starter-lab-practice-map" aria-labelledby="coding-starter-lab-practice-map-title">
      <p className="eyebrow">{copy.practiceMap.eyebrow}</p>
      <h2 id="coding-starter-lab-practice-map-title">{copy.practiceMap.title}</h2>
      <div className="starter-lab-practice-map-grid">
        <section><h3>{copy.practiceMap.workflowTitle}</h3><ul>{copy.practiceMap.workflow.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h3>{copy.practiceMap.decisionTitle}</h3><ul>{copy.practiceMap.decision.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
    </section>

    <section className="no-code-lab-section" aria-labelledby="coding-starter-lab-setup-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.setup}</p><h2 id="coding-starter-lab-setup-title">{copy.setupTitle}</h2></div>
      <ol className="no-code-lab-setup">{copy.setup.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    </section>

    <section className="no-code-lab-section" aria-labelledby="coding-starter-lab-assets-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.assets}</p><h2 id="coding-starter-lab-assets-title">{copy.assetsTitle}</h2><p>{copy.assetsIntro}</p></div>
      <p className="no-code-lab-data-notice" role="note">{copy.assetsNotice}</p>
      <div className="no-code-lab-actions">
        <button type="button" className="button secondary" onClick={() => copyText('source-pack', sourcePack)}>{copy.bundleCopy}</button>
        <button type="button" className="button secondary" onClick={() => downloadText('coding-starter-lab-source-pack.txt', sourcePack, 'text/plain')}>{copy.bundleDownload}</button>
      </div>
      <CopyStatus copy={copy} feedback={copyFeedback} target="source-pack" />
      <div className="no-code-lab-assets">{assets.map(asset => <AssetCard key={asset.id} asset={asset} copy={copy} feedback={copyFeedback} onCopy={copyText} />)}</div>
    </section>

    <section className="no-code-lab-section no-code-lab-manual" aria-labelledby="coding-starter-lab-manual-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.manual}</p><h2 id="coding-starter-lab-manual-title">{copy.manualTitle}</h2><p>{copy.manualIntro}</p></div>
      <ol className="no-code-lab-manual-steps">{copy.manualSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
    </section>

    <section className="no-code-lab-section" aria-labelledby="coding-starter-lab-reference-title">
      <div className="no-code-lab-section-heading">
        <p className="eyebrow">{copy.sectionEyebrows.reference}</p>
        <h2 id="coding-starter-lab-reference-title">{copy.referenceGateTitle}</h2>
        <p id="coding-starter-lab-reference-intro">{copy.referenceGateIntro}</p>
      </div>
      {!answersRevealed ? <div className="no-code-lab-boundary">
        <label>
          <input
            type="checkbox"
            checked={baselineRecorded}
            onChange={event => setBaselineRecorded(event.target.checked)}
            aria-describedby="coding-starter-lab-reference-intro"
          />{' '}
          {copy.referenceGateConfirmation}
        </label>
        <div className="no-code-lab-actions">
          <button
            type="button"
            className="button secondary"
            disabled={!baselineRecorded}
            aria-controls="coding-starter-lab-reference-reveal"
            aria-expanded={answersRevealed}
            onClick={() => setAnswersRevealed(true)}
          >{copy.referenceGateAction}</button>
        </div>
      </div> : null}
      <div
        id="coding-starter-lab-reference-reveal"
        ref={referenceReveal}
        role="region"
        aria-labelledby="coding-starter-lab-reference-title"
        tabIndex={-1}
        hidden={!answersRevealed}
      >
        <p className="no-code-lab-data-notice" role="status" aria-live="polite">{copy.referenceGateRevealed}</p>
        <div className="no-code-lab-assets"><AssetCard asset={referenceAsset} copy={copy} feedback={copyFeedback} onCopy={copyText} /></div>
      </div>
    </section>

    <section className="no-code-lab-section no-code-lab-prompt-section" aria-labelledby="coding-starter-lab-prompt-title">
      <div className="no-code-lab-section-heading"><p className="eyebrow">{copy.sectionEyebrows.prompt}</p><h2 id="coding-starter-lab-prompt-title">{copy.promptTitle}</h2><p>{copy.promptIntro}</p></div>
      <div className="no-code-lab-prompt">
        <h3>AGENT_PROMPT_PACK.md</h3>
        <p className="no-code-lab-data-notice" role="note">{copy.promptPackNotice}</p>
        <div className="no-code-lab-actions">
          <button type="button" className="button secondary" aria-label={copy.promptCopy} onClick={() => copyText('agent-prompt-pack', agentPromptPack)}>{copy.promptCopy}</button>
          <button type="button" className="button secondary" aria-label={copy.promptDownload} onClick={() => downloadText('coding-starter-lab-agent-prompt-pack.md', agentPromptPack, 'text/markdown')}>{copy.promptDownload}</button>
        </div>
        <CopyStatus copy={copy} feedback={copyFeedback} target="agent-prompt-pack" />
        <pre role="region" aria-label="AGENT_PROMPT_PACK.md" tabIndex={0}><code>{agentPromptPack}</code></pre>
      </div>
    </section>

    <section className="no-code-lab-section no-code-lab-output" aria-labelledby="coding-starter-lab-output-title">
      <p className="eyebrow">{copy.sectionEyebrows.output}</p><h2 id="coding-starter-lab-output-title">{copy.outputTitle}</h2>
      <ul>{copy.outputItems.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <aside className="no-code-lab-handoff" aria-labelledby="coding-starter-lab-handoff-title">
      <p className="eyebrow">{copy.sectionEyebrows.handoff}</p><h2 id="coding-starter-lab-handoff-title">{copy.handoffTitle}</h2><p>{copy.handoffText}</p>
      {handoffArticleHref || portfolioHref ? <div className="no-code-lab-actions">
        {handoffArticleHref ? <Link className="button secondary" href={handoffArticleHref}>{copy.handoffAction} <span aria-hidden>→</span></Link> : null}
        {portfolioHref ? <Link className="button secondary" href={portfolioHref}>{copy.portfolioAction} <span aria-hidden>→</span></Link> : null}
      </div> : null}
    </aside>
  </section>;
}
