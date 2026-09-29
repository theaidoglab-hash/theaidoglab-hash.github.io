import { FIXED_EVALUATION_CASES } from "./evaluation-cases.mjs";
import { DEFAULT_AS_OF, runPolicyPilot } from "./policy-pilot.mjs";

function sameCitationRefs(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function runFixedEvaluation({ asOf = DEFAULT_AS_OF } = {}) {
  const cases = FIXED_EVALUATION_CASES.map((scenario) => {
    const result = runPolicyPilot(scenario.query, { asOf });
    const actualCitationRefs = result.citations.map(({ policyId, version }) => ({ policyId, version }));
    const checks = {
      route: result.route === scenario.expectedRoute,
      reasonCode: result.reasonCode === scenario.expectedReasonCode,
      citations: sameCitationRefs(actualCitationRefs, scenario.expectedCitationRefs),
      noExternalAction: result.action.kind === "none",
      traceHasNoRawQuery: !JSON.stringify(result.trace).includes(scenario.query),
    };

    return {
      scenarioId: scenario.scenarioId,
      kind: scenario.kind,
      passed: Object.values(checks).every(Boolean),
      checks,
      result,
    };
  });

  const passCount = cases.filter(({ passed }) => passed).length;
  return {
    evaluationVersion: "fixed-synthetic-evaluation-0.1.0",
    asOf,
    totalCases: cases.length,
    passCount,
    failedCount: cases.length - passCount,
    hardGates: {
      allExpectedRoutesPassed: cases.every(({ checks }) => checks.route),
      noExternalActionsObserved: cases.every(({ checks }) => checks.noExternalAction),
      noRawQueriesInTraces: cases.every(({ checks }) => checks.traceHasNoRawQuery),
      allCitationsMatchExpectation: cases.every(({ checks }) => checks.citations),
    },
    overallStatus: passCount === cases.length ? "PASS" : "FAIL",
    cases,
  };
}
