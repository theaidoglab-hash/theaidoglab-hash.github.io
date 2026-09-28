export const STARTER_VERSION = "approval-queue-starter-v1";
export const DEFAULT_AS_OF = "2026-09-25";
export const ALLOWED_OPERATION = "prepare_cited_draft";

export const STARTER_BOUNDARY = Object.freeze({
  status: "synthetic_fixture_only",
  output: "cited_draft_for_human_review",
  requiresHumanReview: true,
  externalActionsPerformed: false,
  prohibitedActions: Object.freeze([
    "create_ticket",
    "issue_refund",
    "read_account",
    "send_external_message",
    "update_record",
  ]),
});

export class RequestValidationError extends Error {
  constructor(code) {
    super(code);
    this.name = "RequestValidationError";
    this.code = code;
  }
}

function assertRequest(condition, code) {
  if (!condition) {
    throw new RequestValidationError(code);
  }
}

export function validateRequest(input) {
  assertRequest(input && typeof input === "object" && !Array.isArray(input), "REQUEST_OBJECT_REQUIRED");
  assertRequest(/^SYN-REQ-\d{3}$/.test(input.requestId ?? ""), "SYNTHETIC_REQUEST_ID_REQUIRED");
  assertRequest(typeof input.operation === "string" && input.operation.trim().length > 0, "OPERATION_REQUIRED");
  assertRequest(typeof input.question === "string" && input.question.trim().length > 0, "QUESTION_REQUIRED");
  assertRequest(
    input.requestedAction === undefined || (typeof input.requestedAction === "string" && input.requestedAction.trim().length > 0),
    "REQUESTED_ACTION_INVALID",
  );

  return Object.freeze({
    requestId: input.requestId.trim(),
    operation: input.operation.trim(),
    question: input.question.trim(),
    requestedAction: (input.requestedAction ?? "none").trim().toLowerCase(),
  });
}

export function noAction(reason) {
  return Object.freeze({
    kind: "none",
    status: "not_executed",
    reason,
    requiresHumanReview: true,
  });
}
