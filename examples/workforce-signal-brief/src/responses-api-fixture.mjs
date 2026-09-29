/**
 * Static request-shape fixture for a separately approved future experiment.
 * It imports no SDK, reads no credential, invokes no API, and produces no
 * model output. The deterministic context packet does not depend on it.
 */
export const RESPONSES_API_GPT_5_MINI_FIXTURE = Object.freeze({
  label: "mock_only_not_executed",
  purpose: "Illustrate an optional source-grounded narrative-draft seam after deterministic source validation and human review remain in place.",
  request: Object.freeze({
    method: "POST",
    path: "/v1/responses",
    model: "gpt-5-mini",
    store: false,
    instructions: "Return only a bounded context-draft object. Preserve series facts, state the values are synthetic teaching data, do not forecast, recommend hiring, set salary, give visa advice, publish, or take an external action.",
    input: "Fixture-only example: turn an already validated synthetic time-series packet into a draft for human review.",
  }),
  nonClaims: Object.freeze([
    "No request is sent.",
    "No API key or credential is present.",
    "No model output, quality result, cost, latency, or safety result is demonstrated.",
  ]),
});
