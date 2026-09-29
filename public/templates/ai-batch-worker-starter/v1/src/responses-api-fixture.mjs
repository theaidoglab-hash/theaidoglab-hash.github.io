const MOCK_ONLY_STATUS = "mock_only_not_executed";

export function buildStaticResponsesRequestShape({ workItemId, sourceRevision }) {
  if (!/^SYN-BW-\d{3}$/.test(workItemId) || !/^v\d+$/.test(sourceRevision)) {
    throw new TypeError("Only a synthetic work item and source revision may enter the static request shape");
  }

  return Object.freeze({
    status: MOCK_ONLY_STATUS,
    endpoint: "POST /v1/responses",
    body: Object.freeze({
      model: "gpt-5-mini",
      store: false,
      instructions: "Draft a short factual note for a human reviewer. Do not request an external action or invent source content.",
      input: Object.freeze({
        fixtureStatus: "synthetic_fixture_only",
        workItemId,
        sourceRevision,
        requiredOutput: "DRAFT_FOR_HUMAN_REVIEW",
        externalActionRequested: false,
      }),
    }),
    nonClaims: Object.freeze([
      "This object is a static local fixture, not a request.",
      "No credential, SDK, network call, model output, price, latency, or compatibility result is represented.",
    ]),
  });
}
