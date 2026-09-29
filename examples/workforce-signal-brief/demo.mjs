import { runFixedEvaluation } from "./src/evaluate.mjs";
import { loadFixtureBundle } from "./src/fixture-loader.mjs";
import { buildWorkforceSignalBrief } from "./src/workforce-signal-brief.mjs";

const packet = buildWorkforceSignalBrief(loadFixtureBundle());
const evaluation = runFixedEvaluation();
console.log(JSON.stringify({ packet, evaluation: { overallStatus: evaluation.overallStatus, totalCases: evaluation.totalCases, passCount: evaluation.passCount, hardGates: evaluation.hardGates } }, null, 2));
if (evaluation.overallStatus !== "PASS") process.exitCode = 2;
