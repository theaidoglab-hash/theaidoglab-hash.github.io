import { createHash } from "node:crypto";

import { DEFAULT_AS_OF, noAction, validateRequest } from "./contracts.mjs";
import { createDecisionReceipt } from "./decision-contract.mjs";
import { createDeterministicMockResponse } from "./mock-response.mjs";
import { retrieveApprovedFaq } from "./retrieval.mjs";
import { classifySafetyRisk } from "./safety.mjs";

function fingerprint(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function makeTrace(request, asOf, retrieval = null) {
  return Object.freeze({
    requestId: request.requestId,
    questionFingerprint: fingerprint(request.question),
    rawQuestionStored: false,
    asOf,
    retrieval: retrieval
      ? Object.freeze({
          selectedFaqId: retrieval.selected?.faqId ?? null,
          selectedScore: retrieval.selectedScore,
          rejectedCandidates: retrieval.rejected,
        })
      : null,
  });
}

function withDecisionReceipt(result) {
  return Object.freeze({
    ...result,
    decisionReceipt: createDecisionReceipt(result),
  });
}

function stoppedResult({ route, reasonCode, request, asOf, retrieval = null }) {
  return withDecisionReceipt({
    route,
    reasonCode,
    draft: null,
    citations: Object.freeze([]),
    action: noAction(reasonCode),
    reviewer: Object.freeze({ required: true, status: "handoff_required" }),
    trace: makeTrace(request, asOf, retrieval),
  });
}

export function runApprovalQueue(input, { asOf = DEFAULT_AS_OF, simulateMockFailure = false } = {}) {
  const request = validateRequest(input);
  const safetyRisk = classifySafetyRisk(request);

  if (safetyRisk) {
    return stoppedResult({ ...safetyRisk, request, asOf });
  }

  const retrieval = retrieveApprovedFaq(request.question, { asOf });
  if (!retrieval.selected) {
    return stoppedResult({
      route: "handoff",
      reasonCode: "no_current_approved_faq_support",
      request,
      asOf,
      retrieval,
    });
  }

  try {
    const mock = createDeterministicMockResponse({ faq: retrieval.selected, simulateFailure: simulateMockFailure });
    return withDecisionReceipt({
      route: "draft_for_human_approval",
      reasonCode: "current_approved_faq_cited",
      draft: Object.freeze({
        text: mock.draftText,
        provider: mock.provider,
        network: mock.network,
        apiCallMade: mock.apiCallMade,
      }),
      citations: Object.freeze([mock.citation]),
      action: noAction("draft_only"),
      reviewer: Object.freeze({ required: true, status: "pending_human_approval" }),
      trace: makeTrace(request, asOf, retrieval),
    });
  } catch {
    return stoppedResult({
      route: "handoff",
      reasonCode: "deterministic_mock_unavailable",
      request,
      asOf,
      retrieval,
    });
  }
}
