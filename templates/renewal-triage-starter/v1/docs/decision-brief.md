# Decision Brief

Status: illustrative local template. No real decision, customer, team, or approval is represented.

## The fictional decision

A fictional renewal-operations lead has capacity to inspect two records from a five-record synthetic snapshot. Which **draft review queue** should the lead see first?

The exercise compares:

1. raw risk score, highest first; and
2. raw risk score multiplied by synthetic renewal value, highest first.

The comparison is intentionally narrow. It tests whether a ranking formula fits the queue a limited reviewer can actually inspect.

## Allowed output

The program may return a labelled draft queue and its local fixture comparison. A human reviewer must decide whether to inspect it further.

## Prohibited output and actions

The program may not:

- contact anyone;
- change pricing, a renewal, an account, or an external system;
- state a customer-specific recommendation;
- claim retained revenue, a causal effect, an intervention result, or production performance; or
- use data outside the synthetic fixture.

## Why the raw score is insufficient here

Raw risk answers only one question: which record has the largest risk signal? It does not include the review capacity, the synthetic value at stake, eligibility, or what happened after a review. The business-priority rule includes the first two of those considerations, while the eligibility rule stays separate and mandatory.

## Local acceptance conditions

The starter is behaving as designed only when all of the following are true:

- a fixture declares `synthetic_fixture_only` provenance;
- the operation is exactly `draft_review_queue`;
- capacity is a positive integer;
- an ineligible record is excluded even if its raw risk is higher;
- raw-risk and business-priority queues can be inspected separately;
- the output states that a human review is required and no external actions happened.

Passing these local conditions is not approval to use the design with live data.
