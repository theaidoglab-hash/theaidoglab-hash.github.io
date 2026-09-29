# Demonstration map

## Fictional business context

This is a portfolio-reference workflow for a fictional security assurance reviewer. The reviewer needs a small, inspectable public-source packet before a human-owned security process decides whether any internal work is appropriate. The packet is deliberately not a vulnerability-management system.

The supplied record is a fixed public CISA KEV teaching fixture. It is not connected to an organisation, an asset inventory, a customer, a network, a scan result, a patch programme, or an incident.

## End-to-end workflow

```text
Fixed public-field KEV record + fixture source receipt
  -> input and private-field boundary
  -> source receipt, schema, freshness, and field validation
  -> EVIDENCE_PACKET_READY OR SOURCE_REJECTED
  -> fixed local evaluation
  -> evidence delta review
  -> human release gate outside this repository
```

The only permitted result is a source-grounded evidence packet or `SOURCE_REJECTED`. A successful result still cannot scan, patch, make an asset match, open a ticket, notify a person, or decide a remediation deadline.

## Technical evidence

| Evidence | Inspectable artifact | What a reviewer can verify locally |
| --- | --- | --- |
| Source contract | `schemas/kev-review-contract.schema.json` | Required KEV fields, fixture-only manifest shape, and exactly two result shapes |
| Data minimisation | `src/source-validation.mjs` | A public-field allowlist and rejection of private, contact, network, asset, and operational fields |
| Source receipt | `data/source-manifest.fixture.json` | Canonical CISA route, official schema repository, CC0 receipt, and ACSC context separated from CISA due dates |
| Deterministic workflow | `src/review-packet.mjs` | Packet construction, `SOURCE_REJECTED`, trace minimisation, and no action capability |
| Action boundary | `src/action-contract.mjs` | Empty allowed-action list and explicit prohibitions for scans, patches, tickets, messages, and inventory reads |
| Regression checks | `test/kev-review-packet.test.mjs` | Ten fixed cases plus contract, model-fixture, Promptfoo-config, and evidence-delta assertions |
| Optional model boundary | `src/responses-api-fixture.mjs` | A static `gpt-5-mini` Responses request shape with `store: false`, no SDK, no credential, and no execution |
| Eval comparison | `scripts/eval-diff.mjs` | Per-case before/after comparison that flags declared regressions without declaring approval |

## Non-technical and business evidence

| Evidence | Why it matters | What it does not prove |
| --- | --- | --- |
| Named workflow owner | A fictional assurance reviewer owns evidence review, while a later human process owns any decision | That a real organisation has assigned this role or workflow |
| Source provenance | A reviewer can see the intended public-data route and licence before relying on a fixture | That the fixture is complete, current, or sufficient for a real vulnerability programme |
| Decision boundary | The package distinguishes public catalog evidence from asset exposure, remediation, and deadline decisions | That code can replace a security, legal, or operational approval |
| Change review | `CHANGE-001` states the expected case-level delta and rollback condition | That a PASS result creates a release, customer outcome, or business value |
| Release gate | A human must review source status, eval scope, non-claims, and authority before any separate release | Production readiness, compliance approval, or Australian operational acceptance |

## Test evidence

The fixed local suite covers:

1. a normal complete public record;
2. exact preservation of `Known` ransomware use;
3. exact preservation of `Unknown` without a negative inference;
4. a malformed CVE identifier;
5. a missing required field;
6. a stale fixture snapshot;
7. a prohibited private field;
8. an injection attempt in a wrapper note;
9. a requested action; and
10. an ambiguous asset claim.

Run `npm test`, `npm run fixture:validate`, and `npm run demo` from this directory. Those commands use only local repository files.

The `evals/promptfoo.fixture.yaml` configuration can be run separately with a local deterministic provider if a reader chooses to install Promptfoo. `evals/promptfoo.responses.optional.yaml` is a separate, credential-free configuration shape for a future, independently authorised Responses API experiment. Neither configuration is used by package scripts or CI.

## Non-claims

- No live CISA feed is downloaded, queried, or validated during this demo.
- The fixture is not a complete or current KEV catalog snapshot.
- No model output, Promptfoo output, cost, latency, accuracy, safety performance, or benchmark result is included.
- No organisation, customer, client, contact, asset, network, inventory, scan result, patch state, ticket, or incident data is included.
- No CISA due date is an Australian service-level agreement.
- No remediation recommendation, business impact, security posture, compliance result, production readiness, deployment, or external action is claimed.
