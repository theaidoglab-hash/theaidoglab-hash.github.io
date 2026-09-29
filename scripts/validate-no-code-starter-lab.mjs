import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const data = fs.readFileSync(path.join(root, 'lib', 'no-code-starter-lab.ts'), 'utf8');
const component = fs.readFileSync(path.join(root, 'components', 'no-code-starter-lab.tsx'), 'utf8');
const personalCaseData = fs.readFileSync(path.join(root, 'lib', 'no-code-personal-case-builder.ts'), 'utf8');
const personalCaseComponent = fs.readFileSync(path.join(root, 'components', 'no-code-personal-case-builder.tsx'), 'utf8');
const personalCaseGateData = fs.readFileSync(path.join(root, 'lib', 'no-code-personal-case-builder-gate.ts'), 'utf8');
const personalCaseGateComponent = fs.readFileSync(path.join(root, 'components', 'no-code-personal-case-builder-gate.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'app', 'globals.css'), 'utf8');
const page = fs.readFileSync(path.join(root, 'app', '[lang]', 'no-code-starter-lab', 'page.tsx'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'app', 'sitemap.ts'), 'utf8');
const routes = fs.readFileSync(path.join(root, 'lib', 'ai-use-routes.ts'), 'utf8');
const series = fs.readFileSync(path.join(root, 'app', '[lang]', 'series', '[series]', 'page.tsx'), 'utf8');
const search = fs.readFileSync(path.join(root, 'components', 'search.tsx'), 'utf8');
const earlyRoute = fs.readFileSync(path.join(root, 'components', 'early-ai-learning-route.tsx'), 'utf8');
const landingNavigation = fs.readFileSync(path.join(root, 'components', 'landing-roadmap-navigation.tsx'), 'utf8');
const labs = JSON.parse(fs.readFileSync(path.join(root, 'content', 'labs.json'), 'utf8'));
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const beginnerArticleSlugs = ['non-coder-ai-workflow', 'role-aware-ai-learning-source-map'];

function fail(message) {
  throw new Error(`No-code starter lab: ${message}`);
}

for (const file of [data, component, personalCaseGateData, personalCaseGateComponent, page, routes, series]) {
  if (file.includes('content/case-studies/low-code-approval-queue')) {
    fail('must not expose or depend on the internal low-code approval-queue case study');
  }
}

for (const file of [personalCaseData, personalCaseComponent, personalCaseGateData, personalCaseGateComponent]) {
  if (file.includes('fetch(')) fail('the personal-case worksheet must not call a network endpoint');
  if (/(?:window\.)?(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem|clear)/.test(file)) fail('the personal-case worksheet must not retain reader input');
}

if (component.includes("from '@/components/no-code-personal-case-builder';")) {
  fail('the full personal-case worksheet must not be statically imported by the initial starter-lab island');
}
if (!component.includes("import { NoCodePersonalCaseBuilderGate } from '@/components/no-code-personal-case-builder-gate';")
  || !component.includes('<NoCodePersonalCaseBuilderGate locale={locale} />')) {
  fail('the starter lab must retain a reader-owned entry point to the personal-case worksheet');
}
if (component.indexOf('no-code-lab-manual') > component.indexOf('<NoCodePersonalCaseBuilderGate locale={locale} />')) {
  fail('the account-free manual lab must remain available before the optional personal-case worksheet');
}
for (const required of [
  'noCodePersonalCaseBuilderGateCopy',
  "lazy(() =>",
  "import('@/components/no-code-personal-case-builder')",
  'Suspense',
  'NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID',
  'hashchange',
  'scrollIntoView',
  'focus({ preventScroll: true })',
  'showHeader={false}',
  'headingId={NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID}',
  'onReady={handleBuilderReady}',
  "document.getElementById('no-code-personal-case-businessSituation')",
  'role="status"',
  'aria-live="polite"'
]) {
  if (!personalCaseGateComponent.includes(required)) fail(`lazy personal-case entry point is missing ${required}`);
}
for (const locale of ["'zh-HK'", "'zh-TW'", "'zh-Hans'", 'en']) {
  if (!personalCaseGateData.includes(`${locale}: {`)) fail(`missing ${locale} localized personal-case activation copy`);
}
for (const required of [
  'getNoCodePersonalCaseCopy',
  'createNoCodePersonalCaseInput',
  'validateNoCodePersonalCaseInput',
  'getNoCodePersonalCaseMissingFieldLabels',
  'buildNoCodePersonalCaseEvidencePack',
  'buildNoCodePersonalCasePlanFirstPrompt',
  'NO_CODE_PERSONAL_CASE_ROUTES',
  'docs/brief.md',
  'docs/data-receipt.md',
  'eval/cases.md',
  'docs/reviewer-record.md',
  'README.md',
  'docs/nonclaims.md',
  'Complete permitted record',
  'Missing required field',
  'Conflicting values',
  'Instruction-looking text in data',
  'Request for real material',
  'Request for an external action',
  'expectedRoute',
  'observedRoute',
  'reasonOrFailureNote',
  'reviewerRole',
  'reviewerDate',
  'unresolvedIssue',
  'Fixed expected route',
  'Observed route',
  'Reason or failure note',
  'Reviewer role',
  'Review date',
  'Unresolved question',
  'Do not browse, use tools, connectors, files, a shell, network access, or any external action.',
  'This is a plan for a local draft only.',
  'No hiring, revenue, time-saving, risk, compliance, or business-outcome claim is made.'
]) {
  if (!personalCaseData.includes(required)) fail(`personal-case worksheet is missing a required local-only condition: ${required}`);
}
for (const required of [
  'reviewerRecordReady',
  'validation.complete',
  'missingFieldLabels',
  'CaseRecord',
  'NO_CODE_PERSONAL_CASE_ROUTES.map',
  '<select',
  'type="checkbox"',
  'navigator.clipboard.writeText',
  'new Blob',
  'role="region"',
  'aria-live="polite"',
  'no-code-personal-case-files',
  'no-code-personal-case-gate'
]) {
  if (!personalCaseComponent.includes(required)) fail(`personal-case worksheet is missing its gated, accessible local interaction: ${required}`);
}

for (const locale of ["'zh-HK'", "'zh-TW'", "'zh-Hans'", 'en']) {
  if (!data.includes(`${locale}: {`)) fail(`missing ${locale} localized lab copy`);
}

if ((data.match(/^    firstRun: \{/gm)?.length ?? 0) !== 4
  || (data.match(/^      fullExerciseAction:/gm)?.length ?? 0) !== 4
  || (data.match(/^    quickLinks: \{[^}]*fullExercise:/gm)?.length ?? 0) !== 4) {
  fail('every locale must distinguish the AC-01 minimum check from the fuller six-case exercise');
}
for (const required of [
  '15 分鐘最小完成定義：AC-01',
  '15 分钟最小完成定义：AC-01',
  '15-minute minimum completion: retain HLS-001',
  '先完成 AC-01（15 分鐘）；其餘五個案例是完整練習',
  '先完成 AC-01（15 分钟）；其余五个案例是完整练习',
  'Finish AC-01 in 15 minutes; the other five cases are the fuller exercise'
]) {
  if (!data.includes(required)) fail(`missing the localized AC-01 minimum-completion boundary: ${required}`);
}

if ((data.match(/^    practiceMap: \{/gm)?.length ?? 0) !== 4) {
  fail('every locale must explain both workflow practice and delivery judgment on the direct lab page');
}
for (const evidenceMapLabel of [
  '技術證據：資料、固定案例同 route',
  '工作判斷證據：範圍、權限同人手決定',
  '技術證據：資料、固定案例與 route',
  '工作判斷證據：範圍、權限與人工決定',
  '技术证据：数据、固定案例与 route',
  '工作判断证据：范围、权限与人工决定',
  'Technical evidence: data, fixed cases, and routes',
  'Decision evidence: scope, permission, and human ownership'
]) {
  if (!data.includes(evidenceMapLabel)) fail(`missing localized technical or decision-evidence label: ${evidenceMapLabel}`);
}
if ((data.match(/^    workingTerms: \{/gm)?.length ?? 0) !== 4) {
  fail('every locale must explain the working terms before the direct lab steps');
}
if ((data.match(/^    answerReveal: \{/gm)?.length ?? 0) !== 4) {
  fail('every locale must keep reference answers behind a deliberate reveal');
}
if ((data.match(/^    reviewSample: \{/gm)?.length ?? 0) !== 4) {
  fail('every locale must include the fixed model-shaped review sample');
}
if ((data.match(/^    manualRecordAction:/gm)?.length ?? 0) !== 4) {
  fail('every locale must provide a direct route to the in-place reviewer-record template');
}
if ((data.match(/^    manualRecordHint:/gm)?.length ?? 0) !== 4 || (data.match(/^    manualRecordCopy:/gm)?.length ?? 0) !== 4) {
  fail('every locale must explain that the reviewer record is a local template and provide a direct copy action');
}

for (const mobileTableHint of [
  '喺手機睇表時，向左／右滑動或捲動，先睇到全部欄位。',
  '手機查看表格時，請向左／右滑動或捲動，查看所有欄位。',
  '手机查看表格时，请向左／右滑动或滚动，查看所有栏位。',
  'On a phone, swipe or scroll sideways to view every column.'
]) {
  if (!data.includes(mobileTableHint)) fail(`missing localized mobile table-scroll hint: ${mobileTableHint}`);
}

for (const id of ['brief', 'acceptanceCases', 'permissionReceipt', 'reviewerRubric', 'reviewerRecord']) {
  const count = data.match(new RegExp(`asset\\('${id}'`, 'g'))?.length ?? 0;
  if (count !== 4) fail(`expected four localized ${id} assets, found ${count}`);
}

const acceptanceWorksheets = [...data.matchAll(/asset\('acceptanceCases',[\s\S]*?\]\),/g)];
const reviewerRecords = [...data.matchAll(/asset\('reviewerRecord',[\s\S]*?\]\)/g)];
if (acceptanceWorksheets.length !== 4 || reviewerRecords.length !== 4) {
  fail('must keep four localized manual worksheets and reviewer records');
}
for (const worksheet of acceptanceWorksheets) {
  if (/Expected route:|預期 route：/.test(worksheet[0])) {
    fail('manual acceptance worksheets must not reveal a route before the reader records their own judgment');
  }
}
for (const record of reviewerRecords) {
  if (/\| AC-0[1-6] \| (DRAFT_REVIEW_NOTE|HANDOFF|BLOCKED) \|/.test(record[0])) {
    fail('manual reviewer records must leave the pre-reference route blank');
  }
}

for (const required of [
  'HLS-003-REVISION',
  "id: 'AC-01'",
  "id: 'AC-02'",
  "id: 'AC-03'",
  "id: 'AC-04'",
  "id: 'AC-05'",
  "id: 'AC-06'",
  'Use a real spreadsheet, account, or connector instead of the supplied synthetic material.',
  'Use this draft to order, notify a supplier, or update stock.',
  'Final local decision: PASS / REVISE / STOP',
  'Complete the manual answers first.',
  'Only compare if you already have an account',
  'Return five items:',
  'gpt-5-mini',
  'it was never sent to a model and is not a model output',
  'Download the complete offline starter pack'
]) {
  if (!data.includes(required)) fail(`missing self-contained manual or optional-chat condition: ${required}`);
}

if (!data.includes('## ${copy.draftPromptCsvHeading}') || !data.includes('## ${copy.draftPromptTestInputHeading}')) {
  fail('draft prompt must compose locale-specific reader-facing headings');
}
if (!component.includes('## ${copy.draftPromptCsvHeading}')) {
  fail('plan prompt must compose a locale-specific reader-facing CSV heading');
}
const glossaryIndex = component.indexOf('<section className="no-code-lab-working-terms"');
const firstDownloadIndex = component.indexOf('<div className="no-code-lab-source-pack">');
const firstRunIndex = component.indexOf('<FirstRun');
if (glossaryIndex === -1 || firstDownloadIndex === -1 || firstRunIndex === -1
  || glossaryIndex > firstRunIndex || firstRunIndex > firstDownloadIndex) {
  fail('plain-language working terms must appear before the account-free first run, which must appear before optional downloads');
}
for (const requiredTerm of [
  '人手參考答案（manual baseline）',
  '交回人處理（HANDOFF）',
  '外部連接（connector）',
  '操作權限（permission）',
  '手動參考答案（manual baseline）',
  '交回人工處理（HANDOFF）',
  '手动参考答案（manual baseline）',
  '交回人工处理（HANDOFF）',
  '外部连接（connector）',
  '操作权限（permission）',
  'Manual baseline',
  'Connector',
  'Permission',
]) {
  if (!data.includes(requiredTerm)) fail(`beginner glossary is missing ${requiredTerm}`);
}

const localizedBlocks = [
  { locale: "'zh-HK'", nextLocale: "'zh-TW'", required: [
    '# 本地 No-code 工作流程簡介', '# 驗收案例', '# 本地權限確認單', '# Reviewer 檢查表', '# 本地 Reviewer 記錄',
    '只使用提供嘅合成 CSV 第 HLS-001 行。', '你正協助完成一項本地學習練習。',
    "draftPromptCsvHeading: '合成 CSV（只限允許資料）'", "draftPromptTestInputHeading: '合成測試輸入'", "draftPromptCaseIdLabel: '案例 ID'"
  ] },
  { locale: "'zh-TW'", nextLocale: "'zh-Hans'", required: [
    '# 本地 No-code 工作流程簡介', '# 驗收案例', '# 本機權限確認單', '# Reviewer 檢查表', '# 本機 Reviewer 紀錄',
    '只使用提供的合成 CSV 第 HLS-001 列。', '你正在協助完成一項本機學習練習。',
    "draftPromptCsvHeading: '合成 CSV（只限允許資料）'", "draftPromptTestInputHeading: '合成測試輸入'", "draftPromptCaseIdLabel: '案例 ID'"
  ] },
  { locale: "'zh-Hans'", nextLocale: 'en', required: [
    '# 本地 No-code 工作流程简介', '# 验收案例', '# 本地权限确认单', '# Reviewer 检查表', '# 本地 Reviewer 记录',
    '只使用提供的合成 CSV 第 HLS-001 行。', '你正在协助完成一项本地学习练习。',
    "draftPromptCsvHeading: '合成 CSV（仅限允许资料）'", "draftPromptTestInputHeading: '合成测试输入'", "draftPromptCaseIdLabel: '案例 ID'"
  ] }
];

for (const { locale, nextLocale, required } of localizedBlocks) {
  const start = data.indexOf(`${locale}: {`);
  const end = data.indexOf(`${nextLocale}: {`, start + 1);
  if (start === -1 || end === -1) fail(`cannot isolate ${locale} localized workpapers`);
  const block = data.slice(start, end);
  for (const text of required) {
    if (!block.includes(text)) fail(`${locale} workpapers must retain localized reader-facing text: ${text}`);
  }
  for (const token of ['synthetic-approved-local-only', 'DRAFT_REVIEW_NOTE', 'HANDOFF', 'BLOCKED', 'PASS / REVISE / STOP']) {
    if (!block.includes(token)) fail(`${locale} workpapers must preserve the stable token: ${token}`);
  }
  for (const englishOnlyText of ['# Local No-code Workflow Brief', '# Acceptance Cases', 'You are helping with a local learning exercise.']) {
    if (block.includes(englishOnlyText)) fail(`${locale} workpapers must not regress to English-only reader-facing text: ${englishOnlyText}`);
  }
}

for (const required of [
  "draftPromptCsvHeading: 'Synthetic CSV (allowed data only)'",
  "draftPromptTestInputHeading: 'Synthetic test input'",
  "draftPromptCaseIdLabel: 'Case ID'"
]) {
  if (!data.includes(required)) fail(`English prompt heading regressed: ${required}`);
}

for (const id of ['AC-01', 'AC-02', 'AC-03', 'AC-04', 'AC-05', 'AC-06']) {
  const count = data.match(new RegExp(`id: '${id}'`, 'g'))?.length ?? 0;
  if (count !== 4) fail(`expected four localized exact inputs for ${id}, found ${count}`);
}

for (const required of [
  'synthetic-approved-local-only',
  'DRAFT_REVIEW_NOTE',
  'HANDOFF',
  'BLOCKED',
  'Do not access files, apps, accounts, connectors, browser sessions, APIs, the internet, or tools.',
  'Do not run commands.',
  'Do not create an automation, send a message, write a record, place an order, or change inventory.'
]) {
  if (!data.includes(required)) fail(`missing bounded-workflow condition: ${required}`);
}

for (const required of [
  "navigator.clipboard.writeText",
  'useEffect',
  'useRef',
  'showCopyState',
  'window.setTimeout',
  'setCopyFeedback(null)',
  'new Blob',
  'downloadText',
  'role="region"',
  'aria-live="polite"',
  'aria-atomic="true"',
  'noCodeStarterLabCsv',
  'no-code-lab-manual',
  'no-code-lab-working-terms',
  'no-code-lab-answer-reveal',
  'StaticDraftReview',
  'no-code-lab-source-pack',
  'sourcePackHref',
  'starter-lab-practice-map',
  'copy.practiceMap.workflowTitle',
  'copy.practiceMap.decisionTitle',
  'planPrompt'
]) {
  if (!component.includes(required)) fail(`missing copy/download or accessible inspection affordance: ${required}`);
}
for (const required of [
  'id={`no-code-lab-asset-${asset.id}`}',
  'copy.manualRecordAction',
  'copy.manualRecordHint',
  'copy.manualRecordCopy',
  "copyText('manual-record', reviewerRecord.content)",
  'const reviewerRecord = copy.assets.find(asset => asset.id === \'reviewerRecord\')',
  'no-code-lab-inline-record',
  '<pre role="region" aria-label={reviewerRecord.title}'
]) {
  if (!component.includes(required)) fail(`manual learner route is missing its in-place reviewer-record action: ${required}`);
}
if (component.includes('href="#no-code-lab-asset-reviewerRecord"')) {
  fail('manual learner route must not jump away from the first case to find the reviewer record');
}
const manualFirstAction = component.indexOf('<a className="button secondary" href="#no-code-lab-case-ac-01">{firstRun.manualAction}</a>');
const fullExerciseAction = component.indexOf('<a className="button secondary" href="#no-code-lab-manual-title">{firstRun.fullExerciseAction}</a>');
const manualSectionIndex = component.indexOf('<section className="no-code-lab-section no-code-lab-manual"');
const assetsSectionIndex = component.indexOf('<section className="no-code-lab-section" aria-labelledby="no-code-lab-assets-title">');
const optionalChatSectionIndex = component.indexOf('<section className="no-code-lab-section no-code-lab-prompt-section"');
if (manualFirstAction === -1 || fullExerciseAction === -1 || manualSectionIndex === -1 || assetsSectionIndex === -1 || optionalChatSectionIndex === -1
  || manualFirstAction > fullExerciseAction || manualSectionIndex > assetsSectionIndex || manualSectionIndex > optionalChatSectionIndex
  || !component.includes('id={`no-code-lab-case-${testCase.id.toLowerCase()}`}')) {
  fail('the account-free AC-01 route and full six-case extension must appear before the optional chat comparison');
}
if (component.includes('no-code-lab-optional-note')) {
  fail('the optional chat comparison must not interrupt the manual AC-01-to-AC-06 exercise');
}
if (!page.includes("const sourcePackPath = 'templates/no-code-starter-lab/v1/no-code-starter-lab-source-pack.md';")
  || !page.includes("isReleaseAssetEnabledInCurrentBuild('templates', sourcePackPath)")) {
  fail('the scoped route must expose the offline source pack only when that exact template asset is selected');
}
if (component.includes('fetch(')) fail('must not call a network endpoint');
const copyStatusStyle = styles.match(/\.no-code-lab-copy-status\s*\{([^}]*)\}/)?.[1] ?? '';
for (const required of ['width: min(100%, 480px)', 'margin: 10px 0 0', 'pointer-events: none']) {
  if (!copyStatusStyle.includes(required)) fail(`copy status must remain a compact local action notice: ${required}`);
}
if (copyStatusStyle.includes('position: fixed')) fail('copy status must remain beside the action that triggered it');
for (const required of ['type CopyFeedback', 'feedback?.target !== target', '<CopyStatus', "copyText('csv'", "copyText('plan-prompt'"]) {
  if (!component.includes(required)) fail(`copy feedback must identify and render beside its action group: ${required}`);
}
for (const required of ['.starter-lab-practice-map {', '.starter-lab-practice-map-grid {', '.no-code-lab-working-terms {', '.no-code-lab-answer-reveal {', '.no-code-lab-review-sample-grid {', 'grid-template-columns: repeat(2, minmax(0, 1fr))']) {
  if (!styles.includes(required)) fail(`direct lab must retain its accessible workflow-and-decision map: ${required}`);
}
for (const required of ['.no-code-personal-case-builder {', '.no-code-personal-case-builder-gate-shell {', '.no-code-personal-case-builder-activation {', '.no-code-personal-case-builder-loading {', '.no-code-personal-case-section, .no-code-personal-case-fixed-cases {', '.no-code-personal-case-files {', '.no-code-personal-case-gate {', '.no-code-personal-case-copy-status {']) {
  if (!styles.includes(required)) fail(`personal-case worksheet needs the readable local-workpaper layout: ${required}`);
}
const personalCopyStatusStyle = styles.match(/\.no-code-personal-case-copy-status\s*\{([^}]*)\}/)?.[1] ?? '';
if (personalCopyStatusStyle.includes('position: fixed')) fail('personal-case copy status must remain beside the action that triggered it');
for (const required of ['type CopyFeedback', 'feedback?.target !== target', '<CopyStatus', "copyText('plan-prompt'", "copyText('prototype-handoff'"]) {
  if (!personalCaseComponent.includes(required)) fail(`personal-case copy feedback must identify and render beside its action group: ${required}`);
}
if (!page.includes('NoCodeStarterLab')
  || !page.includes('isLocale(lang)')
  || !page.includes('const path = `/${lang}/no-code-starter-lab`;')
  || !page.includes('localizedAlternates(path)')) {
  fail('missing localized public route');
}
if (!sitemap.includes('LOCALES.map')
  || !sitemap.includes('localizedEntries(origin')
  || !sitemap.includes("'/no-code-starter-lab'")) {
  fail('sitemap must enumerate the localized no-code starter-lab route');
}
if (!routes.includes("href: '/no-code-starter-lab'") || !series.includes('track.starterLab.href') || !series.includes("labHref: '/no-code-starter-lab#no-code-lab-manual-title'")) {
  fail('no-code route does not expose the starter lab');
}
for (const [name, source] of Object.entries({ search, earlyRoute, landingNavigation })) {
  if (!source.includes('#no-code-lab-manual-title') || source.includes('#no-code-lab-first-run-title')) {
    fail(`${name} must send first-time no-code learners to the manual, no-account exercise`);
  }
}
for (const slug of beginnerArticleSlugs) {
  for (const locale of locales) {
    const article = fs.readFileSync(path.join(root, 'content', 'articles', slug, `${locale}.mdx`), 'utf8');
    const manualHref = `/${locale}/no-code-starter-lab#no-code-lab-manual-title`;
    if (article.includes('#no-code-lab-first-run-title') || !article.includes(manualHref)) {
      fail(`${slug}/${locale} must send beginner CTAs to the no-account manual route`);
    }
    const manualCta = new RegExp(`\\[[^\\]]*AC-01[^\\]]*\\]\\(${manualHref.replace(/[./-]/g, '\\$&')}\\)`);
    if (!manualCta.test(article)) fail(`${slug}/${locale} must label the manual CTA as the AC-01 first step`);
  }
}

const buildLab = labs.find(lab => lab.id === 'build-lab');
if (!buildLab) fail('missing build-lab listing');
for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans', 'en']) {
  const kits = buildLab.translations?.[locale]?.kits ?? [];
  const matches = kits.filter(kit => kit.title === 'No-code Starter Lab');
  if (matches.length !== 1) fail(`${locale} build-lab must include No-code Starter Lab exactly once`);
  const [kit] = matches;
  if (kit.internalRoute !== '/no-code-starter-lab' || kit.articleSlug) fail(`${locale} starter lab must use the bounded internal route`);
  if (!kit.demonstrates?.technical?.length || !kit.demonstrates?.nonTechnical?.length) fail(`${locale} starter lab lacks its demonstration map`);
}

console.log('Validated the account-free manual no-code starter lab, its supplied cases, personal local-workpaper builder, reviewer gate, optional bounded chat prompt, and learning-route integration.');
