# AI Engineer Roadmap coverage and provenance ledger

Status: `OWNER_REVIEW_REQUIRED`

Recorded: 2026-09-26

Audience: AI.DOG content owner and release reviewer only. This is an internal review record, not a public attribution decision or release approval.

## Purpose and boundary

The AI.DOG roadmap is a reader-facing sequence for self-directed learning. Its external reference is used only to help review broad topic coverage and to give readers an optional public comparison point.

- Reference displayed on the public roadmap: <https://github.com/amitshekhariitbhu/ai-engineer-roadmap>
- Permitted internal use: review broad learning areas, then write AI.DOG explanations, practice steps, evidence prompts, and local links in its own sequence.
- Not permitted: reproduce or lightly rewrite source text, diagrams, images, repository structure, exercises, linked third-party material, or distinctive sequencing.
- Not claimed: that the AI.DOG roadmap has complete topic coverage, represents the source repository, is endorsed by its author, or predicts a role's training or hiring requirements.

## Current review state

| Review item | Current status | Required owner action before a public source-credit or release decision |
| --- | --- | --- |
| Source URL health | `BROWSER_REACHABLE_UNPINNED_2026-09-26` | Run `npm run validate:sources` from an approved networked release environment before a release decision. |
| Exact source revision | `UNPINNED` | Record an immutable commit or tag and access date. |
| Licence and notices | `NOT_REVIEWED` | Read the licence and notice requirements at the pinned revision. |
| Similarity and structure review | `REQUIRES_OWNER_REVIEW` | Compare representative AI.DOG stages, explanations, and visuals against the reference and replace material that is too close. |
| Anonymous-brand impact of outbound link | `USER_REQUESTED_COMPARISON_LINK_PENDING_RELEASE_REVIEW` | The owner requested a reader-facing comparison link to the public roadmap. Before release, confirm the exact link still does not create an identity bridge and keep it framed as an optional comparison, not an endorsement or partnership. |

## Public-copy rule

The visible roadmap may describe itself as an AI.DOG learning route and may say that readers can compare a public learning map. It must not name the external source as an AI.DOG partner, official curriculum, endorsement, or hiring signal.

Do not add source-level attribution, a licence statement, or an upstream-author claim to public copy until the source revision and licence review above are complete and the owner has approved an anonymity-safe acknowledgement.

## Local curriculum coverage snapshot

The table below is a local check on whether the AI.DOG route gives a reader a
continuous path from first concepts to work they can explain. Its group names
and ordering are AI.DOG's own review aid; they do not reproduce a source
repository outline or assert topic-for-topic equivalence.

| AI.DOG learning block | Local stages | What a reader is asked to leave with | Boundary kept visible |
| --- | --- | --- | --- |
| Shared language and decision framing | 00–01 | A plain-language problem statement, a named user decision, a baseline, and one signal that is not mistaken for a business result. | Learning exercises do not establish a live product outcome. |
| Model and training foundations | 02–07 | A small model or training decision record covering error, attention, output choice, architecture, model family, and the alternative to adaptation. | This is not a deep-learning degree or a claim that a model change is necessary. |
| Prompt, retrieval, and bounded tools | 08–11 | A testable prompt/context contract, a retrieval case set, a tool-permission table, and a stop or handoff route. | A fluent answer, an available tool, or an agent loop does not grant external-action authority. |
| Delivery, evaluation, and safety | 12–16 | A latency/cost budget, fixed evaluation cases, an owner and release gate, a safety boundary, and an explanation of a deliverable system. | Synthetic tests, diagrams, and local traces do not prove deployment, security approval, or business impact. |
| Career evidence and interview use | 17–18 | A source receipt, a short project answer, and a link between a technical decision and a reviewable artefact. | The route does not promise a job, visa, interview outcome, or current market demand. |

The stage records in `content/roadmaps/ai-engineer-roadmap.json` currently
cover all nineteen of the local stages above. Each has a locally authored
focus, evidence prompt, gap prompt, and resource link. The content validator
checks those required fields and their locale-specific internal links; it does
not prove external-source licensing, originality, or release approval.

## Reconciliation of applied-topic coverage

An earlier internal review treated several broad topics as absent because it
looked mainly at stage titles. That finding was too narrow: the material is
already spread across the locally authored stages and their original article
resources. The matrix below corrects that local finding.

This is not a source-to-source crosswalk. A row means that a reader can open
the named AI.DOG stage and original local articles, then practise one bounded
engineering judgment with an artefact and a visible limit. It does **not** mean
that the route duplicates an external outline, offers a complete academic
treatment, clears any source licence question, or proves a production skill.

| Broad topic group | Local route and original articles already present | Applied level covered here | Deliberate limit or pointer-only area |
| --- | --- | --- | --- |
| Training stability and normalisation | Stage 02; `training-stability-dropout-normalisation`, `gradient-backprop-and-loss-debugging`, and `regularisation-loss-and-generalisation`. | Reproduce a small run; record seed, split, preprocessing and train/evaluation mode; compare a bounded learning-rate or batch change; report the spread rather than the luckiest run; keep a simple baseline. | This is not an optimiser survey, a derivation of every normalisation method, a large-model training guide, or evidence that a stable local metric is fair or ready to deploy. Deeper optimisation theory remains a learning pointer. |
| Tokens, attention, masks and position | Stage 03; `tokenisation-and-domain-terms`, `attention-qkv-mask-position`, and `transformer-blocks-and-architecture-choice`. | Make a token audit for important identifiers; use contrast cases for negation, word order, distance and padding; explain why positional information and masks change model input without confusing a mask with application permission. | It does not teach a full Transformer derivation, train a tokenizer or model from scratch, or treat an attention map as a business explanation. Architecture variants beyond the decision at hand are pointers, not covered implementation work. |
| Model families and adaptation choices | Stages 06–07; `language-model-families-and-when-to-use-them` and `adaptation-data-and-alignment-choice`. | Match an encoder, decoder, sequence-to-sequence or multimodal component to a subtask; keep a no-model or simpler baseline; prepare a task card, data/split record, fixed evaluation cases and a stop condition before considering adaptation. | It is not a provider catalogue, a fine-tuning recipe book, a full alignment-research curriculum, or a claim that changed weights make a workflow safe. Advanced training methods are only a pointer after the data and evaluation gates are met. |
| Retrieval design | Stage 09; `retrieval-index-chunk-rerank-and-cache`, `rag-freshness-conflicts-and-advanced-patterns`, and `rag-chatbot-to-portfolio-evidence`. | Define an approved evidence set; compare chunk boundary, metadata filter, candidate set, reranking and cache invalidation against fixed cases; require citation or handoff when evidence is missing, stale or out of scope. | It is not a live document-store integration, a managed-vector-database setup guide, or proof that a high retrieval score creates a reliable RAG product. Real documents, access rules and release approval stay outside the local exercise. |
| Agents, execution and serving | Stages 10–13; `build-stoppable-ai-agents-with-serving-budgets`, `agent-protocols-orchestration-and-computer-use`, `inference-memory-scheduling-and-serving-engines`, and `evaluate-an-ai-agent-workflow-not-just-the-final-answer`. | Draw a bounded state machine; name allowed tools, terminal states, budgets, retry/idempotency behaviour, traces, reviewer authority and fixed evaluation cases; distinguish queue time from model time. | It does not supply a production queue, distributed scheduler, credentialed tool integration, SLO commitment or security approval. Framework and serving-engine details are pointers until a scoped environment and owner approval exist. |
| Multimodal work and transport boundaries | Stages 15–16; `multimodal-architectures-generation-and-evaluation` and `ai-hardware-routing-deployment-and-transport`. | Use synthetic or permitted fixtures; separate field extraction from generated explanation; compare against an OCR-plus-review baseline; record request modality, route, terminal state, data boundary and handoff in a routing receipt. | It is not permission to process private media, infer sensitive traits, operate a vision/audio service, choose real infrastructure, or claim hardware performance beyond a stated local environment. Deployment and transport controls are explained as design boundaries, not implemented production controls. |
| Frontier claims, world models and controlled improvement | Stage 17; `frontier-world-models-and-self-improvement` and `read-frontier-ai-claims-with-source-receipts`. | Keep a source receipt; model only an invented, limited state; freeze a baseline; compare candidate changes on fixed offline cases; require an independent evaluator and named human owner before any change is used. | It does not claim that a system understands the world, forecasts frontier capability, self-modifies autonomously, or may move a change into a live environment. Research claims remain an external reading pointer and must be checked at their source. |

The reviewer should use the article slugs above only to locate local material.
They are not public-source citations, not a replacement for a pinned source
review, and not evidence that every neighbouring subtopic has been covered.
Any future row should meet the same minimum: a local stage, a locally authored
practice, a checkable artefact, and an explicit boundary. Otherwise mark it as
`POINTER_ONLY` or `NOT_YET_COVERED`; do not silently infer coverage from a
nearby technical term.

## 2026-09-26 review result

A browser check on 2026-09-26 confirmed that the referenced public roadmap
page remains reachable and describes itself as a step-by-step AI-engineering
roadmap. This confirms only the page-level topic context used for this review.
It does not pin a revision, inspect the repository's licence text, or authorise
any reuse. The current action is therefore to retain the locally authored
nineteen-stage route and keep the provenance and owner-review gates above in
place.
