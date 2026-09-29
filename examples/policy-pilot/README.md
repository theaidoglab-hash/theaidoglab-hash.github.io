# PolicyPilot

[Traditional Chinese (Hong Kong)](README.zh-HK.md) · [Traditional Chinese (Taiwan)](README.zh-TW.md) · [Simplified Chinese](README.zh-Hans.md)

> **Status: synthetic, local-only portfolio reference.** This repository is not a deployed product, a real policy service, or evidence of production readiness.

PolicyPilot is a compact, inspectable reference for a policy-answer drafting workflow. It accepts a question about a fictional retail policy, retrieves only current approved synthetic policy records, returns a cited draft when the evidence supports it, and otherwise routes the case to human review. It has no external integrations, no customer data, no API calls, and no write capability.

The point is not to present a generic AI chatbot. It is to show the engineering and delivery evidence behind a bounded business workflow: source eligibility, a read-only action contract, deterministic evaluation cases, trace privacy, and explicit failure handling.

## Start locally

Requires Node.js 20 or later. There are no third-party dependencies and no credentials.

```powershell
# From this repository's root
npm test
npm run demo
```

`npm test` runs the fixed synthetic evaluation and safety assertions. `npm run demo` prints the local evaluation report. Both are local evidence only; neither command deploys anything, sends data, or proves real-world performance.

## What a reviewer can inspect

| Evidence area | What this repository demonstrates | What it deliberately does not claim |
| --- | --- | --- |
| Business framing | A support workflow where a draft must be supported by current, approved policy evidence | That a real company has this problem, policy, KPI, or workflow |
| Retrieval and citations | Deterministic keyword baseline, effective-date/status filtering, and policy ID/version citations | Semantic search quality, RAG quality, or LLM accuracy |
| Safety boundary | A permanent read-only action contract; unsafe, unsupported, stale, or permission-seeking inputs hand off | That code alone makes an external system safe |
| Evaluation | Five fixed synthetic cases and hard gates for routes, citations, no external actions, and trace privacy | Production coverage, benchmark scores, cost savings, or business impact |
| Delivery practice | CI, a data contract, evaluation/release/monitoring design, a minimal license, and a clean package boundary | Operational approval, live monitoring, incident response, or compliance sign-off |

Use the documentation as a guided portfolio walkthrough:

- [Demonstration map](docs/demonstration-map.md): business, technical, and delivery evidence at a glance.
- [Portfolio tutorial](docs/portfolio-tutorial.md): an end-to-end path from business decision to GitHub-ready evidence.
- [Synthetic data contract](docs/data-contract.md): what the fixture can contain, what it prohibits, and what the code does not enforce.
- [Evaluation, release, and monitoring plan](docs/evaluation-release-monitoring.md): hard gates, Promptfoo boundaries, release decisions, and future monitoring questions.
- [Optional Responses API demo contract](docs/optional-responses-demo-contract.md): the key-free, non-executing model-seam standard used by this reference.
- [Human-authored model-contract teaching fixture](docs/model-contract-teaching-fixture.md): an allowed cited-draft shape and a bounded handoff shape for reviewer discussion, not model output.

## Architecture

```text
Synthetic question
  -> safety boundary
  -> keyword baseline over synthetic policies
  -> current + approved source filter
  -> cited draft OR human handoff
  -> privacy-minimised trace + fixed evaluation report
```

The path to an answer is intentionally narrow:

1. A request that attempts an external action or policy override stops before retrieval.
2. Retrieval considers only synthetic records; a record must be `approved`, effective at the fixed `asOf` date, and meet the baseline score.
3. An eligible record produces a draft with its policy ID and version.
4. Missing, stale, unapproved, unsafe, or permission-seeking cases become a `handoff` with no citation and `action.kind === "none"`.
5. The trace retains a SHA-256 fingerprint and metadata, not the raw query.

## Optional model boundary: mock only

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) is a static, non-executing request-shape fixture labeled `mock_only_not_executed`. It illustrates where an optional `gpt-5-mini` Responses API component could sit in a later, separately approved experiment.

It is **not** an integration: it imports no SDK, reads no environment variables, contains no credential, calls no network, and produces no model output. The baseline and tests do not depend on it. The shape uses the model and request fields documented in the [GPT-5 mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini) and [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create), but it does not demonstrate availability, performance, cost, latency, or safety of a live API.

The package also includes a local-only [Promptfoo fixture configuration](evals/promptfoo.fixture.yaml) and an [optional Responses configuration](evals/promptfoo.responses.optional.yaml). Neither is a package script or CI step. The first uses deterministic local code only; the second contains no credential and is a reviewable experiment design, not a model result. See the [evaluation, release, and monitoring plan](docs/evaluation-release-monitoring.md) before treating either configuration as more than scaffolding.

The [optional Responses API demo contract](docs/optional-responses-demo-contract.md)
records the reusable request-shape, test, and delivery boundary. It is deliberately
not an instruction to add a credential or to run a provider.

## Repository map

| Path | Purpose |
| --- | --- |
| [`src/synthetic-corpus.mjs`](src/synthetic-corpus.mjs) | Fictional, versioned policy records, including deliberate stale and draft fixtures |
| [`src/policy-pilot.mjs`](src/policy-pilot.mjs) | Deterministic baseline, source eligibility, handoff routes, action contract, and trace construction |
| [`src/evaluation-cases.mjs`](src/evaluation-cases.mjs) | Fixed synthetic acceptance cases |
| [`src/evaluate.mjs`](src/evaluate.mjs) | Evaluation report and hard gates |
| [`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) | Static, mock-only `gpt-5-mini` request-shape fixture |
| [`fixtures/model-contract-teaching.fixture.json`](fixtures/model-contract-teaching.fixture.json) | Human-authored allowed and rejected structured-response teaching pair; neither object is model output or a model run |
| [`src/promptfoo-fixture-provider.mjs`](src/promptfoo-fixture-provider.mjs) | Local deterministic provider for optional Promptfoo fixture cases |
| [`test/policy-pilot.test.mjs`](test/policy-pilot.test.mjs) | Executable regression and boundary assertions |
| [`docs/demonstration-map.md`](docs/demonstration-map.md) | Portfolio interpretation guide: technical and non-technical evidence |
| [`docs/portfolio-tutorial.md`](docs/portfolio-tutorial.md) | End-to-end tutorial for making a bounded project GitHub-ready evidence |
| [`docs/data-contract.md`](docs/data-contract.md) | Synthetic data boundary and change protocol |
| [`docs/evaluation-release-monitoring.md`](docs/evaluation-release-monitoring.md) | Evaluation, release, monitoring, rollback, and Promptfoo boundaries |
| [`docs/optional-responses-demo-contract.md`](docs/optional-responses-demo-contract.md) | Key-free optional Responses request and evaluation boundary |
| [`docs/model-contract-teaching-fixture.md`](docs/model-contract-teaching-fixture.md) | How to review the static allowed/rejected response pair without mistaking it for a provider result |
| [`evals/`](evals) | Optional fixture-only and unexecuted Responses evaluation configurations |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | GitHub Actions checks for tests and the local demo |

## Responsible extension path

Do not turn the fixture into a live integration by adding a key and a network call. A real system would need a separate, reviewed design for data access, source governance, evaluation sets, model-choice and prompt experiments, external-action permissions, human approval, monitoring, incident handling, privacy, security, and release controls. The new documents make that missing work inspectable; they do not implement or approve it.

If you adapt the learning pattern, keep the same discipline: define the business decision, use authorised data, write the negative cases before implementation, make action authority explicit, and document what the tests do not prove.

## License

This local repository draft includes an [MIT License](LICENSE). Confirm code ownership, third-party material, employer obligations, and external-release authority before publishing a fork or a public repository.
