# Demonstration map

## Fictional business context

A fictional workforce-planning research lead needs to decide whether a small public-statistics extract is complete enough to become context for a human-written brief. The decision is deliberately narrower than deciding whether to hire, freeze roles, change pay, advise on visas or migration, forecast the labour market, or publish a claim.

The local repository contains a source-shaped synthetic time series. It records a possible Australian Bureau of Statistics (ABS) public-data route, but it does not download, cache, or reproduce an ABS observation.

## End-to-end workflow

```text
Official public-data route receipt + source-shaped synthetic fixture
  -> metadata, ordering, freshness, and private-field boundary
  -> deterministic context packet OR SOURCE_REJECTED
  -> optional narrative-draft seam with no live model call
  -> fixed cases and Evidence Delta
  -> human release decision, monitoring plan, and rollback boundary
```

The only permitted result is a human-review context packet or `SOURCE_REJECTED`. The package cannot make a staffing, salary, visa, migration, policy, investment, forecast, publication, or external action decision.

## Technical evidence

| Evidence | Inspectable artifact | What it establishes locally |
| --- | --- | --- |
| Data contract | `data/source-manifest.fixture.json`, `data/series.fixture.json`, and `src/source-validation.mjs` | Explicit source route, synthetic-only receipt, required metadata, ordered monthly observations, and reject paths |
| Deterministic baseline | `src/workforce-signal-brief.mjs` | A period-to-period delta can be calculated after validation without asking a model to infer a trend |
| Action boundary | `src/action-contract.mjs` | The action list is empty and prohibited actions include forecasting, hiring recommendations, publishing, and external writes |
| Output contract | `schemas/workforce-signal-contract.schema.json` | Exactly two result shapes: a bounded packet or `SOURCE_REJECTED` |
| Prompt boundary | `prompts/context-brief-v1.txt` and `src/responses-api-fixture.mjs` | An optional draft must preserve facts and synthetic-data limits; it is not executed |
| Regression evidence | `test/workforce-signal-brief.test.mjs`, `evals/`, and `scripts/eval-diff.mjs` | Eight deterministic acceptance cases and one comparable before/after change packet |

## Non-technical and business evidence

| Evidence | Why it matters | What it does not prove |
| --- | --- | --- |
| Named decision owner | A fictional research lead owns the question of whether a human should use a source receipt | That any organisation has such a role or accepts this workflow |
| Data provenance | The route records release, API, and citation references before a data value is trusted | That a source was acquired, current, complete, licensed for a specific use, or interpreted correctly |
| Decision rights | Hiring, pay, visa, migration, policy, investment, and public communication stay with a human process outside the package | That code can decide a consequential workforce outcome |
| Measurement plan | Data-receipt completeness, reviewer correction rate, and source-age detection are separate hypotheses | Savings, adoption, accuracy, fairness, or business impact |
| Release and rollback | A change requires comparable cases and human review; a failure holds or reverts the candidate | Production approval or readiness |

## Test evidence

The fixed suite covers a complete synthetic series, a missing unit, unordered observations, a stale receipt, a prohibited private field, an instruction override, and a request for a labour-market forecast. Run `npm test`, `npm run fixture:validate`, `npm run demo`, and `npm run eval:diff` locally. These commands use only repository files.

The Promptfoo fixture configuration is a local provider shape that a reader may run only after separately installing Promptfoo. The optional Responses configuration is never called by package scripts or CI and contains no credential. Neither proves a model result.

## Non-claims

- No live ABS API, Data Explorer, release, or dataset is fetched, stored, or verified.
- No included value is an ABS observation or an ABS-derived statistic, trend, forecast, or causal finding.
- No model response, Promptfoo output, cost, latency, quality, safety result, or model/provider comparison is included.
- No person, employer, employee, candidate, salary, visa, customer, or operational data is present.
- No job-market, staffing, pay, migration, policy, investment, business, production, deployment, or external outcome is claimed.
