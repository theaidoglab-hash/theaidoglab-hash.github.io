export const ACTION_CONTRACT = Object.freeze({
  mode: "local_only",
  allowedActions: Object.freeze([]),
  requiresHumanReview: true,
  prohibitedActions: Object.freeze([
    "send_external_message",
    "update_document_system",
    "create_customer_record",
    "charge_account",
  ]),
});

export const DEFAULT_WORKER_POLICY = Object.freeze({
  maxItemsPerRun: 3,
  maxQueuedJobs: 5,
  maxAttempts: 3,
  maxCostCents: 12,
  jitterWindowMs: 250,
});

const REQUIRED_STRING_FIELDS = [
  "eventId",
  "jobId",
  "documentId",
  "documentVersion",
  "documentText",
  "idempotencyKey",
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSyntheticJob(job) {
  if (!job || typeof job !== "object" || Array.isArray(job)) {
    return Object.freeze({ valid: false, reasonCode: "INVALID_INPUT", errors: ["job must be an object"] });
  }

  const errors = REQUIRED_STRING_FIELDS
    .filter(field => !isNonEmptyString(job[field]))
    .map(field => `${field} must be a non-empty string`);

  if (!Number.isInteger(job.estimatedCostCents) || job.estimatedCostCents <= 0) {
    errors.push("estimatedCostCents must be a positive integer");
  }

  if (!Array.isArray(job.responsePlan) || job.responsePlan.length === 0) {
    errors.push("responsePlan must be a non-empty array");
  }

  return Object.freeze({
    valid: errors.length === 0,
    reasonCode: errors.length === 0 ? "VALID" : "INVALID_INPUT",
    errors: Object.freeze(errors),
  });
}

export function resolveWorkerPolicy(overrides = {}) {
  const policy = { ...DEFAULT_WORKER_POLICY, ...overrides };
  for (const field of ["maxItemsPerRun", "maxQueuedJobs", "maxAttempts", "maxCostCents", "jitterWindowMs"]) {
    if (!Number.isInteger(policy[field]) || policy[field] < 0) {
      throw new TypeError(`${field} must be a non-negative integer`);
    }
  }
  if (policy.maxItemsPerRun === 0 || policy.maxQueuedJobs === 0 || policy.maxAttempts === 0) {
    throw new TypeError("maxItemsPerRun, maxQueuedJobs, and maxAttempts must be greater than zero");
  }
  return Object.freeze(policy);
}
