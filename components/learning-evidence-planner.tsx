'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  EVIDENCE_GAP_IDS,
  SOURCE_DETAIL_IDS,
  SOURCE_FIELD_IDS,
  learningEvidencePlannerCopy,
  type EvidenceGapId,
  type SourceDetailId,
  type SourceFieldId
} from '@/lib/learning-evidence-planner';
import {
  LEARNING_ROUTE_IDS,
  PROBE_CHECK_IDS,
  type LearningEvidenceProbeCopy,
  type LearningRouteId,
  type ProbeCheckId,
  type ProbeCheckStatus
} from '@/lib/learning-evidence-probe';
import {
  getLearningEvidenceStartingPoints,
  learningEvidenceStartingPointCopy
} from '@/lib/learning-evidence-starting-points';
import type { Locale } from '@/lib/types';

type SourceDetails = Record<SourceDetailId, string>;
type SourceState = Record<SourceFieldId, string> & SourceDetails;
type SourceCount = 1 | 2 | 3;
type ProbeState = Record<ProbeCheckId, ProbeCheckStatus>;
type LearningSourceMode = 'rehearse-first' | 'compare-named-source';

type FurtherReading = { eyebrow: string; title: string; intro: string; links: Array<{ label: string; href: string }> };

function furtherReading(locale: Locale): FurtherReading {
  const prefix = `/${locale}/articles/`;
  if (locale === 'en') return {
    eyebrow: 'KEEP GOING',
    title: 'Use the evidence gap to choose the next guide',
    intro: 'The planner does not rank providers. Use the role-aware source map when you need a current official starting point, then use these guides to verify a course, event, or first portfolio experiment against the conditions you just compared.',
    links: [
      { label: 'Find an official starting source by role and evidence gap', href: `${prefix}choose-an-ai-learning-source-by-role-and-evidence-gap` },
      { label: 'Use source receipts for agent and evaluation learning', href: `${prefix}choose-agent-and-evaluation-learning-sources-with-receipts` },
      { label: 'Compare an AI course, hackathon, or event', href: `${prefix}evaluate-ai-course-hackathon-event` },
      { label: 'Turn a course exercise into an eight-week portfolio plan', href: `${prefix}turn-an-ai-course-into-an-eight-week-evidence-sprint` }
    ]
  };
  if (locale === 'zh-Hans') return {
    eyebrow: '下一步',
    title: '用刚才选的证据缺口，继续找下一篇指南',
    intro: '规划器不会给供应商排名。需要可核对的官方起点时，先看按角色整理的来源地图；再用以下文章核对课程、活动或第一个作品集实验。',
    links: [
      { label: '按角色和证据缺口找官方起步来源', href: `${prefix}choose-an-ai-learning-source-by-role-and-evidence-gap` },
      { label: '用来源核对记录选择 agent／evaluation 学习起点', href: `${prefix}choose-agent-and-evaluation-learning-sources-with-receipts` },
      { label: '比较 AI 课程、hackathon 或活动', href: `${prefix}evaluate-ai-course-hackathon-event` },
      { label: '把课程练习排成八周作品集计划', href: `${prefix}turn-an-ai-course-into-an-eight-week-evidence-sprint` }
    ]
  };
  return {
    eyebrow: '下一步',
    title: '用剛才選的證據缺口，繼續找下一篇指南',
    intro: '規劃器不會替供應者排名。需要可核對的官方起點時，先看按職務整理的來源地圖；再用以下文章核對課程、活動或第一個作品集實驗。',
    links: [
      { label: '按職務與證據缺口找官方起步來源', href: `${prefix}choose-an-ai-learning-source-by-role-and-evidence-gap` },
      { label: '用來源核對記錄揀 agent／evaluation 學習起點', href: `${prefix}choose-agent-and-evaluation-learning-sources-with-receipts` },
      { label: '比較 AI 課程、hackathon 或活動', href: `${prefix}evaluate-ai-course-hackathon-event` },
      { label: '把課程練習排成八週作品集計畫', href: `${prefix}turn-an-ai-course-into-an-eight-week-evidence-sprint` }
    ]
  };
}

const initialSource = (): SourceState => ({
  sourceTitle: '',
  officialUrl: '',
  checkedDate: '',
  lessonAssignment: '',
  artefact: 'unknown',
  feedback: 'unknown',
  assessment: 'unknown',
  cost: 'unknown',
  timeFit: 'unknown',
  freshness: 'unknown',
  gapFit: 'unknown',
  entryFit: 'unknown',
  stop: 'not-set'
});

const initialProbe = (): ProbeState => ({
  'local-artefact': 'not-started',
  'scope-boundary': 'not-started',
  'negative-case': 'not-started',
  'review-record': 'not-started'
});

const scoreWeights: Record<Exclude<SourceFieldId, 'stop' | 'gapFit' | 'entryFit' | 'timeFit'>, Record<string, number>> = {
  artefact: { unknown: 0, none: 0, preview: 1, keep: 4 },
  feedback: { unknown: 0, none: 0, peer: 1, structured: 2 },
  assessment: { unknown: 0, none: 0, completion: 1, observable: 2 },
  cost: { unknown: 0, high: 0, medium: 1, low: 2 },
  freshness: { unknown: 0, dated: 0, current: 1, maintained: 2 }
};

function sourceScore(source: SourceState) {
  return (Object.keys(scoreWeights) as Array<Exclude<SourceFieldId, 'stop' | 'gapFit' | 'entryFit' | 'timeFit'>>).reduce(
    (total, field) => total + (scoreWeights[field][source[field]] ?? 0),
    0
  );
}

function hasAuditableSourceDetails(source: SourceState) {
  const sourceTitle = source.sourceTitle.trim();
  const officialUrl = source.officialUrl.trim();
  const checkedDate = source.checkedDate.trim();
  const lessonAssignment = source.lessonAssignment.trim();
  if (!sourceTitle || !officialUrl || !checkedDate || !lessonAssignment) return false;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(officialUrl);
  } catch {
    return false;
  }
  if (parsedUrl.protocol !== 'https:') return false;

  const parsedDate = new Date(`${checkedDate}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === checkedDate;
}

function clearsEvidenceFloor(source: SourceState) {
  return hasAuditableSourceDetails(source)
    && source.artefact === 'keep'
    && !['unknown', 'none'].includes(source.feedback)
    && !['unknown', 'none'].includes(source.assessment)
    && !['unknown', 'dated'].includes(source.freshness)
    && source.gapFit === 'direct'
    && source.entryFit === 'ready'
    && source.timeFit === 'bounded'
    && source.stop !== 'not-set';
}

function probeOutcome(probe: ProbeState): 'ready' | 'revise' | 'stop' {
  const statuses = PROBE_CHECK_IDS.map(check => probe[check]);
  if (statuses.includes('stop')) return 'stop';
  if (statuses.every(status => status === 'observed')) return 'ready';
  return 'revise';
}

export default function LearningEvidencePlanner({
  locale,
  probeCopy
}: {
  locale: Locale;
  probeCopy: LearningEvidenceProbeCopy;
}) {
  const copy = learningEvidencePlannerCopy[locale];
  const startingPointCopy = learningEvidenceStartingPointCopy[locale];
  const [mode, setMode] = useState<LearningSourceMode>('rehearse-first');
  const [gapId, setGapId] = useState<EvidenceGapId>('delivery');
  const [sourceCount, setSourceCount] = useState<SourceCount>(1);
  const [sources, setSources] = useState<SourceState[]>([initialSource(), initialSource(), initialSource()]);
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');
  const [routeId, setRouteId] = useState<LearningRouteId>('no-code');
  const [probe, setProbe] = useState<ProbeState>(initialProbe());
  const [probeCopyState, setProbeCopyState] = useState<'idle' | 'success' | 'error'>('idle');

  const comparison = useMemo(() => {
    const activeSources = Array.from({ length: sourceCount }, (_, index) => ({
      index,
      source: sources[index] ?? initialSource(),
      score: sourceScore(sources[index] ?? initialSource()),
      clearsFloor: clearsEvidenceFloor(sources[index] ?? initialSource())
    }));
    const strongest = [...activeSources].sort((left, right) => right.score - left.score || left.index - right.index)[0];
    const chosen = activeSources
      .filter(candidate => candidate.clearsFloor)
      .sort((left, right) => right.score - left.score || left.index - right.index)[0];
    return { activeSources, strongest, chosen };
  }, [sources, sourceCount]);

  const starter = copy.gaps[gapId].starter;

  function updateSource(index: number, field: SourceFieldId, value: string) {
    setSources(current => Array.from({ length: Math.max(3, current.length, index + 1) }, (_, sourceIndex) => {
      const source = current[sourceIndex] ?? initialSource();
      return sourceIndex === index ? { ...source, [field]: value } : source;
    }));
  }

  function updateSourceDetail(index: number, detail: SourceDetailId, value: string) {
    setSources(current => Array.from({ length: Math.max(3, current.length, index + 1) }, (_, sourceIndex) => {
      const source = current[sourceIndex] ?? initialSource();
      return sourceIndex === index ? { ...source, [detail]: value } : source;
    }));
  }

  function optionLabel(field: SourceFieldId, value: string) {
    return copy.options[field].find(option => option.value === value)?.label ?? value;
  }

  function checkedConditions(source: SourceState) {
    return SOURCE_FIELD_IDS
      .filter(field => field !== 'stop' && source[field] !== 'unknown')
      .map(field => `${copy.fields[field].label}: ${optionLabel(field, source[field])}`);
  }

  function sourceDetailEntries(source?: SourceState) {
    return SOURCE_DETAIL_IDS.map(detail => ({
      detail,
      label: copy.sourceDetails[detail].label,
      value: source?.[detail].trim() || copy.notRecorded
    }));
  }

  const receiptSource = comparison.chosen ?? comparison.strongest;
  const receiptConditions = receiptSource ? checkedConditions(receiptSource.source) : [];
  const selectedStop = comparison.chosen ? optionLabel('stop', comparison.chosen.source.stop) : optionLabel('stop', 'not-set');
  const further = furtherReading(locale);
  const selectedSource = mode === 'compare-named-source' && comparison.chosen ? copy.sourceLabel(comparison.chosen.index) : copy.noSource;
  const localRecordSource = mode === 'compare-named-source' ? selectedSource : copy.sourceNotSelected;
  const selectedRoute = probeCopy.routes[routeId];
  const startingPoints = useMemo(() => getLearningEvidenceStartingPoints(gapId, routeId), [gapId, routeId]);
  const currentProbeOutcome = probeOutcome(probe);
  const currentProbeOutcomeCopy = probeCopy.outcomes[currentProbeOutcome];
  const portfolioHandoff = probeCopy.portfolioHandoff;
  const portfolioHandoffOutcome = portfolioHandoff.outcome[currentProbeOutcome];
  const portfolioHandoffHref = currentProbeOutcome === 'ready'
    ? `/${locale}/portfolio-evidence-planner#portfolio-projects`
    : selectedRoute.starterLab.href;

  function weekOneBrief() {
    const conditions = receiptConditions.length ? receiptConditions : [optionLabel('artefact', 'unknown')];
    const sourceDetails = sourceDetailEntries(receiptSource?.source);
    return [
      `# ${copy.weekHeading}`,
      '',
      `## ${copy.sourceReceipt}`,
      `- ${copy.receiptGap}: ${copy.gaps[gapId].label}`,
      `- ${copy.receiptSource}: ${selectedSource}`,
      `- ${copy.receiptSignal}: ${receiptSource ? `${receiptSource.score} / 12` : '0 / 12'}`,
      `- ${copy.receiptInputs}:`,
      ...conditions.map(condition => `  - ${condition}`),
      '',
      `## ${copy.receiptSourceDetails}`,
      ...sourceDetails.map(detail => `- ${detail.label}: ${detail.value}`),
      '',
      `## ${copy.artefact}`,
      starter.artefact,
      '',
      `## ${copy.nonGoal}`,
      starter.nonGoal,
      '',
      `## ${copy.dataBoundary}`,
      starter.dataBoundary,
      '',
      `## ${copy.firstEvaluation}`,
      starter.firstEvaluation,
      '',
      `## ${copy.suggestedDecision}`,
      comparison.chosen ? copy.readyDecision : copy.pauseDecision,
      '',
      `## ${copy.suggestedStop}`,
      selectedStop
    ].join('\n');
  }

  async function copyWeekOneBrief() {
    try {
      await navigator.clipboard.writeText(weekOneBrief());
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
  }

  function updateProbe(check: ProbeCheckId, value: ProbeCheckStatus) {
    setProbe(current => ({ ...current, [check]: value }));
  }

  function probeStatusLabel(value: ProbeCheckStatus) {
    return probeCopy.options.find(option => option.value === value)?.label ?? value;
  }

  function localRouteRecord() {
    return [
      `# ${probeCopy.title}`,
      '',
      `- ${probeCopy.recordRoute}: ${selectedRoute.label}`,
      `- ${probeCopy.recordGap}: ${copy.gaps[gapId].label}`,
      `- ${probeCopy.recordSource}: ${localRecordSource}`,
      `- ${probeCopy.recordOutcome}: ${currentProbeOutcomeCopy.label}`,
      '',
      `## ${probeCopy.recordChecks}`,
      ...PROBE_CHECK_IDS.map(check => `- ${probeCopy.checks[check].label}: ${probeStatusLabel(probe[check])}`),
      '',
      `## ${probeCopy.inspectableHeading}`,
      selectedRoute.inspectable,
      '',
      `## ${probeCopy.handoffHeading}`,
      selectedRoute.handoff,
      '',
      `## ${probeCopy.recordOutcome}`,
      currentProbeOutcomeCopy.text,
      '',
      probeCopy.evidenceBoundary
    ].join('\n');
  }

  async function copyLocalRouteRecord() {
    try {
      await navigator.clipboard.writeText(localRouteRecord());
      setProbeCopyState('success');
    } catch {
      setProbeCopyState('error');
    }
  }

  return <section className="learning-planner" aria-labelledby="planner-title">
    <header className="planner-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="planner-title">{copy.title}</h1>
      <p>{copy.intro}</p>
      <p className="planner-privacy" role="note">{copy.privacy}</p>
    </header>

    <section className="planner-step planner-mode" aria-labelledby="planner-mode-heading">
      <div className="planner-step-heading"><h2 className="planner-section-title" id="planner-mode-heading">{copy.modeHeading}</h2><p id="planner-mode-help">{copy.modeHelp}</p></div>
      <fieldset className="planner-mode-options" aria-describedby="planner-mode-help">
        <legend className="sr-only">{copy.modeHeading}</legend>
        <label className={`planner-mode-option${mode === 'rehearse-first' ? ' planner-mode-option--selected' : ''}`}>
          <input type="radio" name="learning-source-mode" value="rehearse-first" checked={mode === 'rehearse-first'} onChange={() => setMode('rehearse-first')} />
          <span><strong>{copy.rehearseFirstLabel}</strong><small>{copy.rehearseFirstText}</small></span>
        </label>
        <label className={`planner-mode-option${mode === 'compare-named-source' ? ' planner-mode-option--selected' : ''}`}>
          <input type="radio" name="learning-source-mode" value="compare-named-source" checked={mode === 'compare-named-source'} onChange={() => setMode('compare-named-source')} />
          <span><strong>{copy.compareNamedSourceLabel}</strong><small>{copy.compareNamedSourceText}</small></span>
        </label>
      </fieldset>
    </section>

    <section className="planner-step planner-gap" aria-labelledby="planner-gap-heading">
      <div className="planner-step-heading"><h2 className="planner-section-title" id="planner-gap-heading">{copy.gapHeading}</h2><p>{copy.gapHelp}</p></div>
      <label className="planner-control" htmlFor="evidence-gap">
        <span>{copy.gapLabel}</span>
        <select id="evidence-gap" value={gapId} onChange={event => setGapId(event.target.value as EvidenceGapId)}>
          {EVIDENCE_GAP_IDS.map(id => <option key={id} value={id}>{copy.gaps[id].label}</option>)}
        </select>
        <small>{copy.gaps[gapId].description}</small>
      </label>
    </section>

    {mode === 'compare-named-source' ? <section className="planner-step" aria-labelledby="planner-source-heading">
      <div className="planner-step-heading"><h2 className="planner-section-title" id="planner-source-heading">{copy.sourceHeading}</h2><p>{copy.sourceCountHelp}</p></div>
      <label className="planner-control planner-count" htmlFor="source-count">
        <span>{copy.sourceCountLabel}</span>
        <select id="source-count" value={sourceCount} onChange={event => setSourceCount(Number(event.target.value) as SourceCount)}>
          {([1, 2, 3] as SourceCount[]).map(count => <option key={count} value={count}>{copy.sourceCountOptions[count]}</option>)}
        </select>
      </label>

      <div className="planner-source-grid">
        {comparison.activeSources.map(({ index, source, score }) => <fieldset className="planner-source" key={index}>
          <legend><span>{copy.sourceSlot}</span><strong>{copy.sourceLabel(index)}</strong></legend>
          <p className="planner-unnamed-help">{copy.unnamedHelp}</p>
          <div className="planner-score" aria-label={`${copy.scoreLabel}: ${score} / 12`}><span>{copy.scoreLabel}</span><strong>{score}<small>/12</small></strong></div>
          <section className="planner-source-details" aria-labelledby={`planner-${index}-source-details-heading`}>
            <h3 className="planner-source-details-heading" id={`planner-${index}-source-details-heading`}>{copy.sourceDetailsHeading}</h3>
            <p className="planner-source-details-help" id={`planner-${index}-source-details-help`}>{copy.sourceDetailsHelp}</p>
            <div className="planner-source-detail-fields">
              {SOURCE_DETAIL_IDS.map(detail => {
                const inputId = `planner-${index}-${detail}`;
                const detailCopy = copy.sourceDetails[detail];
                return <label className="planner-control" htmlFor={inputId} key={detail}>
                  <span>{detailCopy.label}</span>
                  <small>{detailCopy.help}</small>
                  <input
                    id={inputId}
                    type={detail === 'checkedDate' ? 'date' : detail === 'officialUrl' ? 'url' : 'text'}
                    value={source[detail]}
                    onChange={event => updateSourceDetail(index, detail, event.target.value)}
                    placeholder={detailCopy.placeholder}
                    autoComplete="off"
                    aria-describedby={`planner-${index}-source-details-help`}
                  />
                </label>;
              })}
            </div>
          </section>
          <div className="planner-fields">
            {SOURCE_FIELD_IDS.map(field => {
              const inputId = `planner-${index}-${field}`;
              return <label className="planner-control" htmlFor={inputId} key={field}>
                <span>{copy.fields[field].label}</span>
                <small>{copy.fields[field].help}</small>
                <select id={inputId} value={source[field]} onChange={event => updateSource(index, field, event.target.value)}>
                  {copy.options[field].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>;
            })}
          </div>
        </fieldset>)}
      </div>
      <p className="planner-score-help">{copy.scoreHelp}</p>
    </section> : null}

    {mode === 'compare-named-source' ? <section className="planner-result" aria-labelledby="planner-decision-heading">
      <div className="planner-result-header"><h2 className="planner-section-title" id="planner-decision-heading">{copy.decisionHeading}</h2><p>{copy.floorText}</p></div>
      <div className="planner-decision-grid">
        <section className="planner-decision-card">
          <h2>{copy.suggestedSource}</h2>
          <p className="planner-decision-value">{comparison.chosen ? copy.sourceLabel(comparison.chosen.index) : copy.noSource}</p>
        </section>
        <section className="planner-decision-card">
          <h2>{copy.suggestedDecision}</h2>
          <p>{comparison.chosen ? copy.readyDecision : copy.pauseDecision}</p>
        </section>
        <section className="planner-decision-card">
          <h2>{copy.suggestedStop}</h2>
          <p>{selectedStop}</p>
        </section>
      </div>

      <div className="planner-pack">
        <header className="planner-pack-header"><div><p className="eyebrow">WEEK 01</p><h2>{copy.weekHeading}</h2></div><div className="planner-pack-actions"><button type="button" className="button secondary" onClick={copyWeekOneBrief}>{copy.copyBrief}</button><p className="planner-copy-note">{copy.copyNote}</p></div></header>
        {copyState !== 'idle' ? <p className={`planner-copy-status planner-copy-status--${copyState}`} role="status">{copyState === 'success' ? copy.copySuccess : copy.copyError}</p> : null}
        <div className="planner-pack-grid">
          <section className="planner-receipt">
            <h3>{copy.sourceReceipt}</h3>
            <dl>
              <div><dt>{copy.receiptGap}</dt><dd>{copy.gaps[gapId].label}</dd></div>
              <div><dt>{copy.receiptSource}</dt><dd>{comparison.chosen ? copy.sourceLabel(comparison.chosen.index) : copy.noSource}</dd></div>
              <div><dt>{copy.receiptSignal}</dt><dd>{receiptSource ? `${receiptSource.score} / 12` : '0 / 12'}</dd></div>
              <div><dt>{copy.receiptInputs}</dt><dd>{receiptConditions.length ? <ul>{receiptConditions.map(condition => <li key={condition}>{condition}</li>)}</ul> : optionLabel('artefact', 'unknown')}</dd></div>
              <div><dt>{copy.receiptSourceDetails}</dt><dd><ul>{sourceDetailEntries(receiptSource?.source).map(detail => <li key={detail.detail}><strong>{detail.label}:</strong> {detail.value}</li>)}</ul></dd></div>
            </dl>
          </section>
          <section className="planner-starter-card"><h3>{copy.artefact}</h3><p>{starter.artefact}</p></section>
          <section className="planner-starter-card"><h3>{copy.nonGoal}</h3><p>{starter.nonGoal}</p></section>
          <section className="planner-starter-card"><h3>{copy.dataBoundary}</h3><p>{starter.dataBoundary}</p></section>
          <section className="planner-starter-card"><h3>{copy.firstEvaluation}</h3><p>{starter.firstEvaluation}</p></section>
        </div>
      </div>

      <aside className="planner-rule"><h2>{copy.floorHeading}</h2><p>{copy.floorText}</p></aside>
    </section> : <aside className="planner-source-free-status" aria-labelledby="planner-source-status-heading" role="note">
      <h2 className="eyebrow" id="planner-source-status-heading">{copy.sourceStatusHeading}</h2>
      <p className="planner-source-status-token">{copy.sourceNotSelected}</p>
      <p>{copy.sourceNotSelectedText}</p>
    </aside>}

    <section className="planner-probe" aria-labelledby="planner-probe-heading">
        <header className="planner-probe-header">
          <p className="eyebrow">{probeCopy.eyebrow}</p>
          <h2 id="planner-probe-heading">{probeCopy.title}</h2>
          <p>{probeCopy.intro}</p>
        </header>

        <label className="planner-control planner-probe-route-control" htmlFor="learning-route">
          <span>{probeCopy.routeLabel}</span>
          <small>{probeCopy.routeHelp}</small>
          <select id="learning-route" value={routeId} onChange={event => setRouteId(event.target.value as LearningRouteId)}>
            {LEARNING_ROUTE_IDS.map(id => <option key={id} value={id}>{probeCopy.routes[id].label}</option>)}
          </select>
        </label>

        <section className="planner-route-recommendation" aria-labelledby="planner-starting-points-heading">
          <header>
            <p className="eyebrow">{startingPointCopy.eyebrow}</p>
            <h3 id="planner-starting-points-heading">{startingPointCopy.title}</h3>
            <p>{startingPointCopy.intro}</p>
          </header>
          {startingPoints.length ? <div className="planner-route-recommendation-grid">
            {startingPoints.map(source => {
              const sourceCopy = source.copy[locale];
              return <section key={source.id} data-fit-gap-ids={source.fit.gapIds.join(' ')} data-fit-route-ids={source.fit.routeIds.join(' ')}>
                <h4><a className="text-link" href={source.officialUrl} target="_blank" rel="noreferrer" aria-label={`${startingPointCopy.openOfficialSource}: ${sourceCopy.title}`}>{sourceCopy.title} <span aria-hidden>↗</span></a></h4>
                <p><strong>{startingPointCopy.officialUrl}</strong><br /><span className="planner-official-url" dir="ltr">{source.officialUrl}</span></p>
                <p><strong>{startingPointCopy.lastChecked}</strong><br /><time dateTime={source.lastChecked}>{source.lastChecked}</time></p>
                <p><strong>{startingPointCopy.whatToInspect}</strong><br />{sourceCopy.whatToInspect}</p>
                <p><strong>{startingPointCopy.firstWeekArtefact}</strong><br />{sourceCopy.firstWeekArtefact}</p>
                <p><strong>{startingPointCopy.nonClaim}</strong><br />{sourceCopy.nonClaim}</p>
                <p className="planner-route-source-status"><strong>{startingPointCopy.caveat}</strong><br />{sourceCopy.caveat}</p>
              </section>;
            })}
          </div> : <p className="planner-route-source-status" role="note">{startingPointCopy.empty}</p>}
        </section>

        <div className="planner-probe-route">
          <section>
            <p className="eyebrow">{probeCopy.routeHeading}</p>
            <h3>{selectedRoute.label}</h3>
            <p>{selectedRoute.intro}</p>
          </section>
          <section className="planner-probe-steps">
            <h3>{probeCopy.stepsHeading}</h3>
            <ol>{selectedRoute.steps.map(step => <li key={step}>{step}</li>)}</ol>
          </section>
          <section className="planner-probe-evidence">
            <h3>{probeCopy.inspectableHeading}</h3>
            <p>{selectedRoute.inspectable}</p>
          </section>
          <section className="planner-probe-evidence">
            <h3>{probeCopy.handoffHeading}</h3>
            <p>{selectedRoute.handoff}</p>
          </section>
        </div>

        <section className="planner-probe-lab" aria-labelledby="planner-probe-lab-title">
          <div>
            <h3 id="planner-probe-lab-title">{selectedRoute.starterLab.title}</h3>
            <p>{selectedRoute.starterLab.text}</p>
            <p id="planner-probe-lab-boundary" className="planner-probe-lab-boundary" role="note">{selectedRoute.starterLab.boundary}</p>
          </div>
          <Link className="button" href={selectedRoute.starterLab.href} aria-describedby="planner-probe-lab-boundary">{selectedRoute.starterLab.action} <span aria-hidden>→</span></Link>
        </section>

        <fieldset className="planner-probe-checks">
          <legend>{probeCopy.recordHeading}</legend>
          <p>{probeCopy.recordHelp}</p>
          <div>
            {PROBE_CHECK_IDS.map(check => {
              const inputId = `planner-probe-${check}`;
              return <label className="planner-control" htmlFor={inputId} key={check}>
                <span>{probeCopy.checks[check].label}</span>
                <small>{probeCopy.checks[check].help}</small>
                <select id={inputId} value={probe[check]} onChange={event => updateProbe(check, event.target.value as ProbeCheckStatus)}>
                  {probeCopy.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>;
            })}
          </div>
        </fieldset>

        <aside className={`planner-probe-outcome planner-probe-outcome--${currentProbeOutcome}`} aria-live="polite">
          <p className="eyebrow">{probeCopy.outcomeHeading}</p>
          <h3>{probeCopy.outcomeLabel}: {currentProbeOutcomeCopy.label}</h3>
          <p>{currentProbeOutcomeCopy.text}</p>
        </aside>

        <div className="planner-probe-actions">
          <button type="button" className="button secondary" onClick={copyLocalRouteRecord}>{probeCopy.copyRecord}</button>
          <p>{probeCopy.copyNote}</p>
        </div>
        {probeCopyState !== 'idle' ? <p className={`planner-copy-status planner-copy-status--${probeCopyState}`} role="status">{probeCopyState === 'success' ? probeCopy.copySuccess : probeCopy.copyError}</p> : null}
        <section className={`planner-probe-portfolio-handoff planner-probe-portfolio-handoff--${currentProbeOutcome}`} aria-labelledby="planner-probe-portfolio-handoff-title">
          <header>
            <p className="eyebrow">{portfolioHandoff.eyebrow}</p>
            <h3 id="planner-probe-portfolio-handoff-title">{portfolioHandoff.title}</h3>
            <p>{portfolioHandoff.intro}</p>
          </header>
          <div className="planner-probe-portfolio-handoff-grid">
            <section>
              <h4>{portfolioHandoff.carryHeading}</h4>
              <ul>{portfolioHandoff.carryItems[routeId].map(item => <li key={item}>{item}</li>)}</ul>
            </section>
            <aside>
              <h4>{portfolioHandoffOutcome.title}</h4>
              <p>{portfolioHandoffOutcome.text}</p>
            </aside>
          </div>
          <div className="planner-probe-portfolio-handoff-action">
            <Link className="button secondary" href={portfolioHandoffHref}>{portfolioHandoffOutcome.action} <span aria-hidden>→</span></Link>
            <p role="note">{portfolioHandoff.boundary}</p>
          </div>
        </section>
        <p className="planner-probe-boundary" role="note">{probeCopy.evidenceBoundary}</p>
    </section>

    <nav className="planner-further-reading" aria-labelledby="planner-further-reading-title">
      <p className="eyebrow">{further.eyebrow}</p>
      <h2 id="planner-further-reading-title">{further.title}</h2>
      <p>{further.intro}</p>
      <ul>{further.links.map(link => <li key={link.href}><Link href={link.href}>{link.label} <span aria-hidden>→</span></Link></li>)}</ul>
    </nav>
  </section>;
}
