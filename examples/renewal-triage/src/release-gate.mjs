export function evaluateReleaseGate(report) {
  const candidateUtility = report.models.candidate.queueUtility.totalUtilityUnits;
  const baselineUtility = report.models.baseline.queueUtility.totalUtilityUnits;
  const hardGates = {
    syntheticProvenanceVerified: report.ingest.valid && report.snapshot.provenance === "synthetic_authoring_only",
    pointInTimeFeaturesBuilt: report.features.allRowsPointInTimeSafe,
    decisionSupportOnly: report.actionContract.allowedActions.length === 0 && report.actionContract.requiresHumanReview,
    queueCapacityRespected: report.models.candidate.queue.selectedCount <= report.capacity
      && report.models.baseline.queue.selectedCount <= report.capacity,
    candidateQueueUtilityAtLeastBaseline: candidateUtility >= baselineUtility,
    monitoringAndRollbackPlanPresent: Boolean(report.monitoring.rollbackPlan),
  };
  const blockers = Object.entries(hardGates)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  return Object.freeze({
    gateVersion: "renewal-triage-release-gate-v1",
    status: blockers.length === 0 ? "PASS" : "BLOCKED",
    deployable: false,
    requiresHumanApproval: true,
    hardGates,
    blockers,
  });
}

export function assertReleaseGatePass(gate) {
  if (gate.status !== "PASS") {
    throw new Error(`hard release gate blocked: ${gate.blockers.join(", ")}`);
  }
  return gate;
}
