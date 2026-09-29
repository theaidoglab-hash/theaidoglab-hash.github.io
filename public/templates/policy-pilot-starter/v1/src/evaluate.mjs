import { FIXED_EVALUATION_CASES } from "./evaluation-cases.mjs";
import { DEFAULT_AS_OF, routePolicyQuestion } from "./route-policy-question.mjs";

function sameCitationRefs(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function runFixedEvaluation({ corpus, asOf = DEFAULT_AS_OF } = {}) {
  const cases = FIXED_EVALUATION_CASES.map((scenario) => {
    const result = routePolicyQuestion({ corpus, request: scenario.request, asOf });
    const citations = result.citations?.map(({ policyId, version }) => ({ policyId, version })) ?? [];
    const checks = Object.freeze({
      route: result.route === scenario.expectedRoute,
      reasonCode: result.reasonCode === scenario.expectedReasonCode,
      citations: sameCitationRefs(citations, scenario.expectedCitationRefs),
      noExternalAction: result.actionBoundary.externalActionsPerformed === false,
      humanReviewRequired: result.actionBoundary.requiresHumanReview === true,
      traceOmitsRawQuestion: result.trace ? !JSON.stringify(result.trace).includes(scenario.request.question) : true,
    });
    return Object.freeze({
      scenarioId: scenario.scenarioId,
      passed: Object.values(checks).every(Boolean),
      checks,
    });
  });

  const passCount = cases.filter(({ passed }) => passed).length;
  return Object.freeze({
    evaluationVersion: "policy-pilot-fixed-synthetic-evaluation-v1",
    asOf,
    totalCases: cases.length,
    passCount,
    failedCount: cases.length - passCount,
    hardGates: Object.freeze({
      allExpectedRoutesPassed: cases.every(({ checks }) => checks.route),
      allExpectedCitationsPassed: cases.every(({ checks }) => checks.citations),
      noExternalActionsObserved: cases.every(({ checks }) => checks.noExternalAction),
      allHumanReviewBoundariesPresent: cases.every(({ checks }) => checks.humanReviewRequired),
      tracesOmitRawQuestions: cases.every(({ checks }) => checks.traceOmitsRawQuestion),
    }),
    overallStatus: passCount === cases.length ? "PASS" : "FAIL",
    cases: Object.freeze(cases),
  });
}
