# PolicyPilot Starter

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

Status: reader-owned local exercise. This package contains invented policy records only. It is a portfolio starter, not a production policy service.

This small project answers one bounded question:

> Can a support reviewer receive a draft backed by a current, approved synthetic rule, or must the case stop for human review?

The starter does not try to build a generic support chatbot. It makes the source rule, decision authority, negative cases, and limits visible. A fluent answer without a valid source is not treated as a success.

## Run it locally

Requires Node.js 20 or later. There are no third-party dependencies, environment variables, credentials, network calls, or install step. It makes no model calls.

Unzip the download. In the extracted folder that contains this `README.md` and `package.json`, open a terminal and run:

```powershell
npm test
npm run demo
```

`npm test` checks a current cited draft, an unsupported question, a superseded rule, an out-of-scope action, an instruction-override attempt, a non-synthetic corpus, the static model seam, and the local Promptfoo provider.

`npm run demo` prints the exact report recorded in [`expected-output.json`](expected-output.json).

## What this example actually checks

The demo asks whether an unused synthetic demonstration keyboard can be considered for return 14 days after delivery. It produces a draft cited to `SYN-POL-RET-100 v2`.

The same query also matches `SYN-POL-RET-100 v1`, but that record is superseded. The trace lists it as rejected rather than using it as a current source. A request for a 2025 rule, a question without enough support, an action request, or an attempt to override the policy boundary becomes a human handoff or a blocked operation.

The five recorded cases pass only when all of these conditions hold:

| Check | Result in the five recorded cases | Scope |
| --- | --- | --- |
| Route and reason code | 5 of 5 declared cases match | Tiny invented evaluation set |
| Citation reference | 5 of 5 declared cases match | Current policy ID/version only |
| External actions | 0 observed | The package has no action integration |
| Human review | Required on every route | A draft never decides or acts |
| Raw fixture question in trace | 0 observed | Trace stores a hash and metadata instead |

Those are properties of this small exercise. They are not service-level, model, security, privacy, revenue, customer, productivity, or business-impact results.

## What a reviewer can inspect

| Evidence area | What this package shows | What it does not claim |
| --- | --- | --- |
| Business framing | One bounded policy-draft decision, a manual baseline, named owner, and non-goals | A real organisation, workflow, KPI, or user problem |
| Source control | Synthetic IDs, versions, status, effective dates, and an explicit rejection of stale/draft records | A real policy corpus or complete retrieval coverage |
| Technical baseline | Deterministic keyword matching before any model choice | Semantic-search, RAG, or LLM quality |
| Safety and authority | Read-only action contract, out-of-scope blocking, and human handoff | That code alone makes a live system safe |
| Evaluation | Fixed positive and negative cases, a recorded demo, and Node tests | Generalisation beyond five invented cases |
| Delivery practice | Decision, metric, failure, review, rollback, and adaptation records | Operational approval, deployment, monitoring, or incident response |

## Package map

```text
data/       Versioned synthetic policy corpus and demo requests
src/        Validation, retrieval baseline, routing, evaluation, and static model seam
tests/      Node built-in test suite
scripts/    Repeatable local demo
evals/      Optional local Promptfoo fixture configuration
docs/       Business decision, metrics, failure, review, rollback, and adaptation records
```

Read these before adapting the fixture:

- [Decision brief](docs/decision-brief.md)
- [Metric map](docs/metric-map.md)
- [Failure cases](docs/failure-cases.md)
- [Reviewer decision template](docs/reviewer-decision.md)
- [Rollback record](docs/rollback-record.md)
- [Adaptation worksheet](docs/adaptation-worksheet.md)
- [Future model seam](docs/future-model-seam.md)

## Optional Promptfoo fixture run

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) is a reviewable Promptfoo fixture configuration. Its provider calls this package's deterministic local route only. It is not included in `package.json` scripts, so the core `npm test` and `npm run demo` path stays dependency-free, key-free, and model-free.

If you want to inspect the same three fixed cases through Promptfoo, this optional command needs Node.js 22.22 or later. It pins Promptfoo to `0.123.1` and writes the exported result under ignored `results/`:

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

`npm test` inspects the checked-in configuration and local provider, but it does not execute Promptfoo. It is not a recorded Promptfoo pass. Only the optional command above produces a local Promptfoo result.

`npx` may download the pinned tool from the package registry when it is not cached. The fixture provider itself reads no credential, calls no model or API, and uses no business data. Treat that result as a repeatable check of these three local cases—not as a live-model result or production evidence.

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) is a static `gpt-5-mini` Responses API shape. It marks itself as `design_note_only_not_executed`. It contains no key, provider setup, SDK, request, response, or model output. It is useful for discussing where a later experiment belongs, not for claiming that one happened.

## Scope boundary

- Every `SYN-POL-*` record and every result is fabricated for this exercise.
- The only permitted output is a cited draft or a handoff for human inspection.
- The package never contacts a customer, reads an account, changes an order, creates a case, issues a refund, takes payment, or sends a request anywhere.
- A local test pass says only that this specific synthetic exercise is repeatable. It does not prove model quality, business impact, security, privacy approval, production readiness, or suitability for live data.
- Do not replace the fixture with real records until an authorised owner has separately established data permissions, source governance, privacy and security review, point-in-time availability, a baseline, success measures, monitoring, an incident path, and a release decision.
