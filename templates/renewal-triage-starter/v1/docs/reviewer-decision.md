# Reviewer Decision Template

Status: blank illustrative record. It does not document a completed review.

## Review context

- Review date: `[YYYY-MM-DD]`
- Reviewer role: `[role only]`
- Snapshot version: `renewal-triage-synthetic-snapshot-v1`
- Route reviewed: `REVIEW_QUEUE_DRAFT_READY`
- Test command and result: `[record exact local result]`
- Demo command and result: `[record exact local result]`

## Checks

- Did the input still declare `synthetic_fixture_only`? `YES | NO`
- Did the route produce only a draft queue? `YES | NO`
- Was a human review still required? `YES | NO`
- Did any output attempt outreach, a price change, a renewal decision, or an external update? `YES | NO`
- Were raw risk and business-priority queues compared separately? `YES | NO`
- Were the offline utility labels described as fixture-only evaluation material? `YES | NO`

## Decision

`KEEP AS LOCAL EXERCISE | HOLD FOR REVISION | REVERT CHANGE`

Reason: `[tie the decision to a named check or failure case]`

Allowed next action: `[for example: add one synthetic failure case and repeat the local tests]`

Not authorised by this record: using live data, deploying a service, contacting anyone, making a renewal decision, publishing a business-performance claim, or representing the exercise as production work.
