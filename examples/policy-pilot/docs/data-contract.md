# PolicyPilot synthetic data contract

> **Status: local, synthetic design record.** This contract describes a teaching fixture and a safe extension process. It is not a real-data approval, a privacy impact assessment, or a production schema.

## 1. Decision supported by the data

The only fictional decision is whether a support reviewer may receive a **read-only, cited policy draft** or must receive a **human handoff**. The contract does not support a refund, order update, account lookup, payment, message, ticket, or any other external action.

This narrow decision changes the data requirement: a policy record must be attributable, versioned, approved, and effective at the evaluation date. Fluent prose alone is not enough evidence.

## 2. Current fixture inventory

[`../src/synthetic-corpus.mjs`](../src/synthetic-corpus.mjs) is the sole data source used by the executable reference. Every record is fictional and marked through its `sourceNote` as synthetic authoring. It deliberately includes current, superseded, and draft records so that the routing logic has negative cases to test.

| Field | Type / allowed values | Purpose | Sensitive or real-data status |
| --- | --- | --- | --- |
| `policyId` | Stable fictional string, such as `RET-100` | Identifies the cited policy | Synthetic identifier only |
| `version` | Fictional version string, such as `v2` | Makes a cited version inspectable | Synthetic only |
| `status` | `approved`, `superseded`, or `draft` | Controls whether a record may be cited | Synthetic workflow state |
| `effectiveFrom` / `effectiveTo` | ISO date strings | Determines applicability at the fixed `asOf` date | Fictional dates |
| `title` / `topic` | Short English text | Supports inspection and baseline retrieval | Fictional policy description |
| `keywords` | English string array | Deterministic retrieval baseline input | Fictional search terms |
| `answer` / `citationExcerpt` | English text | Draft and citation content for a supported route | Fictional policy text |
| `sourceNote` | Fixed `synthetic authoring` value | Preserves the source boundary in the result | Not a provenance claim about a real source |

## 3. Allowed and prohibited inputs

### Allowed in this reference

- fictional questions about fictional return, warranty, or exception policies;
- deliberately stale or unapproved policy fixtures used to test rejection;
- synthetic safety tests such as a request to issue a refund or an attempt to override policy instructions; and
- a fixed `asOf` date used to make evaluation repeatable.

### Prohibited in this reference

- real customer, employee, client, employer, vendor, order, account, payment, contact, or support-record data;
- unlicensed policy text, internal documents, screenshots, chat logs, or production traces;
- credentials, tokens, authentication headers, secrets, or external service identifiers; and
- a real claim that a policy is current, legally applicable, or operationally approved.

The executable function currently checks that a query is a non-empty string and protects explicit action and instruction-override patterns. It does **not** detect every kind of personal data, confidential text, policy ambiguity, or harmful request. The prohibited-input list is therefore an operating rule for the learner, not a claim that the code enforces all data governance.

## 4. Input, result, and trace contract

| Interface | Current contract | What it proves |
| --- | --- | --- |
| `runPolicyPilot(query, { asOf })` | A non-empty text query plus a fixed date | The deterministic baseline can be rerun against identical inputs |
| `answer_with_citation` | One eligible approved/current policy becomes a draft with `policyId`, `version`, title, excerpt, and source note | A reviewer can inspect which synthetic record supports the draft |
| `handoff` | Unsupported, stale, unapproved, permission-seeking, or injection input produces no citation | Failure is an explicit route, not a hidden fallback |
| `action` | Always `kind: "none"`; human review is required | The implementation cannot cause an external effect |
| `trace` | Stores a SHA-256 fingerprint, length, route, version, candidate metadata, and citation references | A route can be investigated without retaining the raw query |

The trace minimisation is a deliberate trade-off: it helps a reviewer compare system behaviour while avoiding raw-query retention. It is not a complete logging, retention, deletion, or incident-response design.

## 5. Change protocol for a new synthetic record

For this learning package, treat each data edit as an engineering change:

1. Write the fictional policy record and label it `synthetic authoring`.
2. State the record's status and effective dates before testing retrieval.
3. Add at least one fixed supported or rejection scenario with an expected route and citation reference.
4. Run the full local test suite; do not alter the expected result merely to make a changed implementation pass.
5. Record whether the change created a regression, coverage gap, or new handoff case.
6. Update the README and evaluation/release record if the data boundary, action boundary, or non-claims change.

The repository does not automate this protocol yet. That absence is itself portfolio evidence: a learner should distinguish an implemented control from a documented operating requirement.

## 6. A future real-data route is a separate project

Replacing the fixture with real policy material would require a separate owner-approved design for source ownership, permission, version authority, retention, access control, evaluation labels, sensitive-input handling, human-review operations, monitoring, and release decisions. No file in this repository authorises that work.

For a public GitHub portfolio, keep this package synthetic unless you can show written permission and a safe, reviewable data route without exposing the source itself.
