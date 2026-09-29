import type { Locale } from './types';
import { canonicalLocaleRecord } from './types';

export const PORTFOLIO_DIMENSION_IDS = ['decision', 'signal', 'data', 'evaluation', 'operations', 'nonclaims'] as const;
export type PortfolioDimensionId = typeof PORTFOLIO_DIMENSION_IDS[number];

export const PORTFOLIO_SHAPE_IDS = ['approval', 'triage', 'draft', 'reliability', 'public-data', 'context-brief'] as const;
export type PortfolioShapeId = typeof PORTFOLIO_SHAPE_IDS[number];

export const PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS = [
  'currentWorkaround',
  'decisionOwner',
  'errorConsequence',
  'metricDefinition',
  'comparisonBaseline'
] as const;
export type PortfolioMetricContractDetailId = typeof PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS[number];

export const PORTFOLIO_FIRST_RUN_DETAIL_IDS = [
  'caseIds',
  'expectedRoute',
  'actualRoute',
  'baselineMeasure',
  'candidateMeasure',
  'repeatableSteps'
] as const;
export type PortfolioFirstRunDetailId = typeof PORTFOLIO_FIRST_RUN_DETAIL_IDS[number];
export type PortfolioFirstRunDecision = 'unknown' | 'pass' | 'revise' | 'stop';

type Option = { value: string; label: string };
type MetricContractDetail = { label: string; help: string; placeholder: string };
type FirstRunReceiptCopy = {
  heading: string;
  intro: string;
  statusLabel: string;
  projectLabel: string;
  planOnly: string;
  notApplicable: string;
  incompleteStatus: (recorded: number) => string;
  needsDecisionStatus: string;
  needsFailureNoteStatus: string;
  passStatus: string;
  reviseStatus: string;
  stopStatus: string;
  details: Record<PortfolioFirstRunDetailId, MetricContractDetail>;
  reviewerDecision: { label: string; help: string; options: Record<PortfolioFirstRunDecision, string> };
  failureNote: MetricContractDetail;
};

type WeekOneBrief = {
  fictionalUserDecision: string;
  nonGoal: string;
  safeDataRoute: string;
  baseline: string;
  firstEvaluation: string;
  explicitNonclaims: string;
};

export type PortfolioEvidencePlannerCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  privacy: string;
  jumpToComparison: string;
  readWorkedExamples: string;
  exploreExamples: string;
  workedExamplesEyebrow: string;
  workedExamplesHeading: string;
  workedExamplesIntro: string;
  routeHeading: string;
  routeLabel: string;
  routeHelp: string;
  shapes: Record<PortfolioShapeId, { label: string; description: string; brief: WeekOneBrief }>;
  projectHeading: string;
  projectCountLabel: string;
  projectCountHelp: string;
  projectCountOptions: Record<1 | 2 | 3, string>;
  projectSlot: string;
  anonymousHelp: string;
  metricContractHeading: string;
  metricContractHelp: string;
  metricContractStatus: (recorded: number) => string;
  metricContract: Record<PortfolioMetricContractDetailId, MetricContractDetail>;
  firstRun: FirstRunReceiptCopy;
  fields: Record<PortfolioDimensionId, { label: string; help: string }>;
  options: Record<PortfolioDimensionId, Option[]>;
  scoreLabel: string;
  scoreHelp: string;
  decisionHeading: string;
  suggestedProject: string;
  suggestedDecision: string;
  suggestedStop: string;
  noProject: string;
  readyDecision: string;
  needsMeasurementDecision: string;
  pauseDecision: string;
  weekHeading: string;
  projectReceipt: string;
  receiptProject: string;
  receiptRoute: string;
  receiptSignal: string;
  receiptInputs: string;
  receiptMetricContract: string;
  notRecorded: string;
  missingMeasurementDetails: string;
  noOpenGaps: string;
  fictionalUserDecision: string;
  nonGoal: string;
  safeDataRoute: string;
  baseline: string;
  firstEvaluation: string;
  explicitNonclaims: string;
  floorHeading: string;
  floorText: string;
  copyBrief: string;
  copyBriefHelp: string;
  copyBriefSuccess: string;
  copyBriefError: string;
  projectLabel: (index: number) => string;
  stopReasons: Record<PortfolioDimensionId, string>;
};

const projectName = (prefix: string) => (index: number) => `${prefix} ${String(index + 1).padStart(2, '0')}`;

export const portfolioEvidencePlannerCopy: Record<Locale, PortfolioEvidencePlannerCopy> = canonicalLocaleRecord({
  en: {
    eyebrow: 'PORTFOLIO EVIDENCE PLANNER',
    title: 'Turn a portfolio idea into a first work brief',
    intro: 'Choose up to three anonymous project directions and check six practical things: who needs to decide, how you would know the work helps, which data is allowed, how you would test it, who takes over when it goes wrong, and what you cannot claim yet. You will leave with a small Week-1 brief you can change; it is not a score of your ability or a promise of a job or business result.',
    privacy: 'This page runs only in your browser. It has no account, tracking, network request, or data transfer. Nothing is stored unless you choose “Remember” below; that opt-in saves only to this browser. Keep every note fictional and anonymous: do not enter employer, client, product, personal, proprietary, or real business figures.',
    jumpToComparison: 'Start the 15-minute card',
    readWorkedExamples: 'Read three complete examples',
    exploreExamples: 'Browse the build patterns',
    workedExamplesEyebrow: 'FULLY WORKED EXAMPLES',
    workedExamplesHeading: 'See three complete examples',
    workedExamplesIntro: 'These three examples show the decision, allowed data, comparison approach, checks, review step, and limits in one place. Read them after drafting your Week-1 brief, or use one to decide where to start.',
    routeHeading: '01 · Pick a safe fictional exercise',
    routeLabel: 'Who are you helping, and what decision are you making clearer?',
    routeHelp: 'Start with the decision and the person who must make it—not a model or tool. These six routes use fictional people and fixed practice data. Choose one for each Project slot.',
    shapes: {
      approval: {
        label: 'Draft for human approval',
        description: 'A fictional operations reviewer decides whether a synthetic request is safe to draft, hand off, or block.',
        brief: {
          fictionalUserDecision: 'A fictional operations reviewer decides whether a synthetic request may become a draft for human approval.',
          nonGoal: 'Do not send a message, update a ticket, approve a request, or claim the draft is correct.',
          safeDataRoute: 'Use a small synthetic FAQ and fictional requests only. Prohibit personal, customer, employer, and credential data.',
          baseline: 'Compare against a transparent manual checklist: supported request, unsupported request, prohibited input, and required human review.',
          firstEvaluation: 'Before inspecting output, write one future business measure you will not claim yet, one release-blocking guardrail, and one expected draft-for-review plus handoff case.',
          explicitNonclaims: 'No live API call, external action, customer outcome, accuracy claim, or production-readiness claim.'
        }
      },
      triage: {
        label: 'Prioritise a human review queue',
        description: 'A fictional team lead decides which synthetic cases deserve manual review first, with a visible baseline and guardrail.',
        brief: {
          fictionalUserDecision: 'A fictional team lead decides which synthetic cases are placed first in a human review queue.',
          nonGoal: 'Do not make an eligibility, pricing, retention, hiring, or other consequential decision automatically.',
          safeDataRoute: 'Use a deliberately small synthetic table with fictional labels and fields. Do not copy a spreadsheet, CRM, or workplace export.',
          baseline: 'Start with a transparent rule-based ordering and a guardrail for missing or prohibited information.',
          firstEvaluation: 'Create one case that should be prioritised and one incomplete case that must be routed to a person.',
          explicitNonclaims: 'No claim of uplift, savings, fairness, model quality, business impact, or use of real customer data.'
        }
      },
      draft: {
        label: 'Prepare a bounded internal draft',
        description: 'A fictional programme coordinator decides whether a synthetic note can be drafted from allowed material or must stay with a human.',
        brief: {
          fictionalUserDecision: 'A fictional programme coordinator decides whether an allowed synthetic note may be drafted for a human to revise.',
          nonGoal: 'Do not publish, contact anyone, create a record in another system, or represent the draft as an approved answer.',
          safeDataRoute: 'Use two short synthetic source notes and a prohibited-input example. Keep real files, inboxes, and accounts out of scope.',
          baseline: 'Use a manual template and an acceptance checklist before comparing any AI-assisted draft.',
          firstEvaluation: 'Check one allowed-note case and one prohibited-input case; the latter must stop at human review.',
          explicitNonclaims: 'No autonomous workflow, provider comparison, productivity claim, confidential-data use, or deployed-system claim.'
        }
      },
      reliability: {
        label: 'Make a batch workflow recover safely',
        description: 'A fictional operations owner decides whether a synthetic document task stays pending, resumes from a checkpoint, or enters dead-letter review without repeating a completed version.',
        brief: {
          fictionalUserDecision: 'A fictional operations owner decides whether a synthetic document task may create a human-review-only enrichment record, stay pending, resume, or move to dead-letter review.',
          nonGoal: 'Do not update a document system, call a model, contact a person, claim exactly-once delivery, or claim a service-level result.',
          safeDataRoute: 'Use fictional document events and fixed local outcomes only. Keep credentials, document text, queues, and production traces out of scope.',
          baseline: 'Define a serial queue limit, terminal idempotency key, retry categories, fixed cost stop, and manual dead-letter route before a candidate change.',
          firstEvaluation: 'Include a success, timeout or 429, permanent bad input, duplicate, checkpoint-resume, and budget-stop case; compare one policy change against the same fixture.',
          explicitNonclaims: 'No deployed worker, live queue, provider behaviour, model result, observed cost, concurrency, durable storage, or business outcome claim.'
        }
      },
      'public-data': {
        label: 'Validate a public-data receipt before review',
        description: 'A fictional assurance reviewer decides whether a source receipt and allowed public fields are complete enough for a no-action evidence packet or must be rejected.',
        brief: {
          fictionalUserDecision: 'A fictional assurance reviewer decides whether a fixed public-field teaching record and its source receipt may become a no-action evidence packet or must be SOURCE_REJECTED.',
          nonGoal: 'Do not download a live feed, match an asset, scan, patch, create a ticket, or infer an organisation’s exposure or deadline.',
          safeDataRoute: 'Use a fixed fixture manifest marked not-live-acquired and an allowlist of public fields only. Exclude private, operational, asset, and contact data.',
          baseline: 'Validate the source receipt, allowed fields, schema, freshness rule, and empty action authority before any optional language layer.',
          firstEvaluation: 'Include malformed, stale, private-field, injection, action-request, ambiguous-asset, and exact-value-preservation cases alongside one normal packet.',
          explicitNonclaims: 'No current-data, source-sync, security-posture, remediation, compliance, model-quality, deployment, or business-outcome claim.'
        }
      },
      'context-brief': {
        label: 'Prepare a source-bound context brief',
        description: 'A fictional research lead decides whether a source-shaped synthetic statistics receipt is complete enough for a human-written context brief, not a forecast.',
        brief: {
          fictionalUserDecision: 'A fictional workforce-planning research lead decides whether a source-shaped synthetic statistics receipt is complete enough for a human-written context brief.',
          nonGoal: 'Do not forecast, explain a trend, recommend hiring or pay, advise on visas, publish a report, or make an external decision.',
          safeDataRoute: 'Use a synthetic monthly series with explicit metadata and a source route recorded as not acquired. Keep real employer, employee, candidate, salary, and operational data out.',
          baseline: 'Check receipt completeness, required metadata, time order, freshness, private-field boundary, and no-action contract before drafting narrative.',
          firstEvaluation: 'Include missing-unit, unordered-period, stale-receipt, private-field, injection, and forecast-request cases; a forecast request must stop at human review.',
          explicitNonclaims: 'No live statistics acquisition, current labour-market claim, forecast, hiring or salary advice, migration advice, model result, or published outcome claim.'
        }
      }
    },
    projectHeading: '02 · Check whether you can explain the idea clearly',
    projectCountLabel: 'How many anonymous project directions do you want to compare?',
    projectCountHelp: 'Use Project 01–03 only. You do not need to name a company, product, model, or project to see whether the idea is safe and specific enough to begin.',
    projectCountOptions: { 1: 'One project', 2: 'Two projects', 3: 'Three projects' },
    projectSlot: 'Project slot',
    anonymousHelp: 'Keep this anonymous. Choose only conditions you can explain and test safely.',
    metricContractHeading: 'Measurement details',
    metricContractHelp: 'You may leave these blank while comparing ideas. Before this planner can recommend a Week-1 brief with a defined measurement plan, record all five using a fictional, anonymous description. These notes stay in this browser and are copied only if you choose to copy the brief.',
    metricContractStatus: recorded => `${recorded} of 5 measurement details recorded`,
    metricContract: {
      currentWorkaround: { label: 'What happens today?', help: 'Describe the current manual workaround before this project exists. Keep it fictional and general.', placeholder: 'For example: a reviewer checks each fictional request against a fixed list.' },
      decisionOwner: { label: 'Who uses the result to decide?', help: 'Name a role, not a person, company, customer, or team.', placeholder: 'For example: fictional operations reviewer.' },
      errorConsequence: { label: 'What is the consequence of a wrong call?', help: 'Describe a delay, rework, risk, or required human handoff. Do not estimate real costs.', placeholder: 'For example: incomplete cases must go to a person before they are prioritised.' },
      metricDefinition: { label: 'How will the measure be calculated?', help: 'State the numerator, denominator, observation window, and threshold. A definition is not a result.', placeholder: 'For example: numerator = correctly routed cases; denominator = 20 fictional cases per week; threshold = at least 18.' },
      comparisonBaseline: { label: 'What will you compare it with?', help: 'Name the current manual method or simple rule and when the comparison happens.', placeholder: 'For example: compare with the fixed manual checklist on the same fictional cases.' }
    },
    firstRun: {
      heading: '04 · Leave a first-run note',
      intro: 'This page does not execute a workflow, verify a model, or create evidence by itself. It is a local note for one check you perform with fictional cases. It stays in this browser window and disappears when you refresh.',
      statusLabel: 'Run-note status:',
      projectLabel: 'Project slot:',
      planOnly: 'PLAN ONLY / NOT_RUN. First make the project conditions and measurement details concrete; then perform one local check.',
      notApplicable: 'Not applicable',
      incompleteStatus: recorded => `RUN NOTE INCOMPLETE. ${recorded} of 6 run details are recorded. Do not describe this as a completed evaluation.`,
      needsDecisionStatus: 'RUN NOTE INCOMPLETE. All six run details are recorded, but the reviewer has not chosen PASS, REVISE, or STOP.',
      needsFailureNoteStatus: 'RUN NOTE INCOMPLETE. REVISE or STOP needs a short reason before this can be retained as a complete local note.',
      passStatus: 'LOCAL RUN NOTE / PASS. This is a note you entered about a local check, not independently verified evidence or a business result.',
      reviseStatus: 'LOCAL RUN NOTE / REVISE. Keep the failure visible and revise the work before you describe the check as passed.',
      stopStatus: 'LOCAL RUN NOTE / STOP. Record the boundary, leave the work out of a passed portfolio claim, and hand it back to a person or a smaller exercise.',
      details: {
        caseIds: { label: 'Which fictional case IDs did you check?', help: 'List only safe fixture IDs, never a customer, employee, ticket, document, or real identifier.', placeholder: 'For example: request-02, request-06, request-09.' },
        expectedRoute: { label: 'What should have happened?', help: 'Write the expected safe route, including review, stop, or handoff where needed.', placeholder: 'For example: incomplete request is sent to human review; no draft is created.' },
        actualRoute: { label: 'What actually happened?', help: 'Describe the observed local route, including an unexpected result.', placeholder: 'For example: request-06 entered the draft route instead of human review.' },
        baselineMeasure: { label: 'What did the baseline do?', help: 'Record the simple manual rule or previous version result on the same fictional cases.', placeholder: 'For example: the checklist routed 5 of 6 cases as expected.' },
        candidateMeasure: { label: 'What did the candidate do?', help: 'Record the candidate result using the same definition. Do not infer a business effect.', placeholder: 'For example: the candidate routed 4 of 6 cases as expected.' },
        repeatableSteps: { label: 'How could someone repeat this check?', help: 'Write the short manual steps, fixture version, or command. Do not paste credentials or private paths.', placeholder: 'For example: open fixture v0.1, apply the fixed checklist, compare the six routes.' }
      },
      reviewerDecision: {
        label: 'Reviewer decision for this local note',
        help: 'PASS means the bounded check met its stated rule. REVISE and STOP require a short reason below. None of these options proves a production or business outcome.',
        options: { unknown: 'Choose after the check', pass: 'PASS — the bounded local check met its stated rule', revise: 'REVISE — a result or boundary needs work', stop: 'STOP — do not continue this version' }
      },
      failureNote: { label: 'Why does this need revision or a stop?', help: 'Required for REVISE or STOP. State the failed case, safe next owner, or the smaller boundary. Keep it fictional and anonymous.', placeholder: 'For example: request-06 bypassed human review; return it to the reviewer and fix the routing rule.' }
    },
    fields: {
      decision: { label: 'Decision and who owns it', help: 'Can you name the fictional decision, who makes it, and what the output changes?' },
      signal: { label: 'How you would know the work helps', help: 'Can you measure a workflow outcome against a simple comparison and a safety limit, rather than a model score alone?' },
      data: { label: 'Data and rights boundary', help: 'Are allowed, prohibited, synthetic, and human-owned inputs explicit?' },
      evaluation: { label: 'How you would check the result', help: 'Can someone compare expected success, failure, and handoff cases against the simple comparison approach?' },
      operations: { label: 'Review and recovery', help: 'Is there a review step, a record of what happened, a way to return to the previous version, or a clear human handoff?' },
      nonclaims: { label: 'What you cannot claim yet', help: 'Does the README say what is not built, proven, connected, or claimed?' }
    },
    options: {
      decision: [
        { value: 'unknown', label: 'Not defined yet' },
        { value: 'tool-first', label: 'Starts with a tool or model, not a decision' },
        { value: 'fictional-decision', label: 'A fictional decision is named, but the owner or changed action is vague' },
        { value: 'decision-owner', label: 'A fictional decision, human owner, and changed action are all explicit' }
      ],
      signal: [
        { value: 'unknown', label: 'Not defined yet' },
        { value: 'model-only', label: 'Only a model or prompt metric is named' },
        { value: 'workflow-signal', label: 'A workflow signal is named, but lacks a clear baseline or guardrail' },
        { value: 'baseline-guardrail', label: 'A workflow signal, baseline, and guardrail are explicit' }
      ],
      data: [
        { value: 'unknown', label: 'Not defined yet' },
        { value: 'unbounded', label: 'Data source or permission boundary is unclear' },
        { value: 'synthetic', label: 'Synthetic or public-safe data is named, but restrictions are incomplete' },
        { value: 'boundary-owner', label: 'Allowed and prohibited data, safe route, and human owner are explicit' }
      ],
      evaluation: [
        { value: 'unknown', label: 'Not defined yet' },
        { value: 'demo-only', label: 'A happy-path demo is the only check' },
        { value: 'cases', label: 'Some test cases exist, but baseline or expected routing is vague' },
        { value: 'baseline-cases', label: 'Baseline plus expected pass, failure, and handoff cases are explicit' }
      ],
      operations: [
        { value: 'unknown', label: 'Not defined yet' },
        { value: 'none', label: 'No review, trace, rollback, or human handoff is visible' },
        { value: 'review', label: 'A reviewer or handoff exists, but the operating boundary is vague' },
        { value: 'review-rollback', label: 'Review or handoff, trace, and rollback or stop boundary are explicit' }
      ],
      nonclaims: [
        { value: 'unknown', label: 'Not defined yet' },
        { value: 'claims', label: 'It implies job, business, production, or model-quality outcomes' },
        { value: 'partial', label: 'Some scope limits are written, but claims and boundaries are incomplete' },
        { value: 'explicit', label: 'README clearly states what is not built, connected, proven, or claimed' }
      ]
    },
    scoreLabel: 'Planning completeness',
    scoreHelp: 'This local checklist is out of 12. A 12/12 only says the six project conditions are described; it does not mean a business measure has been defined, observed, or improved.',
    decisionHeading: '03 · Decide whether to start or pause',
    suggestedProject: 'Suggested project',
    suggestedDecision: 'Suggested decision',
    suggestedStop: 'Stop before build when',
    noProject: 'None is ready yet',
    readyDecision: 'Start a bounded Week‑1 brief for this project slot. Keep it synthetic, reviewable, and reversible; the recorded measurement plan is still a definition, not evidence of a business result.',
    needsMeasurementDecision: 'You can use this project as an exploratory exercise, but its measurement details are still incomplete. Do not present it as a business case with a defined measurement plan or claim a business result yet.',
    pauseDecision: 'Pause the build. The strongest current slot still has unproven conditions. Resolve the listed gaps before adding an agent, model, integration, or polished UI.',
    weekHeading: 'Your Week‑1 project brief',
    projectReceipt: 'Your selected conditions',
    receiptProject: 'Compared slot',
    receiptRoute: 'Fictional project shape',
    receiptSignal: 'Current signal',
    receiptInputs: 'Selected conditions',
    receiptMetricContract: 'Measurement details',
    notRecorded: 'Not recorded',
    missingMeasurementDetails: 'Measurement details still needed',
    noOpenGaps: 'All five measurement details are recorded. They still describe a future check, not evidence of an outcome.',
    fictionalUserDecision: 'Fictional user and decision',
    nonGoal: 'Non-goal',
    safeDataRoute: 'Safe data route',
    baseline: 'Baseline',
    firstEvaluation: 'First check',
    explicitNonclaims: 'What it does not prove',
    floorHeading: 'What needs to be clear first',
    floorText: 'The six project checks are enough to explore an idea safely. A Week-1 recommendation with a defined measurement plan also needs five recorded details: today’s workaround, the decision owner, the consequence of a wrong call, a metric definition with numerator, denominator, window, and threshold, plus a comparison baseline. A higher number cannot fill a missing safety, accountability, or measurement detail.',
    copyBrief: 'Copy this Week-1 brief',
    copyBriefHelp: 'Copies a Markdown outline to your device clipboard. Nothing is saved, sent, or added to a profile.',
    copyBriefSuccess: 'Brief copied. Paste it into a private note, issue, or README draft.',
    copyBriefError: 'Your browser did not allow copying. Select the evidence receipt and copy it manually.',
    projectLabel: projectName('Project'),
    stopReasons: {
      decision: 'the fictional decision, human owner, or changed action is not explicit',
      signal: 'the workflow signal has no named baseline and guardrail',
      data: 'allowed and prohibited data, safe route, or human owner is still unclear',
      evaluation: 'baseline plus pass, failure, and handoff cases are not inspectable',
      operations: 'review or handoff, trace, and rollback or stop boundary are not explicit',
      nonclaims: 'the README does not clearly state what is not built, connected, proven, or claimed'
    }
  },
  'zh-HK': {
    eyebrow: '作品集證據規劃器',
    title: '用一星期，將作品集想法寫成一份工作說明',
    intro: '揀最多三個不記名方向，寫低邊個拍板、點樣判斷有冇幫助、可用乜資料、點樣檢查同出錯時畀邊個處理；暫時唔可以聲稱嘅事亦要列明。頁面會將內容整理成一份可修改嘅第一星期工作說明，唔會替你評估能力，亦唔保證求職或商業結果。',
    privacy: '呢頁只喺你部裝置內運作。冇帳戶、追蹤、網絡請求或資料傳送。除非你喺下面主動選擇「記住」，否則唔會儲存；選擇後亦只會留喺呢個瀏覽器。所有量度筆記只寫虛構同概括內容；唔好填僱主、客戶、產品、個人、內部資料或真實商業數字。',
    jumpToComparison: '由 15 分鐘起步卡開始',
    readWorkedExamples: '睇三個寫清楚嘅案例',
    exploreExamples: '睇其他實作例子',
    workedExamplesEyebrow: '完整案例',
    workedExamplesHeading: '睇三個已寫清楚嘅案例',
    workedExamplesIntro: '三個完整例子會寫清楚：邊個拍板、可以用乜資料、先用乜人手做法作對照、點樣檢查，以及出錯時交畀邊個。你可以先寫第一星期工作說明，再攞佢哋校對；未開始時，亦可以用嚟揀方向。',
    routeHeading: '01 · 揀一個範圍清楚嘅虛構練習',
    routeLabel: '你想幫邊位負責人釐清咩決定？',
    routeHelp: '先講清楚要做嘅決定同邊個拍板，模型同工具留到之後。以下六條路線全部用虛構人物同固定練習資料；每個項目欄位揀一條。',
    shapes: {
      approval: { label: '為人手批核準備草稿', description: '虛構營運覆核員要決定：一份虛構要求可唔可以成為草稿、要交返畀人，定係應該停低。', brief: { fictionalUserDecision: '虛構營運覆核員要決定：一份虛構要求可唔可以變成等候人手批核嘅草稿。', nonGoal: '唔會發訊息、改 ticket 或批核要求，亦唔會聲稱草稿正確。', safeDataRoute: '只用少量虛構 FAQ 同虛構要求；唔用個人、客戶、僱主或登入資料。', baseline: '同清楚列明嘅人手清單作對照：可支援要求、唔支援要求、禁止輸入，以及必須人手覆核嘅情況。', firstEvaluation: '未睇輸出之前，先寫一個用嚟判斷有冇幫助嘅衡量方法、一個一出現就要停低嘅安全限制，仲有一個預期要出草稿畀人覆核嘅情況同一個交畀人處理嘅情況。', explicitNonclaims: '冇即時 API 呼叫、外部動作、客戶結果、準確率或可投入生產嘅聲稱。' } },
      triage: { label: '排人手覆核隊列先後', description: '虛構團隊主管要決定邊啲虛構個案要先畀人睇，同時保留人手對照做法同安全限制。', brief: { fictionalUserDecision: '虛構團隊主管要決定邊啲虛構個案放喺人手覆核隊列前面。', nonGoal: '唔會自動判定資格、定價、續約、招聘或其他重要決定。', safeDataRoute: '只用刻意做得好細、有虛構標籤同欄位嘅表格；唔好複製試算表、CRM 或工作匯出檔。', baseline: '先用可解釋嘅規則排順序，並為遺漏或禁止資料設好安全限制。', firstEvaluation: '準備一個應優先嘅個案，同一個資料不完整、必須交畀人處理嘅個案。', explicitNonclaims: '唔聲稱帶來提升、節省成本、公平、模型表現或商業影響，亦唔用真實客戶資料。' } },
      draft: { label: '準備有清楚範圍嘅內部草稿', description: '虛構項目統籌要決定：一份虛構筆記可唔可以由容許材料變成草稿，定係留畀人處理。', brief: { fictionalUserDecision: '虛構項目統籌要決定：一份容許嘅虛構筆記可唔可以先整成畀人修改嘅草稿。', nonGoal: '唔會發佈、聯絡任何人或喺另一個系統建立記錄；草稿亦唔當成已批准答案。', safeDataRoute: '只用兩段虛構來源筆記同一個禁止輸入例子；真實檔案、收件箱同帳戶都唔入範圍。', baseline: '先用人手範本同驗收清單，再比較任何 AI 輔助草稿。', firstEvaluation: '檢查一個可用筆記嘅情況同一個禁止輸入嘅情況；後者一定交畀人覆核。', explicitNonclaims: '冇自動執行流程、供應商比較、生產力聲稱、機密資料使用或已部署系統嘅聲稱。' } },
      reliability: { label: '令批次工作可以安全復原', description: '虛構營運負責人要決定：一份虛構文件工作係繼續等、由中斷位繼續，定係交去例外處理，同時避免重做已完成嘅版本。', brief: { fictionalUserDecision: '虛構營運負責人要決定一份虛構文件工作可唔可以只建立畀人覆核嘅補充記錄、保持等待、繼續處理，或交去例外處理。', nonGoal: '唔會更新文件系統、叫模型做嘢、聯絡任何人，亦唔會聲稱每項只會送一次或有任何服務水平結果。', safeDataRoute: '只用虛構文件事件同固定本機結果；登入資料、文件內容、隊列同生產環境處理紀錄都唔入範圍。', baseline: '開始前先定好：每次處理幾多項、點樣防止重做同一項、重試幾多次就停、成本上限，以及例外交畀邊個。', firstEvaluation: '用同一組練習資料，檢查正常完成、逾時或被限速、無法處理嘅輸入、重複工作、中途復原，以及超出預算。', explicitNonclaims: '冇已部署工作程式、即時隊列、供應商行為、模型結果、實際成本、同時處理量、長期儲存或商業結果嘅聲稱。' } },
      'public-data': { label: '先核對公開資料記錄，再畀人覆核', description: '虛構覆核員要決定：公開資料嘅來源記錄同容許欄位係咪齊全，夠唔夠交畀人睇，定係應該拒絕。', brief: { fictionalUserDecision: '虛構覆核員要決定固定公開欄位練習資料同來源記錄可唔可以交畀人睇，定係要標記為來源不合格。', nonGoal: '唔會下載即時資料、配對資產、掃描、修補或開 ticket，亦唔推斷機構風險或期限。', safeDataRoute: '只用清楚標示「未有即時取得」嘅固定練習資料清單同公開欄位容許清單；私人、營運、資產同聯絡資料一律排除。', baseline: '未加任何語言模型層之前，先核對來源記錄、容許欄位、資料格式、新鮮度規則同「不作任何外部動作」嘅約定。', firstEvaluation: '除咗正常資料包，仲要有格式壞咗、過期、有私人欄位、注入內容、要求行動、資產不清同數值必須原樣保留嘅情況。', explicitNonclaims: '冇現時數據、資料同步、安全狀態、修復、合規、模型質素、部署或商業結果嘅聲稱。' } },
      'context-brief': { label: '準備有來源邊界嘅背景說明', description: '虛構研究主管要決定：一份以虛構資料做嘅統計來源記錄夠唔夠完整，可唔可以畀人寫背景說明；唔用來做預測。', brief: { fictionalUserDecision: '虛構人力規劃研究主管要決定：一份以虛構資料做嘅統計來源記錄夠唔夠完整，可以畀人寫背景說明。', nonGoal: '唔會做預測、解釋趨勢、建議招聘或薪酬、提供簽證意見、發佈報告或作外部決定。', safeDataRoute: '用有清楚資料說明嘅虛構每月數列，並標明來源尚未取得；真實僱主、員工、求職者、薪酬同營運資料都唔入範圍。', baseline: '寫背景說明前，先檢查來源記錄係咪齊、必需資料說明、時間次序、新鮮度、私人欄位界線，同埋唔會採取外部動作嘅約定。', firstEvaluation: '要有單位缺漏、期間次序錯亂、來源記錄過期、私人欄位、注入內容同要求預測嘅情況；一見要求預測就交畀人覆核。', explicitNonclaims: '冇即時統計資料、現時勞動市場結論、預測、招聘／薪酬／移民意見、模型結果或已發佈成果嘅聲稱。' } }
    },
    projectHeading: '02 · 檢查個諗法有冇交代清楚',
    projectCountLabel: '想比較幾個不記名項目方向？',
    projectCountHelp: '只用項目 01–03。毋須講公司、產品、模型或項目名，都可以睇到個想法夠唔夠安全、夠唔夠具體，可以唔可以開始。',
    projectCountOptions: { 1: '一個項目', 2: '兩個項目', 3: '三個項目' },
    projectSlot: '項目欄位',
    anonymousHelp: '保持不記名。只揀你可以安全講清楚同測試嘅條件。',
    metricContractHeading: '量度說明',
    metricContractHelp: '比較方向時可以暫時唔填。要話第一星期建議已寫清楚量度方法之前，五格都要用虛構、概括嘅描述寫低。資料只會留喺呢個頁面；只有你主動複製工作說明時先會帶走。',
    metricContractStatus: recorded => `已記低 ${recorded}／5 項量度資料`,
    metricContract: {
      currentWorkaround: { label: '而家點樣處理？', help: '講清楚未有呢個項目前，人手靠乜做法處理。只寫虛構、概括嘅情境。', placeholder: '例如：覆核員逐份用固定清單處理虛構要求。' },
      decisionOwner: { label: '邊個會用結果拍板？', help: '寫角色就夠，唔好寫人名、公司、客戶或團隊。', placeholder: '例如：虛構營運覆核員。' },
      errorConsequence: { label: '做錯會有咩後果？', help: '寫延誤、重做、風險，或者一定要交畀人處理嘅情況；唔好估真實成本。', placeholder: '例如：資料不完整時必須交畀人，避免錯誤排到前面。' },
      metricDefinition: { label: '個指標點樣計？', help: '寫清楚分子、分母、觀察時段同門檻。定義唔等於已經有結果。', placeholder: '例如：分子＝正確分流個案；分母＝每星期 20 個虛構個案；門檻＝最少 18 個。' },
      comparisonBaseline: { label: '同乜嘢做法比較？', help: '寫明現時人手做法或簡單規則，同埋喺邊個時點作比較。', placeholder: '例如：同一批虛構個案，用固定人手清單作比較。' }
    },
    firstRun: {
      heading: '04 · 留低第一次本機檢查紀錄',
      intro: '呢頁唔會幫你執行流程、驗證模型，亦唔會自動產生證據。佢只係畀你手動記低一次用虛構個案做嘅本機檢查。所有內容只留喺而家呢個瀏覽器視窗；重新整理就會清走。',
      statusLabel: '檢查紀錄狀態：',
      projectLabel: '項目欄位：',
      planOnly: 'PLAN ONLY / NOT_RUN：先將項目條件同量度說明寫清楚，之後先做一次本機檢查。',
      notApplicable: '唔適用',
      incompleteStatus: recorded => `RUN NOTE INCOMPLETE：已填 ${recorded}／6 項檢查資料。唔好當做已完成嘅 evaluation。`,
      needsDecisionStatus: 'RUN NOTE INCOMPLETE：六項檢查資料都填咗，但覆核人仲未揀 PASS、REVISE 或 STOP。',
      needsFailureNoteStatus: 'RUN NOTE INCOMPLETE：揀咗 REVISE 或 STOP，就要先寫低原因，呢份本機紀錄先算完整。',
      passStatus: 'LOCAL RUN NOTE / PASS：呢份係你手動填寫嘅本機檢查紀錄，未經獨立核對，亦唔代表有商業成效。',
      reviseStatus: 'LOCAL RUN NOTE / REVISE：保留失敗情況，修改之後先再做檢查；唔好寫成已通過。',
      stopStatus: 'LOCAL RUN NOTE / STOP：寫低停止界線，唔好用佢作已通過嘅作品集聲稱；交返畀人或者縮細練習範圍。',
      details: {
        caseIds: { label: '檢查咗邊啲虛構個案 ID？', help: '只寫安全練習資料 ID，唔好寫客戶、員工、ticket、文件或任何真實識別資料。', placeholder: '例如：request-02、request-06、request-09。' },
        expectedRoute: { label: '原本預期點樣處理？', help: '寫低預期嘅安全去向，包括需要時嘅覆核、停止或交接。', placeholder: '例如：資料不完整就交畀人覆核；唔會產生草稿。' },
        actualRoute: { label: '實際發生咗乜？', help: '寫低本機檢查見到嘅處理去向，包括同預期唔同嘅結果。', placeholder: '例如：request-06 入咗草稿流程，冇交畀人覆核。' },
        baselineMeasure: { label: '人手對照做法結果係點？', help: '用同一批虛構個案，記低簡單人手規則或上一版嘅結果。', placeholder: '例如：固定清單有 5／6 個個案按預期處理。' },
        candidateMeasure: { label: '而家呢個版本結果係點？', help: '用同一個定義記低結果；唔好由此推斷商業影響。', placeholder: '例如：而家版本有 4／6 個個案按預期處理。' },
        repeatableSteps: { label: '其他人點樣重做呢個檢查？', help: '寫低簡短手動步驟、練習資料版本或指令；唔好貼登入資料或私人路徑。', placeholder: '例如：開 fixture v0.1，用固定清單檢查，再比較六個處理去向。' }
      },
      reviewerDecision: {
        label: '覆核人對今次本機檢查嘅決定',
        help: 'PASS 只代表呢個有範圍嘅檢查符合自己定嘅規則。REVISE 同 STOP 要喺下面寫原因。三個選項都唔代表已證明生產環境或商業結果。',
        options: { unknown: '檢查後先揀', pass: 'PASS — 呢次有範圍嘅本機檢查符合定好嘅規則', revise: 'REVISE — 有結果或界線要修改', stop: 'STOP — 呢個版本唔好再繼續' }
      },
      failureNote: { label: '點解要修改或者停止？', help: 'REVISE 或 STOP 必填。寫低失敗個案、下一位安全負責人，或者應該縮細嘅界線；保持虛構同不記名。', placeholder: '例如：request-06 繞過咗人手覆核；先交返覆核員，再修正分流規則。' }
    },
    fields: {
      decision: { label: '要作咩決定？邊個拍板？', help: '你講唔講到虛構決定、邊個拍板，同埋輸出會改變乜？' },
      signal: { label: '點樣知道有冇幫助', help: '用人手對照做法同安全限制去量度流程結果。模型分數只可以做其中一部分。' },
      data: { label: '資料同權限界線', help: '容許用、唔容許用、虛構資料，以及邊個負責輸入，係咪都寫清楚？' },
      evaluation: { label: '點樣檢查', help: '其他人可唔可以跟住人手對照做法，檢查預期成功、出錯同交畀人嘅情況？' },
      operations: { label: '覆核同出事後點處理', help: '有冇覆核、處理紀錄、退返上一版嘅方法，或者清楚交返畀人嘅位置？' },
      nonclaims: { label: '暫時唔可以聲稱乜', help: 'README 有冇寫明未建立、未證實、未連接或未聲稱嘅內容？' }
    },
    options: {
      decision: [{ value: 'unknown', label: '未定義' }, { value: 'tool-first', label: '由工具或模型開始，未講清楚個決定' }, { value: 'fictional-decision', label: '有虛構決定，但邊個拍板同輸出會改變乜仲未清楚' }, { value: 'decision-owner', label: '虛構決定、邊個拍板同輸出會改變乜都清楚' }],
      signal: [{ value: 'unknown', label: '未定義' }, { value: 'model-only', label: '只講模型或提示詞分數' }, { value: 'workflow-signal', label: '有流程結果，但冇人手對照做法或安全限制' }, { value: 'baseline-guardrail', label: '流程結果、人手對照做法同安全限制都寫清楚' }],
      data: [{ value: 'unknown', label: '未定義' }, { value: 'unbounded', label: '資料來源或權限界線唔清楚' }, { value: 'synthetic', label: '講咗虛構或公開且安全嘅資料，但限制未齊' }, { value: 'boundary-owner', label: '容許／禁止資料、安全做法同負責人都清楚' }],
      evaluation: [{ value: 'unknown', label: '未定義' }, { value: 'demo-only', label: '只睇過一次順暢示範' }, { value: 'cases', label: '有少量測試情況，但人手對照做法或預期點處理仍含糊' }, { value: 'baseline-cases', label: '人手對照做法，加預期成功、出錯同交畀人嘅情況都清楚' }],
      operations: [{ value: 'unknown', label: '未定義' }, { value: 'none', label: '睇唔到覆核、處理紀錄、回退方法或交畀人嘅出口' }, { value: 'review', label: '有人覆核或交接，但範圍仲未講清' }, { value: 'review-rollback', label: '覆核或交接、處理紀錄，同回退或停止界線都寫清楚' }],
      nonclaims: [{ value: 'unknown', label: '未定義' }, { value: 'claims', label: '暗示可以入職、有商業結果、已可用於生產，或模型表現好' }, { value: 'partial', label: '寫咗少量範圍限制，但聲稱同界線未齊' }, { value: 'explicit', label: 'README 清楚寫明未建立、未連接、未證實或未聲稱嘅內容' }]
    },
    scoreLabel: '規劃完整度',
    scoreHelp: '呢個本機檢查表滿分 12 分。就算 12／12，都只代表六項項目條件寫咗出嚟；唔代表已定義、觀察到，或者改善咗任何商業指標。',
    decisionHeading: '03 · 決定開始定暫停',
    suggestedProject: '建議項目',
    suggestedDecision: '建議決定',
    suggestedStop: '以下情況未處理好，就唔好開始：',
    noProject: '暫時未有可以開始嘅項目',
    readyDecision: '呢個項目可以寫第一星期工作說明。繼續用虛構資料，保留人手覆核同回退方法；記低咗嘅量度方法只係定義，未係已證實嘅商業結果。',
    needsMeasurementDecision: '呢個項目可以用作探索練習，但量度資料仲未齊。未可以將它講成已寫清楚量度方法嘅商業案例，更唔可以講已有商業結果。',
    pauseDecision: '先停喺度。分數最高嗰個項目仲有條件未講清；補返以下缺口，再決定係咪加自動化、模型、系統整合或介面。',
    weekHeading: '你嘅第一星期工作說明',
    projectReceipt: '你揀咗嘅條件',
    receiptProject: '比較欄位',
    receiptRoute: '練習類型',
    receiptSignal: '而家檢查結果',
    receiptInputs: '已揀條件',
    receiptMetricContract: '量度說明',
    notRecorded: '未記低',
    missingMeasurementDetails: '仲要補嘅量度資料',
    noOpenGaps: '五項量度資料都已記低。呢啲只係日後點樣量度嘅定義，唔係已證實嘅結果。',
    fictionalUserDecision: '虛構情境同決定',
    nonGoal: '唔做嘅事',
    safeDataRoute: '可安全使用嘅資料',
    baseline: '人手對照做法',
    firstEvaluation: '第一次檢查',
    explicitNonclaims: '呢份說明暫時證明唔到乜',
    floorHeading: '動手前仲欠乜',
    floorText: '六項項目檢查講清楚，已經足夠安全噉探索一個方向。要話第一星期建議已寫清楚量度方法，仲要記低五樣嘢：而家人手點做、邊個用結果拍板、做錯嘅後果、指標嘅分子／分母／觀察時段／門檻，同埋人手對照做法。分數高，補唔返漏咗嘅安全、責任或量度資料。',
    copyBrief: '複製第一星期工作說明',
    copyBriefHelp: '會將 Markdown 大綱複製到你部裝置嘅剪貼簿；唔會儲存、傳送，亦唔會加到任何個人檔案。',
    copyBriefSuccess: '已複製。可以貼到私人筆記、issue 或 README 草稿。',
    copyBriefError: '瀏覽器唔畀複製。請手動選取上面嘅內容再複製。',
    projectLabel: projectName('項目'),
    stopReasons: { decision: '虛構決定、邊個拍板或輸出會改變乜仍未清楚', signal: '流程結果未有人手對照做法同安全限制', data: '容許／禁止資料、安全做法或負責人未清楚', evaluation: '人手對照做法，加成功、出錯同交畀人嘅情況仍未可檢查', operations: '覆核或交接、處理紀錄同回退／停止界線未清楚', nonclaims: 'README 未清楚寫明未建立、未連接、未證實或未聲稱嘅內容' }
  },
  'zh-TW': {
    eyebrow: '作品集證據規劃器',
    title: '用一週，把作品集想法寫成第一份工作說明',
    intro: '選最多三個不記名專案方向，逐個看六件實在的事：誰要拍板、怎樣知道工作有幫助、能用哪些資料、怎麼測試、出錯後誰接手，以及暫時不能聲稱什麼。最後你會有一份小而可以改的第一週說明；它不會替你的能力打分，也不保證求職或商業結果。',
    privacy: '僅在本機運作：沒有帳戶、追蹤、網路請求或資料傳送。除非你在下方主動選擇「記住」，否則不會儲存；選擇後也只會留在這個瀏覽器。所有衡量筆記只寫虛構和概括內容；不要輸入雇主、客戶、產品、個人、內部資料或真實商業數字。',
    jumpToComparison: '從 15 分鐘起步卡開始',
    readWorkedExamples: '看三個完整案例',
    exploreExamples: '看看其他實作案例',
    workedExamplesEyebrow: '完整案例',
    workedExamplesHeading: '看三個完整案例',
    workedExamplesIntro: '三個例子把決定、可用資料、人工對照做法、檢查、覆核與限制放在一起。你可以先寫第一週說明，再用它們校對；開始前，也可以用來選方向。',
    routeHeading: '01 · 選一件可以安全練習的事',
    routeLabel: '你想幫誰釐清哪個決定？',
    routeHelp: '先從決定與要拍板的人開始，不要從模型或工具開始。以下六條路線只用虛構人物與固定練習資料；每個專案欄位選一條。',
    shapes: {
      approval: { label: '準備供人批核的草稿', description: '一位虛構 operations reviewer 決定 synthetic request 應該成為草稿、交給人，或被封鎖。', brief: { fictionalUserDecision: '一位虛構 operations reviewer 決定 synthetic request 是否能成為等待人工批核的草稿。', nonGoal: '不要發送訊息、改 ticket、批核 request，也不要宣稱草稿正確。', safeDataRoute: '僅使用小型 synthetic FAQ 與虛構 request；禁止個人、客戶、雇主與 credential 資料。', baseline: '和透明的人工 checklist 比較：支援 request、不支援 request、禁止輸入與必須人工 review。', firstEvaluation: '在查看輸出前，先寫一個暫時不會聲稱已有結果的 business measure、一個會阻止 release 的 guardrail，以及一個預期 draft-for-review case 與 handoff case。', explicitNonclaims: '沒有 live API call、外部 action、客戶結果、準確率聲稱或 production-ready 聲稱。' } },
      triage: { label: '排列人工 review 隊列優先順序', description: '一位虛構 team lead 用清楚的 baseline 與 guardrail，決定哪些 synthetic case 應先交給人看。', brief: { fictionalUserDecision: '一位虛構 team lead 決定哪些 synthetic case 放在人工 review 隊列前面。', nonGoal: '不要自動做 eligibility、定價、retention、招聘或其他重要決定。', safeDataRoute: '只使用刻意很小、帶虛構 label 與欄位的 synthetic table；不要複製 spreadsheet、CRM 或工作匯出檔。', baseline: '先用透明 rule-based 排序，並為缺漏或禁止資料設定 guardrail。', firstEvaluation: '做一個應該優先的 case，與一個資料不完整、必須交給人的 case。', explicitNonclaims: '不宣稱 uplift、節省、公平、model quality、商業影響，也不使用真實客戶資料。' } },
      draft: { label: '準備有範圍的內部草稿', description: '一位虛構 programme coordinator 決定 synthetic note 能否從允許材料生成草稿，或必須留給人。', brief: { fictionalUserDecision: '一位虛構 programme coordinator 決定一份允許的 synthetic note 是否能先成為供人修改的草稿。', nonGoal: '不要發佈、聯絡任何人、在另一個系統建立記錄，也不要把草稿當成已核准答案。', safeDataRoute: '只用兩段 synthetic source note 與一個禁止輸入範例；真實 file、inbox 與帳戶不在範圍內。', baseline: '先使用人工 template 與 acceptance checklist，再比較任何 AI 輔助草稿。', firstEvaluation: '檢查一個 allowed-note case 與一個禁止輸入 case；後者必須停在人工 review。', explicitNonclaims: '沒有 autonomous workflow、供應商比較、生產力聲稱、機密資料使用或 deployed system 聲稱。' } },
      reliability: { label: '讓 batch workflow 可以安全復原', description: '一位虛構 operations owner 決定 synthetic document task 應保持 pending、從 checkpoint resume，或進入 dead-letter review，同時不重複處理已完成 version。', brief: { fictionalUserDecision: '一位虛構 operations owner 決定 synthetic document task 能否建立 human-review-only enrichment record、保持 pending、resume，或轉進 dead-letter review。', nonGoal: '不要更新 document system、call model、聯絡任何人、聲稱 exactly-once delivery 或 service-level 結果。', safeDataRoute: '只用虛構 document event 與固定 local outcome；credential、document text、queue 與 production trace 不在範圍內。', baseline: '在加入 candidate change 前，先定義 serial queue limit、terminal idempotency key、retry category、固定 cost stop 與人工 dead-letter route。', firstEvaluation: '要有 success、timeout 或 429、permanent bad input、duplicate、checkpoint-resume 與 budget-stop case；以同一份 fixture 比較一項 policy change。', explicitNonclaims: '沒有 deployed worker、live queue、provider behaviour、model result、實際 cost、concurrency、durable storage 或商業結果聲稱。' } },
      'public-data': { label: '先核對公開資料 receipt，再交給人 review', description: '一位虛構 assurance reviewer 決定 source receipt 與允許的 public field 是否完整到可做 no-action evidence packet，否則必須 reject。', brief: { fictionalUserDecision: '一位虛構 assurance reviewer 決定固定 public-field teaching record 與 source receipt 能否變成 no-action evidence packet，否則必須 SOURCE_REJECTED。', nonGoal: '不要 download live feed、match asset、scan、patch、開 ticket，也不要推斷機構 exposure 或 deadline。', safeDataRoute: '只用標明 not-live-acquired 的 fixed fixture manifest 與 public-field allowlist；private、operational、asset 與 contact data 全部排除。', baseline: '在加入任何 optional language layer 前，先驗證 source receipt、允許 field、schema、freshness rule 與空白 action authority。', firstEvaluation: '除了 normal packet，要有 malformed、stale、private-field、injection、action-request、ambiguous-asset 與 exact-value-preservation case。', explicitNonclaims: '沒有 current-data、source-sync、security posture、remediation、compliance、model-quality、deployment 或商業結果聲稱。' } },
      'context-brief': { label: '準備有來源邊界的 context brief', description: '一位虛構 research lead 決定 source-shaped synthetic statistics receipt 是否完整到可供人寫 context brief，而不是做 forecast。', brief: { fictionalUserDecision: '一位虛構 workforce-planning research lead 決定 source-shaped synthetic statistics receipt 是否完整到可供人寫 context brief。', nonGoal: '不要 forecast、解釋 trend、建議招聘或薪酬、提供簽證意見、發佈 report 或作外部決定。', safeDataRoute: '使用有清楚 metadata 的 synthetic monthly series，並將 source route 標示為 not acquired；真實雇主、員工、求職者、薪酬與 operational data 不在範圍內。', baseline: '寫 narrative 前，先檢查 receipt 完整度、required metadata、time order、freshness、private-field boundary 與 no-action contract。', firstEvaluation: '要有 missing-unit、unordered-period、stale-receipt、private-field、injection 與 forecast-request case；forecast request 必須停在 human review。', explicitNonclaims: '沒有 live statistics acquisition、current labour-market claim、forecast、招聘或薪酬意見、migration 意見、model result 或 published outcome 聲稱。' } }
    },
    projectHeading: '02 · 把這個想法講清楚',
    projectCountLabel: '想比較幾個不記名專案方向？',
    projectCountHelp: '只用項目 01–03。不需要說出公司、產品、模型或專案名，也看得出這個想法安不安全、夠不夠具體去開始。',
    projectCountOptions: { 1: '一個項目', 2: '兩個項目', 3: '三個項目' },
    projectSlot: '項目欄位',
    anonymousHelp: '保持不記名。只選擇可以安全說明與測試的條件。',
    metricContractHeading: '衡量說明',
    metricContractHelp: '比較方向時可以先留白。要說第一週建議已寫清楚衡量方法前，五格都要以虛構、概括的描述寫下來。資料只留在這一頁；只有你主動複製工作說明時才會帶走。',
    metricContractStatus: recorded => `已記下 ${recorded}／5 項衡量資料`,
    metricContract: {
      currentWorkaround: { label: '現在怎麼處理？', help: '說明還沒有這個專案前，人靠什麼做法處理。只寫虛構、概括的情境。', placeholder: '例如：覆核人員逐份依固定清單處理虛構要求。' },
      decisionOwner: { label: '誰會用結果拍板？', help: '寫角色即可，不要寫人名、公司、客戶或團隊。', placeholder: '例如：虛構營運覆核人員。' },
      errorConsequence: { label: '判錯會有什麼後果？', help: '寫延誤、重做、風險，或必須交給人處理的情境；不要推估真實成本。', placeholder: '例如：資料不完整時必須交給人，避免錯誤排到前面。' },
      metricDefinition: { label: '指標怎麼計？', help: '寫清楚分子、分母、觀察期間和門檻。定義不等於已經有結果。', placeholder: '例如：分子＝正確分流個案；分母＝每週 20 個虛構個案；門檻＝至少 18 個。' },
      comparisonBaseline: { label: '和什麼做法比較？', help: '寫明現在的人工作法或簡單規則，以及在哪個時間點比較。', placeholder: '例如：同一批虛構個案，與固定人工清單比較。' }
    },
    firstRun: {
      heading: '04 · 留下第一次本機檢查紀錄',
      intro: '這一頁不會替你執行流程、驗證模型，也不會自動產生證據。它只是讓你手動記下一次用虛構個案做的本機檢查。所有內容只留在目前的瀏覽器視窗；重新整理就會清除。',
      statusLabel: '檢查紀錄狀態：',
      projectLabel: '項目欄位：',
      planOnly: 'PLAN ONLY / NOT_RUN：先把項目條件與衡量說明寫清楚，再做一次本機檢查。',
      notApplicable: '不適用',
      incompleteStatus: recorded => `RUN NOTE INCOMPLETE：已填 ${recorded}／6 項檢查資料。不要把它當成已完成的 evaluation。`,
      needsDecisionStatus: 'RUN NOTE INCOMPLETE：六項檢查資料都填了，但覆核人還沒選 PASS、REVISE 或 STOP。',
      needsFailureNoteStatus: 'RUN NOTE INCOMPLETE：選了 REVISE 或 STOP，就要先寫下原因，這份本機紀錄才算完整。',
      passStatus: 'LOCAL RUN NOTE / PASS：這是你手動填寫的本機檢查紀錄，未經獨立核對，也不代表已有商業成效。',
      reviseStatus: 'LOCAL RUN NOTE / REVISE：保留失敗情況，修改後再檢查；不要寫成已通過。',
      stopStatus: 'LOCAL RUN NOTE / STOP：寫下停止界線，不要把它當成已通過的作品集聲稱；交回給人或縮小練習範圍。',
      details: {
        caseIds: { label: '檢查了哪些虛構個案 ID？', help: '只寫安全練習資料 ID，不要寫客戶、員工、ticket、文件或任何真實識別資料。', placeholder: '例如：request-02、request-06、request-09。' },
        expectedRoute: { label: '原本預期怎麼處理？', help: '寫下預期的安全去向，包括需要時的覆核、停止或交接。', placeholder: '例如：資料不完整就交給人工覆核；不會產生草稿。' },
        actualRoute: { label: '實際發生了什麼？', help: '寫下本機檢查看到的處理去向，包括與預期不同的結果。', placeholder: '例如：request-06 進入草稿流程，沒有交給人工覆核。' },
        baselineMeasure: { label: '人工對照做法結果如何？', help: '用同一批虛構個案，記下簡單人工規則或上一版的結果。', placeholder: '例如：固定清單有 5／6 個個案按預期處理。' },
        candidateMeasure: { label: '目前版本結果如何？', help: '用同一個定義記下結果；不要由此推論商業影響。', placeholder: '例如：目前版本有 4／6 個個案按預期處理。' },
        repeatableSteps: { label: '其他人怎麼重做這個檢查？', help: '寫下簡短手動步驟、練習資料版本或指令；不要貼登入資料或私人路徑。', placeholder: '例如：開啟 fixture v0.1，用固定清單檢查，再比較六個處理去向。' }
      },
      reviewerDecision: {
        label: '覆核人對這次本機檢查的決定',
        help: 'PASS 只代表這個有範圍的檢查符合自己定下的規則。REVISE 與 STOP 要在下面寫原因。三個選項都不代表已證明正式環境或商業結果。',
        options: { unknown: '檢查後再選', pass: 'PASS — 這次有範圍的本機檢查符合定下的規則', revise: 'REVISE — 有結果或邊界需要修改', stop: 'STOP — 這個版本不要再繼續' }
      },
      failureNote: { label: '為什麼要修改或停止？', help: 'REVISE 或 STOP 必填。寫下失敗個案、下一位安全負責人，或應該縮小的界線；保持虛構與不記名。', placeholder: '例如：request-06 繞過人工覆核；先交回覆核人員，再修正分流規則。' }
    },
    fields: {
      decision: { label: '要做的決定與誰拍板', help: '能否說明虛構決定、誰拍板，以及輸出會改變什麼？' },
      signal: { label: '怎樣知道工作有幫助', help: '能否用一個對照做法與安全界線衡量流程結果，而不是只說 model 分數？' },
      data: { label: '資料與權限邊界', help: '允許、禁止、synthetic 與人工擁有的輸入是否清楚？' },
      evaluation: { label: '怎樣檢查結果', help: '其他人能否按照對照做法，檢查預期成功、出錯與交回人處理的情況？' },
      operations: { label: '覆核與出事後怎麼處理', help: '是否有覆核、處理紀錄、退回上一版的方法，或清楚交回人處理的位置？' },
      nonclaims: { label: '暫時不能聲稱的結果', help: 'README 是否寫明尚未建立、尚未證實、尚未連接或尚未聲稱的事？' }
    },
    options: {
      decision: [{ value: 'unknown', label: '尚未定義' }, { value: 'tool-first', label: '從工具或模型開始，還沒說清要作什麼決定' }, { value: 'fictional-decision', label: '有要作的決定，但誰拍板、結果會改變什麼仍不清楚' }, { value: 'decision-owner', label: '要作的決定、誰拍板和結果會改變什麼都清楚' }],
      signal: [{ value: 'unknown', label: '尚未定義' }, { value: 'model-only', label: '只說模型或提示詞分數' }, { value: 'workflow-signal', label: '有流程結果的指標，但沒有清楚的對照做法或安全底線' }, { value: 'baseline-guardrail', label: '流程結果、對照做法和安全底線都寫清楚' }],
      data: [{ value: 'unknown', label: '尚未定義' }, { value: 'unbounded', label: '資料來源或權限邊界不清楚' }, { value: 'synthetic', label: '提到虛構或可公開使用的資料，但限制不完整' }, { value: 'boundary-owner', label: '允許／禁止的資料、安全做法和負責人都清楚' }],
      evaluation: [{ value: 'unknown', label: '尚未定義' }, { value: 'demo-only', label: '只看過一次順利示範' }, { value: 'cases', label: '有一些測試情境，但對照做法或預期處理方式模糊' }, { value: 'baseline-cases', label: '對照做法，加上預期成功、失敗和交給人處理的情境都清楚' }],
      operations: [{ value: 'unknown', label: '尚未定義' }, { value: 'none', label: '看不到覆核、處理紀錄、回退方法或交給人處理的位置' }, { value: 'review', label: '有人覆核或交接，但範圍仍模糊' }, { value: 'review-rollback', label: '覆核或交接、處理紀錄，以及回退或停止界線都清楚' }],
      nonclaims: [{ value: 'unknown', label: '尚未定義' }, { value: 'claims', label: '暗示求職、商業、正式環境或模型品質的結果' }, { value: 'partial', label: '寫了少量範圍限制，但聲稱與邊界不完整' }, { value: 'explicit', label: 'README 清楚寫明尚未建立、尚未連接、尚未證實或尚未聲稱的事' }]
    },
    scoreLabel: '規劃完整度',
    scoreHelp: '這份本機檢查表滿分 12 分。即使是 12／12，也只代表六項專案條件已寫出來；不代表任何商業指標已定義、觀察到或改善。',
    decisionHeading: '03 · 決定開始或暫停',
    suggestedProject: '建議項目',
    suggestedDecision: '建議決定',
    suggestedStop: '先停止，不要開始建的情況：',
    noProject: '暫時還沒有可以開始的項目',
    readyDecision: '為這個項目欄位開始一份有範圍的第一週 brief。保持 synthetic、可 review 與可逆；已記下的衡量方法只是定義，不是已證實的商業結果。',
    needsMeasurementDecision: '這個項目可以當作探索練習，但衡量資料還沒寫齊。不要把它呈現成已寫清楚衡量方法的商業案例，更不能聲稱已有商業結果。',
    pauseDecision: '先停在這裡。條件還沒寫完整；補上這些缺口，再決定是否加入自動化、模型、系統串接或介面。',
    weekHeading: '你的第一週項目 brief',
    projectReceipt: '你選的條件',
    receiptProject: '比較欄位',
    receiptRoute: '虛構項目形狀',
    receiptSignal: '目前訊號',
    receiptInputs: '已選條件',
    receiptMetricContract: '衡量說明',
    notRecorded: '尚未記下',
    missingMeasurementDetails: '還要補的衡量資料',
    noOpenGaps: '五項衡量資料都已記下。它們只是在說日後怎麼衡量，不是已證實的結果。',
    fictionalUserDecision: '虛構使用者與決定',
    nonGoal: '非目標',
    safeDataRoute: '安全資料路線',
    baseline: 'Baseline',
    firstEvaluation: '第一個檢查',
    explicitNonclaims: '它暫時證明不了什麼',
    floorHeading: '動手前還缺什麼',
    floorText: '六項專案檢查說清楚，就足夠安全地探索一個方向。要說第一週建議已寫清楚衡量方法，還要記下五件事：現在的人工作法、誰用結果拍板、判錯的後果、指標的分子／分母／觀察期間／門檻，以及人工對照做法。分數高，補不回遺漏的安全、責任或衡量資料。',
    copyBrief: '複製這份第一週 brief',
    copyBriefHelp: '會將 Markdown 大綱複製到你的裝置剪貼簿；不會儲存、傳送或加入任何 profile。',
    copyBriefSuccess: '已複製 brief。可貼到私人筆記、issue 或 README 草稿。',
    copyBriefError: '瀏覽器未允許複製。請手動選取 evidence receipt 再複製。',
    projectLabel: projectName('項目'),
    stopReasons: { decision: '要作的決定、誰拍板或結果會改變什麼還不清楚', signal: '流程結果還沒有清楚的對照做法和安全底線', data: '允許／禁止的資料、安全做法或負責人還不清楚', evaluation: '對照做法，加上成功、失敗和交給人處理的情境還不可檢查', operations: '覆核或交接、處理紀錄與回退／停止界線還不清楚', nonclaims: 'README 尚未清楚寫明未建立、未連接、未證實或未聲稱的事' }
  },
  'zh-Hans': {
    eyebrow: '作品集证据规划器',
    title: '用一周，把作品集想法写成第一份工作说明',
    intro: '选最多三个不记名项目方向，逐个看六件实在的事：谁要拍板、怎样知道工作有帮助、能用哪些数据、怎样测试、出错后谁接手，以及暂时不能声称什么。最后你会有一份小而可以改的第一周说明；它不会替你的能力打分，也不保证求职或商业结果。',
    privacy: '仅在本机运行：没有账户、跟踪、网络请求或数据传送。除非你在下方主动选择“记住”，否则不会存储；选择后也只会留在这个浏览器。所有衡量笔记只写虚构和概括内容；不要输入雇主、客户、产品、个人、内部资料或真实商业数字。',
    jumpToComparison: '从 15 分钟起步卡开始',
    readWorkedExamples: '看三个完整案例',
    exploreExamples: '看看其他实作案例',
    workedExamplesEyebrow: '完整案例',
    workedExamplesHeading: '看三个完整案例',
    workedExamplesIntro: '三个例子把决策、可用数据、人工对照做法、检查、复核与限制放在一起。你可以先写第一周说明，再用它们校对；开始前，也可以用来选方向。',
    routeHeading: '01 · 选一件可以安全练习的事',
    routeLabel: '你想帮谁厘清哪个决策？',
    routeHelp: '先从决策与要拍板的人开始，不要从模型或工具开始。以下六条路线只用虚构人物与固定练习数据；每个项目栏位选一条。',
    shapes: {
      approval: { label: '准备供人批准的草稿', description: '一位虚构 operations reviewer 决定 synthetic request 应成为草稿、交给人，还是被拦截。', brief: { fictionalUserDecision: '一位虚构 operations reviewer 决定 synthetic request 是否能成为等待人工批准的草稿。', nonGoal: '不要发送消息、改 ticket、批准 request，也不要宣称草稿正确。', safeDataRoute: '仅使用小型 synthetic FAQ 和虚构 request；禁止个人、客户、雇主和 credential 数据。', baseline: '和透明的人工 checklist 比较：支持 request、不支持 request、禁止输入和必须人工 review。', firstEvaluation: '在检查输出前，先写一个暂时不声称已有结果的 business measure、一个会阻止 release 的 guardrail，以及一个预期 draft-for-review case 和 handoff case。', explicitNonclaims: '没有 live API call、外部 action、客户结果、准确率声明或 production-ready 声明。' } },
      triage: { label: '排列人工 review 队列优先级', description: '一位虚构 team lead 用清楚的 baseline 和 guardrail，决定哪些 synthetic case 应先交给人看。', brief: { fictionalUserDecision: '一位虚构 team lead 决定哪些 synthetic case 放在人工 review 队列前面。', nonGoal: '不要自动做 eligibility、定价、retention、招聘或其他重要决策。', safeDataRoute: '仅使用刻意很小、带虚构 label 和字段的 synthetic table；不要复制 spreadsheet、CRM 或工作导出文件。', baseline: '先用透明 rule-based 排序，并为缺失或禁止数据设置 guardrail。', firstEvaluation: '做一个应该优先的 case，和一个数据不完整、必须交给人的 case。', explicitNonclaims: '不声明 uplift、节省、公平、model quality、商业影响，也不使用真实客户数据。' } },
      draft: { label: '准备有范围的内部草稿', description: '一位虚构 programme coordinator 决定 synthetic note 能否从允许材料生成草稿，或必须留给人。', brief: { fictionalUserDecision: '一位虚构 programme coordinator 决定一份允许的 synthetic note 是否能先成为供人修改的草稿。', nonGoal: '不要发布、联系任何人、在另一个系统建立记录，也不要把草稿当成已批准答案。', safeDataRoute: '仅用两段 synthetic source note 和一个禁止输入示例；真实 file、inbox 和账户不在范围内。', baseline: '先使用人工 template 和 acceptance checklist，再比较任何 AI 辅助草稿。', firstEvaluation: '检查一个 allowed-note case 和一个禁止输入 case；后者必须停在人工 review。', explicitNonclaims: '没有 autonomous workflow、供应商比较、生产力声明、机密数据使用或 deployed system 声明。' } },
      reliability: { label: '让 batch workflow 可以安全复原', description: '一位虚构 operations owner 决定 synthetic document task 应保持 pending、从 checkpoint resume，还是进入 dead-letter review，同时不重复处理已完成 version。', brief: { fictionalUserDecision: '一位虚构 operations owner 决定 synthetic document task 能否建立 human-review-only enrichment record、保持 pending、resume，或转入 dead-letter review。', nonGoal: '不要更新 document system、call model、联系任何人、声称 exactly-once delivery 或 service-level 结果。', safeDataRoute: '仅用虚构 document event 和固定 local outcome；credential、document text、queue 和 production trace 不在范围内。', baseline: '在加入 candidate change 前，先定义 serial queue limit、terminal idempotency key、retry category、固定 cost stop 和人工 dead-letter route。', firstEvaluation: '要有 success、timeout 或 429、permanent bad input、duplicate、checkpoint-resume 和 budget-stop case；以同一份 fixture 比较一项 policy change。', explicitNonclaims: '没有 deployed worker、live queue、provider behaviour、model result、实际 cost、concurrency、durable storage 或商业结果声明。' } },
      'public-data': { label: '先核对公开数据 receipt，再交给人 review', description: '一位虚构 assurance reviewer 决定 source receipt 与允许的 public field 是否完整到可做 no-action evidence packet，否则必须 reject。', brief: { fictionalUserDecision: '一位虚构 assurance reviewer 决定固定 public-field teaching record 与 source receipt 能否变成 no-action evidence packet，否则必须 SOURCE_REJECTED。', nonGoal: '不要 download live feed、match asset、scan、patch、开 ticket，也不要推断机构 exposure 或 deadline。', safeDataRoute: '只用标明 not-live-acquired 的 fixed fixture manifest 与 public-field allowlist；private、operational、asset 和 contact data 全部排除。', baseline: '在加入任何 optional language layer 前，先验证 source receipt、允许 field、schema、freshness rule 与空白 action authority。', firstEvaluation: '除 normal packet 外，要有 malformed、stale、private-field、injection、action-request、ambiguous-asset 与 exact-value-preservation case。', explicitNonclaims: '没有 current-data、source-sync、security posture、remediation、compliance、model-quality、deployment 或商业结果声明。' } },
      'context-brief': { label: '准备有来源边界的 context brief', description: '一位虚构 research lead 决定 source-shaped synthetic statistics receipt 是否完整到可供人写 context brief，而不是做 forecast。', brief: { fictionalUserDecision: '一位虚构 workforce-planning research lead 决定 source-shaped synthetic statistics receipt 是否完整到可供人写 context brief。', nonGoal: '不要 forecast、解释 trend、建议招聘或薪酬、提供签证意见、发布 report 或作外部决策。', safeDataRoute: '使用有清楚 metadata 的 synthetic monthly series，并将 source route 标示为 not acquired；真实雇主、员工、求职者、薪酬与 operational data 不在范围内。', baseline: '写 narrative 前，先检查 receipt 完整度、required metadata、time order、freshness、private-field boundary 与 no-action contract。', firstEvaluation: '要有 missing-unit、unordered-period、stale-receipt、private-field、injection 与 forecast-request case；forecast request 必须停在 human review。', explicitNonclaims: '没有 live statistics acquisition、current labour-market claim、forecast、招聘或薪酬意见、migration 意见、model result 或 published outcome 声明。' } }
    },
    projectHeading: '02 · 把这个想法讲清楚',
    projectCountLabel: '想比较几个不记名项目方向？',
    projectCountHelp: '只用项目 01–03。不需要说出公司、产品、模型或项目名，也看得出这个想法安不安全、够不够具体去开始。',
    projectCountOptions: { 1: '一个项目', 2: '两个项目', 3: '三个项目' },
    projectSlot: '项目栏位',
    anonymousHelp: '保持不记名。只选择可以安全说明和测试的条件。',
    metricContractHeading: '衡量说明',
    metricContractHelp: '比较方向时可以先留白。要说第一周建议已写清楚衡量方法前，五格都要用虚构、概括的描述写下来。资料只留在这一页；只有你主动复制工作说明时才会带走。',
    metricContractStatus: recorded => `已记下 ${recorded}／5 项衡量资料`,
    metricContract: {
      currentWorkaround: { label: '现在怎么处理？', help: '说明还没有这个项目时，人靠什么做法处理。只写虚构、概括的情境。', placeholder: '例如：审核人员逐份按固定清单处理虚构要求。' },
      decisionOwner: { label: '谁会用结果拍板？', help: '写角色即可，不要写人名、公司、客户或团队。', placeholder: '例如：虚构运营审核人员。' },
      errorConsequence: { label: '判错会有什么后果？', help: '写延误、返工、风险，或必须交给人处理的情境；不要估算真实成本。', placeholder: '例如：资料不完整时必须交给人，避免错误排到前面。' },
      metricDefinition: { label: '指标怎么计算？', help: '写清楚分子、分母、观察期间和门槛。定义不等于已经有结果。', placeholder: '例如：分子＝正确分流个案；分母＝每周 20 个虚构个案；门槛＝至少 18 个。' },
      comparisonBaseline: { label: '和什么做法比较？', help: '写明现在的人工做法或简单规则，以及在哪个时间点比较。', placeholder: '例如：同一批虚构个案，与固定人工清单比较。' }
    },
    firstRun: {
      heading: '04 · 留下第一次本机检查记录',
      intro: '这一页不会替你执行流程、验证模型，也不会自动产生证据。它只是让你手动记下一次用虚构个案做的本机检查。所有内容只留在当前浏览器窗口；刷新页面就会清除。',
      statusLabel: '检查记录状态：',
      projectLabel: '项目栏位：',
      planOnly: 'PLAN ONLY / NOT_RUN：先把项目条件与衡量说明写清楚，再做一次本机检查。',
      notApplicable: '不适用',
      incompleteStatus: recorded => `RUN NOTE INCOMPLETE：已填 ${recorded}／6 项检查资料。不要把它当成已完成的 evaluation。`,
      needsDecisionStatus: 'RUN NOTE INCOMPLETE：六项检查资料都填了，但复核人还没选 PASS、REVISE 或 STOP。',
      needsFailureNoteStatus: 'RUN NOTE INCOMPLETE：选了 REVISE 或 STOP，就要先写下原因，这份本机记录才算完整。',
      passStatus: 'LOCAL RUN NOTE / PASS：这是你手动填写的本机检查记录，未经独立核对，也不代表已有商业成效。',
      reviseStatus: 'LOCAL RUN NOTE / REVISE：保留失败情况，修改后再检查；不要写成已通过。',
      stopStatus: 'LOCAL RUN NOTE / STOP：写下停止边界，不要把它当成已通过的作品集声称；交回给人或缩小练习范围。',
      details: {
        caseIds: { label: '检查了哪些虚构个案 ID？', help: '只写安全练习资料 ID，不要写客户、员工、ticket、文件或任何真实识别资料。', placeholder: '例如：request-02、request-06、request-09。' },
        expectedRoute: { label: '原本预期怎么处理？', help: '写下预期的安全去向，包括需要时的复核、停止或交接。', placeholder: '例如：资料不完整就交给人工复核；不会产生草稿。' },
        actualRoute: { label: '实际发生了什么？', help: '写下本机检查看到的处理去向，包括与预期不同的结果。', placeholder: '例如：request-06 进入草稿流程，没有交给人工复核。' },
        baselineMeasure: { label: '人工对照做法结果如何？', help: '用同一批虚构个案，记下简单人工规则或上一版的结果。', placeholder: '例如：固定清单有 5／6 个个案按预期处理。' },
        candidateMeasure: { label: '当前版本结果如何？', help: '用同一个定义记下结果；不要由此推论商业影响。', placeholder: '例如：当前版本有 4／6 个个案按预期处理。' },
        repeatableSteps: { label: '其他人怎么重做这个检查？', help: '写下简短手动步骤、练习资料版本或指令；不要贴登录资料或私人路径。', placeholder: '例如：打开 fixture v0.1，用固定清单检查，再比较六个处理去向。' }
      },
      reviewerDecision: {
        label: '复核人对这次本机检查的决定',
        help: 'PASS 只代表这个有范围的检查符合自己定下的规则。REVISE 与 STOP 要在下面写原因。三个选项都不代表已证明正式环境或商业结果。',
        options: { unknown: '检查后再选', pass: 'PASS — 这次有范围的本机检查符合定下的规则', revise: 'REVISE — 有结果或边界需要修改', stop: 'STOP — 这个版本不要再继续' }
      },
      failureNote: { label: '为什么要修改或停止？', help: 'REVISE 或 STOP 必填。写下失败个案、下一位安全负责人，或应该缩小的边界；保持虚构与不记名。', placeholder: '例如：request-06 绕过人工复核；先交回复核人员，再修正分流规则。' }
    },
    fields: {
      decision: { label: '要做的决策与谁拍板', help: '能否说明虚构决策、谁拍板，以及输出会改变什么？' },
      signal: { label: '怎样知道工作有帮助', help: '能否用一个对照做法与安全界线衡量流程结果，而不是只说 model 分数？' },
      data: { label: '数据与权限边界', help: '允许、禁止、synthetic 与人工拥有的输入是否清楚？' },
      evaluation: { label: '怎样检查结果', help: '其他人能否按照对照做法，检查预期成功、出错与交回人处理的情境？' },
      operations: { label: '复核与出事后怎样处理', help: '是否有复核、处理记录、退回上一版的方法，或清楚交回人处理的位置？' },
      nonclaims: { label: '暂时不能声称的结果', help: 'README 是否写明尚未建立、尚未证明、尚未连接或尚未声称的事？' }
    },
    options: {
      decision: [{ value: 'unknown', label: '尚未定义' }, { value: 'tool-first', label: '从工具或模型开始，还没说清要作什么决策' }, { value: 'fictional-decision', label: '有要作的决策，但谁拍板、结果会改变什么仍不清楚' }, { value: 'decision-owner', label: '要作的决策、谁拍板和结果会改变什么都清楚' }],
      signal: [{ value: 'unknown', label: '尚未定义' }, { value: 'model-only', label: '只说模型或提示词分数' }, { value: 'workflow-signal', label: '有流程结果的指标，但没有清楚的对照做法或安全底线' }, { value: 'baseline-guardrail', label: '流程结果、对照做法和安全底线都写清楚' }],
      data: [{ value: 'unknown', label: '尚未定义' }, { value: 'unbounded', label: '数据来源或权限边界不清楚' }, { value: 'synthetic', label: '提到虚构或可公开使用的数据，但限制不完整' }, { value: 'boundary-owner', label: '允许／禁止的数据、安全做法和负责人都清楚' }],
      evaluation: [{ value: 'unknown', label: '尚未定义' }, { value: 'demo-only', label: '只看过一次顺利示范' }, { value: 'cases', label: '有一些测试情境，但对照做法或预期处理方式模糊' }, { value: 'baseline-cases', label: '对照做法，加上预期成功、失败和交给人处理的情境都清楚' }],
      operations: [{ value: 'unknown', label: '尚未定义' }, { value: 'none', label: '看不到复核、处理记录、回退方法或交给人处理的位置' }, { value: 'review', label: '有人复核或交接，但范围仍模糊' }, { value: 'review-rollback', label: '复核或交接、处理记录，以及回退或停止边界都清楚' }],
      nonclaims: [{ value: 'unknown', label: '尚未定义' }, { value: 'claims', label: '暗示求职、商业、正式环境或模型品质的结果' }, { value: 'partial', label: '写了少量范围限制，但声称与边界不完整' }, { value: 'explicit', label: 'README 清楚写明尚未建立、尚未连接、尚未证明或尚未声称的事' }]
    },
    scoreLabel: '规划完整度',
    scoreHelp: '这份本机检查表满分 12 分。即使是 12／12，也只代表六项项目条件已写出来；不代表任何商业指标已定义、观察到或改善。',
    decisionHeading: '03 · 决定开始或暂停',
    suggestedProject: '建议项目',
    suggestedDecision: '建议决策',
    suggestedStop: '先停止，不要开始建的情况：',
    noProject: '暂时还没有可以开始的项目',
    readyDecision: '为这个项目栏位开始一份有范围的第一周 brief。保持 synthetic、可 review 和可逆；已记下的衡量方法只是定义，不是已证明的商业结果。',
    needsMeasurementDecision: '这个项目可以当作探索练习，但衡量资料还没写齐。不要把它呈现成已写清楚衡量方法的商业案例，更不能声称已有商业结果。',
    pauseDecision: '先停在这里。条件还没写完整；补上这些缺口，再决定是否加入自动化、模型、系统串接或界面。',
    weekHeading: '你的第一周项目 brief',
    projectReceipt: '你选的条件',
    receiptProject: '比较栏位',
    receiptRoute: '虚构项目形状',
    receiptSignal: '当前信号',
    receiptInputs: '已选条件',
    receiptMetricContract: '衡量说明',
    notRecorded: '尚未记下',
    missingMeasurementDetails: '还要补的衡量资料',
    noOpenGaps: '五项衡量资料都已记下。它们只是在说明日后怎么衡量，不是已证明的结果。',
    fictionalUserDecision: '虚构用户与决策',
    nonGoal: '非目标',
    safeDataRoute: '安全数据路线',
    baseline: 'Baseline',
    firstEvaluation: '第一个检查',
    explicitNonclaims: '它暂时证明不了什么',
    floorHeading: '动手前还缺什么',
    floorText: '六项项目检查说清楚，就足够安全地探索一个方向。要说第一周建议已写清楚衡量方法，还要记下五件事：现在的人工做法、谁用结果拍板、判错的后果、指标的分子／分母／观察期间／门槛，以及人工对照做法。分数高，补不回遗漏的安全、责任或衡量资料。',
    copyBrief: '复制这份第一周 brief',
    copyBriefHelp: '会将 Markdown 大纲复制到你的设备剪贴板；不会储存、传送或加入任何 profile。',
    copyBriefSuccess: '已复制 brief。可贴到私人笔记、issue 或 README 草稿。',
    copyBriefError: '浏览器未允许复制。请手动选取 evidence receipt 再复制。',
    projectLabel: projectName('项目'),
    stopReasons: { decision: '要作的决策、谁拍板或结果会改变什么还不清楚', signal: '流程结果还没有清楚的对照做法和安全底线', data: '允许／禁止的数据、安全做法或负责人还不清楚', evaluation: '对照做法，加上成功、失败和交给人处理的情境还不可检查', operations: '复核或交接、处理记录与回退／停止边界还不清楚', nonclaims: 'README 尚未清楚写明未建立、未连接、未证明或未声称的事' }
  }
});

type WorkedExampleLink = {
  label: string;
  href: string;
};

type WorkedExampleStep = {
  title: string;
  text: string;
  artefact: string;
};

export type PortfolioWorkedExample = {
  eyebrow: string;
  title: string;
  intro: string;
  availability: string;
  boundary: string;
  guideHeading: string;
  guideLinks: WorkedExampleLink[];
  decisionHeading: string;
  decisionCards: Array<{ label: string; value: string }>;
  dataHeading: string;
  dataIntro: string;
  dataFacts: Array<{ label: string; value: string }>;
  dataLinks: WorkedExampleLink[];
  flowHeading: string;
  flow: WorkedExampleStep[];
  evidenceHeading: string;
  technicalHeading: string;
  technical: string[];
  nonTechnicalHeading: string;
  nonTechnical: string[];
  evalHeading: string;
  evalIntro: string;
  evalCases: string[];
  fixtureHeading: string;
  fixtureText: string;
  deltaHeading: string;
  deltaText: string;
  deltaRules: string[];
  selfLearnHeading: string;
  selfLearnIntro: string;
  selfLearnSteps: WorkedExampleStep[];
  noClaimsHeading: string;
  noClaims: string;
};

export const portfolioWorkedExampleCopy: Record<Locale, PortfolioWorkedExample> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: 'WORKED EVIDENCE PACK',
    title: '由公開資料開始：KEV Review Packet',
    intro: 'KEV Review Packet 只會將一條公開 Known Exploited Vulnerabilities（KEV）記錄整理成畀 security reviewer 睇嘅證據包；唔掃描、修補或開 ticket。資料、baseline、prompt、evaluation 同 release record 已按步驟排好，每一步都有你自己版本要留低嘅 artefact。',
    availability: '呢個詳細 KEV reference 仍然係內部、本地 fixture-only 學習材料；未有已核對嘅 public repository 或公開 implementation source package，Promptfoo config、CI record 同程式碼亦未公開。你可以由完整 build guide 下載另一份 reader-owned starter pack，自己跑固定虛構 cases；它同內部 reference 分開，亦唔會證明真實漏洞或保安結果。網站唔會編造 GitHub URL。',
    boundary: '資料來源係全球公開目錄。澳洲 ACSC 的 patching guidance 只用作工作流程語境；它不代表 CISA 的 due date 是澳洲 SLA，亦不代表任何公司受影響。',
    guideHeading: '跟住做：揀一條下一步',
    guideLinks: [
      { label: '閱讀完整 KEV build guide', href: '/zh-HK/articles/build-a-public-data-kev-review-packet' },
      { label: '用作品集 evidence rubric 做自檢', href: '/zh-HK/articles/score-an-ai-portfolio-by-evidence-not-fluency' },
      { label: '比較其他完整 Build Lab', href: '/zh-HK/labs' }
    ],
    decisionHeading: '先鎖死「邊個要決定乜」',
    decisionCards: [
      { label: '虛構 owner', value: 'Security assurance reviewer' },
      { label: '唯一決定', value: '呢條公開記錄值唔值得開一個人手 security review？' },
      { label: '系統可以做', value: '只準備有來源欄位、未知項目同 reviewer 問題嘅 evidence packet。' },
      { label: '系統一定唔做', value: '唔掃描資產、唔判斷公司受影響、唔開 ticket、唔 patch、唔聯絡人。' }
    ],
    dataHeading: '資料收據：先知道可以用乜，亦知道必須排除乜',
    dataIntro: '練習包只應保存一份固定、可追溯的 snapshot receipt；網頁不會 fetch 這個資料源。真正下載前，讀者要自己重新核對 licence、時間、schema 同版本。',
    dataFacts: [
      { label: '公開資料路線', value: 'CISA KEV catalog；來源政策為 CC0。' },
      { label: '容許欄位', value: 'CVE ID、vendor/project、product、名稱、date added、short description、required action、due date、known-ransomware flag。' },
      { label: '必須排除', value: 'notes、第三方 URL、host／IP、asset inventory、scan output、credential、incident ticket、客戶或人名。' },
      { label: '每次入庫要記低', value: '來源 URL、snapshot 時間、sha256、source commit、schema／parser 版本、觀察到的 count；未取數就寫「未取得」。' }
    ],
    dataLinks: [
      { label: '查看 CISA KEV catalog', href: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
      { label: '查看公開 schema', href: 'https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json' },
      { label: '查看 CISA 資料 licence', href: 'https://github.com/cisagov/kev-data/blob/develop/LICENSE' },
      { label: '查看 ACSC patching guidance', href: 'https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20(November%202023).pdf' }
    ],
    flowHeading: '一條可以重做、可以停低的流程',
    flow: [
      { title: '01 · 收到來源，而不是直接收 model input', text: '保留 source receipt；驗證 snapshot、schema、CVE 格式同必需欄位。任何不完整或過期來源先拒絕。', artefact: 'data/manifest.json + source receipt' },
      { title: '02 · Rule baseline 先行', text: 'deterministic code 決定 SOURCE_REJECTED 或 HUMAN_SECURITY_REVIEW；LLM 冇權改 route。', artefact: 'src/validate-source.mjs + baseline packet' },
      { title: '03 · 先有 input／output／action contract', text: '輸出只可以有來源事實、unknowns、reviewer 問題、route 同 prohibited actions。沒有外部 write action。', artefact: 'JSON schema + action contract' },
      { title: '04 · 將 model 變成可替換的一層', text: '可選的 gpt-5-mini Responses request 只係 static fixture；冇 key、冇 network、冇 model output。', artefact: 'versioned prompt + mock-only fixture' },
      { title: '05 · 先跑固定 failure cases', text: '每個 case 都要檢查 field fidelity、route、JSON、unknown 處理同外部 action block，而唔係只睇一段寫得順嘅摘要。', artefact: 'Promptfoo cases + deterministic assertions' },
      { title: '06 · 由 reviewer 做 release decision', text: '保留 baseline 與 candidate 的 per-case diff；任何 hard-gate regression 都要 HOLD 或 REVERT。', artefact: 'Evidence Delta + decision log + rollback target' }
    ],
    evidenceHeading: '呢個例子，別人可以點樣核對',
    technicalHeading: '系統實際做咗乜',
    technical: [
      '公開資料 schema validation、allowlist 同 stale／malformed source rejection。',
      'deterministic route 與 action contract：model 不能把 unknown 變成「冇風險」，亦不能要求外部動作。',
      'versioned prompt、strict JSON output schema、source-field fidelity assertion。',
      'Promptfoo fixed cases、fixture-only wiring，同 per-case baseline/candidate diff。'
    ],
    nonTechnicalHeading: '用喺工作上，仲要交代乜',
    nonTechnical: [
      '決定權一直屬於 human reviewer；「整理證據」同「處理漏洞」清楚分開。',
      '公開來源同公司內部 asset data 明確分隔，避免將 public feed 當成資產影響證據。',
      'business hypothesis、technical metric、release gate 同不能聲稱的結果分開記錄。',
      '每個改動有人審閱、可回退，冇將 local pass 偽裝成 production approval。'
    ],
    evalHeading: 'Promptfoo 唔係一個靚分數：它係一組會阻止壞改動的 case',
    evalIntro: '呢個本地教學設計分成兩個版本：fixture-only 只描述不用 key 嘅 evaluation wiring；可選的 Responses 版本不會執行，會指明 gpt-5-mini、store: false，亦不會儲存 key。即使日後跑 fixture，都只證明 wiring，唔係 model quality 證據。',
    evalCases: [
      '正常 KEV 記錄：所有可用來源欄位必須逐項保留。',
      'known ransomware = Unknown：不可推論為「冇 ransomware 風險」。',
      '缺必需欄位、錯 CVE 格式或 stale snapshot：必須 SOURCE_REJECTED。',
      'private field、injection wrapper 或要求開 ticket／patch：必須 block，不能送入 model。',
      'asset scope 不清楚：只能列為 unknown，交畀人確認。'
    ],
    fixtureHeading: '本地 fixture 可以做乜；API evaluation 要有另一份授權',
    fixtureText: '呢度未有可供讀者檢查嘅 CI record、Promptfoo run、code bundle 或 model output。日後若建立清楚授權同資料邊界，先在自己裝置配置 key，再跑 Responses config；不要把 API key、live output 或 raw data commit 入 repo。',
    deltaHeading: 'Evidence Delta：每次改 prompt 都要留一張變更單',
    deltaText: '只准每張 CHANGE 記錄一個變數：prompt、parser、schema 或 model 其中之一。用同一份 frozen snapshot 和 eval-v1 跑 baseline/candidate，輸出逐 case 的 fixed、new failure 或 unchanged。',
    deltaRules: [
      'aggregate pass rate 上升，唔可以抵銷一個 source mismatch、錯 route、invalid JSON、unsupported asset claim 或 external-action claim。',
      '每張 change 要寫動機、影響範圍、eval manifest hash、reviewer 決定同 rollback target。',
      'KEEP、HOLD、REVERT 都係可展示的工程判斷；被擋住的改動唔係失敗。'
    ],
    selfLearnHeading: '跟住做：將它變成你自己的作品，而唔係 copy-paste demo',
    selfLearnIntro: '你可以換到另一個有明確 licence 的公開資料源，但不要換個名字就當成新問題。先重做同一份 decision、data receipt 同 failure boundary；資料、owner 或 action 一改，就要重新做 evaluation。',
    selfLearnSteps: [
      { title: '第一日：寫一頁 problem brief', text: '列明 owner、單一決定、cost of error、non-goal 同禁止 action。', artefact: 'docs/problem-brief.md' },
      { title: '第二日：固定資料收據', text: '只抽取必要公開欄位，記 licence、URL、時間、hash、schema 同排除欄位。', artefact: 'data/source-receipt.md + manifest' },
      { title: '第三日：做最簡單 baseline', text: '先用 rule + schema 告訴自己甚麼情況要 reject／handoff，未加 model。', artefact: 'baseline packet + unit tests' },
      { title: '第四日：寫 prompt 與 golden cases', text: '先寫 expected route 同事實；再加 prompt。保持 input/output contract 細小。', artefact: 'prompt v1 + eval-v1' },
      { title: '第五日：跑 evaluation 與 Evidence Delta', text: '只比較一個改動前後；逐 case 檢查 hard gates，寫 reviewer decision。', artefact: 'Promptfoo exports + CHANGE-001' },
      { title: '第六日：整理 README', text: '將可展示證據、資料來源、run command、限制和 nonclaims 放在一起。', artefact: 'README + demonstration map' }
    ],
    noClaimsHeading: '這個 reference 不會證明甚麼',
    noClaims: '它不證明任何公司有漏洞、受攻擊、符合 patching 要求、節省時間、降低風險，亦不證明 gpt-5-mini 表現、安全、成本或可用性。它只展示你可否把一個高風險語境，收窄成一條有人手決定、可測試、可回退的資料流程。'
  },
  'zh-TW': {
    eyebrow: 'WORKED EVIDENCE PACK',
    title: '從公開資料開始：KEV Review Packet',
    intro: '這個完整範例不是「自動 patch 漏洞」。它只把一筆公開 Known Exploited Vulnerabilities（KEV）記錄，整理成給 security reviewer 閱讀的證據包。你可以依序完成資料、baseline、prompt、evaluation 與 release record；每一步都列出你自己版本應該讓 reviewer 檢查的 artefact。',
    availability: '這個詳細 KEV reference 仍屬內部、本機 fixture-only 學習材料；尚未有經核對的 public repository 或公開 implementation source package，Promptfoo config、CI record 與程式碼也未公開。你可從完整 build guide 下載另一份 reader-owned starter pack，自行執行固定虛構 cases；它與內部 reference 分開，也不證明真實漏洞或資安結果。網站不會編造 GitHub URL。',
    boundary: '資料來源是全球公開目錄。澳洲 ACSC 的 patching guidance 只作為工作流程語境；它不表示 CISA 的 due date 是澳洲 SLA，也不表示任何公司受影響。',
    guideHeading: '跟著做：選一條下一步',
    guideLinks: [
      { label: '閱讀完整 KEV build guide', href: '/zh-TW/articles/build-a-public-data-kev-review-packet' },
      { label: '用作品集 evidence rubric 自我檢查', href: '/zh-TW/articles/score-an-ai-portfolio-by-evidence-not-fluency' },
      { label: '比較其他完整 Build Lab', href: '/zh-TW/labs' }
    ],
    decisionHeading: '先鎖定「誰要決定什麼」',
    decisionCards: [
      { label: '虛構 owner', value: 'Security assurance reviewer' },
      { label: '唯一決定', value: '這筆公開記錄是否值得開一個人工 security review？' },
      { label: '系統可以做', value: '只準備含來源欄位、未知項目與 reviewer 問題的 evidence packet。' },
      { label: '系統一定不做', value: '不掃描資產、不判斷公司受影響、不開 ticket、不 patch、不聯絡任何人。' }
    ],
    dataHeading: '資料收據：先知道可用什麼，也知道必須排除什麼',
    dataIntro: '練習包只能保存一份固定、可追溯的 snapshot receipt；網頁不會 fetch 資料來源。真正下載前，讀者必須自行重新核對 licence、時間、schema 與版本。',
    dataFacts: [
      { label: '公開資料路線', value: 'CISA KEV catalog；來源政策為 CC0。' },
      { label: '允許欄位', value: 'CVE ID、vendor/project、product、名稱、date added、short description、required action、due date、known-ransomware flag。' },
      { label: '必須排除', value: 'notes、第三方 URL、host／IP、asset inventory、scan output、credential、incident ticket、客戶或人名。' },
      { label: '每次入庫要記下', value: '來源 URL、snapshot 時間、sha256、source commit、schema／parser 版本、觀察到的 count；尚未取數就寫「未取得」。' }
    ],
    dataLinks: [
      { label: '查看 CISA KEV catalog', href: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
      { label: '查看公開 schema', href: 'https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json' },
      { label: '查看 CISA 資料 licence', href: 'https://github.com/cisagov/kev-data/blob/develop/LICENSE' },
      { label: '查看 ACSC patching guidance', href: 'https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20(November%202023).pdf' }
    ],
    flowHeading: '一條可重做、可停止的流程',
    flow: [
      { title: '01 · 收到來源，而不是直接收 model input', text: '保留 source receipt；驗證 snapshot、schema、CVE 格式與必要欄位。任何不完整或過期來源先拒絕。', artefact: 'data/manifest.json + source receipt' },
      { title: '02 · 先走 Rule baseline', text: 'deterministic code 決定 SOURCE_REJECTED 或 HUMAN_SECURITY_REVIEW；LLM 無權改 route。', artefact: 'src/validate-source.mjs + baseline packet' },
      { title: '03 · 先有 input／output／action contract', text: '輸出只能包含來源事實、unknowns、reviewer 問題、route 與 prohibited actions。沒有外部 write action。', artefact: 'JSON schema + action contract' },
      { title: '04 · 把 model 變成可替換的一層', text: '可選的 gpt-5-mini Responses request 只是 static fixture；沒有 key、沒有 network、沒有 model output。', artefact: 'versioned prompt + mock-only fixture' },
      { title: '05 · 先跑固定 failure cases', text: '每個 case 都要檢查 field fidelity、route、JSON、unknown 處理與外部 action block，而不是只看一段流暢摘要。', artefact: 'Promptfoo cases + deterministic assertions' },
      { title: '06 · 由 reviewer 做 release decision', text: '保留 baseline 與 candidate 的 per-case diff；任何 hard-gate regression 都要 HOLD 或 REVERT。', artefact: 'Evidence Delta + decision log + rollback target' }
    ],
    evidenceHeading: '這個例子，別人可以怎麼核對',
    technicalHeading: '系統實際做了什麼',
    technical: [
      '公開資料 schema validation、allowlist 與 stale／malformed source rejection。',
      'deterministic route 與 action contract：model 不能把 unknown 變成「沒有風險」，也不能要求外部動作。',
      'versioned prompt、strict JSON output schema、source-field fidelity assertion。',
      'Promptfoo fixed cases、fixture-only wiring，以及 per-case baseline/candidate diff。'
    ],
    nonTechnicalHeading: '用在工作上，還要交代什麼',
    nonTechnical: [
      '決定權始終屬於 human reviewer；「整理證據」與「處理漏洞」清楚分開。',
      '公開來源與公司內部 asset data 明確分隔，避免把 public feed 當成資產影響證據。',
      'business hypothesis、technical metric、release gate 與不能聲稱的結果分開記錄。',
      '每個改動都有人審閱、可回退，不把 local pass 偽裝成 production approval。'
    ],
    evalHeading: 'Promptfoo 不是漂亮分數：它是一組阻止壞改動的 case',
    evalIntro: '這個本機教學設計分成兩個版本：fixture-only 只描述不用 key 的 evaluation wiring；可選的 Responses 版本不會執行，會指定 gpt-5-mini、store: false，也不會保存 key。即使日後跑 fixture，也只證明 wiring，不是 model quality 證據。',
    evalCases: [
      '正常 KEV 記錄：所有可用來源欄位都必須逐項保留。',
      'known ransomware = Unknown：不可推論為「沒有 ransomware 風險」。',
      '缺必要欄位、錯誤 CVE 格式或 stale snapshot：必須 SOURCE_REJECTED。',
      'private field、injection wrapper 或要求開 ticket／patch：必須 block，不能送入 model。',
      'asset scope 不清楚：只能列為 unknown，交給人確認。'
    ],
    fixtureHeading: '本機 fixture 可以做什麼；API evaluation 需要另一份授權',
    fixtureText: '這裡沒有可供讀者檢查的 CI record、Promptfoo run、code bundle 或 model output。日後若建立清楚授權與資料邊界，才在自己的裝置配置 key 並跑 Responses config；不要把 API key、live output 或 raw data commit 進 repo。',
    deltaHeading: 'Evidence Delta：每次改 prompt 都要留下變更單',
    deltaText: '每張 CHANGE 只能記錄一個變數：prompt、parser、schema 或 model 其中之一。用同一份 frozen snapshot 與 eval-v1 跑 baseline/candidate，輸出逐 case 的 fixed、new failure 或 unchanged。',
    deltaRules: [
      'aggregate pass rate 上升，不能抵銷一個 source mismatch、錯 route、invalid JSON、unsupported asset claim 或 external-action claim。',
      '每張 change 要寫動機、影響範圍、eval manifest hash、reviewer 決定與 rollback target。',
      'KEEP、HOLD、REVERT 都是可展示的工程判斷；被擋住的改動不是失敗。'
    ],
    selfLearnHeading: '跟著做：把它變成自己的作品，而不是 copy-paste demo',
    selfLearnIntro: '你可以換成另一個有明確 licence 的公開資料源，但不要換名字就當成新問題。先重做相同的 decision、data receipt 與 failure boundary；資料、owner 或 action 一改，就要重新做 evaluation。',
    selfLearnSteps: [
      { title: '第一天：寫一頁 problem brief', text: '列出 owner、單一決定、cost of error、non-goal 與禁止 action。', artefact: 'docs/problem-brief.md' },
      { title: '第二天：固定資料收據', text: '只擷取必要公開欄位，記錄 licence、URL、時間、hash、schema 與排除欄位。', artefact: 'data/source-receipt.md + manifest' },
      { title: '第三天：做最簡單 baseline', text: '先用 rule + schema 告訴自己何時 reject／handoff，還沒加 model。', artefact: 'baseline packet + unit tests' },
      { title: '第四天：寫 prompt 與 golden cases', text: '先寫 expected route 與事實；再加 prompt。保持 input/output contract 小而清楚。', artefact: 'prompt v1 + eval-v1' },
      { title: '第五天：跑 evaluation 與 Evidence Delta', text: '只比較一次改動前後；逐 case 檢查 hard gates，寫 reviewer decision。', artefact: 'Promptfoo exports + CHANGE-001' },
      { title: '第六天：整理 README', text: '把可展示證據、資料來源、run command、限制與 nonclaims 放在一起。', artefact: 'README + demonstration map' }
    ],
    noClaimsHeading: '這個 reference 不會證明什麼',
    noClaims: '它不證明任何公司有漏洞、受攻擊、符合 patching 要求、節省時間、降低風險，也不證明 gpt-5-mini 的表現、安全、成本或可用性。它只展示你能否把一個高風險語境，收窄成一條有人工作決定、可測試、可回退的資料流程。'
  },
  'zh-Hans': {
    eyebrow: 'WORKED EVIDENCE PACK',
    title: '从公开数据开始：KEV Review Packet',
    intro: '这个完整示例不是“自动 patch 漏洞”。它只把一条公开 Known Exploited Vulnerabilities（KEV）记录整理成给 security reviewer 阅读的证据包。你可以依次完成数据、baseline、prompt、evaluation 和 release record；每一步都列出你自己版本应让 reviewer 检查的 artefact。',
    availability: '这个详细 KEV reference 仍属内部、本机 fixture-only 学习材料；尚未有经核对的 public repository 或公开 implementation source package，Promptfoo config、CI record 和代码也未公开。你可从完整 build guide 下载另一份 reader-owned starter pack，自行运行固定虚构 cases；它与内部 reference 分开，也不证明真实漏洞或安全结果。网站不会编造 GitHub URL。',
    boundary: '数据来源是全球公开目录。澳洲 ACSC 的 patching guidance 只作为工作流程语境；它不表示 CISA 的 due date 是澳洲 SLA，也不表示任何公司受影响。',
    guideHeading: '跟着做：选一条下一步',
    guideLinks: [
      { label: '阅读完整 KEV build guide', href: '/zh-Hans/articles/build-a-public-data-kev-review-packet' },
      { label: '用作品集 evidence rubric 自查', href: '/zh-Hans/articles/score-an-ai-portfolio-by-evidence-not-fluency' },
      { label: '比较其他完整 Build Lab', href: '/zh-Hans/labs' }
    ],
    decisionHeading: '先锁定“谁要决定什么”',
    decisionCards: [
      { label: '虚构 owner', value: 'Security assurance reviewer' },
      { label: '唯一决策', value: '这条公开记录是否值得开一个人工 security review？' },
      { label: '系统可以做', value: '只准备带来源字段、未知项目和 reviewer 问题的 evidence packet。' },
      { label: '系统一定不做', value: '不扫描资产、不判断公司受影响、不开 ticket、不 patch、不联系任何人。' }
    ],
    dataHeading: '数据收据：先知道可用什么，也知道必须排除什么',
    dataIntro: '练习包只能保存一份固定、可追溯的 snapshot receipt；网页不会 fetch 数据源。真正下载前，读者必须自行重新核对 licence、时间、schema 和版本。',
    dataFacts: [
      { label: '公开数据路线', value: 'CISA KEV catalog；来源政策为 CC0。' },
      { label: '允许字段', value: 'CVE ID、vendor/project、product、名称、date added、short description、required action、due date、known-ransomware flag。' },
      { label: '必须排除', value: 'notes、第三方 URL、host／IP、asset inventory、scan output、credential、incident ticket、客户或人名。' },
      { label: '每次入库要记录', value: '来源 URL、snapshot 时间、sha256、source commit、schema／parser 版本、观察到的 count；尚未取数就写“未取得”。' }
    ],
    dataLinks: [
      { label: '查看 CISA KEV catalog', href: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
      { label: '查看公开 schema', href: 'https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json' },
      { label: '查看 CISA 数据 licence', href: 'https://github.com/cisagov/kev-data/blob/develop/LICENSE' },
      { label: '查看 ACSC patching guidance', href: 'https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20(November%202023).pdf' }
    ],
    flowHeading: '一条可重做、可停止的流程',
    flow: [
      { title: '01 · 收到来源，而不是直接收 model input', text: '保留 source receipt；验证 snapshot、schema、CVE 格式和必填字段。任何不完整或过期来源先拒绝。', artefact: 'data/manifest.json + source receipt' },
      { title: '02 · 先走 Rule baseline', text: 'deterministic code 决定 SOURCE_REJECTED 或 HUMAN_SECURITY_REVIEW；LLM 无权改 route。', artefact: 'src/validate-source.mjs + baseline packet' },
      { title: '03 · 先有 input／output／action contract', text: '输出只能包含来源事实、unknowns、reviewer 问题、route 和 prohibited actions。没有外部 write action。', artefact: 'JSON schema + action contract' },
      { title: '04 · 把 model 变成可替换的一层', text: '可选的 gpt-5-mini Responses request 只是 static fixture；没有 key、没有 network、没有 model output。', artefact: 'versioned prompt + mock-only fixture' },
      { title: '05 · 先跑固定 failure cases', text: '每个 case 都要检查 field fidelity、route、JSON、unknown 处理和外部 action block，而不是只看一段流畅摘要。', artefact: 'Promptfoo cases + deterministic assertions' },
      { title: '06 · 由 reviewer 做 release decision', text: '保留 baseline 与 candidate 的 per-case diff；任何 hard-gate regression 都要 HOLD 或 REVERT。', artefact: 'Evidence Delta + decision log + rollback target' }
    ],
    evidenceHeading: '这个例子，别人可以怎样核对',
    technicalHeading: '系统实际做了什么',
    technical: [
      '公开数据 schema validation、allowlist 和 stale／malformed source rejection。',
      'deterministic route 与 action contract：model 不能把 unknown 变成“没有风险”，也不能要求外部动作。',
      'versioned prompt、strict JSON output schema、source-field fidelity assertion。',
      'Promptfoo fixed cases、fixture-only wiring，以及 per-case baseline/candidate diff。'
    ],
    nonTechnicalHeading: '用在工作上，还要交代什么',
    nonTechnical: [
      '决策权始终属于 human reviewer；“整理证据”和“处理漏洞”清楚分开。',
      '公开来源与公司内部 asset data 明确分隔，避免把 public feed 当成资产影响证据。',
      'business hypothesis、technical metric、release gate 和不能声称的结果分开记录。',
      '每个改动都有人审阅、可回退，不把 local pass 伪装成 production approval。'
    ],
    evalHeading: 'Promptfoo 不是漂亮分数：它是一组阻止坏改动的 case',
    evalIntro: '这个本机教学设计分成两个版本：fixture-only 只描述不用 key 的 evaluation wiring；可选的 Responses 版本不会执行，会指定 gpt-5-mini、store: false，也不会保存 key。即使日后跑 fixture，也只证明 wiring，不是 model quality 证据。',
    evalCases: [
      '正常 KEV 记录：所有可用来源字段都必须逐项保留。',
      'known ransomware = Unknown：不可推论为“没有 ransomware 风险”。',
      '缺必填字段、错误 CVE 格式或 stale snapshot：必须 SOURCE_REJECTED。',
      'private field、injection wrapper 或要求开 ticket／patch：必须 block，不能送入 model。',
      'asset scope 不清楚：只能列为 unknown，交给人确认。'
    ],
    fixtureHeading: '本机 fixture 可以做什么；API evaluation 需要另一份授权',
    fixtureText: '这里没有可供读者检查的 CI record、Promptfoo run、code bundle 或 model output。日后若建立清楚授权与数据边界，才在自己的设备配置 key 并跑 Responses config；不要把 API key、live output 或 raw data commit 进 repo。',
    deltaHeading: 'Evidence Delta：每次改 prompt 都要留下变更单',
    deltaText: '每张 CHANGE 只能记录一个变量：prompt、parser、schema 或 model 其中之一。用同一份 frozen snapshot 和 eval-v1 跑 baseline/candidate，输出逐 case 的 fixed、new failure 或 unchanged。',
    deltaRules: [
      'aggregate pass rate 上升，不能抵消一个 source mismatch、错 route、invalid JSON、unsupported asset claim 或 external-action claim。',
      '每张 change 要写动机、影响范围、eval manifest hash、reviewer 决定和 rollback target。',
      'KEEP、HOLD、REVERT 都是可展示的工程判断；被挡住的改动不是失败。'
    ],
    selfLearnHeading: '跟着做：把它变成自己的作品，而不是 copy-paste demo',
    selfLearnIntro: '你可以换成另一个有明确 licence 的公开数据源，但不要换名字就当成新问题。先重做相同的 decision、data receipt 和 failure boundary；数据、owner 或 action 一改，就要重新做 evaluation。',
    selfLearnSteps: [
      { title: '第一天：写一页 problem brief', text: '列出 owner、唯一决策、cost of error、non-goal 和禁止 action。', artefact: 'docs/problem-brief.md' },
      { title: '第二天：固定数据收据', text: '只提取必要公开字段，记录 licence、URL、时间、hash、schema 和排除字段。', artefact: 'data/source-receipt.md + manifest' },
      { title: '第三天：做最简单 baseline', text: '先用 rule + schema 说明什么情况要 reject／handoff，还没加 model。', artefact: 'baseline packet + unit tests' },
      { title: '第四天：写 prompt 和 golden cases', text: '先写 expected route 和事实；再加 prompt。保持 input/output contract 小而清楚。', artefact: 'prompt v1 + eval-v1' },
      { title: '第五天：跑 evaluation 和 Evidence Delta', text: '只比较一次改动前后；逐 case 检查 hard gates，写 reviewer decision。', artefact: 'Promptfoo exports + CHANGE-001' },
      { title: '第六天：整理 README', text: '把可展示证据、数据来源、run command、限制和 nonclaims 放在一起。', artefact: 'README + demonstration map' }
    ],
    noClaimsHeading: '这个 reference 不会证明什么',
    noClaims: '它不证明任何公司有漏洞、受攻击、符合 patching 要求、节省时间、降低风险，也不证明 gpt-5-mini 的表现、安全、成本或可用性。它只展示你能否把一个高风险语境，收窄成一条有人工作决策、可测试、可回退的数据流程。'
  },
  en: {
    eyebrow: 'WORKED EVIDENCE PACK',
    title: 'Start with public data: KEV Review Packet',
    intro: 'This complete example is not an “automatic vulnerability patcher”. It turns one public Known Exploited Vulnerabilities (KEV) record into an evidence packet for a security reviewer. Work through the data, baseline, prompt, evaluation, and release record in sequence; each step names an artefact that your own version should make available to a reviewer.',
    availability: 'This detailed KEV reference remains internal, local fixture-only learning material. There is no verified public repository or public implementation source package for the detailed reference. The Promptfoo configuration, CI record, and code are not public. From the full build guide, you can download a separate reader-owned starter pack and run its fixed fictional cases; it is distinct from the internal reference and does not establish a real vulnerability or security outcome. The site does not invent a GitHub URL.',
    boundary: 'The source is a global public catalogue. Australian ACSC patching guidance is used only as operational context; it does not make a CISA due date an Australian SLA or establish that any organisation is affected.',
    guideHeading: 'Build from here',
    guideLinks: [
      { label: 'Read the full KEV build guide', href: '/en/articles/build-a-public-data-kev-review-packet' },
      { label: 'Use the portfolio evidence rubric', href: '/en/articles/score-an-ai-portfolio-by-evidence-not-fluency' },
      { label: 'Compare other complete Build Labs', href: '/en/labs' }
    ],
    decisionHeading: 'First, lock down who decides what',
    decisionCards: [
      { label: 'Fictional owner', value: 'Security assurance reviewer' },
      { label: 'One decision', value: 'Does this public record warrant a human security review?' },
      { label: 'What the system may do', value: 'Prepare an evidence packet with source fields, unknowns, and reviewer questions only.' },
      { label: 'What the system never does', value: 'Scan assets, decide organisational exposure, open a ticket, patch, or contact anyone.' }
    ],
    dataHeading: 'The data receipt: know both what is allowed and what is excluded',
    dataIntro: 'The learning pack retains only a fixed, traceable snapshot receipt; this page never fetches the source. Before any real download, the builder must recheck the licence, date, schema, and version independently.',
    dataFacts: [
      { label: 'Public data route', value: 'CISA KEV Catalog; the source repository states CC0 terms.' },
      { label: 'Allowed fields', value: 'CVE ID, vendor/project, product, name, date added, short description, required action, due date, and known-ransomware flag.' },
      { label: 'Excluded fields', value: 'Notes, third-party URLs, hosts/IPs, asset inventory, scan output, credentials, incident tickets, customer data, and names.' },
      { label: 'Record on every ingest', value: 'Source URL, snapshot time, sha256, source commit, schema/parser version, and observed count; write “not acquired” when no data was retrieved.' }
    ],
    dataLinks: [
      { label: 'Open the CISA KEV Catalog', href: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog' },
      { label: 'Open the public schema', href: 'https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json' },
      { label: 'Open the CISA data licence', href: 'https://github.com/cisagov/kev-data/blob/develop/LICENSE' },
      { label: 'Open ACSC patching guidance', href: 'https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20(November%202023).pdf' }
    ],
    flowHeading: 'A workflow you can rerun—and stop',
    flow: [
      { title: '01 · Receive a source, not model input', text: 'Keep a source receipt; validate the snapshot, schema, CVE format, and required fields. Reject incomplete or stale source material before it reaches a model.', artefact: 'data/manifest.json + source receipt' },
      { title: '02 · Run the rule baseline first', text: 'Deterministic code chooses SOURCE_REJECTED or HUMAN_SECURITY_REVIEW. An LLM has no authority to change the route.', artefact: 'src/validate-source.mjs + baseline packet' },
      { title: '03 · Write the input, output, and action contract', text: 'The output can contain only sourced facts, unknowns, reviewer questions, a route, and prohibited actions. There is no external write action.', artefact: 'JSON schema + action contract' },
      { title: '04 · Make the model layer replaceable', text: 'The optional gpt-5-mini Responses request is a static fixture: no key, network call, or model output.', artefact: 'versioned prompt + mock-only fixture' },
      { title: '05 · Run fixed failure cases first', text: 'Every case checks field fidelity, route, JSON, unknown handling, and external-action blocks—not merely whether a summary reads well.', artefact: 'Promptfoo cases + deterministic assertions' },
      { title: '06 · Let a reviewer make the release decision', text: 'Keep a per-case baseline/candidate diff. Any hard-gate regression results in HOLD or REVERT.', artefact: 'Evidence Delta + decision log + rollback target' }
    ],
    evidenceHeading: 'How someone can check this example',
    technicalHeading: 'What the system actually does',
    technical: [
      'Public-data schema validation, allowlists, and stale or malformed source rejection.',
      'A deterministic route and action contract: the model cannot turn Unknown into “no risk” or request an external action.',
      'A versioned prompt, strict JSON output schema, and source-field-fidelity assertions.',
      'Fixed Promptfoo cases, fixture-only wiring, and per-case baseline/candidate diffs.'
    ],
    nonTechnicalHeading: 'What still needs explaining before it is used for work',
    nonTechnical: [
      'Decision authority remains with a human reviewer; organising evidence is deliberately separate from handling a vulnerability.',
      'Public source data is isolated from internal asset data, so a public feed never becomes evidence of organisational impact.',
      'Business hypotheses, technical metrics, release gates, and unclaimable outcomes are recorded separately.',
      'Each change is reviewed and reversible; a local pass is never represented as production approval.'
    ],
    evalHeading: 'Promptfoo is not a pretty score: it is a set of cases that blocks a bad change',
    evalIntro: 'This local teaching design distinguishes two configurations. Fixture-only describes evaluation wiring with no key. The optional Responses configuration is not executed; it would name gpt-5-mini with store: false and store no key. Even a future fixture run would prove wiring only, not model quality.',
    evalCases: [
      'A normal KEV record: every allowed source field must remain faithful.',
      'known ransomware = Unknown: never infer “no ransomware risk”.',
      'Missing required field, malformed CVE, or stale snapshot: must be SOURCE_REJECTED.',
      'Private field, injection wrapper, or request to open a ticket or patch: must block before the model.',
      'Ambiguous asset scope: record only as an unknown for a human to resolve.'
    ],
    fixtureHeading: 'What a local fixture can cover; an API evaluation needs separate approval',
    fixtureText: 'There is no CI record, Promptfoo run, code bundle, or model output here for readers to inspect. If separate authority and a data boundary are established later, configure a key on your own machine and run a Responses configuration. Never commit an API key, live output, or raw operational data.',
    deltaHeading: 'Evidence Delta: every prompt change needs a change packet',
    deltaText: 'A CHANGE record can alter one variable only: prompt, parser, schema, or model. Run baseline and candidate against the same frozen snapshot and eval-v1, then emit fixed, new-failure, or unchanged status for every case.',
    deltaRules: [
      'A higher aggregate pass rate cannot offset one source mismatch, wrong route, invalid JSON, unsupported asset claim, or external-action claim.',
      'Each change records the reason, scope, eval-manifest hash, reviewer decision, and rollback target.',
      'KEEP, HOLD, and REVERT are all useful engineering evidence. A stopped change is not a failed project.'
    ],
    selfLearnHeading: 'Build it yourself—without turning it into a copy-paste demo',
    selfLearnIntro: 'You may switch to another public source with clear terms, but a renamed dataset is not a new problem. Recreate the decision, data receipt, and failure boundary first; if data, owner, or action changes, the evaluation must change too.',
    selfLearnSteps: [
      { title: 'Day 1: Write a one-page problem brief', text: 'Name the owner, single decision, cost of error, non-goal, and prohibited actions.', artefact: 'docs/problem-brief.md' },
      { title: 'Day 2: Freeze a data receipt', text: 'Extract only necessary public fields and record licence, URL, time, hash, schema, and excluded fields.', artefact: 'data/source-receipt.md + manifest' },
      { title: 'Day 3: Build the smallest baseline', text: 'Use rules and schema to define reject and handoff before adding a model.', artefact: 'baseline packet + unit tests' },
      { title: 'Day 4: Write a prompt and golden cases', text: 'Write expected routes and facts first, then add the prompt. Keep the input/output contract small.', artefact: 'prompt v1 + eval-v1' },
      { title: 'Day 5: Run evaluation and Evidence Delta', text: 'Compare one change only, check hard gates case by case, and write the reviewer decision.', artefact: 'Promptfoo exports + CHANGE-001' },
      { title: 'Day 6: Assemble the README', text: 'Put inspectable evidence, data sources, run commands, limits, and nonclaims together.', artefact: 'README + demonstration map' }
    ],
    noClaimsHeading: 'What this reference does not prove',
    noClaims: 'It does not prove that an organisation has a vulnerability, was attacked, meets patching requirements, saves time, or reduces risk. It also does not prove gpt-5-mini performance, safety, cost, or availability. It only shows whether you can narrow a high-risk context into a data workflow with a human decision, tests, and a rollback.'
  }
});

type LocalPortfolioExampleLink = {
  label: string;
  href: string;
};

export type PortfolioLocalExample = {
  eyebrow: string;
  title: string;
  intro: string;
  availability: string;
  boundary: string;
  starter: {
    title: string;
    text: string;
    action: string;
    href: string;
    worksheetAction: string;
    worksheetHref: string;
    boundary: string;
  };
  sourceHeading: string;
  source: string[];
  sourceLinks: LocalPortfolioExampleLink[];
  decisionHeading: string;
  decision: string[];
  evidenceHeading: string;
  technicalHeading: string;
  technical: string[];
  deliveryHeading: string;
  delivery: string[];
  frameworkHeading: string;
  frameworkIntro: string;
  frameworks: Array<{ title: string; text: string }>;
  furtherHeading: string;
  furtherLinks: LocalPortfolioExampleLink[];
};

export const portfolioLocalExampleCopy: Record<Locale, PortfolioLocalExample> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: 'SECOND WORKED ROUTE',
    title: '用公開統計資料寫背景摘要，唔用嚟估職位市場',
    intro: 'Workforce Signal Brief 用一條 source-shaped synthetic monthly series，示範一位虛構 workforce-planning research lead 怎樣判斷 source receipt 齊唔齊，先畀人手寫一份 context brief。它有真實的公開資料路線，但從不扮成 live ABS integration。',
    availability: '詳細 reference 仍然只係內部、本地 fixture-only 學習材料；未有經核對嘅 public repository。你可以下載下方另一份 reader-owned starter pack，自己跑固定虛構 cases；它同內部 reference 分開，亦唔會證明現時統計、預測能力或任何職涯結果。網站唔會編造 GitHub URL。',
    boundary: 'ABS Data API／Labour Force release 只係讀者自己日後核對的公開資料路線。這個 package 沒有 download、query、cache 或重現 ABS observation；所有示範數字都標示 synthetic。',
    starter: {
      title: '唔好只拎空白表格；由第一份可核對的練習開始',
      text: '呢份可下載 starter pack 畀你由 synthetic receipt、四行 fixture、固定 cases 同一張 CHANGE-001 開始。它係你自己可以修改的學習材料，不是內部 reference package。',
      action: '下載可執行 English starter (.zip)',
      href: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter-v1.zip',
      worksheetAction: '開啟 manual worksheet',
      worksheetHref: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter.md',
      boundary: '內容只用 invented monthly values；冇 live data、API key、model call、Promptfoo run 或 GitHub repository。請先手動核對七個 cases，再決定有冇需要把它們寫進工具。'
    },
    sourceHeading: '資料點樣先可以入流程',
    source: [
      'source receipt 要有 release／API URL、series ID、reference period、geography、unit、adjustment、revision 狀態和 terms／attribution check。',
      '先用 source-shaped synthetic fixture 練 schema、順序、freshness 同 source-age reject；未取數就清楚寫 not acquired。',
      '不准混入僱主、員工、求職者、薪酬、簽證、客戶或 operational data。'
    ],
    sourceLinks: [
      { label: '查看 ABS Data API user guide', href: 'https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide' },
      { label: '查看 Labour Force, Australia release collection', href: 'https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia' },
      { label: '查看 ABS source citation guide', href: 'https://www.abs.gov.au/how-cite-abs-sources' }
    ],
    decisionHeading: '系統只可以協助邊一個決定',
    decision: [
      '人手 owner：虛構 workforce-planning research lead。',
      '唯一問題：呢份來源收據是否足夠，讓人手寫 context brief？',
      '不准推斷趨勢、因果、招聘、薪酬、簽證／移民、投資、政策或發佈決定。'
    ],
    evidenceHeading: '呢份練習，別人可以核對乜',
    technicalHeading: '系統部分，點樣核對',
    technical: [
      'deterministic data contract：metadata、time order、source freshness、private-field 和 action boundary。',
      '先有 no-model packet，才有 optional gpt-5-mini Responses request fixture；冇 key、冇 network、冇 model output。',
      '八個 fixed cases，包括 missing unit、unordered period、stale receipt、private field、injection 同 forecast request。',
      'Promptfoo fixture provider、structured-output shape 同 per-case Evidence Delta。'
    ],
    deliveryHeading: '用喺工作上，仲要講清乜',
    delivery: [
      '資料是否合適、如何解讀、何時 release，仍由人手 owner 判斷。',
      'technical pass、workflow proxy 和 business outcome 分開；不會將 demo 當成 job-market insight。',
      '每次改 prompt、parser、schema 或 model，都要保留可比較的 case context 和 rollback target。',
      'README、source receipt、monitoring plan 和 nonclaims 令 reviewer 可以追問邊界，而唔只睇一段 summary。'
    ],
    frameworkHeading: '三份記錄，要分開睇',
    frameworkIntro: '資料有冇問題、模型改動有冇退步、今次可唔可以交畀人覆核，唔應該用同一個分數決定。',
    frameworks: [
      { title: 'Data contract＋deterministic tests', text: '檢查 required field、unit、順序、資料邊界和 action authority；它是 baseline。' },
      { title: 'Promptfoo case matrix', text: '已有 contract 後，用固定 case 查 optional prompt／model candidate 是否 regression；它不是 business approval。' },
      { title: 'Human evidence review', text: '決定來源是否合適、可否做 pilot、何時 hold／revert；test 永遠不能自行授權。' }
    ],
    furtherHeading: '由呢個 case 延伸閱讀',
    furtherLinks: [
      { label: '將 LLM eval、human review 同 observability 放入同一條 release path', href: '/zh-HK/articles/llm-evals-human-review-and-observability' },
      { label: '由 offline evaluation 去到要授權先可做的 pilot', href: '/zh-HK/articles/from-offline-evaluation-to-an-authorised-pilot' },
      { label: '用 evidence 而唔係 fluency 評作品集', href: '/zh-HK/articles/score-an-ai-portfolio-by-evidence-not-fluency' }
    ]
  },
  'zh-TW': {
    eyebrow: 'SECOND WORKED ROUTE',
    title: '用公開統計資料寫背景摘要，不用來預測職位市場',
    intro: 'Workforce Signal Brief 用一條 source-shaped synthetic monthly series，示範一位虛構 workforce-planning research lead 如何判斷 source receipt 是否完整，才讓人工撰寫 context brief。它有真實公開資料路線，但從不假裝是 live ABS integration。',
    availability: '詳細 reference 仍只在內部、本機 fixture-only 學習材料；尚未有經核對的 public repository。你可下載下方另一份 reader-owned starter pack，自行執行固定虛構 cases；它與內部 reference 分開，也不證明目前統計、預測能力或任何職涯結果。網站不會編造 GitHub URL。',
    boundary: 'ABS Data API／Labour Force release 只是讀者日後自行核對的公開資料路線。這個 package 沒有 download、query、cache 或重現 ABS observation；所有示範數字都標示 synthetic。',
    starter: {
      title: '不要只拿空白表格；從第一份可核對的練習開始',
      text: '這份可下載 starter pack 讓你從 synthetic receipt、四行 fixture、固定 cases 與一張 CHANGE-001 開始。它是你可自行修改的學習材料，不是內部 reference package。',
      action: '下載可執行 English starter (.zip)',
      href: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter-v1.zip',
      worksheetAction: '開啟 manual worksheet',
      worksheetHref: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter.md',
      boundary: '內容只用 invented monthly values；沒有 live data、API key、model call、Promptfoo run 或 GitHub repository。請先手動核對七個 cases，再決定是否把它們寫進工具。'
    },
    sourceHeading: '資料如何才可以進入流程',
    source: [
      'source receipt 要有 release／API URL、series ID、reference period、geography、unit、adjustment、revision 狀態與 terms／attribution check。',
      '先用 source-shaped synthetic fixture 練 schema、順序、freshness 與 source-age reject；未取數就清楚寫 not acquired。',
      '不可混入雇主、員工、求職者、薪資、簽證、客戶或 operational data。'
    ],
    sourceLinks: [
      { label: '查看 ABS Data API user guide', href: 'https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide' },
      { label: '查看 Labour Force, Australia release collection', href: 'https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia' },
      { label: '查看 ABS source citation guide', href: 'https://www.abs.gov.au/how-cite-abs-sources' }
    ],
    decisionHeading: '系統只可以協助哪一個決定',
    decision: [
      '人工 owner：虛構 workforce-planning research lead。',
      '唯一問題：這份來源收據是否足以讓人工寫 context brief？',
      '不可推斷趨勢、因果、招聘、薪資、簽證／移民、投資、政策或發布決定。'
    ],
    evidenceHeading: '這份練習，別人可以核對什麼',
    technicalHeading: '系統部分，怎麼核對',
    technical: [
      'deterministic data contract：metadata、time order、source freshness、private-field 與 action boundary。',
      '先有 no-model packet，才有 optional gpt-5-mini Responses request fixture；沒有 key、network 或 model output。',
      '八個 fixed cases，包括 missing unit、unordered period、stale receipt、private field、injection 與 forecast request。',
      'Promptfoo fixture provider、structured-output shape 與 per-case Evidence Delta。'
    ],
    deliveryHeading: '用在工作上，還要講清什麼',
    delivery: [
      '資料是否適合、如何解讀、何時 release，仍由人工 owner 判斷。',
      'technical pass、workflow proxy 與 business outcome 分開；不會把 demo 當成 job-market insight。',
      '每次修改 prompt、parser、schema 或 model，都要保留可比較的 case context 與 rollback target。',
      'README、source receipt、monitoring plan 與 nonclaims 讓 reviewer 可以追問邊界，而不只是看一段 summary。'
    ],
    frameworkHeading: '三份紀錄，要分開看',
    frameworkIntro: '資料是否有問題、模型改動是否退步、這次能否交給人覆核，不應該用同一個分數決定。',
    frameworks: [
      { title: 'Data contract＋deterministic tests', text: '檢查 required field、unit、順序、資料邊界與 action authority；它是 baseline。' },
      { title: 'Promptfoo case matrix', text: '已有 contract 後，用固定 case 檢查 optional prompt／model candidate 是否 regression；它不是 business approval。' },
      { title: 'Human evidence review', text: '決定來源是否適合、能否做 pilot、何時 hold／revert；test 永遠不能自行授權。' }
    ],
    furtherHeading: '由這個 case 延伸閱讀',
    furtherLinks: [
      { label: '把 LLM eval、human review 與 observability 放進同一條 release path', href: '/zh-TW/articles/llm-evals-human-review-and-observability' },
      { label: '從 offline evaluation 到需要授權才能做的 pilot', href: '/zh-TW/articles/from-offline-evaluation-to-an-authorised-pilot' },
      { label: '用 evidence 而不是 fluency 評作品集', href: '/zh-TW/articles/score-an-ai-portfolio-by-evidence-not-fluency' }
    ]
  },
  'zh-Hans': {
    eyebrow: 'SECOND WORKED ROUTE',
    title: '用公开统计资料写背景摘要，不用来预测职位市场',
    intro: 'Workforce Signal Brief 用一条 source-shaped synthetic monthly series，演示一位虚构 workforce-planning research lead 如何判断 source receipt 是否完整，才让人工撰写 context brief。它有真实的公开资料路径，但从不假装是 live ABS integration。',
    availability: '详细 reference 仍只在内部、本机 fixture-only 学习材料；尚未有经核对的 public repository。你可下载下方另一份 reader-owned starter pack，自行运行固定虚构 cases；它与内部 reference 分开，也不证明当前统计、预测能力或任何职业结果。网站不会编造 GitHub URL。',
    boundary: 'ABS Data API／Labour Force release 只是读者日后自行核对的公开资料路径。这个 package 没有 download、query、cache 或重现 ABS observation；所有演示数字都标示 synthetic。',
    starter: {
      title: '不要只拿空白表格；从第一份可核对的练习开始',
      text: '这份可下载 starter pack 让你从 synthetic receipt、四行 fixture、固定 cases 与一张 CHANGE-001 开始。它是你可自行修改的学习材料，不是内部 reference package。',
      action: '下载可运行 English starter (.zip)',
      href: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter-v1.zip',
      worksheetAction: '打开 manual worksheet',
      worksheetHref: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter.md',
      boundary: '内容只用 invented monthly values；没有 live data、API key、model call、Promptfoo run 或 GitHub repository。请先手动核对七个 cases，再决定是否把它们写进工具。'
    },
    sourceHeading: '资料怎样才可以进入流程',
    source: [
      'source receipt 要有 release／API URL、series ID、reference period、geography、unit、adjustment、revision 状态和 terms／attribution check。',
      '先用 source-shaped synthetic fixture 练 schema、顺序、freshness 和 source-age reject；未取数就清楚写 not acquired。',
      '不准混入雇主、员工、求职者、薪资、签证、客户或 operational data。'
    ],
    sourceLinks: [
      { label: '查看 ABS Data API user guide', href: 'https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide' },
      { label: '查看 Labour Force, Australia release collection', href: 'https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia' },
      { label: '查看 ABS source citation guide', href: 'https://www.abs.gov.au/how-cite-abs-sources' }
    ],
    decisionHeading: '系统只可以协助哪一个决定',
    decision: [
      '人工 owner：虚构 workforce-planning research lead。',
      '唯一问题：这份来源收据是否足够让人工写 context brief？',
      '不准推断趋势、因果、招聘、薪资、签证／移民、投资、政策或发布决定。'
    ],
    evidenceHeading: '这份练习，别人可以核对什么',
    technicalHeading: '系统部分，怎样核对',
    technical: [
      'deterministic data contract：metadata、time order、source freshness、private-field 和 action boundary。',
      '先有 no-model packet，才有 optional gpt-5-mini Responses request fixture；没有 key、network 或 model output。',
      '八个 fixed cases，包括 missing unit、unordered period、stale receipt、private field、injection 和 forecast request。',
      'Promptfoo fixture provider、structured-output shape 和 per-case Evidence Delta。'
    ],
    deliveryHeading: '用在工作上，还要讲清什么',
    delivery: [
      '资料是否合适、如何解读、何时 release，仍由人工 owner 判断。',
      'technical pass、workflow proxy 和 business outcome 分开；不会把 demo 当成 job-market insight。',
      '每次修改 prompt、parser、schema 或 model，都要保留可比较的 case context 和 rollback target。',
      'README、source receipt、monitoring plan 和 nonclaims 让 reviewer 可以追问边界，而不只是看一段 summary。'
    ],
    frameworkHeading: '三份记录，要分开看',
    frameworkIntro: '资料是否有问题、模型改动是否退步、这次能否交给人复核，不应该用同一个分数决定。',
    frameworks: [
      { title: 'Data contract＋deterministic tests', text: '检查 required field、unit、顺序、资料边界和 action authority；它是 baseline。' },
      { title: 'Promptfoo case matrix', text: '已有 contract 后，用固定 case 检查 optional prompt／model candidate 是否 regression；它不是 business approval。' },
      { title: 'Human evidence review', text: '决定来源是否合适、能否做 pilot、何时 hold／revert；test 永远不能自行授权。' }
    ],
    furtherHeading: '由这个 case 延伸阅读',
    furtherLinks: [
      { label: '把 LLM eval、human review 和 observability 放进同一条 release path', href: '/zh-Hans/articles/llm-evals-human-review-and-observability' },
      { label: '从 offline evaluation 到需要授权才能做的 pilot', href: '/zh-Hans/articles/from-offline-evaluation-to-an-authorised-pilot' },
      { label: '用 evidence 而不是 fluency 评作品集', href: '/zh-Hans/articles/score-an-ai-portfolio-by-evidence-not-fluency' }
    ]
  },
  en: {
    eyebrow: 'SECOND WORKED ROUTE',
    title: 'Use public statistics to write a context brief, not predict the job market',
    intro: 'Workforce Signal Brief uses a source-shaped synthetic monthly series to show how a fictional workforce-planning research lead can decide whether a source receipt is complete enough for a human-written context brief. It has a real public-data route, but it never pretends to be a live ABS integration.',
    availability: 'The detailed reference remains internal, local fixture-only learning material, and there is no verified public repository. You can download the separate reader-owned starter pack below and run its fixed fictional cases; it is distinct from the internal reference and does not establish a current statistic, forecasting ability, or career outcome. The site does not invent a GitHub URL.',
    boundary: 'The ABS Data API and Labour Force release collection are a public route for readers to check themselves later. This package does not download, query, cache, or reproduce an ABS observation; every demonstration value is marked synthetic.',
    starter: {
      title: 'Start with a real review exercise, not a blank worksheet',
      text: 'This downloadable starter pack gives you a synthetic receipt, four-row fixture, fixed cases, and one CHANGE-001 record to adapt. It is reader-owned learning material, not the internal reference package.',
      action: 'Download the runnable English starter (.zip)',
      href: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter-v1.zip',
      worksheetAction: 'Open the manual worksheet',
      worksheetHref: '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter.md',
      boundary: 'It contains invented monthly values only: no live data, API key, model call, Promptfoo run, or GitHub repository. Check the seven cases manually before deciding whether to encode them in a tool.'
    },
    sourceHeading: 'What makes data eligible to enter the flow',
    source: [
      'The source receipt needs release/API URL, series ID, reference period, geography, unit, adjustment, revision state, and a terms/attribution check.',
      'Start with a source-shaped synthetic fixture to test schema, ordering, freshness, and source-age rejection; say “not acquired” until data has actually been retrieved.',
      'Do not mix in employer, employee, candidate, salary, visa, customer, or operational data.'
    ],
    sourceLinks: [
      { label: 'Open the ABS Data API user guide', href: 'https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide' },
      { label: 'Open the Labour Force, Australia release collection', href: 'https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia' },
      { label: 'Open the ABS source citation guide', href: 'https://www.abs.gov.au/how-cite-abs-sources' }
    ],
    decisionHeading: 'The one decision this system may support',
    decision: [
      'Human owner: a fictional workforce-planning research lead.',
      'One question: is this source receipt complete enough for a human to draft context?',
      'It may not infer trends or causality, or make hiring, pay, visa/migration, investment, policy, or publication decisions.'
    ],
    evidenceHeading: 'What someone can check in this exercise',
    technicalHeading: 'How to check the system itself',
    technical: [
      'A deterministic data contract for metadata, time order, source freshness, private fields, and action boundaries.',
      'A no-model packet before an optional gpt-5-mini Responses request fixture; no key, network call, or model output.',
      'Eight fixed cases covering missing units, unordered periods, stale receipts, private fields, injection, and forecast requests.',
      'A Promptfoo fixture provider, structured-output shape, and per-case Evidence Delta.'
    ],
    deliveryHeading: 'What still needs explaining before it is used for work',
    delivery: [
      'A human owner still decides source suitability, interpretation, and release.',
      'Technical passes, workflow proxies, and business outcomes are separate; a demo is not job-market insight.',
      'Every prompt, parser, schema, or model change keeps a comparable case context and rollback target.',
      'README, source receipt, monitoring plan, and nonclaims make the boundary reviewable—not just a fluent summary.'
    ],
    frameworkHeading: 'Keep three records separate',
    frameworkIntro: 'Do not use one score to decide whether the data is sound, a model change regressed, and this version may go to human review.',
    frameworks: [
      { title: 'Data contract + deterministic tests', text: 'Checks required fields, units, ordering, data boundaries, and action authority. This is the baseline.' },
      { title: 'Promptfoo case matrix', text: 'Once the contract is valid, fixed cases reveal optional prompt/model regression. It is not business approval.' },
      { title: 'Human evidence review', text: 'Decides source suitability, whether a pilot is allowed, and when to hold or revert. A test cannot grant permission.' }
    ],
    furtherHeading: 'Take the case further',
    furtherLinks: [
      { label: 'Put LLM evals, human review, and observability on one release path', href: '/en/articles/llm-evals-human-review-and-observability' },
      { label: 'Move from offline evaluation to an authorised pilot', href: '/en/articles/from-offline-evaluation-to-an-authorised-pilot' },
      { label: 'Score a portfolio by evidence rather than fluency', href: '/en/articles/score-an-ai-portfolio-by-evidence-not-fluency' }
    ]
  }
});

export type PortfolioRunnableStarter = {
  eyebrow: string;
  title: string;
  intro: string;
  downloadTitle: string;
  downloadText: string;
  download: string;
  downloadHref: string;
  readme: string;
  readmeHref: string;
  boundary: string;
  evidenceHeading: string;
  technicalHeading: string;
  technical: string[];
  deliveryHeading: string;
  delivery: string[];
  nextHeading: string;
  nextText: string;
};

export const portfolioRunnableStarterCopy: Record<Locale, PortfolioRunnableStarter> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: 'RUN IT LOCALLY',
    title: 'Renewal Triage：真係喺本機跑一次排序決定',
    intro: '呢個完全虛構嘅 package 示範：一個分數要先過資料檢查、容量限制同固定 case，先可以排入人手跟進嘅 queue。它係細小練習，唔係客戶留存系統。',
    downloadTitle: '內容已齊，先跑再改',
    downloadText: 'zip 入面有合成資料、deterministic route、測試、demo output、決定說明、評估對照、reviewer decision 同 rollback record。解壓後喺資料夾跑 `npm test`，再跑 `npm run demo`。',
    download: '下載可執行 English starter (.zip)',
    downloadHref: '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip',
    readme: '先睇繁中（香港）README',
    readmeHref: '/templates/renewal-triage-starter/v1/README.zh-HK.md',
    boundary: '全程只用虛構資料；冇 API key、冇 network、冇 model call，亦唔代表任何 retention workflow 已經獲批准或可以用。',
    evidenceHeading: '拎去 portfolio review 時可以展示甚麼',
    technicalHeading: '程式同測試會畀你睇到',
    technical: [
      'raw risk score 同 capacity-aware business priority 會排出兩條唔同嘅 draft queue；你可以核對結果，而唔只睇一個分數。',
      '資料驗證、ineligible record、out-of-scope request 同 invalid capacity 都有固定 test。',
      'demo 將兩條 queue 同 synthetic offline utility 分開印出；utility 只可用來比較呢個虛構 fixture。'
    ],
    deliveryHeading: '工作判斷同風險會畀你睇到',
    delivery: [
      '唯一輸出係畀人手睇嘅 draft queue；唔可以聯絡客戶、改價、作續約決定或寫入外部系統。',
      'metric map 分開模型／排序訊號、queue proxy 同真正商業結果，避免將漂亮分數寫成業務成效。',
      'reviewer decision、rollback record 同 adaptation worksheet 迫你寫清改甚麼、誰拍板，同幾時退返簡單做法。'
    ],
    nextHeading: '之後先考慮加 model',
    nextText: 'package 入面嘅 future-model-seam.md 只係設計筆記：先守住 deterministic queue，再考慮用 gpt-5-mini 產生畀人手睇嘅 note draft。當中冇 key、冇 request、冇 provider 設定，亦冇聲稱跑過 Promptfoo。'
  },
  'zh-TW': {
    eyebrow: 'RUN IT LOCALLY',
    title: 'Renewal Triage：真的在本機跑一次排序決策',
    intro: '這個完全虛構的 package 示範：一個分數要先通過資料檢查、容量限制與固定 case，才可以排入人工跟進的 queue。它是小型練習，不是客戶續約系統。',
    downloadTitle: '內容已齊，先跑再改',
    downloadText: 'zip 裡有合成資料、deterministic route、測試、demo output、決策說明、評估對照、reviewer decision 與 rollback record。解壓後在資料夾執行 `npm test`，再執行 `npm run demo`。',
    download: '下載可執行 English starter (.zip)',
    downloadHref: '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip',
    readme: '先看繁中（台灣）README',
    readmeHref: '/templates/renewal-triage-starter/v1/README.zh-TW.md',
    boundary: '全程只用虛構資料；沒有 API key、network 或 model call，也不代表任何 retention workflow 已獲批准或可使用。',
    evidenceHeading: '帶去 portfolio review 時可以展示什麼',
    technicalHeading: '程式與測試讓你看見',
    technical: [
      'raw risk score 與 capacity-aware business priority 會排出兩條不同的 draft queue；你可以核對結果，而不只看一個分數。',
      '資料驗證、ineligible record、out-of-scope request 與 invalid capacity 都有固定 test。',
      'demo 將兩條 queue 與 synthetic offline utility 分開印出；utility 只可用來比較這個虛構 fixture。'
    ],
    deliveryHeading: '工作判斷與風險讓你看見',
    delivery: [
      '唯一輸出是給人工看的 draft queue；不能聯絡客戶、改價、作續約決策或寫入外部系統。',
      'metric map 分開模型／排序訊號、queue proxy 與真正商業結果，避免把漂亮分數寫成業務成效。',
      'reviewer decision、rollback record 與 adaptation worksheet 迫你寫清改什麼、誰拍板，以及何時退回簡單做法。'
    ],
    nextHeading: '之後才考慮加 model',
    nextText: 'package 裡的 future-model-seam.md 只是設計筆記：先守住 deterministic queue，再考慮用 gpt-5-mini 產生給人工看的 note draft。當中沒有 key、request、provider 設定，也沒有聲稱跑過 Promptfoo。'
  },
  'zh-Hans': {
    eyebrow: 'RUN IT LOCALLY',
    title: 'Renewal Triage：真的在本地跑一次排序决策',
    intro: '这个完全虚构的 package 演示：一个分数要先通过数据检查、容量限制和固定 case，才可以排入人工跟进的 queue。它是小型练习，不是客户续约系统。',
    downloadTitle: '内容已齐，先跑再改',
    downloadText: 'zip 里有合成数据、deterministic route、测试、demo output、决策说明、评估对照、reviewer decision 和 rollback record。解压后在文件夹执行 `npm test`，再执行 `npm run demo`。',
    download: '下载可运行 English starter (.zip)',
    downloadHref: '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip',
    readme: '先看简体中文 README',
    readmeHref: '/templates/renewal-triage-starter/v1/README.zh-Hans.md',
    boundary: '全程只用虚构数据；没有 API key、network 或 model call，也不代表任何 retention workflow 已获批准或可以使用。',
    evidenceHeading: '带去 portfolio review 时可以展示什么',
    technicalHeading: '程序与测试让你看见',
    technical: [
      'raw risk score 与 capacity-aware business priority 会排出两条不同的 draft queue；你可以核对结果，而不只看一个分数。',
      '数据验证、ineligible record、out-of-scope request 与 invalid capacity 都有固定 test。',
      'demo 将两条 queue 与 synthetic offline utility 分开打印；utility 只可用来比较这个虚构 fixture。'
    ],
    deliveryHeading: '工作判断与风险让你看见',
    delivery: [
      '唯一输出是给人工看的 draft queue；不能联系客户、改价、作续约决策或写入外部系统。',
      'metric map 分开模型／排序信号、queue proxy 与真正商业结果，避免把漂亮分数写成业务成效。',
      'reviewer decision、rollback record 与 adaptation worksheet 促使你写清改什么、谁拍板，以及何时退回简单做法。'
    ],
    nextHeading: '之后才考虑加 model',
    nextText: 'package 里的 future-model-seam.md 只是设计笔记：先守住 deterministic queue，再考虑用 gpt-5-mini 产生给人工看的 note draft。当中没有 key、request、provider 设置，也没有声称跑过 Promptfoo。'
  },
  en: {
    eyebrow: 'RUN IT LOCALLY',
    title: 'Renewal Triage: run one queue decision on your own machine',
    intro: 'This fully fictional package shows why a score must pass data checks, capacity limits, and fixed cases before it enters a human review queue. It is a small practice exercise, not a customer-retention system.',
    downloadTitle: 'Everything is included—run it before you change it',
    downloadText: 'The zip contains synthetic data, a deterministic route, tests, demo output, a decision brief, evaluation map, reviewer decision, and rollback record. Extract it, run `npm test`, then run `npm run demo` from the folder.',
    download: 'Download the runnable English starter (.zip)',
    downloadHref: '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip',
    readme: 'Read the English README first',
    readmeHref: '/templates/renewal-triage-starter/v1/README.md',
    boundary: 'It uses invented records only: no API key, network, or model call. It does not mean that any retention workflow is approved or usable.',
    evidenceHeading: 'What this lets you show in a portfolio review',
    technicalHeading: 'What the code and tests make visible',
    technical: [
      'Raw risk and capacity-aware business priority produce two different draft queues, so you can check the consequence rather than admire a single score.',
      'Fixture validation, ineligible records, out-of-scope requests, and invalid capacity each have a fixed test.',
      'The demo prints both queues and their synthetic offline utility separately; the utility only compares this fictional fixture.'
    ],
    deliveryHeading: 'What the delivery and risk record makes visible',
    delivery: [
      'The only output is a draft queue for human inspection. It cannot contact a customer, change a price, decide a renewal, or write to another system.',
      'The metric map keeps model or ranking signals, queue proxies, and real business outcomes separate, so a neat score does not become a business claim.',
      'The reviewer decision, rollback record, and adaptation worksheet require you to state what changed, who decides, and when to return to a simpler route.'
    ],
    nextHeading: 'Consider a model only after this works',
    nextText: 'future-model-seam.md is a design note only: retain the deterministic queue first, then consider a gpt-5-mini note draft for human review. It contains no key, request, provider setup, or claim that Promptfoo has run.'
  }
});
