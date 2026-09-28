# Decision brief

Status: illustrative local template. It does not represent a real team, document set, owner approval, service, or business decision.

## The fictional question

A fictional review desk receives a small set of already-approved synthetic document references. If a local worker is interrupted or receives the same source revision again, which items can become a review-only enrichment record, which items must wait, and which items must be handed to a person as dead letters?

The exercise is not about making the worker appear autonomous. It is about making the stopped and repeated paths visible before anyone would connect a real source.

## Owner and allowed output

- Human owner role: fictional documentation-review lead.
- Allowed output: a local record marked human review required.
- Allowed decision: a reviewer may inspect why a synthetic item completed, stayed pending, or became a dead letter.
- Not allowed: approval for a real document action, data access, deployment, model request, spend, or business rollout.

## Local action boundary

The program may queue and route invented items in memory. It may return:

- completed, ready for human review;
- retry scheduled with a deterministic local time;
- budget stopped, with the item still pending;
- pending or terminal duplicate suppressed; or
- dead letter for human review.

It may not send a message, update a document system, create a record outside this process, charge an account, select a real action, or use a real provider.

## Why idempotency belongs in the first version

A retry is not the only way an item can repeat. A process can stop after a provider-like outcome, a delivery can be redelivered, or a reader can run the same fixture twice. The idempotency key names one synthetic source revision. Once the local checkpoint records a completed or dead-letter terminal state for that key, another delivery is suppressed before an attempt or synthetic cost is added.

This is a local design demonstration. It does not prove broker semantics, distributed locking, exactly-once delivery, or durable storage.

## Local acceptance conditions

Treat the package as behaving as designed only when all of the following hold:

- the fixture declares synthetic_fixture_only;
- the request operation is draft_human_review_enrichment;
- each accepted work item has a synthetic ID, a source revision, and an idempotency key;
- the queue is bounded and serial;
- a pending retry retains a checkpoint and is not retried before its eligible time;
- a terminal duplicate does not create another attempt or spend another synthetic cost unit;
- a cost stop happens before the next planned outcome is read;
- invalid input and exhausted retry go to a dead-letter record;
- every output keeps the no-external-action and human-review boundary.

Passing these conditions is not approval to use a real document or data source.
