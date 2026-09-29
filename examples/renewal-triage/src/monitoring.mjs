export const MONITORING_THRESHOLDS = Object.freeze({
  minimumEvidenceCoverage: 0.95,
  minimumHumanReviewAcceptanceRate: 0.6,
  maximumUnresolvedQueueRate: 0.15,
});

export function evaluateSyntheticMonitoring(snapshot, thresholds = MONITORING_THRESHOLDS) {
  if (snapshot?.provenance !== "synthetic_authoring_only") {
    throw new Error("monitoring snapshot must be synthetic_authoring_only");
  }
  const metrics = snapshot.metrics;
  const checks = {
    evidenceCoverage: metrics.evidenceCoverage >= thresholds.minimumEvidenceCoverage,
    humanReviewAcceptanceRate: metrics.humanReviewAcceptanceRate >= thresholds.minimumHumanReviewAcceptanceRate,
    unresolvedQueueRate: metrics.unresolvedQueueRate <= thresholds.maximumUnresolvedQueueRate,
  };
  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  return Object.freeze({
    monitoringVersion: snapshot.version,
    modelVersion: snapshot.modelVersion,
    status: failedChecks.length === 0 ? "WITHIN_SYNTHETIC_THRESHOLDS" : "ROLLBACK_REQUIRED",
    checks,
    failedChecks,
    automaticActions: [],
    requiresHumanReview: true,
  });
}

export function proposeRollback(monitoringResult) {
  const shouldRollback = monitoringResult.status === "ROLLBACK_REQUIRED";
  return Object.freeze({
    status: shouldRollback ? "proposed" : "not_needed",
    automaticActions: [],
    requiresHumanApproval: true,
    steps: shouldRollback
      ? [
        "Pause candidate queue recommendations in a human-approved environment.",
        "Keep any decision output as draft-only and preserve the versioned evaluation evidence.",
        "Investigate the failed synthetic monitoring checks before another review.",
      ]
      : [],
  });
}
