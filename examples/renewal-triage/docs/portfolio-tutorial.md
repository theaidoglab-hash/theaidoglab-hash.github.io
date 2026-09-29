# Build a review-queue portfolio project from first decision to evidence pack

## What this tutorial is for

This tutorial shows how to build a small, inspectable predictive-ML portfolio
reference without presenting it as a retention product. The finished reference
answers one bounded question:

> Given a fixed review capacity and fully synthetic records, which cases should
> a human reviewer inspect first, and when must the system abstain?

It does **not** predict a real customer's renewal, contact anyone, change a
price or account, or decide an intervention. That constraint is what makes the
work reproducible, safe to share, and possible to assess honestly.

The existing files in this package are one worked reference. Use the sequence
below to create your own independently authored version. Do not replace a name
or feature column and call that a new business problem: when the decision,
data rights, owner, or permitted action changes, the evaluation and evidence
pack must change too.

## 1. Define a decision before choosing a target variable

Use this reference's [`docs/brief.md`](brief.md) as a format, then write an
independently authored brief with these six fields before writing a model:

| Field | A bounded example |
| --- | --- |
| Human user | A fictional reviewer preparing a limited review queue. |
| Decision | Which synthetic records are worth reviewing first, or should be returned as insufficient evidence. |
| Decision time | A named decision timestamp (`asOf` in this reference) before which every permitted feature must be available. |
| Capacity | The maximum number of records a reviewer can inspect in this exercise. |
| Cost of error | Ranking a record on unavailable evidence, omitting an eligible record, or implying an automated customer action. |
| Non-goals | Outreach, pricing, account changes, renewal decisions, and connection to any real system. |

This is not administrative decoration. The decision time determines which
features are legal to use; capacity determines whether a ranking is useful;
and non-goals determine what the runtime must be unable to do. The reference
keeps these limits in `src/contracts.mjs` as an empty action list plus a
required human review.

### What this step demonstrates

**Technical:** an action contract, a time boundary, and a capacity parameter
that later tests can inspect.

**Business and delivery:** a named decision owner, a reason to stop, and an
explicit statement that a score is not authority to affect a person.

## 2. Build a synthetic, point-in-time data contract

Create a small fixture with a provenance label, a version, a generator or
authoring note, an `asOf` decision timestamp, feature timestamps, and a later outcome
date used only for offline learning. Keep the data deliberately small enough
to read line by line.

For every proposed field, record:

1. when the value becomes available;
2. whether it is permitted for the fictional review decision;
3. whether it identifies a person or organisation and therefore must be
   excluded from a public fixture; and
4. whether it is a future outcome and therefore prohibited from feature input.

The reference uses `data/snapshot-v1.mjs`, `src/ingest.mjs`, and
`src/features.mjs` for this purpose. Its test intentionally tries to add a
future outcome field to the feature list and expects the workflow to reject it.
Copy that pattern, not the fictional business labels.

### Checkpoint

Before any scoring code exists, a test should reject at least one of each:

- missing or malformed required data;
- a feature timestamp after `asOf`;
- a label or outcome field in the feature list;
- an unknown fixture version or provenance; and
- a record that is not eligible for human review.

Passing this checkpoint proves only a local contract. It does not establish
data rights, representativeness, fairness, or a real outcome relationship.

## 3. Start with an explainable baseline

Write a deterministic baseline that uses only permitted fields and gives a
reviewer a reason code. A small rule can be better portfolio evidence than a
complex model because it makes the comparison meaningful.

In this reference, `src/models.mjs` contains a value-aware baseline and a
risk-only candidate. Both are scored through the same feature table and then
sent to the same capacity-aware queue in `src/queue.mjs`. Keep your first
change similarly narrow: one scoring rule, one candidate feature family, or
one threshold policy. Do not change the data generator, feature schema, model,
threshold, and queue policy in the same experiment.

### The question the candidate must answer

The candidate does not earn its place by achieving a prettier aggregate model
metric. It must improve a named, pre-defined property while preserving every
hard boundary. In the supplied fixture, the candidate has stronger average
precision but worse queue utility at the fixed capacity. The release gate
blocks it. That is an intended outcome, not a failed demo.

## 4. Evaluate three layers separately

Use a small evaluation table before looking at the result:

| Layer | Example evidence | What it cannot prove |
| --- | --- | --- |
| Data and safety | schema checks, leakage rejection, provenance check, empty automatic-action list | lawful access, privacy compliance, or real-world fairness |
| Predictive behaviour | fixed holdout ranking metric, error slices, correct abstention | business impact or an intervention effect |
| Queue and workflow proxy | capacity-respecting selections, reason-code coverage, synthetic queue utility, reviewer handoff route | time saved, retention, revenue, adoption, or causal lift |

The test in `test/renewal-triage.test.mjs` makes the distinction visible: the
candidate wins on average precision and loses when only two cases can be
reviewed. A portfolio reviewer can inspect why the candidate queue selected
different records rather than accepting one number as the answer.

### Why this reference does not use Promptfoo

Promptfoo is useful when a prompt or model response needs a fixed input/output
case matrix. This workflow's decision path is deterministic predictive ranking,
not a generative language response. Forcing Promptfoo into it would hide the
more relevant checks: point-in-time availability, capacity-aware ranking,
release blockers, and human decision rights.

If a later, separately approved project adds an LLM explanation layer, keep it
outside the ranking path. Test that layer against a frozen explanation-case
matrix, forbid it from inventing features or recommending actions, and compare
it independently. Do not let a fluent explanation change the queue order.

## 5. Make release and rollback a testable decision

Your local release gate should read a report, not a screenshot. It should
block a candidate if any non-negotiable evidence is absent: invalid synthetic
provenance, a broken time boundary, an enabled automatic action, capacity
overflow, a workflow-proxy regression, or a missing rollback plan.

`src/release-gate.mjs` in this reference returns `deployable: false` even when
all local hard gates pass. This preserves the difference between accepting a
local configuration and authorising a real system. `src/monitoring.mjs` then
uses a synthetic monitoring snapshot only to propose a human-approved
rollback; it performs no automatic action.

For an independently authored project, retain these artefacts:

```text
data/fixture-version.*          synthetic provenance and schema
src/action-contract.*           prohibited and allowed actions
src/release-gate.*              named local blockers
tests/                          fixed normal, invalid, leakage, and regression cases
docs/decision-log.md            one change, comparison, and keep/hold/revert decision
docs/measurement-plan.md        model metric, workflow proxy, and unobserved outcome separately
docs/rollback.md                human owner, stop condition, and rollback target
```

## 6. Package the evidence instead of a claim

An effective README helps a reviewer walk the evidence path in five minutes:

1. State the fictional user, decision, capacity, data boundary, and non-goal.
2. Run the deterministic tests and show one negative or blocked case.
3. Open the data/feature contract and explain why future labels are rejected.
4. Compare baseline and candidate on the same frozen fixture.
5. Open the release-gate output and say what a local pass or block does—and
   does not—mean.

The public claim should stay narrow: “I built a local, synthetic reference
that demonstrates point-in-time data handling, a baseline comparison,
capacity-aware evaluation, and human-owned release/rollback thinking.” Do not
turn that into claims about retention, revenue, reliability, customer benefit,
or production readiness.

## 7. Know when to stop

Stop at the local reference when any next step needs a real account, customer,
employer dataset, intervention, message, price, credential, or external
system. An authorised team would need to separately define data rights,
privacy, retention, security, fairness, operational ownership, measurement,
incident handling, and release approval. None of those permissions comes from
a passing local test.

That stop point is part of the portfolio evidence. It shows that the project
can distinguish a reproducible engineering exercise from an unapproved
production proposal.
