import { createHash } from "node:crypto";

import {
  ALLOWED_OPERATION,
  DEFAULT_AS_OF,
  RequestValidationError,
  STARTER_BOUNDARY,
  STARTER_VERSION,
  noAction,
  validateRequest,
} from "./contracts.mjs";
import { createDeterministicDraft } from "./deterministic-draft.mjs";
import {
  FixtureValidationError,
  createSyntheticSourceReceipt,
  validateSyntheticFaqSnapshot,
} from "./fixture-validation.mjs";
import { retrieveCurrentApprovedFaq } from "./retrieval.mjs";
import { classifySafetyRisk } from "./safety.mjs";

const FUTURE_MEASUREMENT = Object.freeze({
  status: "not_measured_in_this_fixture",
  outcome: "reviewer-approved, source-supported draft rate within an agreed review window",
  baseline: "manual review workflow defined before a separately authorised pilot",
});

function fingerprint(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function traceFor(request, asOf, retrieval = null) {
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

function reviewerFor(route) {
  if (route === "DRAFT_FOR_HUMAN_APPROVAL") {
    return Object.freeze({
      required: true,
      status: "pending_human_approval",
      nextStep: "Inspect the cited synthetic FAQ and approve, reject, or rewrite the draft manually.",
    });
  }

  if (route === "BLOCKED_EXTERNAL_ACTION_REQUEST" || route === "BLOCKED_OUT_OF_SCOPE_OPERATION") {
    return Object.freeze({
      required: true,
      status: "manual_work_required",
      nextStep: "Keep the requested action outside this exercise and use the existing manual process.",
    });
  }

  return Object.freeze({
    required: true,
    status: "handoff_required",
    nextStep: "Resolve the missing, unsafe, stale, or unavailable condition through manual review before any new draft.",
  });
}

function stoppedResult({ route, reasonCode, request, asOf, sourceReceipt = null, retrieval = null }) {
  return Object.freeze({
    reportVersion: STARTER_VERSION,
    route,
    reasonCode,
    draft: null,
    citations: Object.freeze([]),
    action: noAction(reasonCode),
    actionBoundary: STARTER_BOUNDARY,
    reviewer: reviewerFor(route),
    trace: request ? traceFor(request, asOf, retrieval) : null,
    sourceReceipt,
    futureMeasurement: FUTURE_MEASUREMENT,
  });
}

export function routeApprovalQueue({ snapshot, request, asOf = DEFAULT_AS_OF, simulateDraftFailure = false }) {
  let sourceReceipt;
  try {
    validateSyntheticFaqSnapshot(snapshot);
    sourceReceipt = createSyntheticSourceReceipt(snapshot);
  } catch (error) {
    const reasonCode = error instanceof FixtureValidationError ? error.code : "UNEXPECTED_FIXTURE_VALIDATION_ERROR";
    return stoppedResult({ route: "BLOCKED_INVALID_FIXTURE", reasonCode, request: null, asOf });
  }

  let normalizedRequest;
  try {
    normalizedRequest = validateRequest(request);
  } catch (error) {
    const reasonCode = error instanceof RequestValidationError ? error.code : "UNEXPECTED_REQUEST_VALIDATION_ERROR";
    return stoppedResult({ route: "BLOCKED_INVALID_REQUEST", reasonCode, request: null, asOf, sourceReceipt });
  }

  if (normalizedRequest.operation !== ALLOWED_OPERATION) {
    return stoppedResult({
      route: "BLOCKED_OUT_OF_SCOPE_OPERATION",
      reasonCode: "OPERATION_NOT_ALLOWED",
      request: normalizedRequest,
      asOf,
      sourceReceipt,
    });
  }

  const safetyRisk = classifySafetyRisk(normalizedRequest);
  if (safetyRisk) {
    return stoppedResult({ ...safetyRisk, request: normalizedRequest, asOf, sourceReceipt });
  }

  const retrieval = retrieveCurrentApprovedFaq({ snapshot, question: normalizedRequest.question, asOf });
  if (!retrieval.selected) {
    return stoppedResult({
      route: "HANDOFF_NO_CURRENT_APPROVED_SUPPORT",
      reasonCode: "NO_CURRENT_APPROVED_FAQ_SUPPORT",
      request: normalizedRequest,
      asOf,
      sourceReceipt,
      retrieval,
    });
  }

  try {
    const draft = createDeterministicDraft({ faq: retrieval.selected, simulateFailure: simulateDraftFailure });
    return Object.freeze({
      reportVersion: STARTER_VERSION,
      route: "DRAFT_FOR_HUMAN_APPROVAL",
      reasonCode: "CURRENT_APPROVED_FAQ_CITED",
      draft: Object.freeze({
        text: draft.text,
        provider: draft.provider,
        network: draft.network,
        modelCallMade: draft.modelCallMade,
      }),
      citations: Object.freeze([draft.citation]),
      action: noAction("DRAFT_ONLY"),
      actionBoundary: STARTER_BOUNDARY,
      reviewer: reviewerFor("DRAFT_FOR_HUMAN_APPROVAL"),
      trace: traceFor(normalizedRequest, asOf, retrieval),
      sourceReceipt,
      futureMeasurement: FUTURE_MEASUREMENT,
    });
  } catch {
    return stoppedResult({
      route: "HANDOFF_DETERMINISTIC_TEMPLATE_UNAVAILABLE",
      reasonCode: "DETERMINISTIC_TEMPLATE_UNAVAILABLE",
      request: normalizedRequest,
      asOf,
      sourceReceipt,
      retrieval,
    });
  }
}
