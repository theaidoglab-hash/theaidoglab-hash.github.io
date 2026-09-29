export class FixtureValidationError extends Error {
  constructor(code) {
    super(code);
    this.name = "FixtureValidationError";
    this.code = code;
  }
}

function assertCondition(condition, code) {
  if (!condition) {
    throw new FixtureValidationError(code);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function validateSyntheticFixture(fixture) {
  assertCondition(fixture && typeof fixture === "object", "FIXTURE_REQUIRED");
  assertCondition(fixture.provenance === "synthetic_fixture_only", "SYNTHETIC_PROVENANCE_REQUIRED");
  assertCondition(isNonEmptyString(fixture.version), "FIXTURE_VERSION_REQUIRED");
  assertCondition(isNonEmptyString(fixture.asOf), "FIXTURE_AS_OF_REQUIRED");
  assertCondition(Array.isArray(fixture.workItems) && fixture.workItems.length > 0, "WORK_ITEMS_REQUIRED");

  const workItemIds = new Set();
  const idempotencyKeys = new Set();

  fixture.workItems.forEach((item) => {
    validateSyntheticWorkItem(item);
    assertCondition(!workItemIds.has(item.workItemId), "DUPLICATE_WORK_ITEM_ID");
    assertCondition(!idempotencyKeys.has(item.idempotencyKey), "DUPLICATE_IDEMPOTENCY_KEY");
    workItemIds.add(item.workItemId);
    idempotencyKeys.add(item.idempotencyKey);
  });

  return Object.freeze({
    workItemCount: fixture.workItems.length,
    fixtureVersion: fixture.version,
  });
}

export function validateSyntheticWorkItem(item) {
  assertCondition(item && typeof item === "object" && !Array.isArray(item), "WORK_ITEM_OBJECT_REQUIRED");
  assertCondition(/^SYN-BW-\d{3}$/.test(item.workItemId), "SYNTHETIC_WORK_ITEM_ID_REQUIRED");
  assertCondition(/^v\d+$/.test(item.sourceRevision), "SOURCE_REVISION_REQUIRED");
  assertCondition(/^synthetic-document:SYN-BW-\d{3}:v\d+$/.test(item.idempotencyKey), "SYNTHETIC_IDEMPOTENCY_KEY_REQUIRED");
  assertCondition(isPositiveInteger(item.estimatedSyntheticCostUnits), "SYNTHETIC_COST_REQUIRED");
  assertCondition(item.reviewScope === "human_review_only", "HUMAN_REVIEW_SCOPE_REQUIRED");
  assertCondition(Array.isArray(item.outcomePlan) && item.outcomePlan.length > 0, "OUTCOME_PLAN_REQUIRED");
  assertCondition(item.documentText === undefined && item.rawPayload === undefined, "RAW_CONTENT_NOT_ALLOWED");

  item.outcomePlan.forEach((outcome) => {
    assertCondition(["success", "timeout", "rate_limited"].includes(outcome), "UNSUPPORTED_FIXTURE_OUTCOME");
  });
}

export function validateWorkerPolicy(policy) {
  assertCondition(policy && typeof policy === "object", "POLICY_REQUIRED");
  ["maxItemsPerRun", "maxQueuedItems", "maxAttempts", "maxSyntheticCostUnits", "jitterWindowMs"].forEach((field) => {
    assertCondition(Number.isInteger(policy[field]) && policy[field] >= 0, "INVALID_POLICY_" + field.toUpperCase());
  });
  assertCondition(policy.maxItemsPerRun > 0, "MAX_ITEMS_PER_RUN_REQUIRED");
  assertCondition(policy.maxQueuedItems > 0, "MAX_QUEUED_ITEMS_REQUIRED");
  assertCondition(policy.maxAttempts > 0, "MAX_ATTEMPTS_REQUIRED");
  assertCondition(policy.maxSyntheticCostUnits > 0, "MAX_SYNTHETIC_COST_UNITS_REQUIRED");
}

export function validateCheckpoint(checkpoint) {
  assertCondition(checkpoint && typeof checkpoint === "object", "CHECKPOINT_REQUIRED");
  assertCondition(checkpoint.version === "ai-batch-worker-starter-checkpoint-v1", "CHECKPOINT_VERSION_UNSUPPORTED");
  assertCondition(Array.isArray(checkpoint.pending), "CHECKPOINT_PENDING_REQUIRED");
  assertCondition(Array.isArray(checkpoint.completed), "CHECKPOINT_COMPLETED_REQUIRED");
  assertCondition(Array.isArray(checkpoint.deadLetters), "CHECKPOINT_DEAD_LETTERS_REQUIRED");
  assertCondition(checkpoint.terminalByIdempotencyKey && typeof checkpoint.terminalByIdempotencyKey === "object", "CHECKPOINT_TERMINAL_INDEX_REQUIRED");
  assertCondition(Number.isInteger(checkpoint.spentSyntheticCostUnits) && checkpoint.spentSyntheticCostUnits >= 0, "CHECKPOINT_COST_REQUIRED");
}
