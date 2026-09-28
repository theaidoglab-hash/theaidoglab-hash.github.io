# Failure Cases

Each case is deterministic and is covered by the local test suite or can be checked from the source.

| Case | Trigger | Expected route or behaviour | Why it matters |
| --- | --- | --- | --- |
| Out-of-scope operation | Request `send_customer_message` | `BLOCKED_OUT_OF_SCOPE_OPERATION` | A queue draft cannot silently become outreach. |
| Non-synthetic provenance | Replace `synthetic_fixture_only` | `BLOCKED_INVALID_INPUT` with `SYNTHETIC_PROVENANCE_REQUIRED` | A portfolio fixture cannot be relabelled as live data. |
| Invalid capacity | Pass `0` or a non-integer | `BLOCKED_INVALID_INPUT` with `CAPACITY_MUST_BE_POSITIVE_INTEGER` | Capacity must be explicit before ranking people or accounts. |
| Duplicate account id | Repeat a `SYN-RN-*` id | `BLOCKED_INVALID_INPUT` with `DUPLICATE_ACCOUNT_ID` | A queue should not double-count the same record. |
| Invalid risk signal | Use a value outside `0` to `1` | `BLOCKED_INVALID_INPUT` with `RISK_SIGNAL_OUT_OF_RANGE` | The stated score contract must remain inspectable. |
| Highest risk is ineligible | `SYN-RN-005` has a high signal but `reviewEligible: false` | Excluded from both queues | A numerical rank does not grant decision authority. |
| Risk queue differs from value queue | The fixture uses a low-value, high-risk record | Both queues are shown separately | A difference is evidence to investigate, not a reason to conceal one result. |

## What is intentionally not tested

This package does not test a real predictive model, a live customer record, response quality, privacy compliance, production latency, security controls, fairness, intervention design, or business impact. Those questions require separate authorised work and evidence.
