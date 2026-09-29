# Decision contract and receipt

> **Status: local, synthetic teaching artifact.** The contract and receipt are
> executable documentation for a checked-in fixture. They are not a business
> case, a release approval, a measurement report, or permission to connect a
> real system.

## Why this artifact exists

An FAQ draft can look useful while leaving the important delivery decision
undefined. A reviewer needs to know all of the following at the same time:

1. What work outcome is the workflow trying to support?
2. Which result would be harmful enough to stop a change, even if the draft is
   fluent?
3. Which source was eligible at the time of the decision?
4. Who receives a result that cannot safely become a draft?
5. What local evidence can keep a change as a learning reference, and what
   would require returning to manual review?

[`src/decision-contract.mjs`](../src/decision-contract.mjs) makes those
questions visible in one versioned object. Every runtime result includes a
`decisionReceipt`. The receipt contains the contract version, route, reason,
source receipt, citation references, guardrail checks, reviewer next step, and
the deliberately limited release status. It does not contain the raw question,
model output, real data, or a production approval.

## Business outcome is a definition, not an invented result

The fictional future-pilot outcome is **reviewer-approved,
source-supported draft rate within an agreed review window**, compared with a
manual review workflow defined before a pilot starts. The contract labels this
as `not_measured_in_this_fixture`.

For a future authorised observation, the rate would use one de-identified draft
that reached a human reviewer as its unit. The numerator would be eligible
drafts marked approved by that reviewer **and** labelled source-supported. The
denominator would be eligible drafts that reached review in the same agreed
window. Handoffs, blocks, and items outside the agreed eligibility rule must be
reported separately rather than silently removed after a result is known.

That is intentional. A local route pass, a cited draft, or a model-style score
would not establish that reviewers work faster, customers receive better
answers, or an organisation should change its process. Before reporting any
business result, a separately authorised team would need all of these:

| Requirement | Why it must exist before a claim |
| --- | --- |
| Authorised and privacy-reviewed data | A synthetic FAQ fixture cannot stand in for a real workflow. |
| Frozen numerator, denominator, and review-window definitions | Prevents a metric from changing after a favourable result appears. |
| Named measurement and workflow owners | Makes clear who resolves ambiguous labels or process changes. |
| Manual baseline and observation plan | Lets a future comparison answer a business question rather than only a model question. |
| Reviewer labels with reason categories | Separates citation/support failures, wording rewrites, and operational exceptions. |

## Guardrails that can stop a candidate

The contract has five release-blocking guardrails. They matter more than an
average success rate because any one breach changes the authority of the
workflow.

| Guardrail | Local assertion | Candidate must stop when |
| --- | --- | --- |
| `G-01` no external action | `action.kind === "none"` and `action.status === "not_executed"` | A result can send, refund, read an account, create a ticket, or alter a record. |
| `G-02` current approved evidence | A draft includes a current approved synthetic FAQ citation | A source is stale, unapproved, unsupported, or cannot be inspected. |
| `G-03` human decision remains final | Every route requires review; no route grants autonomous approval | A draft can bypass the reviewer or claim to make the final decision. |
| `G-04` trace minimisation | The trace and receipt keep a fingerprint, not the raw question | Raw questions or uncontrolled prompt logs enter the artifact. |
| `G-05` fixture-only boundary | The static provider shape is key-free, unread by runtime, and offline | A credential, network call, real account, or private material is introduced. |

The test suite exercises the guardrails on fixed synthetic cases. That is
useful local evidence, not a safety rate or deployment certification.

## The data receipt

`SYNTHETIC_DATA_RECEIPT` records the source boundary without suggesting that a
hash proves data rights. It contains:

| Field | What it lets a reviewer verify | What it does not prove |
| --- | --- | --- |
| `receiptId` | Which synthetic snapshot the local decision references | Ownership of any future real corpus |
| `recordCount` and `snapshotSha256` | Whether the checked-in fictional source changed | Semantic quality, completeness, or provenance outside this repository |
| `sourceEligibility` | Why only approved, effective entries can support a draft | That a real policy is current or legally usable |
| prohibited-material list | The material that must not be added to this learning package | A complete privacy or security programme |

The hash is calculated only from fictional FAQ identifiers, versions, statuses,
effective dates, and source notes. It does not hash a reader's question and is
not a retention mechanism.

## Acceptance matrix and expected handoff

| Fixed case | Expected route | Receipt evidence | Human next step |
| --- | --- | --- | --- |
| Current supported FAQ | `draft_for_human_approval` | Citation, `actionVerified: true`, current source receipt | Inspect the synthetic citation and approve, reject, or rewrite manually. |
| Unsupported question | `handoff` | No citation; missing-support reason code | Resolve manually; do not fill the gap with a fluent answer. |
| Source after its effective date | `handoff` | No citation; current-source guardrail stays intact | Refresh/validate an authorised source outside this fixture. |
| Instruction override | `handoff` | No retrieval trace | Investigate and use manual review. |
| Deterministic mock failure | `handoff` | No draft and no action | Use manual review; do not bypass the stop with an untested replacement. |
| Requested external action | `blocked` | No retrieval and `actionVerified: true` | Keep the action in the existing manual process. |

Run the contract with the rest of the local evidence:

```powershell
npm test
npm run demo
```

The demo prints the receipt version, synthetic source receipt prefix, and next
human step for each fixture. It makes no network request and writes no record.

## Local release and rollback rule

`LOCAL_REFERENCE_OK` means only that the checked-in tests and demo pass while
the corpus remains fictional and the authority boundary has not expanded. It
does **not** make the system ready for a pilot, deployment, or external use.

Use `HOLD_FOR_HUMAN_REVIEW` when a case changes route, a source is unclear, an
owner is missing, or a proposed change reaches beyond the fixture. Use
`STOP_AND_RETURN_TO_MANUAL_REVIEW` when a guardrail is breached. The local
rollback action is deliberately plain: reject the candidate, restore the last
fixture-validated revision, rerun the fixed cases, and keep the real-world
work in manual review.

There is no service, deployment, queue, database, alert, incident channel, or
automatic rollback in this repository. The contract names the missing work; it
does not implement it.

## What a portfolio reviewer should be able to say

After reading the contract, source code, tests, and demo, a reviewer should be
able to say: “This learner did not confuse a working demo with a business
outcome. They defined an outcome to measure later, chose guardrails that can
veto a candidate, kept a source receipt, made the human handoff explicit, and
stated precisely what local fixtures cannot establish.”

That is the evidence goal. It is not a claim of production capability.
