import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleRoot = path.join(root, 'content', 'articles');
const interviewQuestionRoot = path.join(root, 'content', 'interview-questions');
const prohibitedHeadingLabels = [
  'Technical explanation',
  'Explain it to a five-year-old',
  'Why an AI engineer needs this',
  'Technical things demonstrated',
  'Business, delivery and risk things demonstrated',
  '技術拆解',
  '五歲小朋友版',
  '為何 AI engineer 要懂',
  '示範的技術項目（Technical things demonstrated）',
  '示範的業務、交付與風險項目（Business, delivery and risk things demonstrated）',
  '技术拆解',
  '五岁小朋友版',
  '为什么 AI engineer 要懂',
  '示范的技术内容（Technical things demonstrated）',
  '示范的业务、交付与风险内容（Business, delivery and risk things demonstrated）',
  'A small picture that keeps it straight',
  'A small scenario to keep it straight',
  '用一個情境記住它',
  '用一个情境记住它'
];
const prohibitedPhrases = [
  'Five-year-old version:',
  'Explain it to a five-year-old:',
  '五歲小朋友版',
  '五歲版：',
  '五岁小朋友版',
  '五岁版：',
  'Percentile latency、queueing delay、time-to-first-token、full-response time、error handling 同 workload segmentation。',
  'Content provenance、raw/derived store 分隔、schema validation、confidence handling、evidence-span grounding、output allowlist。'
];

const retiredHongKongHybridPhrases = [
  '答對一半的答案',
  '答案容易變薄的地方',
  '呢個答案要展示的技術判斷',
  '呢個答案要展示的交付、業務與風險判斷',
  '面試真正想聽到的判斷'
];

function fail(message) {
  throw new Error(message);
}

function assertNoPrematureOriginalityClaims(text, label, claims) {
  const comparableText = text.toLowerCase();
  for (const claim of claims) {
    if (comparableText.includes(claim.toLowerCase())) {
      fail(`${label}: remove the premature originality claim until the provenance review is approved`);
    }
  }
}

function sourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return entry.name.endsWith('.mdx') || entry.name.endsWith('.json') ? [target] : [];
  });
}

const publicWritingFiles = [...sourceFiles(articleRoot), ...sourceFiles(interviewQuestionRoot)];
const interviewPublicCopyFiles = [
  ...sourceFiles(interviewQuestionRoot),
  ...sourceFiles(path.join(articleRoot, 'interview-map')),
  ...sourceFiles(path.join(articleRoot, 'interview-practice-cards')),
  path.join(root, 'content', 'articles.json'),
  path.join(root, 'content', 'reader-paths.json'),
  path.join(root, 'content', 'interview-practice-paths.json'),
  path.join(root, 'components', 'reader-journey-links.tsx'),
  path.join(root, 'lib', 'interview-lab.ts')
];
const prematureOriginalityClaims = [
  'AI.DOG 原創',
  'AI.DOG 原创',
  'original AI.DOG',
  'original questions',
  'independently authored AI.DOG',
  '原創題',
  '原創題目',
  '原創問題',
  '原创题',
  '原创问题',
  'AI.DOG 獨立撰寫',
  'AI.DOG 独立撰写'
];
// Scope matches the review-stage curriculum inventory. Other reader guidance can
// use “original” in a different, non-authorial sense and is not checked here.
const sourceSensitiveArticleSlugs = [
  'agent-execution-and-serving',
  'agent-protocols-orchestration-and-computer-use',
  'ai-batch-worker-reliability',
  'ai-hardware-routing-deployment-and-transport',
  'attention-qkv-mask-position',
  'decoding-strategies-and-output-policy',
  'from-offline-evaluation-to-an-authorised-pilot',
  'frontier-world-models-and-self-improvement',
  'inference-memory-scheduling-and-serving-engines',
  'long-context-retrieval-and-lost-middle',
  'model-score-workflow-decision',
  'modern-attention-moe-and-serving-tradeoffs',
  'multimodal-architectures-generation-and-evaluation',
  'safety-governance-privacy-and-incident-response',
  'tokenisation-and-domain-terms',
  'transformer-blocks-and-architecture-choice'
];
const sourceSensitiveOriginalityClaims = [
  'original AI.DOG',
  'original, local-draft',
  'original local-draft',
  'AI.DOG 原創',
  '原創 AI.DOG',
  '本文是原創',
  '這是原創',
  'AI.DOG 原创',
  '原创 AI.DOG',
  '本文是原创',
  '这是原创'
];

for (const file of publicWritingFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const normalizedText = text.replaceAll('\\n', '\n');
  for (const label of prohibitedHeadingLabels) {
    if (new RegExp(`^#{2,3} ${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm').test(normalizedText)) {
      fail(`${path.relative(root, file)}: retired template heading: ${label}`);
    }
  }
  for (const phrase of prohibitedPhrases) {
    if (text.includes(phrase)) fail(`${path.relative(root, file)}: retired teaching-template phrase: ${phrase}`);
  }
}

for (const file of interviewPublicCopyFiles) {
  assertNoPrematureOriginalityClaims(
    fs.readFileSync(file, 'utf8'),
    path.relative(root, file),
    prematureOriginalityClaims
  );
}

const sourceSensitiveArticleFiles = sourceSensitiveArticleSlugs.flatMap(slug =>
  ['zh-HK', 'zh-TW', 'zh-Hans', 'en'].map(locale => path.join(articleRoot, slug, `${locale}.mdx`))
);
for (const file of sourceSensitiveArticleFiles) {
  if (!fs.existsSync(file)) fail(`${path.relative(root, file)}: missing source-sensitive public article`);
  assertNoPrematureOriginalityClaims(
    fs.readFileSync(file, 'utf8'),
    path.relative(root, file),
    sourceSensitiveOriginalityClaims
  );
}

const generatedArticleBodies = JSON.parse(fs.readFileSync(path.join(root, 'content', 'article-bodies.json'), 'utf8'));
for (const slug of sourceSensitiveArticleSlugs) {
  const localizedBodies = generatedArticleBodies[slug];
  if (!localizedBodies || typeof localizedBodies !== 'object') {
    fail(`content/article-bodies.json: missing generated body for ${slug}`);
  }
  for (const [locale, body] of Object.entries(localizedBodies)) {
    if (typeof body !== 'string') fail(`content/article-bodies.json: ${slug}/${locale} must be text`);
    assertNoPrematureOriginalityClaims(
      body,
      `content/article-bodies.json: ${slug}/${locale}`,
      sourceSensitiveOriginalityClaims
    );
  }
}

const generatedInterviewPracticeFiles = [
  path.join(root, 'scripts', 'generate-downloads.py'),
  ...['zh-HK', 'zh-TW', 'zh-Hans', 'en'].map(locale =>
    path.join(root, 'public', 'downloads', 'interview-practice-cards', 'v1', `${locale}.md`)
  )
];
for (const file of generatedInterviewPracticeFiles) {
  if (!fs.existsSync(file)) fail(`${path.relative(root, file)}: missing generated interview practice asset`);
  assertNoPrematureOriginalityClaims(
    fs.readFileSync(file, 'utf8'),
    path.relative(root, file),
    prematureOriginalityClaims
  );
}

const questionContracts = {
  'zh-HK': { interviewer: /^> 面試官問：/m, halfAnswer: /^> 答啱一半嘅答案：/m, further: '## 延伸閱讀', scope: '## 範圍說明' },
  'zh-TW': { interviewer: /^> 面試官問：/m, halfAnswer: /^> 答對一半(?:的)?(?:答案|回答|回應)：/m, further: '## 延伸閱讀', scope: '## 範圍說明' },
  'zh-Hans': { interviewer: /^> 面试官问：/m, halfAnswer: /^> 答对一半(?:的)?(?:答案|回答|回应)：/m, further: '## 延伸阅读', scope: '## 范围说明' },
  en: { interviewer: /^> Interviewer asks:/m, halfAnswer: /^> Half-right answer:/m, further: '## Further reading', scope: '## Scope note' }
};

const hongKongFirstUseClarity = {
  'a-model-metric-is-not-a-business-metric.json': ['precision 問：', 'recall 問：'],
  'an-eval-score-needs-human-calibration.json': ['呢個工具叫 evaluator', '嗰張清單叫 rubric', '叫做 calibration'],
  'rag-retrieval-generation-or-permission.json': ['呢個 user 有冇權限睇？', '系統搵唔搵到正確段落？', '最後答案有冇跟住段落回答？'],
  'voice-latency-is-a-system-budget.json': ['判斷佢係咪真係講完（endpointing）', '轉成文字（ASR）', '轉成聲音（TTS）']
};

for (const file of sourceFiles(interviewQuestionRoot)) {
  const question = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!question || typeof question !== 'object' || !question.body || typeof question.body !== 'object') {
    fail(`${path.relative(root, file)}: expected a localized standalone question body`);
  }

  for (const [locale, contract] of Object.entries(questionContracts)) {
    const body = question.body[locale];
    const label = `${path.relative(root, file)}/${locale}`;
    if (typeof body !== 'string') fail(`${label}: missing localized practice copy`);
    if (locale === 'zh-HK') {
      for (const phrase of retiredHongKongHybridPhrases) {
        if (body.includes(phrase)) fail(`${label}: retired hybrid Hong Kong wording: ${phrase}`);
      }
    }
    if (!contract.interviewer.test(body.trimStart())) fail(`${label}: must begin with an interviewer-style question`);
    if (!contract.halfAnswer.test(body)) fail(`${label}: must include a half-right answer`);
    if (!body.includes(contract.further)) fail(`${label}: must include local further reading`);
    if (!body.includes(contract.scope)) fail(`${label}: must include a scope boundary`);

    const headings = Array.from(body.matchAll(/^#{2,3} .+$/gm));
    if (headings.length < 4) fail(`${label}: needs a readable set of explanatory sections`);
    if (headings.some(match => match[0].startsWith('### ')) && !headings.some(match => match[0].startsWith('## '))) {
      fail(`${label}: article headings must begin at level two, not skip from the page title to level three`);
    }
  }

  const firstUseTerms = hongKongFirstUseClarity[path.basename(file)];
  if (firstUseTerms) {
    const hongKongBody = question.body['zh-HK'];
    for (const phrase of firstUseTerms) {
      if (!hongKongBody.includes(phrase)) fail(`${path.relative(root, file)}/zh-HK: missing first-use explanation for ${phrase}`);
    }
  }
}

for (const file of publicWritingFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (/\/articles\/ai-engineer-interview-practice-cards#topic-\d{2}/.test(text)) {
    fail(`${path.relative(root, file)}: use the standalone Interview Lab route, not a legacy deck anchor`);
  }
}

const labIndex = fs.readFileSync(path.join(root, 'app', '[lang]', 'interview-lab', 'page.tsx'), 'utf8');
const seriesPage = fs.readFileSync(path.join(root, 'app', '[lang]', 'series', '[series]', 'page.tsx'), 'utf8');
if (!labIndex.includes('interviewPracticePath') || !seriesPage.includes('interviewPracticePath')) {
  fail('Interview navigation must use standalone question paths');
}

console.log('Interview voice and standalone-question checks passed.');
