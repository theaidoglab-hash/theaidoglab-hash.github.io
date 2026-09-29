# Approval Queue Starter

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

**Status: reader-owned local exercise.** Every record, question, answer, and
result in this folder is invented. It is a portfolio starter, not a customer
support system or a production approval queue.

This project asks one bounded business question: **can a workflow prepare a
source-cited draft for a human reviewer without sending a message, reading an
account, or making a decision on the person's behalf?**

The answer is deliberately narrow. A fixed synthetic FAQ may support a draft;
anything unsupported, unsafe, stale, or action-seeking stops for a person.

## Run it locally

Requires Node.js 20 or later. There are no third-party dependencies, install
step, environment variables, credentials, network calls, model calls, or
external actions.

```powershell
# From the extracted folder that contains this README
npm test
npm run demo
```

`npm test` checks the supported route, missing support, instruction override,
expired source, requested action, deterministic-template failure, invalid
fixture, and the local-only boundary. `npm run demo` prints the fixed synthetic
routes. It writes no files and contacts nothing.

## What the fixture demonstrates

| Situation | Local result | Human next step |
| --- | --- | --- |
| A current approved synthetic FAQ supports the question | A cited draft | Approve, reject, or rewrite it manually. |
| No current approved source supports the question | Handoff, no draft | Resolve the gap through the existing manual process. |
| The question tries to override instructions | Handoff before retrieval | Review the unsafe request manually. |
| The request asks for a refund, message, ticket, or other outside action | Blocked, no retrieval | Keep the action in the existing manual process. |

The draft is created by a deterministic local template. It is not an LLM
response. The trace stores a request fingerprint rather than the raw synthetic
question.

## What to show in a portfolio review

- A business decision written in plain language: prepare a draft, never make
  the final support decision.
- A technical boundary: only current, approved synthetic FAQ records can be
  cited; an action request is blocked before retrieval.
- An operational boundary: every route still names a human next step.
- Repeatable evidence: fixed tests and a demo report cover both the happy path
  and the stop paths.
- A measurement definition that is not mistaken for a result. A future,
  separately authorised pilot could measure reviewer-approved,
  source-supported draft rate against a pre-defined manual baseline. This
  fixture measures none of that.

Read [the decision brief](docs/decision-brief.md) before adapting the exercise,
then use [the evaluation and adaptation notes](docs/evaluation-and-adaptation.md)
to keep local checks separate from a future real-world proposal.

## Package map

```text
data/       Invented FAQ snapshot and fixed request fixtures
src/        Validation, safety routing, retrieval, draft construction, and contracts
tests/      Node built-in test suite
scripts/    Repeatable local demo
docs/       Business decision, measurement boundary, and adaptation notes
```

## Scope boundary and non-claims

- All `SYN-*` records are fictional and checked in for this exercise only.
- The only output is a draft for human inspection. The package cannot send a
  message, create a ticket, read an account, issue a refund, update a record,
  or call a model.
- A local test pass says only that this fixed synthetic exercise is repeatable.
  It does not prove answer quality, safety performance, review-time savings,
  business impact, data permissions, privacy approval, security approval,
  production readiness, or suitability for live data.
- Do not replace the fixture with real material until an authorised owner has
  separately established data permissions, privacy and security review, a
  human reviewer path, a manual baseline, metric definitions, monitoring, and
  a release decision.
