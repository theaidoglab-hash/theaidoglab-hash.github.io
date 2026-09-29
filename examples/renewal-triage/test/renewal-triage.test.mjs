import assert from "node:assert/strict";
import test from "node:test";

import { SYNTHETIC_MONITORING_SNAPSHOT_V1, SYNTHETIC_RENEWAL_SNAPSHOT_V1 } from "../data/snapshot-v1.mjs";
import { ACTION_CONTRACT } from "../src/contracts.mjs";
import { buildPointInTimeFeatures } from "../src/features.mjs";
import { validateSyntheticSnapshot } from "../src/ingest.mjs";
import { assertReleaseGatePass } from "../src/release-gate.mjs";
import { runSyntheticWorkflow } from "../src/workflow.mjs";

function workflow() {
  return runSyntheticWorkflow({
    snapshot: SYNTHETIC_RENEWAL_SNAPSHOT_V1,
    monitoringSnapshot: SYNTHETIC_MONITORING_SNAPSHOT_V1,
    capacity: 2,
  });
}

test("the versioned synthetic snapshot passes the ingest schema check", () => {
  const validation = validateSyntheticSnapshot(SYNTHETIC_RENEWAL_SNAPSHOT_V1);
  assert.equal(validation.valid, true);
  assert.equal(validation.snapshotVersion, "synthetic-renewal-snapshot-v1");
  assert.equal(validation.recordCount, 9);
});

test("future-label leakage is rejected before feature construction", () => {
  assert.throws(
    () => buildPointInTimeFeatures(SYNTHETIC_RENEWAL_SNAPSHOT_V1, {
      featureNames: ["usageDaysLast30", "outcome.nonRenewalWithin30d"],
    }),
    /future-label leakage rejected/,
  );
});

test("capacity queue excludes unavailable-for-review records and stays read-only", () => {
  const { report } = workflow();
  const queue = report.models.candidate.queue;

  assert.equal(queue.selectedCount, 2);
  assert.deepEqual(queue.selectedAccountIds, ["SYN-001", "SYN-002"]);
  assert.deepEqual(queue.excludedIneligibleAccountIds, ["SYN-009"]);
  assert.deepEqual(ACTION_CONTRACT.allowedActions, []);
  assert.equal(ACTION_CONTRACT.requiresHumanReview, true);
});

test("a stronger generic predictive metric can still lose on capacity-aware queue utility", () => {
  const { report } = workflow();
  const candidate = report.models.candidate;
  const baseline = report.models.baseline;

  assert.ok(candidate.ranking.averagePrecision > baseline.ranking.averagePrecision);
  assert.ok(candidate.queueUtility.totalUtilityUnits < baseline.queueUtility.totalUtilityUnits);
  assert.deepEqual(candidate.queue.selectedAccountIds, ["SYN-001", "SYN-002"]);
  assert.deepEqual(baseline.queue.selectedAccountIds, ["SYN-003", "SYN-004"]);
});

test("a hard release gate blocks the candidate when utility regresses", () => {
  const { releaseGate } = workflow();
  assert.equal(releaseGate.status, "BLOCKED");
  assert.equal(releaseGate.deployable, false);
  assert.ok(releaseGate.blockers.includes("candidateQueueUtilityAtLeastBaseline"));
  assert.throws(() => assertReleaseGatePass(releaseGate), /hard release gate blocked/);
});

test("synthetic monitoring proposes a human-approved rollback with no automatic action", () => {
  const { report } = workflow();
  assert.equal(report.monitoring.result.status, "ROLLBACK_REQUIRED");
  assert.equal(report.monitoring.rollbackPlan.status, "proposed");
  assert.deepEqual(report.monitoring.rollbackPlan.automaticActions, []);
  assert.equal(report.monitoring.rollbackPlan.requiresHumanApproval, true);
});
