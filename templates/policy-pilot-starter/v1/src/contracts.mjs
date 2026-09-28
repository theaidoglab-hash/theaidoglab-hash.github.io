export const STARTER_VERSION = "policy-pilot-starter-v1";
export const ALLOWED_OPERATION = "draft_policy_answer";

export const ACTION_BOUNDARY = Object.freeze({
  status: "synthetic_fixture_only",
  output: "cited_policy_draft_or_human_handoff",
  requiresHumanReview: true,
  externalActionsPerformed: false,
  prohibitedActions: Object.freeze([
    "refund",
    "order_change",
    "account_lookup",
    "payment_collection",
    "external_message",
    "case_creation",
  ]),
});

export function createBlockedResult({ route, reasonCode }) {
  return Object.freeze({
    reportVersion: STARTER_VERSION,
    route,
    reasonCode,
    actionBoundary: ACTION_BOUNDARY,
    draftCreated: false,
  });
}
