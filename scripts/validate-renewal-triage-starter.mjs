import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const starterRoot = path.join(root, 'public', 'templates', 'renewal-triage-starter', 'v1');
const workedExamples = fs.readFileSync(path.join(root, 'components', 'portfolio-worked-examples.tsx'), 'utf8');
const copy = fs.readFileSync(path.join(root, 'lib', 'portfolio-evidence-planner.ts'), 'utf8');
const receiptComponent = fs.readFileSync(path.join(root, 'components', 'portfolio-verification-receipt.tsx'), 'utf8');
const labsPage = fs.readFileSync(path.join(root, 'app', '[lang]', 'labs', 'page.tsx'), 'utf8');
const articlePage = fs.readFileSync(path.join(root, 'app', '[lang]', 'articles', '[slug]', 'page.tsx'), 'utf8');
const receipts = JSON.parse(fs.readFileSync(path.join(root, 'content', 'portfolio-example-receipts.json'), 'utf8'));

function fail(message) {
  throw new Error(`Renewal Triage starter: ${message}`);
}

for (const relativePath of [
  'README.md',
  'package.json',
  'expected-output.json',
  'data/request-fixtures.mjs',
  'data/synthetic-renewal-snapshot.mjs',
  'src/contracts.mjs',
  'src/fixture-validation.mjs',
  'src/queue.mjs',
  'src/route-renewal-triage.mjs',
  'tests/renewal-triage.test.mjs',
  'scripts/demo.mjs',
  'docs/decision-brief.md',
  'docs/metric-map.md',
  'docs/failure-cases.md',
  'docs/reviewer-decision.md',
  'docs/rollback-record.md',
  'docs/adaptation-worksheet.md',
  'docs/future-model-seam.md',
  'renewal-triage-starter-v1.zip'
]) {
  const file = path.join(starterRoot, relativePath);
  if (!fs.existsSync(file)) fail(`missing ${relativePath}`);
}

const archive = fs.statSync(path.join(starterRoot, 'renewal-triage-starter-v1.zip'));
if (archive.size < 1_000) fail('download archive is unexpectedly small');

const manifest = JSON.parse(fs.readFileSync(path.join(starterRoot, 'package.json'), 'utf8'));
if (manifest.type !== 'module' || manifest.engines?.node !== '>=20') fail('package must remain dependency-free Node 20+ ESM');
if (manifest.scripts?.test !== 'node --test tests/renewal-triage.test.mjs' || manifest.scripts?.demo !== 'node scripts/demo.mjs') {
  fail('package must keep its repeatable test and demo commands');
}
if (manifest.dependencies || manifest.devDependencies) fail('starter must not add package dependencies');

const readme = fs.readFileSync(path.join(starterRoot, 'README.md'), 'utf8');
for (const phrase of [
  'invented records only',
  'not a production renewal system',
  'no third-party dependencies',
  'synthetic business-priority value',
  'does not prove model quality, business impact, security, privacy approval, production readiness, or suitability for live data'
]) {
  if (!readme.toLowerCase().includes(phrase.toLowerCase())) fail(`README missing scope boundary: ${phrase}`);
}

for (const relativePath of [
  'data/request-fixtures.mjs',
  'data/synthetic-renewal-snapshot.mjs',
  'src/contracts.mjs',
  'src/fixture-validation.mjs',
  'src/queue.mjs',
  'src/route-renewal-triage.mjs',
  'scripts/demo.mjs'
]) {
  const source = fs.readFileSync(path.join(starterRoot, relativePath), 'utf8');
  if (/\bfetch\s*\(|https?:\/\/|process\.env|OPENAI|api[_-]?key/i.test(source)) {
    fail(`${relativePath} must stay local with no credential or network path`);
  }
}

const futureSeam = fs.readFileSync(path.join(starterRoot, 'docs', 'future-model-seam.md'), 'utf8');
for (const phrase of ['gpt-5-mini', 'Promptfoo-style cases', 'design note only', 'no key, provider setup, SDK, request, response, model output']) {
  if (!futureSeam.includes(phrase)) fail(`future model seam missing honest boundary: ${phrase}`);
}

for (const token of [
  'portfolioRunnableStarterCopy',
  'RunnablePortfolioStarter',
  'renewal-triage-starter-v1.zip',
  'download href={starter.downloadHref}',
  'starter.technicalHeading',
  'starter.deliveryHeading',
  'starter.nextText'
]) {
  if (!workedExamples.includes(token) && !copy.includes(token)) fail(`planner does not expose ${token}`);
}

for (const locale of ["'zh-HK'", "'zh-TW'", "'zh-Hans'", 'en']) {
  if (!copy.includes(`${locale}: {`)) fail(`missing ${locale} copy`);
}

const renewalReceipt = receipts.receipts?.find((receipt) => receipt.exampleId === 'renewal-triage');
const readerStarter = renewalReceipt?.readerStarter;
if (!readerStarter) fail('Renewal Triage public receipt must expose the existing reader-owned starter');
if (
  readerStarter.downloadHref !== '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip'
  || readerStarter.commands?.join('\u0000') !== ['npm test', 'npm run demo'].join('\u0000')
) {
  fail('Renewal Triage reader starter must point to the verified local ZIP and commands');
}
for (const [locale, fileName] of Object.entries({
  'zh-HK': 'README.zh-HK.md',
  'zh-TW': 'README.zh-TW.md',
  'zh-Hans': 'README.zh-Hans.md',
  en: 'README.md'
})) {
  if (readerStarter.readmeHref?.[locale] !== `/templates/renewal-triage-starter/v1/${fileName}`) {
    fail(`Renewal Triage reader starter must point ${locale} to its matching README`);
  }
}
for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans', 'en']) {
  const localizedStarter = readerStarter.copy?.[locale];
  for (const field of ['title', 'text', 'download', 'readme', 'boundary']) {
    if (typeof localizedStarter?.[field] !== 'string' || !localizedStarter[field].trim()) {
      fail(`Renewal Triage reader starter needs truthful ${locale} ${field} copy`);
    }
  }
}
if (/github\.com/i.test(JSON.stringify(readerStarter))) fail('reader starter must not invent a public GitHub repository');

for (const token of [
  'receipt.readerStarter.downloadHref',
  'receipt.readerStarter.readmeHref',
  'starter.boundary',
  'readerStarter: \'Downloadable starter you can run\'',
  'download'
]) {
  if (!receiptComponent.includes(token)) fail(`portfolio receipt does not expose reader starter ${token}`);
}
for (const surface of [labsPage, articlePage]) {
  if (!surface.includes('PortfolioVerificationReceipt')) fail('Renewal Triage reader starter is not wired to both Labs and article surfaces');
}
for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans', 'en']) {
  const body = fs.readFileSync(path.join(root, 'content', 'articles', 'renewal-triage-mlops', `${locale}.mdx`), 'utf8');
  const readmeFile = {
    'zh-HK': 'README.zh-HK.md',
    'zh-TW': 'README.zh-TW.md',
    'zh-Hans': 'README.zh-Hans.md',
    en: 'README.md'
  }[locale];
  for (const requiredText of [
    '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip',
    `/templates/renewal-triage-starter/v1/${readmeFile}`,
    'npm test',
    'npm run demo'
  ]) {
    if (!body.includes(requiredText)) fail(`Renewal Triage ${locale} article misses its reader-owned starter handoff`);
  }
}

execFileSync(process.execPath, ['--test', 'tests/renewal-triage.test.mjs'], { cwd: starterRoot, stdio: 'pipe' });
const demo = execFileSync(process.execPath, ['scripts/demo.mjs'], { cwd: starterRoot, encoding: 'utf8' });
const report = JSON.parse(demo);
if (report.route !== 'REVIEW_QUEUE_DRAFT_READY') fail('demo must remain draft-only');
if (report.offlineFixtureEvaluation?.rawRiskQueueUtilityUnits !== 16 || report.offlineFixtureEvaluation?.businessPriorityQueueUtilityUnits !== 26) {
  fail('demo no longer proves the expected synthetic queue comparison');
}
if (report.actionBoundary?.externalActionsPerformed !== false || report.actionBoundary?.requiresHumanReview !== true) {
  fail('demo must retain the human-review and no-external-action boundary');
}

console.log('Validated the downloadable, fixture-only Renewal Triage starter, its runnable checks, planner boundary, and reader-facing article/Labs handoff.');
