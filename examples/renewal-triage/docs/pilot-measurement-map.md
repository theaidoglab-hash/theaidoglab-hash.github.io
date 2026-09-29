# Pilot Measurement Map

## Scope and nonclaims

This is a static, synthetic-only planning artifact. It tests whether a pilot
*design* has the minimum evidence needed to be discussed. It does not connect
to data, execute an intervention, allocate a real person, collect an outcome,
or authorize a production release.

`OWNER_APPROVED_PILOT` in the fixture is a simulated state for a local portfolio
review. It means the frozen synthetic design contains named roles, boundaries,
measurement definitions, and a rollback rule. It does not prove that any real
owner approved a pilot.

## The business question

The local Renewal Triage reference already asks whether a fixed-capacity human
review queue is more useful than a baseline. The next question is different:

> If an authorised team later runs a bounded review workflow, what evidence
> would let it decide whether to hold, iterate, or stop without calling a model
> score or synthetic proxy a business result?

The answer is a pre-registered measurement design, not a more elaborate model.

## Technical evidence demonstrated

| Concern | Inspectable local evidence | Why it matters |
| --- | --- | --- |
| State boundary | `data/pilot-design-v1.mjs` enumerates planning, shadow review, pilot, observation, hold, and rollback states. | A local evaluation must not silently become a launch. |
| Frozen comparison | The fixture names an assignment unit, baseline, candidate, strategy, and freeze time. | A comparison changed after a result cannot support an honest decision. |
| Metric contract | A primary workflow metric, safety guardrail, and delayed outcome definition are separate fields. | It prevents one convenient model metric from standing in for every form of value. |
| Traceable checks | `src/pilot-readiness.mjs` returns each gate and blocker. | A reviewer can see exactly why a plan is not ready. |
| Regression protection | `test/pilot-readiness.test.mjs` covers missing roles, missing measurement, and action-enabled designs. | Required evidence cannot disappear unnoticed in a later edit. |
| Action boundary | The sidecar requires a disconnected contract, no external actions, and an empty automatic-action list. | Planning a pilot must not create a hidden route to a live system. |

## Non-technical business and delivery evidence demonstrated

| Concern | Evidence required before the simulated pilot state | Boundary |
| --- | --- | --- |
| Decision ownership | A data owner, operational owner, and named human reviewer. | Role labels are synthetic; they are not a real approval record. |
| Data rights | An explicit allowed-data list, excluded data classes, retention expiry, and deletion owner. | The reference accepts no actual data. |
| Measurement ownership | A workflow metric, a safety guardrail, and an outcome definition with an observation delay. | No outcome is collected or reported. |
| Comparison integrity | A pre-registered baseline-versus-candidate strategy and assignment unit. | It does not randomise, assign, or contact anyone. |
| Stop condition | A rollback trigger and explicit hold action. | No rollback is executed automatically. |

## End-to-end evidence path

```text
Local synthetic evaluation
        |
        v
PLANNING_ONLY
  - missing owner, metric, comparison, or boundary -> BLOCKED
        |
        v
SHADOW_REVIEW
  - candidate cannot change downstream state
        |
        v
OWNER_APPROVED_PILOT (simulated design state only)
  - data/operations/reviewer roles, frozen comparison, metrics, and rollback rule
        |
        v
OUTCOME_OBSERVATION
  - only an independently authorised team could collect a delayed real outcome
        |
        v
HOLD or ROLLBACK
  - safety breach, protocol change, or failed pre-registered gate
```

The code represents only the first and third boxes as a local design check. The
remaining boxes are intentionally a teaching map, not a live integration.

## Test evidence

Run from the reference root:

```powershell
npm test
npm run demo
```

The tests show that the default design is blocked; that a fully populated
synthetic design is ready for a simulated owner-approved state while remaining
non-deployable; and that missing ownership, measurement, comparison, delayed
outcome, or action safety blocks the plan.

## What to measure later, if authority exists

Use three separate rows in a real, authorised design:

1. **Workflow measure:** for example, the share of review packets completed
   against a defined checklist within the agreed review window.
2. **Safety guardrail:** for example, zero external-action breaches, with a
   named hold response if one occurs.
3. **Delayed business outcome:** an explicitly defined outcome, observation
   window, comparison method, and decision owner. Until observed through the
   agreed protocol, its status is `NOT_OBSERVED`.

A higher F1, a more fluent draft, or a synthetic utility score can inform a
design decision. None independently proves the delayed business outcome.
