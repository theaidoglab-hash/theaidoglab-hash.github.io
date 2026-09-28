# Failure cases

Each route below is deterministic and covered by the local test suite. The outcomes are invented teaching fixtures, not evidence about a provider or production queue.

| Case | Trigger | Expected local route | Why it matters |
| --- | --- | --- | --- |
| Out-of-scope request | Ask to update a document system. | BLOCKED_OUT_OF_SCOPE_OPERATION. | A review draft cannot quietly turn into an external action. |
| Non-synthetic fixture | Change fixture provenance. | BLOCKED_INVALID_INPUT with SYNTHETIC_PROVENANCE_REQUIRED. | A local exercise cannot be relabelled as live data. |
| Invalid work item | Omit an idempotency key or add raw content. | Dead letter at zero attempts and zero synthetic cost. | Invalid input should stop before a simulated provider outcome. |
| Pending duplicate | Deliver the same key while it is checkpointed. | Pending duplicate suppressed. | A retry does not create a second queue entry. |
| Terminal duplicate | Deliver a completed or dead-letter key again. | Terminal duplicate suppressed. | A terminal state prevents another attempt and cost. |
| Timeout | First planned outcome is timeout. | Retry scheduled with deterministic delay. | The item is preserved for a later run instead of treated as complete. |
| Rate limited until retry budget is used | Repeated rate_limited outcome. | Dead letter with RETRY_ATTEMPTS_EXHAUSTED. | Retrying forever hides a failed route. |
| Queue capacity | More accepted work arrives than max queued items permits. | Dead letter with QUEUE_CAPACITY_EXCEEDED. | Capacity must be visible before work enters the process. |
| Budget stop | The next attempt would exceed the synthetic cap. | Budget stopped and item remains pending. | A cost guardrail should run before an outcome is consumed. |
| Resume too early | A retry is not yet eligible. | No attempt is made. | A checkpoint is not permission to ignore its retry time. |

## Deliberately outside this package

This starter does not test a real model, API error contract, provider Retry-After header, broker, database, concurrent process, rate limiter, secret handling, access control, retention policy, privacy review, monitoring service, incident process, human workload, business outcome, or deployment. Those need separate authorised evidence.
