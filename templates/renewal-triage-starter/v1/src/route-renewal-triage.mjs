import { ALLOWED_OPERATION, STARTER_BOUNDARY, createBlockedResult } from "./contracts.mjs";
import { FixtureValidationError, validateCapacity, validateSyntheticRenewalSnapshot } from "./fixture-validation.mjs";
import { buildDraftQueues, calculateOfflineSyntheticQueueUtility } from "./queue.mjs";

export function routeRenewalTriage({ snapshot, request, capacity = 2 }) {
  if (request?.operation !== ALLOWED_OPERATION) {
    return createBlockedResult({
      route: "BLOCKED_OUT_OF_SCOPE_OPERATION",
      reasonCode: "OPERATION_NOT_ALLOWED",
    });
  }

  try {
    validateSyntheticRenewalSnapshot(snapshot);
    validateCapacity(capacity);
  } catch (error) {
    const reasonCode = error instanceof FixtureValidationError ? error.code : "UNEXPECTED_VALIDATION_ERROR";
    return createBlockedResult({
      route: "BLOCKED_INVALID_INPUT",
      reasonCode,
    });
  }

  const queues = buildDraftQueues(snapshot.records, { capacity });
  const rawRiskQueueUtilityUnits = calculateOfflineSyntheticQueueUtility(queues.rawRiskQueue, snapshot.records);
  const businessPriorityQueueUtilityUnits = calculateOfflineSyntheticQueueUtility(queues.businessPriorityQueue, snapshot.records);

  return Object.freeze({
    reportVersion: "renewal-triage-starter-v1",
    route: "REVIEW_QUEUE_DRAFT_READY",
    fixture: Object.freeze({
      version: snapshot.version,
      status: snapshot.provenance,
      asOf: snapshot.asOf,
      recordCount: snapshot.records.length,
    }),
    capacity,
    actionBoundary: STARTER_BOUNDARY,
    rawRiskQueue: Object.freeze({
      strategy: "raw_risk_score_descending",
      selected: queues.rawRiskQueue,
      excludedAccountIds: queues.excludedAccountIds,
    }),
    businessPriorityQueue: Object.freeze({
      strategy: "raw_risk_score_times_synthetic_renewal_value_descending",
      selected: queues.businessPriorityQueue,
      excludedAccountIds: queues.excludedAccountIds,
    }),
    offlineFixtureEvaluation: Object.freeze({
      metric: "synthetic_offline_review_value_units",
      rawRiskQueueUtilityUnits,
      businessPriorityQueueUtilityUnits,
      deltaUtilityUnits: businessPriorityQueueUtilityUnits - rawRiskQueueUtilityUnits,
      scope: "Synthetic offline labels are used only after the queues are built. They are not retention, revenue, intervention-effect, or causal evidence.",
    }),
    reviewerNextStep: "A human reviewer may inspect this draft. No outreach, pricing change, renewal decision, or external update is permitted.",
  });
}
