# Optional Responses API demo boundary

> **Status: local teaching contract.** This document describes a possible
> future model seam without making a provider request, keeping a credential, or
> claiming that any real integration has been approved.

The Synthetic FAQ Approval Queue already has a deterministic, cited draft path.
It does not need a model to demonstrate its core decision: whether a fictional
FAQ question should become a draft for human approval, be handed off, or be
blocked before any outside action. A model seam is optional discussion
material, not a prerequisite for the workflow.

## The only request shape this example may show

`data/responses-api-gpt-5-mini.fixture.json` is plain, disconnected data. It
may describe this narrow request shape:

```js
{
  method: "POST",
  path: "/v1/responses",
  model: "gpt-5-mini",
  store: false,
  instructions: "Draft only from the approved fictional FAQ evidence.",
  input: "A synthetic FAQ question with no requested outside action."
}
```

The fixture must not import an SDK, load an environment variable, contain an
API key or authorization header, call a network function, or include a model
response. It must remain unused by `src/` and by the runnable tests. A static
shape documents a boundary; it does not prove provider access, compatibility,
quality, cost, latency, retention, safety, or business value.

The official [GPT-5 mini model documentation](https://developers.openai.com/api/docs/models/gpt-5-mini)
and [Responses API migration guide](https://developers.openai.com/api/docs/guides/migrate-to-responses)
are reference material only. Check the applicable version before any separate
implementation decision.

## What remains deterministic

The local workflow continues to use `src/mock-response.mjs` and must retain:

- a current and approved fictional FAQ citation for any draft;
- `handoff` for unsupported questions, instruction overrides, invalid input,
  and local mock failures;
- `blocked` for requested outside actions before retrieval or drafting; and
- a human approval requirement with `action.kind: "none"` on every route.

Those checks are the evidence a reviewer can run. They are not model results.
Adding a fluent model output must not remove a deterministic stop condition or
turn a draft into a customer response.

## A future experiment would be separate work

Any real provider run needs its own approved synthetic or de-identified test
set, credential and spend authority, data and logging decision, fixed
acceptance and failure cases, human decision owner, release gate, and rollback
condition. This package neither performs nor authorises that work.
