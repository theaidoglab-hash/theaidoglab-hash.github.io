import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  INITIAL_DEMO_WORK_ITEMS,
  RETRY_EXHAUSTION_WORK_ITEM,
  SYNTHETIC_BATCH_FIXTURE,
} from "../data/synthetic-batch-fixtures.mjs";
import {
  blockedExternalActionRequest,
  draftEnrichmentRequest,
} from "../data/request-fixtures.mjs";
import { calculateRetryDelayMs } from "../src/retry-policy.mjs";
import { buildStaticResponsesRequestShape } from "../src/responses-api-fixture.mjs";
import { runLocalBatchWorker } from "../src/run-local-batch-worker.mjs";
import { buildDemoReport } from "../scripts/demo.mjs";

const expectedOutputUrl = new URL("../expected-output.json", import.meta.url);
const staticAdapterUrl = new URL("../src/responses-api-fixture.mjs", import.meta.url);

const demoPolicy = Object.freeze({
  maxItemsPerRun: 2,
  maxQueuedItems: 4,
  maxAttempts: 2,
  maxSyntheticCostUnits: 10,
  jitterWindowMs: 100,
});

test("matches the checked-in two-run local walkthrough", async () => {
  const expected = JSON.parse(await readFile(expectedOutputUrl, "utf8"));
  assert.deepEqual(buildDemoReport(), expected);
});

test("keeps a timeout checkpointed until its recorded eligible time", () => {
  const firstRun = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: INITIAL_DEMO_WORK_ITEMS,
    runId: "test-timeout-initial",
    nowMs: 0,
    policy: demoPolicy,
  });
  const pending = firstRun.checkpoint.pending[0];

  const tooEarly = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    checkpoint: firstRun.checkpoint,
    runId: "test-timeout-too-early",
    nowMs: pending.nextEligibleAt - 1,
    policy: demoPolicy,
  });
  assert.equal(tooEarly.attemptsThisRun, 0);
  assert.equal(tooEarly.summary.pendingCount, 1);

  const resumed = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    checkpoint: firstRun.checkpoint,
    runId: "test-timeout-resume",
    nowMs: pending.nextEligibleAt,
    policy: demoPolicy,
  });
  assert.equal(resumed.attemptsThisRun, 1);
  assert.equal(resumed.events[0].route, "completed");
  assert.equal(resumed.events[0].attempt, 2);
});

test("suppresses a terminal duplicate before another attempt or synthetic cost", () => {
  const firstRun = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: [INITIAL_DEMO_WORK_ITEMS[0]],
    runId: "test-duplicate-initial",
    nowMs: 0,
    policy: demoPolicy,
  });

  const redelivery = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    checkpoint: firstRun.checkpoint,
    incomingWorkItems: [INITIAL_DEMO_WORK_ITEMS[0]],
    runId: "test-duplicate-redelivery",
    nowMs: 0,
    policy: demoPolicy,
  });
  assert.equal(redelivery.events[0].route, "terminal_duplicate_suppressed");
  assert.equal(redelivery.attemptsThisRun, 0);
  assert.equal(redelivery.summary.spentSyntheticCostUnits, firstRun.summary.spentSyntheticCostUnits);
});

test("dead-letters invalid local input before a simulated attempt", () => {
  const invalidWorkItem = {
    ...INITIAL_DEMO_WORK_ITEMS[0],
    rawPayload: "This field must never enter the local worker.",
  };
  const result = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: [invalidWorkItem],
    runId: "test-invalid-input",
    nowMs: 0,
    policy: demoPolicy,
  });

  assert.equal(result.attemptsThisRun, 0);
  assert.equal(result.events[0].route, "dead_letter");
  assert.equal(result.events[0].reasonCode, "RAW_CONTENT_NOT_ALLOWED");
  assert.equal(result.summary.spentSyntheticCostUnits, 0);
});

test("stops before an item would exceed the synthetic budget", () => {
  const result = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: [INITIAL_DEMO_WORK_ITEMS[1]],
    runId: "test-budget-stop",
    nowMs: 0,
    policy: {
      ...demoPolicy,
      maxSyntheticCostUnits: 2,
    },
  });

  assert.equal(result.attemptsThisRun, 0);
  assert.equal(result.events.at(-1).route, "budget_stopped");
  assert.equal(result.summary.pendingCount, 1);
  assert.equal(result.summary.spentSyntheticCostUnits, 0);
});

test("turns retry exhaustion into a terminal dead letter and suppresses a redelivery", () => {
  const exhausted = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: [RETRY_EXHAUSTION_WORK_ITEM],
    runId: "test-retry-exhaustion",
    nowMs: 0,
    policy: {
      ...demoPolicy,
      maxItemsPerRun: 1,
      maxAttempts: 1,
    },
  });
  assert.equal(exhausted.events.at(-1).route, "dead_letter");
  assert.equal(exhausted.events.at(-1).reasonCode, "RETRY_ATTEMPTS_EXHAUSTED");
  assert.equal(exhausted.summary.deadLetterCount, 1);

  const redelivery = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    checkpoint: exhausted.checkpoint,
    incomingWorkItems: [RETRY_EXHAUSTION_WORK_ITEM],
    runId: "test-retry-exhaustion-redelivery",
    nowMs: 1,
    policy: {
      ...demoPolicy,
      maxItemsPerRun: 1,
      maxAttempts: 1,
    },
  });
  assert.equal(redelivery.events[0].route, "terminal_duplicate_suppressed");
  assert.equal(redelivery.attemptsThisRun, 0);
  assert.equal(redelivery.summary.spentSyntheticCostUnits, exhausted.summary.spentSyntheticCostUnits);
});

test("shows queue capacity as a local dead-letter route", () => {
  const result = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: [
      INITIAL_DEMO_WORK_ITEMS[0],
      INITIAL_DEMO_WORK_ITEMS[1],
      RETRY_EXHAUSTION_WORK_ITEM,
    ],
    runId: "test-queue-capacity",
    nowMs: 0,
    policy: {
      ...demoPolicy,
      maxQueuedItems: 2,
    },
  });

  const capacityEvent = result.events.find((event) => event.reasonCode === "QUEUE_CAPACITY_EXCEEDED");
  assert.equal(capacityEvent.route, "dead_letter");
  assert.equal(result.summary.deadLetterCount, 1);
});

test("blocks a non-synthetic fixture before a local run is created", () => {
  const invalidFixture = {
    ...SYNTHETIC_BATCH_FIXTURE,
    provenance: "unverified_external_data",
  };
  const result = runLocalBatchWorker({
    fixture: invalidFixture,
    request: draftEnrichmentRequest,
    incomingWorkItems: INITIAL_DEMO_WORK_ITEMS,
    runId: "test-bad-provenance",
    nowMs: 0,
    policy: demoPolicy,
  });

  assert.equal(result.route, "BLOCKED_INVALID_INPUT");
  assert.deepEqual(result.reasonCodes, ["SYNTHETIC_PROVENANCE_REQUIRED"]);
  assert.equal(result.runCreated, false);
});

test("blocks an external document action request", () => {
  const result = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: blockedExternalActionRequest,
    incomingWorkItems: INITIAL_DEMO_WORK_ITEMS,
    runId: "test-blocked-operation",
    nowMs: 0,
    policy: demoPolicy,
  });

  assert.equal(result.route, "BLOCKED_OUT_OF_SCOPE_OPERATION");
  assert.deepEqual(result.reasonCodes, ["OPERATION_NOT_ALLOWED"]);
  assert.equal(result.actionBoundary.externalActionsPerformed, false);
});

test("uses a deterministic retry delay for a fixed category, attempt, and key", () => {
  const first = calculateRetryDelayMs({
    category: "timeout",
    attempt: 1,
    idempotencyKey: INITIAL_DEMO_WORK_ITEMS[1].idempotencyKey,
    jitterWindowMs: 100,
  });
  const second = calculateRetryDelayMs({
    category: "timeout",
    attempt: 1,
    idempotencyKey: INITIAL_DEMO_WORK_ITEMS[1].idempotencyKey,
    jitterWindowMs: 100,
  });
  assert.deepEqual(first, second);
  assert.equal(first.delayMs, 526);
});

test("keeps the gpt-5-mini shape static and disconnected", async () => {
  const requestShape = buildStaticResponsesRequestShape({
    workItemId: "SYN-BW-101",
    sourceRevision: "v1",
  });
  const source = await readFile(staticAdapterUrl, "utf8");

  assert.equal(requestShape.status, "mock_only_not_executed");
  assert.equal(requestShape.endpoint, "POST /v1/responses");
  assert.equal(requestShape.body.model, "gpt-5-mini");
  assert.equal(requestShape.body.store, false);
  assert.equal(requestShape.body.input.fixtureStatus, "synthetic_fixture_only");
  assert.equal(requestShape.body.input.externalActionRequested, false);
  assert.equal(source.includes("fetch("), false);
  assert.equal(source.includes("process.env"), false);
});
