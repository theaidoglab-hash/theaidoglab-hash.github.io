# KEV Review Packet

[Traditional Chinese (Hong Kong)](README.zh-HK.md) · [Traditional Chinese (Taiwan)](README.zh-TW.md) · [Simplified Chinese](README.zh-Hans.md)

> **Status: local, fixture-only portfolio reference.** It is not a deployed product, a vulnerability-management system, a live CISA integration, or evidence of production readiness.

KEV Review Packet shows how to turn one carefully bounded public vulnerability record into a reviewable evidence packet without pretending it knows an organisation's assets, exposure, patch state, deadline, or business impact. A fictional security assurance reviewer receives either a source-grounded packet or `SOURCE_REJECTED`; there is no third route and no external action.

The engineering point is not to make a generic AI security demo. It is to make the evidence, limits, and review path inspectable: a source receipt, public-field allowlist, schema checks, rejection routes, no-action contract, fixed evaluation cases, change delta, release gate, and rollback boundary.

## Start locally

Requires Node.js 20 or later. There are no package dependencies and no credentials.

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

All four commands use local files only. They do not download CISA data, call a model, run Promptfoo, read a credential, scan a network, match an asset, patch a system, create a ticket, send a message, or deploy anything.

## The actual public-data route, and what this repository does instead

The relevant public-data route is documented in the fixture source receipt:

| Source | Why it is recorded | What this repository does not claim |
| --- | --- | --- |
| [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and its [canonical JSON feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) | Canonical route for a later, separately approved acquisition design | That a feed was downloaded, is current, complete, or suitable for a real workflow |
| [Official CISA KEV schema repository](https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json) | A public schema reference used to constrain the fixture field set | That this package independently validates every live catalog change |
| [CISA KEV CC0 license](https://www.cisa.gov/sites/default/files/licenses/kev/license.txt) | Licence receipt for the public catalog route | Legal advice or permission for any particular organisation's use case |
| [ACSC patch guidance](https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20%28November%202023%29.pdf) | Australian operational context for a later human review | That a CISA `dueDate` is an Australian SLA, local deadline, or remediation instruction |

The included record is a small fixed teaching fixture with only allowed public KEV fields. Its manifest is explicitly `fixture_not_live_acquired`. It is not a downloaded snapshot, a current-catalog assertion, an asset finding, or a claim about any organisation.

## What the package does

```text
Fixed public-field KEV record + fixture source receipt
  -> reject private, operational, stale, malformed, injected, or action-seeking input
  -> validate allowed schema fields and source receipt
  -> EVIDENCE_PACKET_READY OR SOURCE_REJECTED
  -> no-action result + privacy-minimised trace
  -> fixed local tests, evidence delta, and human release gate
```

A successful packet copies public catalog fields and source prose as data. It does not interpret source prose as an instruction. For example, the fixture's `requiredAction` is retained as evidence, but the code cannot apply an update. `Known` and `Unknown` ransomware-use values are retained exactly; `Unknown` never becomes a claim of no ransomware use.

## Technical evidence and non-technical/business evidence

| Area | What a reviewer can inspect | Why it matters |
| --- | --- | --- |
| Technical: source and schema controls | [`schemas/kev-review-contract.schema.json`](schemas/kev-review-contract.schema.json), [`src/source-validation.mjs`](src/source-validation.mjs), and [`data/source-manifest.fixture.json`](data/source-manifest.fixture.json) | The input is restricted to public KEV fields, a non-live fixture manifest, and a complete source receipt |
| Technical: safety and action authority | [`src/action-contract.mjs`](src/action-contract.mjs) and [`src/review-packet.mjs`](src/review-packet.mjs) | The only output routes are a packet or `SOURCE_REJECTED`; allowed actions are empty |
| Technical: test evidence | [`test/kev-review-packet.test.mjs`](test/kev-review-packet.test.mjs) and [`src/evaluation-cases.mjs`](src/evaluation-cases.mjs) | A reviewer can rerun normal, malformed, stale, private-field, injection, action-request, and ambiguous-asset cases locally |
| Technical: change evidence | [`scripts/eval-diff.mjs`](scripts/eval-diff.mjs) and [`docs/evidence-delta-change-001.md`](docs/evidence-delta-change-001.md) | A per-case comparison calls out a declared regression rather than hiding it in a single score |
| Non-technical/business: workflow ownership | [`docs/demonstration-map.md`](docs/demonstration-map.md) | Public catalog evidence is useful only as an input to a fictional human assurance review; it is not an asset or remediation decision |
| Non-technical/business: release discipline | [`docs/release-gate.md`](docs/release-gate.md), [`docs/decision-log.md`](docs/decision-log.md), and [`docs/rollback.md`](docs/rollback.md) | A portfolio project should show who must decide, what evidence is still missing, and how an unsafe extension stops |

## Fixed evaluation set

The local test suite covers ten deliberately small cases:

1. a normal complete public record;
2. exact preservation of `Known` ransomware use;
3. exact preservation of `Unknown` without overclaiming;
4. a malformed CVE;
5. a missing required field;
6. a stale fixture snapshot;
7. a prohibited private field;
8. an injection wrapper;
9. an action request; and
10. an ambiguous asset claim.

The tests check routes, reason codes, action authority, trace minimisation, exact ransomware-use preservation, source receipt fields, static model-fixture properties, and the illustrative Evidence Delta comparison. A PASS means the local fixture behaved according to its declared contract. It does not measure a live model, live data, an organisation's security, or real-world business performance.

## Optional model and Promptfoo layers

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) is a static, non-executing `gpt-5-mini` Responses API request shape. It uses `store: false` and contains no SDK import, credential, network call, or model output. It is a discussion boundary only, not an OpenAI integration. The request shape follows the [GPT-5 mini model documentation](https://developers.openai.com/api/docs/models/gpt-5-mini) and [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create).

[`fixtures/model-contract-teaching.fixture.json`](fixtures/model-contract-teaching.fixture.json) adds an allowed evidence-packet shape and a bounded action-rejection shape for reviewer discussion. It is human-authored static teaching data, not model output or a model run. Read [the companion guide](docs/model-contract-teaching-fixture.md) before treating either object as more than a response-contract example.

Two Promptfoo configurations make the evaluation design inspectable without making the model part of the core demo:

- [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) uses a local deterministic JavaScript provider. It has no credential and no network access. A reader who separately chooses to install Promptfoo can use it to exercise three fixture cases; package scripts and CI never run it.
- [`evals/promptfoo.responses.optional.yaml`](evals/promptfoo.responses.optional.yaml) is an optional shape using `openai:responses:gpt-5-mini`, `store: false`, and a strict response schema. It contains no key and is never run by package scripts or CI. A real experiment would need independently authorised credentials, reviewed data handling, a representative evaluation set, a human decision owner, and its own release gate.

The configurations use Promptfoo's documented custom JavaScript provider and Responses provider shapes. They are scaffolding for evaluation design, not proof of Promptfoo or model results.

## Change, release, and rollback evidence

`CHANGE-001` makes one quality rule concrete: source value `Unknown` must stay `Unknown`. The fixture-only before/after reports illustrate a per-case comparison:

```powershell
npm run eval:diff
```

The comparison reports `NO_DECLARED_REGRESSION` only when supplied fixture reports also share the same fixture, source-manifest, case-set, action-contract, and evaluation-protocol context. Otherwise it stops at `COMPARISON_NOT_COMPARABLE`. Neither result is a release approval. Read the [Evidence Delta](docs/evidence-delta-change-001.md), [decision log](docs/decision-log.md), [release gate](docs/release-gate.md), and [rollback plan](docs/rollback.md) together before adapting this pattern.

## Repository map

| Path | Purpose |
| --- | --- |
| [`data/kev-record.fixture.json`](data/kev-record.fixture.json) | Fixed public-field teaching record |
| [`data/source-manifest.fixture.json`](data/source-manifest.fixture.json) | Fixture/not-live source receipt, licence record, and explicit non-claims |
| [`schemas/kev-review-contract.schema.json`](schemas/kev-review-contract.schema.json) | Inspectable contract for input, packet, and rejected result shapes |
| [`src/source-validation.mjs`](src/source-validation.mjs) | Input boundary, public-field allowlist, receipt checks, schema-like validation, and freshness gate |
| [`src/review-packet.mjs`](src/review-packet.mjs) | Deterministic packet builder and privacy-minimised trace |
| [`src/action-contract.mjs`](src/action-contract.mjs) | Empty allowed-action list and explicit prohibited actions |
| [`fixtures/model-contract-teaching.fixture.json`](fixtures/model-contract-teaching.fixture.json) | Human-authored allowed and rejected structured-response teaching pair; neither object is model output or a model run |
| [`src/evaluation-cases.mjs`](src/evaluation-cases.mjs) | Ten fixed acceptance cases |
| [`scripts/eval-diff.mjs`](scripts/eval-diff.mjs) | Per-case evidence-delta comparison tool |
| [`evals/`](evals) | Fixture-only and optional Promptfoo configurations plus illustrative change reports |
| [`docs/`](docs) | Demonstration map, decision log, release gate, rollback boundary, and CHANGE-001 |
| [`docs/model-contract-teaching-fixture.md`](docs/model-contract-teaching-fixture.md) | How to review static packet and rejection shapes without mistaking them for a provider result |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Local test, fixture validation, and demo only; never live Promptfoo |

## Non-claims

- No live CISA feed, CISA API, source synchronisation, or current-data verification occurs.
- No CISA data acquisition occurs during tests, demo, CI, or the local Promptfoo fixture provider.
- No OpenAI API call, model response, Promptfoo run, credential read, cost, latency, quality, or safety performance result is shown.
- No private, client, contact, network, inventory, asset, scan, patch, ticket, message, incident, or business data is present.
- No asset exposure, remediation priority, patch recommendation, Australian SLA, compliance result, security posture, production readiness, deployment, or business outcome is claimed.

## License

This local repository draft includes an [MIT License](LICENSE). Confirm code ownership, third-party material, data terms, employer obligations, security review, and external-release authority before publishing a fork or connecting any live service.
