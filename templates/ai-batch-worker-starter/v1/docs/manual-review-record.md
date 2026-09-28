# Manual review record

Status: blank illustrative record. This file does not document a completed review or an approval.

## Review context

- Review date: [YYYY-MM-DD]
- Reviewer role: [role only]
- Package version: 1.0.0
- Fixture version: ai-batch-worker-synthetic-fixture-v1
- Test command and exact result: [record after running]
- Demo command and exact result: [record after running]
- Change being considered: [one bounded local change]

## Checks

- Did the fixture still declare synthetic_fixture_only? YES | NO
- Did every output remain local and human-review-only? YES | NO
- Did any output request or perform an external action? YES | NO
- Did the duplicate route stop a second attempt and synthetic cost? YES | NO
- Did the retry checkpoint preserve its next eligible time? YES | NO
- Did the budget stop occur before another planned outcome? YES | NO
- Were invalid and exhausted routes visible as dead letters? YES | NO
- Did a trace omit raw document text and external identifiers? YES | NO
- Did expected-output.json still match the demonstration? YES | NO

## Local decision

KEEP AS LOCAL EXERCISE | HOLD FOR REVISION | REVERT LOCAL CHANGE

Reason: [name the checked route or failure case]

Allowed next action: [for example, add one invented failure fixture and repeat local checks]

This record cannot authorise live data, a credential, provider request, spend, deployment, external update, public result claim, or production release.
