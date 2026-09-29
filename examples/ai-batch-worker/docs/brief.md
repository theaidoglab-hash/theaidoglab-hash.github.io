# Brief: synthetic document-enrichment batch worker

## Status and scope

This is a synthetic, local-only portfolio reference. It is designed to make an engineering decision inspectable, not to simulate a complete production platform. No real document, organisation, customer, model, account, queue, credential, or API is used. The worker processes fixture attempts serially; it does not demonstrate concurrency or client-side rate limiting.

## Fictional business problem

A fictional operations team receives document versions in periodic batches and wants a structured enrichment draft for a human reviewer. A simplistic demo would process every item once and display a successful result. That leaves the important operational questions unanswered:

- What prevents a redelivered document version from being enriched and charged twice?
- What happens when a temporary provider limit or timeout occurs?
- When does retry become wasteful or unsafe?
- Where does irrecoverably invalid work go, and who owns it?
- What happens when the batch budget has been spent before a remaining job starts?
- How can an operator explain why a particular item is pending, retried, completed, or rejected without retaining document text in a trace?

## Narrow business decision

For each synthetic document-version event: **should the local worker create a human-review-only enrichment record now, checkpoint it for a bounded retry, suppress a pending or terminal duplicate, or send it to a dead-letter route?**

The answer explicitly excludes document writes, customer contact, publication, billing, and automatic business decisions.

## Users and ownership

| Role | Need in this reference | What remains human-owned |
| --- | --- | --- |
| Operations reviewer | See one local enrichment record or an explicit exception route. | Decide whether any output is useful and resolve dead letters. |
| Workflow owner | Inspect retry, budget, and duplicate decisions. | Set a real policy, approve a release, and own the operating process. |
| Engineer / portfolio reviewer | Reproduce fixed positive and negative cases. | Validate real data contracts, service dependencies, security, and reliability claims. |

## Observable local outcome

Audit events record only synthetic identifiers, a `runId`, stable job trace, attempt ID, route, reason code, attempt count, and local synthetic cost. They exclude document text. The serialisable checkpoint retains pending synthetic inputs only so the local retry example can resume; this is not a retention policy. A success output remains `human_review_required`, while every exception is visible as pending, pending-duplicate-suppressed, terminal-duplicate-suppressed, cost-stopped, or dead-lettered.

## Explicitly deferred work

Real deployment would require authorised data, a durable broker and state store, concurrency and lease controls, client-side rate controls, provider contracts and `Retry-After` handling, real cost telemetry, protected observability, incident handling, access control, privacy/security review, human operating procedures, evaluation, release approval, and ongoing monitoring. Those requirements are intentionally not claimed by this repository.
