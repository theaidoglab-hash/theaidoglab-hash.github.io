# Rollback record

Status: illustrative local record. There is no deployed environment in this package. A rollback means returning the local source and expected output to a previously checked fixture state.

## Change identifier

CHANGE-001-checkpointed-timeout

## Change under review

Add a checkpointed timeout route beside a success-only local walkthrough. The first timeout remains pending until a calculated eligible time. A later invocation can resume it using the same idempotency key.

## Frozen comparison material

- Package version: 1.0.0
- Fixture: ai-batch-worker-synthetic-fixture-v1
- Request: SYN-BW-REQUEST-001
- Initial run ID: run-demo-initial
- Resume run ID: run-demo-resume
- Expected report: expected-output.json
- Test file: tests/ai-batch-worker.test.mjs

## Expected local observation

| Run | Item | Expected route | Expected interpretation |
| --- | --- | --- | --- |
| Initial run | SYN-BW-102 | Retry scheduled after timeout. | The item is checkpointed, not complete. |
| Resume run | SYN-BW-102 | Completed for human review. | The second fixed outcome is read only after the eligible time. |
| Resume run | SYN-BW-101 redelivery | Terminal duplicate suppressed. | No second attempt or synthetic cost is added. |

This is a fabricated comparison. It does not prove recovery in a provider, broker, database, document system, or real operation.

## Rollback condition

Revert this local change if any of the following occurs:

- a pending retry can be attempted before its eligible time;
- a terminal duplicate can consume an attempt or synthetic cost;
- a non-synthetic fixture can produce a runnable report;
- a budget stop reads another planned outcome;
- an output loses the human-review or no-external-action boundary;
- a fixed test no longer matches the declared expected report; or
- a reviewer records REVERT LOCAL CHANGE.

## Rollback target

Restore the success-only deterministic checkpoint behaviour from the last locally reviewed version, update or restore expected-output.json accordingly, and rerun npm test and npm run demo before making another change. Record the reason without adding real documents, credentials, or operational data.
