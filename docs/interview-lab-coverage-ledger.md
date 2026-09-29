# Interview Lab coverage and provenance ledger

Status: `OWNER_REVIEW_REQUIRED`
Scope date: 2026-09-26
Audience: AI.DOG content owner and release reviewer only. This is not public-site copy, a licence conclusion, or release approval.

## Decision boundary

The Interview Lab is an AI.DOG learning product. Its source reference is used as a **topic-coverage checklist only**:

- Reference supplied for review: <https://github.com/amitshekhariitbhu/ai-engineering-interview-questions>
- Permitted use in this project: identify broad capability areas worth covering, then write new teaching questions, examples, explanations, evidence prompts, and failure boundaries.
- Not permitted: reproduce or lightly rewrite prompts, answers, company labels, diagrams, assets, repository structure, linked third-party material, or distinctive source wording.
- Not claimed: that all upstream material has been covered, that the source's ordering is retained, that any company asks these questions, or that the Lab predicts a live interview process.

A browser-level source summary check was performed on 2026-09-26 against the public default-branch page for the supplied interview-question repository. The page showed a public repository and an `Apache-2.0` licence badge. That is only a current-page signal: its exact revision, the current `LICENSE` text, contributor/copyright terms, and the terms for material it links to remain **unverified for release purposes**. A displayed badge is not a substitute for reading the licence at a pinned revision.

## Local evidence snapshot

The following was inspected in the local public-site checkout on the scope date:

| Local asset | What it establishes | What it does not establish |
| --- | --- | --- |
| `content/roadmaps/ai-engineer-interview-prep.json` | Fourteen AI.DOG preparation tracks, their evidence goals, and their local resource links. | That those tracks reproduce an upstream taxonomy or exhaust a field. |
| `lib/interview-lab.ts` and `content/interview-question-metadata.json` | 59 standalone AI.DOG practice questions and ten reader-facing capability routes. All 59 metadata records currently use `companyAttribution: "not-asserted"`. | Any company provenance, interview frequency, or hiring outcome. |
| `content/interview-practice-paths.json` | Guided practice paths, including one for readers who do not yet have a project. | Coverage of every possible project or role. |
| `scripts/validate-content.mjs` | Local structural checks for topic/resource links, question content, and company-attribution limits. | Copyright clearance, source accuracy, a live source check, or release approval. |

Track resource counts below count links, not unique questions: a deliberately reusable question may support more than one track. The current 14-track map links to 68 question placements across 59 unique question pages.

## Coverage crosswalk

The left column is a neutral checklist grouping for this ledger. It is **not** presented as the reference repository's exact heading, order, or wording. A row marked `CURATED_COVERAGE` means AI.DOG has an independently authored route around that broad capability; it does not mean one-to-one or complete upstream coverage.

| Checklist domain | Current AI.DOG route | Local evidence snapshot | Disposition and boundary |
| --- | --- | --- | --- |
| LLM concepts, context, tokens, and baselines | 01. Shared language and LLM foundations | 5 linked questions: `long-context-is-not-a-free-upgrade`, `temperature-is-not-a-reproducibility-contract`, `softmax-is-not-a-stability-plan`, `token-budget-is-not-a-language-test`, `a-baseline-is-not-a-benchmark-winner` | `CURATED_COVERAGE`; explains a system boundary rather than importing definitions or primers. |
| Prompt and context contracts | 02. Prompt and context design | 3 linked questions, including `prompt-contracts-need-an-acceptance-test` and `structured-output-is-not-a-grounding-check` | `CURATED_COVERAGE`; no provider-specific recipe or copied prompt library is claimed. |
| Retrieval and RAG | 03. Retrieval and RAG | 3 linked questions, including `rag-retrieval-generation-or-permission` and `conflicting-sources-need-an-owner` | `CURATED_COVERAGE`; separates retrieval, generation, citations, and permission rather than treating a fluent answer as proof. |
| Agents, tools, memory, and workflow control | 04. Agents, tools and workflows | 6 linked questions: `agent-draft-without-consequential-actions`, `an-agent-loop-needs-terminal-states`, `an-agent-eval-needs-a-route-verdict`, `tool-schema-is-not-least-privilege`, `mcp-discovery-is-not-an-approval-gate`, `memory-must-expire-before-it-becomes-policy` | `CURATED_COVERAGE`; focuses on contracts, owners, stop conditions, and checking the observed route rather than only a final draft; no source tool design is reproduced. |
| Adaptation, fine-tuning, labels, and training decisions | 05. Fine-tuning and model adaptation | 7 linked questions, including `fine-tune-or-fix-the-system`, `a-random-split-can-know-the-future`, and `a-fine-tune-win-can-still-fail-a-critical-slice` | `CURATED_COVERAGE`; deliberately frames training as a decision with data and evaluation gates. |
| Embeddings, ANN, and vector-index lifecycle | 06. Embeddings and vector search | 6 linked questions, including `high-similarity-is-not-relevance`, `ann-recall-needs-a-latency-budget`, and `a-document-deletion-needs-a-retrieval-receipt` | `CURATED_COVERAGE`; does not claim to be a full vector-database curriculum. |
| AI system design and business decision framing | 07. AI system design | 3 linked questions: `design-an-internal-policy-assistant`, `a-model-metric-is-not-a-business-metric`, `a-rollout-needs-a-safe-baseline` | `CURATED_COVERAGE`; evidence and non-goals take precedence over a company-style design-answer template. |
| Reliability, queues, retries, operations, and drift | 08. LLMOps and production reliability | 5 linked questions, including `a-retry-is-not-a-recovery-plan`, `a-queue-needs-a-dead-letter-path`, and `data-drift-is-not-just-a-retraining-trigger` | `CURATED_COVERAGE`; no claim of a production deployment or a complete operations manual. |
| Evaluation, testing, observability, and release decisions | 09. Evaluation, testing and observability | 7 linked questions, including `release-or-rollback-with-evidence`, `an-eval-score-needs-human-calibration`, `an-adversarial-matrix-needs-a-regression-contract`, `an-agent-eval-needs-a-route-verdict`, and `offline-score-and-human-workflow` | `CURATED_COVERAGE`; local fixtures and exercises are not live-traffic evidence. |
| Safety, privacy, permissions, and responsible AI | 10. Safety, privacy and responsible AI | 5 linked questions: `treat-untrusted-documents-as-data`, `masking-prevents-a-leak-not-a-bad-decision`, `tool-schema-is-not-least-privilege`, `mcp-discovery-is-not-an-approval-gate`, `memory-must-expire-before-it-becomes-policy` | `CURATED_COVERAGE`; it does not constitute legal, security, or compliance certification. |
| Multimodal, speech, vision, OCR, and input quality | 11. Multimodal, speech and vision | 5 linked questions, including `voice-latency-is-a-system-budget`, `ocr-text-is-still-untrusted-input`, and `a-visual-claim-needs-a-region-and-an-abstention` | `CURATED_COVERAGE`; narrow review prompts, not a claim to cover every modality or benchmark. |
| Serving, inference, capacity, cost, and scale | 12. Infrastructure, serving and scale | 6 linked questions, including `trace-p99-latency-before-adding-gpus`, `model-routing-needs-a-fallback`, and `kv-cache-needs-a-capacity-contract` | `CURATED_COVERAGE`; explains decision trade-offs without copying infrastructure diagrams or configurations. |
| Coding, data structures, and implementation proof | 13. Coding and practical implementation | 4 linked questions: `coding-and-data-structures`, `a-priority-queue-needs-a-staleness-rule`, `a-cursor-is-not-a-stable-order`, `a-public-dataset-needs-a-source-receipt`; supported by two locally linked articles | `CURATED_COVERAGE`; the Lab teaches state, staleness, resumable ordering, and source receipts. It is not a comprehensive programming-question bank. |
| Behavioural answers, project deep dives, role fit, and delivery judgement | 14. Behavioural questions, project deep dives and delivery judgment | 3 linked questions: `project-deep-dive-and-role-fit`, `a-project-story-needs-a-counterexample`, `applied-ai-delivery` | `CURATED_COVERAGE`; it avoids company-loop claims and tells readers to use shareable, de-identified evidence. |

## Deliberate gaps and exclusions

These exclusions are intentional. They must remain visible in owner review rather than being silently represented as completed coverage.

| Area | Status | Reason and required treatment |
| --- | --- | --- |
| Line-by-line mapping to every source prompt or answer | `NOT_DONE` | It would create an unnecessary derivative-content risk and is not required for a topic-coverage checklist. Never claim full prompt-level coverage. |
| Company-by-company question banks or interview-loop claims | `EXCLUDED` | All 59 local questions are `not-asserted` for company attribution. Keep this boundary on each question page. |
| Source repository answers, diagrams, exercises, assets, and linked external resources | `EXCLUDED` | They have separate authorship and, where applicable, separate terms. Do not import them through a summary or translation. |
| Current market demand, role prevalence, hiring outcomes, or interview frequency | `NOT_EVIDENCED` | No live recruitment research was performed for this ledger. Do not infer it from the source or the topic map. |
| Complete coding-algorithm preparation | `NOT_DONE` | Track 13 has four independently authored implementation prompts. It is still not a broad algorithms curriculum or a prompt-level mapping to any reference source. Direct learners needing broad algorithm practice elsewhere. |
| Legal, security, privacy, or employer-policy approval | `NOT_EVIDENCED` | Teaching a boundary is not professional advice or an organisation's approval. |

## Licence and provenance review

| Review item | Current status | Owner action before a public source credit or release decision |
| --- | --- | --- |
| Exact upstream repository identity and pinned revision | `VERIFIED_UNPINNED_2026-09-26` | Record an immutable commit/tag and access date before making a public source-credit or release decision. |
| Upstream licence | `DISPLAYED_AS_APACHE-2.0_UNPINNED_2026-09-26` | Read the repository's `LICENSE` at the pinned revision. Record the exact SPDX identifier and any notice requirements; do not rely on the displayed badge alone. |
| Originality review of AI.DOG text and examples | `REQUIRES_OWNER_REVIEW` | Check a representative sample of every question, answer, case, table, and downloadable asset against the source and other inputs. Replace anything that is close in wording, sequence, examples, or structure. |
| Third-party material linked from the reference repository | `NOT_REVIEWED` | Treat each destination as a separate source. Do not reuse it unless its own terms and factual claims are reviewed. |
| Company labels and interview-process assertions | `CONTROL_PRESENT_LOCALLY` | Preserve `not-asserted` metadata and the per-question scope callout. This control is not a substitute for source review. |
| Public acknowledgement | `OPEN_OWNER_DECISION` | Decide only after the upstream licence/revision review. No public acknowledgment is added by this ledger. |

Owning or controlling a separate account that hosts a source does not remove the need for this review: future contributors, repository forks, linked material, and public-facing claims still need a clear provenance record.

## Public attribution boundary

The current public experience correctly avoids attaching a company or live interview-process claim to an individual practice question. That general boundary is **not** a complete source-licence decision or a substitute for credit where credit is appropriate.

If the owner approves a source credit after the checks above, place one concise acknowledgement in a stable product-level provenance or acknowledgements location—not as a company attribution under each practice question. Suggested reviewed wording:

> AI.DOG's Interview Lab is independently authored. Its topic coverage was reviewed against the publicly available AI Engineering Interview Questions repository. No repository questions, answers, company labels, diagrams, or assets are reproduced.

Use the repository's verified title, URL, pinned revision, and licence notice only after owner review. Do not identify the anonymous content owner, imply affiliation with the repository author, or suggest that the reference endorses AI.DOG. If the owner cannot verify licence/attribution terms, remove the reference from the provenance claim and do not describe the Lab as sourced from it.

## Change-control checklist

Whenever an Interview Lab topic, track, question, or source reference changes:

1. Re-check the local counts and crosswalk above; mark newly uncovered or intentionally excluded areas explicitly.
2. Confirm the new material is independently authored and does not reuse upstream wording, company labels, assets, or examples.
3. Keep question metadata at `not-asserted` unless a separately verified, approved attribution policy exists.
4. Re-run `npm run validate` and `npm run validate:interview-voice`; treat successful local checks as structural validation only.
5. Before public approval, re-read the upstream repository at a pinned revision and update the licence/provenance table with the dated result.
6. Obtain owner approval for any public source acknowledgement, release, or external GitHub action. This ledger does not authorize any of them.
