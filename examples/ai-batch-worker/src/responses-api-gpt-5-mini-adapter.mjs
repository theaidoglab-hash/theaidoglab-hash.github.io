/**
 * Static request-shape documentation only.
 *
 * This module is intentionally not imported by the worker runtime. It has no
 * SDK import, credential access, environment-variable access, network call, or
 * model invocation. The executable workflow uses synthetic fixture outcomes.
 */
export const RESPONSES_API_GPT_5_MINI_ADAPTER = Object.freeze({
  label: "mock_only_not_executed",
  purpose: "Show a separately reviewed future model seam without adding an API dependency.",
  runtimeBoundary: Object.freeze({
    network: "disabled",
    credentials: "not_read",
    invocation: "never",
  }),
  requestShape: Object.freeze({
    method: "POST",
    path: "/v1/responses",
    model: "gpt-5-mini",
    store: false,
    instructions:
      "Return structured enrichment for a synthetic document only. Do not call tools, write to a system, or take external action.",
    input: "Synthetic document fixture supplied by the local batch-worker demonstration.",
  }),
  nonClaims: Object.freeze([
    "No request is sent.",
    "No API key, authorization header, SDK, or credential is present.",
    "No model output, compatibility, quality, cost, or latency result is demonstrated.",
  ]),
});
