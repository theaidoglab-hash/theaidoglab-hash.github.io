import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_SHARED_CONTEXT_KEYS = Object.freeze([
  "fixtureId",
  "sourceManifestVersion",
  "caseSetId",
  "actionContractMode",
  "evaluationProtocol",
]);

function readReport(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !Array.isArray(parsed.cases)) {
    throw new TypeError(`Evaluation report at ${filePath} must be an object with a cases array.`);
  }
  return parsed;
}

function caseIndex(report) {
  const index = new Map();
  for (const item of report.cases) {
    if (!item || typeof item.caseId !== "string" || typeof item.passed !== "boolean") {
      throw new TypeError("Every evaluation case must include string caseId and boolean passed fields.");
    }
    if (index.has(item.caseId)) throw new TypeError(`Duplicate case ID: ${item.caseId}`);
    index.set(item.caseId, item);
  }
  return index;
}

function summaryCase(item) {
  if (!item) return null;
  return {
    passed: item.passed,
    status: item.status ?? null,
    reasonCode: item.reasonCode ?? null,
  };
}

function comparisonContext(report, side) {
  const context = report.evaluationContext;
  const issues = [];

  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return { values: {}, issues: [`${side}_CONTEXT_MISSING`] };
  }

  const values = {};
  for (const key of REQUIRED_SHARED_CONTEXT_KEYS) {
    const value = context[key];
    if (typeof value !== "string" || value.length === 0) {
      issues.push(`${side}_CONTEXT_${key}_MISSING`);
      continue;
    }
    values[key] = value;
  }

  return { values, issues };
}

function compareEvaluationContext(baselineReport, candidateReport) {
  const baseline = comparisonContext(baselineReport, "BASELINE");
  const candidate = comparisonContext(candidateReport, "CANDIDATE");
  const issues = [...baseline.issues, ...candidate.issues];

  if (typeof baselineReport.changeId !== "string" || baselineReport.changeId.length === 0) {
    issues.push("BASELINE_CHANGE_ID_MISSING");
  }
  if (typeof candidateReport.changeId !== "string" || candidateReport.changeId.length === 0) {
    issues.push("CANDIDATE_CHANGE_ID_MISSING");
  }
  if (
    typeof baselineReport.changeId === "string" &&
    typeof candidateReport.changeId === "string" &&
    baselineReport.changeId !== candidateReport.changeId
  ) {
    issues.push("CHANGE_ID_MISMATCH");
  }

  for (const key of REQUIRED_SHARED_CONTEXT_KEYS) {
    if (baseline.values[key] && candidate.values[key] && baseline.values[key] !== candidate.values[key]) {
      issues.push(`CONTEXT_${key}_MISMATCH`);
    }
  }

  return {
    comparable: issues.length === 0,
    changeId: baselineReport.changeId ?? candidateReport.changeId ?? null,
    requiredSharedFields: REQUIRED_SHARED_CONTEXT_KEYS,
    baseline: baseline.values,
    candidate: candidate.values,
    issues,
  };
}

export function diffEvaluationReports(baselineReport, candidateReport) {
  const baseline = caseIndex(baselineReport);
  const candidate = caseIndex(candidateReport);
  const context = compareEvaluationContext(baselineReport, candidateReport);
  const caseIds = [...new Set([...baseline.keys(), ...candidate.keys()])].sort();
  const cases = caseIds.map((caseId) => {
    const before = baseline.get(caseId);
    const after = candidate.get(caseId);
    const regression = Boolean(before?.passed && (!after || !after.passed));
    const newlyPassed = Boolean((!before || !before.passed) && after?.passed);
    const changed = JSON.stringify(summaryCase(before)) !== JSON.stringify(summaryCase(after));
    return {
      caseId,
      before: summaryCase(before),
      after: summaryCase(after),
      changed,
      regression,
      newlyPassed,
    };
  });

  const regressions = cases.filter((item) => item.regression);
  const newlyPassed = cases.filter((item) => item.newlyPassed);
  return {
    diffVersion: "evidence-delta-diff-1.0",
    baselineReportType: baselineReport.reportType ?? "unspecified",
    candidateReportType: candidateReport.reportType ?? "unspecified",
    totalCases: cases.length,
    changedCases: cases.filter((item) => item.changed).length,
    regressionCount: regressions.length,
    newlyPassedCount: newlyPassed.length,
    result: !context.comparable
      ? "COMPARISON_NOT_COMPARABLE"
      : regressions.length === 0
        ? "NO_DECLARED_REGRESSION"
        : "DECLARED_REGRESSION",
    comparisonContext: context,
    reviewBoundary:
      "This comparison only contrasts supplied reports with matching fixture, source-manifest, case-set, action-contract, and evaluation-protocol context. A non-regression result is not a release approval, model evaluation, live-data check, or production claim.",
    cases,
  };
}

function runCli() {
  const [baselinePath, candidatePath] = process.argv.slice(2);
  if (!baselinePath || !candidatePath) {
    console.error("Usage: node scripts/eval-diff.mjs <baseline-report.json> <candidate-report.json>");
    process.exitCode = 1;
    return;
  }

  const report = diffEvaluationReports(readReport(baselinePath), readReport(candidatePath));
  console.log(JSON.stringify(report, null, 2));
  if (report.result !== "NO_DECLARED_REGRESSION") process.exitCode = 2;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) runCli();
