import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const plannerPath = path.join(root, 'components', 'portfolio-evidence-planner.tsx');
const workedExamplesPath = path.join(root, 'components', 'portfolio-worked-examples.tsx');
const capstonePath = path.join(root, 'components', 'portfolio-capstone-path.tsx');
const pagePath = path.join(root, 'app', '[lang]', 'portfolio-evidence-planner', 'page.tsx');
const copyPath = path.join(root, 'lib', 'portfolio-evidence-planner.ts');
const planner = fs.readFileSync(plannerPath, 'utf8');
const workedExamples = fs.readFileSync(workedExamplesPath, 'utf8');
const capstone = fs.readFileSync(capstonePath, 'utf8');
const page = fs.readFileSync(pagePath, 'utf8');
const copy = fs.readFileSync(copyPath, 'utf8');

function fail(message) {
  throw new Error(message);
}

for (const token of [
  'briefMarkdown',
  'navigator.clipboard?.writeText',
  'copyWeekOneBrief',
  'aria-describedby="portfolio-copy-brief-help"',
  'role="status"',
  'aria-live="polite"',
  "setBriefCopyState('idle')",
  'href="#portfolio-quick-start"',
  'href="#portfolio-worked-examples"',
  'useState<ProjectCount>(1)'
]) {
  if (!planner.includes(token)) fail('portfolio planner copy action missing ' + token);
}
if (planner.includes('href="#portfolio-projects">{copy.jumpToComparison}')) {
  fail('portfolio planner primary header action must send learners to the 15-minute start before the longer project check');
}

for (const token of [
  'id="portfolio-worked-examples"',
  '<details className="planner-example-disclosure">',
  'portfolioWorkedExampleCopy',
  'portfolioLocalExampleCopy',
  'portfolioRunnableStarterCopy',
  'planner-worked-availability',
  'example.availability'
]) {
  if (!workedExamples.includes(token)) fail('server-rendered portfolio case study missing ' + token);
}

if (!page.includes("import { PortfolioWorkedExamples } from '@/components/portfolio-worked-examples';")
  || !page.includes('!scopedRelease ? <details className="portfolio-reference-disclosure">')
  || !page.includes('<PortfolioWorkedExamples locale={lang} />')) {
  fail('portfolio planner page must keep the server-rendered worked examples in local review without leaking their unselected assets into a scoped release');
}
if (!page.includes("import { PortfolioCapstonePath } from '@/components/portfolio-capstone-path';") || !page.includes('<PortfolioCapstonePath')) {
  fail('portfolio planner page must mount the learner-owned capstone path before worked examples');
}
for (const token of [
  'id="portfolio-quick-start"',
  'quickCopy.fields.map(field =>',
  'portfolio-quick-start-${field.id}',
  'textarea id={fieldId}',
  'quickCopy.localBoundary',
  'quickCopy.completion',
  'quickCopy.fullPlanner.eyebrow',
  'quickCopy.fullPlanner.title',
  'quickCopy.fullPlanner.text',
  'quickCopy.fullPlanner.action',
  'href="#portfolio-projects"'
]) {
  if (!page.includes(token)) fail('portfolio 15-minute start must keep its three prompts fillable in place and its full planner step separate: ' + token);
}
if (page.includes('quickCopy.steps.map') || page.includes('quickCopy.action')) {
  fail('portfolio 15-minute start must not present its prompts as a link into the longer full planner');
}
if ((page.match(/^    fields: \[/gm) ?? []).length !== 4
  || (page.match(/^    localBoundary:/gm) ?? []).length !== 4
  || (page.match(/^    completion:/gm) ?? []).length !== 4
  || (page.match(/^    fullPlanner: \{/gm) ?? []).length !== 4) {
  fail('portfolio 15-minute start copy must provide fillable, local-only prompts and a separate full-planner handoff in every locale');
}
if (page.includes("'use client'") || page.includes('useState(') || /\b(?:fetch|sessionStorage|localStorage|indexedDB|XMLHttpRequest)\b/.test(page)) {
  fail('portfolio 15-minute start must remain a server-rendered, local-only form without added client state or storage');
}
if (!page.includes("'coding-starter': 'approval'")) {
  fail('the coding starter handoff must preserve its human-review decision pattern in the portfolio planner');
}
if (!page.includes('canExploreExamples={labsEnabled}') || !planner.includes('canExploreExamples = true')) {
  fail('portfolio planner must omit its Labs link when that route is outside a scoped release.');
}
if (!page.includes('canReadWorkedExamples={!scopedRelease}') || !planner.includes('canReadWorkedExamples = true')) {
  fail('portfolio planner must omit its worked-examples fragment link when the scoped page omits that target.');
}

const projectCheckIndex = planner.indexOf('<section id="portfolio-projects"');
const plannerMountIndex = page.indexOf('<PortfolioEvidencePlanner');
const capstoneMountIndex = page.indexOf('<PortfolioCapstonePath');
const workedExamplesMountIndex = page.indexOf('<PortfolioWorkedExamples locale={lang} />');
if (projectCheckIndex < 0 || plannerMountIndex < 0 || capstoneMountIndex < 0 || workedExamplesMountIndex < 0 || plannerMountIndex > capstoneMountIndex || capstoneMountIndex > workedExamplesMountIndex) {
  fail('portfolio planner must put the interactive project check before the long worked examples');
}

if (/(?:portfolioWorkedExampleCopy|portfolioLocalExampleCopy|portfolioRunnableStarterCopy)/.test(planner)) {
  fail('long static case studies must stay out of the interactive client planner');
}

if (!planner.includes("catch {\n      setBriefCopyState('error');")) {
  fail('portfolio planner copy action must expose a local failure state');
}

if (/(?:\bfetch\s*\(|\bsessionStorage\b|\bindexedDB\b|\bXMLHttpRequest\b)/.test(planner)) {
  fail('portfolio planner must remain local-only without network access or hidden storage systems');
}

for (const token of [
  'rememberProgress',
  'PORTFOLIO_PLANNER_STORAGE_KEY',
  'window.localStorage.setItem',
  'window.localStorage.removeItem',
  'Remember this planning progress in this browser'
]) {
  if (!planner.includes(token)) fail('portfolio planner opt-in resume behavior missing ' + token);
}

for (const token of [
  'TURN A STARTER INTO YOUR WORK',
  'implementationChange',
  'failureCase',
  'runEvidence',
  'contribution',
  'reviewEvidence',
  'validStoredState',
  'state.remember',
  'Self-recorded local status',
  'not independently reviewed'
]) {
  if (!capstone.includes(token)) fail('portfolio capstone contract missing ' + token);
}

if (/(?:\bfetch\s*\(|\bsessionStorage\b|\bindexedDB\b|\bXMLHttpRequest\b|\bsendBeacon\s*\()/.test(capstone)) {
  fail('portfolio capstone must remain local-only without network or telemetry');
}

if (planner.includes('sendBeacon(')) {
  fail('portfolio planner metric details must remain local-only without telemetry');
}

if (!copy.includes("PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS = [\n  'currentWorkaround',\n  'decisionOwner',\n  'errorConsequence',\n  'metricDefinition',\n  'comparisonBaseline'")) {
  fail('portfolio planner needs all five stable metric-contract detail ids');
}

if (!copy.includes("PORTFOLIO_FIRST_RUN_DETAIL_IDS = [\n  'caseIds',\n  'expectedRoute',\n  'actualRoute',\n  'baselineMeasure',\n  'candidateMeasure',\n  'repeatableSteps'")) {
  fail('portfolio planner needs all six stable first-run detail ids');
}

for (const required of [
  "caseIds: ''",
  "expectedRoute: ''",
  "actualRoute: ''",
  "baselineMeasure: ''",
  "candidateMeasure: ''",
  "repeatableSteps: ''",
  "reviewerDecision: 'unknown'",
  "failureNote: ''",
  'function firstRunDetailCount(receipt: FirstRunReceiptState)',
  'function hasCompleteFirstRunReceipt(receipt: FirstRunReceiptState)',
  "receipt.reviewerDecision === 'revise' || receipt.reviewerDecision === 'stop'",
  'Boolean(receipt.failureNote.trim())',
  'const firstRunProject = comparison.chosen;',
  'const firstRunStatus = (() => {',
  'copy.firstRun.planOnly',
  'copy.firstRun.incompleteStatus(firstRunRecordedDetails)',
  'copy.firstRun.needsDecisionStatus',
  'copy.firstRun.needsFailureNoteStatus',
  'copy.firstRun.passStatus',
  'copy.firstRun.reviseStatus',
  'copy.firstRun.stopStatus',
  'const firstRunRequiresFailureNote =',
  'copy.firstRun.notApplicable',
  'PORTFOLIO_FIRST_RUN_DETAIL_IDS.map(detail => {',
  'onChange={event => updateFirstRunReceipt(firstRunProject.index, detail, event.target.value)}',
  'firstRunRequiresFailureNote ? <label',
  "onChange={event => updateFirstRunReceipt(firstRunProject.index, 'failureNote', event.target.value)}",
  '## ${copy.firstRun.heading}',
  'copy.firstRun.statusLabel',
  'id="portfolio-first-run-status"',
  'role="status"'
]) {
  if (!planner.includes(required)) fail('portfolio planner first-run behavior missing ' + required);
}

if ((copy.match(/^    firstRun: \{/gm) ?? []).length !== 4) {
  fail('portfolio planner first-run copy must be localised in every locale');
}

if ((copy.match(/^      notApplicable: /gm) ?? []).length !== 4) {
  fail('portfolio planner first-run copy must explain when a failure note does not apply in every locale');
}

for (const key of ['needsDecisionStatus:', 'needsFailureNoteStatus:']) {
  const matches = copy.match(new RegExp(`^      ${key}`, 'gm')) ?? [];
  if (matches.length !== 4) fail('portfolio planner first-run copy must localise ' + key);
}

for (const detail of ['caseIds', 'expectedRoute', 'actualRoute', 'baselineMeasure', 'candidateMeasure', 'repeatableSteps']) {
  const matches = copy.match(new RegExp(`^        ${detail}: \\{ label:`, 'gm')) ?? [];
  if (matches.length !== 4) fail('portfolio planner first-run copy is missing ' + detail + ' in every locale');
}

for (const phrase of ['PLAN ONLY / NOT_RUN', 'not independently verified', '未經獨立核對', '未经独立核对']) {
  if (!copy.includes(phrase)) fail('portfolio planner first-run copy must keep its self-reported evidence boundary: ' + phrase);
}

for (const required of [
  "currentWorkaround: ''",
  "decisionOwner: ''",
  "errorConsequence: ''",
  "metricDefinition: ''",
  "comparisonBaseline: ''",
  'function metricContractDetailCount(project: ProjectState)',
  'function hasCompleteMetricContract(project: ProjectState)',
  '.filter(candidate => candidate.clearsFloor && candidate.hasCompleteMetricContract)',
  '.filter(candidate => candidate.clearsFloor && !candidate.hasCompleteMetricContract)',
  'PORTFOLIO_METRIC_CONTRACT_DETAIL_IDS.map(detail => {',
  'value={project[detail]}',
  'onChange={event => updateProject(index, detail, event.target.value)}',
  'function metricContractEntries(project?: ProjectState)',
  'metricContractEntries(receiptProject?.project)',
  'copy.needsMeasurementDecision',
  'copy.receiptMetricContract',
  'copy.metricContractStatus'
]) {
  if (!planner.includes(required)) fail('portfolio planner metric-contract behavior missing ' + required);
}

if (planner.includes('const chosen = strongest?.clearsFloor')) {
  fail('a 12/12 project outline must not bypass the metric-contract gate');
}

for (const key of [
  'metricContractHeading:',
  'metricContractHelp:',
  'metricContractStatus:',
  'metricContract:',
  'needsMeasurementDecision:',
  'receiptMetricContract:',
  'notRecorded:',
  'missingMeasurementDetails:',
  'noOpenGaps:'
]) {
  const matches = copy.match(new RegExp(`^    ${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gm')) ?? [];
  if (matches.length !== 4) fail('portfolio planner metric-contract copy is missing a locale value for ' + key);
}

for (const detail of ['currentWorkaround', 'decisionOwner', 'errorConsequence', 'metricDefinition', 'comparisonBaseline']) {
  const matches = copy.match(new RegExp(`^      ${detail}: \\{ label:`, 'gm')) ?? [];
  if (matches.length !== 4) fail('portfolio planner metric-contract copy is missing ' + detail + ' in every locale');
}

for (const [locale, metricDefinition, localOnlyBoundary] of [
  ['en', 'numerator, denominator, observation window, and threshold', 'real business figures'],
  ['zh-HK', '分子、分母、觀察時段同門檻', '真實商業數字'],
  ['zh-TW', '分子、分母、觀察期間和門檻', '真實商業數字'],
  ['zh-Hans', '分子、分母、观察期间和门槛', '真实商业数字']
]) {
  if (!copy.includes(metricDefinition) || !copy.includes(localOnlyBoundary)) {
    fail(`portfolio planner ${locale} must explain the metric definition and anonymous local boundary`);
  }
}

if (copy.includes('GitHub-ready local package')) {
  fail('unpublished reference material must not be presented as GitHub-ready to readers');
}

for (const key of ['copyBrief', 'copyBriefHelp', 'copyBriefSuccess', 'copyBriefError', 'readWorkedExamples', 'workedExamplesEyebrow', 'workedExamplesHeading', 'workedExamplesIntro']) {
  const matches = copy.match(new RegExp('\\b' + key + '\\b', 'g')) ?? [];
  if (matches.length < 5) fail('portfolio planner copy text is missing a locale value for ' + key);
}

const workedExampleCopyStart = copy.indexOf('export const portfolioWorkedExampleCopy');
const localExampleTypeStart = copy.indexOf('type LocalPortfolioExampleLink');
const workedExampleCopy = copy.slice(workedExampleCopyStart, localExampleTypeStart);
if ((workedExampleCopy.match(/^    availability: /gm) ?? []).length !== 4) {
  fail('KEV worked example must have a localised source-availability boundary for every locale.');
}
for (const token of ['fixture-only', 'public repository', 'implementation source package', 'Promptfoo configuration, CI record, and code are not public']) {
  if (!workedExampleCopy.includes(token)) fail('KEV worked example source-availability copy missing ' + token);
}

for (const forbidden of ['The public reference has two configurations', 'CI runs deterministic fixtures, unit tests, and the demo only']) {
  if (copy.includes(forbidden)) fail('KEV worked example must not imply public inspection of unpublished material: ' + forbidden);
}

const requiredShapeIds = ['approval', 'triage', 'draft', 'reliability', 'public-data', 'context-brief'];
const expectedShapeDeclaration = "PORTFOLIO_SHAPE_IDS = ['approval', 'triage', 'draft', 'reliability', 'public-data', 'context-brief']";
if (!copy.includes(expectedShapeDeclaration)) {
  fail('portfolio planner must expose all six local reference shapes in a stable order');
}

for (const shape of requiredShapeIds) {
  const key = shape.includes('-') ? `'${shape}'` : shape;
  const matches = copy.match(new RegExp('\\n\\s*' + key + ':\\s*\\{', 'g')) ?? [];
  if (matches.length !== 4) fail('portfolio planner is missing a localised shape brief for ' + shape);
}

if (!planner.includes('PORTFOLIO_SHAPE_IDS.map(shape => <option')) {
  fail('portfolio planner must present every reference shape in each project selector');
}

console.log('Validated local-only, accessible Markdown copy action for the portfolio evidence planner.');
