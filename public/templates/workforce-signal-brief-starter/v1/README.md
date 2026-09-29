# Workforce Signal Brief Starter

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

Status: reader-owned local exercise. Every value in this package is invented.
It is not a live public-statistics integration, a labour-market forecast, or
advice about hiring, salary, visas, migration, investment, policy, or release.

This small project asks one question only: is a synthetic source receipt
complete enough for a person to write a no-action context brief? The program
either returns an allowlisted context packet for review or rejects the source.
It never retrieves data, calls a model, sends a message, publishes a brief, or
makes an external decision.

## Run locally

Requires Node.js 20 or later. There are no dependencies, credentials,
environment variables, install step, network calls, or model calls.

Unzip the download. In the extracted folder that contains this `README.md` and `package.json`, open a terminal and run:

```powershell
npm test
npm run demo
```

`npm test` checks seven fixed cases. `npm run demo` prints a deterministic
report; `expected-output.json` records the summary it is meant to produce. A
local pass establishes only that this invented fixture follows its stated
rules.

## What to inspect

| Path | Check it answers |
| --- | --- |
| `data/source-receipt.mjs` | What was and was not acquired? |
| `data/synthetic-series.mjs` | Which fields are allowed in the local fixture? |
| `src/evaluate.mjs` | When does a receipt stop before a packet is drafted? |
| `tests/workforce-signal-brief.test.mjs` | Do normal and failure cases keep the boundary? |
| `docs/decision-brief.md` | Who owns the decision and what is forbidden? |
| `docs/reviewer-record.md` | What would a reviewer record before keeping, holding, or reverting a change? |
| `docs/rollback-record.md` | How does a local candidate return to the earlier rule? |

## Suggested portfolio walkthrough

Show the source receipt before showing a chart. Then show one accepted fixture,
one rejected fixture, the reason code, the reviewer questions, and the blank
decision record. Explain that the program is checking whether a person has
enough bounded material to write context; it is not predicting a job market.

## Non-claims

- No ABS or other public release is downloaded, queried, cached, or reproduced.
- No employer, employee, candidate, customer, salary, visa, or operational data is present.
- No API key, OpenAI Responses request, Promptfoo run, model output, or external service is used.
- A local test pass does not establish source quality, a current statistic, forecasting ability, business value, security approval, production readiness, or user adoption.
- Do not replace this fixture with real data until an authorised owner has separately established source terms, data permission, privacy and security review, retention rules, evaluation, monitoring, and release authority.

See `workforce-signal-brief-starter.md` for the accompanying manual worksheet.
