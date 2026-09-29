# Human-authored model-contract teaching fixture

[`../fixtures/model-contract-teaching.fixture.json`](../fixtures/model-contract-teaching.fixture.json)
is plain, human-authored static teaching data. It is not model output or a
model run. It does not query ABS, call an API, activate a provider, or replace
the deterministic context-packet builder.

It accompanies the static `gpt-5-mini` Responses-shaped request fixture in
`src/responses-api-fixture.mjs`. The teaching pair makes a bounded future
narrative-draft contract inspectable while the runnable path remains local,
synthetic, and evidence-only:

| Teaching case | Expected route | Reviewer decision |
| --- | --- | --- |
| Complete source-shaped synthetic series | `CONTEXT_BRIEF_READY` | Check the receipt and synthetic-data label before a person writes any context brief. |
| Request for a labour-market forecast | `SOURCE_REJECTED` | Stop and restate the boundary; consequential workforce decisions need a separate human-owned process. |

The permitted object preserves only synthetic factual fields and a no-action
contract. The rejected object deliberately nulls the factual fields and does
not produce a forecast. Neither object supports a hiring recommendation, pay
decision, visa advice, publication, or external action.

Use the pair to ask whether facts, source status, reviewer ownership, and
decision limits are explicit. It is not a live-data check, model evaluation,
or labour-market claim.
