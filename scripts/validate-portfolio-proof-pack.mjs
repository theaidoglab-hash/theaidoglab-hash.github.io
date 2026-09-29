import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'lib', 'portfolio-proof-pack.ts');
const templatePath = path.join(root, 'public', 'templates', 'portfolio-proof-pack', 'v1', 'portfolio-proof-pack.md');
const componentPath = path.join(root, 'components', 'portfolio-evidence-planner.tsx');
const receiptComponentPath = path.join(root, 'components', 'portfolio-verification-receipt.tsx');
const receiptDataPath = path.join(root, 'content', 'portfolio-example-receipts.json');
const labsPath = path.join(root, 'app', '[lang]', 'labs', 'page.tsx');
const articlePath = path.join(root, 'app', '[lang]', 'articles', '[slug]', 'page.tsx');

function fail(message) {
  throw new Error(message);
}

for (const file of [sourcePath, templatePath, componentPath, receiptComponentPath, receiptDataPath, labsPath, articlePath]) {
  if (!fs.existsSync(file)) fail('Portfolio Proof Pack is missing ' + path.relative(root, file));
}

const source = fs.readFileSync(sourcePath, 'utf8');
const template = fs.readFileSync(templatePath, 'utf8');
const component = fs.readFileSync(componentPath, 'utf8');
const receiptComponent = fs.readFileSync(receiptComponentPath, 'utf8');
const receiptData = JSON.parse(fs.readFileSync(receiptDataPath, 'utf8'));
const labs = fs.readFileSync(labsPath, 'utf8');
const article = fs.readFileSync(articlePath, 'utf8');

const requiredTemplateSections = [
  '# Portfolio Proof Pack',
  '## Suggested folder layout',
  '## README.md',
  '## docs/brief.md',
  '## docs/source-and-data-receipt.md',
  '## docs/baseline-and-change.md',
  '## eval/evaluation-plan.md',
  '## A. Deterministic contract',
  '## B. Bounded LLM output with Promptfoo',
  '## C. Predictive model or review queue',
  '## eval/results-and-failure-log.md',
  '## docs/contribution.md',
  '## docs/five-minute-defence.md',
  '## docs/release-and-privacy-check.md',
  'public repository until an owner publishes and reviews one',
  'does not prove business impact, production readiness, security approval, or user adoption',
  'Do not replace this sentence with an invented GitHub link'
];

for (const section of requiredTemplateSections) {
  if (!template.includes(section)) fail('downloadable Portfolio Proof Pack misses: ' + section);
  if (!source.includes(section)) fail('copyable Portfolio Proof Pack source misses: ' + section);
}

if (/\p{Script=Han}/u.test(template)) {
  fail('downloadable Portfolio Proof Pack must retain an English source template');
}

if (/(?:sk-[A-Za-z0-9]|OPENAI_API_KEY|api[_-]?key\s*[:=])/i.test(template)) {
  fail('downloadable Portfolio Proof Pack must not contain a secret-like value');
}

for (const token of [
  'PORTFOLIO_PROOF_PACK_DOWNLOAD_HREF',
  'portfolioProofPackMarkdown',
  'portfolioRouteRecommendationCopy',
  'copyProofPack',
  'navigator.clipboard?.writeText',
  'aria-describedby="portfolio-copy-proof-pack-help"',
  'role="status"',
  'aria-live="polite"',
  'routeRecommendation.href'
]) {
  if (!component.includes(token)) fail('planner is missing Proof Pack interaction or route recommendation: ' + token);
}

if (/(?:\bfetch\s*\(|\bsessionStorage\b|\bindexedDB\b|\bXMLHttpRequest\b)/.test(component)) {
  fail('Proof Pack copy action and route recommendation must not transmit data or use hidden browser storage');
}

const recommendationLocales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const recommendationShapes = [
  ['approval', 'approval-queue-low-code-portfolio'],
  ['triage', 'renewal-triage-mlops'],
  ['draft', 'enterprise-ai-portfolio-policy-pilot'],
  ['reliability', 'build-a-resumable-ai-batch-worker'],
  ['public-data', 'build-a-public-data-kev-review-packet'],
  ['context-brief', 'build-a-source-bound-context-brief']
];
const recommendationCopyStart = source.indexOf('export const portfolioRouteRecommendationCopy');
if (recommendationCopyStart < 0) fail('route recommendation copy is missing.');

function localeMarker(locale) {
  return locale === 'en' ? '  en: {' : `  '${locale}': {`;
}

for (const locale of recommendationLocales) {
  const localeStart = source.indexOf(localeMarker(locale), recommendationCopyStart);
  const nextLocaleStart = recommendationLocales
    .map(candidate => source.indexOf(localeMarker(candidate), localeStart + 1))
    .filter(index => index >= 0)
    .sort((left, right) => left - right)[0] ?? source.length;
  if (localeStart < 0) fail('route recommendation is missing locale ' + locale);

  for (const [shape, slug] of recommendationShapes) {
    const shapeKey = shape.includes('-') ? `'${shape}'` : shape;
    const shapeStart = source.indexOf(`    ${shapeKey}: {`, localeStart);
    const shapeEnd = source.indexOf('\n    }', shapeStart);
    if (shapeStart < 0 || shapeStart >= nextLocaleStart || shapeEnd < 0 || shapeEnd > nextLocaleStart) {
      fail(`route recommendation is missing ${locale}/${shape}.`);
    }
    const recommendation = source.slice(shapeStart, shapeEnd + '\n    }'.length);
    for (const field of ['technicalHeading', 'technical', 'deliveryHeading', 'delivery', 'sourceStatus']) {
      if (!new RegExp(`\\b${field}:\\s*'[^']*\\S[^']*'`).test(recommendation)) {
        fail(`route recommendation ${locale}/${shape} is missing non-empty ${field}.`);
      }
    }
    const route = `/${locale}/articles/${slug}`;
    if (!recommendation.includes(`href: '${route}'`)) {
      fail(`route recommendation ${locale}/${shape} misses ${route}.`);
    }
    if (!recommendation.includes('fixture-only') || !recommendation.includes('public repository')) {
      fail(`route recommendation ${locale}/${shape} must keep the fixture-only, no-public-repository boundary.`);
    }
  }
}

for (const token of ['repositoryUnavailableTitle', 'repositoryUnavailableBadge', 'repositoryUnavailableText', 'fixture-only', 'public repository', 'GitHub URL']) {
  if (!labs.includes(token)) fail('Labs must explain unavailable public packages without inventing links: ' + token);
}

for (const token of ['projectUnavailableCopy', "article.type === 'portfolio-build'", 'does not invent GitHub URLs', 'fixture-only']) {
  if (!article.includes(token)) fail('Portfolio article source state is missing: ' + token);
}

for (const token of ['getPortfolioExampleReceipt', 'localCommands', 'doesNotProve', 'not a claim that you can download it or that the commands have been run']) {
  if (!receiptComponent.includes(token)) fail('Local-review receipt component is missing: ' + token);
}

for (const source of [article, labs]) {
  if (!source.includes('<PortfolioVerificationReceipt')) fail('Portfolio source state does not render the local-review receipt.');
}

const expectedReceiptSlugs = new Set(recommendationShapes.map(([, slug]) => slug));
if (!Array.isArray(receiptData.receipts) || receiptData.receipts.length !== expectedReceiptSlugs.size) {
  fail('Local-review receipt data must cover every fixture-only portfolio example exactly once.');
}
const receiptSlugs = new Set(receiptData.receipts.map(receipt => receipt.articleSlug));
if (receiptSlugs.size !== expectedReceiptSlugs.size || [...expectedReceiptSlugs].some(slug => !receiptSlugs.has(slug))) {
  fail('Local-review receipt data does not match the fixture-only portfolio routes.');
}

// A reader-owned starter is deliberately different from the internal reference.
// Check the actual static artifacts here so a visible download control cannot
// drift into a dead link or silently become a claim about a public repository.
const expectedReaderStarters = [
  {
    exampleId: 'policy-pilot',
    downloadHref: '/templates/policy-pilot-starter/v1/policy-pilot-starter-v1.zip',
    readmeHref: {
      'zh-HK': '/templates/policy-pilot-starter/v1/README.zh-HK.md',
      'zh-TW': '/templates/policy-pilot-starter/v1/README.zh-TW.md',
      'zh-Hans': '/templates/policy-pilot-starter/v1/README.zh-Hans.md',
      en: '/templates/policy-pilot-starter/v1/README.md'
    }
  },
  {
    exampleId: 'renewal-triage',
    downloadHref: '/templates/renewal-triage-starter/v1/renewal-triage-starter-v1.zip',
    readmeHref: {
      'zh-HK': '/templates/renewal-triage-starter/v1/README.zh-HK.md',
      'zh-TW': '/templates/renewal-triage-starter/v1/README.zh-TW.md',
      'zh-Hans': '/templates/renewal-triage-starter/v1/README.zh-Hans.md',
      en: '/templates/renewal-triage-starter/v1/README.md'
    }
  },
  {
    exampleId: 'approval-queue',
    downloadHref: '/templates/approval-queue-starter/v1/approval-queue-starter-v1.zip',
    readmeHref: {
      'zh-HK': '/templates/approval-queue-starter/v1/README.zh-HK.md',
      'zh-TW': '/templates/approval-queue-starter/v1/README.zh-TW.md',
      'zh-Hans': '/templates/approval-queue-starter/v1/README.zh-Hans.md',
      en: '/templates/approval-queue-starter/v1/README.md'
    }
  }
];

for (const expectedStarter of expectedReaderStarters) {
  const receipt = receiptData.receipts.find(candidate => candidate.exampleId === expectedStarter.exampleId);
  const starter = receipt?.readerStarter;
  if (!starter) fail(`${expectedStarter.exampleId} must expose a reader-owned starter separately from its local reference.`);
  if (starter.downloadHref !== expectedStarter.downloadHref) {
    fail(`${expectedStarter.exampleId} starter download link does not match the verified static artifact.`);
  }
  for (const [locale, href] of Object.entries(expectedStarter.readmeHref)) {
    if (starter.readmeHref?.[locale] !== href) {
      fail(`${expectedStarter.exampleId} ${locale} starter README link does not match the verified static artifact.`);
    }
  }
  for (const file of [starter.downloadHref, ...Object.values(expectedStarter.readmeHref)]) {
    if (!fs.existsSync(path.join(root, 'public', file.replace(/^\//, '')))) {
      fail(`${expectedStarter.exampleId} starter artifact is missing: ${file}`);
    }
  }
  if (starter.commands?.join('\u0000') !== ['npm test', 'npm run demo'].join('\u0000')) {
    fail(`${expectedStarter.exampleId} starter must show only its documented local test and demo commands.`);
  }
  for (const locale of recommendationLocales) {
    const copy = starter.copy?.[locale];
    for (const field of ['title', 'text', 'download', 'readme', 'boundary']) {
      if (typeof copy?.[field] !== 'string' || !copy[field].trim()) {
        fail(`${expectedStarter.exampleId} starter is missing ${locale}/${field} reader copy.`);
      }
    }
  }
}

if (source.includes('source-to-portfolio-evidence') || template.includes('source-to-portfolio-evidence')) {
  fail('public Proof Pack must not expose or copy the internal case-study pack');
}

console.log('Validated portable Portfolio Proof Pack, local-only copy action, route-specific Lab guidance, and transparent source-package state.');
