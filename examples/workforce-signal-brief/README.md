# Workforce Signal Brief

[Traditional Chinese (Hong Kong)](README.zh-HK.md) · [Traditional Chinese (Taiwan)](README.zh-TW.md) · [Simplified Chinese](README.zh-Hans.md)

> **Status: local, fixture-only portfolio reference.** It is not a live ABS integration, labour-market forecaster, hiring tool, salary tool, migration/visa adviser, published report, deployed product, or evidence of production readiness.

Workforce Signal Brief is an end-to-end example of a safer data-and-LLM portfolio shape: a fictional workforce-planning research lead decides whether a public-statistics receipt is complete enough to support a human-written context brief. The local fixture is source-shaped synthetic data. It records a possible Australian Bureau of Statistics (ABS) route but contains no ABS observation.

The project is intentionally about decision quality, not an AI job-market oracle. It makes metadata, source receipts, test cases, action authority, monitoring questions, and rollback visible before any optional model seam is discussed.

## Start locally

Requires Node.js 20 or later. There are no package dependencies and no credentials.

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

All four commands use local files only. They do not download or query ABS data, call a model or Promptfoo, read a credential, make a forecast, recommend hiring, set pay, advise on visas or migration, publish anything, contact anyone, write to another system, or deploy anything.

## The public-data route—and what this repository actually contains

| Reference | Why it is recorded | What this repository does not claim |
| --- | --- | --- |
| [ABS Data API user guide](https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide) | A future public-statistics acquisition route and metadata/API reference | That this repository fetched an API response, a release, a Data Explorer table, or a current statistic |
| [Labour Force, Australia](https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia) | A public release collection a reader can inspect before designing an acquisition | That a particular series, value, revision, or interpretation is used here |
| [How to cite ABS sources](https://www.abs.gov.au/how-cite-abs-sources) | A source-receipt reminder | That a generic attribution note decides all data rights or use conditions |

The local series has a fictional geography, synthetic values, and a `synthetic` status on every observation. The manifest says `synthetic_source_shaped_not_live_acquired`. Do not relabel it as real labour-market data.

## What the system does

```text
Source-route receipt + source-shaped synthetic series
  -> receipt, metadata, order, freshness, and private-field checks
  -> CONTEXT_BRIEF_READY OR SOURCE_REJECTED
  -> no-action context packet for a human reviewer
  -> fixed evaluation cases, change comparison, release/rollback evidence
```

A ready packet keeps a series ID, reference period, unit, adjustment, values, a simple period-to-period difference, and questions for a human reviewer. It explicitly says that the values are synthetic. It cannot turn that difference into a forecast, explanation, hiring recommendation, salary decision, visa/migration advice, policy decision, investment decision, publication, or external action.

## Technical evidence and delivery evidence

| Area | Inspectable evidence | Why it matters |
| --- | --- | --- |
| Technical: data contract | [`data/`](data), [`src/source-validation.mjs`](src/source-validation.mjs), [`schemas/`](schemas) | Data routes, metadata, synthetic status, source freshness, private fields, and result shapes are checked rather than implied |
| Technical: deterministic baseline | [`src/workforce-signal-brief.mjs`](src/workforce-signal-brief.mjs) | A simple fact-preserving packet exists before a model can make fluent but untestable prose |
| Technical: test and regression evidence | [`test/`](test), [`evals/`](evals), [`scripts/eval-diff.mjs`](scripts/eval-diff.mjs) | Fixed cases cover normal, missing, unordered, stale, private, injection, and forecast-request paths; change reports remain comparable |
| Technical: optional LLM seam | [`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs), [`evals/promptfoo.responses.optional.yaml`](evals/promptfoo.responses.optional.yaml) | `gpt-5-mini` and a Responses shape are visible without a key, SDK, network call, or model result |
| Business/delivery: owner and decision | [`docs/demonstration-map.md`](docs/demonstration-map.md) | A human owns whether a source is suitable for a context brief; consequential decisions remain outside the package |
| Business/delivery: release discipline | [`docs/evaluation-release-monitoring.md`](docs/evaluation-release-monitoring.md) | Metrics, release, monitoring, and rollback are stated as a future plan rather than asserted business value |

## Use the right framework for the question

This package deliberately combines three different evidence layers:

1. **Data contract plus deterministic tests** for facts, boundaries, routes, and action authority.
2. **Promptfoo fixed cases** for prompt/model regression wiring once a valid contract already exists.
3. **Human evidence review** for data suitability, business context, release judgment, and any new permission.

The full comparison and a small [NIST AI RMF Playbook](https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook) mapping are in [`docs/framework-selection.md`](docs/framework-selection.md). This is not a NIST compliance claim.

## Optional GPT-5 mini and Promptfoo layers

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) is a static, non-executing request shape for `gpt-5-mini`. It has `store: false`, no SDK import, no credential, no network code, and no model output. It follows the documented [GPT-5 mini Responses/structured-output capability](https://developers.openai.com/api/docs/models/gpt-5-mini), but that documentation is not evidence that a workforce use case is suitable, safe, or effective.

[`fixtures/model-contract-teaching.fixture.json`](fixtures/model-contract-teaching.fixture.json) adds an allowed context-packet shape and a bounded forecast-rejection shape for reviewer discussion. It is human-authored static teaching data, not model output or a model run. Read [the companion guide](docs/model-contract-teaching-fixture.md) before treating either object as more than a response-contract example.

Two Promptfoo configurations explain how a reader could evaluate an optional future model seam:

- [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) uses a deterministic local provider. It is key-free and never runs in package scripts or CI.
- [`evals/promptfoo.responses.optional.yaml`](evals/promptfoo.responses.optional.yaml) names `openai:responses:gpt-5-mini`, `store: false`, and a response schema. It contains no key and is not executed by this repository.

Promptfoo documents its [configuration](https://www.promptfoo.dev/docs/configuration/guide/) and [OpenAI provider](https://www.promptfoo.dev/docs/providers/openai/) surfaces. A fixture pass proves only this repository's local wiring—not a model, provider, Promptfoo, source, or business result.

## Change, release, monitoring, and rollback

`CHANGE-001` shows one difference: a prior candidate incorrectly accepted a forecast request; the candidate fixture rejects it. The per-case comparison can only return `NO_DECLARED_REGRESSION` when its fixture and protocol context match. It is not release approval.

Before any separate, authorised pilot, define data-quality, output-quality, and workflow measures with a baseline, owner, review cadence, stop condition, and rollback target. See [`docs/evaluation-release-monitoring.md`](docs/evaluation-release-monitoring.md). A passing local test does not create a live-data verification, model evaluation, production system, or business outcome.

## Build your own version

Use [`docs/portfolio-tutorial.md`](docs/portfolio-tutorial.md) to adapt the pattern to a different official public source. Begin with a narrower question than “predict the market.” If your source, owner, data rights, or action changes, rewrite the receipt, evaluation set, decision log, and release gate rather than renaming this repository.

## Repository map

| Path | Purpose |
| --- | --- |
| [`data/`](data) | Source-route receipt and source-shaped synthetic series |
| [`src/`](src) | Validation, deterministic packet, no-action contract, fixtures, and fixed evaluation |
| [`fixtures/model-contract-teaching.fixture.json`](fixtures/model-contract-teaching.fixture.json) | Human-authored allowed and rejected structured-response teaching pair; neither object is model output or a model run |
| [`schemas/`](schemas) | Result and optional structured-output contracts |
| [`prompts/`](prompts) | Versioned bounded optional narrative-draft instruction |
| [`evals/`](evals) | Fixture-only and optional Promptfoo shapes plus comparable change reports |
| [`test/`](test) | Local contract and acceptance tests |
| [`docs/`](docs) | Data contract, framework choice, demonstration map, tutorial, monitoring, and rollback boundary |
| [`docs/model-contract-teaching-fixture.md`](docs/model-contract-teaching-fixture.md) | How to review static context and rejection shapes without mistaking them for a provider result |

## Non-claims

- No ABS data acquisition, currentness check, API call, or Data Explorer query occurs.
- No included value is an ABS value, public statistic, trend, forecast, or causal conclusion.
- No actual employer, employee, candidate, salary, visa, customer, or operational data appears.
- No OpenAI API call, model output, Promptfoo run, credential, cost, latency, quality, or safety result is shown.
- No hiring, salary, visa, migration, policy, investment, business, deployment, production, or external outcome is claimed.

## License

This local repository draft includes an [MIT License](LICENSE). Confirm code ownership, source terms, attribution, employer obligations, human review, and external-release authority before publishing a fork or connecting any live service.
