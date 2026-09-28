# Rollback Record

Status: illustrative record for a reader-owned local change. It is not a production change log.

## Change identifier

`CHANGE-001-business-priority-draft`

## Change under review

Add the business-priority queue alongside the existing raw-risk queue. The business-priority formula is:

```text
rawRiskSignal × syntheticRenewalValueUnits
```

## Frozen comparison material

- Snapshot: `renewal-triage-synthetic-snapshot-v1`
- Request: `SYN-REQUEST-001`
- Capacity: `2`
- Expected output: `expected-output.json`
- Test file: `tests/renewal-triage.test.mjs`

## Recorded local comparison

| Draft queue | Selected records | Offline synthetic queue utility |
| --- | --- | ---: |
| Raw risk | `SYN-RN-001`, `SYN-RN-002` | `16` |
| Business priority | `SYN-RN-002`, `SYN-RN-004` | `26` |

This is a fabricated offline comparison. It is not evidence that a real pricing, retention, or review intervention would produce this difference.

## Rollback condition

Revert `CHANGE-001-business-priority-draft` if any of the following occurs:

- the formula is presented as a real-world business result;
- an output loses the human-review or no-external-action boundary;
- a non-synthetic input can produce a queue;
- a test no longer matches the recorded expected output; or
- an authorised reviewer records `REVERT CHANGE`.

## Rollback target

Remove the business-priority queue from the report and restore the raw-risk-only local demonstration. Record the exact reason and repeat `npm test` before making any further change.
