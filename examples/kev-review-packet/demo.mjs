import { runFixedEvaluation, validateFixtureBundle } from "./src/evaluate.mjs";

const fixtureValidation = validateFixtureBundle();
const evaluation = runFixedEvaluation();

const demoReport = {
  title: "KEV Review Packet local portfolio reference",
  status: evaluation.overallStatus,
  dataRoute: {
    actualPublicDataRoute:
      "CISA publishes a canonical KEV JSON feed and an official schema reference. A future, separately approved acquisition step could use that route.",
    includedDataMode: "fixture_not_live_acquired",
    localRunBoundary: "This demo reads only the fixed repository fixture. It does not download, query, scan, patch, notify, or contact anything.",
  },
  evidenceMap: {
    technicalEvidence: [
      "Strict public-field allowlist and deterministic source-manifest validation.",
      "A two-outcome contract: source-grounded packet or SOURCE_REJECTED.",
      "A permanent evidence-only action contract and privacy-minimised trace.",
      "Ten fixed acceptance cases, including malformed data, stale source, injection, and action-boundary failures.",
      "A static gpt-5-mini Responses request shape and optional Promptfoo configurations that are never executed here.",
    ],
    nonTechnicalBusinessEvidence: [
      "A fictional security assurance reviewer needs a reviewable source receipt before a human decision process begins.",
      "The scope makes ownership explicit: public catalog evidence is not an organisation asset finding or remediation decision.",
      "The release materials require a reviewer to inspect changed cases, non-claims, and rollback conditions.",
    ],
    endToEndWorkflow: [
      "Receive a fixed public-field KEV record and a fixture-labeled source receipt.",
      "Reject private, asset, operational, stale, malformed, injected, or action-seeking input deterministically.",
      "Build only a source-grounded evidence packet when every source and schema gate passes.",
      "Run local fixture validation, fixed evaluation, an evidence delta review, and a human release gate outside this package.",
    ],
    nonClaims: [
      "No live CISA feed was retrieved.",
      "No model, Promptfoo, credential, or network call ran.",
      "No asset exposure, patch priority, Australian SLA, business impact, security posture, or production readiness is claimed.",
    ],
  },
  fixtureValidation: {
    overallStatus: fixtureValidation.overallStatus,
    record: fixtureValidation.record.ok ? "PASS" : fixtureValidation.record.code,
    manifest: fixtureValidation.manifest.ok ? "PASS" : fixtureValidation.manifest.code,
  },
  fixedEvaluation: {
    overallStatus: evaluation.overallStatus,
    totalCases: evaluation.totalCases,
    passCount: evaluation.passCount,
    hardGates: evaluation.hardGates,
    cases: evaluation.cases.map((scenario) => ({
      caseId: scenario.caseId,
      status: scenario.status,
      reasonCode: scenario.reasonCode,
      passed: scenario.passed,
    })),
  },
};

console.log(JSON.stringify(demoReport, null, 2));

if (fixtureValidation.overallStatus !== "PASS" || evaluation.overallStatus !== "PASS") process.exitCode = 1;
