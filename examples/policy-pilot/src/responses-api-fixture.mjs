/**
 * A static request-shape fixture for discussion and tests only.
 *
 * It does not import an SDK, read credentials, access the network, or invoke
 * an API. PolicyPilot's deterministic baseline does not depend on this object.
 */
export const RESPONSES_API_GPT_5_MINI_FIXTURE = Object.freeze({
  label: "mock_only_not_executed",
  purpose: "Illustrate a possible future model boundary without adding a live model dependency.",
  request: Object.freeze({
    method: "POST",
    path: "/v1/responses",
    model: "gpt-5-mini",
    store: false,
    instructions:
      "Return a policy-answer draft only when the supplied evidence is current and approved. Otherwise request human review. Do not call tools or propose external actions.",
    input:
      "Synthetic example: a customer asks whether an unused demonstration keyboard can be returned after delivery.",
  }),
  nonClaims: Object.freeze([
    "No request is sent.",
    "No API key or credential is present.",
    "No model output, quality result, cost, or latency claim is demonstrated.",
  ]),
});
