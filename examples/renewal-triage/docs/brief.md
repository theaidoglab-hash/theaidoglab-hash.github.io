# Renewal Triage Brief

## Status and scope

**Status:** synthetic, local-only, decision-support reference.

This brief describes a fictional review-queue exercise. It is not a customer
retention system, a production specification, a pilot approval, or a statement
about a real organisation.

## The bounded decision

At the versioned snapshot `asOf` time, a fictional operations reviewer has two
human-review slots. The local workflow may propose the order in which eligible
synthetic records are inspected. It may also defer records beyond capacity or
exclude records that are marked ineligible.

The workflow may not contact a customer, change an account, propose a price,
make a renewal decision, connect to a real system, or turn a score into an
external action. `src/contracts.mjs` makes this explicit: the allowed-action
list is empty and every output requires human review.

## Fictional operating situation

The exercise models a backlog that is larger than a reviewer's available time.
The relevant problem is not “who will renew?” It is whether a candidate ranking
uses scarce review capacity at least as well as a transparent baseline under a
predefined synthetic objective.

The local fixture contains nine hand-authored `SYN-*` records. One high-scoring
record is deliberately marked `isReviewEligible: false`; it must not consume a
review slot. This lets a reviewer inspect eligibility as a control rule rather
than treating a raw score as the final decision.

## Inputs, output, and time boundary

| Element | Local contract |
| --- | --- |
| Input | Versioned `synthetic_authoring_only` snapshot with required observed features and feature availability timestamps. |
| Decision time | `snapshot.asOf`; a feature available after that timestamp is rejected before scoring. |
| Offline-only outcome | `outcome.nonRenewalWithin30d` and `observedReviewUtilityUnits`, which become available only after `asOf` and cannot enter the feature set. |
| Output | A two-slot, `human_review_only` queue with account ID, score, position, and an `action.kind` of `none`. |
| Human owner | A fictional operations reviewer who can inspect, ignore, or reject the local queue. |

The source files are intentionally small: `data/snapshot-v1.mjs` holds the
fixture; `src/ingest.mjs` validates its shape; and `src/features.mjs` enforces
the point-in-time feature allow-list.

## Baseline, candidate, and acceptance rule

The value-aware baseline and risk-only candidate in `src/models.mjs` are both
deterministic. They are not trained models, probabilities, or recommendations.
They exist to make one comparison visible:

1. Score the same permitted feature rows with both versions.
2. Build both queues under the same capacity and eligibility rule.
3. Calculate fixed offline ranking and queue-proxy measures after synthetic
   outcomes become available.
4. Block the candidate if it does not meet every local hard gate.

The supplied candidate has better average precision while its selected queue
has lower synthetic utility than the baseline. `src/release-gate.mjs` therefore
returns `BLOCKED`. A blocked candidate is the intended evidence that the
decision objective is stronger than an attractive aggregate score.

## Evidence and acceptance criteria

The local package is acceptable as a learning reference only when a reviewer
can inspect all of the following:

- synthetic-only provenance, version, schema, and `SYN-*` identifier boundary;
- a failing test for future-label leakage before feature construction;
- an empty automatic-action list and a required human-review state;
- the same capacity and eligibility rule for baseline and candidate;
- a release-gate report that names each blocker rather than a pass/fail
  screenshot; and
- a monitoring result that proposes, but never executes, a human-approved
  rollback.

`npm test` and `npm run demo` reproduce those fixed fixture checks locally.
They do not measure real model quality, operational performance, customer
outcomes, retention, revenue, or production readiness.

## Stop conditions

Stop the exercise before adding a real account, CRM field, billing event,
customer message, personal data, credential, external action, or deployment.
Those changes require a separately authorised design for data rights, privacy,
security, fairness, operations, measurement, incident handling, and release
approval. A local `PASS` could never grant those permissions.
