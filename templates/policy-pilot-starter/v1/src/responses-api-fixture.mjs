// This is a static teaching shape, not an API integration or a runnable request.
export const RESPONSES_API_GPT_5_MINI_SEAM = Object.freeze({
  status: "design_note_only_not_executed",
  purpose: "Show where a separately approved model experiment could fit after the deterministic baseline.",
  requestShape: Object.freeze({
    api: "Responses API",
    method: "POST",
    path: "/v1/responses",
    model: "gpt-5-mini",
    store: false,
    expectedOutput: "structured cited draft or human handoff",
  }),
  nonClaims: Object.freeze([
    "no key",
    "no provider setup",
    "no SDK",
    "no request",
    "no response",
    "no model output",
  ]),
});
