import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packRoot = path.join(root, 'public', 'templates', 'portfolio-evidence-handoff-pack', 'v1');
const validatorPath = path.join(packRoot, 'scripts', 'validate-portfolio-evidence.mjs');
const cardPath = path.join(root, 'components', 'portfolio-evidence-handoff-card.tsx');
const plannerPath = path.join(root, 'components', 'portfolio-evidence-planner.tsx');
const receiptPath = path.join(root, 'components', 'portfolio-verification-receipt.tsx');
const pagePath = path.join(root, 'app', '[lang]', 'portfolio-evidence-planner', 'page.tsx');
const copyPath = path.join(root, 'lib', 'portfolio-evidence-handoff-pack.ts');

function fail(message) {
  throw new Error(message);
}

for (const file of [validatorPath, cardPath, plannerPath, receiptPath, pagePath, copyPath]) {
  if (!fs.existsSync(file)) fail('portfolio evidence handoff is missing ' + path.relative(root, file));
}

for (const relativePath of [
  'README.md',
  'README.zh-HK.md',
  'README.zh-TW.md',
  'README.zh-Hans.md',
  'docs/project-brief.md',
  'docs/source-data-receipt.md',
  'docs/run-receipt.md',
  'docs/claims-and-nonclaims.md',
  'docs/reviewer-decision.md',
  'docs/rollback-record.md',
  'docs/LICENSE_DECISION.md',
  'docs/github-candidate-checklist.md',
  'ci/local-evidence-check.yml.example'
]) {
  if (!fs.existsSync(path.join(packRoot, relativePath))) {
    fail('portfolio evidence handoff source pack is missing ' + relativePath);
  }
}

const readme = fs.readFileSync(path.join(packRoot, 'README.md'), 'utf8');
for (const required of [
  '# Portfolio Evidence Handoff Pack',
  'Status: reader-owned local template.',
  'No packages need to be installed.',
  'handoff structure is ready for owner review',
  'It does not establish a valid run, evaluation quality, source permission, repository safety, approval, publication, deployment, security approval, business impact, or production readiness.'
]) {
  if (!readme.includes(required)) fail('portfolio evidence handoff README is missing its explicit boundary: ' + required);
}

const card = fs.readFileSync(cardPath, 'utf8');
const planner = fs.readFileSync(plannerPath, 'utf8');
const receipt = fs.readFileSync(receiptPath, 'utf8');
const page = fs.readFileSync(pagePath, 'utf8');
const copy = fs.readFileSync(copyPath, 'utf8');

for (const required of [
  'PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS',
  'portfolioEvidenceHandoffPackCopy',
  'planner-handoff-pack',
  'structurally ready for owner review'
]) {
  if (!card.includes(required) && !copy.includes(required)) {
    fail('portfolio evidence handoff card/copy is missing ' + required);
  }
}

if (card.includes("'use client'")) fail('portfolio evidence handoff card must remain server-rendered');
if (planner.includes('portfolioEvidenceHandoffPackCopy') || planner.includes('PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS')) {
  fail('portfolio evidence handoff must remain out of the interactive client planner');
}

const workedExamplesIndex = page.indexOf('<PortfolioWorkedExamples locale={lang} />');
const handoffCardIndex = page.indexOf('<PortfolioEvidenceHandoffCard locale={lang} />');
if (!page.includes("import { PortfolioEvidenceHandoffCard } from '@/components/portfolio-evidence-handoff-card';") || workedExamplesIndex < 0 || handoffCardIndex < 0 || workedExamplesIndex > handoffCardIndex) {
  fail('portfolio planner page must mount the server handoff card after worked examples');
}

for (const required of [
  'PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS',
  'portfolio-verification-receipt__handoff',
  'After a run: leave evidence a reviewer can follow'
]) {
  if (!receipt.includes(required)) fail('portfolio receipt handoff link is missing ' + required);
}

const output = execFileSync(process.execPath, ['scripts/validate-portfolio-evidence.mjs'], {
  cwd: packRoot,
  encoding: 'utf8'
});
if (!output.includes('PASS: STRUCTURALLY_READY_FOR_OWNER_REVIEW only.')) {
  fail('portfolio evidence handoff source validator did not report its bounded pass state');
}

console.log('Validated the reader-owned Portfolio Evidence Handoff Pack, server-rendered entry points, and local-only owner-review boundary.');
