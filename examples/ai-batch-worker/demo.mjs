import path from "node:path";
import { fileURLToPath } from "node:url";

import { INITIAL_DEMONSTRATION_BATCH, SYNTHETIC_BATCH_FIXTURES } from "./data/synthetic-batch-fixtures.mjs";
import { runBatchWorker } from "./src/batch-worker.mjs";

const policy = { maxItemsPerRun: 3, maxQueuedJobs: 5, maxAttempts: 3, maxCostCents: 12, jitterWindowMs: 250 };

function publicEvent(event) {
  const fields = [
    "route",
    "reasonCode",
    "category",
    "idempotencyKey",
    "runId",
    "jobTraceId",
    "correlationId",
    "attemptId",
    "attempt",
    "nextEligibleAt",
    "priorTerminalRoute",
    "priorTerminalReasonCode",
  ];
  return Object.fromEntries(fields
    .filter(field => event[field] !== undefined)
    .map(field => [field, event[field]]));
}

function publicRun(result) {
  return {
    runId: result.runId,
    status: result.status,
    attemptsThisRun: result.attemptsThisRun,
    summary: result.summary,
    events: result.events.map(publicEvent),
  };
}

export function buildDemoReport() {
  const firstRun = runBatchWorker({
    incomingJobs: INITIAL_DEMONSTRATION_BATCH,
    nowMs: 0,
    runId: "run-demo-initial",
    policy,
  });
  const resumeAt = Math.max(...firstRun.checkpoint.pending.map(item => item.nextEligibleAt));
  const resumedRun = runBatchWorker({
    checkpoint: firstRun.checkpoint,
    incomingJobs: [SYNTHETIC_BATCH_FIXTURES.duplicate],
    nowMs: resumeAt,
    runId: "run-demo-resume",
    policy,
  });

  return Object.freeze({
    artifactType: "synthetic_batch_worker_demo_report",
    version: 1,
    scope: "synthetic_local_only",
    actionBoundary: "human_review_only_no_external_actions",
    runs: [publicRun(firstRun), publicRun(resumedRun)],
    finalSummary: resumedRun.summary,
    nonClaims: [
      "No real document, provider request, credential, or cost is represented.",
      "The report demonstrates one deterministic serial reference flow only.",
    ],
  });
}

function printHumanReport(report) {
  const [firstRun, resumedRun] = report.runs;
  console.log("AI batch worker local learning reference - synthetic only, no network, no credentials, no external actions.");
  console.log(`First run (${firstRun.runId}): ${firstRun.attemptsThisRun} attempts; ${firstRun.summary.pendingCount} checkpointed jobs.`);
  console.log(`Resume run (${resumedRun.runId}): ${resumedRun.attemptsThisRun} attempts; ${resumedRun.summary.completedCount} completed jobs.`);
  console.log(`Duplicate handling: ${resumedRun.events.some(event => event.route === "terminal_duplicate_suppressed") ? "terminally suppressed" : "not observed"}.`);
  console.log(`Spent synthetic cost: ${resumedRun.summary.spentCents} cents; remaining budget: ${resumedRun.summary.costRemainingCents} cents.`);
  console.log(`Dead letters: ${resumedRun.summary.deadLetterCount}; pending: ${resumedRun.summary.pendingCount}.`);
  console.log("Passing this demonstration is local evidence only. It does not deploy, send data, call a model, or prove production reliability.");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const report = buildDemoReport();
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else printHumanReport(report);
}
