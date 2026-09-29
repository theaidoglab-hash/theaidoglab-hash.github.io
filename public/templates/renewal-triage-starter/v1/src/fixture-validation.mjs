export class FixtureValidationError extends Error {
  constructor(code) {
    super(code);
    this.name = "FixtureValidationError";
    this.code = code;
  }
}

function assertCondition(condition, code) {
  if (!condition) {
    throw new FixtureValidationError(code);
  }
}

function isPositiveFiniteNumber(value) {
  return Number.isFinite(value) && value > 0;
}

export function validateSyntheticRenewalSnapshot(snapshot) {
  assertCondition(snapshot && typeof snapshot === "object", "SNAPSHOT_REQUIRED");
  assertCondition(snapshot.provenance === "synthetic_fixture_only", "SYNTHETIC_PROVENANCE_REQUIRED");
  assertCondition(typeof snapshot.version === "string" && snapshot.version.length > 0, "VERSION_REQUIRED");
  assertCondition(typeof snapshot.asOf === "string" && snapshot.asOf.length > 0, "AS_OF_REQUIRED");
  assertCondition(Array.isArray(snapshot.records) && snapshot.records.length > 0, "RECORDS_REQUIRED");

  const seenAccountIds = new Set();

  for (const record of snapshot.records) {
    assertCondition(record && typeof record === "object", "RECORD_OBJECT_REQUIRED");
    assertCondition(/^SYN-RN-\d{3}$/.test(record.accountId), "SYNTHETIC_ACCOUNT_ID_REQUIRED");
    assertCondition(!seenAccountIds.has(record.accountId), "DUPLICATE_ACCOUNT_ID");
    seenAccountIds.add(record.accountId);
    assertCondition(Number.isFinite(record.rawRiskSignal) && record.rawRiskSignal >= 0 && record.rawRiskSignal <= 1, "RISK_SIGNAL_OUT_OF_RANGE");
    assertCondition(isPositiveFiniteNumber(record.syntheticRenewalValueUnits), "RENEWAL_VALUE_REQUIRED");
    assertCondition(Number.isFinite(record.syntheticOfflineReviewValueUnits) && record.syntheticOfflineReviewValueUnits >= 0, "OFFLINE_UTILITY_REQUIRED");
    assertCondition(typeof record.reviewEligible === "boolean", "REVIEW_ELIGIBILITY_REQUIRED");
  }

  return Object.freeze({
    recordCount: snapshot.records.length,
    eligibleRecordCount: snapshot.records.filter((record) => record.reviewEligible).length,
  });
}

export function validateCapacity(capacity) {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new FixtureValidationError("CAPACITY_MUST_BE_POSITIVE_INTEGER");
  }
}
