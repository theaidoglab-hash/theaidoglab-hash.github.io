# Optional Responses API demo contract

> **Status: local teaching contract.** This document defines how a portfolio
> reference may show an optional model seam without making a live API call or
> implying that a future experiment has been authorised.

Use this contract only when a language-model step is relevant to the business
decision. A workflow that ranks records, checks a data receipt, or routes a
case without generating language should say that it intentionally has no LLM
seam. Adding a model merely to display a model name is not useful evidence.

## Minimum static request shape

The checked-in fixture may represent one possible request, but it must remain
plain data. It should identify these request fields:

```js
{
  method: "POST",
  path: "/v1/responses",
  model: "gpt-5-mini",
  store: false,
  instructions: "A narrow, evidence-bound drafting instruction.",
  input: "A synthetic or separately approved test input."
}
```

`gpt-5-mini` supports the Responses endpoint, and the Responses API accepts
`instructions`, `input`, and `store` as request controls. See the official
[GPT-5 mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini)
and [Responses API migration guide](https://developers.openai.com/api/docs/guides/migrate-to-responses).

The fixture must not import an SDK, read an environment variable, contain an
API key or authorization header, call a network function, or contain a model
output. Its surrounding deterministic baseline and local tests must not depend
on the fixture. A static object proves only that the request boundary is
documented; it does not prove API access, compatibility, model quality, cost,
latency, retention, safety, or business value.

## Optional evaluation configuration

When a portfolio needs to show how a future model experiment would be tested,
keep that configuration separate from the runnable local path:

- The provider identifier is `openai:responses:gpt-5-mini`.
- `store: false` remains explicit, along with a bounded `max_output_tokens`.
- A strict JSON schema and fixed positive and failure cases make routes and
  no-action outcomes inspectable.
- The configuration contains no credential and is absent from package scripts
  and CI.
- The local fixture provider is a separate, deterministic implementation; a
  passing fixture test is not a model result.

Promptfoo documents `openai:responses:<model>` as the explicit Responses
provider form and supports external structured-output schemas. Its optional
configuration is an evaluation design, not evidence that a model was run.

## What a reviewer can assess

| Technical evidence | Delivery and business evidence |
| --- | --- |
| A named endpoint/model request shape, a schema, fixed cases, and a test that the fixture remains disconnected. | Whether a model is needed for this decision, who owns exceptions, which data is permitted, and what must stop for human review. |
| A deterministic baseline that runs without a provider. | Whether a future experiment has separate authority for data handling, spend, logging, retention, and release review. |
| No-action assertions and negative cases for unsupported or unsafe inputs. | Whether the portfolio avoids confusing a draft, a test pass, or a model output with an external business action. |

## Future experiment boundary

An actual provider run is a different evidence package. Before one exists,
there is no model result to publish or compare. It would require separately
approved data, test-set ownership, credential and spend authority, logging and
retention decisions, a human decision owner, a release gate, and rollback
criteria. This local contract neither performs nor approves that work.
