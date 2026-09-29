import { ACTION_CONTRACT, assertDecisionSupportOnly } from "./contracts.mjs";
import { buildPointInTimeFeatures } from "./features.mjs";
import { assertValidSyntheticSnapshot } from "./ingest.mjs";
import { evaluateQueueUtility, evaluateRanking } from "./metrics.mjs";
import { evaluateSyntheticMonitoring, proposeRollback } from "./monitoring.mjs";
import { scoreRiskOnlyCandidate, scoreValueAwareBaseline } from "./models.mjs";
import { buildCapacityAwareReviewQueue } from "./queue.mjs";
import { evaluateReleaseGate } from "./release-gate.mjs";

export function runSyntheticWorkflow({ snapshot, monitoringSnapshot, capacity = 2 } = {}) {
  assertDecisionSupportOnly();
  const ingest = assertValidSyntheticSnapshot(snapshot);
  const featureRows = buildPointInTimeFeatures(snapshot);
  const candidateRows = scoreRiskOnlyCandidate(featureRows);
  const baselineRows = scoreValueAwareBaseline(featureRows);
  const candidateQueue = buildCapacityAwareReviewQueue(candidateRows, { capacity });
  const baselineQueue = buildCapacityAwareReviewQueue(baselineRows, { capacity });
  const monitoringResult = evaluateSyntheticMonitoring(monitoringSnapshot);

  const report = {
    reportVersion: "renewal-triage-offline-report-v1",
    snapshot: {
      version: snapshot.version,
      provenance: snapshot.provenance,
      asOf: snapshot.asOf,
      recordCount: snapshot.records.length,
    },
    ingest,
    capacity,
    features: {
      featureCount: Object.keys(featureRows[0]).length - 3,
      allRowsPointInTimeSafe: true,
      outcomeFieldsExcluded: true,
    },
    actionContract: ACTION_CONTRACT,
    models: {
      baseline: {
        modelVersion: baselineRows[0].modelVersion,
        ranking: evaluateRanking(baselineRows, snapshot, { capacity }),
        queue: {
          selectedCount: baselineQueue.selected.length,
          selectedAccountIds: baselineQueue.selected.map(({ accountId }) => accountId),
          excludedIneligibleAccountIds: baselineQueue.excludedIneligibleAccountIds,
        },
        queueUtility: evaluateQueueUtility(baselineQueue, snapshot),
      },
      candidate: {
        modelVersion: candidateRows[0].modelVersion,
        ranking: evaluateRanking(candidateRows, snapshot, { capacity }),
        queue: {
          selectedCount: candidateQueue.selected.length,
          selectedAccountIds: candidateQueue.selected.map(({ accountId }) => accountId),
          excludedIneligibleAccountIds: candidateQueue.excludedIneligibleAccountIds,
        },
        queueUtility: evaluateQueueUtility(candidateQueue, snapshot),
      },
    },
    monitoring: {
      result: monitoringResult,
      rollbackPlan: proposeRollback(monitoringResult),
    },
  };

  return Object.freeze({
    report,
    releaseGate: evaluateReleaseGate(report),
  });
}
