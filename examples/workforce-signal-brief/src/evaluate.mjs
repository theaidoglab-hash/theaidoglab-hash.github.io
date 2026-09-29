import { DEFAULT_AS_OF, RESULT_STATUS } from "./constants.mjs";
import { FIXED_EVALUATION_CASES } from "./evaluation-cases.mjs";
import { loadFixtureBundle } from "./fixture-loader.mjs";
import { validateManifest, validateSeries } from "./source-validation.mjs";
import { buildWorkforceSignalBrief } from "./workforce-signal-brief.mjs";

function noExternalAction(result) {
  return result.action.kind === "none" && result.action.mode === "evidence_only" && result.action.status === "not_executed";
}

function exactlyOneResultShape(result) {
  return result.status === RESULT_STATUS.READY ? Object.hasOwn(result, "packet") : !Object.hasOwn(result, "packet");
}

export function validateFixtureBundle({ asOf = DEFAULT_AS_OF } = {}) {
  const { sourceManifest, series } = loadFixtureBundle();
  const manifest = validateManifest(sourceManifest, { asOf });
  const seriesValidation = validateSeries(series);
  return Object.freeze({
    fixtureValidationVersion: "1.0",
    asOf,
    manifest,
    series: seriesValidation,
    overallStatus: manifest.ok && seriesValidation.ok ? "PASS" : "FAIL",
  });
}

export function runFixedEvaluation({ asOf = DEFAULT_AS_OF } = {}) {
  const cases = FIXED_EVALUATION_CASES.map((scenario) => {
    const result = buildWorkforceSignalBrief(structuredClone(scenario.input), { asOf });
    const serialised = JSON.stringify(result).toLowerCase();
    const checks = {
      expectedStatus: result.status === scenario.expectedStatus,
      expectedReasonCode: result.reasonCode === scenario.expectedReasonCode,
      exactlyOneResultShape: exactlyOneResultShape(result),
      noExternalAction: noExternalAction(result),
      rawInputNotRetained: result.trace.rawInputRetained === false,
      sourceProseNotExecuted: result.trace.sourceProseExecuted === false,
      latestPeriodPreserved: scenario.expectedLatestPeriod === undefined || result.packet?.seriesFacts.latest.referencePeriod === scenario.expectedLatestPeriod,
      noForbiddenPhrase: (scenario.forbiddenOutputPhrases ?? []).every((phrase) => !serialised.includes(phrase.toLowerCase())),
    };
    return Object.freeze({
      caseId: scenario.caseId,
      description: scenario.description,
      status: result.status,
      reasonCode: result.reasonCode,
      passed: Object.values(checks).every(Boolean),
      checks,
      result,
    });
  });
  const passCount = cases.filter((item) => item.passed).length;
  return Object.freeze({
    evaluationVersion: "workforce-signal-brief-fixed-evaluation-1.0",
    asOf,
    dataMode: "synthetic_source_shaped_not_live_acquired",
    totalCases: cases.length,
    passCount,
    failedCount: cases.length - passCount,
    hardGates: Object.freeze({
      allExpectedRoutesPassed: cases.every((item) => item.checks.expectedStatus),
      noExternalActionsObserved: cases.every((item) => item.checks.noExternalAction),
      readyOrSourceRejectedOnly: cases.every((item) => item.checks.exactlyOneResultShape),
      noRawInputRetained: cases.every((item) => item.checks.rawInputNotRetained),
      noSourceProseExecuted: cases.every((item) => item.checks.sourceProseNotExecuted),
      sourceFactsPreserved: cases.every((item) => item.checks.latestPeriodPreserved),
    }),
    overallStatus: passCount === cases.length ? "PASS" : "FAIL",
    cases,
  });
}
