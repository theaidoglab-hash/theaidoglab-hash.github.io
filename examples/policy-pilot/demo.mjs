import { runFixedEvaluation } from "./src/evaluate.mjs";

const report = runFixedEvaluation();

console.log("PolicyPilot local learning reference — entirely synthetic, read-only, not production.");
console.log(JSON.stringify(report, null, 2));
