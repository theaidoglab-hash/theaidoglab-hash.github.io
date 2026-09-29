# From Offline Evidence to an Authorised Pilot: Measurement Plan

**Status: local portfolio learning reference.** This plan is intentionally
limited to a synthetic, disconnected design. It does not authorise data access,
deployment, outreach, account changes, pricing, renewal decisions, or a claim
about retention, revenue, productivity, or causal impact.

## The problem this plan solves

An offline model comparison can show that one candidate behaves differently
from a baseline on fixed cases. It cannot, by itself, show that a team changed a
real business outcome. This plan teaches the missing bridge: specify what an
authorised pilot would need to measure before anyone sees a convenient result.

The recurring fictional case remains Renewal Triage. A human reviewer may use
a draft-only queue to decide which *synthetic* packet to inspect first. The
system never contacts an account, changes a price, offers a retention action,
or decides an outcome.

## Evidence state machine

```text
PLANNING_ONLY
  -> SHADOW_REVIEW
  -> OWNER_APPROVED_PILOT
  -> OUTCOME_OBSERVATION
  -> HOLD or ROLLBACK
```

Every transition needs evidence. A state name is not a permission. In the local
reference, only `PLANNING_ONLY` and a simulated readiness check are executable.
All other states describe work that a separately authorised organisation would
have to approve and operate.

## Preconditions before a pilot can be discussed

| Evidence | Required question | Minimum local record |
| --- | --- | --- |
| Data owner | Who may permit the defined data class for the stated purpose? | Named role, scope, expiry, deletion owner. |
| Operational owner | Who owns the review workflow and can stop it? | Named role and a hold authority. |
| Human reviewer | Who checks a recommendation before any consequential decision? | Named reviewer role and checklist. |
| Allowed-data boundary | What is allowed, excluded, and retained? | Data-class allowlist and explicit exclusions. |
| Comparison plan | What baseline and candidate are compared, for which unit, and when is it frozen? | Versioned protocol and frozen timestamp. |
| Workflow measure | What short-cycle operation is being measured? | Name, definition, denominator, time window, and claim boundary. |
| Safety guardrail | Which result forces a hold regardless of an average metric? | Threshold, escalation owner, and response. |
| Delayed outcome | Which later business outcome would matter, and when can it exist? | Definition, outcome delay, comparison method, and `NOT_OBSERVED` status. |
| Rollback rule | What causes the candidate to stop, and what remains available? | Trigger, baseline target, and human decision path. |

Do not replace a missing row with a model metric. A value such as precision,
F1, or a synthetic queue proxy belongs in the technical comparison. It cannot
establish data rights, intervention ownership, or a business outcome.

## Measurement hierarchy

| Layer | Example question | Honest evidence state | What it cannot prove alone |
| --- | --- | --- | --- |
| Hard gate | Did any input, trace, or output breach the action contract? | Pass/fail on a fixed local check. | That the workflow benefits a team. |
| Model or route metric | Did the candidate classify the fixed holdout route correctly? | Offline technical observation. | That a reviewer or customer outcome improves. |
| Workflow metric | Could a reviewer complete a packet against a pre-registered checklist in the declared window? | A short-cycle operational observation. | Revenue, retention, satisfaction, or causal effect. |
| Delayed outcome | Did the authorised comparison show a change in the defined outcome after the observation window? | Unknown until the protocol finishes. | A universal or permanent benefit. |

This hierarchy prevents two common portfolio errors: calling a model score
business value, and treating an unmeasured outcome as a negative or positive
result.

## A safe shadow-review phase

Shadow review is the cheapest credible next step. The candidate creates a
draft-only queue beside the baseline. A reviewer compares the two against a
frozen checklist. Neither queue triggers a customer-facing or account-changing
action.

For each packet, record only authorised fields:

```text
packet_id / data version / baseline version / candidate version
expected route / actual route / reviewer decision / reason-code reconstruction
checklist completion / safety status / timestamp / unresolved issue
```

Pre-register the comparison before looking at outcomes. Keep a failed packet in
the record. If a protocol change is necessary, close the old version and create
a new version rather than rewriting the pass rule after a result.

## When an outcome question becomes legitimate

A delayed business outcome can be asked only after a separate authorised team
has defined the intervention, who may receive it, the comparison or control
strategy, outcome window, privacy and retention handling, owner, and stop rule.
For a queue, the system's ranking is not the intervention. A human-owned action
would need its own policy and evidence.

Until that work is complete, use one of these honest statuses:

- `NOT_REQUESTED`: no team has proposed outcome measurement.
- `NOT_AUTHORISED`: a question exists but data or operational authority is absent.
- `NOT_OBSERVED`: an authorised protocol exists but its outcome window is not complete.
- `INSUFFICIENT_EVIDENCE`: observations exist but the comparison cannot support the proposed conclusion.

None of these statuses should be rewritten as a success story. They tell a
reviewer that the builder understands where technical evidence ends.

## Technical and non-technical evidence to put in a portfolio repository

| Technical evidence | Business, delivery, and risk evidence |
| --- | --- |
| Versioned feature, model, prompt, baseline, and evaluation identifiers. | Decision owner, data owner, operational owner, and human reviewer. |
| Fixed cases, comparison protocol, route metrics, traces, and failure records. | Data boundary, retention expiry, consent or authorisation decision, and error cost. |
| A static readiness gate with no network, key, or write capability. | Primary workflow measure, safety guardrail, delayed-outcome definition, and stop condition. |
| Tests that block missing or action-enabled designs. | A decision record explaining hold, rollback, or what evidence is still missing. |

The two columns must remain linked. A polished dashboard without owners or a
well-written business story without a reproducible comparison is incomplete
portfolio evidence.

## Local sidecar included with Renewal Triage

`examples/renewal-triage/data/pilot-design-v1.mjs` contains a deliberately
incomplete default plan and a fully populated synthetic design. The latter can
reach a simulated `OWNER_APPROVED_PILOT` state only when every precondition is
present. `src/pilot-readiness.mjs` still returns `deployable: false`, an empty
automatic-action list, and `NOT_OBSERVED` for the delayed outcome.

Run `npm test` from that example folder to inspect the gates. The result is
evidence that the design contract is tested locally, not that a pilot has run.

## Portfolio-safe summary

> I built a local, synthetic pilot-readiness contract for a human-review ML
> workflow. It separates fixed technical evaluation from a proposed workflow
> measure and an unobserved delayed outcome; it blocks a pilot design without
> ownership, data boundaries, a frozen comparison, a safety guardrail, or a
> rollback rule. No external system, account, or outcome data is connected.

Only use this wording when the repository contains the corresponding evidence.
Do not add a real business metric, a user count, a time-saving claim, or a
retention result unless an authorised measurement protocol has actually produced
and supported it.
