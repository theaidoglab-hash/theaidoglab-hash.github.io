import { FIXED_CASES } from "../data/fixed-cases.mjs";
import { buildKevReviewPacket } from "./build-review-packet.mjs";

function evaluateCase(testCase) {
  const result = buildKevReviewPacket(structuredClone(testCase.input));
  const routePassed = result.route === testCase.expectedRoute;
  const reasonPassed = result.reasonCode === testCase.expectedReasonCode;
  const ransomwarePassed = testCase.expectedRansomwareValue === undefined
    || result.packet?.record.knownRansomwareCampaignUse === testCase.expectedRansomwareValue;
  const noActionsPassed = result.actionBoundary.externalActionsPerformed === false
    && result.actionBoundary.permittedActions.length === 0;

  return Object.freeze({
    id: testCase.id,
    status: routePassed && reasonPassed && ransomwarePassed && noActionsPassed ? "PASS" : "FAIL",
    observed: Object.freeze({
      route: result.route,
      reasonCode: result.reasonCode,
      ransomwareValue: result.packet?.record.knownRansomwareCampaignUse ?? null,
      externalActionsPerformed: result.actionBoundary.externalActionsPerformed,
    }),
  });
}

export function runFixedEvaluation() {
  const cases = Object.freeze(FIXED_CASES.map(evaluateCase));
  const passCount = cases.filter(({ status }) => status === "PASS").length;
  return Object.freeze({
    evaluationVersion: "1.0.0",
    scope: "six fixed synthetic local cases",
    overallStatus: passCount === cases.length ? "PASS" : "FAIL",
    passCount,
    caseCount: cases.length,
    hardGates: Object.freeze({
      expectedRoutesAndReasonCodesPassed: passCount === cases.length,
      unknownValuePreserved: cases.find(({ id }) => id === "unknown-is-preserved")?.status === "PASS",
      noExternalActionsObserved: cases.every(({ observed }) => observed.externalActionsPerformed === false),
    }),
    cases,
  });
}
