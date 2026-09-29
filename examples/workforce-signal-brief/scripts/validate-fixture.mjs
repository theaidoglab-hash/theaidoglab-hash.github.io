import { validateFixtureBundle } from "../src/evaluate.mjs";

const validation = validateFixtureBundle();
console.log(JSON.stringify(validation, null, 2));
if (validation.overallStatus !== "PASS") process.exitCode = 2;
