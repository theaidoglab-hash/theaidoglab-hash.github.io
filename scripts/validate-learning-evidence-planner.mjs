import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const planner = fs.readFileSync(path.join(root, 'components', 'learning-evidence-planner.tsx'), 'utf8');
const plannerPage = fs.readFileSync(path.join(root, 'app', '[lang]', 'learning-evidence-planner', 'page.tsx'), 'utf8');
const copy = fs.readFileSync(path.join(root, 'lib', 'learning-evidence-planner.ts'), 'utf8');
const probe = fs.readFileSync(path.join(root, 'lib', 'learning-evidence-probe.ts'), 'utf8');
const startingPoints = JSON.parse(fs.readFileSync(path.join(root, 'content', 'learning-evidence-starting-points.json'), 'utf8'));
const startingPointSource = fs.readFileSync(path.join(root, 'lib', 'learning-evidence-starting-points.ts'), 'utf8');
const sourceReceiptArticleRoot = path.join(root, 'content', 'articles', 'agent-eval-source-receipts');

const validGapIds = new Set(['delivery', 'evaluation', 'data-boundary', 'business-decision', 'review']);
const validRouteIds = new Set(['no-code', 'coder']);
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const officialStartingPointHosts = new Set(['developers.openai.com', 'developers.google.com', 'www.nist.gov', 'owasp.org', 'docs.github.com']);

if (!startingPoints || startingPoints.schemaVersion !== 1 || !Array.isArray(startingPoints.sources) || startingPoints.sources.length < 2) {
  throw new Error('Learning-evidence starting points: expected a versioned source manifest with at least two sources.');
}

const seenStartingPointIds = new Set();
for (const source of startingPoints.sources) {
  if (!source || typeof source.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)) {
    throw new Error('Learning-evidence starting points: invalid source id.');
  }
  if (seenStartingPointIds.has(source.id)) throw new Error(`Learning-evidence starting points: duplicate source id ${source.id}.`);
  seenStartingPointIds.add(source.id);
  if (typeof source.officialUrl !== 'string' || !source.officialUrl.startsWith('https://')) {
    throw new Error(`Learning-evidence starting points: ${source.id} needs an HTTPS official URL.`);
  }
  if (!officialStartingPointHosts.has(new URL(source.officialUrl).hostname)) {
    throw new Error(`Learning-evidence starting points: ${source.id} must use a checked primary official host.`);
  }
  if (source.lastChecked !== '2026-09-25') {
    throw new Error(`Learning-evidence starting points: ${source.id} needs lastChecked 2026-09-25.`);
  }
  if (!source.fit || !Array.isArray(source.fit.gapIds) || !source.fit.gapIds.length || !Array.isArray(source.fit.routeIds) || !source.fit.routeIds.length) {
    throw new Error(`Learning-evidence starting points: ${source.id} needs non-empty fit ids.`);
  }
  for (const gapId of source.fit.gapIds) if (!validGapIds.has(gapId)) throw new Error(`Learning-evidence starting points: ${source.id} has unknown gap id ${gapId}.`);
  for (const routeId of source.fit.routeIds) if (!validRouteIds.has(routeId)) throw new Error(`Learning-evidence starting points: ${source.id} has unknown route id ${routeId}.`);
  for (const locale of locales) {
    const localized = source.copy?.[locale];
    if (!localized) throw new Error(`Learning-evidence starting points: ${source.id} is missing ${locale} copy.`);
    for (const field of ['title', 'whatToInspect', 'firstWeekArtefact', 'nonClaim', 'caveat']) {
      if (typeof localized[field] !== 'string' || !localized[field].trim()) {
        throw new Error(`Learning-evidence starting points: ${source.id}/${locale} is missing ${field}.`);
      }
    }
  }
}

for (const gapId of validGapIds) {
  for (const routeId of validRouteIds) {
    const matching = startingPoints.sources.filter(source => source.fit.gapIds.includes(gapId) && source.fit.routeIds.includes(routeId));
    if (!matching.length) throw new Error(`Learning-evidence starting points: no official source fits ${gapId}/${routeId}.`);
  }
}

for (const required of [
  "getLearningEvidenceStartingPoints",
  "learningEvidenceStartingPointCopy",
  "getLearningEvidenceStartingPoints(gapId, routeId)",
  "data-fit-gap-ids",
  "data-fit-route-ids",
  "source.lastChecked",
  "startingPointCopy.whatToInspect",
  "startingPointCopy.firstWeekArtefact",
  "startingPointCopy.nonClaim",
  "startingPointCopy.caveat",
  "startingPointCopy.openOfficialSource",
  'target="_blank"',
  'rel="noreferrer"',
  'className="planner-official-url"'
]) {
  if (!planner.includes(required)) {
    throw new Error(`Learning-evidence starting-point UI contract: missing ${required}.`);
  }
}

if (!startingPointSource.includes('.slice(0, 2);')) {
  throw new Error('Learning-evidence starting points: selection must return at most two cards.');
}

for (const required of [
  "type LearningSourceMode = 'rehearse-first' | 'compare-named-source';",
  "const [mode, setMode] = useState<LearningSourceMode>('rehearse-first');",
  'name="learning-source-mode"',
  "mode === 'compare-named-source' ? <section className=\"planner-step\"",
  "mode === 'compare-named-source' ? <section className=\"planner-result\"",
  'planner-source-free-status',
  'copy.sourceNotSelected',
  "const localRecordSource = mode === 'compare-named-source' ? selectedSource : copy.sourceNotSelected;",
  "sourceTitle: ''",
  "officialUrl: ''",
  "checkedDate: ''",
  "lessonAssignment: ''",
  'function hasAuditableSourceDetails(source: SourceState)',
  'new URL(officialUrl)',
  "parsedUrl.protocol !== 'https:'",
  'source.checkedDate',
  'return hasAuditableSourceDetails(source)',
  'function updateSourceDetail(index: number, detail: SourceDetailId, value: string)',
  'SOURCE_DETAIL_IDS.map(detail => {',
  'value={source[detail]}',
  'onChange={event => updateSourceDetail(index, detail, event.target.value)}',
  'function sourceDetailEntries(source?: SourceState)',
  'sourceDetailEntries(receiptSource?.source)',
  '`## ${copy.receiptSourceDetails}`',
  'copy.receiptSourceDetails',
  'copy.sourceDetails[detail].label',
  "gapFit: 'unknown'",
  "entryFit: 'unknown'",
  "timeFit: 'unknown'",
  "stop: 'not-set'",
  "&& source.gapFit === 'direct'",
  "&& source.entryFit === 'ready'",
  "&& source.timeFit === 'bounded'",
  "&& source.stop !== 'not-set';",
  ".filter(candidate => candidate.clearsFloor)",
  "const selectedStop = comparison.chosen ? optionLabel('stop', comparison.chosen.source.stop)",
  "`## ${copy.suggestedStop}`"
]) {
  if (!planner.includes(required)) {
    throw new Error(`Learning-evidence planner contract: missing ${required}.`);
  }
}

if (planner.indexOf("const [mode, setMode] = useState<LearningSourceMode>('rehearse-first');") > planner.indexOf("const [sourceCount, setSourceCount]")) {
  throw new Error('Learning-evidence planner: the source-free rehearsal mode must be the initial interaction state.');
}

if (planner.indexOf('planner-source-free-status') > planner.indexOf('className="planner-probe"')) {
  throw new Error('Learning-evidence planner: the source-free status must lead into the local rehearsal.');
}

if (!copy.includes("SOURCE_FIELD_IDS = ['artefact', 'feedback', 'assessment', 'cost', 'timeFit', 'freshness', 'gapFit', 'entryFit', 'stop']")) {
  throw new Error('Learning-evidence planner: time-fit field id is missing from localized copy.');
}

if (!copy.includes("SOURCE_DETAIL_IDS = ['sourceTitle', 'officialUrl', 'checkedDate', 'lessonAssignment']")) {
  throw new Error('Learning-evidence planner: source-detail field ids are missing from localized copy.');
}

for (const key of [
  'modeHeading:',
  'modeHelp:',
  'rehearseFirstLabel:',
  'rehearseFirstText:',
  'compareNamedSourceLabel:',
  'compareNamedSourceText:',
  'sourceStatusHeading:',
  'sourceNotSelected:',
  'sourceNotSelectedText:',
  'sourceDetailsHeading:',
  'sourceDetailsHelp:',
  'sourceDetails:',
  'receiptSourceDetails:',
  'notRecorded:'
]) {
  const matches = copy.match(new RegExp(`^    ${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gm')) ?? [];
  if (matches.length !== 3) {
    throw new Error(`Learning-evidence planner: expected three canonical localized ${key} entries, found ${matches.length}.`);
  }
}

for (const [locale, sourceDetailPhrase, localOnlyPhrase, timeFitPhrase] of [
  ['en', 'source title, URL, date, and lesson', 'does not store, send, or analyse them', 'This-week time fit'],
  ['zh-Hant', '來源名稱、URL、核對日期與課節', '不會儲存、傳送或用來分析', '本週時間是否配合'],
  ['zh-Hans', '来源名称、URL、核对日期与课节', '不会储存、发送或用来分析', '本周时间是否匹配']
]) {
  if (!copy.includes(sourceDetailPhrase) || !copy.includes(localOnlyPhrase) || !copy.includes(timeFitPhrase)) {
    throw new Error(`Learning-evidence planner: ${locale} must explain the local-only source-detail and time-fit boundaries.`);
  }
}

const unselectedSourceMarkers = copy.match(/sourceNotSelected: 'NOT_SELECTED_YET/g) ?? [];
if (unselectedSourceMarkers.length !== 3) {
  throw new Error('Learning-evidence planner: every canonical locale must leave the source status explicitly NOT_SELECTED_YET until comparison is opted into.');
}

for (const [locale, nonRankingPhrase] of [
  ['en', 'does not rank or recommend a provider'],
  ['zh-Hant', '不替供應者評分、排位或推薦'],
  ['zh-Hans', '不替供应商评分、排位或推荐']
]) {
  if (!copy.includes(nonRankingPhrase)) {
    throw new Error(`Learning-evidence planner: ${locale} must keep the named-source comparison out of provider ranking or recommendation.`);
  }
}

for (const forbidden of ['fetch(', 'XMLHttpRequest', 'sendBeacon(', 'localStorage', 'sessionStorage']) {
  if (planner.includes(forbidden)) {
    throw new Error(`Learning-evidence planner: source details must stay local; found ${forbidden} in the client component.`);
  }
}

const stopChoices = copy.match(/value: 'not-set'/g) ?? [];
if (stopChoices.length !== 3) {
  throw new Error(`Learning-evidence planner contract: expected three explicit stop-condition choices, found ${stopChoices.length}.`);
}

for (const value of ["value: 'direct'", "value: 'ready'", "value: 'bounded'"]) {
  const matches = copy.match(new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? [];
  if (matches.length !== 3) {
    throw new Error(`Learning-evidence planner contract: expected three ${value} choices, found ${matches.length}.`);
  }
}

for (const required of [
  "LEARNING_ROUTE_IDS = ['no-code', 'coder']",
  "PROBE_CHECK_IDS = ['local-artefact', 'scope-boundary', 'negative-case', 'review-record']",
  "not a credential, provider rating, production claim, or proof of business impact",
  "not contain API keys, connected accounts, employer data, client data, or an external action",
  "no model call, package, credential, or deployment is needed",
  'starterLab: {'
]) {
  if (!probe.includes(required)) {
    throw new Error(`Learning-evidence probe contract: missing ${required}.`);
  }
}

for (const required of [
  "probeCopy: LearningEvidenceProbeCopy;",
  "const [routeId, setRouteId] = useState<LearningRouteId>('no-code')",
  "PROBE_CHECK_IDS.map(check =>",
  "function probeOutcome(probe: ProbeState)",
  "if (statuses.includes('stop')) return 'stop';",
  "if (statuses.every(status => status === 'observed')) return 'ready';",
  "function localRouteRecord()",
  "copyLocalRouteRecord",
  "planner-probe-boundary",
  "planner-probe-lab",
  "selectedRoute.starterLab.href",
  "aria-describedby=\"planner-probe-lab-boundary\""
]) {
  if (!planner.includes(required)) {
    throw new Error(`Learning-evidence probe UI contract: missing ${required}.`);
  }
}

for (const required of [
  "import { learningEvidenceProbeCopy } from '@/lib/learning-evidence-probe';",
  '<LearningEvidencePlanner locale={lang} probeCopy={learningEvidenceProbeCopy[lang]} />'
]) {
  if (!plannerPage.includes(required)) {
    throw new Error(`Learning-evidence probe server handoff contract: missing ${required}.`);
  }
}

if (planner.includes('learningEvidenceProbeCopy')) {
  throw new Error('Learning-evidence probe UI contract: localized copy must be passed from the server, not bundled into the interactive planner.');
}

for (const route of ["'no-code': {", 'coder: {']) {
  const matches = probe.match(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? [];
  if (matches.length !== 3) {
    throw new Error(`Learning-evidence probe contract: expected three canonical localized ${route} route entries, found ${matches.length}.`);
  }
}

for (const href of [
  '/en/no-code-starter-lab#no-code-lab-manual-title',
  '/en/coding-starter-lab#coding-starter-lab-manual-title',
  '/zh-TW/no-code-starter-lab#no-code-lab-manual-title',
  '/zh-TW/coding-starter-lab#coding-starter-lab-manual-title',
  '/zh-Hans/no-code-starter-lab#no-code-lab-manual-title',
  '/zh-Hans/coding-starter-lab#coding-starter-lab-manual-title'
]) {
  if (!probe.includes(`href: '${href}'`)) {
    throw new Error(`Learning-evidence probe starter-lab handoff is missing ${href}.`);
  }
}

if ((probe.match(/starterLab: \{/g) ?? []).length !== 7) {
  throw new Error('Learning-evidence probe needs one typed starter-lab contract and six canonical route handoffs.');
}

for (const boundary of [
  'no account, connected app, live data, or external action',
  '不需要帳戶、不連接其他應用程式、不用真實資料，也不會做外部操作',
  '不需要账户、不连接其他应用程序、不用真实数据，也不会做外部操作'
]) {
  if (!probe.includes(boundary)) {
    throw new Error('Learning-evidence probe starter-lab handoff is missing a local-only boundary.');
  }
}

for (const required of [
  'type PortfolioHandoff = {',
  'portfolioHandoff: PortfolioHandoff;',
  "eyebrow: 'BEFORE YOU CALL IT A PORTFOLIO PROJECT'",
  "eyebrow: '還沒叫它作品之前'",
  "eyebrow: '还没叫它作品之前'",
  "carryItems: Record<LearningRouteId, string[]>;",
  "outcome: Record<'ready' | 'revise' | 'stop', { title: string; text: string; action: string }>;",
  "'no-code': [",
  'coder: [',
  'business impact, model quality, production readiness, or professional experience',
  '商業成效、模型品質、可正式上線，也不代表你有工作經驗',
  '商业成效、模型质量、可正式上线，也不代表你有工作经验',
  'does not convert a synthetic local exercise into a live system, credential, business result, or public project',
  '不會把合成本機練習變成正式系統、證書、商業成果或公開作品',
  '不会把合成本机练习变成正式系统、证书、商业成果或公开作品'
]) {
  if (!probe.includes(required)) {
    throw new Error(`Learning-evidence portfolio handoff contract: missing ${required}.`);
  }
}

if ((probe.match(/portfolioHandoff: \{/g) ?? []).length !== 3) {
  throw new Error('Learning-evidence portfolio handoff: expected three canonical localized handoff entries.');
}

for (const required of [
  'const portfolioHandoff = probeCopy.portfolioHandoff;',
  'const portfolioHandoffOutcome = portfolioHandoff.outcome[currentProbeOutcome];',
  "const portfolioHandoffHref = currentProbeOutcome === 'ready'",
  '? `/${locale}/portfolio-evidence-planner#portfolio-projects`',
  ': selectedRoute.starterLab.href;',
  'className={`planner-probe-portfolio-handoff planner-probe-portfolio-handoff--${currentProbeOutcome}`}',
  'portfolioHandoff.carryItems[routeId]',
  'portfolioHandoffOutcome.title',
  'portfolioHandoffOutcome.text',
  'href={portfolioHandoffHref}',
  'portfolioHandoffOutcome.action',
  'portfolioHandoff.boundary'
]) {
  if (!planner.includes(required)) {
    throw new Error(`Learning-evidence portfolio handoff UI contract: missing ${required}.`);
  }
}

const sourceReceiptSlug = 'choose-agent-and-evaluation-learning-sources-with-receipts';
if ((planner.match(new RegExp(sourceReceiptSlug, 'g')) ?? []).length !== 3) {
  throw new Error('Learning-evidence planner: every canonical locale must link to the agent-and-evaluation source-receipts guide exactly once.');
}

for (const [locale, label] of [
  ['en', 'Use source receipts for agent and evaluation learning'],
  ['zh-Hant', '用來源核對記錄揀 agent／evaluation 學習起點'],
  ['zh-Hans', '用来源核对记录选择 agent／evaluation 学习起点']
]) {
  if (!planner.includes(label)) {
    throw new Error(`Learning-evidence planner: ${locale} is missing the source-receipts handoff label.`);
  }

}

for (const locale of locales) {
  const receipt = fs.readFileSync(path.join(sourceReceiptArticleRoot, `${locale}.mdx`), 'utf8');
  if (!receipt.includes(`/${locale}/learning-evidence-planner`)) {
    throw new Error(`Agent-and-evaluation source receipts: ${locale} must return a learner to the planner.`);
  }
  if (!receipt.includes(`/${locale}/articles/turn-an-ai-course-project-into-portfolio-evidence`)) {
    throw new Error(`Agent-and-evaluation source receipts: ${locale} must link to the course-to-portfolio evidence guide.`);
  }
}

console.log('Validated the opt-in source comparison, source-free no-code/coder rehearsal, and official starting-point cards.');
