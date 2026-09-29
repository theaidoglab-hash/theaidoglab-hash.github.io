import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const questionDirectory = path.join(root, 'content', 'interview-questions');
const component = fs.readFileSync(path.join(root, 'components', 'interview-live-practice.tsx'), 'utf8');
const gate = fs.readFileSync(path.join(root, 'components', 'interview-live-practice-gate.tsx'), 'utf8');
const loader = fs.readFileSync(path.join(root, 'components', 'interview-live-practice-loader.tsx'), 'utf8');
const topicRoute = fs.readFileSync(path.join(root, 'app', 'api', 'interview-practice-topics', 'route.ts'), 'utf8');
const gateCopy = fs.readFileSync(path.join(root, 'lib', 'interview-live-practice-gate.ts'), 'utf8');
const articlePage = fs.readFileSync(path.join(root, 'app', '[lang]', 'articles', '[slug]', 'page.tsx'), 'utf8');
const questionPage = fs.readFileSync(path.join(root, 'app', '[lang]', 'interview-lab', '[topic]', 'page.tsx'), 'utf8');
const questionContent = fs.readFileSync(path.join(root, 'lib', 'interview-question-content.ts'), 'utf8');
const interviewLab = fs.readFileSync(path.join(root, 'lib', 'interview-lab.ts'), 'utf8');
const livePracticeTopicProjection = fs.readFileSync(path.join(root, 'lib', 'interview-live-practice-topics.ts'), 'utf8');
const labIndex = fs.readFileSync(path.join(root, 'app', '[lang]', 'interview-lab', 'page.tsx'), 'utf8');
const legacyFragment = fs.readFileSync(path.join(root, 'components', 'clear-legacy-interview-fragment.tsx'), 'utf8');
const legacyTopicSlugs = JSON.parse(fs.readFileSync(path.join(root, 'content', 'interview-legacy-topic-slugs.json'), 'utf8'));
const copyBlock = component.split('const copy:')[1]?.split('function practiceBriefFor')[0] ?? '';

function fail(message) {
  throw new Error(`Interview rehearsal: ${message}`);
}

const canonicalLegacyTopicSlugs = Object.fromEntries(Array.from(
  interviewLab.matchAll(/number: '([^']+)', anchor: 'topic-[^']+', slug: '([^']+)'/g),
  match => [match[1], match[2]],
));
const legacyTopicNumbers = Object.keys(legacyTopicSlugs);
if (legacyTopicNumbers.length !== Object.keys(canonicalLegacyTopicSlugs).length) {
  fail('legacy topic redirect map must cover every standalone question');
}
for (const number of legacyTopicNumbers) {
  if (legacyTopicSlugs[number] !== canonicalLegacyTopicSlugs[number]) {
    fail(`legacy topic redirect map is stale for topic ${number}`);
  }
}
if (legacyFragment.includes("@/lib/interview-lab")) {
  fail('legacy hash redirect must not load the full Interview Lab into the client');
}
if (!legacyFragment.includes('legacyInterviewPracticePath(locale, match[1])')) {
  fail('legacy hash redirect must resolve through the compact topic map');
}

for (const required of [
  'export type LiveInterviewPracticeTopic',
  'number: topic.number',
  'slug: topic.slug',
  'title: topic.title[locale]',
  'interviewerQuestion: interviewerQuestionFor(locale, topic)',
  'practice: topic.practice[locale]',
  'toLiveInterviewPracticeTopics',
  'function interviewerQuestionFor',
  'readStandaloneInterviewQuestion(topic.slug, locale)',
  'extractInterviewerQuestion(markdown, locale)',
]) {
  if (!livePracticeTopicProjection.includes(required)) {
    fail(`live rehearsal topic projection must include ${required}`);
  }
}
if (component.includes("@/lib/interview-lab") || component.includes('InterviewTopic')) {
  fail('live rehearsal must not import full Interview Lab topic records into the client');
}
if (component.includes('topic.title[locale]') || component.includes('topic.practice[locale]')) {
  fail('live rehearsal must receive only the active locale title and practice brief');
}
if (!labIndex.includes('<InterviewLivePracticeGate locale={lang} />')) {
  fail('the Interview Lab route must retain the local-only live-rehearsal activation gate');
}
if (!questionPage.includes('initialTopicSlug={topic.slug}') || !questionPage.includes('initialInterviewerQuestion={interviewerQuestion}')) {
  fail('a standalone question must preserve its actual question when it opens the rehearsal gate');
}

for (const required of [
  "lazy(() => import('@/components/interview-live-practice-loader'))",
  'LIVE_INTERVIEW_PRACTICE_ID',
  'targetsPracticeFragment',
  "window.addEventListener('hashchange', openForFragment)",
  'id={LIVE_INTERVIEW_PRACTICE_ID}',
  'setIsOpen(true)',
  'live-interview-activation'
]) {
  if (!gate.includes(required)) fail(`missing lazy-rehearsal gate contract: ${required}`);
}
if (gate.includes('@/lib/interview-lab') || gate.includes('toLiveInterviewPracticeTopics')) {
  fail('the activation gate must not load all topics before a reader opens practice');
}
for (const required of [
  'fetch(`/api/interview-practice-topics?locale=${encodeURIComponent(locale)}`',
  'AbortController',
  'LiveInterviewPracticeTopic',
  'embedded'
]) {
  if (!loader.includes(required)) fail(`lazy rehearsal loader must request a scoped topic projection: ${required}`);
}
for (const forbidden of ["@/lib/interview-lab", 'toLiveInterviewPracticeTopics(locale, interviewTopics)']) {
  if (loader.includes(forbidden)) fail(`lazy rehearsal loader must not bundle the full topic library: ${forbidden}`);
}
for (const required of [
  'getReleaseScopedInterviewTopics',
  'isRouteSurfaceEnabledInCurrentBuild(\'interview-lab\')',
  'toLiveInterviewPracticeTopics(locale, getReleaseScopedInterviewTopics())',
  "'Cache-Control': 'private, no-store'"
]) {
  if (!topicRoute.includes(required)) fail(`topic projection endpoint is missing ${required}`);
}
if (!gateCopy.includes("LIVE_INTERVIEW_PRACTICE_ID = 'live-interview-practice'")) {
  fail('the activation gate must preserve the documented live-practice fragment id');
}

if (!copyBlock) fail('could not locate localized rehearsal copy');

for (const key of [
  'debriefTitle:',
  'debriefIntro:',
  'debriefLabel:',
  'debriefCopy:',
  'debriefCopied:',
  'debriefNote:',
  'scorecardTitle:',
  'scorecardIntro:',
  'scorecardRule:',
  'scorecardCriteria:'
]) {
  const count = copyBlock.match(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))?.length ?? 0;
  if (count !== 4) fail(`expected four localized ${key} values, found ${count}`);
}

const scorecardAnchorBlocks = copyBlock.match(/anchors:\s*\[/g)?.length ?? 0;
if (scorecardAnchorBlocks !== 12) {
  fail('expected 12 localized scorecard anchor sets, found ' + scorecardAnchorBlocks);
}

for (const required of [
  'function debriefPromptFor',
  'function scorecardContractFor',
  'function scorecardAnchorsFor',
  'function questionTextFor',
  'function openingQuestionContractFor',
  'function debriefQuestionContextFor',
  'copyDebriefPrompt',
  'debriefCopyButtonRef',
  'TRANSCRIPT',
  'Do not claim this is a question from any company',
  'AI.DOG never receives a transcript',
  'public-safe material only',
  'topic.practice',
  'scorecardContractFor(locale)',
  'live-interview-scorecard',
  'live-interview-scorecard-anchors',
  'criterion.anchors.map',
  '<CURRENT_INTERVIEW_QUESTION>',
  'Ask this exact question first.',
  'Do not replace it with a generic question',
  'initialInterviewerQuestion?: string',
  'topic.interviewerQuestion?.trim()',
  'selectedTopic.interviewerQuestion?.trim()',
  'selectedTopic.slug === initialTopicSlug',
  'a short quote or transcript location',
  'The quote must come from my actual answer',
  'Use 0 when I answered but meet none',
  'not enough evidence',
  'id="live-interview-practice"',
  'embedded = false',
  'live-interview-practice-content',
  'topicChanged:'
]) {
  if (!component.includes(required)) fail(`missing required debrief contract: ${required}`);
}

for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', '/api/']) {
  if (component.includes(forbidden)) fail(`must remain local-only; found ${forbidden}`);
}

const openingContracts = {
  'zh-HK': { interviewer: '面試官問：', halfRight: '答啱一半嘅答案：' },
  'zh-TW': { interviewer: '面試官問：', halfRight: '答對一半' },
  'zh-Hans': { interviewer: '面试官问：', halfRight: '答对一半' },
  en: { interviewer: 'Interviewer asks:', halfRight: 'Half-right answer:' }
};

for (const fileName of fs.readdirSync(questionDirectory).filter(file => file.endsWith('.json'))) {
  const question = JSON.parse(fs.readFileSync(path.join(questionDirectory, fileName), 'utf8'));
  for (const [locale, contract] of Object.entries(openingContracts)) {
    const body = question.body?.[locale];
    if (typeof body !== 'string') fail(fileName + '/' + locale + ': missing question body');
    const interviewerStart = body.indexOf('> ' + contract.interviewer);
    const halfRightStart = body.indexOf('> ' + contract.halfRight);
    if (interviewerStart !== 0 || halfRightStart === -1 || halfRightStart <= interviewerStart) {
      fail(fileName + '/' + locale + ': cannot isolate the opening interviewer question');
    }
    const questionOnly = body.slice(interviewerStart + contract.interviewer.length + 2, halfRightStart).replace(/^>\s*$/gm, '').trim();
    if (!questionOnly || questionOnly.includes(contract.halfRight)) {
      fail(fileName + '/' + locale + ': interviewer extraction must exclude the half-right answer');
    }
  }
}

if (!component.includes('Score clarity, reasoning, and evidence separately.')) {
  fail('the feedback contract must separate clarity, reasoning, and evidence');
}
if (!component.includes('mark unknowns as assumptions')) {
  fail('the feedback contract must prevent invented evidence');
}
if (!component.includes('引述只可來自我實際講過嘅內容') || !component.includes('引用只能来自我实际说过的内容')) {
  fail('localized scorecards must require transcript-grounded justification');
}
if (!questionPage.includes('extractInterviewerQuestion') || !questionPage.includes('initialInterviewerQuestion={interviewerQuestion}')) {
  fail('a standalone question page must pass its actual interviewer question into the rehearsal');
}
if (!livePracticeTopicProjection.includes('Could not project the interviewer question')) {
  fail('the on-demand topic projection must fail closed instead of replacing a missing interviewer question with a generic prompt');
}
for (const required of [
  'halfRightAnswerPrefix',
  'if (content.startsWith(halfRightAnswerPrefix[locale])) break',
  'presentStandaloneInterviewQuestion',
  'presentationHeadingUpdates',
  "['## 呢個答案要展示嘅技術判斷', '## 回答時要講清系統點樣做']",
  "['## 呢個答案要展示嘅交付、業務與風險判斷', '## 回答時要交代用喺邊度、邊度要停']",
  "['## 這個答案要展示的技術判斷', '## 回答時要講清系統怎麼做']",
  "['## 这个答案要展示的技术判断', '## 回答时要讲清系统怎样做']",
  "['## Technical judgement to demonstrate', '## Explain how the system works']"
]) {
  if (!questionContent.includes(required)) {
    fail('question extraction must exclude the half-right answer: missing ' + required);
  }
}
if (!questionPage.includes('renderMarkdown(readerMarkdown')) {
  fail('standalone question pages must render the reader-facing wording pass');
}

if (articlePage.includes("article.slug === 'ai-engineer-interview-practice-cards') redirect")) {
  fail('the interview-reading guide must remain readable instead of redirecting readers away from it');
}

console.log('Validated opt-in rehearsal prompts, scoped topic projection, current-question injection, calibrated transcript-grounded scorecards, and transcript-feedback boundaries.');
