# Framework selection: do not use one score for three different decisions

## The three-layer evidence loop

This reference deliberately uses three layers rather than presenting a tool as an end-to-end production platform.

| Layer | Main question | Concrete artifact in this reference | When it is enough | What it cannot decide |
| --- | --- | --- | --- | --- |
| Data contract and deterministic tests | Are source facts, input limits, routes, and action boundaries correct? | `src/source-validation.mjs`, unit tests, JSON schema | Every change, including a no-model baseline | Whether a human-written brief is useful or an organisation should act |
| Promptfoo case matrix | Did an optional prompt/model candidate regress on named cases? | `evals/promptfoo.fixture.yaml`, optional Responses shape, per-case assertions | After the contract and the case set are already stable | Data rights, business value, live model quality, or release approval |
| Human evidence review | Is the intended use, source receipt, failure evidence, and rollback plan acceptable? | change packet, decision log, monitoring and rollback plan | Before a separate pilot or any external action | A production outcome or a permanent assurance claim |

The first layer is the baseline. Promptfoo is useful only because the cases are already named and because the packet has hard boundaries. Human review stays separate because no test can grant a new permission or convert a synthetic result into a workforce decision.

## Tool choice by failure mode

Use a deterministic test when the requirement is exact: a required field exists, a unit is present, a period is ordered, a source receipt is recent enough, a private field is blocked, or no action appears in a result.

Use Promptfoo when changing a prompt, structured-output shape, provider setting, or model candidate would otherwise make a failure harder to spot. Keep its input set frozen, assert facts and routes rather than “helpfulness”, and retain the result per case. This repository's fixture provider is intentionally local; it shows the wiring without claiming a model evaluation.

Use a human review rubric when the question is whether a source is appropriate, a report might mislead, an outcome has material consequences, or a pilot would require authority. Record who owns that call and what condition would reverse it.

## A governance frame without a compliance claim

The [NIST AI RMF Playbook](https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook) is a useful prompt for separating context, measurement, management, and governance work. It is not a certificate and this teaching repository is not an implementation of the framework. Here, the practical mapping is deliberately small:

- **Map:** write the fictional owner, permitted context question, public-data route, and non-goals.
- **Measure:** keep deterministic contract tests, fixed failure cases, and a per-case Evidence Delta.
- **Manage:** hold or revert a candidate when a hard gate fails; record what a human needs to decide next.
- **Govern:** do not quietly change data rights, decision authority, or action permissions in a prompt update.

## Decision rule for an optional GPT-5 mini experiment

The static fixture names `gpt-5-mini` and a Responses API path because the [official model page](https://developers.openai.com/api/docs/models/gpt-5-mini) documents Responses API and structured-output support. It remains only a request-shape example. Do not run it until an owner has approved the source route, data boundary, case set, budget, credential handling, and success/stop conditions. A model call is an experiment, not an upgrade from local fixture evidence to production evidence.
