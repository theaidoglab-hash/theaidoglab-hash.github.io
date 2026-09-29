import { ALLOWED_OPERATION, STARTER_BOUNDARY, createBlockedResult } from "./contracts.mjs";
import {
  FixtureValidationError,
  validateCheckpoint,
  validateSyntheticFixture,
  validateSyntheticWorkItem,
  validateWorkerPolicy,
} from "./fixture-validation.mjs";
import { calculateRetryDelayMs } from "./retry-policy.mjs";

export const CHECKPOINT_VERSION = "ai-batch-worker-starter-checkpoint-v1";

export const DEFAULT_WORKER_POLICY = Object.freeze({
  maxItemsPerRun: 2,
  maxQueuedItems: 4,
  maxAttempts: 2,
  maxSyntheticCostUnits: 10,
  jitterWindowMs: 100,
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deterministicHash(value) {
  let hash = 0;
  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36).padStart(7, "0");
}

function traceFor({ runId, idempotencyKey, attempt }) {
  const jobTraceId = "corr-" + deterministicHash("job:" + idempotencyKey);
  return Object.freeze({
    runId,
    jobTraceId,
    attemptId: "attempt-" + deterministicHash(runId + ":" + jobTraceId + ":" + attempt),
    attempt,
  });
}

function invalidTraceFor({ runId, inputIndex }) {
  const jobTraceId = "corr-invalid-" + deterministicHash("input:" + (inputIndex + 1));
  return Object.freeze({
    runId,
    jobTraceId,
    attemptId: "attempt-" + deterministicHash(runId + ":" + jobTraceId + ":0"),
    attempt: 0,
  });
}

function createEmptyCheckpoint() {
  return {
    version: CHECKPOINT_VERSION,
    pending: [],
    completed: [],
    deadLetters: [],
    terminalByIdempotencyKey: {},
    spentSyntheticCostUnits: 0,
  };
}

function resolvePolicy(overrides = {}) {
  const policy = { ...DEFAULT_WORKER_POLICY, ...overrides };
  validateWorkerPolicy(policy);
  return Object.freeze(policy);
}

function terminalRecordFor({ route, reasonCode, category, workItem, attempt }) {
  return {
    route,
    reasonCode,
    category: category || null,
    workItemId: workItem.workItemId,
    sourceRevision: workItem.sourceRevision,
    idempotencyKey: workItem.idempotencyKey,
    attempt,
  };
}

function eventFor({ route, reasonCode, category, workItem, trace, nextEligibleAt, priorTerminal }) {
  const event = {
    route,
    workItemId: workItem.workItemId,
    idempotencyKey: workItem.idempotencyKey,
    runId: trace.runId,
    jobTraceId: trace.jobTraceId,
    attemptId: trace.attemptId,
    attempt: trace.attempt,
  };

  if (reasonCode) event.reasonCode = reasonCode;
  if (category) event.category = category;
  if (nextEligibleAt !== undefined) event.nextEligibleAt = nextEligibleAt;
  if (priorTerminal) {
    event.priorTerminalRoute = priorTerminal.route;
    event.priorTerminalReasonCode = priorTerminal.reasonCode;
  }

  return event;
}

function deadLetterInvalidInput({ checkpoint, rawWorkItem, inputIndex, runId, reasonCode, events }) {
  const trace = invalidTraceFor({ runId, inputIndex });
  const workItemId = typeof rawWorkItem?.workItemId === "string"
    ? rawWorkItem.workItemId
    : "INVALID-INPUT-" + (inputIndex + 1);
  const record = {
    route: "dead_letter",
    reasonCode,
    category: "invalid_input",
    workItemId,
    sourceRevision: null,
    idempotencyKey: null,
    attempt: 0,
  };
  checkpoint.deadLetters.push(record);
  events.push({
    route: "dead_letter",
    reasonCode,
    category: "invalid_input",
    workItemId,
    runId: trace.runId,
    jobTraceId: trace.jobTraceId,
    attemptId: trace.attemptId,
    attempt: 0,
  });
}

function queueIncomingWork({ checkpoint, incomingWorkItems, policy, runId, events }) {
  incomingWorkItems.forEach((rawWorkItem, inputIndex) => {
    try {
      validateSyntheticWorkItem(rawWorkItem);
    } catch (error) {
      const reasonCode = error instanceof FixtureValidationError ? error.code : "UNEXPECTED_WORK_ITEM_VALIDATION_ERROR";
      deadLetterInvalidInput({
        checkpoint,
        rawWorkItem,
        inputIndex,
        runId,
        reasonCode,
        events,
      });
      return;
    }

    const workItem = clone(rawWorkItem);
    const terminal = checkpoint.terminalByIdempotencyKey[workItem.idempotencyKey];
    const trace = traceFor({ runId, idempotencyKey: workItem.idempotencyKey, attempt: 0 });

    if (terminal) {
      events.push(eventFor({
        route: "terminal_duplicate_suppressed",
        reasonCode: "TERMINAL_IDEMPOTENCY_KEY_ALREADY_SEEN",
        workItem,
        trace,
        priorTerminal: terminal,
      }));
      return;
    }

    if (checkpoint.pending.some((pendingWork) => pendingWork.idempotencyKey === workItem.idempotencyKey)) {
      events.push(eventFor({
        route: "pending_duplicate_suppressed",
        reasonCode: "PENDING_IDEMPOTENCY_KEY_ALREADY_SEEN",
        workItem,
        trace,
      }));
      return;
    }

    if (checkpoint.pending.length >= policy.maxQueuedItems) {
      const record = terminalRecordFor({
        route: "dead_letter",
        reasonCode: "QUEUE_CAPACITY_EXCEEDED",
        category: "queue_capacity",
        workItem,
        attempt: 0,
      });
      checkpoint.deadLetters.push(record);
      checkpoint.terminalByIdempotencyKey[workItem.idempotencyKey] = record;
      events.push(eventFor({
        route: "dead_letter",
        reasonCode: "QUEUE_CAPACITY_EXCEEDED",
        category: "queue_capacity",
        workItem,
        trace,
      }));
      return;
    }

    checkpoint.pending.push({
      ...workItem,
      attempt: 0,
      nextEligibleAt: 0,
    });
    events.push(eventFor({
      route: "queued",
      reasonCode: "SYNTHETIC_WORK_ITEM_ACCEPTED",
      workItem,
      trace,
      nextEligibleAt: 0,
    }));
  });
}

function nextEligiblePendingIndex(pending, nowMs) {
  return pending.findIndex((workItem) => workItem.nextEligibleAt <= nowMs);
}

function processPendingWork({ checkpoint, policy, nowMs, runId, events }) {
  let attemptsThisRun = 0;

  while (attemptsThisRun < policy.maxItemsPerRun) {
    const pendingIndex = nextEligiblePendingIndex(checkpoint.pending, nowMs);
    if (pendingIndex === -1) break;

    const workItem = checkpoint.pending[pendingIndex];
    const attempt = workItem.attempt + 1;
    const trace = traceFor({ runId, idempotencyKey: workItem.idempotencyKey, attempt });

    if (checkpoint.spentSyntheticCostUnits + workItem.estimatedSyntheticCostUnits > policy.maxSyntheticCostUnits) {
      events.push(eventFor({
        route: "budget_stopped",
        reasonCode: "SYNTHETIC_COST_CAP_WOULD_BE_EXCEEDED",
        workItem,
        trace,
      }));
      break;
    }

    checkpoint.pending.splice(pendingIndex, 1);
    checkpoint.spentSyntheticCostUnits += workItem.estimatedSyntheticCostUnits;
    attemptsThisRun += 1;

    const outcome = workItem.outcomePlan[Math.min(attempt - 1, workItem.outcomePlan.length - 1)];

    if (outcome === "success") {
      const record = terminalRecordFor({
        route: "completed",
        reasonCode: "SYNTHETIC_ENRICHMENT_READY_FOR_HUMAN_REVIEW",
        workItem,
        attempt,
      });
      checkpoint.completed.push(record);
      checkpoint.terminalByIdempotencyKey[workItem.idempotencyKey] = record;
      events.push(eventFor({
        route: "completed",
        reasonCode: "SYNTHETIC_ENRICHMENT_READY_FOR_HUMAN_REVIEW",
        workItem,
        trace,
      }));
      continue;
    }

    const category = outcome;
    if (attempt >= policy.maxAttempts) {
      const record = terminalRecordFor({
        route: "dead_letter",
        reasonCode: "RETRY_ATTEMPTS_EXHAUSTED",
        category,
        workItem,
        attempt,
      });
      checkpoint.deadLetters.push(record);
      checkpoint.terminalByIdempotencyKey[workItem.idempotencyKey] = record;
      events.push(eventFor({
        route: "dead_letter",
        reasonCode: "RETRY_ATTEMPTS_EXHAUSTED",
        category,
        workItem,
        trace,
      }));
      continue;
    }

    const retry = calculateRetryDelayMs({
      category,
      attempt,
      idempotencyKey: workItem.idempotencyKey,
      jitterWindowMs: policy.jitterWindowMs,
    });
    const retriedWorkItem = {
      ...workItem,
      attempt,
      nextEligibleAt: nowMs + retry.delayMs,
    };
    checkpoint.pending.push(retriedWorkItem);
    events.push(eventFor({
      route: "retry_scheduled",
      reasonCode: category,
      category,
      workItem,
      trace,
      nextEligibleAt: retriedWorkItem.nextEligibleAt,
    }));
  }

  return attemptsThisRun;
}

function publicCheckpoint(checkpoint) {
  return {
    version: checkpoint.version,
    pending: checkpoint.pending.map((workItem) => ({
      workItemId: workItem.workItemId,
      sourceRevision: workItem.sourceRevision,
      idempotencyKey: workItem.idempotencyKey,
      estimatedSyntheticCostUnits: workItem.estimatedSyntheticCostUnits,
      reviewScope: workItem.reviewScope,
      outcomePlan: workItem.outcomePlan,
      attempt: workItem.attempt,
      nextEligibleAt: workItem.nextEligibleAt,
    })),
    completed: checkpoint.completed,
    deadLetters: checkpoint.deadLetters,
    terminalByIdempotencyKey: checkpoint.terminalByIdempotencyKey,
    spentSyntheticCostUnits: checkpoint.spentSyntheticCostUnits,
  };
}

function summaryFor(checkpoint, policy) {
  return {
    pendingCount: checkpoint.pending.length,
    completedCount: checkpoint.completed.length,
    deadLetterCount: checkpoint.deadLetters.length,
    spentSyntheticCostUnits: checkpoint.spentSyntheticCostUnits,
    remainingSyntheticCostUnits: policy.maxSyntheticCostUnits - checkpoint.spentSyntheticCostUnits,
  };
}

export function runLocalBatchWorker({
  fixture,
  request,
  incomingWorkItems = [],
  checkpoint,
  nowMs = 0,
  runId = "local-run",
  policy: policyOverrides,
}) {
  if (request?.operation !== ALLOWED_OPERATION) {
    return createBlockedResult({
      route: "BLOCKED_OUT_OF_SCOPE_OPERATION",
      reasonCode: "OPERATION_NOT_ALLOWED",
    });
  }

  try {
    validateSyntheticFixture(fixture);
    if (!Number.isInteger(nowMs) || nowMs < 0) {
      throw new FixtureValidationError("NOW_MS_MUST_BE_NON_NEGATIVE_INTEGER");
    }
    if (typeof runId !== "string" || runId.trim().length === 0) {
      throw new FixtureValidationError("RUN_ID_REQUIRED");
    }
    const policy = resolvePolicy(policyOverrides);
    const workingCheckpoint = checkpoint ? clone(checkpoint) : createEmptyCheckpoint();
    validateCheckpoint(workingCheckpoint);

    const events = [];
    queueIncomingWork({
      checkpoint: workingCheckpoint,
      incomingWorkItems,
      policy,
      runId,
      events,
    });
    const attemptsThisRun = processPendingWork({
      checkpoint: workingCheckpoint,
      policy,
      nowMs,
      runId,
      events,
    });

    return {
      reportVersion: "ai-batch-worker-starter-v1",
      route: "LOCAL_BATCH_RUN_READY",
      fixture: {
        version: fixture.version,
        status: fixture.provenance,
        asOf: fixture.asOf,
        workItemCount: fixture.workItems.length,
      },
      runId,
      attemptsThisRun,
      actionBoundary: STARTER_BOUNDARY,
      events,
      checkpoint: publicCheckpoint(workingCheckpoint),
      summary: summaryFor(workingCheckpoint, policy),
      reviewerNextStep: "A human reviewer may inspect the local records. No external action is permitted.",
    };
  } catch (error) {
    const reasonCode = error instanceof FixtureValidationError ? error.code : "UNEXPECTED_VALIDATION_ERROR";
    return createBlockedResult({
      route: "BLOCKED_INVALID_INPUT",
      reasonCode,
    });
  }
}
