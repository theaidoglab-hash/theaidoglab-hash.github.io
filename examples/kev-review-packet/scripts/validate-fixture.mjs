import { validateFixtureBundle } from "../src/evaluate.mjs";

const report = validateFixtureBundle();

console.log(
  JSON.stringify(
    {
      fixtureValidationVersion: report.fixtureValidationVersion,
      asOf: report.asOf,
      overallStatus: report.overallStatus,
      record: report.record.ok ? "PASS" : report.record.code,
      manifest: report.manifest.ok ? "PASS" : report.manifest.code,
      dataMode: "fixture_not_live_acquired",
      nonClaim: "No feed was downloaded or contacted during this validation.",
    },
    null,
    2,
  ),
);

if (report.overallStatus !== "PASS") process.exitCode = 1;
