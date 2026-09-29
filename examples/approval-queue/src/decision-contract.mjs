import { createHash } from "node:crypto";

import { SYNTHETIC_FAQ } from "../data/synthetic-faq.mjs";

export const DECISION_CONTRACT_VERSION = "approval-queue-decision-contract-v1";

function freezeArray(items) {
  return Object.freeze(items.map(item => Object.freeze(item)));
}

function fixtureSnapshot() {
  return SYNTHETIC_FAQ.map(({ faqId, version, status, effectiveFrom, effectiveTo, sourceNote }) => ({
    faqId,
    version,
    status,
    effectiveFrom,
    effectiveTo,
    sourceNote,
  })).sort((left, right) => left.faqId.localeCompare(right.faqId));
}

function fixtureSnapshotHash() {
  return createHash("sha256").update(JSON.stringify(fixtureSnapshot())).digest("hex");
}

export const SYNTHETIC_DATA_RECEIPT = Object.freeze({
  receiptId: "synthetic-faq-snapshot-v1",
  sourceKind: "checked_in_fictional_fixture",
  recordCount: SYNTHETIC_FAQ.length,
  snapshotSha256: fixtureSnapshotHash(),
  containsRealCustomerData: false,
  permittedUse: "local_fixture_evaluation_only",
  sourceEligibility: "approved_and_effective_at_as_of_date",
  prohibitedMaterial: freezeArray([
    { id: "real_customer_data", rule: "Do not add real customer or account material." },
    { id: "private_policy_material", rule: "Do not add employer, client, or private policy material." },
    { id: "credentials", rule: "Do not add credentials, API keys, or connector settings." },
  ]),
});

export const DECISION_CONTRACT = Object.freeze({
  version: DECISION_CONTRACT_VERSION,
  status: "synthetic_local_reference",
  decision: Object.freeze({
    statement: "Prepare a cited synthetic FAQ draft for human review only when current approved synthetic evidence supports it; otherwise hand off or block.",
    finalDecisionOwner: "fictional FAQ Operations Owner",
    nonGoal: "No external message, ticket, refund, account read, payment, or record update may occur.",
  }),
  businessMeasurementPlan: Object.freeze({
    primaryOutcome: "reviewer-approved, source-supported draft rate within an agreed review window",
    unitOfAnalysis: "one de-identified draft that reached a human reviewer within the agreed observation window",
    numerator: "eligible drafts marked approved by a human reviewer with a source-support label",
    denominator: "eligible drafts that reached human review during the same observation window",
    comparisonBaseline: "manual review workflow defined before any authorised pilot begins",
    measurementStatus: "not_measured_in_this_fixture",
    requiredBeforeClaim: "authorised data, frozen definitions, a named measurement owner, reviewer labels, and an agreed observation window",
  }),
  guardrails: freezeArray([
    { id: "G-01", rule: "Every route has action.kind equal to none.", releaseBlocking: true },
    { id: "G-02", rule: "A draft cites one current approved synthetic FAQ record.", releaseBlocking: true },
    { id: "G-03", rule: "Every route requires human review; no route grants autonomous approval.", releaseBlocking: true },
    { id: "G-04", rule: "Trace output excludes the raw question.", releaseBlocking: true },
    { id: "G-05", rule: "The reference remains fixture-only, key-free, and offline.", releaseBlocking: true },
  ]),
  release: Object.freeze({
    localDecision: "LOCAL_REFERENCE_OK",
    localEvidence: "npm test and npm run demo pass with the checked-in fictional fixture and no expanded authority",
    holdDecision: "HOLD_FOR_HUMAN_REVIEW",
    rollbackDecision: "STOP_AND_RETURN_TO_MANUAL_REVIEW",
    rollbackAction: "Reject the local candidate, restore the last fixture-validated revision, and route work to manual review.",
    productionStatus: "not_authorised_or_implemented",
  }),
  nonClaims: freezeArray([
    { id: "N-01", statement: "No business, quality, safety, review-time, cost, or revenue result is measured or claimed." },
    { id: "N-02", statement: "No live model, API, credential, network request, customer, or external system is used." },
    { id: "N-03", statement: "A local passing fixture does not prove production readiness or approval." },
  ]),
});

function reviewerInstruction(route) {
  if (route === "draft_for_human_approval") {
    return Object.freeze({
      status: "pending_human_approval",
      nextStep: "Inspect the cited synthetic source and decide whether to approve, reject, or rewrite the draft manually.",
    });
  }

  if (route === "blocked") {
    return Object.freeze({
      status: "manual_work_required",
      nextStep: "Keep the requested external action outside this workflow and use the existing manual process.",
    });
  }

  return Object.freeze({
    status: "handoff_required",
    nextStep: "Resolve the missing, unsafe, stale, or unavailable condition through manual review before any new proposal.",
  });
}

export function createDecisionReceipt({ route, reasonCode, citations, action, trace }) {
  return Object.freeze({
    contractVersion: DECISION_CONTRACT_VERSION,
    localOnly: true,
    route,
    reasonCode,
    sourceReceipt: SYNTHETIC_DATA_RECEIPT,
    sourceEvidence: Object.freeze(citations.map(({ faqId, version }) => Object.freeze({ faqId, version }))),
    businessMeasurementStatus: DECISION_CONTRACT.businessMeasurementPlan.measurementStatus,
    actionVerified: action.kind === "none" && action.status === "not_executed",
    rawQuestionStored: trace.rawQuestionStored,
    reviewer: reviewerInstruction(route),
    releaseDecision: DECISION_CONTRACT.release.localDecision,
    productionStatus: DECISION_CONTRACT.release.productionStatus,
  });
}
