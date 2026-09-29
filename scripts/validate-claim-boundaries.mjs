import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const articles = JSON.parse(fs.readFileSync(path.join(root, 'content', 'articles.json'), 'utf8'));
const receiptData = JSON.parse(fs.readFileSync(path.join(root, 'content', 'portfolio-example-receipts.json'), 'utf8'));

// These labels are especially easy to use as a substitute for saying what a
// reader can inspect. They are prohibited in article-card metadata, where a
// short summary cannot supply the missing mechanism, evidence, and scope.
// Full lessons may still use the terms when they name or critique a concrete
// mechanism (for example, an end-to-end trace or a production release gate).
const vagueMetadataClaims = [
  [/\benterprise[- ](?:level|grade|style)\b/i, 'generic enterprise label'],
  [/\benterprise\s+(?:AI|agent|assistant|application|portfolio|project|solution|system|workflow)\b/i, 'generic enterprise label'],
  [/\bproduction[- ]ready\b/i, 'production-ready label'],
  [/\bend[- ]to[- ]end\s+(?:portfolio|project|solution|system|workflow)\b/i, 'generic end-to-end label'],
  [/\bagentic\s+(?:portfolio|project|solution|system|workflow)\b/i, 'generic agentic label']
];

const vagueTagClaims = [
  [/\benterprise\b/i, 'enterprise label'],
  [/\bproduction[- ]ready\b/i, 'production-ready label'],
  [/\bend[- ]to[- ]end\b/i, 'end-to-end label'],
  [/\bagentic\b/i, 'agentic label'],
  [/\bbusiness\s+(?:value|impact|outcome)\b/i, 'business-outcome label'],
  [/(?:商業|商业|業務|业务)(?:價值|价值|影響|影响|成果|成效)/, 'business-outcome label']
];

const materialScopeSignal = {
  'zh-HK': /(?:虛構|合成|本機|本地|fixture|公開\s*KEV\s*資料|source-shaped)/i,
  'zh-TW': /(?:虛構|合成|本機|本地|fixture|公開\s*KEV\s*資料|source-shaped)/i,
  'zh-Hans': /(?:虚构|合成|本机|本地|fixture|公开\s*KEV\s*数据|source-shaped)/i,
  en: /(?:fictional|synthetic|fixture|local(?:[- ]only)?|public\s+KEV\s+data|source-shaped)/i
};

const nonClaimSignal = {
  'zh-HK': /(?:唔證明|不證明|唔代表|不代表|唔會|不會|冇|沒有)/,
  'zh-TW': /(?:不證明|不代表|不會|沒有)/,
  'zh-Hans': /(?:不证明|不代表|不会|没有)/,
  en: /\b(?:does not|do not|not\s+(?:evidence|a|an|the)|without|cannot|never)\b/i
};

const receiptBackedExamples = new Set([
  'policy-pilot',
  'renewal-triage',
  'approval-queue',
  'ai-batch-worker',
  'kev-review-packet',
  'workforce-signal-brief'
]);

function fail(message) {
  throw new Error(message);
}

function assertText(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(label + ': missing reader-facing copy');
}

for (const article of articles) {
  const summaryFields = [
    ...(article.learningObjectives ?? []),
    ...locales.flatMap(locale => {
      const copy = article.translations?.[locale];
      return copy ? [copy.title, copy.description] : [];
    })
  ];
  for (const field of summaryFields) {
    assertText(field, article.id + ': article-card metadata');
    for (const [pattern, label] of vagueMetadataClaims) {
      if (pattern.test(field)) fail(article.id + ': ' + label + ' must name a concrete mechanism or boundary in the lesson, not market its card metadata');
    }
  }
  for (const tag of article.tags ?? []) {
    assertText(tag, article.id + ': article tag');
    for (const [pattern, label] of vagueTagClaims) {
      if (pattern.test(tag)) fail(article.id + ': ' + label + ' is too vague for a discovery tag; use the mechanism, decision, or metric instead');
    }
  }
}

if (!Array.isArray(receiptData.receipts)) fail('portfolio receipt data: expected receipts array');
const receipts = new Map(receiptData.receipts.map(receipt => [receipt.exampleId, receipt]));
if (receiptData.receipts.length !== receiptBackedExamples.size || receipts.size !== receiptBackedExamples.size || [...receiptBackedExamples].some(id => !receipts.has(id))) {
  fail('portfolio receipt data: must contain each fixture-backed example exactly once');
}

for (const exampleId of receiptBackedExamples) {
  const receipt = receipts.get(exampleId);
  const article = articles.find(candidate => candidate.slug === receipt.articleSlug);
  if (!article) fail(exampleId + ': receipt points to an unknown article');

  for (const locale of locales) {
    const articleDescription = article.translations?.[locale]?.description;
    assertText(articleDescription, exampleId + '/' + locale + ': portfolio article-card description');
    if (!materialScopeSignal[locale].test(articleDescription)) {
      fail(exampleId + '/' + locale + ': portfolio article-card description must state whether its material is fictional, synthetic, fixture-only, local, or public-source-shaped');
    }

    const copy = receipt.copy?.[locale];
    assertText(copy?.decision, exampleId + '/' + locale + ': receipt decision');
    assertText(copy?.dataAndModel, exampleId + '/' + locale + ': receipt data/model boundary');
    assertText(copy?.doesNotProve, exampleId + '/' + locale + ': receipt non-claim');
    if (!materialScopeSignal[locale].test(copy.dataAndModel)) {
      fail(exampleId + '/' + locale + ': receipt data/model boundary must name its fictional, synthetic, fixture, local, or public-source-shaped material');
    }
    if (!nonClaimSignal[locale].test(copy.doesNotProve)) {
      fail(exampleId + '/' + locale + ': receipt non-claim must explicitly say what it does not establish');
    }

    const starter = receipt.readerStarter;
    if (!starter) continue;
    const starterBoundary = starter.copy?.[locale]?.boundary;
    assertText(starterBoundary, exampleId + '/' + locale + ': reader starter boundary');
    if (!/API key/i.test(starterBoundary) || !/(?:network|網絡|網路|网络)/i.test(starterBoundary) || !/(?:model|模型)/i.test(starterBoundary)) {
      fail(exampleId + '/' + locale + ': reader starter boundary must state the key, network, and model-call limits');
    }
    if (!nonClaimSignal[locale].test(starterBoundary)) {
      fail(exampleId + '/' + locale + ': reader starter boundary must state what the starter cannot establish');
    }
  }
}

console.log('Validated claim boundaries for ' + receiptBackedExamples.size + ' fixture-backed portfolio examples and article-card metadata.');
