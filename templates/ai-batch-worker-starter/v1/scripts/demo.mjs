import {
  DEMO_DUPLICATE_WORK_ITEM,
  INITIAL_DEMO_WORK_ITEMS,
  SYNTHETIC_BATCH_FIXTURE,
} from "../data/synthetic-batch-fixtures.mjs";
import { draftEnrichmentRequest } from "../data/request-fixtures.mjs";
import { runLocalBatchWorker } from "../src/run-local-batch-worker.mjs";

const demoPolicy = Object.freeze({
  maxItemsPerRun: 2,
  maxQueuedItems: 4,
  maxAttempts: 2,
  maxSyntheticCostUnits: 10,
  jitterWindowMs: 100,
});

function publicRun(run) {
  return {
    runId: run.runId,
    attemptsThisRun: run.attemptsThisRun,
    events: run.events,
    checkpoint: run.checkpoint,
    summary: run.summary,
  };
}

export function buildDemoReport() {
  const firstRun = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    incomingWorkItems: INITIAL_DEMO_WORK_ITEMS,
    runId: "run-demo-initial",
    nowMs: 0,
    policy: demoPolicy,
  });

  const resumeAt = firstRun.checkpoint.pending[0].nextEligibleAt;
  const resumedRun = runLocalBatchWorker({
    fixture: SYNTHETIC_BATCH_FIXTURE,
    request: draftEnrichmentRequest,
    checkpoint: firstRun.checkpoint,
    incomingWorkItems: [DEMO_DUPLICATE_WORK_ITEM],
    runId: "run-demo-resume",
    nowMs: resumeAt,
    policy: demoPolicy,
  });

  return {
    artifactType: "ai_batch_worker_starter_demo",
    version: "1.0.0",
    scope: "synthetic_local_only",
    actionBoundary: "human_review_only_no_external_actions",
    runs: [publicRun(firstRun), publicRun(resumedRun)],
    nonClaims: [
      "No real document, provider request, credential, or cost is represented.",
      "The report shows one deterministic serial fixture walkthrough only.",
    ],
  };
}

const isMain = process.argv[1] && process.argv[1].endsWith("demo.mjs");
if (isMain) {
  process.stdout.write(JSON.stringify(buildDemoReport(), null, 2) + "\n");
}
