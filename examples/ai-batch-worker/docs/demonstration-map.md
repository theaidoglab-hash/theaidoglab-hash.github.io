# AI batch worker demonstration map

## Portfolio purpose and business decision

This repository is a synthetic, local-only learning reference for a document-enrichment batch worker. Its business purpose is deliberately narrow: for one fictional document version, decide whether to create a human-review-only local enrichment record, keep it checkpointed for a bounded retry, suppress a duplicate, or route it to a dead-letter queue.

The problem is not “make an AI summary.” In a batch workflow, a useful engineering conversation begins with duplicate delivery, bad input, temporary failure, finite retry, cost control, and explainable state. This reference makes those choices visible with fixed fixtures rather than inventing a customer KPI or a production claim.

The map separates technical implementation evidence from non-technical business, delivery, and risk evidence so a reviewer can inspect both without treating a green test as a business result.

## What the code makes inspectable

| Technical concern | Inspectable implementation | Why it matters as portfolio evidence |
| --- | --- | --- |
| Synthetic input contract | [`src/contracts.mjs`](../src/contracts.mjs) validates required identifiers, document text, idempotency key, cost, and response plan. | Shows input failure is handled before a model-like attempt. |
| Serial queue and invocation cap | `maxQueuedJobs` limits pending work and `maxItemsPerRun` bounds serial fixture attempts within one invocation. | Demonstrates a capacity decision instead of processing an unbounded array; it is not a concurrency or rate limiter. |
| Terminal idempotency | Pending keys suppress duplicate intake. Completed and dead-lettered records with a non-empty key enter `terminalStatesByIdempotencyKey`, so later delivery is `terminal_duplicate_suppressed` before another attempt or cost. | Shows an explicit decision about redelivery after both success and a terminal exception. |
| Checkpoint / resume | [`src/batch-worker.mjs`](../src/batch-worker.mjs) returns a serialisable checkpoint containing pending work, attempts, terminal states, dead letters, cost, audit events, and a local run sequence. | Makes recovery state inspectable and testable. |
| Failure classification | [`src/retry-policy.mjs`](../src/retry-policy.mjs) distinguishes `rate_limited`, `timeout`, invalid input, and unexpected fixture failure. | Shows that retry is a policy decision, not a catch-all `try/catch`. |
| Backoff and deterministic jitter | The retry policy calculates bounded exponential delay plus a stable hash-derived jitter value. | A reviewer can reproduce retry timing in tests and explain the production trade-off. |
| Dead-letter route | Invalid input, queue overflow, non-retryable failure, and exhausted retry have explicit records. | Shows failures remain observable rather than disappearing from a demo. |
| Cost stop | Projected synthetic cost is checked before a fixture attempt; blocked work stays pending. | Connects model-like execution to an operational guardrail. |
| Run, job, and attempt trace | Each event has a `runId`, stable job-level `corr-*` / `jobTraceId`, and distinct `attempt-*` ID. Audit events exclude document text. | Lets a reviewer separate one invocation, one logical job, and one attempt without pretending to have a full observability platform. |
| Static model seam | [`src/responses-api-gpt-5-mini-adapter.mjs`](../src/responses-api-gpt-5-mini-adapter.mjs) is a frozen, non-executing request-shape object. | Keeps a later model experiment separate from the deterministic local baseline. |
| Regression tests | [`test/ai-batch-worker.test.mjs`](../test/ai-batch-worker.test.mjs) covers success, 429, timeout, pending and terminal duplicates, invalid input, capacity taxonomy, cost stop, retry determinism, trace continuity, checked-in artifacts, adapter boundary, and action contract. | Gives a reviewer executable evidence beyond a screenshot. |

## What the delivery plan makes visible

| Area | Evidence in this repository | What a reviewer should notice |
| --- | --- | --- |
| Scope control | The business decision ends at a human-review-only local record. | The project does not exaggerate an enrichment draft into autonomous document management. |
| Decision ownership | Every success and exception requires human review; permitted actions are empty. | A workflow owner remains accountable for outputs, dead letters, and budget decisions. |
| Acceptance discipline | [`docs/acceptance-cases.md`](acceptance-cases.md) lists negative and recovery paths before interpreting tests as success. | “Works” includes controlled failure and a visible stop condition. |
| Fixture-only release and pilot boundary | [`docs/pilot-measurement-map.md`](pilot-measurement-map.md) names the human owner, local evaluation gate, future measurement categories, monitoring signals, and rollback/stop conditions. | A green fixture run is local evidence only; it cannot authorise a pilot or production release. |
| Cost governance | A cost stop happens before a simulated attempt and leaves the job resumable. | Budget is a pre-execution guardrail, but synthetic cents are not finance evidence. |
| Data minimisation | Fixtures are fictional and audit events exclude document text. | Public portfolio evidence can show decisions without leaking real operational data. |
| Release discipline | README, CI configuration, and explicit nonclaims separate local verification from deployment. | A passing test neither authorises a release nor proves reliability. |
| Ownership and publication boundary | The license and README require a separate ownership, data-rights, employment-obligation, and release-authority check before publishing. | Local code is not permission to disclose employer-related work or launch a service. |

## End-to-end workflow

```text
1. Receive a fictional document-version event.
2. Validate the input contract before a simulated attempt.
3. Suppress a duplicate already pending. Suppress a completed or dead-lettered key as terminal unless a reviewer supplies an approved new identity or source version.
4. Enforce pending-queue capacity; route overflow to dead letter.
5. Save accepted work in the serialisable checkpoint.
6. Before processing, stop if projected synthetic cost would exceed the cap.
7. Consume at most the configured number of local fixture attempts.
8. On success, create a human-review-only local result and mark the key complete.
9. On synthetic 429 or timeout, compute bounded deterministic delay and checkpoint the retry.
10. On invalid, unexpected, or exhausted work, write a dead-letter record for human review.
11. Resume a later invocation from the same checkpoint at the recorded eligible time.
12. Use the run ID, stable job trace, attempt ID, fixed artifacts, and tests to inspect every decision without retaining document text in audit events.
```

This end-to-end sequence is serial and local by design. `maxItemsPerRun` and `maxQueuedJobs` are bounded demonstration controls, not a client-side concurrency limit or requests-per-time-window limiter. It is a teaching reference, not a claim that real distributed batch processing has been solved.

## Test evidence

Run from the repository root:

```powershell
npm test
npm run demo
```

The test suite verifies that:

| Fixed case | Expected local evidence |
| --- | --- |
| Success | One completed synthetic document at attempt 1 with run, job, and attempt trace IDs plus a human-review-only action contract. |
| HTTP 429 | `rate_limited` retry is checkpointed, then completes only after the recorded eligible time. |
| Timeout | A distinct retry category and deterministic delay resume safely. |
| Terminal duplicate | A second delivery after completion or dead letter becomes `terminal_duplicate_suppressed` and does not add an attempt, completed key, dead letter, or synthetic cost. |
| Invalid input | Blank document text goes to dead letter at zero attempts and zero cost. |
| Queue capacity | Overflow has a visible `QUEUE_CAPACITY_EXCEEDED` dead letter. |
| Cost stop | A job remains pending and no fixture attempt runs when the projected cost exceeds the cap. |
| Retry timing | The same category, key, attempt, and policy always produce the same jitter and delay. |
| Static API seam | The request-shaped object is frozen, has `gpt-5-mini` and `store: false`, and contains no environment access, `fetch`, or key-shaped string. |
| Action boundary | The allowed action list remains empty. |
| Checked-in artifacts | The deterministic walkthrough matches [`artifacts/run-report.json`](../artifacts/run-report.json), and [`artifacts/dead-letter-fixture.json`](../artifacts/dead-letter-fixture.json) proves retry-exhaustion terminal suppression. |

The demo is an additional local walkthrough. It completes a success and two retried items across an initial run and a resume run, while terminally suppressing a duplicate. [`artifacts/run-report.json`](../artifacts/run-report.json) is the checked-in `npm run demo -- --json` snapshot. Those are fixture outcomes only.

## Static GPT-5 mini Responses API adapter

The adapter names a possible `POST /v1/responses` request shape with `model: "gpt-5-mini"`, `store: false`, `instructions`, and `input`. It is marked `mock_only_not_executed` and is intentionally absent from the runtime import graph. It does not import an SDK, read a key or environment variable, send a request, call a network function, or return a model response.

The local worker does not depend on an API provider. Its deterministic outcomes come from `responsePlan` arrays in synthetic fixtures. A simulated `rate_limited` outcome is not client-side rate-limit enforcement. A future live experiment would be a separate, approved evidence package with authorised data, a key-handling decision, provider error contracts, concurrency and rate controls, evaluation criteria, data governance, cost controls, human workflow, monitoring, and release approval.

## Explicit nonclaims

This reference does **not** claim:

- a real document, customer, employer, queue, database, API account, credential, or model response;
- a live OpenAI integration, API compatibility, model quality, model cost, latency, retention setting, or provider safety result;
- exactly-once processing, durability, queue ordering, concurrent worker safety, client-side rate limiting, provider resilience, production retry behaviour, or real cost control;
- a real KPI, time saving, accuracy result, revenue, cost saving, business impact, operational approval, or deployment;
- sufficient privacy, security, legal, compliance, incident-response, monitoring, or accessibility work for a production service; or
- any job, customer, funding, publication, or hiring outcome.

## How to present this responsibly

In a portfolio review or interview, start with the business decision and a negative path. For example, show why a terminal duplicate is suppressed before cost is incurred, why a 429 is checkpointed rather than retried immediately, why invalid input is dead-lettered before simulation, and why a cost stop preserves work instead of silently dropping it. Use the run ID, stable job trace, and attempt ID to explain the sequence. Then distinguish that local, deterministic evidence from the authorised data, operational design, concurrency/rate controls, and release work required for a real service.
