export const syntheticRenewalSnapshot = Object.freeze({
  version: "renewal-triage-synthetic-snapshot-v1",
  provenance: "synthetic_fixture_only",
  asOf: "2026-01-15",
  records: Object.freeze([
    Object.freeze({
      accountId: "SYN-RN-001",
      rawRiskSignal: 0.95,
      syntheticRenewalValueUnits: 1,
      syntheticOfflineReviewValueUnits: 1,
      reviewEligible: true,
    }),
    Object.freeze({
      accountId: "SYN-RN-002",
      rawRiskSignal: 0.8,
      syntheticRenewalValueUnits: 20,
      syntheticOfflineReviewValueUnits: 15,
      reviewEligible: true,
    }),
    Object.freeze({
      accountId: "SYN-RN-003",
      rawRiskSignal: 0.7,
      syntheticRenewalValueUnits: 12,
      syntheticOfflineReviewValueUnits: 9,
      reviewEligible: true,
    }),
    Object.freeze({
      accountId: "SYN-RN-004",
      rawRiskSignal: 0.6,
      syntheticRenewalValueUnits: 18,
      syntheticOfflineReviewValueUnits: 11,
      reviewEligible: true,
    }),
    Object.freeze({
      accountId: "SYN-RN-005",
      rawRiskSignal: 0.99,
      syntheticRenewalValueUnits: 100,
      syntheticOfflineReviewValueUnits: 100,
      reviewEligible: false,
    }),
  ]),
});
