'use client';

import { useEffect, useRef, useState } from 'react';
import {
  buildNoCodePersonalCaseEvidencePack,
  buildNoCodePersonalCasePlanFirstPrompt,
  createNoCodePersonalCaseInput,
  getNoCodePersonalCaseMissingFieldLabels,
  getNoCodePersonalCaseCopy,
  isNoCodePersonalCaseRoute,
  NO_CODE_PERSONAL_CASE_ROUTES,
  validateNoCodePersonalCaseInput,
  type NoCodePersonalCaseCaseEvaluation,
  type NoCodePersonalCaseCaseRecord,
  type NoCodePersonalCaseInput,
  type NoCodePersonalCaseTextField
} from '@/lib/no-code-personal-case-builder';
import {
  buildNoCodePersonalCasePrototypeHandoffPrompt,
  getNoCodePersonalCasePrototypeHandoffCopy,
  NO_CODE_PERSONAL_CASE_PROTOTYPE_PATHS,
  NO_CODE_PERSONAL_CASE_PROTOTYPE_PRACTICE_FOLDER
} from '@/lib/no-code-personal-case-prototype-handoff';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

type CopyState = 'success' | 'error';
type CopyFeedback = { target: string; state: CopyState } | null;

type BuilderUi = {
  worksheetLabel: string;
  fileActions: { copy: string; download: string };
  promptBlocked: string;
  promptNeedsRecord: string;
  promptReady: string;
  reviewerCheck: string;
  copySuccess: string;
  copyError: string;
};

const builderUi: Record<Locale, BuilderUi> = canonicalLocaleRecord({
  'zh-HK': {
    worksheetLabel: '填寫工作紙',
    fileActions: { copy: '複製內容', download: '下載檔案' },
    promptBlocked: '先填齊工作紙，先可以產生提示詞。',
    promptNeedsRecord: '睇清楚 reviewer record 預覽後，再確認只准睇計劃。',
    promptReady: '呢段提示詞只會請 AI 先列計劃。貼去其他服務前，請再確認只包含虛構或准許公開文字。',
    reviewerCheck: '我已填好覆核日期、負責角色同未解決問題；而家只准睇計劃，唔准執行。',
    copySuccess: '已複製到剪貼簿。',
    copyError: '未能複製；你可以直接選取內容。'
  },
  'zh-TW': {
    worksheetLabel: '填寫工作紙',
    fileActions: { copy: '複製內容', download: '下載檔案' },
    promptBlocked: '先填完整份工作紙，才可以產生提示詞。',
    promptNeedsRecord: '看清 reviewer record 預覽後，再確認只能看計畫。',
    promptReady: '這段提示詞只會請 AI 先列計畫。貼到其他服務前，請再確認只包含虛構或准許公開文字。',
    reviewerCheck: '我已填好覆核日期、負責角色與未解決問題；現在只能看計畫，不得執行。',
    copySuccess: '已複製到剪貼簿。',
    copyError: '無法複製；你可以直接選取內容。'
  },
  'zh-Hans': {
    worksheetLabel: '填写工作纸',
    fileActions: { copy: '复制内容', download: '下载文件' },
    promptBlocked: '先填完整份工作纸，才可以生成提示词。',
    promptNeedsRecord: '看清 reviewer record 预览后，再确认只能看计划。',
    promptReady: '这段提示词只会请 AI 先列计划。贴到其他服务前，请再次确认只包含虚构或允许公开的文字。',
    reviewerCheck: '我已填好复核日期、负责角色与未解决问题；现在只能看计划，不得执行。',
    copySuccess: '已复制到剪贴板。',
    copyError: '无法复制；你可以直接选取内容。'
  },
  en: {
    worksheetLabel: 'Fill in the worksheet',
    fileActions: { copy: 'Copy contents', download: 'Download file' },
    promptBlocked: 'Complete the worksheet before generating a prompt.',
    promptNeedsRecord: 'Read the reviewer-record preview, then confirm that this is plan review only.',
    promptReady: 'This prompt asks an AI to list a plan only. Before pasting it into another service, check that it contains invented or permitted public text only.',
    reviewerCheck: 'I entered the review date, accountable role, and unresolved question. This is plan review only; do not execute work.',
    copySuccess: 'Copied to the clipboard.',
    copyError: 'Could not copy it. You can select the text directly.'
  }
});

function CopyStatus({ feedback, target, ui }: { feedback: CopyFeedback; target: string; ui: BuilderUi }) {
  if (feedback?.target !== target) return null;
  return <p className={`no-code-personal-case-copy-status no-code-personal-case-copy-status--${feedback.state}`} role="status" aria-live="polite" aria-atomic="true">{feedback.state === 'success' ? ui.copySuccess : ui.copyError}</p>;
}

function downloadText(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 0);
}

function Field({
  field,
  value,
  onChange
}: {
  field: { key: NoCodePersonalCaseTextField; label: string; instruction: string; placeholder: string };
  value: string;
  onChange: (key: NoCodePersonalCaseTextField, nextValue: string) => void;
}) {
  const id = `no-code-personal-case-${field.key}`;
  return <label className="no-code-personal-case-field" htmlFor={id}>
    <span>{field.label}</span>
    <small>{field.instruction}</small>
    <textarea id={id} value={value} placeholder={field.placeholder} rows={4} onChange={event => onChange(field.key, event.target.value)} />
  </label>;
}

function CaseRecord({
  caseCopy,
  copy,
  index,
  record,
  evaluation,
  onChange
}: {
  caseCopy: ReturnType<typeof getNoCodePersonalCaseCopy>['fixedCases'][number];
  copy: ReturnType<typeof getNoCodePersonalCaseCopy>;
  index: number;
  record: NoCodePersonalCaseCaseRecord;
  evaluation: NoCodePersonalCaseCaseEvaluation;
  onChange: (index: number, key: keyof NoCodePersonalCaseCaseRecord, nextValue: string) => void;
}) {
  const baseId = `no-code-personal-case-${caseCopy.id}`;
  const statusMessage = evaluation.status === 'match'
    ? copy.caseRecord.matchResult
    : evaluation.status === 'mismatch'
      ? copy.caseRecord.mismatchResult
      : copy.caseRecord.incompleteResult;

  return <article className="no-code-personal-case-case-record">
    <header><h4>{caseCopy.label}</h4><p>{caseCopy.description}</p></header>
    <div className="no-code-personal-case-case-fields">
      <label className="no-code-personal-case-field no-code-personal-case-field--scenario" htmlFor={`${baseId}-scenario`}>
        <span>{copy.caseRecord.scenarioLabel}</span>
        <small>{copy.caseRecord.scenarioInstruction}</small>
        <textarea id={`${baseId}-scenario`} value={record.scenario} rows={3} onChange={event => onChange(index, 'scenario', event.target.value)} />
      </label>
      <div className="no-code-personal-case-fixed-route" aria-label={copy.caseRecord.expectedRouteLabel}>
        <span>{copy.caseRecord.expectedRouteLabel}</span>
        <strong>{caseCopy.expectedRoute} — {copy.caseRecord.routes[caseCopy.expectedRoute]}</strong>
        <small>{copy.caseRecord.expectedRouteInstruction}</small>
      </div>
      <label className="no-code-personal-case-field" htmlFor={`${baseId}-observedRoute`}>
        <span>{copy.caseRecord.observedRouteLabel}</span>
        <small>{copy.caseRecord.observedRouteInstruction}</small>
        <select id={`${baseId}-observedRoute`} value={record.observedRoute} onChange={event => onChange(index, 'observedRoute', event.target.value)}>
          <option value="">{copy.caseRecord.chooseRoute}</option>
          {NO_CODE_PERSONAL_CASE_ROUTES.map(route => <option key={route} value={route}>{route} — {copy.caseRecord.routes[route]}</option>)}
        </select>
      </label>
      <output className={`no-code-personal-case-result no-code-personal-case-result--${evaluation.status}`} aria-live="polite">
        <strong>{copy.caseRecord.resultLabel}</strong>
        <span>{statusMessage}</span>
        {!evaluation.reasonProvided ? <small>{copy.caseRecord.reasonOrFailureInstruction}</small> : null}
        {evaluation.fixedExpectedRouteOverride ? <small>{copy.caseRecord.fixedRouteOverride}</small> : null}
      </output>
      <label className="no-code-personal-case-field no-code-personal-case-field--reason" htmlFor={`${baseId}-reason`}>
        <span>{copy.caseRecord.reasonRequiredLabel}</span>
        <small>{copy.caseRecord.reasonOrFailureInstruction}</small>
        <textarea id={`${baseId}-reason`} value={record.reasonOrFailureNote} rows={3} onChange={event => onChange(index, 'reasonOrFailureNote', event.target.value)} />
      </label>
    </div>
  </article>;
}

export function NoCodePersonalCaseBuilder({
  locale,
  headingId = 'no-code-personal-case-builder-title',
  showHeader = true,
  onReady
}: {
  locale: Locale;
  headingId?: string;
  showHeader?: boolean;
  onReady?: () => void;
}) {
  const copy = getNoCodePersonalCaseCopy(locale);
  const ui = builderUi[locale];
  const [input, setInput] = useState<NoCodePersonalCaseInput>(() => createNoCodePersonalCaseInput(locale));
  const [reviewerRecordReady, setReviewerRecordReady] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const copyClearTimeout = useRef<number | null>(null);
  const validation = validateNoCodePersonalCaseInput(input, locale);
  const missingFieldLabels = getNoCodePersonalCaseMissingFieldLabels(validation, locale);
  const evidencePack = buildNoCodePersonalCaseEvidencePack(input, locale);
  const planPrompt = buildNoCodePersonalCasePlanFirstPrompt(input, locale);
  const prototypeCopy = getNoCodePersonalCasePrototypeHandoffCopy(locale);
  const prototypeHandoffPrompt = buildNoCodePersonalCasePrototypeHandoffPrompt(input, locale, reviewerRecordReady);

  useEffect(() => () => {
    if (copyClearTimeout.current !== null) window.clearTimeout(copyClearTimeout.current);
  }, []);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

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

  function changeField(key: NoCodePersonalCaseTextField, nextValue: string) {
    setInput(current => ({ ...current, [key]: nextValue }));
  }

  function changeCase(index: number, key: keyof NoCodePersonalCaseCaseRecord, nextValue: string) {
    setInput(current => ({
      ...current,
      fixedCases: current.fixedCases.map((record, itemIndex) => {
        if (itemIndex !== index) return record;
        if (key === 'observedRoute') return { ...record, observedRoute: isNoCodePersonalCaseRoute(nextValue) ? nextValue : '' };
        return { ...record, [key]: nextValue };
      })
    }));
  }

  return <section className={`no-code-personal-case-builder${showHeader ? '' : ' no-code-personal-case-builder--embedded'}`} aria-labelledby={headingId}>
    {showHeader ? <header className="no-code-personal-case-builder-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id={headingId}>{copy.title}</h2>
      <p>{copy.intro}</p>
      <aside role="note">{copy.localOnlyBoundary}</aside>
    </header> : null}

    <div className="no-code-personal-case-builder-form" aria-label={ui.worksheetLabel}>
      {copy.sections.map(section => section.id === 'fixed-cases' ? <section className="no-code-personal-case-fixed-cases" aria-labelledby="no-code-personal-case-fixed-cases-title" key={section.id}>
        <div><h3 id="no-code-personal-case-fixed-cases-title">{section.label}</h3><p>{section.instruction}</p></div>
        <div className="no-code-personal-case-fixed-cases-grid">
          {copy.fixedCases.map((testCase, index) => <CaseRecord caseCopy={testCase} copy={copy} index={index} key={testCase.id} record={input.fixedCases[index] ?? { scenario: '', observedRoute: '', reasonOrFailureNote: '' }} evaluation={validation.caseEvaluations[index] ?? { expectedRoute: testCase.expectedRoute, observedRoute: '', rawObservedRoute: '', observedRouteValid: false, reasonProvided: false, status: 'incomplete', fixedExpectedRouteOverride: null }} onChange={changeCase} />)}
        </div>
      </section> : <section className="no-code-personal-case-section" aria-labelledby={`no-code-personal-case-${section.id}-title`} key={section.id}>
        <div><h3 id={`no-code-personal-case-${section.id}-title`}>{section.label}</h3><p>{section.instruction}</p></div>
        <div className="no-code-personal-case-fields">{section.fields.map(field => <Field field={field} key={field.key} value={input[field.key]} onChange={changeField} />)}</div>
      </section>)}
    </div>

    <section className="no-code-personal-case-preview" aria-labelledby="no-code-personal-case-preview-title">
      <header><p className="eyebrow">{copy.preview.eyebrow}</p><h3 id="no-code-personal-case-preview-title">{evidencePack.title}</h3><p>{copy.preview.intro}</p></header>
      <p className="no-code-personal-case-local-note" role="note">{evidencePack.localOnlyNotice}</p>
      <p className="sr-only" role="status" aria-live="polite">{validation.complete ? '' : `${copy.validation.missing} ${missingFieldLabels.length}`}</p>
      {!validation.complete ? <section className="no-code-personal-case-incomplete">
        <p>{copy.preview.incomplete}</p>
        <p>{copy.validation.missingIntro}</p>
        <ul>{missingFieldLabels.map(item => <li key={item}>{item}</li>)}</ul>
      </section> : null}
      <div className="no-code-personal-case-files">
        {evidencePack.files.map(file => {
          const copyTarget = `file:${file.path}`;
          return <article className="no-code-personal-case-file" key={file.path}>
            <h4>{file.path}</h4>
            <div className="no-code-personal-case-actions">
              <button type="button" className="button secondary" onClick={() => copyText(copyTarget, file.content)}>{ui.fileActions.copy}</button>
              <button type="button" className="button secondary" onClick={() => downloadText(file.path, file.content)}>{ui.fileActions.download}</button>
            </div>
            <CopyStatus feedback={copyFeedback} target={copyTarget} ui={ui} />
            <details><summary>{file.path}</summary><pre role="region" aria-label={file.path} tabIndex={0}><code>{file.content}</code></pre></details>
          </article>;
        })}
      </div>
    </section>

    <section className="no-code-personal-case-prompt" aria-labelledby="no-code-personal-case-prompt-title">
      <header><p className="eyebrow">{copy.prompt.eyebrow}</p><h3 id="no-code-personal-case-prompt-title">{copy.prompt.title}</h3><p>{copy.prompt.intro}</p></header>
      <aside className="no-code-personal-case-gate" role="note"><h4>{copy.prompt.reviewerRecordGateTitle}</h4><p>{copy.prompt.reviewerRecordGate}</p></aside>
      <label className="no-code-personal-case-confirmation" htmlFor="no-code-personal-case-reviewer-record">
        <input id="no-code-personal-case-reviewer-record" type="checkbox" checked={reviewerRecordReady} onChange={event => setReviewerRecordReady(event.target.checked)} />
        <span>{ui.reviewerCheck}</span>
      </label>
      {!validation.complete ? <p className="no-code-personal-case-prompt-status" role="status">{ui.promptBlocked}</p> : !reviewerRecordReady ? <p className="no-code-personal-case-prompt-status" role="status">{ui.promptNeedsRecord}</p> : <><p className="no-code-personal-case-prompt-status">{ui.promptReady}</p><div className="no-code-personal-case-actions"><button type="button" className="button secondary" onClick={() => copyText('plan-prompt', planPrompt)}>{copy.prompt.copyAction}</button></div><CopyStatus feedback={copyFeedback} target="plan-prompt" ui={ui} /><pre role="region" aria-label={copy.prompt.title} tabIndex={0}><code>{planPrompt}</code></pre></>}
      <p className="no-code-personal-case-account-boundary">{copy.prompt.accountBoundary}</p>
    </section>

    {prototypeHandoffPrompt ? <section className="no-code-personal-case-prototype" aria-labelledby="no-code-personal-case-prototype-title">
      <header><p className="eyebrow">{prototypeCopy.eyebrow}</p><h3 id="no-code-personal-case-prototype-title">{prototypeCopy.title}</h3><p>{prototypeCopy.intro}</p></header>
      <aside className="no-code-personal-case-prototype-boundary" role="note">{prototypeCopy.boundary}</aside>
      <div className="no-code-personal-case-prototype-scope">
        <div><strong>{prototypeCopy.scopeLabel}</strong><code>{NO_CODE_PERSONAL_CASE_PROTOTYPE_PRACTICE_FOLDER}/</code></div>
        <div><strong>{prototypeCopy.filesLabel}</strong><ul>{NO_CODE_PERSONAL_CASE_PROTOTYPE_PATHS.map(path => <li key={path}><code>{path}</code></li>)}</ul></div>
      </div>
      <div className="no-code-personal-case-actions"><button type="button" className="button secondary" onClick={() => copyText('prototype-handoff', prototypeHandoffPrompt)}>{prototypeCopy.copyAction}</button></div>
      <CopyStatus feedback={copyFeedback} target="prototype-handoff" ui={ui} />
      <details className="no-code-personal-case-prototype-prompt"><summary>{prototypeCopy.previewAction}</summary><pre role="region" aria-label={prototypeCopy.title} tabIndex={0}><code>{prototypeHandoffPrompt}</code></pre></details>
    </section> : null}
  </section>;
}
