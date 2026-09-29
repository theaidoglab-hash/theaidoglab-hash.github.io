# Acceptance cases

The cases below are written before interpreting the worker as a portfolio result. All data is fictional and all outcomes are deterministic. Passing them shows only that the local implementation respects the stated fixtures and contracts.

| Case | Input / setup | Expected route | Evidence to inspect | What the result does not prove |
| --- | --- | --- | --- | --- |
| Success | `SYN-DOC-100 v1` has the fixed `success` outcome. | `completed` at attempt 1. | One completed idempotency key, a run ID, stable `corr-*` job trace, an `attempt-*` ID, synthetic cost of 2 cents, and `human_review_required`. | That a real enrichment is accurate or useful. |
| HTTP 429 | `SYN-DOC-200 v1` returns `rate_limited` then `success`. | `retry_scheduled`, then `completed` after resume. | Category `rate_limited`, a calculated retry time, one stable job trace across two runs, two distinct attempt IDs, and exactly two local attempts. | A real API's throttling semantics or recovery rate. |
| Timeout | `SYN-DOC-300 v1` returns `timeout` then `success`. | `retry_scheduled`, then `completed` after resume. | Category `timeout`, its own delay policy, and a serialisable pending checkpoint. | Network robustness, provider availability, or distributed recovery. |
| Terminal duplicate delivery | A second event carries an idempotency key already completed or dead-lettered. | `terminal_duplicate_suppressed`. | Prior terminal route and reason, no extra attempt, no extra synthetic cost, and no additional terminal record. | Exactly-once guarantees across a real broker, database, and multiple workers. |
| Invalid input | `SYN-DOC-400 v1` has blank document text. | `dead_letter`. | `INVALID_INPUT`, zero attempts, zero synthetic cost, and human review required. | That a real data-quality workflow has been designed. |
| Queue capacity | More unique jobs arrive than `maxQueuedJobs` permits. | Overflow enters `dead_letter`. | `QUEUE_CAPACITY_EXCEEDED`, category `queue_capacity_exceeded`, and the retained pending item. | Queue sizing, load shedding, or business priority policy. |
| Cost stop | Remaining budget is less than the next job's estimated local cost. | `cost_stop`; job remains pending. | No attempt is charged, projected cost and cap are recorded, and the job remains checkpointed. | Billing accuracy, a provider price, or approved budget control. |
| Retry exhaustion | A future fixture keeps producing a retryable result beyond `maxAttempts`. | `dead_letter`. | `RETRY_ATTEMPTS_EXHAUSTED`, category, attempts, and correlation ID. | Correct handling for all real failure types. |

## Minimum acceptance gates in the test suite

1. Every route carries a run ID, stable job trace, and deterministic attempt ID; the job trace remains stable across retries.
2. No action contract permits an external action.
3. The audit trail includes no document text.
4. Retry delays use a category, bounded exponential delay, and deterministic jitter.
5. A pending duplicate and a terminal duplicate never increase synthetic cost; a terminal duplicate never adds another dead letter or completed key.
6. Invalid input, queue overflow, and exhausted retries have an inspectable dead-letter route.
7. A cost stop happens before a local simulated attempt and leaves the job resumable.
8. The checked-in run report and dead-letter fixture remain reproducible from the current deterministic code.
9. The static Responses API shape has no credential, environment access, SDK call, or network invocation.
