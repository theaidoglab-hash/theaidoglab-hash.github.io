# Decision log

## D-001: Use synthetic document fixtures only

**Decision:** Hand-author `SYN-DOC-*` records and response plans.

**Why:** The example can be shared, tested, and discussed without exposing an employer, customer, policy, document, or credential.

**Trade-off:** It cannot establish real data quality, task usefulness, privacy compliance, or business value.

## D-002: Treat enrichment as a human-review-only outcome

**Decision:** The action contract permits no external actions and every completed result remains `human_review_required`.

**Why:** A portfolio project should show where operational authority stops.

**Trade-off:** The workflow does not demonstrate integration, automation benefit, or a complete user experience.

## D-003: Use idempotency keys by document version

**Decision:** The key is explicit in each fixture. Pending duplicates are suppressed, and every completed or dead-lettered key is stored as terminal before a later delivery can spend another synthetic cent.

**Why:** Redelivery is a normal batch-processing failure mode; a success-only demo hides it.

**Trade-off:** A repaired item must have a reviewer-approved new identity or source version. In-memory objects do not prove broker-level exactly-once delivery, durable deduplication, or race-free concurrent workers.

## D-004: Keep retry categories narrow and deterministic

**Decision:** Only 429 rate limits and timeouts retry. Delay is bounded exponential backoff plus deterministic jitter.

**Why:** Tests can reproduce both the retry decision and recorded eligible time without a real clock or random source.

**Trade-off:** A real system would use provider contracts, dynamic backoff, `Retry-After`, randomness, circuit breakers, and operational telemetry.

## D-005: Checkpoint instead of pretending a process never stops

**Decision:** Pending jobs, attempt count, synthetic cost, terminal states, dead letters, a local run sequence, and run/job/attempt traces sit in a serialisable checkpoint returned after every invocation.

**Why:** Resume behavior becomes executable evidence rather than an unexplained claim.

**Trade-off:** The checkpoint is not a durable store and has no locks, leases, encryption, retention, schema migration, or backup strategy.

## D-006: Keep execution explicitly serial

**Decision:** `maxItemsPerRun` bounds local fixture attempts and `maxQueuedJobs` bounds pending items, but the worker has no concurrent worker pool or client-side rate limiter.

**Why:** The package can demonstrate deterministic retry, state, and terminal idempotency without misrepresenting an invocation cap as production traffic control.

**Trade-off:** It cannot establish safe throughput, parallelism, fair scheduling, provider quota compliance, or rate-limit recovery under real load.

## D-007: Stop before the synthetic budget is exceeded

**Decision:** The worker checks projected attempt cost before reading the fixture outcome and leaves the job pending on a cost stop.

**Why:** Cost is an operational guardrail, not a dashboard added after model calls.

**Trade-off:** Synthetic cents are not real model usage, invoice data, financial approval, or a production budget mechanism.

## D-008: Make the GPT-5 mini seam static and disconnected

**Decision:** Add a frozen Responses API-shaped object with no SDK, credential, environment access, or network call; do not import it in the worker runtime.

**Why:** A reader can discuss where a later model experiment belongs without mistaking a request shape for a live integration.

**Trade-off:** The repository makes no statement about API access, compatibility, quality, cost, latency, retention, safety, or suitability of a live model.

## D-009: Check in deterministic evidence artifacts

**Decision:** Keep a JSON snapshot of the two-run local walkthrough and a retry-exhaustion dead-letter fixture under `artifacts/`; regression tests require both to match the current code.

**Why:** A reviewer can inspect a reproducible artefact rather than rely on a screenshot or a terminal transcript.

**Trade-off:** The artifacts describe fixed synthetic outcomes only. They are not monitoring data, billing evidence, or production operational records.
