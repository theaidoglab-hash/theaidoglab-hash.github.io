import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const data = fs.readFileSync(path.join(root, 'lib', 'coding-starter-lab.ts'), 'utf8');
const component = fs.readFileSync(path.join(root, 'components', 'coding-starter-lab.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'app', 'globals.css'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app', '[lang]', 'coding-starter-lab', 'page.tsx'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'app', 'sitemap.ts'), 'utf8');
const routes = fs.readFileSync(path.join(root, 'lib', 'ai-use-routes.ts'), 'utf8');
const series = fs.readFileSync(path.join(root, 'app', '[lang]', 'series', '[series]', 'page.tsx'), 'utf8');
const labSelector = fs.readFileSync(path.join(root, 'lib', 'build-lab-case-selector.ts'), 'utf8');
const contentValidator = fs.readFileSync(path.join(root, 'scripts', 'validate-content.mjs'), 'utf8');
const internalLinks = fs.readFileSync(path.join(root, 'scripts', 'validate-internal-content-links.mjs'), 'utf8');
const labs = JSON.parse(fs.readFileSync(path.join(root, 'content', 'labs.json'), 'utf8'));

function fail(message) {
  throw new Error(`Coding starter lab: ${message}`);
}

for (const locale of ["'zh-HK'", "'zh-TW'", "'zh-Hans'", 'en']) {
  if (!data.includes(`${locale}: {`)) fail(`missing ${locale} localized lab copy`);
}

for (const required of [
  '「純函式」（pure function）',
  '應用程式介面金鑰（API key）',
  '程式碼倉庫（repository）',
  '改動說明（change brief）',
  '固定案例（fixed cases）',
  '最小程式差異（diff）',
  '連接器（connector）',
  '寫入權限（write permission）',
  '“纯函数”（pure function）',
  '应用程序接口密钥（API key）',
  '代码仓库（repository）'
]) {
  if (!data.includes(required)) fail(`missing plain-language first-use explanation: ${required}`);
}

for (const staleCopy of [
  '寫 Code 入門練習',
  '写 Code 入门练习',
  '由 change brief 找出',
  '從 change brief 找出',
  '从 change brief 找出'
]) {
  if (data.includes(staleCopy)) fail(`unexplained first-screen jargon remains: ${staleCopy}`);
}

if ((data.match(/^    practiceMap: \{/gm)?.length ?? 0) !== 4) {
  fail('every locale must explain both code practice and delivery judgment on the direct lab page');
}
if ((data.match(/^    quickStart: \{/gm)?.length ?? 0) !== 4) {
  fail('every locale must provide the bounded 15-minute coding start');
}

for (const assetId of ['readme', 'brief', 'sourceSkeleton', 'testCases', 'referenceAnswers', 'agentPrompt', 'reviewerRollbackRecord']) {
  const count = data.match(new RegExp(`asset\\('${assetId}'`, 'g'))?.length ?? 0;
  if (count !== 1) fail(`expected one English ${assetId} source asset, found ${count}`);
}

for (const required of [
  'README.md',
  'CHANGE_BRIEF.md',
  'src/review-route.ts',
  'tests/review-route.cases.ts',
  'tests/review-route.reference.ts',
  'AGENT_PROMPT.md',
  'REVIEWER_ROLLBACK_RECORD.md',
  'fictional, disposable pure-function change',
  'dataScope !== "synthetic-only"',
  'externalActionRequested === true',
  "'TC-06-blocking-wins-over-missing-reviewer': 'BLOCKED'",
  'Reveal only after recording your own baseline',
  'TC-06-blocking-wins-over-missing-reviewer',
  'Do not access the internet, files outside the supplied text, accounts, browser sessions, terminals, tools, APIs, connectors, package registries, or version-control services.',
  'Do not run commands, install packages, create, modify, delete, upload, commit, publish, deploy, send a message, or take any external action.',
  'Return only:',
  'a short plan',
  'one minimal unified diff',
  'proposed checks for every fixed case',
  'Final local decision: PASS / REVISE / STOP',
  'Rollback or discard',
  'Return to the supplied starter skeleton'
]) {
  if (!data.includes(required)) fail(`missing bounded source-pack condition: ${required}`);
}

const caseInputsStart = data.indexOf("asset('testCases'");
const referenceAnswersStart = data.indexOf("asset('referenceAnswers'");
const caseInputs = data.slice(caseInputsStart, referenceAnswersStart);
if (caseInputsStart < 0 || referenceAnswersStart < 0 || /\bexpected\s*:/.test(caseInputs)) {
  fail('fixed case inputs must not reveal expected routes before the separate reference-answer asset');
}

const sourceAssetsStart = data.indexOf('export const codingStarterLabSourceAssets');
const sourceAssetsEnd = data.indexOf('export const codingStarterLabReferenceAnswer');
const sourceAssetsBlock = data.slice(sourceAssetsStart, sourceAssetsEnd);
if (sourceAssetsStart < 0 || sourceAssetsEnd < 0 || sourceAssetsBlock.includes("asset('referenceAnswers'")) {
  fail('reference answers must remain separate from the learner source assets');
}
if ((sourceAssetsBlock.match(/\basset\('/g) ?? []).length !== 6) {
  fail('the visible learner source pack must contain exactly six source assets before the separate reference answer');
}
for (const required of [
  '六份英文來源檔，另有一份延後顯示的參考答案',
  '六份英文源文件，另有一份延后显示的参考答案',
  'Six English source assets, plus a gated reference answer',
  '第七份是獨立參考答案',
  '第七份是独立参考答案',
  'A seventh file—the separate reference answers—appears only after you confirm the manual baseline.'
]) {
  if (!data.includes(required)) fail(`missing clear six-source-plus-gated-reference explanation: ${required}`);
}

for (const staleCopy of [
  '只下載呢六份 source asset',
  '只下載這六份 source asset',
  '只下载这六份 source asset',
  'Download only these six source assets'
]) {
  if (data.includes(staleCopy)) fail(`stale six-source-asset copy remains: ${staleCopy}`);
}

for (const forbidden of ['https://', 'http://', 'process.env', 'OPENAI_API_KEY', 'fetch(']) {
  if (data.includes(forbidden)) fail(`source assets must not include ${forbidden}`);
}

for (const required of [
  'navigator.clipboard.writeText',
  'useEffect',
  'useRef',
  'showCopyState',
  'window.setTimeout',
  'setCopyFeedback(null)',
  'new Blob',
  'downloadText',
  'role="region"',
  'tabIndex={0}',
  'role="status"',
  'aria-live="polite"',
  'aria-atomic="true"',
  'codingStarterLabAssets',
  'codingStarterLabReferenceAsset',
  'codingStarterLabSourcePack',
  'codingStarterLabAgentPromptPack',
  'starter-lab-practice-map',
  'copy.practiceMap.workflowTitle',
  'copy.practiceMap.decisionTitle',
  'coding-starter-lab-quick-title',
  'copy.quickStart.eyebrow',
  'copy.quickStart.steps',
  'copy.quickStart.referenceTitle',
  'copy.quickStart.reference',
  'copy.quickStart.boundary',
  'copy.quickStart.fullLabAction',
  'AGENT_PROMPT_PACK.md',
  'baselineRecorded',
  'answersRevealed',
  'disabled={!baselineRecorded}',
  'aria-controls="coding-starter-lab-reference-reveal"',
  'coding-starter-lab-reference-title',
  'copy.referenceGateConfirmation',
  'copy.referenceGateAction',
  'copy.referenceGateRevealed',
  'referenceReveal.current?.focus()'
]) {
  if (!component.includes(required)) fail(`missing local copy/download or accessible inspection affordance: ${required}`);
}
if (component.includes('fetch(')) fail('component must not call a network endpoint');
const copyStatusStyle = styles.match(/\.no-code-lab-copy-status\s*\{([^}]*)\}/)?.[1] ?? '';
for (const required of ['width: min(100%, 480px)', 'margin: 10px 0 0', 'pointer-events: none']) {
  if (!copyStatusStyle.includes(required)) fail(`copy status must remain a compact local action notice: ${required}`);
}
if (copyStatusStyle.includes('position: fixed')) fail('copy status must remain beside the action that triggered it');
for (const required of ['type CopyFeedback', 'feedback?.target !== target', '<CopyStatus', "copyText('source-pack'", "copyText('agent-prompt-pack'"]) {
  if (!component.includes(required)) fail(`copy feedback must identify and render beside its action group: ${required}`);
}
for (const required of ['.starter-lab-practice-map {', '.starter-lab-practice-map-grid {', 'grid-template-columns: repeat(2, minmax(0, 1fr))']) {
  if (!styles.includes(required)) fail(`direct lab must retain its accessible code-and-decision map: ${required}`);
}

for (const required of [
  'codingStarterLabAgentPromptPack',
  "['agentPrompt', 'brief', 'sourceSkeleton', 'testCases'] as const",
  '--- ${source.fileName} ---'
]) {
  if (!data.includes(required)) fail(`agent prompt pack must include supplied context: ${required}`);
}
const promptPackStart = data.indexOf('export function codingStarterLabAgentPromptPack()');
const promptPack = data.slice(promptPackStart);
if (promptPackStart < 0 || promptPack.includes("'referenceAnswers'")) {
  fail('agent prompt pack must remain answer-free even after the reference is revealed separately');
}

for (const required of [
  'The learner source pack and agent prompt pack deliberately omit the answers.',
  'the site does not store or verify it.',
  'Reference answers revealed.',
  'codingStarterLabReferenceAnswer',
  'codingStarterLabReferenceAsset'
]) {
  if (!data.includes(required)) fail(`missing explicit post-baseline answer-gate contract: ${required}`);
}

for (const localizedEyebrow of ['sectionEyebrows.setup', 'sectionEyebrows.assets', 'sectionEyebrows.manual', 'sectionEyebrows.reference', 'sectionEyebrows.prompt', 'sectionEyebrows.output', 'sectionEyebrows.handoff']) {
  if (!component.includes(localizedEyebrow)) fail(`missing localized section eyebrow: ${localizedEyebrow}`);
}

if (!page.includes('CodingStarterLab')
  || !page.includes('isLocale(lang)')
  || !page.includes('const path = `/${lang}/coding-starter-lab`;')
  || !page.includes('localizedAlternates(path)')) {
  fail('missing localized public route');
}
if (!sitemap.includes("'/coding-starter-lab'")) fail('sitemap must enumerate the localized coding starter-lab route');
if (!internalLinks.includes("'coding-starter-lab'")) fail('internal-link validator must recognise the route');
if (!routes.includes("href: '/coding-starter-lab'")) fail('coder route does not expose the starter lab');
if (!series.includes('track.starterLab.href')) fail('starter-lab renderer must use each track route rather than a hard-coded no-code route');
if (!labSelector.includes("'coding-starter'") || !labSelector.includes("href: '/coding-starter-lab'")) fail('build-lab selector must offer the coding starter lab');
if (!contentValidator.includes("'/coding-starter-lab'") || !contentValidator.includes("['Coder Starter Lab', { internalRoute: '/coding-starter-lab' }]")) {
  fail('content validator must recognise the coding starter-lab package route');
}

const buildLab = labs.find(lab => lab.id === 'build-lab');
if (!buildLab) fail('missing build-lab listing');
for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans', 'en']) {
  const kits = buildLab.translations?.[locale]?.kits ?? [];
  const matches = kits.filter(kit => kit.title === 'Coder Starter Lab');
  if (matches.length !== 1) fail(`${locale} build-lab must include Coder Starter Lab exactly once`);
  const [kit] = matches;
  if (kit.internalRoute !== '/coding-starter-lab' || kit.articleSlug) fail(`${locale} starter lab must use the bounded internal route`);
  if (!kit.demonstrates?.technical?.length || !kit.demonstrates?.nonTechnical?.length) fail(`${locale} starter lab lacks its demonstration map`);
}

console.log('Validated the local-only Coder Starter Lab, answer-free learner and prompt packs, accessible post-baseline reference reveal, reviewer rollback record, and route integration.');
