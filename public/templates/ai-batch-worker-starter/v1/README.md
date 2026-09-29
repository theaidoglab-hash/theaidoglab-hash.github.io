# AI Batch Worker Starter

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

Status: reader-owned local exercise. This package contains invented work items only. It is a portfolio starter, not a deployed worker, queue, model integration, or document system.

The question behind this small project is deliberately narrow: when a bounded batch is interrupted, redelivered, rate limited, or stopped by a spending guardrail, can a reviewer see what happened to every synthetic work item without the worker taking a real action?

The only allowed outcome is a local enrichment record for human review. The worker does not update a document, contact a person, charge an account, write to an external system, or call a model.

## Run it locally

Requires Node.js 20 or later. There are no third-party dependencies, environment variables, API key or other credential, network calls, model calls, or install step.

Unzip the download. In the extracted folder that contains this `README.md` and `package.json`, open a terminal and run:

```powershell
npm test
npm run demo
```

The test suite checks the recorded two-run walkthrough, a retry and resume, terminal duplicate suppression, an invalid work item, a budget stop, retry exhaustion, bad fixture provenance, an out-of-scope request, and the static future-model seam.

The demo prints the same deterministic report kept in expected-output.json. A local pass proves only that this invented exercise repeats as stated.

## What the fixed exercise demonstrates

| Situation | Local behaviour | What the reader can inspect |
| --- | --- | --- |
| First delivery | A valid synthetic item is queued and either completes or is checkpointed. | Run ID, job trace, attempt trace, and terminal route. |
| Timeout | The item becomes pending until its calculated retry time. | Retry category, deterministic backoff, and checkpoint. |
| Resume | A later local invocation takes only eligible pending work. | The same idempotency key and a new attempt trace. |
| Redelivery after completion | The item is suppressed before another attempt or synthetic cost. | Terminal duplicate route and prior terminal state. |
| Invalid work item | The item goes to a local dead-letter record before any attempt. | Reason code, zero attempt count, and human-review boundary. |
| Budget stop | A pending item is left untouched before it would exceed the synthetic cap. | Budget-stop route, unchanged attempt count, and checkpoint. |
| Exhausted retry | A retryable failure becomes a dead letter after the fixed maximum. | Attempt count, terminal record, and redelivery suppression. |

## Package map

| Path | Purpose |
| --- | --- |
| data/ | Invented work-item and request fixtures. |
| src/ | Validation, idempotency, checkpoint, retry, and local routing code. |
| tests/ | Node built-in test suite for success and failure routes. |
| scripts/ | Repeatable two-run local walkthrough. |
| docs/ | Decision, failure, metric, review, rollback, adaptation, and future-model notes. |
| expected-output.json | Checked-in deterministic report from the local walkthrough. |
| CONTENTS.md | Concise list of every file in this starter. |

## What to show in a portfolio review

- Start with a duplicate or a timeout rather than a happy-path answer.
- Show that the idempotency key is tied to one synthetic source revision.
- Explain why a checkpoint is a record for a later local invocation, not proof of a durable production store.
- Show the cost stop before any simulated provider outcome is read.
- Point to a failure case, a manual-review record, and a rollback condition.
- Keep the static gpt-5-mini request shape separate from the runnable worker. It documents one possible future experiment; it does not call an API.

## Read before changing the code

- docs/decision-brief.md
- docs/failure-cases.md
- docs/metric-map.md
- docs/manual-review-record.md
- docs/rollback-record.md
- docs/adaptation-worksheet.md
- docs/future-model-seam.md

## Scope boundary and nonclaims

- Every work item, identifier, outcome, cost unit, timestamp, and trace in this package is fictional.
- The worker produces only a local record that requires human review.
- The worker has no credential, SDK, model request, network call, persistent queue, database, concurrent worker, external action, or real spending.
- Fixed synthetic outcomes are not evidence of provider behaviour, delivery semantics, exactly-once processing, privacy approval, security, real cost control, model quality, performance, business value, or production readiness.
- Do not replace the fixture with real data until an authorised owner has separately established data permission, security and privacy review, retention rules, a durable-storage design, retry and provider contracts, an evaluation plan, monitoring, incident ownership, and a release decision.
