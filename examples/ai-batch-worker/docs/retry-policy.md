# Retry policy

## Purpose

Retries are a controlled recovery path for a small set of temporary synthetic failure categories. They are not a blanket response to every failure. The worker has a fixed maximum number of attempts and sends non-retryable or exhausted work to a human-review dead-letter route.

## Categories

| Category | Fixture signal | Retryable? | Base delay | Maximum exponential delay | Terminal route |
| --- | --- | ---: | ---: | ---: | --- |
| `rate_limited` | HTTP `429` with code `rate_limited` | Yes | 1,000 ms | 8,000 ms | Retry until `maxAttempts`, then `RETRY_ATTEMPTS_EXHAUSTED`. |
| `timeout` | Code `timeout` | Yes | 500 ms | 4,000 ms | Retry until `maxAttempts`, then `RETRY_ATTEMPTS_EXHAUSTED`. |
| `invalid_input` | Contract validation failed | No | 0 ms | 0 ms | `INVALID_INPUT` dead letter before any simulated attempt. |
| `unexpected_fixture_failure` | A response plan contains an unknown result | No | 0 ms | 0 ms | `NON_RETRYABLE_FAILURE` dead letter. |

`queue_capacity_exceeded` is a separate intake/dead-letter taxonomy, not `invalid_input`: the document can be valid even when this serial reference has no remaining pending capacity. It is terminal for the supplied idempotency key and needs a human decision or an approved new identity/version before another attempt.

## Delay calculation

For a retryable category and one-based attempt number `n`:

```text
exponentialDelay = min(baseDelay * 2^(n - 1), categoryMaximum)
jitter = deterministicHash(idempotencyKey + category + n) modulo (jitterWindowMs + 1)
delay = exponentialDelay + jitter
```

The default jitter window is 250 ms. The hash is deterministic: the same idempotency key, category, attempt, and policy produce the same delay. That is deliberately different from runtime random jitter. Production workers often need randomness to avoid coordinated retry storms; this portfolio reference instead needs repeatable fixtures, testable checkpoints, and an inspectable interview discussion. A `rate_limited` fixture is a simulated provider response, not a client-side rate limiter.

## Stop conditions

A retryable item does not retry if:

1. its next attempt would exceed `maxAttempts`;
2. the supplied idempotency key was already completed or dead-lettered; or
3. a later run reaches the cost cap before starting the next simulated attempt.

In the fixed implementation, cost stop does not silently discard a job. It leaves the job in the checkpoint and records `COST_LIMIT_REACHED`. A human still needs to decide whether the budget should be changed, the item should be dropped, or the workflow should be investigated.

## Serial boundary and what a real implementation would add

The static policy runs serial fixture attempts. `maxItemsPerRun` and `maxQueuedJobs` are not a concurrency limiter, token bucket, provider quota controller, or throughput claim.

The static policy does not replace provider-specific retry guidance, `Retry-After` handling, durable scheduling, distributed locking, worker leases, circuit breaking, priority policy, client-side concurrency and rate controls, rate-limit telemetry, billing reconciliation, incident response, or business-owner approval. Those are explicit follow-up requirements, not hidden claims in the example.
