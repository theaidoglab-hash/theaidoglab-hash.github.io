# Synthetic FAQ Approval Queue

[English](README.md) | [Traditional Chinese (Hong Kong)](README.zh-HK.md) | [Traditional Chinese (Taiwan)](README.zh-TW.md) | [Simplified Chinese](README.zh-Hans.md)

**Status: local portfolio reference, prepared for public source review.** This
is a fully local, read-only example. It uses fictional FAQ material and does
not connect to a model, API, network, customer account, payment system, email
service, or ticketing system. It cannot send a message, create a ticket, issue
a refund, or change any record.

This English README documents the reference implementation. The translated
READMEs describe the same local and non-production boundary.

## The business problem

An operations team may receive repetitive FAQ questions while still needing a
person to decide whether an answer is appropriate. A portfolio project is not
strong merely because it produces fluent text. It needs to make the business
decision, the permitted scope, failure paths, evidence, and human hand-off
visible.

This miniature queue demonstrates one narrow, reversible workflow:

1. Accept a synthetic FAQ question and an optional requested action.
2. Block requested external actions before retrieval.
3. Hand off prompt-injection attempts or unsupported questions.
4. Retrieve only a current, approved fictional FAQ entry.
5. Produce a deterministic draft with a visible citation.
6. Require human approval and record a privacy-preserving local trace.
7. Run fixed tests before changing the implementation.

The result is a **draft for review**, not a customer-facing response. Human
review is the final decision point in every route.

For a precise separation of technical evidence, business and delivery evidence,
test evidence, and nonclaims, see [the demonstration map](docs/demonstration-map.md).
For the fixture-only evaluation, future pilot decision, monitoring signals, and
rollback boundary, see the [evaluation, release, and monitoring plan](docs/evaluation-release-monitoring.md).
The executable [decision contract and receipt](docs/decision-contract.md) adds
the missing connection between a future business measure, release-blocking
guardrails, a synthetic data receipt, each human handoff, and local rollback.

## What makes this an end-to-end portfolio reference

| Layer | Evidence in this folder | Boundary |
| --- | --- | --- |
| Problem framing | The narrow FAQ-drafting workflow above | It makes no productivity, quality, or revenue claim. |
| Input contract | `src/contracts.mjs` | Inputs are synthetic and must be non-empty. |
| Knowledge source | `data/synthetic-faq.mjs` | Only fictional entries marked `approved` and current may be cited. |
| Safety routing | `src/safety.mjs` | Injection, unsupported questions, failures, and action requests stop automation. |
| Draft generation | `src/mock-response.mjs` | A deterministic local mock is not an LLM call. |
| Approval boundary | `src/approval-queue.mjs` | Every result has `action.kind: "none"` and needs a human reviewer. |
| Decision contract | `src/decision-contract.mjs` and each result's `decisionReceipt` | It records a future measurement definition and guardrails, not an observed business result. |
| Evaluation | `test/approval-queue.test.mjs` and [evaluation, release, and monitoring plan](docs/evaluation-release-monitoring.md) | Tests are tiny synthetic regression checks, not production metrics. |

## Run locally

Requires Node.js 20 or later. There are no third-party dependencies and no
environment variables.

```powershell
# From this repository's root
npm test
npm run demo
```

The demo prints synthetic route decisions, citations, the decision-contract
version, source receipt prefix, and next human step. It creates no files and
takes no external action. The GitHub Actions workflow runs the same test and
demo commands on Node.js 20.

## Routes and stop conditions

| Route | Trigger | Output |
| --- | --- | --- |
| `draft_for_human_approval` | A current, approved FAQ entry supports the question | Cited draft; human approval still required. |
| `handoff` | No supporting FAQ, prompt injection, invalid input, or mock failure | No draft is offered as an answer. |
| `blocked` | A requested or embedded action would change an outside system | No retrieval or action is attempted. |

The local action contract is intentionally strict: `allowedActions` is always
empty. This code-level boundary is educational evidence, not a guarantee for a
real system. A real deployment would need separate authorization, privacy,
security, monitoring, audit, incident-response, and release reviews.

## Non-executing Responses API request fixture

`data/responses-api-gpt-5-mini.fixture.json` shows the shape of an illustrative
Responses API request: `POST /v1/responses`, `model: "gpt-5-mini"`, and
`store: false`. It is deliberately a
**non-executing fixture**, not a live call:

- it contains no credential or secret;
- the runtime neither reads, imports, nor sends it; the regression test reads the static file only to assert that boundary;
- its `network` field is `disabled`;
- the implementation always uses `src/mock-response.mjs` instead.

It is included only so a reviewer can discuss how a future, separately approved
model integration might be specified. It does not prove API compatibility,
model quality, cost, or permission to connect a real system.

The package-local [optional Responses API demo boundary](docs/optional-responses-demo-contract.md)
keeps the fixture self-contained if this example is exported into its own
repository.

## How to discuss this in a portfolio review

Show the reviewer the failure paths before the happy path: unsupported FAQ,
instruction override, stale source, mock outage, and forbidden action. Show the
`decisionReceipt` next: it names the synthetic source snapshot, confirms that
no action ran, tells the reviewer what to do next, and labels the future
business measure as `not_measured_in_this_fixture`. Then identify the evidence
you would collect with an authorized, de-identified test set: answer support
rate, citation correctness, unsafe-route recall, reviewer overrides, and
time-to-review. Do not invent those measurements or claim a business outcome
until they have been measured in an approved setting.

## Deliberate limitations

- Retrieval is simple keyword overlap, not semantic search.
- The mock has no language understanding and is not a substitute for a model.
- The FAQ corpus, cases, and traces are fictional and local.
- No real customer data, policy, account, action, or API request is accepted.
- The project makes no productivity, quality, revenue, safety, or business-outcome claim.
- Tests are small synthetic regression checks, not production evaluation metrics.
- No deployment configuration is included.

This folder is intentionally isolated from the website runtime and deployment
configuration. `package.json` deliberately remains private to prevent accidental
npm registry publication; that setting does not determine GitHub repository visibility.

## License

Licensed under the [MIT License](LICENSE).
