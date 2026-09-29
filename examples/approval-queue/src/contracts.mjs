export const DEFAULT_AS_OF = "2026-09-24";

export const ACTION_CONTRACT = Object.freeze({
  mode: "read_only",
  allowedActions: Object.freeze([]),
  prohibitedActions: Object.freeze([
    "create_ticket",
    "delete_record",
    "issue_refund",
    "read_customer_account",
    "send_external_message",
    "update_order",
  ]),
  requiresHumanReview: true,
});

export function validateRequest(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("input must be an object");
  }

  if (typeof input.question !== "string" || input.question.trim().length === 0) {
    throw new TypeError("question must be a non-empty string");
  }

  if (input.requestedAction !== undefined && typeof input.requestedAction !== "string") {
    throw new TypeError("requestedAction must be a string when supplied");
  }

  return Object.freeze({
    requestId:
      typeof input.requestId === "string" && input.requestId.trim().length > 0
        ? input.requestId.trim()
        : "synthetic-request",
    question: input.question.trim(),
    requestedAction: (input.requestedAction ?? "none").trim().toLowerCase(),
  });
}

export function noAction(reason) {
  return Object.freeze({
    kind: "none",
    mode: ACTION_CONTRACT.mode,
    status: "not_executed",
    reason,
    requiresHumanReview: ACTION_CONTRACT.requiresHumanReview,
  });
}
