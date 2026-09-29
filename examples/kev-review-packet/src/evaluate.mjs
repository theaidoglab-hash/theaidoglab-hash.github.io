import { DEFAULT_AS_OF, RESULT_STATUS } from "./constants.mjs";
import { FIXED_EVALUATION_CASES } from "./evaluation-cases.mjs";
import { loadFixtureBundle } from "./fixture-loader.mjs";
import { buildKevReviewPacket } from "./review-packet.mjs";
import { validateKevRecord, validateSourceManifest } from "./source-validation.mjs";

function hasNoExternalAction(result) {
  return (
    result.action.kind === "none" &&
    result.action.mode === "evidence_only" &&
    result.action.status === "not_executed" &&
    result.action.requiresHumanReview === true
  );
}

function packetExclusive(result) {
  if (result.status === RESULT_STATUS.READY) return Object.hasOwn(result, "packet");
  return !Object.hasOwn(result, "packet");
}

function ransomwareValue(result) {
  return result.packet?.record?.knownRansomwareCampaignUse;
}

export function validateFixtureBundle({ asOf = DEFAULT_AS_OF } = {}) {
  const { kevRecord, sourceManifest } = loadFixtureBundle();
  const record = validateKevRecord(kevRecord);
  const manifest = validateSourceManifest(sourceManifest, { asOf });
  return Object.freeze({
    fixtureValidationVersion: "1.0",
    asOf,
    record,
    manifest,
    overallStatus: record.ok && manifest.ok ? "PASS" : "FAIL",
  });
}

export function runFixedEvaluation({ asOf = DEFAULT_AS_OF } = {}) {
  const cases = FIXED_EVALUATION_CASES.map((scenario) => {
    const result = buildKevReviewPacket(structuredClone(scenario.input), { asOf });
    const serialisedResult = JSON.stringify(result).toLowerCase();
    const checks = {
      expectedStatus: result.status === scenario.expectedStatus,
      expectedReasonCode: result.reasonCode === scenario.expectedReasonCode,
      exactlyOnePermittedRoute: packetExclusive(result),
      noExternalAction: hasNoExternalAction(result),
      sourceProseNotExecuted: result.trace.sourceProseExecuted === false,
      rawInputNotRetained: result.trace.rawInputRetained === false,
      ransomwareValuePreserved:
        scenario.expectedRansomwareValue === undefined || ransomwareValue(result) === scenario.expectedRansomwareValue,
      noForbiddenPhrase: (scenario.forbiddenOutputPhrases ?? []).every(
        (phrase) => !serialisedResult.includes(phrase.toLowerCase()),
      ),
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

  const passCount = cases.filter((scenario) => scenario.passed).length;
  return Object.freeze({
    evaluationVersion: "kev-review-packet-fixed-evaluation-1.0",
    asOf,
    dataMode: "fixture_not_live_acquired",
    totalCases: cases.length,
    passCount,
    failedCount: cases.length - passCount,
    hardGates: Object.freeze({
      allExpectedRoutesPassed: cases.every((scenario) => scenario.checks.expectedStatus),
      noExternalActionsObserved: cases.every((scenario) => scenario.checks.noExternalAction),
      packetOrSourceRejectedOnly: cases.every((scenario) => scenario.checks.exactlyOnePermittedRoute),
      noRawInputRetained: cases.every((scenario) => scenario.checks.rawInputNotRetained),
      noSourceProseExecuted: cases.every((scenario) => scenario.checks.sourceProseNotExecuted),
      ransomwareValuesPreserved: cases.every((scenario) => scenario.checks.ransomwareValuePreserved),
    }),
    overallStatus: passCount === cases.length ? "PASS" : "FAIL",
    cases,
  });
}
