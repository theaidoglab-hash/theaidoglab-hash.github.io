import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  buildNoCodePersonalCaseEvidencePack,
  buildNoCodePersonalCasePlanFirstPrompt,
  createNoCodePersonalCaseInput,
  getNoCodePersonalCaseCopy,
  isNoCodePersonalCaseRoute,
  validateNoCodePersonalCaseInput
} from '../lib/no-code-personal-case-builder.ts';
import {
  buildNoCodePersonalCasePrototypeHandoffPrompt,
  getNoCodePersonalCasePrototypeHandoffCopy,
  NO_CODE_PERSONAL_CASE_PROTOTYPE_PATHS,
  NO_CODE_PERSONAL_CASE_PROTOTYPE_PRACTICE_FOLDER
} from '../lib/no-code-personal-case-prototype-handoff.ts';

const locales = ['zh-Hant', 'zh-Hans', 'en'];

function completeInput(locale) {
  const input = createNoCodePersonalCaseInput(locale);
  return {
    ...input,
    businessSituation: 'An invented weekly review decision.',
    decisionOwner: 'Fictional operations reviewer.',
    currentManualWay: 'A reviewer checks each invented record by hand.',
    errorConsequence: 'The reviewer must repeat the local check.',
    allowedFields: 'Invented request ID\nPublic category',
    prohibitedDataAndActions: 'No real records\nNo external actions',
    draftOnlyOutput: 'A local reviewer note.',
    handoffRule: 'Hand off missing or conflicting material.',
    stopRule: 'Stop for real material or an external action.',
    baseline: 'Manual classification against the fixed fields.',
    measure: 'Every fixed case has an observed route and note.',
    guardrail: 'Do not create a draft when a boundary fails.',
    rollback: 'Return the case to the fictional reviewer.',
    reviewerRole: 'Fictional operations reviewer.',
    reviewerDate: '2026-09-26',
    unresolvedIssue: 'Who resolves a source conflict?',
    fixedCases: getNoCodePersonalCaseCopy(locale).fixedCases.map((caseCopy, index) => ({
      scenario: `Invented test scenario ${index + 1}.`,
      observedRoute: caseCopy.expectedRoute,
      reasonOrFailureNote: `The local observation follows fixed route ${caseCopy.expectedRoute}.`
    }))
  };
}

function casesMarkdown(input, locale) {
  const evidencePack = buildNoCodePersonalCaseEvidencePack(input, locale);
  return evidencePack.files.find(file => file.path === 'eval/cases.md')?.content ?? '';
}

assert.equal(isNoCodePersonalCaseRoute('DRAFT_REVIEW_NOTE'), true);
assert.equal(isNoCodePersonalCaseRoute('HANDOFF'), true);
assert.equal(isNoCodePersonalCaseRoute('STOP'), true);
assert.equal(isNoCodePersonalCaseRoute('SEND_NOW'), false);
assert.equal(isNoCodePersonalCaseRoute(''), false);
assert.equal(isNoCodePersonalCaseRoute(undefined), false);
assert.deepEqual(NO_CODE_PERSONAL_CASE_PROTOTYPE_PATHS, [
  'README.md',
  'index.html',
  'styles.css',
  'app.js',
  'eval/cases.md',
  'docs/handoff.md'
], 'the prototype handoff must retain its exact six-file scope');

const prototypeModuleSource = readFileSync(new URL('../lib/no-code-personal-case-prototype-handoff.ts', import.meta.url), 'utf8');
for (const forbiddenRuntimeSurface of [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/, /\bnavigator\./, /\bwindow\./, /\bdocument\./, /\blocalStorage\b/, /\bsessionStorage\b/]) {
  assert.doesNotMatch(prototypeModuleSource, forbiddenRuntimeSurface, `prototype handoff must remain text-only: ${forbiddenRuntimeSurface}`);
}

const builderComponentSource = readFileSync(new URL('../components/no-code-personal-case-builder.tsx', import.meta.url), 'utf8');
assert.match(builderComponentSource, /buildNoCodePersonalCasePrototypeHandoffPrompt\(input, locale, reviewerRecordReady\)/, 'prototype card must be derived from the existing reviewer acknowledgement');
assert.match(builderComponentSource, /\{prototypeHandoffPrompt \? <section className="no-code-personal-case-prototype"/, 'prototype card must not render before its fail-closed prompt exists');

for (const locale of locales) {
  const input = completeInput(locale);
  const validation = validateNoCodePersonalCaseInput(input, locale);
  assert.equal(validation.complete, true, `${locale} complete local input should pass`);
  assert.equal(validation.caseEvaluations.length, 6, `${locale} must evaluate six fixed cases`);
  assert.deepEqual(
    validation.caseEvaluations.map(result => result.status),
    ['match', 'match', 'match', 'match', 'match', 'match'],
    `${locale} matching observations should be recorded as matches`
  );
  const markdown = casesMarkdown(input, locale);
  assert.ok(markdown.includes(getNoCodePersonalCaseCopy(locale).caseRecord.resultLabel), `${locale} export must state each check result`);
  for (const fixedCase of getNoCodePersonalCaseCopy(locale).fixedCases) {
    assert.ok(markdown.includes(`> ${fixedCase.expectedRoute} —`), `${locale} export must retain canonical route ${fixedCase.expectedRoute}`);
  }

  assert.equal(
    buildNoCodePersonalCasePrototypeHandoffPrompt(createNoCodePersonalCaseInput(locale), locale, true),
    null,
    `${locale} prototype handoff must stay hidden until the worksheet is complete`
  );
  assert.equal(
    buildNoCodePersonalCasePrototypeHandoffPrompt(input, locale, false),
    null,
    `${locale} prototype handoff must stay hidden until the reviewer acknowledgement is checked`
  );
  const prototypePrompt = buildNoCodePersonalCasePrototypeHandoffPrompt(input, locale, true);
  assert.ok(prototypePrompt, `${locale} complete worksheet plus acknowledgement should produce a local handoff prompt`);
  assert.ok(prototypePrompt.includes(`\`${NO_CODE_PERSONAL_CASE_PROTOTYPE_PRACTICE_FOLDER}/\``), `${locale} prompt must retain the exact empty practice-folder scope`);
  for (const path of NO_CODE_PERSONAL_CASE_PROTOTYPE_PATHS) {
    assert.ok(prototypePrompt.includes(`\`${NO_CODE_PERSONAL_CASE_PROTOTYPE_PRACTICE_FOLDER}/${path}\``), `${locale} prompt must list only the fixed prototype path ${path}`);
  }
  for (const fixedCase of getNoCodePersonalCaseCopy(locale).fixedCases) {
    assert.ok(prototypePrompt.includes(`### ${fixedCase.label}`), `${locale} prompt must retain all six fixed cases`);
    assert.ok(prototypePrompt.includes(`\`${fixedCase.expectedRoute}\``), `${locale} prompt must retain expected route ${fixedCase.expectedRoute}`);
  }
  for (const requiredBoundary of ['API', 'model', 'network request', 'account', 'key', 'telemetry', 'connector', 'browser automation', 'real data', 'external action']) {
    assert.ok(prototypePrompt.includes(requiredBoundary), `${locale} prompt must prohibit ${requiredBoundary}`);
  }
  for (const requiredHandoffHeading of ['### File list', '### Diff summary', '### Six fixed-case results', '### Known failures', '### Unrun checks']) {
    assert.ok(prototypePrompt.includes(requiredHandoffHeading), `${locale} prompt must require ${requiredHandoffHeading}`);
  }
  assert.ok(
    prototypePrompt.includes(getNoCodePersonalCasePrototypeHandoffCopy(locale).readmeGuidance),
    `${locale} prompt must retain localized README guidance while source filenames stay fixed`
  );
}

const mismatchInput = completeInput('en');
mismatchInput.fixedCases[0].observedRoute = 'HANDOFF';
mismatchInput.fixedCases[0].reasonOrFailureNote = 'The record was intentionally sent to a reviewer for inspection.';
const mismatchValidation = validateNoCodePersonalCaseInput(mismatchInput, 'en');
assert.equal(mismatchValidation.complete, true, 'a documented mismatch is an assessable result, not a silent pass');
assert.equal(mismatchValidation.caseEvaluations[0].status, 'mismatch');
assert.match(casesMarkdown(mismatchInput, 'en'), /Mismatch: the observed route differs from the fixed expected route\./);

const missingReasonInput = completeInput('en');
missingReasonInput.fixedCases[0].reasonOrFailureNote = '';
const missingReasonValidation = validateNoCodePersonalCaseInput(missingReasonInput, 'en');
assert.equal(missingReasonValidation.complete, false, 'a route result without a reason is incomplete');
assert.ok(missingReasonValidation.missing.includes('case-1-reasonOrFailureNote'));
assert.equal(missingReasonValidation.caseEvaluations[0].reasonProvided, false);
assert.match(casesMarkdown(missingReasonInput, 'en'), /Reason or failure note \(required for every result\)/);

const invalidObservedRouteInput = completeInput('en');
invalidObservedRouteInput.fixedCases[0].observedRoute = 'SEND_NOW';
const invalidObservedValidation = validateNoCodePersonalCaseInput(invalidObservedRouteInput, 'en');
assert.equal(invalidObservedValidation.complete, false, 'an unknown observed route must not be accepted');
assert.equal(invalidObservedValidation.caseEvaluations[0].status, 'incomplete');
assert.equal(invalidObservedValidation.caseEvaluations[0].observedRouteValid, false);
assert.ok(invalidObservedValidation.missing.includes('case-1-observedRouteInvalid'));
assert.match(casesMarkdown(invalidObservedRouteInput, 'en'), /Observed route is not an allowed value: "SEND_NOW"/);
assert.match(casesMarkdown(invalidObservedRouteInput, 'en'), /Incomplete: the observed route is missing or is not an allowed route\./);

const alteredExpectedRouteInput = completeInput('en');
Object.assign(alteredExpectedRouteInput.fixedCases[0], { expectedRoute: 'STOP' });
const alteredExpectedValidation = validateNoCodePersonalCaseInput(alteredExpectedRouteInput, 'en');
assert.equal(alteredExpectedValidation.complete, false, 'an injected expected route must be surfaced for review');
assert.equal(alteredExpectedValidation.caseEvaluations[0].expectedRoute, 'DRAFT_REVIEW_NOTE');
assert.equal(alteredExpectedValidation.caseEvaluations[0].fixedExpectedRouteOverride, 'STOP');
assert.ok(alteredExpectedValidation.missing.includes('case-1-fixedExpectedRouteOverride'));
const alteredFirstCase = casesMarkdown(alteredExpectedRouteInput, 'en').split('### 02 Missing required field')[0];
assert.match(alteredFirstCase, /Fixed expected route\n> DRAFT_REVIEW_NOTE —/);
assert.match(alteredFirstCase, /A changed fixed expected route was detected; exports keep the original fixed route\. "STOP"/);
const alteredPromptFirstCase = buildNoCodePersonalCasePlanFirstPrompt(alteredExpectedRouteInput, 'en').split('### 02 Missing required field')[0];
assert.match(alteredPromptFirstCase, /Fixed expected route\n> DRAFT_REVIEW_NOTE —/);
assert.match(alteredPromptFirstCase, /A changed fixed expected route was detected; exports keep the original fixed route\. "STOP"/);

console.log('Validated Personal Case Builder fixed routes, observed-route runtime checks, fail-closed local prototype handoff, required six-case records, and honest local Markdown exports.');
