# Portfolio Proof Pack

Use this as a portable, local-first scaffold for one portfolio project. It is a template, not a claim that a system is live, deployed, or useful to a real business.

Keep the source code and filenames in English so a reviewer can navigate it. You may write a translated README for readers. Use only synthetic, public, or explicitly authorised material. Never commit secrets, customer data, private prompts, internal screenshots, or a made-up repository URL.

## Suggested folder layout

```
README.md
docs/
  brief.md
  source-and-data-receipt.md
  baseline-and-change.md
  contribution.md
  five-minute-defence.md
  release-and-privacy-check.md
eval/
  evaluation-plan.md
  results-and-failure-log.md
```

Copy the sections below into those files. Delete unused prompts only after recording why they do not apply.

## README.md

# [Project name]

## One-sentence decision

[Named human role] uses this project only to decide [small, reviewable question]. The project does not [prohibited action or neighbouring business decision].

## What a reviewer can inspect

- Problem brief: docs/brief.md
- Data receipt and boundary: docs/source-and-data-receipt.md
- Baseline and candidate change: docs/baseline-and-change.md
- Evaluation plan: eval/evaluation-plan.md
- Results and failures: eval/results-and-failure-log.md
- My contribution: docs/contribution.md
- Five-minute defence: docs/five-minute-defence.md
- Release and privacy check: docs/release-and-privacy-check.md

## Local status

This package is local and fixture-first. [State exactly what was run locally.] It has no public repository until an owner publishes and reviews one. Do not replace this sentence with an invented GitHub link.

## Non-claims

- A local test pass does not prove business impact, production readiness, security approval, or user adoption.
- Synthetic fixtures do not describe a real customer, employer, market, or system.
- [Add the most tempting unsupported claim for this project.]

## docs/brief.md

# Brief

## Decision and owner

- Human owner: [role, not a person's name]
- Decision supported: [one decision]
- Decision deadline or cadence: [for example: weekly review]
- What remains human-only: [approval, sending, pricing, eligibility, security response, etc.]

## User and cost of error

- Primary user: [role]
- Current workaround: [manual rule, spreadsheet, search, queue, or no action]
- Error that matters: [wrong priority, unsafe draft, wasted review capacity, misleading context]
- Reversible scope: [what can be held, retried, or rolled back]

## In scope

- [Input]
- [Output]
- [Human review point]

## Out of scope

- [External action the project cannot take]
- [Decision it cannot make]
- [Claim it cannot make]

## Acceptance and stop conditions

- Pass only when: [fixed observable condition]
- Hold when: [missing source, unsafe output, stale data, cost threshold, or no owner]
- Roll back to: [baseline/manual route]

## docs/source-and-data-receipt.md

# Source and data receipt

## Material used

| Item | Source or fixture | Permission / terms | Retrieved or created | Version / date | Contains personal or confidential data? |
| --- | --- | --- | --- | --- | --- |
| [item] | [public URL, synthetic fixture, or authorised source] | [licence / approval / not applicable] | [how it entered the project] | [version] | [yes/no and boundary] |

## Data contract

- Required fields: [fields and units]
- Time boundary: [as-of date or point-in-time rule]
- Freshness rule: [how stale material is rejected]
- Allowed use: [what the material may support]
- Prohibited use: [what it must not support]

## Receipt decision

- READY / REJECTED / UNKNOWN: [one]
- Reason: [specific evidence]
- Human owner for exceptions: [role]

## docs/baseline-and-change.md

# Baseline and candidate change

## Baseline

- Baseline method: [manual rule, keyword retrieval, deterministic validation, previous model, or queue order]
- Baseline input version: [fixture or public-data version]
- Baseline result: [measured result or "not measured yet"]
- Why the baseline is an honest comparison: [same cases, same capacity, same time boundary]

## Candidate change

- One change: [prompt, model, feature, threshold, schema, retry policy, or ranking method]
- Hypothesis: [what should improve and what must not degrade]
- Fixed comparison context: [case set, capacity, source version, and owner]
- Rollback target: [baseline version]

## Decision

- KEEP / HOLD / REVERT: [one]
- Evidence: [link to result rows or case IDs]
- Human approver: [role]

## eval/evaluation-plan.md

# Evaluation plan

Choose the narrowest method that tests the output contract. Do not add an LLM evaluation merely to signal sophistication.

## A. Deterministic contract

Use this when validation, retrieval, queueing, ranking, schema handling, permissions, or prohibited actions can be checked with fixed rules.

- Contract: [required output and forbidden output]
- Fixed cases: [normal, missing, malformed, stale, duplicate, unsafe]
- Measures: [pass rate, rejection correctness, queue coverage, latency/cost proxy]
- Release gate: [minimum pass and any hard failure]
- Evidence location: [test command and results file]

## B. Bounded LLM output with Promptfoo

Use this only when generated language or structured model output is inside a bounded contract. Keep the deterministic core and action boundary separately tested.

- Model seam: [for example: optional static gpt-5-mini Responses request fixture]
- No-key default: [yes/no; explain]
- Promptfoo case matrix: [case IDs and expected properties]
- Assertions: [schema, citation, refusal, no prohibited action, regression delta]
- Human review: [what a human still judges]
- Evidence Delta: [how a prompt/model/config change is compared with the baseline]

## C. Predictive model or review queue

Use this for a scored or ranked queue, not an autonomous customer or business decision.

- Point-in-time rule: [how future information is excluded]
- Baseline and candidate: [methods]
- Capacity: [fixed number of human reviews]
- Measures: [model, queue, and workflow-proxy metrics kept separate]
- Leakage checks: [tests]
- Monitoring and rollback: [signals, owner, and baseline route]

## Selected evaluation

- Choice: [A / B / C]
- Why it matches the decision: [short explanation]
- Why the other options are unnecessary or unsafe: [short explanation]

## eval/results-and-failure-log.md

# Results and failure log

## Run receipt

- Run ID: [local identifier]
- Date: [date]
- Input / fixture version: [version]
- Baseline version: [version]
- Candidate version: [version]
- Command or repeatable steps: [command]
- Environment boundary: local fixture-only / public-data-only / other approved boundary

## Result summary

| Measure | Baseline | Candidate | Gate | Outcome |
| --- | --- | --- | --- | --- |
| [measure] | [value] | [value] | [threshold] | PASS / HOLD / REVERT |

## Failure log

| Case ID | What failed or was rejected | Expected safe behaviour | Actual behaviour | Disposition | Owner |
| --- | --- | --- | --- | --- | --- |
| [case] | [failure] | [expected] | [actual] | [fix / hold / accepted boundary] | [role] |

## Honest reading

- What the result supports: [local contract claim only]
- What it does not support: [business, security, production, or outcome claim]
- Next reversible action: [fix a case, keep baseline, request lawful data access, or stop]

## docs/contribution.md

# Contribution

## I designed or implemented

- [Specific artefact: contract, fixture, test, baseline, pipeline step, dashboard, trace, documentation]

## I adapted with attribution

- [Public tool, library, dataset, or documentation and what was changed]

## I did not build

- [Model, hosted service, public dataset, framework, or starter component]

## Review questions I can answer

- Why this decision and not a larger automation?
- What is the baseline?
- What happens on the highest-risk failure?
- Which evidence is synthetic, public, or authorised?

## docs/five-minute-defence.md

# Five-minute defence

## 0:00–0:45 — problem

[Describe the human decision, user, cost of error, and non-goal.]

## 0:45–1:45 — inputs and baseline

[Show the source receipt, data boundary, and baseline.]

## 1:45–3:00 — change and evaluation

[Show one candidate change, fixed cases, and the selected evaluation method.]

## 3:00–4:00 — failure and operations

[Show a real rejected case, human handoff, monitoring signal, and rollback.]

## 4:00–5:00 — honest conclusion

[State what the package proves locally, what it cannot claim, and the next reversible step.]

## docs/release-and-privacy-check.md

# Release and privacy check

Mark every item before sharing a repository, video, or PDF.

- [ ] No secrets, API keys, tokens, credentials, internal URLs, private prompts, or proprietary code.
- [ ] No customer, employee, candidate, employer, health, financial, or other personal/confidential data.
- [ ] Every dataset or fixture is synthetic, public under recorded terms, or explicitly authorised for this use.
- [ ] Screenshots, traces, and logs are redacted and do not reveal identities or internal systems.
- [ ] The README states local/fixture status and does not claim deployment, impact, approval, or adoption without evidence.
- [ ] External actions remain disabled or explicitly out of scope.
- [ ] A human owner, stop condition, and rollback route are visible.
- [ ] If no repository is public, the site says so plainly instead of inventing a GitHub URL.

## Before publishing

STOP and get the relevant owner or legal/security review if any item is uncertain. A portfolio package should demonstrate judgment, not bypass a boundary.
