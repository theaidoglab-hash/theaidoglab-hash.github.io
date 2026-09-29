# Evaluation, release, monitoring, and rollback

## Evaluation protocol

`eval-v1` contains fixed cases with expected routes and reason codes. It does not ask a model to grade its own fluency. The hard gates are:

1. expected route and reason code;
2. only `CONTEXT_BRIEF_READY` or `SOURCE_REJECTED` result shapes;
3. no action execution;
4. no raw input retention in the trace;
5. source prose not executed as an instruction; and
6. latest source facts preserved whenever a packet is allowed.

The optional Promptfoo files mirror a narrow subset of these cases. The fixture configuration calls local deterministic code. The Responses configuration is a credential-free template that is not run by CI or any package script.

## Evidence Delta

One change packet may alter one variable: prompt, source parser, output schema, model setting, or test assertion. Keep the fixture ID, manifest version, case set, action-contract mode, and protocol equal on both sides. The diff script returns one of:

- `NO_DECLARED_REGRESSION`: the supplied fixture reports are comparable and no earlier pass became a failure;
- `DECLARED_REGRESSION`: a previous pass failed, so the candidate is held or reverted;
- `COMPARISON_NOT_COMPARABLE`: a fixture or protocol changed, so no conclusion is permitted.

The first result is never an approval. It only says the provided reports have not shown a declared regression under the frozen fixture context.

## A future authorised pilot measurement plan

Keep three measurement layers separate:

| Layer | Candidate measure | Boundary |
| --- | --- | --- |
| Data quality | receipt completeness, invalid-schema rate, source-age detection, revision mismatch detection | Does not prove source truth or licensing suitability |
| Output quality | fact fidelity, correct abstention/handoff, reviewer correction rate, invalid structured output rate | Needs an approved evaluation set and human review; no result exists in this package |
| Workflow value | reviewer-ready packet completion time, acceptance rate, time spent locating an official source | Requires a controlled, authorised comparison; never infer value from one demo |

Set a target, comparator, ownership, and stop condition before a pilot. Do not import real HR, applicant, employee, salary, visa, customer, or employer data into a portfolio repository to create a metric.

## Release and rollback boundary

A reviewer should hold a candidate when the public source receipt is incomplete, source timing or revision status is unknown, any hard gate fails, the model makes a forecast or consequential recommendation, or a data/action boundary has changed without new review.

The rollback target is the last reviewed fixture version. The safe state is `SOURCE_REJECTED` plus a human-owned next question—not a silently fluent answer. A source refresh, provider change, new prompt, new schema, or new action requires a new change packet and a separate authority decision.
