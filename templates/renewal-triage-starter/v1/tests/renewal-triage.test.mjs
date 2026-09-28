import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { blockedOutreachRequest, draftQueueRequest } from "../data/request-fixtures.mjs";
import { syntheticRenewalSnapshot } from "../data/synthetic-renewal-snapshot.mjs";
import { routeRenewalTriage } from "../src/route-renewal-triage.mjs";

const expectedOutputPath = new URL("../expected-output.json", import.meta.url);

test("builds the fixed review-only draft and matches the recorded output", async () => {
  const expectedOutput = JSON.parse(await readFile(expectedOutputPath, "utf8"));
  const actualOutput = routeRenewalTriage({
    snapshot: syntheticRenewalSnapshot,
    request: draftQueueRequest,
    capacity: 2,
  });

  assert.deepEqual(actualOutput, expectedOutput);
  assert.equal(actualOutput.actionBoundary.externalActionsPerformed, false);
  assert.equal(actualOutput.actionBoundary.requiresHumanReview, true);
});

test("keeps raw risk ranking separate from capacity-aware business priority", () => {
  const report = routeRenewalTriage({
    snapshot: syntheticRenewalSnapshot,
    request: draftQueueRequest,
    capacity: 2,
  });

  assert.deepEqual(report.rawRiskQueue.selected.map((row) => row.accountId), ["SYN-RN-001", "SYN-RN-002"]);
  assert.deepEqual(report.businessPriorityQueue.selected.map((row) => row.accountId), ["SYN-RN-002", "SYN-RN-004"]);
  assert.equal(report.offlineFixtureEvaluation.rawRiskQueueUtilityUnits, 16);
  assert.equal(report.offlineFixtureEvaluation.businessPriorityQueueUtilityUnits, 26);
  assert.equal(report.offlineFixtureEvaluation.deltaUtilityUnits, 10);
  assert.deepEqual(report.rawRiskQueue.excludedAccountIds, ["SYN-RN-005"]);
  assert.equal("syntheticOfflineReviewValueUnits" in report.rawRiskQueue.selected[0], false);
  assert.equal("syntheticOfflineReviewValueUnits" in report.businessPriorityQueue.selected[0], false);
});

test("blocks an operation that would cross the decision boundary", () => {
  const result = routeRenewalTriage({
    snapshot: syntheticRenewalSnapshot,
    request: blockedOutreachRequest,
    capacity: 2,
  });

  assert.equal(result.route, "BLOCKED_OUT_OF_SCOPE_OPERATION");
  assert.deepEqual(result.reasonCodes, ["OPERATION_NOT_ALLOWED"]);
  assert.equal(result.queueDrafted, false);
  assert.equal(result.actionBoundary.externalActionsPerformed, false);
});

test("blocks a non-synthetic fixture before any queue is drafted", () => {
  const invalidSnapshot = structuredClone(syntheticRenewalSnapshot);
  invalidSnapshot.provenance = "unverified_external_data";

  const result = routeRenewalTriage({
    snapshot: invalidSnapshot,
    request: draftQueueRequest,
    capacity: 2,
  });

  assert.equal(result.route, "BLOCKED_INVALID_INPUT");
  assert.deepEqual(result.reasonCodes, ["SYNTHETIC_PROVENANCE_REQUIRED"]);
  assert.equal(result.queueDrafted, false);
});

test("blocks an invalid capacity before any queue is drafted", () => {
  const result = routeRenewalTriage({
    snapshot: syntheticRenewalSnapshot,
    request: draftQueueRequest,
    capacity: 0,
  });

  assert.equal(result.route, "BLOCKED_INVALID_INPUT");
  assert.deepEqual(result.reasonCodes, ["CAPACITY_MUST_BE_POSITIVE_INTEGER"]);
  assert.equal(result.queueDrafted, false);
});
