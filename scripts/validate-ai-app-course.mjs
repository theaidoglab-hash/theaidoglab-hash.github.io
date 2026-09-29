import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const starterLab = read('components', 'no-code-starter-lab.tsx');
const gate = read('components', 'ai-app-course-gate.tsx');
const course = read('components', 'ai-app-course.tsx');
const gateCopy = read('lib', 'ai-app-course-gate.ts');
const courseCopy = read('lib', 'ai-app-course.ts');

function fail(message) {
  throw new Error(`AI app course: ${message}`);
}

if (starterLab.includes('AiAppFoundations') || starterLab.includes("@/components/ai-app-foundations")) {
  fail('the retired one-image foundations block must not remain in the starter lab');
}
if (!starterLab.includes("import { AiAppCourseGate } from '@/components/ai-app-course-gate';")
  || !starterLab.includes('<AiAppCourseGate locale={locale} />')) {
  fail('the starter lab must expose the full-course gate');
}
if (starterLab.indexOf('no-code-lab-manual') > starterLab.indexOf('<AiAppCourseGate locale={locale} />')) {
  fail('the account-free manual exercise must remain before the optional app course');
}

for (const required of [
  "'use client'",
  "lazy(() =>",
  "import('@/components/ai-app-course')",
  'Suspense',
  'AI_APP_COURSE_TITLE_ID',
  'role="status"',
  'aria-live="polite"',
  'Local review draft',
  '僅限本機審閱草稿'
]) {
  if (!gate.includes(required) && !gateCopy.includes(required)) fail(`course gate is missing ${required}`);
}

for (const required of [
  'aiAppCourseCopy',
  'LessonCard',
  'lesson.image.src',
  'lesson.image.alt',
  'lesson.image.caption',
  'completion',
  'Grok Bot',
  'Codex',
  'https://docs.x.ai/grok-bot/get-started',
  'https://docs.x.ai/grok-bot/approvals-security-and-privacy',
  'https://learn.chatgpt.com/docs/quickstart',
  'https://learn.chatgpt.com/docs/agent-approvals-security',
  'Full access',
  'one-time',
  'CAPTCHA'
]) {
  if (!course.includes(required) && !courseCopy.includes(required)) fail(`course content is missing ${required}`);
}

if (courseCopy.includes('Hong Kong only supports Grok Bot') || courseCopy.includes('香港只支援 Grok Bot')) {
  fail('must not assert unverified Hong Kong Grok Bot availability');
}

for (const locale of ["'zh-Hant'", "'zh-Hans'", 'en']) {
  if (!gateCopy.includes(`${locale}: {`) || !courseCopy.includes(`${locale}: {`)) {
    fail(`missing ${locale} course copy`);
  }
}

const imagePaths = [
  'lesson-01-task-contract-v1.png',
  'lesson-02-data-boundary-v1.png',
  'lesson-03-plan-first-v1.png',
  'lesson-04-approval-boundary-v1.png',
  'lesson-04-review-loop-v1.png',
  'lesson-05-grok-bot-boundary-v1.png',
  'lesson-06-codex-sandbox-v1.png',
  'lesson-07-career-evidence-v1.png'
];
for (const image of imagePaths) {
  const absolutePath = path.join(root, 'public', 'illustrations', 'ai-app-course', image);
  if (!fs.existsSync(absolutePath)) fail(`missing lesson illustration ${image}`);
  if (fs.statSync(absolutePath).size < 10_000) fail(`lesson illustration is unexpectedly small: ${image}`);
  if (!courseCopy.includes(image)) fail(`course copy does not reference ${image}`);
}

const lessonCount = (courseCopy.match(/id: '0[1-7]'/g) ?? []).length;
if (lessonCount !== 21) {
  fail(`expected seven lessons in each of three locales; found ${lessonCount} lesson records`);
}

console.log('AI app course validated: seven localized lessons, one instructional visual per lesson, official app adapters, and local-only boundaries.');
