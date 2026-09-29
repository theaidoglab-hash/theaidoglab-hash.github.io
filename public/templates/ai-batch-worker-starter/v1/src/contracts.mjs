export const STARTER_BOUNDARY = Object.freeze({
  status: "synthetic_fixture_only",
  output: "local_human_review_enrichment_record",
  requiresHumanReview: true,
  externalActionsPerformed: false,
  prohibitedActions: Object.freeze([
    "send_external_message",
    "update_document_system",
    "create_external_record",
    "charge_account",
  ]),
});

export const ALLOWED_OPERATION = "draft_human_review_enrichment";

export function createBlockedResult({ route, reasonCode }) {
  return Object.freeze({
    reportVersion: "ai-batch-worker-starter-v1",
    route,
    reasonCodes: Object.freeze([reasonCode]),
    actionBoundary: STARTER_BOUNDARY,
    runCreated: false,
  });
}
