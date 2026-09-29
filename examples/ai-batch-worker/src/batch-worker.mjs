import { ACTION_CONTRACT, resolveWorkerPolicy, validateSyntheticJob } from "./contracts.mjs";
import { calculateRetryDelayMs, classifyFixtureOutcome } from "./retry-policy.mjs";

export const CHECKPOINT_VERSION = "synthetic-document-batch-worker-v2";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deterministicHash(value) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash.toString(36).padStart(7, "0");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function jobTraceIdFor(idempotencyKey) {
  return `corr-${deterministicHash(`job:${idempotencyKey}`)}`;
}

function invalidJobTraceIdFor(rawJob, inputIndex) {
  const safeSeed = rawJob && typeof rawJob === "object" && typeof rawJob.eventId === "string"
    ? rawJob.eventId
    : `input-${inputIndex + 1}`;
  return `corr-invalid-${deterministicHash(safeSeed)}`;
}

function traceFor({ rawJob, inputIndex, runId, attempt }) {
  const idempotencyKey = isNonEmptyString(rawJob?.idempotencyKey) ? rawJob.idempotencyKey : null;
  const jobTraceId = idempotencyKey
    ? jobTraceIdFor(idempotencyKey)
    : invalidJobTraceIdFor(rawJob, inputIndex);

  return Object.freeze({
    runId,
    jobTraceId,
    // Kept as a familiar alias for the stable job-level trace identifier.
    correlationId: jobTraceId,
    attemptId: `attempt-${deterministicHash(`${runId}:${jobTraceId}:${attempt}`)}`,
    attempt,
  });
}

function syntheticFixtureOutcome(job, attempt) {
  const fixtureStep = job.responsePlan[Math.min(attempt - 1, job.responsePlan.length - 1)];
  if (fixtureStep === "success") {
    return Object.freeze({
      kind: "success",
      output: Object.freeze({
        resultCode: "synthetic_enrichment_complete",
        reviewStatus: "human_review_required",
      }),
    });
  }
  if (fixtureStep === "rate_limited") {
    return Object.freeze({ kind: "failure", httpStatus: 429, code: "rate_limited" });
  }
  if (fixtureStep === "timeout") {
    return Object.freeze({ kind: "failure", code: "timeout" });
  }
  return Object.freeze({ kind: "failure", code: "unexpected_fixture_failure" });
}

export function createEmptyCheckpoint() {
  return {
    version: CHECKPOINT_VERSION,
    nextRunSequence: 1,
    pending: [],
    completedIdempotencyKeys: [],
    terminalStatesByIdempotencyKey: {},
    attemptsByIdempotencyKey: {},
    deadLetters: [],
    spentCents: 0,
    audit: [],
  };
}

function assertCheckpoint(checkpoint) {
  if (!checkpoint || checkpoint.version !== CHECKPOINT_VERSION) {
    throw new TypeError("checkpoint version is not supported");
  }
  for (const field of ["pending", "completedIdempotencyKeys", "deadLetters", "audit"]) {
    if (!Array.isArray(checkpoint[field])) throw new TypeError(`checkpoint.${field} must be an array`);
  }
  if (!checkpoint.attemptsByIdempotencyKey || typeof checkpoint.attemptsByIdempotencyKey !== "object") {
    throw new TypeError("checkpoint.attemptsByIdempotencyKey must be an object");
  }
  if (!checkpoint.terminalStatesByIdempotencyKey || typeof checkpoint.terminalStatesByIdempotencyKey !== "object") {
    throw new TypeError("checkpoint.terminalStatesByIdempotencyKey must be an object");
  }
  if (!Number.isInteger(checkpoint.nextRunSequence) || checkpoint.nextRunSequence < 1) {
    throw new TypeError("checkpoint.nextRunSequence must be a positive integer");
  }
  if (!Number.isInteger(checkpoint.spentCents) || checkpoint.spentCents < 0) {
    throw new TypeError("checkpoint.spentCents must be a non-negative integer");
  }
}

function addAudit(state, event) {
  state.audit.push(Object.freeze(event));
}

function addDeadLetter(state, { job, trace, reasonCode, category, errors = [] }) {
  state.deadLetters.push(Object.freeze({
    jobId: typeof job?.jobId === "string" ? job.jobId : "unknown",
    documentId: typeof job?.documentId === "string" ? job.documentId : "unknown",
    idempotencyKey: typeof job?.idempotencyKey === "string" ? job.idempotencyKey : "unavailable",
    ...trace,
    reasonCode,
    category,
    attempts: trace.attempt,
    errors: Object.freeze([...errors]),
    route: "dead_letter",
    requiresHumanReview: true,
  }));
}

function recordTerminalState(state, { job, trace, route, reasonCode, category }) {
  if (!isNonEmptyString(job?.idempotencyKey)) return;
  state.terminalStatesByIdempotencyKey[job.idempotencyKey] = Object.freeze({
    route,
    reasonCode,
    category,
    runId: trace.runId,
    jobTraceId: trace.jobTraceId,
    correlationId: trace.correlationId,
    attemptId: trace.attemptId,
    attempt: trace.attempt,
  });
}

function resolveRunId(state, requestedRunId) {
  if (requestedRunId !== undefined && !isNonEmptyString(requestedRunId)) {
    throw new TypeError("runId must be a non-empty string when provided");
  }
  const runId = requestedRunId ?? `run-local-${state.nextRunSequence}`;
  state.nextRunSequence += 1;
  return runId;
}

function stateSummary(state, policy) {
  return Object.freeze({
    pendingCount: state.pending.length,
    completedCount: state.completedIdempotencyKeys.length,
    deadLetterCount: state.deadLetters.length,
    spentCents: state.spentCents,
    costRemainingCents: policy.maxCostCents - state.spentCents,
  });
}

/**
 * Processes a bounded number of locally simulated attempts. It is deliberately
 * serial, deterministic, and free of external effects so a reviewer can replay
 * a checkpoint and inspect retry, duplicate, dead-letter, and cost decisions.
 */
export function runBatchWorker({ checkpoint = createEmptyCheckpoint(), incomingJobs = [], nowMs = 0, runId: requestedRunId, policy: policyOverrides = {} } = {}) {
  if (!Array.isArray(incomingJobs)) throw new TypeError("incomingJobs must be an array");
  if (!Number.isInteger(nowMs) || nowMs < 0) throw new TypeError("nowMs must be a non-negative integer");

  const policy = resolveWorkerPolicy(policyOverrides);
  const state = clone(checkpoint);
  assertCheckpoint(state);
  const runId = resolveRunId(state, requestedRunId);
  const events = [];

  for (const [inputIndex, rawJob] of incomingJobs.entries()) {
    const suppliedIdempotencyKey = isNonEmptyString(rawJob?.idempotencyKey) ? rawJob.idempotencyKey : null;
    const priorTerminalState = suppliedIdempotencyKey
      ? state.terminalStatesByIdempotencyKey[suppliedIdempotencyKey]
      : null;
    if (priorTerminalState) {
      const trace = traceFor({ rawJob, inputIndex, runId, attempt: 0 });
      const event = Object.freeze({
        route: "terminal_duplicate_suppressed",
        reasonCode: "TERMINAL_IDEMPOTENCY_KEY_ALREADY_SEEN",
        idempotencyKey: suppliedIdempotencyKey,
        ...trace,
        priorTerminalRoute: priorTerminalState.route,
        priorTerminalReasonCode: priorTerminalState.reasonCode,
      });
      addAudit(state, event);
      events.push(event);
      continue;
    }

    const validation = validateSyntheticJob(rawJob);
    const intakeTrace = traceFor({ rawJob, inputIndex, runId, attempt: 0 });

    if (!validation.valid) {
      const event = Object.freeze({
        route: "dead_letter",
        reasonCode: "INVALID_INPUT",
        ...intakeTrace,
        inputIndex,
        errors: validation.errors,
      });
      addDeadLetter(state, {
        job: rawJob,
        trace: intakeTrace,
        reasonCode: "INVALID_INPUT",
        category: "invalid_input",
        errors: validation.errors,
      });
      recordTerminalState(state, {
        job: rawJob,
        trace: intakeTrace,
        route: "dead_letter",
        reasonCode: "INVALID_INPUT",
        category: "invalid_input",
      });
      addAudit(state, event);
      events.push(event);
      continue;
    }

    const duplicate = state.completedIdempotencyKeys.includes(rawJob.idempotencyKey)
      || state.pending.some(item => item.job.idempotencyKey === rawJob.idempotencyKey);
    if (duplicate) {
      const event = Object.freeze({
        route: "duplicate_suppressed",
        reasonCode: "IDEMPOTENCY_KEY_ALREADY_SEEN",
        idempotencyKey: rawJob.idempotencyKey,
        ...intakeTrace,
      });
      addAudit(state, event);
      events.push(event);
      continue;
    }

    if (state.pending.length >= policy.maxQueuedJobs) {
      const event = Object.freeze({
        route: "dead_letter",
        reasonCode: "QUEUE_CAPACITY_EXCEEDED",
        idempotencyKey: rawJob.idempotencyKey,
        ...intakeTrace,
      });
      addDeadLetter(state, {
        job: rawJob,
        trace: intakeTrace,
        reasonCode: "QUEUE_CAPACITY_EXCEEDED",
        category: "queue_capacity_exceeded",
      });
      recordTerminalState(state, {
        job: rawJob,
        trace: intakeTrace,
        route: "dead_letter",
        reasonCode: "QUEUE_CAPACITY_EXCEEDED",
        category: "queue_capacity_exceeded",
      });
      addAudit(state, event);
      events.push(event);
      continue;
    }

    const queued = { job: clone(rawJob), attempt: 0, nextEligibleAt: nowMs };
    state.pending.push(queued);
    const event = Object.freeze({
      route: "queued",
      idempotencyKey: rawJob.idempotencyKey,
      ...intakeTrace,
      nextEligibleAt: nowMs,
    });
    addAudit(state, event);
    events.push(event);
  }

  let attemptsThisRun = 0;
  let stopReason = "QUEUE_DRAINED_OR_WAITING";
  while (attemptsThisRun < policy.maxItemsPerRun) {
    const pendingIndex = state.pending.findIndex(item => item.nextEligibleAt <= nowMs);
    if (pendingIndex === -1) break;

    const pending = state.pending.splice(pendingIndex, 1)[0];
    const nextAttempt = pending.attempt + 1;
    const attemptTrace = traceFor({ rawJob: pending.job, inputIndex: pendingIndex, runId, attempt: nextAttempt });

    if (state.spentCents + pending.job.estimatedCostCents > policy.maxCostCents) {
      state.pending.splice(pendingIndex, 0, pending);
      const event = Object.freeze({
        route: "cost_stop",
        reasonCode: "COST_LIMIT_REACHED",
        idempotencyKey: pending.job.idempotencyKey,
        ...attemptTrace,
        projectedSpentCents: state.spentCents + pending.job.estimatedCostCents,
        maxCostCents: policy.maxCostCents,
      });
      addAudit(state, event);
      events.push(event);
      stopReason = "COST_LIMIT_REACHED";
      break;
    }

    state.spentCents += pending.job.estimatedCostCents;
    state.attemptsByIdempotencyKey[pending.job.idempotencyKey] = nextAttempt;
    attemptsThisRun += 1;
    const outcome = syntheticFixtureOutcome(pending.job, nextAttempt);
    const classification = classifyFixtureOutcome(outcome);

    if (outcome.kind === "success") {
      state.completedIdempotencyKeys.push(pending.job.idempotencyKey);
      const event = Object.freeze({
        route: "completed",
        reasonCode: "SYNTHETIC_ENRICHMENT_COMPLETE",
        idempotencyKey: pending.job.idempotencyKey,
        ...attemptTrace,
        output: outcome.output,
        action: ACTION_CONTRACT,
      });
      recordTerminalState(state, {
        job: pending.job,
        trace: attemptTrace,
        route: "completed",
        reasonCode: "SYNTHETIC_ENRICHMENT_COMPLETE",
        category: "success",
      });
      addAudit(state, event);
      events.push(event);
      continue;
    }

    if (classification.retryable && nextAttempt < policy.maxAttempts) {
      const retry = calculateRetryDelayMs({
        category: classification.category,
        attempt: nextAttempt,
        idempotencyKey: pending.job.idempotencyKey,
        jitterWindowMs: policy.jitterWindowMs,
      });
      const retryAt = nowMs + retry.delayMs;
      state.pending.push({ job: pending.job, attempt: nextAttempt, nextEligibleAt: retryAt });
      const event = Object.freeze({
        route: "retry_scheduled",
        reasonCode: outcome.code,
        category: classification.category,
        idempotencyKey: pending.job.idempotencyKey,
        ...attemptTrace,
        retry,
        nextEligibleAt: retryAt,
      });
      addAudit(state, event);
      events.push(event);
      continue;
    }

    const reasonCode = classification.retryable ? "RETRY_ATTEMPTS_EXHAUSTED" : "NON_RETRYABLE_FAILURE";
    addDeadLetter(state, {
      job: pending.job,
      trace: attemptTrace,
      reasonCode,
      category: classification.category,
    });
    const event = Object.freeze({
      route: "dead_letter",
      reasonCode,
      category: classification.category,
      idempotencyKey: pending.job.idempotencyKey,
      ...attemptTrace,
    });
    recordTerminalState(state, {
      job: pending.job,
      trace: attemptTrace,
      route: "dead_letter",
      reasonCode,
      category: classification.category,
    });
    addAudit(state, event);
    events.push(event);
  }

  return Object.freeze({
    runId,
    status: stopReason,
    policy,
    attemptsThisRun,
    events: Object.freeze(events),
    checkpoint: state,
    summary: stateSummary(state, policy),
  });
}
