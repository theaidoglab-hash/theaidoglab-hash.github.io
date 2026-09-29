import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SHARED_CONTEXT = Object.freeze([
  "fixtureId",
  "sourceManifestVersion",
  "caseSetId",
  "actionContractMode",
  "evaluationProtocol",
]);

function readReport(filePath) {
  const report = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!report || typeof report !== "object" || !Array.isArray(report.cases)) throw new TypeError("A report needs a cases array.");
  return report;
}

function indexCases(report) {
  const index = new Map();
  for (const item of report.cases) {
    if (!item || typeof item.caseId !== "string" || typeof item.passed !== "boolean") throw new TypeError("Each case needs caseId and passed.");
    if (index.has(item.caseId)) throw new TypeError(`Duplicate case ID: ${item.caseId}`);
    index.set(item.caseId, item);
  }
  return index;
}

function comparisonIssues(baseline, candidate) {
  const issues = [];
  if (baseline.changeId !== candidate.changeId) issues.push("CHANGE_ID_MISMATCH");
  for (const key of SHARED_CONTEXT) {
    const left = baseline.evaluationContext?.[key];
    const right = candidate.evaluationContext?.[key];
    if (typeof left !== "string" || !left) issues.push(`BASELINE_${key}_MISSING`);
    if (typeof right !== "string" || !right) issues.push(`CANDIDATE_${key}_MISSING`);
    if (left && right && left !== right) issues.push(`CONTEXT_${key}_MISMATCH`);
  }
  return issues;
}

export function diffEvaluationReports(baselineReport, candidateReport) {
  const before = indexCases(baselineReport);
  const after = indexCases(candidateReport);
  const issues = comparisonIssues(baselineReport, candidateReport);
  const caseIds = [...new Set([...before.keys(), ...after.keys()])].sort();
  const cases = caseIds.map((caseId) => {
    const baseline = before.get(caseId) ?? null;
    const candidate = after.get(caseId) ?? null;
    return Object.freeze({
      caseId,
      before: baseline ? { passed: baseline.passed, status: baseline.status, reasonCode: baseline.reasonCode } : null,
      after: candidate ? { passed: candidate.passed, status: candidate.status, reasonCode: candidate.reasonCode } : null,
      regression: Boolean(baseline?.passed && !candidate?.passed),
      newlyPassed: Boolean(!baseline?.passed && candidate?.passed),
    });
  });
  const regressions = cases.filter((item) => item.regression);
  return Object.freeze({
    diffVersion: "evidence-delta-diff-1.0",
    changeId: baselineReport.changeId ?? candidateReport.changeId ?? null,
    totalCases: cases.length,
    regressionCount: regressions.length,
    newlyPassedCount: cases.filter((item) => item.newlyPassed).length,
    result: issues.length ? "COMPARISON_NOT_COMPARABLE" : regressions.length ? "DECLARED_REGRESSION" : "NO_DECLARED_REGRESSION",
    comparisonContext: Object.freeze({ comparable: issues.length === 0, requiredSharedFields: SHARED_CONTEXT, issues }),
    reviewBoundary: "This compares only supplied fixture reports. A non-regression result is not a live-data check, model evaluation, release approval, forecast, or production claim.",
    cases,
  });
}

function runCli() {
  const [baselinePath, candidatePath] = process.argv.slice(2);
  if (!baselinePath || !candidatePath) {
    console.error("Usage: node scripts/eval-diff.mjs <baseline-report.json> <candidate-report.json>");
    process.exitCode = 1;
    return;
  }
  const diff = diffEvaluationReports(readReport(baselinePath), readReport(candidatePath));
  console.log(JSON.stringify(diff, null, 2));
  if (diff.result !== "NO_DECLARED_REGRESSION") process.exitCode = 2;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) runCli();
