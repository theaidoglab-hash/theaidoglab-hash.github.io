import assert from "node:assert/strict";
import test from "node:test";

import {
  SYNTHETIC_OWNER_APPROVED_PILOT_DESIGN_V1,
  SYNTHETIC_PILOT_DESIGN_V1,
} from "../data/pilot-design-v1.mjs";
import { assertPilotReadiness, evaluatePilotReadiness } from "../src/pilot-readiness.mjs";

function changedDesign(change) {
  const clone = structuredClone(SYNTHETIC_OWNER_APPROVED_PILOT_DESIGN_V1);
  change(clone);
  return clone;
}

test("the default synthetic design is blocked and cannot take an external action", () => {
  const result = evaluatePilotReadiness(SYNTHETIC_PILOT_DESIGN_V1);

  assert.equal(result.state, "PLANNING_ONLY");
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.deployable, false);
  assert.deepEqual(result.automaticActions, []);
  assert.equal(result.outcomeClaimStatus, "NOT_OBSERVED");
  assert.ok(result.blockers.includes("dataOwner"));
  assert.ok(result.blockers.includes("primaryWorkflowMetric"));
});

test("a complete synthetic design can be pilot-ready without becoming deployable", () => {
  const result = evaluatePilotReadiness(SYNTHETIC_OWNER_APPROVED_PILOT_DESIGN_V1);

  assert.equal(result.state, "OWNER_APPROVED_PILOT");
  assert.equal(result.status, "READY_FOR_SYNTHETIC_OWNER_APPROVED_PILOT");
  assert.equal(result.deployable, false);
  assert.equal(result.syntheticOnly, true);
  assert.deepEqual(result.automaticActions, []);
  assert.equal(result.outcomeClaimStatus, "NOT_OBSERVED");
  assert.deepEqual(result.blockers, []);
  assert.equal(assertPilotReadiness(result), result);
});

test("missing ownership, comparison, metric, or outcome definitions block the proposed pilot", () => {
  const scenarios = [
    ["human reviewer", (design) => { design.operations.humanReviewer = ""; }, "humanReviewer"],
    ["comparison strategy", (design) => { design.comparison.strategy = ""; }, "frozenComparison"],
    ["workflow metric", (design) => { design.measurements.primaryWorkflowMetric = null; }, "primaryWorkflowMetric"],
    ["delayed outcome", (design) => { design.measurements.delayedOutcome.claimStatus = "OBSERVED"; }, "delayedOutcomeDefinition"],
  ];

  for (const [, change, expectedBlocker] of scenarios) {
    const result = evaluatePilotReadiness(changedDesign(change));
    assert.equal(result.status, "BLOCKED");
    assert.ok(result.blockers.includes(expectedBlocker));
  }
});

test("a connected or action-enabled design is blocked before any pilot state", () => {
  const result = evaluatePilotReadiness(changedDesign((design) => {
    design.actionContract.connectionMode = "connected";
    design.actionContract.externalActionsAllowed = true;
  }));

  assert.equal(result.status, "BLOCKED");
  assert.ok(result.blockers.includes("decisionSupportBoundary"));
  assert.throws(() => assertPilotReadiness(result), /pilot readiness blocked/);
});
