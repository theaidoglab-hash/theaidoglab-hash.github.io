# Fixture-only evaluation, release, and monitoring plan

> **Status: local planning artifact.** This document describes how the
> synthetic reference can be checked and how a future, separately authorised
> pilot would need to be governed. It does not create a release, appoint an
> operating team, collect telemetry, or approve use with real data.

## Fixture-only evaluation

The local evaluation question is deliberately narrow:

> Given a fixed fictional FAQ corpus and a synthetic request, does the queue
> produce a cited draft only when a current approved entry supports it, and
> otherwise stop for a human or block the requested action?

Run from this example folder:

```powershell
npm test
npm run demo
```

| Local evidence | A pass means | A pass does not mean |
| --- | --- | --- |
| `npm test` | Fixed synthetic routes still meet their declared assertions. | A model, customer workflow, or real policy corpus was evaluated. |
| `npm run demo` | The visible synthetic examples follow the stated safe routes. | A pilot was approved or a business outcome was measured. |

The evaluation covers a supported FAQ, unsupported question, instruction
override, mock failure, and action request. It is useful regression evidence,
not a quality score, safety rate, or production metric.

## Decision receipt: join the technical and business checks

The [decision contract and receipt](decision-contract.md) is attached to every
local route. It makes three distinctions easy to inspect in the same result:

1. `businessMeasurementStatus: "not_measured_in_this_fixture"` means a future
   business outcome has been defined but no result exists to report.
2. `actionVerified: true` means the local result kept the read-only action
   contract; it does not prove that a future integration would be safe.
3. `sourceReceipt` identifies the checked-in fictional snapshot and its hash;
   it does not establish rights, quality, or currency for a real source.

A candidate must hold if any of those statements stops being true, or if a
formerly supported source becomes stale at its supplied `asOf` date. The
expanded local tests include the stale-source and receipt assertions.

## Human owner and release decision

The local package has no real operator. For this fixture-only reference,
**Riley Patel, fictional FAQ Operations Owner**, is the named human owner. A
team name, model, CI job, or shared inbox is not a human owner. Riley may hold
the local workflow for review and define what a future approval request must
contain; Riley cannot approve a real pilot or release from this repository.

| Decision | Minimum evidence | Human owner action | Scope after decision |
| --- | --- | --- | --- |
| `LOCAL_REFERENCE_OK` | Tests and demo pass; corpus remains fictional; no credential, network, or external action is added. | Portfolio maintainer confirms the local boundary. | Local learning/reference use only. |
| `HOLD_FOR_HUMAN_REVIEW` | A test fails, a source route is unclear, ownership is missing, or a proposed change reaches beyond the fixture. | Named FAQ Operations Owner pauses the proposal and records what must be resolved. | No pilot or release. |
| `PILOT_REQUIRES_SEPARATE_APPROVAL` | A documented data-rights, privacy, security, reviewer, measurement, retention, and incident plan exists. | Named FAQ Operations Owner seeks the required organisational approvals. | Still not a production release. |
| `STOP_AND_RETURN_TO_MANUAL_REVIEW` | A safety boundary is breached, an unauthorised action path appears, or real/private material enters the package. | Named FAQ Operations Owner disables the assisted draft path and returns work to the existing manual review process. | Stop the change; investigate before any further proposal. |

No program in this repository assigns these decisions. The table is an
operating-design checklist, not an approval record.

## Monitoring signals for a future approved pilot

There is no deployed service, telemetry, alert, dashboard, or log collection
in this reference. If a separate authorised pilot is proposed, the named human
owner should agree on a minimal, privacy-reviewed measurement plan before it
starts.

| Signal | Question it answers | Minimal record to review |
| --- | --- | --- |
| Route distribution | Are cited drafts, handoffs, or blocks changing unexpectedly? | Aggregate route count and release identifier, not raw questions by default. |
| Source-validity failure | Did an unapproved or expired FAQ become eligible for a draft? | FAQ ID/version and reason code. |
| Safety-stop count | Are action requests or instruction overrides reaching the queue? | Category count and an approved sampling policy, not unrestricted prompt logs. |
| Reviewer outcome | Are reviewers rejecting drafts for support, citation, or wording reasons? | Approved label and reason category attached to a de-identified review record. |
| Review workflow measure | Is the proposed workflow completing against its agreed review window compared with a pre-defined baseline? | Frozen metric definition, comparison method, observation window, and owner. |

These are measurement definitions, not reported results. A fluent response,
synthetic test pass, or model score cannot substitute for an agreed workflow or
business measure.

## Rollback and stop conditions

The safest rollback is operational rather than technical: the named human
owner disables the assisted-draft path and routes the request to the existing
manual FAQ-review process. A future code or corpus change should also be tied
to a versioned change record and a rerun of the fixed local evaluation.

Stop or hold the proposal when any of the following occurs:

- a test or declared safety route fails;
- a draft can propose or execute an external action;
- an unapproved, stale, or unsupported source is used as evidence;
- the required human owner, reviewer path, or data-rights decision is absent;
- credentials, real customer data, private policy material, or uncontrolled
  prompt logging enter the reference; or
- the agreed pilot protocol, baseline, or measurement definition changes after
  observation begins.

The package cannot perform a rollback automatically. It has no service,
database, queue, deployment, or external connection to disable.

## Non-production limits

- All FAQ records, inputs, drafts, cases, and traces are fictional and local.
- The runtime uses a deterministic mock; the static Responses API fixture is
  never imported, sent, or executed.
- No real customer, account, message, ticket, payment, refund, or policy is
  accessed or changed.
- No monitoring, alerting, audit retention, access control, incident response,
  privacy program, or deployment configuration is implemented here.
- Nothing in this document proves model quality, safety performance, review
  time, cost, revenue, customer outcome, or permission to run a real pilot.

The portfolio value is the visible decision boundary: evidence and a human
review are required before a draft could ever move beyond this local fixture.
