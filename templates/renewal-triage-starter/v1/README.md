# Renewal Triage Starter

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

Status: reader-owned local exercise. The package contains invented records only. It is a portfolio starter, not a production renewal system.

This small project answers one bounded question: **when two people can review only two records, does ranking solely by a raw risk score produce the same draft queue as ranking by a synthetic business-priority value?**

It deliberately produces two different queues. That difference is the lesson: a technically tidy score is not the same thing as a useful, capacity-aware decision queue.

## Run it locally

Requires Node.js 20 or later. It has no third-party dependencies, environment variables, credentials, network calls, model calls, or install step.

Unzip the download. In the extracted folder that contains this `README.md` and `package.json`, open a terminal and run:

```powershell
npm test
npm run demo
```

`npm test` checks the recorded result, the split between risk ranking and queue utility, the ineligible-record rule, the no-action boundary, an out-of-scope request, a non-synthetic fixture, and invalid capacity.

`npm run demo` prints the exact report recorded in [`expected-output.json`](expected-output.json).

## What the fixed fixture demonstrates

The capacity is two records.

| Draft strategy | Selected synthetic records | Offline synthetic queue utility |
| --- | --- | ---: |
| Raw risk score, highest first | `SYN-RN-001`, `SYN-RN-002` | `16` units |
| Risk score × synthetic renewal value, highest first | `SYN-RN-002`, `SYN-RN-004` | `26` units |

The utility figure comes from a hidden-for-selection synthetic fixture label. It is used only after the queue is built to compare two local drafts. It is not revenue, retained value, a customer outcome, a model metric, an intervention result, or causal evidence.

`SYN-RN-005` has the highest raw signal but is ineligible, so neither draft can select it. A higher numerical value never overrides the eligibility boundary.

## What you can point to in a portfolio review

- A decision brief that names the owner, the allowed output, capacity, and non-goals.
- Deterministic fixture validation before the queue is created.
- Two clearly different ranking rules: raw risk and business priority.
- An evaluation that looks at the queue people would actually review, not only a score.
- Tests for failure routes and a repeatable expected report.
- A reviewer decision and rollback record that keep a local demonstration separate from real approval.

## Package map

```text
data/       Synthetic snapshot and allowed/blocked request fixtures
src/        Validation, queue construction, route boundary, and contracts
tests/      Node built-in test suite
scripts/    Repeatable local demo
docs/       Decision, metric, failure, review, rollback, and adaptation records
```

## Read these before adapting it

- [Decision brief](docs/decision-brief.md)
- [Metric map](docs/metric-map.md)
- [Failure cases](docs/failure-cases.md)
- [Reviewer decision template](docs/reviewer-decision.md)
- [Rollback record](docs/rollback-record.md)
- [Adaptation worksheet](docs/adaptation-worksheet.md)
- [Future model seam](docs/future-model-seam.md)

## Scope boundary

- Every `SYN-RN-*` record and every value is fabricated for this exercise.
- The only permitted output is a draft queue for human inspection.
- The package never contacts a customer, changes a price, makes a renewal decision, writes to an external system, or sends a request anywhere.
- A local test pass says only that this specific synthetic exercise is repeatable. It does not prove model quality, business impact, security, privacy approval, production readiness, or suitability for live data.
- Do not replace the fixture with real records until an authorised owner has separately established data permissions, privacy and security review, point-in-time availability, an intervention design, success measures, monitoring, and a release decision.
