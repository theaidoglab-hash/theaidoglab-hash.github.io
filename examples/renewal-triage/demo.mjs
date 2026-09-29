import { SYNTHETIC_MONITORING_SNAPSHOT_V1, SYNTHETIC_RENEWAL_SNAPSHOT_V1 } from "./data/snapshot-v1.mjs";
import {
  SYNTHETIC_OWNER_APPROVED_PILOT_DESIGN_V1,
  SYNTHETIC_PILOT_DESIGN_V1,
} from "./data/pilot-design-v1.mjs";
import { evaluatePilotReadiness } from "./src/pilot-readiness.mjs";
import { runSyntheticWorkflow } from "./src/workflow.mjs";

const { report, releaseGate } = runSyntheticWorkflow({
  snapshot: SYNTHETIC_RENEWAL_SNAPSHOT_V1,
  monitoringSnapshot: SYNTHETIC_MONITORING_SNAPSHOT_V1,
  capacity: 2,
});

console.log("Renewal Triage local learning reference - synthetic only, offline, decision-support only.");
console.log(`Snapshot: ${report.snapshot.version} (${report.snapshot.recordCount} synthetic records)`);
console.log(`Capacity: ${report.capacity} human-review slots`);
console.log(
  `Generic average precision - baseline: ${report.models.baseline.ranking.averagePrecision}; candidate: ${report.models.candidate.ranking.averagePrecision}`,
);
console.log(
  `Offline synthetic queue utility - baseline: ${report.models.baseline.queueUtility.totalUtilityUnits}; candidate: ${report.models.candidate.queueUtility.totalUtilityUnits}`,
);
console.log(`Baseline queue: ${report.models.baseline.queue.selectedAccountIds.join(", ")}`);
console.log(`Candidate queue: ${report.models.candidate.queue.selectedAccountIds.join(", ")}`);
console.log(`Release gate: ${releaseGate.status} (${releaseGate.blockers.join(", ")})`);
console.log(`Monitoring: ${report.monitoring.result.status}; rollback: ${report.monitoring.rollbackPlan.status}`);
const defaultPilotReadiness = evaluatePilotReadiness(SYNTHETIC_PILOT_DESIGN_V1);
const completePilotReadiness = evaluatePilotReadiness(SYNTHETIC_OWNER_APPROVED_PILOT_DESIGN_V1);
console.log(`Pilot design default: ${defaultPilotReadiness.status} (${defaultPilotReadiness.blockers.join(", ")})`);
console.log(`Pilot design complete: ${completePilotReadiness.status}; deployable: ${completePilotReadiness.deployable}`);
console.log("No external action has run. Any real release or intervention remains outside this example.");
