import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ACTION_CONTRACT } from "../src/action-contract.mjs";
import { RESULT_STATUS, SOURCE_URLS } from "../src/constants.mjs";
import { FIXED_EVALUATION_CASES } from "../src/evaluation-cases.mjs";
import { runFixedEvaluation, validateFixtureBundle } from "../src/evaluate.mjs";
import { loadFixtureBundle } from "../src/fixture-loader.mjs";
import { RESPONSES_API_GPT_5_MINI_FIXTURE } from "../src/responses-api-fixture.mjs";
import { validateManifest, validateSeries } from "../src/source-validation.mjs";
import { buildWorkforceSignalBrief } from "../src/workforce-signal-brief.mjs";
import { diffEvaluationReports } from "../scripts/eval-diff.mjs";

const directory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(directory, "..");

function readPackageFile(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("the action contract remains evidence-only", () => {
  assert.equal(ACTION_CONTRACT.mode, "evidence_only");
  assert.deepEqual(ACTION_CONTRACT.allowedActions, []);
  assert.equal(ACTION_CONTRACT.requiresHumanReview, true);
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("forecast_labour_market"));
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("recommend_hiring"));
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("publish_external_brief"));
});

for (const scenario of FIXED_EVALUATION_CASES) {
  test(`fixed case: ${scenario.caseId}`, () => {
    const result = buildWorkforceSignalBrief(structuredClone(scenario.input));
    const serialised = JSON.stringify(result).toLowerCase();
    assert.equal(result.status, scenario.expectedStatus);
    assert.equal(result.reasonCode, scenario.expectedReasonCode);
    assert.equal(result.action.kind, "none");
    assert.equal(result.action.mode, "evidence_only");
    assert.equal(result.action.status, "not_executed");
    assert.equal(result.action.requiresHumanReview, true);
    assert.equal(result.trace.rawInputRetained, false);
    assert.equal(result.trace.sourceProseExecuted, false);
    assert.equal(result.trace.externalActionExecuted, false);
    if (scenario.expectedStatus === RESULT_STATUS.READY) {
      assert.ok(Object.hasOwn(result, "packet"));
      assert.equal(result.packet.seriesFacts.latest.referencePeriod, scenario.expectedLatestPeriod);
    } else {
      assert.equal(Object.hasOwn(result, "packet"), false);
    }
    for (const phrase of scenario.forbiddenOutputPhrases ?? []) {
      assert.equal(serialised.includes(phrase.toLowerCase()), false);
    }
  });
}

test("the source-shaped fixture records an official public-data route without claiming acquisition", () => {
  const { sourceManifest, series } = loadFixtureBundle();
  const manifest = validateManifest(sourceManifest);
  const seriesResult = validateSeries(series);
  assert.equal(manifest.ok, true);
  assert.equal(seriesResult.ok, true);
  assert.equal(sourceManifest.acquisitionMode, "synthetic_source_shaped_not_live_acquired");
  assert.equal(sourceManifest.sourceReceipt.dataApiGuide, SOURCE_URLS.dataApiGuide);
  assert.equal(sourceManifest.sourceReceipt.labourForceRelease, SOURCE_URLS.labourForceRelease);
  assert.equal(sourceManifest.sourceReceipt.citationGuide, SOURCE_URLS.citationGuide);
  assert.match(sourceManifest.sourceReceipt.routePurpose, /contains no ABS observation/i);
  assert.equal(series.observations.every((item) => item.status === "synthetic"), true);
});

test("a ready packet exposes a delta but refuses to turn it into a forecast", () => {
  const result = buildWorkforceSignalBrief(loadFixtureBundle());
  assert.equal(result.status, RESULT_STATUS.READY);
  assert.equal(result.packet.seriesFacts.latest.referencePeriod, "2026-08");
  assert.equal(result.packet.seriesFacts.latestMinusPrevious, -0.5);
  assert.ok(result.packet.interpretationBoundaries.some((item) => /not a trend claim, forecast/i.test(item)));
  assert.ok(result.packet.interpretationBoundaries.some((item) => /cannot make a staffing, salary, visa/i.test(item)));
});

test("the fixed local evaluation meets its declared hard gates", () => {
  const fixture = validateFixtureBundle();
  const report = runFixedEvaluation();
  assert.equal(fixture.overallStatus, "PASS");
  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.passCount, FIXED_EVALUATION_CASES.length);
  assert.deepEqual(report.hardGates, {
    allExpectedRoutesPassed: true,
    noExternalActionsObserved: true,
    readyOrSourceRejectedOnly: true,
    noRawInputRetained: true,
    noSourceProseExecuted: true,
    sourceFactsPreserved: true,
  });
});

test("the gpt-5-mini Responses fixture is static and credential-free", () => {
  const fixture = RESPONSES_API_GPT_5_MINI_FIXTURE;
  const serialised = JSON.stringify(fixture);
  assert.equal(fixture.label, "mock_only_not_executed");
  assert.equal(fixture.request.path, "/v1/responses");
  assert.equal(fixture.request.model, "gpt-5-mini");
  assert.equal(fixture.request.store, false);
  assert.equal(Object.hasOwn(fixture, "apiKey"), false);
  assert.equal(Object.hasOwn(fixture.request, "authorization"), false);
  assert.doesNotMatch(serialised, /\bsk-[A-Za-z0-9_-]+/);
});

test("the human-authored model-contract fixture pairs a context packet with a no-forecast rejection", () => {
  const fixture = JSON.parse(readPackageFile("fixtures/model-contract-teaching.fixture.json"));
  const teachingDoc = readPackageFile("docs/model-contract-teaching-fixture.md");
  const allowed = fixture.scenarios.find(({ responseClass }) => responseClass === "allowed_structured_response");
  const rejected = fixture.scenarios.find(({ responseClass }) => responseClass === "rejected_bounded_response");

  assert.equal(fixture.status, "human_authored_static_not_executed");
  assert.match(fixture.executionStatement, /not model output or a model run/i);
  assert.match(fixture.modelSeam.shape, /gpt-5-mini Responses-shaped/i);
  assert.ok(allowed);
  assert.ok(rejected);
  assert.equal(allowed.expectedRoute, allowed.structuredResponse.status);
  assert.equal(allowed.structuredResponse.status, RESULT_STATUS.READY);
  assert.equal(allowed.structuredResponse.seriesId, "SYNTHETIC-WORKFORCE-CONTEXT-INDEX");
  assert.equal(allowed.structuredResponse.latestPeriod, "2026-08");
  assert.equal(allowed.structuredResponse.latestValue, 101.4);
  assert.deepEqual(allowed.structuredResponse.action, {
    kind: "none",
    mode: "evidence_only",
    requiresHumanReview: true,
  });
  assert.equal(allowed.reviewerDecision.decision, "REVIEW_SYNTHETIC_CONTEXT_ONLY");
  assert.equal(rejected.expectedRoute, rejected.structuredResponse.status);
  assert.equal(rejected.structuredResponse.status, RESULT_STATUS.REJECTED);
  assert.equal(rejected.structuredResponse.reasonCode, "ACTION_REQUEST_REJECTED");
  assert.equal(rejected.structuredResponse.seriesId, null);
  assert.equal(rejected.structuredResponse.latestValue, null);
  assert.deepEqual(rejected.structuredResponse.action, {
    kind: "none",
    mode: "evidence_only",
    requiresHumanReview: true,
  });
  assert.equal(rejected.reviewerDecision.decision, "STOP_AND_RESTATE_BOUNDARY");
  assert.match(teachingDoc, /not model output or a\s+model run/i);
});

test("the evidence delta identifies a declared new pass but does not approve release", () => {
  const baseline = JSON.parse(readPackageFile("evals/change-001-baseline.fixture.json"));
  const candidate = JSON.parse(readPackageFile("evals/change-001-candidate.fixture.json"));
  const diff = diffEvaluationReports(baseline, candidate);
  assert.equal(diff.result, "NO_DECLARED_REGRESSION");
  assert.equal(diff.regressionCount, 0);
  assert.equal(diff.newlyPassedCount, 1);
  assert.equal(diff.comparisonContext.comparable, true);
  assert.equal(diff.cases.find((item) => item.caseId === "forecast-request").newlyPassed, true);
  assert.match(diff.reviewBoundary, /not a live-data check/i);
});

test("the evidence delta refuses a mismatched fixture comparison", () => {
  const baseline = JSON.parse(readPackageFile("evals/change-001-baseline.fixture.json"));
  const candidate = JSON.parse(readPackageFile("evals/change-001-candidate.fixture.json"));
  candidate.evaluationContext.fixtureId = "other-fixture";
  const diff = diffEvaluationReports(baseline, candidate);
  assert.equal(diff.result, "COMPARISON_NOT_COMPARABLE");
  assert.equal(diff.comparisonContext.comparable, false);
  assert.ok(diff.comparisonContext.issues.includes("CONTEXT_fixtureId_MISMATCH"));
});

test("the Promptfoo configurations remain optional and key-free", () => {
  const fixtureConfig = readPackageFile("evals/promptfoo.fixture.yaml");
  const optionalConfig = readPackageFile("evals/promptfoo.responses.optional.yaml");
  assert.match(fixtureConfig, /file:\/\/\.\.\/src\/promptfoo-fixture-provider\.mjs/);
  assert.doesNotMatch(fixtureConfig, /openai:responses/i);
  assert.match(optionalConfig, /id: openai:responses:gpt-5-mini/);
  assert.match(optionalConfig, /store: false/);
  assert.match(optionalConfig, /output\.action\.kind === 'none'/);
  assert.match(optionalConfig, /A forecast request is rejected/);
  assert.doesNotMatch(optionalConfig, /apiKey\s*:/i);
  assert.doesNotMatch(optionalConfig, /authorization\s*:/i);
  assert.doesNotMatch(optionalConfig, /\bsk-[A-Za-z0-9_-]+/);
});

test("the output schema names the two permitted result shapes", () => {
  const schema = JSON.parse(readPackageFile("schemas/workforce-signal-contract.schema.json"));
  const ready = buildWorkforceSignalBrief(loadFixtureBundle());
  const rejected = buildWorkforceSignalBrief({ ...loadFixtureBundle(), requestedAction: "forecast_labour_market" });
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$defs.readyResult.properties.status.const, RESULT_STATUS.READY);
  assert.equal(schema.$defs.rejectedResult.properties.status.const, RESULT_STATUS.REJECTED);
  assert.equal(schema.oneOf.length, 2);
  assert.deepEqual(Object.keys(ready).sort(), Object.keys(schema.$defs.readyResult.properties).sort());
  assert.deepEqual(Object.keys(rejected).sort(), Object.keys(schema.$defs.rejectedResult.properties).sort());
});

test("the optional Promptfoo schema carries the no-action contract and rejection nulls", () => {
  const schema = JSON.parse(readPackageFile("schemas/promptfoo-context-brief-response-format.json"));
  const result = schema.json_schema.schema;

  assert.ok(result.required.includes("action"));
  assert.ok(result.required.includes("rejectionMessage"));
  assert.equal(result.properties.action.properties.kind.const, "none");
  assert.equal(result.properties.action.properties.mode.const, "evidence_only");
  assert.equal(result.properties.action.properties.requiresHumanReview.const, true);
  assert.deepEqual(result.properties.seriesId.type, ["string", "null"]);
});
