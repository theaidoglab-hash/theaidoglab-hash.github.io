export const SYNTHETIC_BATCH_FIXTURE = Object.freeze({
  version: "ai-batch-worker-synthetic-fixture-v1",
  provenance: "synthetic_fixture_only",
  asOf: "2026-01-20",
  workItems: Object.freeze([
    Object.freeze({
      workItemId: "SYN-BW-101",
      sourceRevision: "v1",
      idempotencyKey: "synthetic-document:SYN-BW-101:v1",
      estimatedSyntheticCostUnits: 2,
      reviewScope: "human_review_only",
      outcomePlan: Object.freeze(["success"]),
    }),
    Object.freeze({
      workItemId: "SYN-BW-102",
      sourceRevision: "v1",
      idempotencyKey: "synthetic-document:SYN-BW-102:v1",
      estimatedSyntheticCostUnits: 3,
      reviewScope: "human_review_only",
      outcomePlan: Object.freeze(["timeout", "success"]),
    }),
  ]),
});

export const INITIAL_DEMO_WORK_ITEMS = Object.freeze([
  SYNTHETIC_BATCH_FIXTURE.workItems[0],
  SYNTHETIC_BATCH_FIXTURE.workItems[1],
]);

export const DEMO_DUPLICATE_WORK_ITEM = SYNTHETIC_BATCH_FIXTURE.workItems[0];

export const RETRY_EXHAUSTION_WORK_ITEM = Object.freeze({
  workItemId: "SYN-BW-401",
  sourceRevision: "v1",
  idempotencyKey: "synthetic-document:SYN-BW-401:v1",
  estimatedSyntheticCostUnits: 2,
  reviewScope: "human_review_only",
  outcomePlan: Object.freeze(["rate_limited"]),
});
