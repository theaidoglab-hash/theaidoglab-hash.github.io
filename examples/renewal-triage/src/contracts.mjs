export const ACTION_CONTRACT = Object.freeze({
  mode: "decision_support_only",
  allowedActions: [],
  requiresHumanReview: true,
  prohibitedActions: [
    "automatic_outreach",
    "automatic_price_change",
    "automatic_account_change",
    "automatic_renewal_decision",
    "send_external_message",
    "connect_to_real_system",
  ],
});

export function assertDecisionSupportOnly() {
  if (ACTION_CONTRACT.mode !== "decision_support_only") {
    throw new Error("action contract must remain decision_support_only");
  }
  if (ACTION_CONTRACT.allowedActions.length !== 0) {
    throw new Error("action contract must not permit external actions");
  }
  if (!ACTION_CONTRACT.requiresHumanReview) {
    throw new Error("action contract must require human review");
  }
}
