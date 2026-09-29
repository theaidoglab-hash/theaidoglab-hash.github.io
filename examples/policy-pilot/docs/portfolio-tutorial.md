# Tutorial: turn a small AI demo into portfolio evidence

> **Scope:** this tutorial uses PolicyPilot's fictional data and local implementation. Follow the workflow with your own lawful, de-identified material only after deciding what you are authorised to share. It does not teach deployment, external integrations, payment flows, or live model use.

## What this tutorial teaches

An interview-ready AI portfolio is not “I called a model and got a good answer.” It is a compact evidence package that answers two different questions:

| Technical question | Delivery and business question |
| --- | --- |
| How does the system decide, retrieve, constrain, test, trace, and fail safely? | Which human work decision improves, who owns the decision, which data is allowed, what does success mean, and when must the work stop? |

PolicyPilot is intentionally small so both answers fit in one repository. It never claims a real client, deployment, business metric, or model result.

## Step 1: start with a human decision

Write one sentence in this form:

> A fictional **[role]** decides whether **[a request]** can receive **[a bounded draft or queue position]** from **[allowed evidence]**, otherwise the case goes to **[human handoff owner]**.

For PolicyPilot:

> A fictional retail-support reviewer decides whether a policy question can receive a cited draft from current approved synthetic policy records, otherwise it goes to human review.

This prevents a common portfolio failure: beginning with “I built a RAG chatbot” without knowing what a correct result changes. Define a non-goal beside it. Here the non-goal is any refund, account, order, payment, message, ticket, or other external action.

**Technical evidence:** an `ACTION_CONTRACT` with zero allowed actions.

**Non-technical evidence:** a named final decision owner and an explicit handoff path.

## Step 2: write the data contract before a prompt or model

Read [`data-contract.md`](data-contract.md). For your own project, complete these questions before adding retrieval or an API:

1. What is the smallest allowed record?
2. Which fields make a record valid at the time of the decision?
3. Which values are synthetic, public, authorised, sensitive, prohibited, or unknown?
4. What is the source/version owner?
5. What must never appear in a test case, trace, README, or public repository?

PolicyPilot uses policy ID, version, approval status, effective dates, and a synthetic source note. Those fields are not decoration: they are why the system can decline to cite an expired or unapproved record.

**Technical evidence:** versioned fields and a source-eligibility function.

**Non-technical evidence:** a data-rights boundary that is honest about what the code does not enforce.

## Step 3: build a transparent baseline

Implement the simplest method that can express the decision and fail visibly. PolicyPilot uses keyword overlap over a small synthetic corpus. It is not presented as a high-quality retrieval system.

Why start here?

- A reviewer can reproduce it without a credential or a model account.
- You can see whether a failure comes from source eligibility, retrieval, routing, or an action boundary.
- A later model experiment has something concrete to compare against.

Do not add vector search, an agent loop, a UI, or a model because those tools look impressive. Add a component only when a named test or business constraint exposes a limitation in the baseline.

## Step 4: define a result contract and negative routes

An answer-shaped JSON object is not automatically a good result. Decide what must be observable:

| Result component | PolicyPilot contract | Why a reviewer cares |
| --- | --- | --- |
| Route | `answer_with_citation` or `handoff` | The system has a visible stop state |
| Evidence | Policy ID and version for a supported draft | A person can inspect the source used |
| Action | Always `kind: "none"` | A draft cannot silently become an external action |
| Trace | Version, route, candidates, citation references, and a query fingerprint | A failure can be investigated without keeping the raw question |
| Boundary note | Synthetic/read-only/human-review context | The output is not confused with a real support decision |

Negative routes are part of the product. Include at least one unsupported request, stale source, request for an external action, and instruction-override attempt before you show a happy path.

## Step 5: make evaluation an artifact, not a screenshot

PolicyPilot's [`../src/evaluation-cases.mjs`](../src/evaluation-cases.mjs) declares expected route, reason code, and citation reference before evaluation. [`../src/evaluate.mjs`](../src/evaluate.mjs) turns those expectations into hard gates.

Run:

```powershell
npm test
npm run demo
```

For your own project, create a small table before implementation:

| Case type | Expected decision | Evidence to inspect |
| --- | --- | --- |
| Supported | Bounded draft | Current source and required fields |
| Unsupported | Handoff | No invented citation |
| Stale/conflicting | Handoff | Source version/date handling |
| Unsafe action | Handoff | Action contract remains empty |
| Injection or prohibited content | Handoff | Safety boundary runs before an answer |

If a candidate looks good on an aggregate score but fails an unsafe-action case, treat it as a release stop, not an average to celebrate.

## Step 6: use Promptfoo only where it adds evaluation value

This repository contains two evaluation configurations:

- [`../evals/promptfoo.fixture.yaml`](../evals/promptfoo.fixture.yaml) exercises the local deterministic provider and needs no credential or network. It is a learning scaffold for test definitions, not a model result.
- [`../evals/promptfoo.responses.optional.yaml`](../evals/promptfoo.responses.optional.yaml) shows how a separately approved `gpt-5-mini` Responses experiment could use the same decision boundary, test categories, `store: false`, and response schema.

Neither is run by `npm test`, `npm run demo`, or CI. This distinction matters: adding a tool configuration is not the same as measuring a model. Read [`evaluation-release-monitoring.md`](evaluation-release-monitoring.md) before deciding whether a live experiment is justified.

## Step 7: write a release and monitoring boundary before you need it

Most early portfolios claim “MLOps” by drawing a pipeline. Stronger evidence names the actual decision and the missing evidence:

| Question | Portfolio-ready answer in this reference |
| --- | --- |
| What allows a local demo? | Fixed synthetic tests and report pass; no real data or external action has been added |
| What blocks progress? | A failed hard gate, uncertain data ownership, real/private material, or a proposed external integration |
| Who owns an exception? | A human reviewer; the code never decides an exception |
| What would be monitored later? | Aggregate route changes, source-validity failures, safety-block categories, reviewer reasons, and corpus-version uptake |
| What is rollback? | Disable the assisted path, use manual review, revert to a versioned known-good package, and rerun evaluation |

These are design commitments, not claims that a production monitoring system exists. Use the full [evaluation, release, and monitoring plan](evaluation-release-monitoring.md) as a template.

## Step 8: package the evidence for GitHub

Your README should let a reviewer answer these in five minutes:

1. What fictional or authorised work decision is the project about?
2. What code can I run locally, and what does a PASS actually prove?
3. What data is included, and what data is excluded?
4. How are a failure, a handoff, and an unsafe action handled?
5. Which technical techniques are demonstrated?
6. Which non-technical delivery/risk choices are demonstrated?
7. What is still not built, measured, connected, or claimed?

PolicyPilot's repository map, test commands, CI workflow, data contract, and explicit non-claims make those answers inspectable. Add a website link only after the repository itself has passed a privacy, ownership, and release-authority review.

## Suggested two-minute walkthrough

1. State the fictional decision, final human owner, and non-goal.
2. Show one approved synthetic policy record and explain why status, dates, and version matter.
3. Run the normal case, then the stale or action-seeking case.
4. Point to the test hard gates and explain what they do not prove.
5. Show the Promptfoo fixture and optional model configuration as an evaluation design, not a live result.
6. Finish with the release/monitoring boundary and the next work required for a real service.

The goal is not to sound enterprise-ready. The goal is to demonstrate that you can make a small system inspectable, honest, and connected to the work it would need to support.
