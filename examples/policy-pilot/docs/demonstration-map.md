# PolicyPilot demonstration map

## Portfolio purpose and evidence boundary

PolicyPilot is a local, synthetic learning reference for demonstrating how an AI-adjacent workflow can be designed as a bounded business decision rather than a generic chat interface. A reviewer should be able to inspect the code, run the tests, trace each route, and see the limits of the evidence.

The repository uses only fictional policy records and local deterministic logic. It does not connect to a model, an API, a database, an account, an order system, payment system, or customer-support channel.

## Business problem being demonstrated

**Fictional operating situation:** a retail-support team needs a draft answer to a policy question. A useful draft must cite a currently effective, approved policy record. If the source is missing, superseded, unapproved, ambiguous, or the request asks the system to take an external action, the safe result is a human handoff rather than a confident answer.

**Business decision:** “Can a support agent receive a cited draft from approved current policy evidence, or must this case be reviewed by a person?”

This is deliberately narrower than “build a customer-service bot.” The narrowed decision gives the work a testable purpose, an explicit stop condition, and a way to assess failure without inventing a business metric.

## Technical evidence map

| Technical concern | Inspectable implementation | Why it matters in a portfolio |
| --- | --- | --- |
| Data boundary | [`src/synthetic-corpus.mjs`](../src/synthetic-corpus.mjs) and the [synthetic data contract](data-contract.md) define fictional records with IDs, versions, status, effective dates, allowed fields, and prohibited inputs. | Shows that a demo can be reproducible without exposing employer, customer, or private data. |
| Baseline before model choice | [`src/policy-pilot.mjs`](../src/policy-pilot.mjs) uses a deterministic keyword score. | Establishes a simple, debuggable baseline instead of attributing every behaviour to an opaque model. |
| Source governance | `isCurrentApprovedPolicy` filters by approval state and fixed `asOf` date before a citation is allowed. | Demonstrates that retrieval quality is not enough when a decision depends on policy validity. |
| Evidence in the output | Every answer route includes a policy ID, version, title, excerpt, and source note. | Lets a reviewer see what supported the draft and reproduce the route. |
| Control flow | Unsupported, stale, unapproved, read-only, and injection cases return `handoff`. | Shows that refusal and escalation paths are first-class product behaviour. |
| Action authority | `ACTION_CONTRACT` has no allowed actions and returns `action.kind === "none"`. | Separates an answer draft from an action that could affect a customer or system. |
| Privacy-aware observability | The trace stores a SHA-256 query fingerprint and metadata, never the raw query. | Shows a concrete privacy trade-off rather than logging everything by default. |
| Evaluation | [`src/evaluation-cases.mjs`](../src/evaluation-cases.mjs), [`src/evaluate.mjs`](../src/evaluate.mjs), and [`test/policy-pilot.test.mjs`](../test/policy-pilot.test.mjs) provide fixed cases and hard gates. | Gives a reviewer executable evidence rather than screenshots or a one-off happy path. |
| Evaluation design beyond code | [`evals/promptfoo.fixture.yaml`](../evals/promptfoo.fixture.yaml) and [`evals/promptfoo.responses.optional.yaml`](../evals/promptfoo.responses.optional.yaml) make fixture and model-experiment cases inspectable without running a live provider. | Separates a reproducible local test from an unexecuted model-evaluation proposal. |
| Optional model seam | [`src/responses-api-fixture.mjs`](../src/responses-api-fixture.mjs) is a frozen, non-executing `gpt-5-mini` Responses API request-shape fixture. | Demonstrates where a model experiment belongs while keeping the evaluated baseline reproducible and credential-free. |
| Repeatability | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs the same test and demo commands on pushes and pull requests. | Makes the verification path visible to collaborators and reviewers. |

## Non-technical delivery, risk, and business evidence map

| Delivery concern | Evidence in this repository | What a reviewer should notice |
| --- | --- | --- |
| Problem framing | The decision is limited to a cited policy draft or human handoff. | The project starts from a work decision, not a technology showcase. |
| Scope control | The repository is synthetic, local-only, and read-only. | Scope is small enough to verify; it does not pretend to replace a support team. |
| Risk ownership | Safety blocks and the action contract force a handoff before any hypothetical external action. | Someone remains accountable for exceptions, ambiguous policy, and customer-facing decisions. |
| Acceptance criteria | Fixed cases state expected routes, reason codes, citation references, and no-action behaviour. | “Works” has observable conditions, including negative cases. |
| Trust and explainability | Cited policy metadata and trace IDs explain why a route occurred. | A human can inspect the decision path without accepting an unsupported answer. |
| Privacy posture | Only synthetic policy text is shipped; traces exclude raw user questions. | The portfolio is safe to share while still making its design trade-offs visible. |
| Release discipline | CI executes tests and demo; the [evaluation, release, and monitoring plan](evaluation-release-monitoring.md) identifies the difference between local evidence, a human release decision, and future operating controls. | Passing tests are not represented as approval, launch, or operational evidence. |
| Ownership and legal boundary | The README requires a separate ownership, third-party-material, employer-obligation, and release-authority check before publishing a fork. | An MIT file is not a substitute for confirming the right to publish real work. |

## End-to-end workflow

```text
1. State the fictional business decision and read-only boundary.
2. Author versioned synthetic policy fixtures, including stale and draft records, under the [data contract](data-contract.md).
3. Write fixed positive and negative acceptance cases before changing the route logic.
4. Run the deterministic baseline against the synthetic corpus.
5. Reject unsafe input before retrieval; filter sources by approval and effective date.
6. Produce either a cited draft or a human handoff, always with no external action.
7. Record a privacy-minimised trace and evaluate the fixed cases.
8. Record the local release decision, future monitoring questions, and rollback boundary; run the same checks through CI when the repository changes.
```

This workflow intentionally puts source eligibility and failure handling before answer fluency. That sequence is useful portfolio evidence because it makes the trade-off inspectable: a lower-coverage system can be safer and more credible when it only drafts answers backed by current approved evidence.

## Test evidence

Run the following from the repository root:

```powershell
npm test
npm run demo
```

The test suite checks all of the following:

| Fixed scenario or assertion | Expected evidence |
| --- | --- |
| Current approved return question | `answer_with_citation` with `RET-100 v2` |
| Unsupported custom engraving question | `handoff` with no citation |
| Request for a 2025 policy | `handoff` because the matching source is superseded |
| Refund request | `handoff` at the read-only boundary before retrieval |
| Policy-override injection | `handoff` at the safety boundary before retrieval |
| Every route | `action.kind === "none"`, human review remains required, and the raw query is absent from the trace |
| Evaluation report | Route, citation, no-action, and trace-privacy hard gates must all pass |
| Model fixture | The fixture is frozen, names `gpt-5-mini`, labels itself mock-only, and contains neither a credential label nor a key-shaped value |
| Promptfoo fixture provider | The local provider returns the deterministic route only and reports no-network/no-credential mode |

The demo report is intentionally a detailed local artifact. It is a better interview discussion aid than a polished screenshot because it exposes the policy version, route, candidates, rejected sources, and hard gates.

## Optional GPT-5 mini Responses API fixture

The fixture contains a static request shape only. It references `POST /v1/responses`, `model: "gpt-5-mini"`, `instructions`, `input`, and `store: false`, fields described by official OpenAI documentation: [GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini) and [Create a model response](https://developers.openai.com/api/reference/cli/resources/responses/methods/create).

The reusable [optional Responses API demo contract](optional-responses-demo-contract.md)
defines the local request-shape, test, evaluation, and delivery boundaries shared
by this kind of portfolio demonstration.

It must remain disconnected from the executable baseline. It does not:

- import an SDK;
- read an environment variable;
- contain an API key or an authorization header;
- call a network function;
- invoke a model or create an output; or
- establish an API account, access, data-retention configuration, cost, latency, quality, or safety result.

If a separate future experiment uses a live model, its evaluation plan should compare against this deterministic baseline using authorised data, fixed test cases, explicit human-review paths, and a documented release decision. [`evaluation-release-monitoring.md`](evaluation-release-monitoring.md) explains the proposed gates and the optional Promptfoo configurations. That future work would be a new evidence package, not an implication of this repository.

## Explicit non-claims

This repository does **not** claim any of the following:

- a real organisation, policy corpus, customer, order, account, payment, or support channel;
- access to production, private, or personal data;
- a live OpenAI API call, key, SDK integration, model output, or model evaluation;
- retrieval, RAG, semantic-search, hallucination, safety, privacy, or security performance beyond the fixed local synthetic checks;
- production reliability, compliance, legal review, monitoring, incident response, or operational approval;
- a user, revenue, conversion, cost, service-level, accuracy, or business-impact result; or
- a job offer, job readiness certification, client outcome, or guarantee.

## How to discuss this in an interview

Use the repository to explain a sequence of decisions, not to claim a finished enterprise product:

1. Start with the narrow business decision and why a generic chatbot would be insufficient.
2. Show the synthetic corpus, source-validity checks, action contract, and a negative case.
3. Run the tests or demo and explain what each hard gate proves.
4. Name the next real-world work explicitly: authorised data, policy ownership, evaluation coverage, model experiment design, privacy/security review, human operations, monitoring, and release approval.

That distinction is what keeps a portfolio project from becoming AI slop: the demonstration makes its decision, evidence, limits, and unfinished work visible.
