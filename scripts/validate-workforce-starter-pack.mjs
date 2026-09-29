import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packPath = path.join(root, 'public', 'templates', 'workforce-signal-brief-starter', 'v1', 'workforce-signal-brief-starter.md');
const plannerPath = path.join(root, 'lib', 'portfolio-evidence-planner.ts');
const workedExamplesPath = path.join(root, 'components', 'portfolio-worked-examples.tsx');
const articleBodiesPath = path.join(root, 'content', 'article-bodies.json');

function fail(message) {
  throw new Error(message);
}

for (const file of [packPath, plannerPath, workedExamplesPath, articleBodiesPath]) {
  if (!fs.existsSync(file)) fail('Workforce Signal Brief starter pack is missing ' + path.relative(root, file));
}

const pack = fs.readFileSync(packPath, 'utf8');
const planner = fs.readFileSync(plannerPath, 'utf8');
const workedExamples = fs.readFileSync(workedExamplesPath, 'utf8');
const articleBodies = JSON.parse(fs.readFileSync(articleBodiesPath, 'utf8'));

if (pack.length < 9000) fail('Workforce Signal Brief starter pack is unexpectedly short');

for (const heading of [
  '# Workforce Signal Brief Starter Pack',
  '## 00. What you are demonstrating',
  '### Technical work',
  '### Delivery judgement',
  '## 01. Decision brief',
  '## 02. Source receipt — not acquired',
  '## 03. Small synthetic monthly fixture',
  '## 04. Context packet contract',
  '## 05. Deterministic baseline',
  '## 06. Manual cases, then Promptfoo-ready cases',
  '### If you later add GPT-5 mini',
  '## 07. CHANGE-001 — one change, one comparison',
  '## 08. Reviewer record and rollback',
  '## 09. A portfolio README that stays honest',
  '## What this starter pack does not provide'
]) {
  if (!pack.includes(heading)) fail('Workforce Signal Brief starter pack is missing ' + heading);
}

for (const row of [
  '2025-01,fictional-region-01,101.2,indexed-points,synthetic-not-live',
  '2025-02,fictional-region-01,100.7,indexed-points,synthetic-not-live',
  '2025-03,fictional-region-01,101.8,indexed-points,synthetic-not-live',
  '2025-04,fictional-region-01,101.4,indexed-points,synthetic-not-live'
]) {
  if (!pack.includes(row)) fail('Workforce Signal Brief starter pack misses a synthetic fixture row');
}

for (const caseId of ['WSB-01', 'WSB-02', 'WSB-03', 'WSB-04', 'WSB-05', 'WSB-06', 'WSB-07']) {
  if ((pack.match(new RegExp(caseId, 'g')) ?? []).length < 1) fail('Workforce Signal Brief starter pack has incomplete coverage for ' + caseId);
}

for (const boundary of [
  'synthetic_source_shaped_not_live_acquired',
  'The four values are invented. They do not describe a place, occupation, organisation, labour market, or future outcome.',
  'This starter pack contains no API key, request, SDK call, provider configuration, or model output.',
  'This comparison records a local fixture check only. It does not approve a release or prove model quality, business value, safety, or readiness for live data.',
  'It does not contain a private reference implementation, a public GitHub repository, real ABS data, current labour-market information, a Promptfoo run, an OpenAI Responses API call, an API key, a live model result, or permission to acquire or publish anything.'
]) {
  if (!pack.includes(boundary)) fail('Workforce Signal Brief starter pack misses a required boundary');
}

if (/OPENAI_API_KEY|sk-[A-Za-z0-9]|https?:\/\//i.test(pack)) {
  fail('Workforce Signal Brief starter pack must stay key-free and portable without live URLs');
}

for (const token of [
  'starter: {',
  '/templates/workforce-signal-brief-starter/v1/workforce-signal-brief-starter.md',
  'planner-local-starter',
  'example.starter.href',
  'download aria-describedby="portfolio-local-starter-boundary"'
]) {
  if (!planner.includes(token) && !workedExamples.includes(token)) fail('Workforce Signal Brief starter pack UI is missing ' + token);
}

if ((planner.match(/workforce-signal-brief-starter\/v1\/workforce-signal-brief-starter\.md/g) ?? []).length !== 4) {
  fail('Workforce Signal Brief starter pack link must be localised for every locale');
}

for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans', 'en']) {
  const body = articleBodies['workforce-signal-brief']?.[locale];
  if (!body?.includes('starter pack') || !body.includes('CHANGE-001')) {
    fail('Workforce Signal Brief article body does not explain the starter pack for ' + locale);
  }
}

console.log('Validated the local, synthetic Workforce Signal Brief starter pack and its reader route.');
