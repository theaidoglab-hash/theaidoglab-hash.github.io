import fs from 'node:fs';
import path from 'node:path';
import {
  createArticleLearningContract,
  estimateArticleReadingMinutes,
  hasStandaloneLearningContract,
} from '../lib/article-learning-contract.ts';

const root = process.cwd();
const articles = JSON.parse(fs.readFileSync(path.join(root, 'content/articles.json'), 'utf8'));
const roadmapSource = JSON.parse(fs.readFileSync(path.join(root, 'content/roadmaps/ai-engineer-roadmap.json'), 'utf8'));
const publicLocales = ['zh-Hant', 'zh-Hans', 'en'];
const sourceLocale = { 'zh-Hant': 'zh-HK', 'zh-Hans': 'zh-Hans', en: 'en' };

function fail(message) {
  console.error(`Article learning contract validation failed: ${message}`);
  process.exitCode = 1;
}

function localized(record) {
  return {
    'zh-Hant': record['zh-Hant'] ?? record['zh-HK'] ?? record['zh-TW'],
    'zh-Hans': record['zh-Hans'],
    en: record.en,
  };
}

const diagnosticEntries = new Set(roadmapSource.selfLearning.routes.map(route => route.startStage));
const roadmapStages = roadmapSource.stages.map((stage, index) => {
  const entry = index === 0 ? 'foundation' : diagnosticEntries.has(stage.number) ? 'diagnostic' : 'sequence';
  const runnable = stage.resources.some(resource => resource.kind === 'lab');
  return {
    ...stage,
    title: localized(stage.title),
    evidence: localized(stage.evidence),
    lessonContract: {
      entry,
      prerequisiteStageId: entry === 'sequence' ? roadmapSource.stages[index - 1]?.id : undefined,
      estimatedMinutes: runnable
        ? { minimum: 60, maximum: 90 }
        : entry === 'foundation'
          ? { minimum: 30, maximum: 45 }
          : { minimum: 45, maximum: 75 },
      practiceMode: runnable ? 'runnable-practice' : 'guided-self-check',
      completionChecks: ['artefact', 'decision-tradeoff', 'counterexample-review'],
    },
  };
});

function roadmapContext(articleSlug) {
  const matchingStages = roadmapStages.filter(stage => stage.resources.some(
    resource => resource.kind === 'article' && resource.target === articleSlug,
  ));
  if (!matchingStages.length) return undefined;
  const primaryStages = matchingStages.filter(stage => stage.resources.some(
    resource => resource.kind === 'article' && resource.target === articleSlug && resource.primary,
  ));
  const stage = primaryStages.length === 1
    ? primaryStages[0]
    : matchingStages.length === 1
      ? matchingStages[0]
      : undefined;
  if (!stage) return { stages: matchingStages };
  const index = roadmapStages.findIndex(candidate => candidate.id === stage.id);
  return {
    stages: matchingStages,
    stage,
    previousStage: index > 0 ? roadmapStages[index - 1] : undefined,
    nextStage: index >= 0 && index < roadmapStages.length - 1 ? roadmapStages[index + 1] : undefined,
  };
}

const evidenceTargets = new Set();
const prerequisites = new Set();
let roadmapContracts = 0;
let standaloneContracts = 0;

for (const article of articles) {
  const context = roadmapContext(article.slug);
  const hasOwningStage = Boolean(context?.stage);
  const hasExplicitContract = hasStandaloneLearningContract(article.slug);
  if (!hasOwningStage && !hasExplicitContract) {
    fail(`${article.slug}: needs one owning roadmap stage or an explicit standalone contract`);
    continue;
  }
  if (hasOwningStage && hasExplicitContract) fail(`${article.slug}: should not shadow a single owning roadmap stage with a standalone contract`);

  for (const locale of publicLocales) {
    const bodyPath = path.join(root, 'content/articles', article.id, `${sourceLocale[locale]}.mdx`);
    const body = fs.readFileSync(bodyPath, 'utf8');
    let contract;
    try {
      contract = createArticleLearningContract({ article, body, locale, roadmapContext: context });
    } catch (error) {
      fail(`${article.slug}/${locale}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    if (!contract.prerequisite.trim()) fail(`${article.slug}/${locale}: missing prerequisite`);
    if (!contract.evidence.trim()) fail(`${article.slug}/${locale}: missing completion evidence`);
    if (contract.readingMinutes.minimum < 5 || contract.readingMinutes.maximum < contract.readingMinutes.minimum) {
      fail(`${article.slug}/${locale}: invalid body-derived reading estimate`);
    }
    if (contract.practiceMinutes.minimum < 10 || contract.practiceMinutes.maximum < contract.practiceMinutes.minimum) {
      fail(`${article.slug}/${locale}: invalid practice estimate`);
    }
    if (contract.practiceScope !== (hasExplicitContract ? 'article' : 'roadmap-stage')) {
      fail(`${article.slug}/${locale}: incorrect practice scope`);
    }
    if (locale !== 'en' && /\b(?:Before starting|Bring one|A role|A completed|Finish with)\b/.test(`${contract.prerequisite} ${contract.evidence}`)) {
      fail(`${article.slug}/${locale}: leaked English contract copy`);
    }
    evidenceTargets.add(`${locale}:${contract.evidence}`);
    prerequisites.add(`${locale}:${contract.prerequisite}`);
  }

  if (hasExplicitContract) standaloneContracts += 1;
  else roadmapContracts += 1;
}

if (roadmapContracts !== 44) fail(`expected 44 single-stage roadmap contracts, found ${roadmapContracts}`);
if (standaloneContracts !== 18) fail(`expected 18 explicit standalone or multi-stage contracts, found ${standaloneContracts}`);
if (evidenceTargets.size < 80) fail(`completion evidence is too repetitive (${evidenceTargets.size} unique localized targets)`);
if (prerequisites.size < 70) fail(`prerequisites are too repetitive (${prerequisites.size} unique localized entries)`);

for (const [articleId, locale, heading, terms] of [
  ['non-coder-ai-workflow', 'zh-HK', '## 五分鐘先看懂整個做法', ['虛構資料（synthetic data）', '交回人處理（HANDOFF）', '操作權限（permission）']],
  ['non-coder-ai-workflow', 'zh-TW', '## 五分鐘先看懂整個做法', ['虛構資料（synthetic data）', '（HANDOFF）', '操作權限（permission）']],
  ['non-coder-ai-workflow', 'zh-Hans', '## 五分钟先看懂整个做法', ['虚构数据（synthetic data）', '交回人工处理（HANDOFF）', '操作权限（permission）']],
  ['non-coder-ai-workflow', 'en', '## Understand the whole exercise in five minutes', ['**Synthetic data:**', '**HANDOFF:**', '**Permission:**']],
  ['low-code-automation', 'zh-HK', '## 五分鐘先看懂整個做法', ['合成 FAQ（synthetic FAQ）', '只限草稿（draft-only）', '權限覆核（permission review）']],
  ['low-code-automation', 'zh-TW', '## 五分鐘先看懂整個做法', ['合成 FAQ（synthetic FAQ）', '只限草稿（draft-only）', '權限覆核（permission review）']],
  ['low-code-automation', 'zh-Hans', '## 五分钟先看懂整个做法', ['合成 FAQ（synthetic FAQ）', '仅限草稿（draft-only）', '权限复核（permission review）']],
  ['low-code-automation', 'en', '## Understand the whole exercise in five minutes', ['**Synthetic FAQ:**', '**Draft-only:**', '**Permission review:**']],
]) {
  const body = fs.readFileSync(path.join(root, 'content/articles', articleId, `${locale}.mdx`), 'utf8');
  const headingIndex = body.indexOf(heading);
  if (headingIndex < 0 || headingIndex > 500) fail(`${articleId}/${locale}: five-minute route must appear before deeper notes`);
  for (const term of terms) {
    if (!body.includes(term)) fail(`${articleId}/${locale}: five-minute route must explain ${term}`);
  }
}

const shortEstimate = estimateArticleReadingMinutes('A short technical note with one check.', 'en');
const longEstimate = estimateArticleReadingMinutes(`${'technical evidence boundary review '.repeat(900)}`, 'en');
if (longEstimate.maximum <= shortEstimate.maximum) fail('reading estimate does not respond to body length');
const chineseEstimate = estimateArticleReadingMinutes('這是一段需要仔細閱讀與核對的技術內容。'.repeat(400), 'zh-Hant');
if (chineseEstimate.maximum <= shortEstimate.maximum) fail('reading estimate does not count CJK text');

const componentSource = fs.readFileSync(path.join(root, 'components/article-learning-contract.tsx'), 'utf8');
const pageSource = fs.readFileSync(path.join(root, 'app/[lang]/articles/[slug]/page.tsx'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
for (const marker of ['學習約定', '学习约定', 'Learning contract', 'readingNote', 'roadmapPracticeNote', 'article-learning-contract-details']) {
  if (!componentSource.includes(marker)) fail(`learning-contract component is missing ${marker}`);
}
if (!componentSource.includes('return <section className="article-outline article-learning-contract"')) {
  fail('learning-contract orientation must be visible without opening a disclosure');
}
if (componentSource.includes('return <details className="article-outline article-learning-contract"')) {
  fail('learning-contract orientation must not be hidden behind a disclosure');
}
if (!pageSource.includes('<ArticleLearningContract contract={learningContract} locale={lang} />')) {
  fail('every article route must render the learning-contract component');
}
if (pageSource.includes('localizedObjectiveFallback')) fail('article route must not present generic translated objectives as article-specific metadata');
if (!cssSource.includes('.article-learning-contract dl > div')) fail('learning contract is missing its compact definition-list layout');

if (!process.exitCode) {
  console.log(`Validated learning contracts for ${articles.length} articles: ${roadmapContracts} roadmap-owned and ${standaloneContracts} explicit, across ${publicLocales.length} locales.`);
}
