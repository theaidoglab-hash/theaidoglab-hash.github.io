# Portfolio example GitHub handoff

> **Status: local owner handoff, not a publication instruction.** These six
> folders are local, fixture-only portfolio references. This document records
> what a reviewer can verify locally and the decisions an owner must make
> before creating any public repository or adding a link to the website.

## What is ready for local review

Each package is intentionally self-contained: English source code and English
technical documentation, one English canonical README, three translated README
editions, a local Node.js test command, a demo command, an MIT license, an
ignore file, and a minimal read-only GitHub Actions workflow. `private: true`
in each `package.json` prevents npm publication; it does **not** set GitHub
visibility or grant permission to publish.

| Package | Decision and business value being demonstrated | Model / evaluation scope | Local verification |
| --- | --- | --- | --- |
| `policy-pilot` | A cited policy draft or a human handoff; it demonstrates source status, read-only authority, and reviewability instead of auto-answering. | Static `gpt-5-mini` Responses shape; fixture-only and optional Responses Promptfoo configurations. | `npm --prefix examples/policy-pilot test` and `npm --prefix examples/policy-pilot run demo` |
| `renewal-triage` | A capacity-limited review queue can reject a candidate with a better generic model metric when synthetic queue utility is worse. | Deliberately no LLM: the evidence concerns ranking, capacity, and release governance. | `npm --prefix examples/renewal-triage test` and `npm --prefix examples/renewal-triage run demo` |
| `approval-queue` | A FAQ draft must be cited, read-only, and approved by a human; unsupported, injected, failed, or action-seeking requests stop. | Static, disconnected `gpt-5-mini` Responses request shape only; the runnable path is deterministic. | `npm --prefix examples/approval-queue test` and `npm --prefix examples/approval-queue run demo` |
| `ai-batch-worker` | A bounded document-enrichment workflow makes duplicate safety, checkpoint/retry, dead letters, cost stops, and human review inspectable. | Static, disconnected `gpt-5-mini` Responses request shape only; core evidence is deterministic orchestration. | `npm --prefix examples/ai-batch-worker test` and `npm --prefix examples/ai-batch-worker run demo` |
| `kev-review-packet` | A public-field security evidence packet is separated from asset findings, remediation, and release decisions. | Static `gpt-5-mini` Responses shape; fixture-only and optional Responses Promptfoo configurations. | `npm --prefix examples/kev-review-packet test`, `npm --prefix examples/kev-review-packet run fixture:validate`, `npm --prefix examples/kev-review-packet run demo`, and `npm --prefix examples/kev-review-packet run eval:diff` |
| `workforce-signal-brief` | A human can review a source receipt and synthetic context packet without turning it into a forecast, hiring, salary, visa, or publication decision. | Static `gpt-5-mini` Responses shape; fixture-only and optional Responses Promptfoo configurations. | `npm --prefix examples/workforce-signal-brief test`, `npm --prefix examples/workforce-signal-brief run fixture:validate`, `npm --prefix examples/workforce-signal-brief run demo`, and `npm --prefix examples/workforce-signal-brief run eval:diff` |

Run the structural/language gate and the explicit deterministic runtime gate
from `public-site` as well:

```powershell
npm run validate:examples
npm run validate:example-runtimes
```

The runtime gate runs only the fixed test, fixture-validation, demo, and
evidence-diff commands listed above. It intentionally does not install or run
Promptfoo, invoke a provider, read a credential, or access a network.

The deterministic tests and demos are useful evidence of their stated fixed
fixtures only. They do not demonstrate a model result, live data acquisition,
Promptfoo execution, production reliability, business impact, deployment, or
approval to use external systems.

## Static model and Promptfoo boundary

The model-shaped artifacts intentionally contain no SDK call, credential,
authorization header, environment-variable read, or network operation. When a
package has an optional Responses configuration, it names
`openai:responses:gpt-5-mini`, uses `store: false`, and is absent from package
scripts and CI. A future live evaluation is a separate owner decision covering
credentials, data rights, cost, retention, representative cases, human review,
and release criteria.

Promptfoo is deliberately scoped rather than added as a badge: PolicyPilot,
KEV Review Packet, and Workforce Signal Brief have optional Promptfoo designs
because they include a bounded text/model output contract. Renewal Triage has
no language-generation decision, while Approval Queue and AI Batch Worker keep
their runnable value in deterministic workflow controls. Their static model
seams show where a separately authorised experiment could begin without
claiming that one occurred.

## Standalone-export status

Approval Queue now carries its own
`docs/optional-responses-demo-contract.md`; its README and demonstration map
no longer depend on a cross-package path. The examples validator rejects local
links to another example folder, so an exported package cannot silently retain
that kind of broken reference. A real GitHub URL still must not be added until
the owner creates and verifies the remote repository.

## Proposed independent repository identities

This is a local naming proposal, not a claim that these repositories exist.
The proposal deliberately avoids an account name, URL, branch, commit, or
homepage. Those values belong in the website metadata only after the owner has
created a fresh anonymous repository and read the remote state back.

| Local package | Proposed repository slug | Proposed public title | Website link state |
| --- | --- | --- | --- |
| `policy-pilot` | `policy-pilot-reference` | PolicyPilot: Synthetic Read-Only Policy Drafting Reference | No URL yet. |
| `renewal-triage` | `renewal-triage-reference` | Renewal Triage: Synthetic Human-Review Decision Support | No URL yet. |
| `approval-queue` | `approval-queue-reference` | Synthetic FAQ Approval Queue: Read-Only Human Approval Reference | No URL yet. |
| `ai-batch-worker` | `resumable-ai-batch-worker` | Resumable AI Batch Worker: Fixture-Only Reference | No URL yet. |
| `kev-review-packet` | `kev-review-packet` | KEV Review Packet: Fixture-Only Security Evidence Workflow | No URL yet. |
| `workforce-signal-brief` | `workforce-signal-brief` | Workforce Signal Brief: Synthetic Public-Data Context Workflow | No URL yet. |

The site already has a `portfolioRepository` metadata field that can display a
repository and locale-specific README links. Its validation intentionally
rejects placeholders: it needs the verified HTTPS GitHub URL, exact branch or
ref, English-source declaration, all four README URLs, tested command, and a
verification date. Do not insert a guessed URL merely to make a button appear.

For KEV Review Packet, retain the explicit top-level GitHub Actions permission
`contents: read` in the exported workflow. All six packages must be exported
into fresh independent repositories; never reuse the parent public-site Git
history or its commit-author metadata.

## Publish only after owner review

No public repository URL, homepage, bug tracker, or publish configuration is
defined in any package manifest. That avoids a false website link while the
examples remain local. Before the owner creates a repository or adds a website
link, complete this checklist for the exact exported folder:

1. Re-run the package command(s) above and `npm run validate:examples` from
   the current `public-site` checkout.
2. Review every tracked file for personal, employer, customer, private, or
   credential material; confirm that fixture labels and non-claims still match
   the exported files.
3. Confirm authorship, third-party licences, public-source terms, employer
   obligations, and external-release authority. An MIT file is not a substitute
   for any of those decisions.
4. Decide the public repository name, visibility, owner account, issue policy,
   security-contact route, and the sentence that will describe the package.
   Do not reuse synthetic fixture results as product or business claims.
5. Create and inspect the remote repository manually only after the preceding
   checks pass. Then update the website with its verified URL in a separately
   reviewed change.

If any check introduces a credential, real/private data, a real external
action, a live model result, or an unsupported outcome claim, stop the export
and return the package to a local fixture-only state.
