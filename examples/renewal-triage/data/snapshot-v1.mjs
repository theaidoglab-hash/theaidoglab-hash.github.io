const AS_OF = "2026-01-31T00:00:00.000Z";
const LABEL_AVAILABLE_AT = "2026-03-02T00:00:00.000Z";

function syntheticRecord({
  accountId,
  usageDaysLast30,
  supportTicketsLast30,
  daysToRenewal,
  estimatedReviewValueUnits,
  isReviewEligible,
  nonRenewalWithin30d,
  observedReviewUtilityUnits,
}) {
  return {
    accountId,
    observedFeatures: {
      usageDaysLast30,
      supportTicketsLast30,
      daysToRenewal,
      estimatedReviewValueUnits,
      isReviewEligible,
    },
    featureAvailableAt: {
      usageDaysLast30: AS_OF,
      supportTicketsLast30: AS_OF,
      daysToRenewal: AS_OF,
      estimatedReviewValueUnits: AS_OF,
      isReviewEligible: AS_OF,
    },
    // Outcomes are deliberately separate from observed features. They are only
    // available after the prediction point and are permitted in offline evaluation.
    outcome: {
      nonRenewalWithin30d,
      labelAvailableAt: LABEL_AVAILABLE_AT,
      observedReviewUtilityUnits,
      utilityAvailableAt: LABEL_AVAILABLE_AT,
    },
  };
}

export const SYNTHETIC_RENEWAL_SNAPSHOT_V1 = Object.freeze({
  version: "synthetic-renewal-snapshot-v1",
  schemaVersion: "renewal-triage-schema-v1",
  provenance: "synthetic_authoring_only",
  asOf: AS_OF,
  target: {
    name: "synthetic_nonrenewal_within_30d",
    description: "Offline-only synthetic label; unavailable at the decision time.",
    labelAvailableAfter: AS_OF,
  },
  records: [
    syntheticRecord({
      accountId: "SYN-001",
      usageDaysLast30: 2,
      supportTicketsLast30: 6,
      daysToRenewal: 3,
      estimatedReviewValueUnits: 2,
      isReviewEligible: true,
      nonRenewalWithin30d: 1,
      observedReviewUtilityUnits: 2,
    }),
    syntheticRecord({
      accountId: "SYN-002",
      usageDaysLast30: 3,
      supportTicketsLast30: 5,
      daysToRenewal: 4,
      estimatedReviewValueUnits: 1,
      isReviewEligible: true,
      nonRenewalWithin30d: 1,
      observedReviewUtilityUnits: 1,
    }),
    syntheticRecord({
      accountId: "SYN-003",
      usageDaysLast30: 8,
      supportTicketsLast30: 3,
      daysToRenewal: 10,
      estimatedReviewValueUnits: 20,
      isReviewEligible: true,
      nonRenewalWithin30d: 1,
      observedReviewUtilityUnits: 20,
    }),
    syntheticRecord({
      accountId: "SYN-004",
      usageDaysLast30: 10,
      supportTicketsLast30: 2,
      daysToRenewal: 12,
      estimatedReviewValueUnits: 15,
      isReviewEligible: true,
      nonRenewalWithin30d: 1,
      observedReviewUtilityUnits: 15,
    }),
    syntheticRecord({
      accountId: "SYN-005",
      usageDaysLast30: 11,
      supportTicketsLast30: 2,
      daysToRenewal: 13,
      estimatedReviewValueUnits: 12,
      isReviewEligible: true,
      nonRenewalWithin30d: 0,
      observedReviewUtilityUnits: 0,
    }),
    syntheticRecord({
      accountId: "SYN-006",
      usageDaysLast30: 12,
      supportTicketsLast30: 1,
      daysToRenewal: 15,
      estimatedReviewValueUnits: 10,
      isReviewEligible: true,
      nonRenewalWithin30d: 0,
      observedReviewUtilityUnits: 0,
    }),
    syntheticRecord({
      accountId: "SYN-007",
      usageDaysLast30: 21,
      supportTicketsLast30: 0,
      daysToRenewal: 25,
      estimatedReviewValueUnits: 3,
      isReviewEligible: true,
      nonRenewalWithin30d: 0,
      observedReviewUtilityUnits: 0,
    }),
    syntheticRecord({
      accountId: "SYN-008",
      usageDaysLast30: 25,
      supportTicketsLast30: 0,
      daysToRenewal: 28,
      estimatedReviewValueUnits: 2,
      isReviewEligible: true,
      nonRenewalWithin30d: 0,
      observedReviewUtilityUnits: 0,
    }),
    // This intentionally high-risk synthetic record is not review-eligible.
    // It must never consume a person's queue capacity.
    syntheticRecord({
      accountId: "SYN-009",
      usageDaysLast30: 1,
      supportTicketsLast30: 6,
      daysToRenewal: 2,
      estimatedReviewValueUnits: 50,
      isReviewEligible: false,
      nonRenewalWithin30d: 1,
      observedReviewUtilityUnits: 50,
    }),
  ],
});

export const SYNTHETIC_MONITORING_SNAPSHOT_V1 = Object.freeze({
  version: "synthetic-renewal-monitoring-v1",
  provenance: "synthetic_authoring_only",
  observedAt: "2026-03-09T00:00:00.000Z",
  modelVersion: "risk-only-candidate-v1",
  metrics: {
    evidenceCoverage: 0.88,
    humanReviewAcceptanceRate: 0.55,
    unresolvedQueueRate: 0.18,
  },
});
