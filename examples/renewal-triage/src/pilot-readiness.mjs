import { ACTION_CONTRACT } from "./contracts.mjs";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDateAfter(value, reference) {
  const target = Date.parse(value);
  const base = Date.parse(reference);
  return Number.isFinite(target) && Number.isFinite(base) && target > base;
}

function hasAllowedDataBoundary(boundary) {
  return Array.isArray(boundary?.allowed)
    && boundary.allowed.length > 0
    && Array.isArray(boundary?.excluded)
    && boundary.excluded.length > 0;
}

function hasFrozenComparison(comparison) {
  return isNonEmptyString(comparison?.strategy)
    && isNonEmptyString(comparison?.frozenAt)
    && isNonEmptyString(comparison?.assignmentUnit)
    && isNonEmptyString(comparison?.baselineVersion)
    && isNonEmptyString(comparison?.candidateVersion);
}

function hasPrimaryWorkflowMetric(metric) {
  return isNonEmptyString(metric?.name)
    && isNonEmptyString(metric?.definition)
    && isNonEmptyString(metric?.claimBoundary);
}

function hasSafetyGuardrail(guardrail) {
  return isNonEmptyString(guardrail?.name)
    && Number.isFinite(guardrail?.maximumAllowed)
    && isNonEmptyString(guardrail?.responseIfBreached);
}

function hasDelayedOutcomeDefinition(outcome) {
  return isNonEmptyString(outcome?.name)
    && isNonEmptyString(outcome?.availableAfter)
    && outcome?.claimStatus === "NOT_OBSERVED";
}

function actionBoundaryIsSafe(contract) {
  return ACTION_CONTRACT.allowedActions.length === 0
    && contract?.connectionMode === "not_connected"
    && contract?.externalActionsAllowed === false
    && Array.isArray(contract?.automaticActions)
    && contract.automaticActions.length === 0;
}

export function evaluatePilotReadiness(design) {
  const checks = Object.freeze({
    syntheticProvenance: design?.provenance === "synthetic_authoring_only",
    decisionSupportBoundary: actionBoundaryIsSafe(design?.actionContract),
    dataOwner: isNonEmptyString(design?.dataAccess?.dataOwner?.role)
      && design?.dataAccess?.dataOwner?.approvalScope === "synthetic_design_only"
      && isNonEmptyString(design?.dataAccess?.dataOwner?.approvedAt),
    allowedDataBoundary: hasAllowedDataBoundary(design?.dataAccess?.allowedDataBoundary),
    retention: isValidDateAfter(design?.dataAccess?.retention?.expiresAt, design?.designedAt)
      && isNonEmptyString(design?.dataAccess?.retention?.deletionOwner),
    operationalOwner: isNonEmptyString(design?.operations?.operationalOwner),
    humanReviewer: isNonEmptyString(design?.operations?.humanReviewer),
    frozenComparison: hasFrozenComparison(design?.comparison),
    primaryWorkflowMetric: hasPrimaryWorkflowMetric(design?.measurements?.primaryWorkflowMetric),
    safetyGuardrail: hasSafetyGuardrail(design?.measurements?.safetyGuardrail),
    delayedOutcomeDefinition: hasDelayedOutcomeDefinition(design?.measurements?.delayedOutcome),
    rollbackRule: isNonEmptyString(design?.rollback?.trigger) && isNonEmptyString(design?.rollback?.action),
  });

  const blockers = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
  const requestedOwnerApprovedPilot = design?.requestedState === "OWNER_APPROVED_PILOT";
  const ownerApprovedPilotReady = requestedOwnerApprovedPilot && blockers.length === 0;

  return Object.freeze({
    reportVersion: "renewal-triage-pilot-readiness-v1",
    designVersion: design?.version ?? "unknown",
    requestedState: design?.requestedState ?? "PLANNING_ONLY",
    state: ownerApprovedPilotReady ? "OWNER_APPROVED_PILOT" : "PLANNING_ONLY",
    status: ownerApprovedPilotReady ? "READY_FOR_SYNTHETIC_OWNER_APPROVED_PILOT" : "BLOCKED",
    checks,
    blockers,
    requiresHumanApproval: true,
    syntheticOnly: true,
    deployable: false,
    automaticActions: [],
    outcomeClaimStatus: design?.measurements?.delayedOutcome?.claimStatus ?? "NOT_OBSERVED",
  });
}

export function assertPilotReadiness(result) {
  if (result.status !== "READY_FOR_SYNTHETIC_OWNER_APPROVED_PILOT") {
    throw new Error(`pilot readiness blocked: ${result.blockers.join(", ")}`);
  }
  if (result.deployable || result.automaticActions.length > 0) {
    throw new Error("pilot readiness must remain local-only and non-deployable");
  }
  return result;
}
