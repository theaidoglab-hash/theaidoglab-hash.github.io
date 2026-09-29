function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

export const PILOT_STATES = Object.freeze([
  "PLANNING_ONLY",
  "SHADOW_REVIEW",
  "OWNER_APPROVED_PILOT",
  "OUTCOME_OBSERVATION",
  "HOLD",
  "ROLLBACK",
]);

export const SYNTHETIC_PILOT_DESIGN_V1 = deepFreeze({
  version: "synthetic-pilot-design-v1",
  provenance: "synthetic_authoring_only",
  designedAt: "2026-03-10T00:00:00.000Z",
  requestedState: "PLANNING_ONLY",
  actionContract: {
    connectionMode: "not_connected",
    externalActionsAllowed: false,
    automaticActions: [],
  },
  dataAccess: {
    dataOwner: null,
    allowedDataBoundary: null,
    retention: null,
  },
  operations: {
    operationalOwner: null,
    humanReviewer: null,
  },
  comparison: null,
  measurements: {
    primaryWorkflowMetric: null,
    safetyGuardrail: null,
    delayedOutcome: null,
  },
  rollback: null,
});

export const SYNTHETIC_OWNER_APPROVED_PILOT_DESIGN_V1 = deepFreeze({
  version: "synthetic-owner-approved-pilot-design-v1",
  provenance: "synthetic_authoring_only",
  designedAt: "2026-03-10T00:00:00.000Z",
  requestedState: "OWNER_APPROVED_PILOT",
  actionContract: {
    connectionMode: "not_connected",
    externalActionsAllowed: false,
    automaticActions: [],
  },
  dataAccess: {
    dataOwner: {
      role: "synthetic_data_owner",
      approvalScope: "synthetic_design_only",
      approvedAt: "2026-03-10T00:00:00.000Z",
    },
    allowedDataBoundary: {
      allowed: ["versioned_synthetic_review_packets"],
      excluded: ["customer_data", "account_data", "contact_data", "credentials", "live_system_records"],
    },
    retention: {
      expiresAt: "2026-04-10T00:00:00.000Z",
      deletionOwner: "synthetic_data_owner",
    },
  },
  operations: {
    operationalOwner: "synthetic_review_operations_owner",
    humanReviewer: "designated_human_reviewer",
  },
  comparison: {
    strategy: "pre_registered_shadow_baseline_vs_candidate",
    frozenAt: "2026-03-10T00:00:00.000Z",
    assignmentUnit: "synthetic_review_packet",
    baselineVersion: "value-aware-baseline-v1",
    candidateVersion: "risk-only-candidate-v1",
  },
  measurements: {
    primaryWorkflowMetric: {
      name: "review_packet_completion_rate",
      definition: "Share of synthetic review packets completed against the pre-registered checklist within the declared review window.",
      claimBoundary: "synthetic_workflow_observation_only",
    },
    safetyGuardrail: {
      name: "external_action_breach_count",
      maximumAllowed: 0,
      responseIfBreached: "hold_and_investigate",
    },
    delayedOutcome: {
      name: "authorised_business_outcome_not_collected",
      availableAfter: "a separately authorised observation window",
      claimStatus: "NOT_OBSERVED",
    },
  },
  rollback: {
    trigger: "any hard safety breach, comparison protocol change, or failed primary workflow gate",
    action: "hold the candidate, retain the baseline, and require a human review before another run",
  },
});
