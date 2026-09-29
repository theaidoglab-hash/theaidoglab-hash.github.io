# Source ledger: non-coder AI-agent permission review

Status: internal research note for a review-stage public article. Checked 2026-09-25.

## Editorial decision

This is an independently authored, tool-neutral rehearsal for deciding whether a bounded AI-agent request should proceed. It is not a product comparison, configuration guide, security certification, job-search automation recipe, or a claim that different products expose identical controls. The fictional `Harbour Path` scenario, permission receipt, fixed cases, routes, and portfolio structure are AI.DOG teaching material.

Primary lenses: systems trade-offs, human approval, and reusable decision patterns.

## Sources and limited claims

| Official source | Claim used in the article | Boundary kept in the article |
| --- | --- | --- |
| https://learn.chatgpt.com/docs/agent-approvals-security | Codex documents sandbox mode as the technical boundary for what it can do and approval policy as when it must ask. The documented defaults and available settings can differ by environment; read-only and workspace-write are distinct modes. | The article does not say Codex is safe in every configuration, instruct readers to change settings, or imply that a sandbox substitutes for a human decision. |
| https://docs.x.ai/grok-bot/approvals-security-and-privacy | Grok Bot documentation tells users to inspect a proposed operation and its inputs, including target, scope, and values, and to ask for a plain-language explanation or draft if the target/effect is unclear. | This supports only the target/scope/effect review heuristic. The article does not claim Grok and Codex have the same approval model, product controls, or behavior. |
| https://developers.openai.com/api/docs/guides/agent-evals | The official guide frames evaluation as a task with an expected result rather than a judgement based on one appealing output. | The fixed `DRAFT`, `HANDOFF`, and `BLOCKED` cases are AI.DOG exercises, not an OpenAI-provided evaluation suite or proof of a real-world system. |
| https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ | NIST's AI RMF describes documenting context, scope, human oversight, risk controls, and testing before deployment. | A small learner exercise is not organisational AI-RMF conformance, a security assessment, legal advice, or permission to use private data. |

## Claims intentionally excluded

- Current product prices, subscription tiers, availability, or feature parity.
- A claim that any AI tool is safe by default or that one approval setting is sufficient.
- A claim that a local rehearsal validates a connected account, workplace data, privacy compliance, business outcome, or job application.
- Any copied provider documentation, exercise, interface text, source code, or vendor-specific workflow.

## Review triggers

Recheck the official pages before approving/publicising this article and when its review date arrives. Revise or remove source-dependent wording when the provider changes its approval terminology, scope, sandbox model, or the cited guide is materially updated.
