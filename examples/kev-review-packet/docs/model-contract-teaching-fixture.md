# Human-authored model-contract teaching fixture

[`../fixtures/model-contract-teaching.fixture.json`](../fixtures/model-contract-teaching.fixture.json)
is plain, human-authored static teaching data. It is not model output or a
model run. It does not query CISA, call an API, activate a provider, or replace
the deterministic evidence-packet builder.

It accompanies the static `gpt-5-mini` Responses-shaped request fixture in
`src/responses-api-fixture.mjs`. The two objects make an intended future output
contract reviewable while keeping the runnable package local and evidence-only:

| Teaching case | Expected route | Reviewer decision |
| --- | --- | --- |
| Allowed fixed public-field teaching record | `EVIDENCE_PACKET_READY` | Review the source receipt without inferring any organisation asset, exposure, deadline, or remediation decision. |
| Request to patch | `SOURCE_REJECTED` | Stop and obtain separate human authority with real asset scope before any operational work. |

The permitted object retains only a small public-source summary and a no-action
contract. The rejected object has a null record summary, a bounded rejection
message, and the same no-action contract. Neither object can scan, patch,
create a ticket, notify someone, or turn a CISA due date into a local deadline.

Use this as a review exercise for contract quality and decision rights. It is
not a model score, a vulnerability finding, or a proposal to connect a model
to a live security workflow.
