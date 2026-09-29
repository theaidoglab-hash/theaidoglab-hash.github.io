import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { SYNTHETIC_BATCH_FIXTURES } from "../data/synthetic-batch-fixtures.mjs";
import { buildDemoReport } from "../demo.mjs";
import { ACTION_CONTRACT, DEFAULT_WORKER_POLICY } from "../src/contracts.mjs";
import { createEmptyCheckpoint, runBatchWorker } from "../src/batch-worker.mjs";
import { RESPONSES_API_GPT_5_MINI_ADAPTER } from "../src/responses-api-gpt-5-mini-adapter.mjs";
import { calculateRetryDelayMs } from "../src/retry-policy.mjs";

const standardPolicy = { ...DEFAULT_WORKER_POLICY, maxItemsPerRun: 3, maxCostCents: 12 };

function eventFor(result, route, idempotencyKey) {
  return result.events.find(event => event.route === route && (!idempotencyKey || event.idempotencyKey === idempotencyKey));
}

test("a successful synthetic document becomes one completed, human-review-only enrichment", () => {
  const result = runBatchWorker({ incomingJobs: [SYNTHETIC_BATCH_FIXTURES.success], nowMs: 0, policy: standardPolicy });
  const completed = eventFor(result, "completed", SYNTHETIC_BATCH_FIXTURES.success.idempotencyKey);

  assert.equal(result.status, "QUEUE_DRAINED_OR_WAITING");
  assert.equal(result.summary.completedCount, 1);
  assert.equal(result.summary.spentCents, 2);
  assert.equal(completed.attempt, 1);
  assert.equal(completed.output.resultCode, "synthetic_enrichment_complete");
  assert.deepEqual(completed.action.allowedActions, []);
  assert.equal(completed.action.requiresHumanReview, true);
  assert.equal(completed.runId, result.runId);
  assert.equal(completed.jobTraceId, completed.correlationId);
  assert.match(completed.correlationId, /^corr-/);
  assert.match(completed.attemptId, /^attempt-/);
  assert.equal(
    result.checkpoint.terminalStatesByIdempotencyKey[SYNTHETIC_BATCH_FIXTURES.success.idempotencyKey].route,
    "completed",
  );
  assert.equal(JSON.stringify(result.checkpoint.audit).includes(SYNTHETIC_BATCH_FIXTURES.success.documentText), false);
});

test("a deterministic 429 schedules a retry, then checkpoint/resume completes it", () => {
  const first = runBatchWorker({ incomingJobs: [SYNTHETIC_BATCH_FIXTURES.rateLimited], nowMs: 0, policy: standardPolicy });
  const retry = eventFor(first, "retry_scheduled", SYNTHETIC_BATCH_FIXTURES.rateLimited.idempotencyKey);

  assert.equal(retry.category, "rate_limited");
  assert.equal(retry.reasonCode, "rate_limited");
  assert.equal(first.summary.pendingCount, 1);
  assert.equal(first.checkpoint.attemptsByIdempotencyKey[SYNTHETIC_BATCH_FIXTURES.rateLimited.idempotencyKey], 1);
  assert.equal(retry.runId, first.runId);

  const resumed = runBatchWorker({
    checkpoint: first.checkpoint,
    incomingJobs: [],
    nowMs: retry.nextEligibleAt,
    policy: standardPolicy,
  });
  const completed = eventFor(resumed, "completed", SYNTHETIC_BATCH_FIXTURES.rateLimited.idempotencyKey);

  assert.equal(completed.attempt, 2);
  assert.equal(resumed.summary.completedCount, 1);
  assert.equal(resumed.checkpoint.spentCents, 4);
  assert.notEqual(first.runId, resumed.runId);
  assert.equal(retry.jobTraceId, completed.jobTraceId);
  assert.equal(retry.correlationId, completed.correlationId);
  assert.notEqual(retry.attemptId, completed.attemptId);
});

test("a deterministic timeout uses a distinct retry category and resumes safely", () => {
  const first = runBatchWorker({ incomingJobs: [SYNTHETIC_BATCH_FIXTURES.timeout], nowMs: 0, policy: standardPolicy });
  const retry = eventFor(first, "retry_scheduled", SYNTHETIC_BATCH_FIXTURES.timeout.idempotencyKey);
  const expected = calculateRetryDelayMs({
    category: "timeout",
    attempt: 1,
    idempotencyKey: SYNTHETIC_BATCH_FIXTURES.timeout.idempotencyKey,
    jitterWindowMs: standardPolicy.jitterWindowMs,
  });

  assert.equal(retry.category, "timeout");
  assert.deepEqual(retry.retry, expected);
  assert.equal(retry.nextEligibleAt, expected.delayMs);

  const resumed = runBatchWorker({ checkpoint: first.checkpoint, nowMs: retry.nextEligibleAt, policy: standardPolicy });
  assert.equal(eventFor(resumed, "completed", SYNTHETIC_BATCH_FIXTURES.timeout.idempotencyKey).attempt, 2);
});

test("a duplicate after completion is terminally suppressed without another attempt or cost", () => {
  const initial = runBatchWorker({ incomingJobs: [SYNTHETIC_BATCH_FIXTURES.success], nowMs: 0, policy: standardPolicy });
  const beforeCost = initial.summary.spentCents;
  const duplicate = runBatchWorker({
    checkpoint: initial.checkpoint,
    incomingJobs: [SYNTHETIC_BATCH_FIXTURES.duplicate],
    nowMs: 1,
    policy: standardPolicy,
  });
  const suppressed = eventFor(duplicate, "terminal_duplicate_suppressed", SYNTHETIC_BATCH_FIXTURES.success.idempotencyKey);

  assert.equal(suppressed.reasonCode, "TERMINAL_IDEMPOTENCY_KEY_ALREADY_SEEN");
  assert.equal(suppressed.priorTerminalRoute, "completed");
  assert.equal(duplicate.attemptsThisRun, 0);
  assert.equal(duplicate.summary.spentCents, beforeCost);
  assert.equal(duplicate.summary.completedCount, 1);
});

test("invalid input routes straight to the dead-letter queue without cost or model simulation", () => {
  const result = runBatchWorker({ incomingJobs: [SYNTHETIC_BATCH_FIXTURES.invalidInput], nowMs: 0, policy: standardPolicy });
  const deadLetter = eventFor(result, "dead_letter");

  assert.equal(deadLetter.reasonCode, "INVALID_INPUT");
  assert.equal(result.summary.deadLetterCount, 1);
  assert.equal(result.summary.spentCents, 0);
  assert.equal(result.checkpoint.deadLetters[0].attempts, 0);
  assert.equal(result.checkpoint.deadLetters[0].requiresHumanReview, true);
});

test("queue capacity is bounded and overflow has an inspectable dead-letter route", () => {
  const result = runBatchWorker({
    incomingJobs: [SYNTHETIC_BATCH_FIXTURES.rateLimited, SYNTHETIC_BATCH_FIXTURES.timeout],
    nowMs: 0,
    policy: { ...standardPolicy, maxQueuedJobs: 1, maxItemsPerRun: 1 },
  });

  assert.equal(result.summary.deadLetterCount, 1);
  assert.equal(result.checkpoint.deadLetters[0].reasonCode, "QUEUE_CAPACITY_EXCEEDED");
  assert.equal(result.checkpoint.deadLetters[0].category, "queue_capacity_exceeded");
  assert.equal(result.summary.pendingCount, 1);
});

test("the cost stop leaves an eligible job checkpointed without running a model attempt", () => {
  const result = runBatchWorker({
    checkpoint: createEmptyCheckpoint(),
    incomingJobs: [SYNTHETIC_BATCH_FIXTURES.success],
    nowMs: 0,
    policy: { ...standardPolicy, maxCostCents: 1 },
  });
  const stop = eventFor(result, "cost_stop", SYNTHETIC_BATCH_FIXTURES.success.idempotencyKey);

  assert.equal(result.status, "COST_LIMIT_REACHED");
  assert.equal(result.attemptsThisRun, 0);
  assert.equal(result.summary.spentCents, 0);
  assert.equal(result.summary.pendingCount, 1);
  assert.equal(stop.projectedSpentCents, 2);
});

test("retry jitter is deterministic rather than sampled from runtime randomness", () => {
  const first = calculateRetryDelayMs({
    category: "rate_limited",
    attempt: 2,
    idempotencyKey: "document:SYN-DOC-200:v1",
    jitterWindowMs: 250,
  });
  const second = calculateRetryDelayMs({
    category: "rate_limited",
    attempt: 2,
    idempotencyKey: "document:SYN-DOC-200:v1",
    jitterWindowMs: 250,
  });

  assert.deepEqual(first, second);
  assert.equal(first.exponentialDelayMs, 2_000);
  assert.ok(first.jitterMs >= 0 && first.jitterMs <= 250);
});

test("a retryable fixture that exhausts its bounded attempts enters the dead-letter queue", () => {
  const alwaysRateLimited = {
    ...SYNTHETIC_BATCH_FIXTURES.rateLimited,
    eventId: "EVT-201",
    jobId: "JOB-201",
    documentId: "SYN-DOC-201",
    idempotencyKey: "document:SYN-DOC-201:v1",
    responsePlan: ["rate_limited"],
  };
  const first = runBatchWorker({ incomingJobs: [alwaysRateLimited], nowMs: 0, policy: { ...standardPolicy, maxAttempts: 2 } });
  const retry = eventFor(first, "retry_scheduled", alwaysRateLimited.idempotencyKey);
  const second = runBatchWorker({
    checkpoint: first.checkpoint,
    nowMs: retry.nextEligibleAt,
    policy: { ...standardPolicy, maxAttempts: 2 },
  });
  const deadLetter = eventFor(second, "dead_letter", alwaysRateLimited.idempotencyKey);

  assert.equal(deadLetter.reasonCode, "RETRY_ATTEMPTS_EXHAUSTED");
  assert.equal(deadLetter.category, "rate_limited");
  assert.equal(second.checkpoint.deadLetters[0].attempts, 2);
  assert.equal(second.summary.pendingCount, 0);

  const duplicateAfterDeadLetter = runBatchWorker({
    checkpoint: second.checkpoint,
    incomingJobs: [alwaysRateLimited],
    nowMs: retry.nextEligibleAt + 1,
    policy: { ...standardPolicy, maxAttempts: 2 },
  });
  const suppressed = eventFor(duplicateAfterDeadLetter, "terminal_duplicate_suppressed", alwaysRateLimited.idempotencyKey);

  assert.equal(suppressed.reasonCode, "TERMINAL_IDEMPOTENCY_KEY_ALREADY_SEEN");
  assert.equal(suppressed.priorTerminalRoute, "dead_letter");
  assert.equal(duplicateAfterDeadLetter.attemptsThisRun, 0);
  assert.equal(duplicateAfterDeadLetter.summary.spentCents, second.summary.spentCents);
  assert.equal(duplicateAfterDeadLetter.summary.deadLetterCount, 1);
});

test("the checked-in demo run report stays synchronized with the deterministic walkthrough", () => {
  const savedReport = JSON.parse(
    fs.readFileSync(new URL("../artifacts/run-report.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(savedReport, buildDemoReport());
  assert.equal(savedReport.finalSummary.completedCount, 3);
  assert.equal(savedReport.runs[1].events[0].route, "terminal_duplicate_suppressed");
});

test("the checked-in dead-letter fixture demonstrates terminal idempotency after exhaustion", () => {
  const artifact = JSON.parse(
    fs.readFileSync(new URL("../artifacts/dead-letter-fixture.json", import.meta.url), "utf8"),
  );
  const first = runBatchWorker({
    incomingJobs: [artifact.input],
    nowMs: 0,
    runId: "run-artifact-dead-letter",
    policy: artifact.policy,
  });
  const deadLetter = eventFor(first, "dead_letter", artifact.input.idempotencyKey);

  assert.equal(deadLetter.reasonCode, artifact.expectedTerminal.reasonCode);
  assert.equal(deadLetter.category, artifact.expectedTerminal.category);
  assert.equal(first.checkpoint.deadLetters[0].attempts, artifact.expectedTerminal.attempts);
  assert.equal(first.checkpoint.deadLetters[0].requiresHumanReview, artifact.expectedTerminal.requiresHumanReview);
  assert.equal(first.summary.spentCents, artifact.expectedTerminal.spentCents);

  const redelivery = runBatchWorker({
    checkpoint: first.checkpoint,
    incomingJobs: [artifact.input],
    nowMs: 1,
    runId: "run-artifact-redelivery",
    policy: artifact.policy,
  });
  const suppressed = eventFor(redelivery, "terminal_duplicate_suppressed", artifact.input.idempotencyKey);

  assert.equal(suppressed.reasonCode, artifact.expectedRedelivery.reasonCode);
  assert.equal(redelivery.attemptsThisRun, artifact.expectedRedelivery.additionalAttempts);
  assert.equal(redelivery.summary.spentCents - first.summary.spentCents, artifact.expectedRedelivery.additionalSyntheticCostCents);
});

test("the Responses API shaped adapter stays static, credential-free, and disconnected", () => {
  const source = fs.readFileSync(new URL("../src/responses-api-gpt-5-mini-adapter.mjs", import.meta.url), "utf8");

  assert.equal(RESPONSES_API_GPT_5_MINI_ADAPTER.label, "mock_only_not_executed");
  assert.equal(RESPONSES_API_GPT_5_MINI_ADAPTER.requestShape.model, "gpt-5-mini");
  assert.equal(RESPONSES_API_GPT_5_MINI_ADAPTER.requestShape.store, false);
  assert.equal(RESPONSES_API_GPT_5_MINI_ADAPTER.runtimeBoundary.network, "disabled");
  assert.equal(Object.isFrozen(RESPONSES_API_GPT_5_MINI_ADAPTER), true);
  assert.equal(Object.hasOwn(RESPONSES_API_GPT_5_MINI_ADAPTER, "apiKey"), false);
  assert.equal(source.includes("process.env"), false);
  assert.equal(source.includes("fetch("), false);
  assert.equal(/\bsk-[A-Za-z0-9_-]+/.test(source), false);
});

test("the worker exposes no permitted external actions", () => {
  assert.equal(ACTION_CONTRACT.mode, "local_only");
  assert.deepEqual(ACTION_CONTRACT.allowedActions, []);
  assert.equal(ACTION_CONTRACT.requiresHumanReview, true);
});
