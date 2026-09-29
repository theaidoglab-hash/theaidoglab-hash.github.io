# Demonstration Map

## Scope

This is a small, local, synthetic, read-only reference. Its purpose is to make
an approval workflow inspectable in a portfolio review. It does not connect to
an external service or operate on real data.

## Business problem and value demonstrated

Operations teams often receive repetitive FAQ questions, but an answer can be
wrong, unsupported, outdated, unsafe, or inappropriate for the requester. The
business problem demonstrated here is not "generate text". It is how to create
a reviewable, evidence-linked FAQ draft while preserving a human decision point.

The value demonstrated is a narrower and more defensible workflow:

1. A supported question can receive a cited draft for review.
2. An unsupported question is handed off instead of guessed.
3. An action request is blocked before retrieval or drafting.
4. A reviewer can see the route, reason code, citation, and a privacy-preserving trace.

## Technical things demonstrated

| Capability | Evidence | What the code does |
| --- | --- | --- |
| Input contract | `src/contracts.mjs` | Rejects missing or invalid synthetic requests and defines a read-only action contract. |
| Current-source control | `src/retrieval.mjs`, `data/synthetic-faq.mjs` | Selects only FAQ entries that are both `approved` and current for the supplied date. |
| Deterministic retrieval | `src/retrieval.mjs` | Uses transparent keyword overlap and stable tie-breaking rather than opaque ranking. |
| Safety routing | `src/safety.mjs` | Identifies requested external actions, embedded action language, and common instruction-override patterns. |
| Fail-closed behavior | `src/approval-queue.mjs` | Returns `handoff` when source support is absent or the deterministic mock fails. |
| Local draft generation | `src/mock-response.mjs` | Builds a deterministic, cited draft with `network: "disabled"` and `apiCallMade: false`. |
| Optional model seam | `data/responses-api-gpt-5-mini.fixture.json` | Keeps a static `POST /v1/responses`, `gpt-5-mini`, `store: false` request shape separate from the local runtime. |
| Decision receipt | `src/decision-contract.mjs`, `src/approval-queue.mjs` | Adds a versioned source receipt, guardrail checks, a future measurement definition, and a route-specific human next step without storing the raw question. |
| Data minimization in traces | `src/approval-queue.mjs` | Stores a truncated SHA-256 question fingerprint rather than the raw question. |
| Regression coverage | `test/approval-queue.test.mjs` | Exercises normal, unsupported, injection, failure, and action-request routes. |
| Repeatable verification | `.github/workflows/ci.yml` | Runs the test suite and demo on Node.js 20. |

## Non-technical business, delivery, and risk things demonstrated

| Area | Demonstration | Boundary |
| --- | --- | --- |
| Decision ownership | A human reviewer is required on every route. | The code does not replace a policy owner or reviewer. |
| Scope control | The allowed action list is empty. | It cannot execute a real refund, message, ticket, or account update. |
| Evidence discipline | Each successful draft identifies its FAQ ID and version. | Citation is not proof that a real policy is correct. |
| Exception handling | Unsupported, unsafe, invalid, and failed cases stop for handoff. | No real escalation channel or operating team is configured. |
| Privacy posture | The local trace excludes the raw question. | This is a design example, not a complete privacy program. |
| Business measurement discipline | The decision contract defines a future reviewer-approved, source-supported draft measure and labels it `not_measured_in_this_fixture`. | It does not claim a quality, time, cost, or customer result. |
| Delivery readiness | Commands and CI make local verification repeatable; the [evaluation, release, and monitoring plan](evaluation-release-monitoring.md) defines a fixture-only future-pilot checklist. | There is no deployment, release approval, monitoring, or incident process. |

## End-to-end workflow

```text
Synthetic request
       |
       v
Input validation
       |
       +-- invalid --> human handoff
       |
       v
Safety classification
       |
       +-- action request --> blocked, no retrieval, no action
       +-- instruction override --> human handoff
       |
       v
Current approved FAQ retrieval
       |
       +-- no support --> human handoff
       |
       v
Deterministic local cited draft
       |
       +-- mock failure --> human handoff
       |
       v
Human approval required; no external action is available
```

## Test evidence

Run the following commands from the repository root:

```powershell
npm test
npm run demo
```

The test suite contains nine deterministic, synthetic regression checks:

| Check | Expected evidence |
| --- | --- |
| Read-only contract | `allowedActions` is empty and `issue_refund` is prohibited. |
| Supported FAQ | A current, approved source produces a cited draft requiring human approval. |
| Unsupported FAQ | No draft is returned; the result is `handoff`. |
| Prompt injection | The result is `handoff` before retrieval. |
| Mock failure | The result fails closed to `handoff`. |
| External action request | The result is `blocked` before retrieval or execution. |
| Expired source | A formerly supported synthetic FAQ becomes `handoff` after its effective date. |
| Decision receipt | The source receipt, non-measurement status, guardrails, and production nonclaim remain visible. |
| Responses fixture boundary | The optional `gpt-5-mini` request fixture is complete, key-free, offline, and never read by the runtime. |

The demo prints four synthetic route decisions: a supported FAQ, an unsupported
question, an instruction override, and a forbidden action request. These are
implementation checks, not production measurements.

The [decision contract and receipt](decision-contract.md) and the
[evaluation, release, and monitoring plan](evaluation-release-monitoring.md)
separate this fixture-only verification from future human ownership, pilot
measurement, monitoring, and rollback requirements.

## Explicit nonclaims

This repository does not claim any of the following:

- It does not make a live OpenAI Responses API call or call any other model or external API.
- It does not use real customer information, real FAQ policies, real accounts, or real transactions.
- It does not send messages, create tickets, issue refunds, inspect accounts, or update records.
- It does not demonstrate production security, privacy compliance, access control, monitoring, auditing, incident response, or deployment readiness.
- It does not prove answer quality, model quality, retrieval quality, safety performance, cost, time savings, revenue, or customer outcomes.
- It does not establish permission to use `gpt-5-mini`, compatibility with the Responses API, or approval for a future integration.

`data/responses-api-gpt-5-mini.fixture.json` is a non-executing request-shaped
fixture. It specifies `POST /v1/responses`, `gpt-5-mini`, and `store: false`,
has no credential, is never imported or sent, sets `network` to `disabled`, and
is not used by the runtime workflow. The package-local
[optional Responses API demo boundary](optional-responses-demo-contract.md)
defines the same boundary for a future model experiment.
