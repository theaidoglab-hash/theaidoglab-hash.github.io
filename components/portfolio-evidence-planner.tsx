'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FragmentAnchorLink, FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { BUILD_LAB_CASE_IDS, buildLabCaseSelectorCopy, type BuildLabCaseId } from '@/lib/build-lab-case-selector';
import {
  PORTFOLIO_DIMENSION_IDS,
  PORTFOLIO_FIRST_RUN_DETAIL_IDS,
  PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS,
  PORTFOLIO_SHAPE_IDS,
  portfolioEvidencePlannerCopy,
  type PortfolioDimensionId,
  type PortfolioFirstRunDecision,
  type PortfolioFirstRunDetailId,
  type PortfolioMetricContractDetailId,
  type PortfolioShapeId
} from '@/lib/portfolio-evidence-planner';
import {
  PORTFOLIO_PROOF_PACK_DOWNLOAD_HREF,
  portfolioProofPackCopy,
  portfolioProofPackMarkdown,
  portfolioRouteRecommendationCopy
} from '@/lib/portfolio-proof-pack';
import type { Locale } from '@/lib/types';

type ProjectState = {
  shape: PortfolioShapeId;
} & Record<PortfolioDimensionId | PortfolioMetricContractDetailId, string>;

type FirstRunReceiptState = {
  reviewerDecision: PortfolioFirstRunDecision;
  failureNote: string;
} & Record<PortfolioFirstRunDetailId, string>;

type ProjectCount = 1 | 2 | 3;
type BriefCopyState = 'idle' | 'success' | 'error';
type ProofPackCopyState = 'idle' | 'success' | 'error';
type StorageWriteState = 'idle' | 'pending' | 'success' | 'error';

type PersistedPlannerState = {
  version: 1;
  projectCount: ProjectCount;
  projects: ProjectState[];
  firstRunReceipts: FirstRunReceiptState[];
  remember: true;
};

const PORTFOLIO_PLANNER_STORAGE_KEY = 'aidog:portfolio-evidence-planner:v1';
const starterShapeByCase: Record<BuildLabCaseId, PortfolioShapeId> = {
  'no-code': 'approval',
  'coding-starter': 'approval',
  approval: 'approval',
  retrieval: 'draft',
  reliability: 'reliability',
  'predictive-ml': 'triage',
  'public-data-eval': 'public-data',
  'public-statistics': 'context-brief',
};
const unavailableRecommendationCopy: Record<Locale, string> = {
  'zh-Hant': '相關實作指南未包含在這個版本；你仍可先完成本頁規劃。',
  'zh-Hans': '相关实作指南未包含在这个版本；你仍可先完成本页规划。',
  en: 'The related build guide is not included in this edition. You can still complete the plan on this page.',
};

const journeyCopy: Record<Locale, {
  starterContext: (title: string) => string;
  jumpToCapstone: string;
}> = {
  'zh-Hant': {
    starterContext: title => `由「${title}」帶過來的起點：第一個虛構項目方向已預先配對，但六個練習案例不會自動變成你的作品；你仍可更改方向。`,
    jumpToCapstone: '直接整理同一個 capstone',
  },
  'zh-Hans': {
    starterContext: title => `从“${title}”带过来的起点：第一个虚构项目方向已预先配对，但六个练习案例不会自动变成你的作品；你仍可更改方向。`,
    jumpToCapstone: '直接整理同一个 capstone',
  },
  en: {
    starterContext: title => `Starting from ${title}: the first fictional project direction is preselected, but its six practice cases do not automatically become your portfolio project. You can still change the direction.`,
    jumpToCapstone: 'Package this capstone directly',
  },
};

const resumeCopy: Record<Locale, { label: string; help: string; saved: string; unsaved: string; updating: string; writeError: string; restore: string; restored: string; empty: string; error: string }> = {
  'zh-Hant': {
    label: '選擇在這個瀏覽器記住規劃進度',
    help: '預設不儲存。勾選後只會寫入這個瀏覽器的 local storage，不會上傳；取消勾選會移除已儲存資料。',
    saved: '規劃進度已在這個瀏覽器內更新。',
    unsaved: '目前內容只存在這個頁面；重新整理會清空。',
    updating: '正在確認這個瀏覽器的儲存狀態。',
    writeError: '瀏覽器未能更新 local storage。這份內容仍留在目前頁面；舊有已儲存版本可能仍然存在。',
    restore: '還原這個瀏覽器內的進度',
    restored: '已還原已儲存的規劃進度。',
    empty: '這個瀏覽器沒有已儲存進度。',
    error: '已儲存進度格式無法讀取；未有載入內容。'
  },
  'zh-Hans': {
    label: '选择在这个浏览器记住规划进度',
    help: '默认不存储。勾选后只会写入这个浏览器的 local storage，不会上传；取消勾选会移除已存储数据。',
    saved: '规划进度已在这个浏览器内更新。',
    unsaved: '当前内容只存在这个页面；刷新会清空。',
    updating: '正在确认这个浏览器的存储状态。',
    writeError: '浏览器未能更新 local storage。这份内容仍留在当前页面；旧有已存储版本可能仍然存在。',
    restore: '还原这个浏览器内的进度',
    restored: '已还原已存储的规划进度。',
    empty: '这个浏览器没有已存储进度。',
    error: '已存储进度格式无法读取；没有载入内容。'
  },
  en: {
    label: 'Remember this planning progress in this browser',
    help: 'Nothing is stored by default. When checked, progress is written only to this browser’s local storage and is not uploaded. Unchecking removes the saved data.',
    saved: 'Planning progress is updated in this browser.',
    unsaved: 'The current work exists only on this page and will clear on refresh.',
    updating: 'Confirming this browser’s storage state.',
    writeError: 'The browser could not update local storage. This work remains on the current page, and an older saved version may still exist.',
    restore: 'Restore progress from this browser',
    restored: 'The saved planning progress has been restored.',
    empty: 'There is no saved planning progress in this browser.',
    error: 'The saved progress could not be read. No content was loaded.'
  }
};

const initialProject = (shape: PortfolioShapeId = 'approval'): ProjectState => ({
  shape,
  decision: 'unknown',
  signal: 'unknown',
  data: 'unknown',
  evaluation: 'unknown',
  operations: 'unknown',
  nonclaims: 'unknown',
  currentWorkaround: '',
  decisionOwner: '',
  errorConsequence: '',
  metricDefinition: '',
  comparisonBaseline: ''
});

const initialFirstRunReceipt = (): FirstRunReceiptState => ({
  caseIds: '',
  expectedRoute: '',
  actualRoute: '',
  baselineMeasure: '',
  candidateMeasure: '',
  repeatableSteps: '',
  reviewerDecision: 'unknown',
  failureNote: ''
});

const scoreWeights: Record<PortfolioDimensionId, Record<string, number>> = {
  decision: { unknown: 0, 'tool-first': 0, 'fictional-decision': 1, 'decision-owner': 2 },
  signal: { unknown: 0, 'model-only': 0, 'workflow-signal': 1, 'baseline-guardrail': 2 },
  data: { unknown: 0, unbounded: 0, synthetic: 1, 'boundary-owner': 2 },
  evaluation: { unknown: 0, 'demo-only': 0, cases: 1, 'baseline-cases': 2 },
  operations: { unknown: 0, none: 0, review: 1, 'review-rollback': 2 },
  nonclaims: { unknown: 0, claims: 0, partial: 1, explicit: 2 }
};

const readinessFloor: Record<PortfolioDimensionId, string> = {
  decision: 'decision-owner',
  signal: 'baseline-guardrail',
  data: 'boundary-owner',
  evaluation: 'baseline-cases',
  operations: 'review-rollback',
  nonclaims: 'explicit'
};

function projectScore(project: ProjectState) {
  return PORTFOLIO_DIMENSION_IDS.reduce((total, field) => total + (scoreWeights[field][project[field]] ?? 0), 0);
}

function clearsEvidenceFloor(project: ProjectState) {
  return PORTFOLIO_DIMENSION_IDS.every(field => project[field] === readinessFloor[field]);
}

function metricContractDetailCount(project: ProjectState) {
  return PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS.filter(detail => project[detail].trim()).length;
}

function hasCompleteMetricContract(project: ProjectState) {
  return metricContractDetailCount(project) === PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS.length;
}

function firstRunDetailCount(receipt: FirstRunReceiptState) {
  return PORTFOLIO_FIRST_RUN_DETAIL_IDS.filter(detail => receipt[detail].trim()).length;
}

function hasCompleteFirstRunReceipt(receipt: FirstRunReceiptState) {
  const requiresFailureNote = receipt.reviewerDecision === 'revise' || receipt.reviewerDecision === 'stop';
  return firstRunDetailCount(receipt) === PORTFOLIO_FIRST_RUN_DETAIL_IDS.length
    && receipt.reviewerDecision !== 'unknown'
    && (!requiresFailureNote || Boolean(receipt.failureNote.trim()));
}

function isPersistedPlannerState(value: unknown): value is PersistedPlannerState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PersistedPlannerState>;
  if (candidate.version !== 1 || candidate.remember !== true || ![1, 2, 3].includes(candidate.projectCount ?? 0)) return false;
  if (!Array.isArray(candidate.projects) || !Array.isArray(candidate.firstRunReceipts)) return false;
  const validProjects = candidate.projects.length >= 3 && candidate.projects.every(project =>
    project && PORTFOLIO_SHAPE_IDS.includes(project.shape)
      && [...PORTFOLIO_DIMENSION_IDS, ...PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS].every(field => typeof project[field] === 'string')
  );
  const validReceipts = candidate.firstRunReceipts.length >= 3 && candidate.firstRunReceipts.every(receipt =>
    receipt && PORTFOLIO_FIRST_RUN_DETAIL_IDS.every(field => typeof receipt[field] === 'string')
      && ['unknown', 'pass', 'revise', 'stop'].includes(receipt.reviewerDecision)
      && typeof receipt.failureNote === 'string'
  );
  return validProjects && validReceipts;
}

export default function PortfolioEvidencePlanner({
  locale,
  canExploreExamples = true,
  canReadWorkedExamples = true,
  initialShape = 'approval',
  sourceStarterTitle,
  availableArticleSlugs,
  quickStart,
}: {
  locale: Locale;
  canExploreExamples?: boolean;
  canReadWorkedExamples?: boolean;
  initialShape?: PortfolioShapeId;
  sourceStarterTitle?: string;
  availableArticleSlugs?: readonly string[];
  quickStart?: ReactNode;
}) {
  const copy = portfolioEvidencePlannerCopy[locale];
  const journey = journeyCopy[locale];
  const proofPack = portfolioProofPackCopy[locale];
  const [projectCount, setProjectCount] = useState<ProjectCount>(1);
  const [projects, setProjects] = useState<ProjectState[]>(() => [initialProject(initialShape), initialProject(), initialProject()]);
  const [firstRunReceipts, setFirstRunReceipts] = useState<FirstRunReceiptState[]>([initialFirstRunReceipt(), initialFirstRunReceipt(), initialFirstRunReceipt()]);
  const [briefCopyState, setBriefCopyState] = useState<BriefCopyState>('idle');
  const [proofPackCopyState, setProofPackCopyState] = useState<ProofPackCopyState>('idle');
  const [rememberProgress, setRememberProgress] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageWriteState, setStorageWriteState] = useState<StorageWriteState>('idle');
  const [restoreState, setRestoreState] = useState<'idle' | 'restored' | 'empty' | 'error'>('idle');
  const [browserStarter, setBrowserStarter] = useState<{ title: string }>();
  const resolvedStarterTitle = browserStarter?.title ?? sourceStarterTitle;

  useEffect(() => {
    const requestedStarter = new URLSearchParams(window.location.search).get('starter');
    if (!requestedStarter || !BUILD_LAB_CASE_IDS.includes(requestedStarter as BuildLabCaseId)) return;

    const starterCaseId = requestedStarter as BuildLabCaseId;
    const shape = starterShapeByCase[starterCaseId];
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setBrowserStarter({ title: buildLabCaseSelectorCopy[locale].cases[starterCaseId].title });
      setProjects(current => {
        const firstProject = current[0] ?? initialProject();
        if (firstProject.shape === shape) return current;
        return [{ ...firstProject, shape }, ...current.slice(1)];
      });
    });
    return () => { active = false; };
  }, [locale]);

  useEffect(() => {
    if (!storageReady) return;
    let nextWriteState: StorageWriteState;
    try {
      if (!rememberProgress) {
        window.localStorage.removeItem(PORTFOLIO_PLANNER_STORAGE_KEY);
      } else {
        const saved: PersistedPlannerState = { version: 1, projectCount, projects, firstRunReceipts, remember: true };
        window.localStorage.setItem(PORTFOLIO_PLANNER_STORAGE_KEY, JSON.stringify(saved));
      }
      nextWriteState = 'success';
    } catch {
      nextWriteState = 'error';
    }
    let active = true;
    queueMicrotask(() => {
      if (active) setStorageWriteState(nextWriteState);
    });
    return () => { active = false; };
  }, [firstRunReceipts, projectCount, projects, rememberProgress, storageReady]);

  function restoreProgress() {
    try {
      const raw = window.localStorage.getItem(PORTFOLIO_PLANNER_STORAGE_KEY);
      const saved: unknown = raw ? JSON.parse(raw) : undefined;
      if (!isPersistedPlannerState(saved)) {
        setRestoreState(raw ? 'error' : 'empty');
        return;
      }
      setProjectCount(saved.projectCount);
      setProjects(saved.projects);
      setFirstRunReceipts(saved.firstRunReceipts);
      setRememberProgress(true);
      setStorageReady(true);
      setStorageWriteState('pending');
      setRestoreState('restored');
    } catch {
      setRestoreState('error');
    }
  }

  const comparison = useMemo(() => {
    const activeProjects = Array.from({ length: projectCount }, (_, index) => {
      const project = projects[index] ?? initialProject();
      return {
        index,
        project,
        score: projectScore(project),
        clearsFloor: clearsEvidenceFloor(project),
        metricContractDetailCount: metricContractDetailCount(project),
        hasCompleteMetricContract: hasCompleteMetricContract(project)
      };
    });
    const strongest = [...activeProjects].sort((left, right) => right.score - left.score || left.index - right.index)[0];
    const chosen = activeProjects
      .filter(candidate => candidate.clearsFloor && candidate.hasCompleteMetricContract)
      .sort((left, right) => right.score - left.score || left.index - right.index)[0];
    const needsMeasurement = activeProjects
      .filter(candidate => candidate.clearsFloor && !candidate.hasCompleteMetricContract)
      .sort((left, right) => right.score - left.score || left.index - right.index)[0];
    return { activeProjects, strongest, chosen, needsMeasurement };
  }, [projectCount, projects]);

  const receiptProject = comparison.chosen ?? comparison.needsMeasurement ?? comparison.strongest;
  const brief = copy.shapes[receiptProject?.project.shape ?? 'approval'].brief;
  const routeRecommendation = portfolioRouteRecommendationCopy[locale][receiptProject?.project.shape ?? 'approval'];
  const routeRecommendationSlug = routeRecommendation.href.split('/articles/')[1]?.split(/[?#]/, 1)[0];
  const routeRecommendationAvailable = availableArticleSlugs === undefined
    || (routeRecommendationSlug !== undefined && availableArticleSlugs.includes(routeRecommendationSlug));
  const missingMetricDetails = receiptProject
    ? PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS.filter(detail => !receiptProject.project[detail].trim())
    : PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS;
  const stopReasons = receiptProject
    ? !receiptProject.clearsFloor
      ? PORTFOLIO_DIMENSION_IDS.filter(field => receiptProject.project[field] !== readinessFloor[field]).map(field => copy.stopReasons[field])
      : !receiptProject.hasCompleteMetricContract
        ? [`${copy.missingMeasurementDetails}: ${missingMetricDetails.map(detail => copy.metricContract[detail].label).join('; ')}`]
        : [copy.noOpenGaps]
    : PORTFOLIO_DIMENSION_IDS.map(field => copy.stopReasons[field]);
  const decisionText = comparison.chosen
    ? copy.readyDecision
    : comparison.needsMeasurement
      ? copy.needsMeasurementDecision
      : copy.pauseDecision;
  const decisionProject = comparison.chosen ?? comparison.needsMeasurement;
  const firstRunProject = comparison.chosen;
  const firstRunReceipt = firstRunProject ? firstRunReceipts[firstRunProject.index] ?? initialFirstRunReceipt() : undefined;
  const firstRunRecordedDetails = firstRunReceipt ? firstRunDetailCount(firstRunReceipt) : 0;
  const firstRunHasAllDetails = firstRunRecordedDetails === PORTFOLIO_FIRST_RUN_DETAIL_IDS.length;
  const firstRunRequiresFailureNote = firstRunReceipt?.reviewerDecision === 'revise' || firstRunReceipt?.reviewerDecision === 'stop';
  const firstRunNeedsFailureNote = firstRunRequiresFailureNote && !firstRunReceipt?.failureNote.trim();
  const firstRunComplete = firstRunReceipt ? hasCompleteFirstRunReceipt(firstRunReceipt) : false;
  const firstRunStatus = (() => {
    if (!firstRunProject) return copy.firstRun.planOnly;
    if (!firstRunHasAllDetails) return copy.firstRun.incompleteStatus(firstRunRecordedDetails);
    if (firstRunReceipt?.reviewerDecision === 'unknown') return copy.firstRun.needsDecisionStatus;
    if (firstRunNeedsFailureNote) return copy.firstRun.needsFailureNoteStatus;
    if (firstRunReceipt?.reviewerDecision === 'pass') return copy.firstRun.passStatus;
    if (firstRunReceipt?.reviewerDecision === 'revise') return copy.firstRun.reviseStatus;
    return copy.firstRun.stopStatus;
  })();

  function updateProject(index: number, field: PortfolioDimensionId | PortfolioMetricContractDetailId | 'shape', value: string) {
    setBriefCopyState('idle');
    if (rememberProgress) setStorageWriteState('pending');
    setProjects(current => Array.from({ length: Math.max(3, current.length, index + 1) }, (_, projectIndex) => {
      const project = current[projectIndex] ?? initialProject();
      return projectIndex === index ? { ...project, [field]: value } as ProjectState : project;
    }));
  }

  function updateFirstRunReceipt(index: number, field: PortfolioFirstRunDetailId | 'reviewerDecision' | 'failureNote', value: string) {
    setBriefCopyState('idle');
    if (rememberProgress) setStorageWriteState('pending');
    setFirstRunReceipts(current => Array.from({ length: Math.max(3, current.length, index + 1) }, (_, receiptIndex) => {
      const receipt = current[receiptIndex] ?? initialFirstRunReceipt();
      return receiptIndex === index
        ? { ...receipt, [field]: value } as FirstRunReceiptState
        : receipt;
    }));
  }

  function optionLabel(field: PortfolioDimensionId, value: string) {
    return copy.options[field].find(option => option.value === value)?.label ?? value;
  }

  function selectedConditions(project: ProjectState) {
    return PORTFOLIO_DIMENSION_IDS
      .filter(field => project[field] !== 'unknown')
      .map(field => `${copy.fields[field].label}: ${optionLabel(field, project[field])}`);
  }

  function metricContractEntries(project?: ProjectState) {
    return PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS.map(detail => ({
      detail,
      label: copy.metricContract[detail].label,
      value: project?.[detail].trim() || copy.notRecorded
    }));
  }

  const receiptConditions = receiptProject ? selectedConditions(receiptProject.project) : [];
  const receiptMetricContract = metricContractEntries(receiptProject?.project);
  const receiptMetricContractStatus = copy.metricContractStatus(receiptProject?.metricContractDetailCount ?? 0);
  const firstRunEntries = firstRunReceipt
    ? PORTFOLIO_FIRST_RUN_DETAIL_IDS.map(detail => ({
      label: copy.firstRun.details[detail].label,
      value: firstRunReceipt[detail].trim() || copy.notRecorded
    }))
    : [];
  const firstRunReviewerDecision = firstRunReceipt
    ? copy.firstRun.reviewerDecision.options[firstRunReceipt.reviewerDecision]
    : copy.notRecorded;
  const firstRunFailureNote = firstRunRequiresFailureNote
    ? firstRunReceipt?.failureNote.trim() || copy.notRecorded
    : copy.firstRun.notApplicable;
  const markdownConditions = receiptConditions.length
    ? receiptConditions
    : PORTFOLIO_DIMENSION_IDS.map(field => `${copy.fields[field].label}: ${optionLabel(field, 'unknown')}`);
  const receiptProjectLabel = receiptProject ? copy.projectLabel(receiptProject.index) : copy.noProject;
  const briefMarkdown = [
    `# ${copy.weekHeading}`,
    '',
    `## ${copy.projectReceipt}`,
    `- ${copy.receiptProject}: ${receiptProjectLabel}`,
    `- ${copy.receiptRoute}: ${copy.shapes[receiptProject?.project.shape ?? 'approval'].label}`,
    `- ${copy.receiptSignal}: ${receiptProject ? `${receiptProject.score} / 12` : '0 / 12'}`,
    '',
    `## ${copy.receiptInputs}`,
    ...markdownConditions.map(condition => `- ${condition}`),
    '',
    `## ${copy.receiptMetricContract}`,
    `- ${receiptMetricContractStatus}`,
    ...receiptMetricContract.map(detail => `- ${detail.label}: ${detail.value}`),
    '',
    `## ${copy.firstRun.heading}`,
    `- ${copy.firstRun.statusLabel}: ${firstRunStatus}`,
    ...(firstRunProject
      ? [
        `- ${copy.firstRun.projectLabel}: ${copy.projectLabel(firstRunProject.index)}`,
        ...firstRunEntries.map(detail => `- ${detail.label}: ${detail.value}`),
        `- ${copy.firstRun.reviewerDecision.label}: ${firstRunReviewerDecision}`,
        `- ${copy.firstRun.failureNote.label}: ${firstRunFailureNote}`
      ]
      : []),
    '',
    `## ${copy.fictionalUserDecision}`,
    brief.fictionalUserDecision,
    '',
    `## ${copy.nonGoal}`,
    brief.nonGoal,
    '',
    `## ${copy.safeDataRoute}`,
    brief.safeDataRoute,
    '',
    `## ${copy.baseline}`,
    brief.baseline,
    '',
    `## ${copy.firstEvaluation}`,
    brief.firstEvaluation,
    '',
    `## ${copy.explicitNonclaims}`,
    brief.explicitNonclaims,
    '',
    `## ${copy.suggestedDecision}`,
    decisionText,
    ...(stopReasons.length ? ['', `## ${copy.suggestedStop}`, ...stopReasons.map(reason => `- ${reason}`)] : []),
    '',
    `## ${copy.floorHeading}`,
    copy.floorText
  ].join('\n');

  async function copyWeekOneBrief() {
    if (!navigator.clipboard?.writeText) {
      setBriefCopyState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(briefMarkdown);
      setBriefCopyState('success');
    } catch {
      setBriefCopyState('error');
    }
  }

  async function copyProofPack() {
    if (!navigator.clipboard?.writeText) {
      setProofPackCopyState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(portfolioProofPackMarkdown);
      setProofPackCopyState('success');
    } catch {
      setProofPackCopyState('error');
    }
  }

  const liveDecision = decisionProject
    ? copy.suggestedProject + ': ' + copy.projectLabel(decisionProject.index) + '.'
    : copy.suggestedProject + ': ' + copy.noProject + '.';

  return <section className="learning-planner portfolio-evidence-planner" aria-labelledby="portfolio-planner-title">
    <FragmentAnchorScroll />
    <header className="planner-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 id="portfolio-planner-title">{copy.title}</h1>
      <p>{copy.intro}</p>
      {resolvedStarterTitle ? <p className="planner-source-context" role="note">{journey.starterContext(resolvedStarterTitle)}</p> : null}
      <p className="planner-privacy" role="note">{copy.privacy}</p>
      <div className="planner-resume-control">
        <button className="button secondary" type="button" onClick={restoreProgress}>{resumeCopy[locale].restore}</button>
        <p role="status">{restoreState === 'restored' ? resumeCopy[locale].restored : restoreState === 'empty' ? resumeCopy[locale].empty : restoreState === 'error' ? resumeCopy[locale].error : ''}</p>
        <label>
          <input type="checkbox" checked={rememberProgress} onChange={event => {
            setStorageReady(true);
            setStorageWriteState('pending');
            setRememberProgress(event.target.checked);
          }} />
          <span>{resumeCopy[locale].label}</span>
        </label>
        <p>{resumeCopy[locale].help}</p>
        <p role="status">{storageWriteState === 'error'
          ? resumeCopy[locale].writeError
          : storageWriteState === 'pending'
            ? resumeCopy[locale].updating
            : rememberProgress && storageWriteState === 'success'
              ? resumeCopy[locale].saved
              : resumeCopy[locale].unsaved}</p>
      </div>
      <div className="planner-header-actions">
        <FragmentAnchorLink className="button secondary" href="#portfolio-quick-start">{copy.jumpToComparison}</FragmentAnchorLink>
        <FragmentAnchorLink className="button secondary" href="#portfolio-capstone">{journey.jumpToCapstone}</FragmentAnchorLink>
        {canReadWorkedExamples ? <FragmentAnchorLink className="button secondary" href="#portfolio-worked-examples">{copy.readWorkedExamples}</FragmentAnchorLink> : null}
        {canExploreExamples ? <a className="button secondary" href={`/${locale}/labs`}>{copy.exploreExamples}</a> : null}
      </div>
    </header>

    {quickStart}

    <section className="planner-step planner-gap planner-route" aria-labelledby="portfolio-route-heading">
      <div className="planner-step-heading"><h2 className="planner-section-title" id="portfolio-route-heading">{copy.routeHeading}</h2><p>{copy.routeHelp}</p></div>
      <div className="planner-route-options" aria-label={copy.routeLabel}>
        {PORTFOLIO_SHAPE_IDS.map(shape => <section key={shape}><h3>{copy.shapes[shape].label}</h3><p>{copy.shapes[shape].description}</p></section>)}
      </div>
    </section>

    <section id="portfolio-projects" className="planner-step planner-projects" aria-labelledby="portfolio-project-heading" tabIndex={-1}>
      <div className="planner-step-heading"><h2 className="planner-section-title" id="portfolio-project-heading">{copy.projectHeading}</h2><p>{copy.projectCountHelp}</p></div>
      <label className="planner-control planner-count" htmlFor="portfolio-project-count">
        <span>{copy.projectCountLabel}</span>
        <select id="portfolio-project-count" value={projectCount} onChange={event => {
          setBriefCopyState('idle');
          if (rememberProgress) setStorageWriteState('pending');
          setProjectCount(Number(event.target.value) as ProjectCount);
        }}>
          {([1, 2, 3] as ProjectCount[]).map(count => <option key={count} value={count}>{copy.projectCountOptions[count]}</option>)}
        </select>
      </label>

      <div className="planner-source-grid">
        {comparison.activeProjects.map(({ index, project, score, clearsFloor, metricContractDetailCount: recordedMetricDetails, hasCompleteMetricContract }) => <fieldset className="planner-source" key={index}>
          <legend><span>{copy.projectSlot}</span><strong>{copy.projectLabel(index)}</strong></legend>
          <p className="planner-unnamed-help">{copy.anonymousHelp}</p>
          <label className="planner-control planner-project-shape" htmlFor={`portfolio-project-${index}-shape`}>
            <span>{copy.routeLabel}</span>
            <select id={`portfolio-project-${index}-shape`} value={project.shape} onChange={event => updateProject(index, 'shape', event.target.value)}>
              {PORTFOLIO_SHAPE_IDS.map(shape => <option key={shape} value={shape}>{copy.shapes[shape].label}</option>)}
            </select>
            <small>{copy.shapes[project.shape].description}</small>
          </label>
          <div className="planner-score" aria-label={`${copy.scoreLabel}: ${score} / 12`}><span>{copy.scoreLabel}</span><strong>{score}<small>/12</small></strong></div>
          <div className="planner-fields">
            {PORTFOLIO_DIMENSION_IDS.map(field => {
              const inputId = `portfolio-project-${index}-${field}`;
              return <label className="planner-control" htmlFor={inputId} key={field}>
                <span>{copy.fields[field].label}</span>
                <small>{copy.fields[field].help}</small>
                <select id={inputId} value={project[field]} onChange={event => updateProject(index, field, event.target.value)}>
                  {copy.options[field].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>;
            })}
          </div>
          <section className="planner-source-details planner-metric-contract" aria-labelledby={`portfolio-project-${index}-metric-contract-heading`}>
            <p className="planner-source-details-heading" id={`portfolio-project-${index}-metric-contract-heading`}>{copy.metricContractHeading}</p>
            <p className="planner-source-details-help" id={`portfolio-project-${index}-metric-contract-help`}>{copy.metricContractHelp}</p>
            <p className="planner-metric-contract-status" id={`portfolio-project-${index}-metric-contract-status`} role="status" aria-live="polite">
              {copy.metricContractStatus(recordedMetricDetails)}{hasCompleteMetricContract && clearsFloor ? ` · ${copy.noOpenGaps}` : ''}
            </p>
            <div className="planner-source-detail-fields">
              {PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS.map(detail => {
                const inputId = `portfolio-project-${index}-${detail}`;
                const detailCopy = copy.metricContract[detail];
                return <label className="planner-control" htmlFor={inputId} key={detail}>
                  <span>{detailCopy.label}</span>
                  <small>{detailCopy.help}</small>
                  <textarea
                    id={inputId}
                    rows={3}
                    maxLength={360}
                    value={project[detail]}
                    onChange={event => updateProject(index, detail, event.target.value)}
                    placeholder={detailCopy.placeholder}
                    autoComplete="off"
                    aria-describedby={`portfolio-project-${index}-metric-contract-help portfolio-project-${index}-metric-contract-status`}
                  />
                </label>;
              })}
            </div>
          </section>
        </fieldset>)}
      </div>
      <p className="planner-score-help">{copy.scoreHelp}</p>
    </section>

    <section className="planner-result" aria-labelledby="portfolio-decision-heading">
      <p className="sr-only" role="status" aria-atomic="true">{liveDecision}</p>
      <div className="planner-result-header"><h2 className="planner-section-title" id="portfolio-decision-heading">{copy.decisionHeading}</h2><p>{copy.floorText}</p></div>
      <div className="planner-decision-grid">
        <section className="planner-decision-card">
          <h3>{copy.suggestedProject}</h3>
          <p className="planner-decision-value">{decisionProject ? copy.projectLabel(decisionProject.index) : copy.noProject}</p>
        </section>
        <section className="planner-decision-card">
          <h3>{copy.suggestedDecision}</h3>
          <p>{decisionText}</p>
        </section>
        <section className="planner-decision-card planner-stop-card">
          <h3>{copy.suggestedStop}</h3>
          <ul>{stopReasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
        </section>
      </div>

      <section className="planner-first-run" aria-labelledby="portfolio-first-run-heading">
        <header>
          <h3 id="portfolio-first-run-heading">{copy.firstRun.heading}</h3>
          <p>{copy.firstRun.intro}</p>
        </header>
        <p className={`planner-first-run-status${firstRunComplete ? ` planner-first-run-status--${firstRunReceipt?.reviewerDecision}` : ''}`} id="portfolio-first-run-status" role="status" aria-live="polite" aria-atomic="true">
          <strong>{copy.firstRun.statusLabel}</strong> {firstRunStatus}
        </p>
        {firstRunProject && firstRunReceipt ? <>
          <p className="planner-first-run-project"><strong>{copy.firstRun.projectLabel}</strong> {copy.projectLabel(firstRunProject.index)}</p>
          <div className="planner-first-run-fields">
            {PORTFOLIO_FIRST_RUN_DETAIL_IDS.map(detail => {
              const inputId = `portfolio-first-run-${firstRunProject.index}-${detail}`;
              const detailCopy = copy.firstRun.details[detail];
              return <label className="planner-control" htmlFor={inputId} key={detail}>
                <span>{detailCopy.label}</span>
                <small>{detailCopy.help}</small>
                <textarea
                  id={inputId}
                  rows={3}
                  maxLength={360}
                  value={firstRunReceipt[detail]}
                  onChange={event => updateFirstRunReceipt(firstRunProject.index, detail, event.target.value)}
                  placeholder={detailCopy.placeholder}
                  autoComplete="off"
                  aria-describedby="portfolio-first-run-status"
                />
              </label>;
            })}
          </div>
          <label className="planner-control planner-first-run-decision" htmlFor={`portfolio-first-run-${firstRunProject.index}-reviewer-decision`}>
            <span>{copy.firstRun.reviewerDecision.label}</span>
            <small>{copy.firstRun.reviewerDecision.help}</small>
            <select
              id={`portfolio-first-run-${firstRunProject.index}-reviewer-decision`}
              value={firstRunReceipt.reviewerDecision}
              onChange={event => updateFirstRunReceipt(firstRunProject.index, 'reviewerDecision', event.target.value)}
              aria-describedby="portfolio-first-run-status"
            >
              {(Object.keys(copy.firstRun.reviewerDecision.options) as PortfolioFirstRunDecision[]).map(option => <option key={option} value={option}>{copy.firstRun.reviewerDecision.options[option]}</option>)}
            </select>
          </label>
          {firstRunRequiresFailureNote ? <label className="planner-control planner-first-run-failure" htmlFor={`portfolio-first-run-${firstRunProject.index}-failure-note`}>
            <span>{copy.firstRun.failureNote.label}</span>
            <small>{copy.firstRun.failureNote.help}</small>
            <textarea
              id={`portfolio-first-run-${firstRunProject.index}-failure-note`}
              rows={3}
              maxLength={360}
              value={firstRunReceipt.failureNote}
              onChange={event => updateFirstRunReceipt(firstRunProject.index, 'failureNote', event.target.value)}
              placeholder={copy.firstRun.failureNote.placeholder}
              autoComplete="off"
              aria-describedby="portfolio-first-run-status"
            />
          </label> : null}
        </> : null}
      </section>

      <section className="planner-route-recommendation" aria-labelledby="portfolio-route-recommendation-title">
        <header>
          <p className="eyebrow">{proofPack.routeEyebrow}</p>
          <h3 id="portfolio-route-recommendation-title">{proofPack.routeHeading}</h3>
          <h4>{routeRecommendation.title}</h4>
          <p>{routeRecommendation.description}</p>
        </header>
        <div className="planner-route-recommendation-grid">
          <section>
            <h4>{routeRecommendation.technicalHeading}</h4>
            <p>{routeRecommendation.technical}</p>
          </section>
          <section>
            <h4>{routeRecommendation.deliveryHeading}</h4>
            <p>{routeRecommendation.delivery}</p>
          </section>
        </div>
        <div className="planner-route-recommendation-actions">
          {routeRecommendationAvailable
            ? <a className="button primary" href={routeRecommendation.href}>{routeRecommendation.action} <span aria-hidden>→</span></a>
            : <p className="planner-route-source-status" role="note">{unavailableRecommendationCopy[locale]}</p>}
          <p className="planner-route-source-status" role="note">{routeRecommendation.sourceStatus}</p>
        </div>
      </section>

      <div className="planner-pack">
        <header className="planner-pack-header">
          <div><p className="eyebrow">WEEK 01</p><h3>{copy.weekHeading}</h3></div>
          <div className="planner-pack-actions">
            <button className="button secondary" type="button" onClick={copyWeekOneBrief} aria-describedby="portfolio-copy-brief-help">
              {copy.copyBrief}
            </button>
            <p id="portfolio-copy-brief-help" className="planner-copy-note">{copy.copyBriefHelp}</p>
          </div>
        </header>
        {briefCopyState !== 'idle' && <p className={`planner-copy-status${briefCopyState === 'error' ? ' planner-copy-status--error' : ''}`} role="status" aria-live="polite" aria-atomic="true">
          {briefCopyState === 'success' ? copy.copyBriefSuccess : copy.copyBriefError}
        </p>}
        <div className="planner-pack-grid portfolio-brief-grid">
          <section className="planner-receipt">
            <h3>{copy.projectReceipt}</h3>
            <dl>
              <div><dt>{copy.receiptProject}</dt><dd>{receiptProject ? copy.projectLabel(receiptProject.index) : copy.noProject}</dd></div>
              <div><dt>{copy.receiptRoute}</dt><dd>{copy.shapes[receiptProject?.project.shape ?? 'approval'].label}</dd></div>
              <div><dt>{copy.receiptSignal}</dt><dd>{receiptProject ? `${receiptProject.score} / 12` : '0 / 12'}</dd></div>
              <div><dt>{copy.receiptInputs}</dt><dd>{receiptConditions.length ? <ul>{receiptConditions.map(condition => <li key={condition}>{condition}</li>)}</ul> : copy.options.decision[0]?.label}</dd></div>
              <div><dt>{copy.receiptMetricContract}</dt><dd><p className="planner-receipt-metric-status">{receiptMetricContractStatus}</p><ul>{receiptMetricContract.map(detail => <li key={detail.detail}><strong>{detail.label}:</strong> {detail.value}</li>)}</ul></dd></div>
            </dl>
          </section>
          <section className="planner-starter-card"><h3>{copy.fictionalUserDecision}</h3><p>{brief.fictionalUserDecision}</p></section>
          <section className="planner-starter-card"><h3>{copy.nonGoal}</h3><p>{brief.nonGoal}</p></section>
          <section className="planner-starter-card"><h3>{copy.safeDataRoute}</h3><p>{brief.safeDataRoute}</p></section>
          <section className="planner-starter-card"><h3>{copy.baseline}</h3><p>{brief.baseline}</p></section>
          <section className="planner-starter-card"><h3>{copy.firstEvaluation}</h3><p>{brief.firstEvaluation}</p></section>
          <section className="planner-starter-card"><h3>{copy.explicitNonclaims}</h3><p>{brief.explicitNonclaims}</p></section>
        </div>
      </div>

      <section className="planner-proof-pack" aria-labelledby="portfolio-proof-pack-title">
        <header>
          <p className="eyebrow">{proofPack.eyebrow}</p>
          <h3 id="portfolio-proof-pack-title">{proofPack.title}</h3>
          <p>{proofPack.intro}</p>
        </header>
        <div className="planner-proof-pack-actions">
          <a className="button primary" download href={PORTFOLIO_PROOF_PACK_DOWNLOAD_HREF}>{proofPack.download}</a>
          <button className="button secondary" type="button" onClick={copyProofPack} aria-describedby="portfolio-copy-proof-pack-help">{proofPack.copy}</button>
          <p id="portfolio-copy-proof-pack-help" className="planner-copy-note">{proofPack.copyHelp}</p>
        </div>
        {proofPackCopyState !== 'idle' && <p className={`planner-copy-status${proofPackCopyState === 'error' ? ' planner-copy-status--error' : ''}`} role="status" aria-live="polite" aria-atomic="true">
          {proofPackCopyState === 'success' ? proofPack.copySuccess : proofPack.copyError}
        </p>}
        <div className="planner-proof-pack-content">
          <section>
            <h4>{proofPack.includesHeading}</h4>
            <ul>{proofPack.includes.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
          <aside>
            <p>{proofPack.sourceLanguage}</p>
            <p role="note">{proofPack.downloadHelp}</p>
          </aside>
        </div>
        <p className="planner-proof-pack-boundary" role="note">{proofPack.boundary}</p>
      </section>

      <aside className="planner-rule"><h3>{copy.floorHeading}</h3><p>{copy.floorText}</p></aside>
    </section>
  </section>;
}
