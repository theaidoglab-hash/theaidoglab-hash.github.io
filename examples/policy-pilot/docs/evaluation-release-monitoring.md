# Evaluation, release, and monitoring plan

> **Status: local training plan.** The checks below create executable evidence for a synthetic reference. They do not create a production release, live monitoring, a service-level objective, or an operational approval.

## 1. Evaluation question

For a fixed synthetic corpus and a fixed `asOf` date, does the candidate either:

1. produce a cited draft backed by a current approved synthetic policy; or
2. route an unsupported, stale, unsafe, or action-seeking input to a human without attempting any action?

The current implementation is deliberately a deterministic keyword baseline. That is useful because it makes expected outcomes inspectable before a model is introduced.

## 2. Evidence tiers

| Tier | Command or artifact | What a PASS means | What a PASS does not mean |
| --- | --- | --- |
| Unit and acceptance tests | `npm test` | The local implementation passed the declared synthetic assertions | A model, a real policy corpus, or a customer workflow was evaluated |
| Full fixture report | `npm run demo` | The five fixed scenarios and their hard gates passed in the current local checkout | The result generalises beyond this tiny fixture set |
| Promptfoo fixture design | [`../evals/promptfoo.fixture.yaml`](../evals/promptfoo.fixture.yaml) | A separately installed Promptfoo runner can exercise the same local deterministic provider | Promptfoo was run by package scripts or CI, or a model was tested |
| Optional model experiment design | [`../evals/promptfoo.responses.optional.yaml`](../evals/promptfoo.responses.optional.yaml) | The proposed `gpt-5-mini` response shape, test cases, and structured schema are inspectable | A live API was called, a credential was read, or a model result was obtained |

## 3. Fixed synthetic cases

| Case | Expected route | Decision evidence |
| --- | --- | --- |
| Current return policy | `answer_with_citation` | `RET-100 v2` is current and approved at the fixed date |
| Uncovered custom engraving question | `handoff` | The available records do not support a claim |
| Superseded 2025 return policy | `handoff` | An expired record must not become a current citation |
| Refund request | `handoff` | The read-only action boundary stops the flow before retrieval |
| Policy-override injection | `handoff` | The safety boundary rejects an instruction override |

The hard gates in [`../src/evaluate.mjs`](../src/evaluate.mjs) require every expected route and citation reference to match, every action to remain `none`, and every trace to omit its raw query.

## 4. Metrics: distinguish definitions from results

The following are reasonable **definitions** for a later, separately approved experiment. This repository does not report their values.

| Measure | Definition | Why it is more useful than a model-only score | Current evidence state |
| --- | --- | --- | --- |
| Citation-route correctness | Fraction of fixed cases whose route and citation reference match the declared expectation | Links an answer to an eligible source and a business decision | Checked only on five tiny synthetic cases |
| Unsafe-action escape rate | Count of cases where a proposed external action appears despite the read-only contract | Captures a high-severity failure that an average score could hide | Expected to be zero in local fixture tests; no live measurement |
| Unsupported-claim handoff rate | Fraction of unsupported cases routed to a human with no citation | Shows whether the system admits missing evidence | Checked on one synthetic unsupported case |
| Source-validity failure rate | Count of stale or unapproved records cited as current | Tests source governance, not fluent wording | Checked on one synthetic stale case |
| Human-review acceptance rate | Share of drafts a trained reviewer approves under an authorised protocol | Measures workflow usefulness, not just model behaviour | Not designed, collected, or claimed here |
| Review-time change | Difference between a manual baseline and an authorised study's review time | Measures a workflow outcome with a comparison point | Not measured or claimed here |

Do not convert any of these definitions into a percentage, business case, or hiring claim without a documented sample, label protocol, decision owner, and result.

## 5. Promptfoo: useful boundary, not a badge

Promptfoo is suitable only after the core decision and fixed cases are already clear. The two configurations intentionally separate two things:

- **Fixture configuration:** [`../evals/promptfoo.fixture.yaml`](../evals/promptfoo.fixture.yaml) uses a local JavaScript provider. It invokes the deterministic baseline only, with no SDK, credential, network, or model. It can be used to learn how Promptfoo case assertions are expressed, but it is not included in `package.json` scripts or CI.
- **Optional Responses configuration:** [`../evals/promptfoo.responses.optional.yaml`](../evals/promptfoo.responses.optional.yaml) names `openai:responses:gpt-5-mini`, requests `store: false`, and supplies a strict response schema. It contains no credential and is not executable evidence. It exists so a reviewer can assess the evaluation design before anyone considers a separately authorised live experiment.

Promptfoo documents both local JavaScript providers and OpenAI Responses providers. See its [custom JavaScript provider documentation](https://www.promptfoo.dev/docs/providers/custom-api/) and [OpenAI provider documentation](https://www.promptfoo.dev/docs/providers/openai/). The optional model shape also points to the official [GPT-5 mini model documentation](https://developers.openai.com/api/docs/models/gpt-5-mini) and [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create).

Before a real Promptfoo/model run, obtain separate authority for credentials, data handling, spend, logging, retention, model choice, test-set ownership, human review, and a release decision. Do not use this repository's static configuration as a substitute for those approvals.

## 6. Local release decision

| Decision | Minimum evidence | Resulting scope |
| --- | --- | --- |
| `LOCAL_REFERENCE_OK` | `npm test` and `npm run demo` pass; all source data remains synthetic; no external action or credential is added | A local learning and portfolio reference only |
| `HOLD_FOR_REVIEW` | A test fails, a hard gate fails, a scope/ownership question is unresolved, or an extension requires an external integration | Stop changes to the demonstration path until a human reviews the issue |
| `STOP_AND_REMOVE` | Real/private data or credentials enter the package, an external action is wired, or the synthetic/non-claim boundary is breached | Remove the unsafe material from the draft area and return to a local fixture-only design |

No program in this repository assigns any of these decisions. They are an explicit human operating record, not an automation claim.

## 7. Monitoring and rollback design for a future approved service

There is no deployed service and therefore no live telemetry, alerting, or rollback implementation. If a separate authorised service were ever proposed, the following questions should be answered before release:

| Signal | Example decision use | Data-minimising design |
| --- | --- | --- |
| Route distribution | Detect a sudden shift from cited drafts to handoffs | Store aggregate counts and version IDs, not raw queries by default |
| Citation validity failures | Detect an expired or unapproved source appearing in output | Record policy ID/version and reason code |
| Safety-block count | Identify action-seeking or injection patterns that need review | Retain category and a privacy-reviewed sample policy, not unrestricted prompt logs |
| Reviewer rejection reasons | Locate grounding, routing, or policy-gap failures | Use an authorised labelled workflow with minimal necessary data |
| Corpus version uptake | Confirm the current policy version is being used | Record version metadata and release identifier |

The simplest rollback is a human decision to disable the model-assisted path and return to the manual policy-review process. Any code or corpus rollback should be tied to a versioned change, a rerun of the fixed evaluation, and a record of why the change was reversed. Those are future design requirements, not capabilities currently implemented here.

## 8. GitHub-ready evidence checklist

Before offering a fork or repository link as portfolio evidence, ensure the reviewer can find:

- the fictional business decision and non-goals in the README;
- the synthetic data boundary and change protocol in [`data-contract.md`](data-contract.md);
- deterministic code, fixed cases, and a one-command test route;
- a transparent statement that Promptfoo/model configurations are optional and unexecuted;
- release, monitoring, and rollback boundaries that do not pretend to be operational controls;
- a license and CI configuration; and
- a prominent non-claims section.

The useful signal is not that the repository contains more tooling. It is that each tool, test, document, and limit is connected to a specific decision a reviewer can inspect.
