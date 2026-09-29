# Human-authored model-contract teaching fixture

[`../fixtures/model-contract-teaching.fixture.json`](../fixtures/model-contract-teaching.fixture.json)
is plain, human-authored static teaching data. It is not model output or a
model run. It does not call an API, activate a provider, or replace the
deterministic PolicyPilot baseline.

It sits beside the static `gpt-5-mini` Responses-shaped request fixture in
`src/responses-api-fixture.mjs`. Together, they show a reviewer the two sides
of a future model boundary without claiming that a model was queried:

| Teaching case | Expected route | Reviewer decision |
| --- | --- | --- |
| Current, approved synthetic source | `answer_with_citation` | Verify the cited synthetic record, then review the draft in a separate human-owned support process. |
| Requested refund or exception | `handoff` | Stop the automated path and hand the case to a person with the required authority. |

The first structured object shows the minimum evidence a permitted draft would
carry: a route, reason code, cited source, read-only action object, and clear
limits. The second shows that a fluent response is not the right outcome when
the request asks for an external action. Both preserve `action.kind: "none"`
and `requiresHumanReview: true`.

Use the fixture as a design-review exercise, not a quality score. A reviewer
can ask whether the source, route, and human decision make sense before any
separately authorised experiment considers a live provider, approved data,
logging, retention, spend, or release controls.
