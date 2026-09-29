# Demonstration Map

## Scope and status

This repository is a public portfolio reference for a synthetic, local-only renewal-triage workflow. It contains no production integration, real data, real customer workflow, or deployable decision service. The fixed example is designed to block its candidate at the release gate.

## Business problem and value demonstrated

An account-retention team may have more potentially at-risk renewals than people can review. A generic model metric can make a risk-ranking candidate look better while still sending limited review capacity toward lower-value cases. This reference makes that trade-off inspectable.

The [problem brief](brief.md) records the fictional user, time boundary,
capacity, acceptance rule, and stop conditions before the score is inspected.

| Business question | Observable demonstration | Portfolio value |
| --- | --- | --- |
| How is scarce reviewer capacity represented? | `capacity: 2` limits both queues to two synthetic accounts. | Shows that operational capacity is part of the decision, not an afterthought. |
| Why is a better predictive metric insufficient? | The candidate has average precision `1`, compared with the baseline's `0.8762`, while candidate queue utility is `1`, compared with the baseline's `33`. | Connects a model-selection claim to an explicit decision objective. |
| How does the workflow avoid acting on ineligible accounts? | `SYN-009` has intentionally high synthetic risk and value but is excluded because `isReviewEligible` is false. | Makes eligibility a visible business and control rule. |
| What happens when the candidate underperforms the decision objective? | The hard gate returns `BLOCKED` when candidate utility is below baseline utility. | Demonstrates a no-release outcome rather than forcing a model into use. |

The utility units are hand-authored synthetic values used only to demonstrate the release decision. They are not revenue, retained value, customer lifetime value, or observed intervention benefit.

## Technical things demonstrated

| Technical capability | Implementation evidence | What is verifiable locally |
| --- | --- | --- |
| Versioned synthetic data contract | `data/snapshot-v1.mjs` names a schema, snapshot version, provenance, feature availability, and outcome availability. | The ingest test validates nine `SYN-*` records and the synthetic-only provenance. |
| Schema and time-boundary validation | `src/ingest.mjs` validates required fields, unique synthetic IDs, dates, and labels available after the snapshot. | Invalid snapshot structure or a non-synthetic provenance fails validation. |
| Point-in-time feature control | `src/features.mjs` has an allow-list and rejects outcome fields before building feature rows. | Requesting `outcome.nonRenewalWithin30d` throws `future-label leakage rejected`. |
| Transparent comparator design | `src/models.mjs` implements deterministic risk-only candidate and value-aware baseline rankings. | Scores can be inspected and reproduced without model training or a model API. |
| Deliberate no-LLM decision | This workflow has no language-generation decision, so it includes no Responses API or GPT-5 mini seam. | Adding an LLM merely to name a model would obscure the ranking and queue-utility question being evaluated. |
| Capacity-aware queueing | `src/queue.mjs` ranks eligible records, caps output, and creates only `human_review_only` entries. | The queue has two positions and excludes the ineligible synthetic record. |
| Offline evaluation | `src/metrics.mjs` calculates average precision, precision at capacity, score-band diagnostics, and post-outcome synthetic utility. | Metric and utility calculations are deterministic for the fixed snapshot. |
| Release controls | `src/release-gate.mjs` checks provenance, time boundaries, action contract, capacity, utility comparison, and monitoring. | The candidate is blocked by `candidateQueueUtilityAtLeastBaseline`. |
| Monitoring and rollback | `src/monitoring.mjs` evaluates synthetic thresholds and prepares a human-approved rollback proposal. | The fixed monitoring snapshot returns `ROLLBACK_REQUIRED` and no automatic actions. |
| Continuous validation | `.github/workflows/ci.yml` runs the test suite and demo on Node.js 20. | The same local commands used below run in GitHub Actions. |

## Non-technical business, delivery, and risk things demonstrated

| Area | Control demonstrated | Boundary preserved |
| --- | --- | --- |
| Decision ownership | Queue items are `human_review_only`; every proposed output requires human review. | The software does not decide an individual outcome. |
| Action safety | The action contract has no allowed actions and explicitly prohibits outreach, price changes, account changes, renewal decisions, and real-system connections. | No external state can change through this repository. |
| Release discipline | The gate remains `deployable: false` even if its hard checks were to pass, and requires human approval. | Local test success is not release authorization. |
| Operational recovery | Monitoring produces a rollback proposal with an empty `automaticActions` array. | A concerning signal requires human approval; it does not trigger automated rollback. |
| Data governance | The snapshot requires `synthetic_authoring_only` provenance and `SYN-*` identifiers. | The example prevents real records from being represented as valid fixture data. |
| Honest communication | The candidate is intentionally blocked rather than presented as a successful recommendation. | The portfolio artifact distinguishes technical evidence from a business-impact claim. |

## Complete end-to-end workflow

```text
Versioned synthetic snapshot
        |
        v
Schema and synthetic-provenance validation
        |
        v
Point-in-time feature allow-list and availability checks
        |
        v
Deterministic candidate and baseline rankings
        |
        v
Eligibility filter and fixed-capacity human-review queues
        |
        v
Post-outcome offline ranking and synthetic-utility evaluation
        |
        v
Hard release gate ------------------------------> BLOCKED in the fixed example
        |
        v
Synthetic monitoring and human-approved rollback proposal
```

The arrows describe a local evaluation workflow only. They do not connect to a customer system, create outreach, change a price or account, make a renewal decision, deploy a model, or call an external API.

## Test evidence

Run from the repository root with Node.js 20 or later:

```powershell
npm test
npm run demo
```

The deterministic test command runs ten tests: six workflow checks and four pilot-readiness checks.

1. The versioned synthetic snapshot passes its ingest schema check.
2. Future-label leakage is rejected before feature construction.
3. The capacity queue excludes unavailable-for-review records and remains read-only.
4. A stronger generic predictive metric can still lose on capacity-aware queue utility.
5. The hard release gate blocks the candidate when utility regresses.
6. Synthetic monitoring proposes a human-approved rollback with no automatic action.
7. The default synthetic pilot design remains blocked and cannot take an external action.
8. A complete synthetic design can be pilot-ready without becoming deployable.
9. Missing ownership, comparison, metric, or delayed-outcome definitions block the proposed pilot.
10. A connected or action-enabled design is blocked before it can enter a pilot state.

For the fixed fixtures, `npm test` reports ten passing tests and zero failures. `npm run demo` reports baseline/candidate average precision of `0.8762`/`1`, baseline/candidate synthetic queue utility of `33`/`1`, `BLOCKED` for the release gate, and `ROLLBACK_REQUIRED` with a proposed rollback. These are deterministic fixture results, not operational performance evidence.

GitHub Actions runs both commands on Node.js 20. The workflow does not use repository secrets or application credentials.

For a build sequence that ties the fixture, baseline, queue metric, release
gate, and evidence pack together, read the [portfolio tutorial](portfolio-tutorial.md).
It also explains why a predictive ranking path should not add Promptfoo merely
for the appearance of an LLM evaluation: point-in-time, capacity, and action
boundaries are the relevant executable checks here.

## Explicit nonclaims

This repository does **not** claim any of the following:

- A real model has been trained, calibrated, validated, deployed, or approved for production.
- The scores are probabilities, causal estimates, intervention recommendations, or appropriate for any individual account.
- The synthetic utility units equal revenue, retained value, customer lifetime value, savings, return on investment, or observed intervention effect.
- A better queue would improve retention, customer experience, fairness, or operational efficiency in a real organisation.
- The features are proven available at a real decision time, lawful to use, representative, bias-free, or complete.
- A release gate pass would authorize deployment, contact, price change, account update, or renewal decision.
- Monitoring values are real production metrics or that a rollback has occurred.
- Any external API, model provider, customer system, identity, credential, or real account has been accessed.

Real-world use would need independently authorized data access, privacy and security review, decision-time availability proof, target definition, intervention and causal design, fairness evaluation, human workflow design, monitoring, rollback operations, legal review, and formal release approval.
