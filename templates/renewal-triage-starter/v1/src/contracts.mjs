export const STARTER_BOUNDARY = Object.freeze({
  status: "synthetic_fixture_only",
  output: "draft_review_queue",
  requiresHumanReview: true,
  externalActionsPerformed: false,
  prohibitedActions: Object.freeze([
    "customer_outreach",
    "pricing_change",
    "renewal_decision",
    "external_system_update",
  ]),
});

export const ALLOWED_OPERATION = "draft_review_queue";

export function createBlockedResult({ route, reasonCode }) {
  return Object.freeze({
    reportVersion: "renewal-triage-starter-v1",
    route,
    reasonCodes: Object.freeze([reasonCode]),
    actionBoundary: STARTER_BOUNDARY,
    queueDrafted: false,
  });
}
