# AI Batch Worker Reference

[Traditional Chinese (Hong Kong)](README.zh-HK.md) · [Traditional Chinese (Taiwan)](README.zh-TW.md) · [Simplified Chinese](README.zh-Hans.md)

> **Status: synthetic, local-only portfolio reference.** It is not a deployed worker, an active queue, a live model integration, or evidence of production readiness.

This repository demonstrates a narrow fictional business workflow: enrich a bounded batch of internal documents without processing the same version twice, without retrying permanent bad input forever, and without spending beyond a pre-set synthetic cost limit. The useful outcome is a **human-review-only enrichment record**, not a document update or an autonomous business action.

The reference is intentionally more than a happy-path model demo. A reviewer can trace a fixed success, HTTP 429, timeout, duplicate delivery, invalid input, queue-capacity overflow, checkpoint/resume, dead-letter route, stable job trace, per-run attempt trace, deterministic retry delay, and cost stop.

It is deliberately **serial**: `maxItemsPerRun` caps local simulated attempts in one invocation and `maxQueuedJobs` caps pending items. It does not implement concurrent workers, a requests-per-time-window limiter, provider `Retry-After` handling, or rate-limit enforcement.

## Run locally

Requires Node.js 20 or later. There are no third-party dependencies, credentials, environment variables, network calls, or install step.

```powershell
# From this repository's root
npm test
npm run demo
npm run demo -- --json
```

`npm test` runs fixed synthetic regression checks. `npm run demo` prints a local first-run and resume summary; `npm run demo -- --json` prints the deterministic report captured in [`artifacts/run-report.json`](artifacts/run-report.json). Neither command deploys software, sends a document, creates a queue, calls a model, spends money, or proves a business result.

## What this portfolio example demonstrates

| Concern | Inspectable evidence | Boundary kept visible |
| --- | --- | --- |
| Business decision | The worker either creates a local, human-review-only synthetic enrichment record or keeps the work pending / routes it to a dead-letter queue. | It does not change a document system, contact a person, or claim a real operational improvement. |
| Serial queue and invocation cap | `maxQueuedJobs` rejects overflow with `QUEUE_CAPACITY_EXCEEDED`; `maxItemsPerRun` caps serial fixture attempts in one invocation. | It does not implement concurrency slots, a token bucket, or a provider rate limiter. |
| Idempotency | Each document version has a stable idempotency key; pending duplicates are `duplicate_suppressed`, while completed or dead-lettered records with a non-empty key are `terminal_duplicate_suppressed`. | It does not prove exactly-once delivery in a real broker or database. |
| Transient failure handling | Fixed HTTP 429 and timeout fixtures enter category-specific exponential backoff with deterministic jitter. | A fixture is not evidence of provider behaviour, resilience, or service-level performance. |
| Permanent failure handling | Invalid input and queue overflow go to an inspectable dead-letter queue. | There is no real operational team, ticket system, or remediation channel. |
| Checkpoint / resume | Pending retry work is serialisable in the checkpoint and can be resumed at its recorded eligible time. | It does not prove durable storage, multi-worker locking, or disaster recovery. |
| Cost control | The worker stops before an attempt would exceed `maxCostCents`, leaving the job checkpointed. | Synthetic cents are not API billing, budget approval, or observed cost. |
| Traceability | Each event includes an invocation `runId`, a stable job-level `corr-*` trace, and a distinct `attempt-*` trace without logging document text in audit events. | It is an example of data minimisation, not a complete audit or privacy program. |

The full division between technical evidence, non-technical delivery evidence, test evidence, workflow, and nonclaims is in [the demonstration map](docs/demonstration-map.md). The separate [fixture-only evaluation and pilot measurement map](docs/pilot-measurement-map.md) makes the human owner, local release gate, future measurement design, monitoring signals, and stop boundary inspectable without claiming a pilot exists.

## End-to-end workflow

```text
Synthetic document event
        |
        v
Input contract and idempotency check
        |--- invalid or queue full ---> dead-letter route + human review
        |--- pending duplicate -----> suppress without another attempt or cost
        |--- terminal duplicate ----> suppress unless a reviewed new identity/version exists
        v
Bounded pending queue and checkpoint
        |
        v
Cost stop check before a simulated attempt
        |--- budget exhausted ------> leave job pending for a reviewed resume decision
        v
Local deterministic fixture outcome
        |--- success ---------------> human-review-only enrichment record
        |--- 429 / timeout ---------> categorized retry with bounded backoff + deterministic jitter
        |--- exhausted / permanent --> dead-letter route + human review
        v
Checkpointed state with run, job and attempt traces
```

## Repository map

| Path | Purpose |
| --- | --- |
| [`data/synthetic-batch-fixtures.mjs`](data/synthetic-batch-fixtures.mjs) | Fictional document events, including success, 429, timeout, duplicate, and invalid-input fixtures. |
| [`src/contracts.mjs`](src/contracts.mjs) | Local-only action contract, input validation, and bounded worker policy. |
| [`src/batch-worker.mjs`](src/batch-worker.mjs) | Deterministic queue intake, idempotency, checkpointing, local fixture routing, cost stop, and dead letters. |
| [`src/retry-policy.mjs`](src/retry-policy.mjs) | Retry categories plus deterministic exponential-backoff-and-jitter calculation. |
| [`src/responses-api-gpt-5-mini-adapter.mjs`](src/responses-api-gpt-5-mini-adapter.mjs) | Static, non-executing `gpt-5-mini` Responses API request-shape adapter. |
| [`test/ai-batch-worker.test.mjs`](test/ai-batch-worker.test.mjs) | Fixed regression checks for each failure and recovery path. |
| [`docs/brief.md`](docs/brief.md) | Fictional business decision, user, ownership, and scope. |
| [`docs/acceptance-cases.md`](docs/acceptance-cases.md) | Observable success and failure conditions before implementation. |
| [`docs/retry-policy.md`](docs/retry-policy.md) | Retry categories, deterministic jitter, and stop conditions. |
| [`docs/demonstration-map.md`](docs/demonstration-map.md) | Technical and non-technical portfolio interpretation guide. |
| [`docs/pilot-measurement-map.md`](docs/pilot-measurement-map.md) | Fixture-only evaluation gate, named owner, future pilot measurements, monitoring, and rollback/stop boundary. |
| [`docs/decision-log.md`](docs/decision-log.md) | Design decisions and deliberately deferred enterprise work. |
| [`artifacts/run-report.json`](artifacts/run-report.json) | Checked-in deterministic snapshot of the two-run local walkthrough. |
| [`artifacts/dead-letter-fixture.json`](artifacts/dead-letter-fixture.json) | Reproducible retry-exhaustion fixture and its terminal-idempotency expectation. |

## Static GPT-5 mini Responses API seam: never executed

[`src/responses-api-gpt-5-mini-adapter.mjs`](src/responses-api-gpt-5-mini-adapter.mjs) contains a frozen request shape labelled `mock_only_not_executed`. It makes the potential model boundary discussable while retaining a repeatable baseline.

It is not an integration. It is not imported by the worker. It imports no SDK, reads no environment variable, contains no key or authorization header, calls no network function, and produces no model output. The executable worker instead reads predetermined local fixture outcomes. The shape uses `POST /v1/responses`, `model: "gpt-5-mini"`, `store: false`, `instructions`, and `input` only as a documentation fixture; it does not establish access, compatibility, quality, cost, safety, latency, data retention, or approval for future use.

## How to discuss it in an interview

Do not present this as “I built a production batch system.” Explain the narrower engineering decisions:

1. Start with duplicate safety, a finite retry budget, and a budget stop rather than a generic “AI enrichment” claim.
2. Run a negative path: an invalid event becomes a dead letter, while a 429 remains checkpointed until its calculated retry time.
3. Show the run ID, stable job trace, and distinct attempt trace; then show that document text is absent from audit events and outputs remain human-review-only.
4. Name the work still required for a real service: authorised data, durable storage, concurrency and rate controls, broker semantics, provider error contracts, cost telemetry, monitoring, incident response, privacy/security review, human operations, and release approval.

That distinction makes the repository useful evidence of engineering judgment without pretending that synthetic tests are business-impact evidence.

## Explicit nonclaims

This repository does **not** claim that it:

- uses a real document, customer, company, queue, database, API account, credential, or model response;
- makes a live OpenAI API call or evaluates `gpt-5-mini`;
- has exactly-once delivery, distributed locking, persistent storage, concurrent workers, client-side rate limiting, production retry semantics, or production cost controls;
- improves throughput, accuracy, quality, revenue, cost, security, privacy, or any business outcome;
- is approved for deployment or external use; or
- proves job readiness, a job result, a client result, or a hiring outcome.

## License

This local reference includes an [MIT License](LICENSE). Confirm code ownership, third-party material, employer obligations, data rights, and external-release authority before publishing a fork or a public repository.
