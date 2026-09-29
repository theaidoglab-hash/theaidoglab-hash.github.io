# Fixture-only evaluation and pilot measurement map

> **Status: local planning evidence only.** This document does not authorise a
> release, deployment, external model call, data connection, or pilot. Every
> result named here comes from fixed synthetic fixtures.

## Decision owner and the narrow decision

**Avery Morgan, fictional Batch Operations Lead**, is the named human owner
for this teaching workflow. Avery may decide whether a proposed change remains
safe to demonstrate with the local fixture set, or whether it must stop for
review. Avery cannot use this package to approve a production service, spend,
provider account, document-system write, or data-access request.

The narrow decision is: *does a candidate implementation preserve the declared
local routes for duplicate suppression, checkpointed retry, dead letter, cost
stop, and human-review-only output?* It is not a decision about whether an AI
enrichment system improves a real operation.

## Fixture-only evaluation gate

Before a local change is kept as portfolio evidence, run:

```powershell
npm test
npm run demo
```

The gate is satisfied only when the fixed tests and deterministic walkthrough
both pass and the checked-in artefacts remain reproducible. The owner reviews
the relevant route, run/job/attempt trace IDs, and nonclaims before marking a
change as a local demonstration candidate.

The gate must stop if a fixed case changes its declared route, a terminal
duplicate spends another synthetic attempt, a cost stop allows an attempt, a
trace is missing, a document body enters an audit event, or an allowed action
becomes non-empty. Restore the prior local implementation and repeat the fixed
cases before discussing another change. There is no deployed environment to
roll back; “rollback” here means reverting a local candidate to the prior
fixture-validated behaviour.

## Measurements for a separately authorised future pilot

No pilot exists and no measurements or targets are claimed. If an organisation
later authorises a separate, privacy-reviewed pilot, Avery would first agree a
measurement sheet with the workflow owner. It should separate these signals:

| Layer | Example signal to define before the pilot | Decision use |
| --- | --- | --- |
| Input and routing | Rejected-input rate; duplicate suppression count; dead-letter rate by reason | Check whether the input contract or exception policy needs review. |
| Retry and resilience | Retry category/count; age of checkpointed work; exhausted-retry count | Decide whether to pause, inspect provider/error assumptions, or change the retry policy. |
| Cost guardrail | Attempted versus blocked work at the agreed budget cap; verified spend source | Confirm that a human budget owner, not the worker, makes any resume decision. |
| Human workflow | Reviewer accept/reject/rework outcome and time-to-review, with a defined baseline | Assess workflow usefulness without substituting a model metric for an operational decision. |
| Safety and data | External-action attempts; unauthorised field/trace events; access-policy exceptions | Stop immediately and investigate rather than averaging a safety failure into a score. |

A real measurement plan must name data source, observation window, baseline,
denominator, reviewer roles, retention rules, and a decision date before any
collection begins. None of those elements are implemented by this repository.

## Monitoring and stop conditions

For the fixture reference, monitoring means reviewing the deterministic test
report, demo artefact, and action contract whenever code changes. It is not
live telemetry or an incident service.

For an authorised future pilot, the named owner should define a review cadence
and immediately pause the pilot when any of the following occurs:

- an external write, contact, or approval is attempted outside the authorised
  action contract;
- data outside the agreed allowlist reaches a prompt, trace, queue, or log;
- required trace context is missing or a safety/contract case regresses;
- the agreed budget or cost guardrail is reached without a human resume
  decision; or
- the reviewer cannot safely resolve a dead letter, retry pattern, or output.

The first response is to hold new work, preserve only authorised diagnostic
evidence, route the decision to the human owner, and revert to the last
approved configuration where one exists. This is a proposed operating pattern,
not a tested recovery capability.

## Non-production limits

This repository has fictional data, serial in-memory state, deterministic
fixture outcomes, and a static non-executing `gpt-5-mini` request shape. It has
no credential, provider call, durable broker, database, concurrent worker,
rate limiter, cost telemetry, access control, incident process, deployment, or
business-result evidence. A passing local gate therefore proves only that the
declared fixtures behaved as expected.
