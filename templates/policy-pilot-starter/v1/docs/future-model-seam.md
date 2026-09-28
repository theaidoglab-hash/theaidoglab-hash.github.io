# Future model seam

Status: design note only. This package never invokes a model.

The deterministic baseline is intentional: it makes source eligibility, handoff conditions, and expected results clear before a model is introduced. If a separately authorised experiment later needs a model, the model should sit **after** source selection and **before** a human review. It should still be unable to perform external actions.

[`../src/responses-api-fixture.mjs`](../src/responses-api-fixture.mjs) contains a frozen static shape for a possible `gpt-5-mini` Responses API experiment. It records `POST /v1/responses` and `store: false` only as fields for design review.

It is a design note only: no key, provider setup, SDK, request, response, model output, evaluation result, cost, latency, or safety claim exists in this starter.

Before a real model experiment, an accountable owner would need separate approval for data access, source ownership, credentials and spend, retention, model choice, test-set ownership, evaluator instructions, human review, monitoring, incident handling, and release authority. The baseline tests here should remain independent so the comparison is meaningful.
