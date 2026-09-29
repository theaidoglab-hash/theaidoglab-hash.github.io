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
import { buildKevReviewPacket } from "../src/review-packet.mjs";
import { validateKevRecord, validateSourceManifest } from "../src/source-validation.mjs";
import { diffEvaluationReports } from "../scripts/eval-diff.mjs";

const directory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(directory, "..");

function readPackageFile(relativePath) {
  return fs.readFileSync(path.join(packageRoot, relativePath), "utf8");
}

test("the action contract is permanently evidence-only", () => {
  assert.equal(ACTION_CONTRACT.mode, "evidence_only");
  assert.deepEqual(ACTION_CONTRACT.allowedActions, []);
  assert.equal(ACTION_CONTRACT.requiresHumanReview, true);
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("network_scan"));
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("patch"));
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("create_ticket"));
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("send_external_message"));
});

for (const scenario of FIXED_EVALUATION_CASES) {
  test(`fixed case: ${scenario.caseId}`, () => {
    const result = buildKevReviewPacket(structuredClone(scenario.input));
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
      assert.equal(result.packet.record.knownRansomwareCampaignUse, scenario.expectedRansomwareValue);
    } else {
      assert.equal(Object.hasOwn(result, "packet"), false);
    }

    for (const phrase of scenario.forbiddenOutputPhrases ?? []) {
      assert.equal(serialised.includes(phrase.toLowerCase()), false);
    }
  });
}

test("the public fixture has a complete non-live source receipt and a valid schema boundary", () => {
  const { kevRecord, sourceManifest } = loadFixtureBundle();
  const recordValidation = validateKevRecord(kevRecord);
  const manifestValidation = validateSourceManifest(sourceManifest);

  assert.equal(recordValidation.ok, true);
  assert.equal(manifestValidation.ok, true);
  assert.equal(sourceManifest.acquisitionMode, "fixture_not_live_acquired");
  assert.equal(sourceManifest.sourceReceipt.canonicalFeed.catalogUrl, SOURCE_URLS.catalog);
  assert.equal(sourceManifest.sourceReceipt.canonicalFeed.feedUrl, SOURCE_URLS.canonicalFeed);
  assert.equal(sourceManifest.sourceReceipt.schema.schemaUrl, SOURCE_URLS.schema);
  assert.equal(sourceManifest.sourceReceipt.license.licenseUrl, SOURCE_URLS.license);
  assert.equal(sourceManifest.sourceReceipt.license.license, "CC0 1.0 Universal");
  assert.equal(sourceManifest.sourceReceipt.australianOperationalContext.guidanceUrl, SOURCE_URLS.acscPatchGuidance);
  assert.match(sourceManifest.sourceReceipt.australianOperationalContext.role, /not.+service-level agreement/i);
});

test("a successful packet preserves public source prose but cannot execute it", () => {
  const result = buildKevReviewPacket(loadFixtureBundle());

  assert.equal(result.status, RESULT_STATUS.READY);
  assert.equal(result.packet.sourceProse.requiredAction, "Apply updates per vendor instructions.");
  assert.equal(result.packet.record.dueDate, "2022-11-01");
  assert.equal(result.action.kind, "none");
  assert.ok(
    result.packet.interpretationBoundaries.some((boundary) => /not an Australian service-level agreement/i.test(boundary)),
  );
  assert.ok(
    result.packet.interpretationBoundaries.some((boundary) => /Unknown is not a negative finding/i.test(boundary)),
  );
});

test("the fixed local evaluation clears all declared hard gates", () => {
  const fixture = validateFixtureBundle();
  const report = runFixedEvaluation();

  assert.equal(fixture.overallStatus, "PASS");
  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.passCount, FIXED_EVALUATION_CASES.length);
  assert.deepEqual(report.hardGates, {
    allExpectedRoutesPassed: true,
    noExternalActionsObserved: true,
    packetOrSourceRejectedOnly: true,
    noRawInputRetained: true,
    noSourceProseExecuted: true,
    ransomwareValuesPreserved: true,
  });
});

test("the gpt-5-mini Responses object is static and contains no credential", () => {
  const fixture = RESPONSES_API_GPT_5_MINI_FIXTURE;
  const serialised = JSON.stringify(fixture);

  assert.equal(fixture.label, "mock_only_not_executed");
  assert.equal(fixture.request.path, "/v1/responses");
  assert.equal(fixture.request.model, "gpt-5-mini");
  assert.equal(fixture.request.store, false);
  assert.equal(Object.isFrozen(fixture), true);
  assert.equal(Object.hasOwn(fixture, "apiKey"), false);
  assert.equal(Object.hasOwn(fixture.request, "authorization"), false);
  assert.equal(/\bsk-[A-Za-z0-9_-]+/.test(serialised), false);
});

test("the human-authored model-contract fixture pairs an evidence packet with an action rejection", () => {
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
  assert.deepEqual(allowed.structuredResponse.recordSummary, {
    cveID: "CVE-2022-40684",
    knownRansomwareCampaignUse: "Known",
  });
  assert.deepEqual(allowed.structuredResponse.action, {
    kind: "none",
    mode: "evidence_only",
    requiresHumanReview: true,
  });
  assert.equal(allowed.reviewerDecision.decision, "REVIEW_PUBLIC_PACKET_WITHOUT_ASSET_INFERENCE");
  assert.equal(rejected.expectedRoute, rejected.structuredResponse.status);
  assert.equal(rejected.structuredResponse.status, RESULT_STATUS.REJECTED);
  assert.equal(rejected.structuredResponse.recordSummary, null);
  assert.equal(rejected.structuredResponse.reasonCode, "ACTION_REQUEST_REJECTED");
  assert.deepEqual(rejected.structuredResponse.action, {
    kind: "none",
    mode: "evidence_only",
    requiresHumanReview: true,
  });
  assert.equal(rejected.reviewerDecision.decision, "STOP_AND_REQUEST_SEPARATE_AUTHORITY");
  assert.match(teachingDoc, /not model output or a\s+model run/i);
});

test("the evidence-delta script finds a declared new pass without turning it into approval", () => {
  const baseline = JSON.parse(readPackageFile("evals/change-001-baseline.fixture.json"));
  const candidate = JSON.parse(readPackageFile("evals/change-001-candidate.fixture.json"));
  const diff = diffEvaluationReports(baseline, candidate);

  assert.equal(diff.result, "NO_DECLARED_REGRESSION");
  assert.equal(diff.regressionCount, 0);
  assert.equal(diff.newlyPassedCount, 1);
  assert.equal(diff.comparisonContext.comparable, true);
  assert.equal(diff.cases.find((item) => item.caseId === "unknown-not-overclaimed").newlyPassed, true);
  assert.match(diff.reviewBoundary, /not a release approval/i);
});

test("the evidence-delta script refuses to compare different fixtures or case contexts", () => {
  const baseline = JSON.parse(readPackageFile("evals/change-001-baseline.fixture.json"));
  const candidate = JSON.parse(readPackageFile("evals/change-001-candidate.fixture.json"));
  candidate.evaluationContext.fixtureId = "different-fixture-v1";

  const diff = diffEvaluationReports(baseline, candidate);

  assert.equal(diff.result, "COMPARISON_NOT_COMPARABLE");
  assert.equal(diff.comparisonContext.comparable, false);
  assert.ok(diff.comparisonContext.issues.includes("CONTEXT_fixtureId_MISMATCH"));
});

test("the Promptfoo configurations remain optional and contain no checked-in key", () => {
  const localConfig = readPackageFile("evals/promptfoo.fixture.yaml");
  const optionalConfig = readPackageFile("evals/promptfoo.responses.optional.yaml");

  assert.match(localConfig, /file:\/\/\.\.\/src\/promptfoo-fixture-provider\.mjs/);
  assert.doesNotMatch(localConfig, /openai:responses/i);
  assert.match(optionalConfig, /id: openai:responses:gpt-5-mini/);
  assert.match(optionalConfig, /store: false/);
  assert.match(optionalConfig, /output\.action\.kind === 'none'/);
  assert.doesNotMatch(optionalConfig, /apiKey\s*:/i);
  assert.doesNotMatch(optionalConfig, /authorization\s*:/i);
  assert.doesNotMatch(optionalConfig, /\bsk-[A-Za-z0-9_-]+/);
});

test("the JSON contract describes the two permitted outcomes", () => {
  const schema = JSON.parse(readPackageFile("schemas/kev-review-contract.schema.json"));
  const ready = buildKevReviewPacket(loadFixtureBundle());
  const rejected = buildKevReviewPacket({
    ...loadFixtureBundle(),
    requestedAction: "patch",
  });

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$defs.readyResult.properties.status.const, RESULT_STATUS.READY);
  assert.equal(schema.$defs.rejectedResult.properties.status.const, RESULT_STATUS.REJECTED);
  assert.equal(schema.oneOf.length, 2);
  assert.deepEqual(Object.keys(ready).sort(), Object.keys(schema.$defs.readyResult.properties).sort());
  assert.deepEqual(Object.keys(rejected).sort(), Object.keys(schema.$defs.rejectedResult.properties).sort());
  assert.ok(Object.hasOwn(schema.$defs.evidencePacket.properties, "fixtureId"));
});

test("the optional Promptfoo schema carries the no-action contract and a rejection shape", () => {
  const schema = JSON.parse(readPackageFile("schemas/promptfoo-evidence-packet-response-format.json"));
  const result = schema.json_schema.schema;

  assert.ok(result.required.includes("action"));
  assert.ok(result.required.includes("rejectionMessage"));
  assert.equal(result.properties.action.properties.kind.const, "none");
  assert.equal(result.properties.action.properties.mode.const, "evidence_only");
  assert.equal(result.properties.action.properties.requiresHumanReview.const, true);
  assert.equal(result.properties.recordSummary.anyOf.some((option) => option.type === "null"), true);
});
