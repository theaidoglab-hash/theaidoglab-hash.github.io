// Static design note only. This file is not an API integration or runnable request.
export const RESPONSES_API_GPT_5_MINI_SEAM = Object.freeze({
  status: "design_note_only_not_executed",
  purpose: "Show where a separately authorised model experiment could sit after the deterministic packet boundary.",
  requestShape: Object.freeze({
    api: "Responses API",
    method: "POST",
    path: "/v1/responses",
    model: "gpt-5-mini",
    store: false,
    allowedInput: "A previously validated, synthetic local review packet only.",
    expectedOutput: "A reviewer-facing explanation that repeats the action boundary.",
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
