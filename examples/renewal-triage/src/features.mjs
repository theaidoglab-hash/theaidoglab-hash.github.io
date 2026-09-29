import { assertValidSyntheticSnapshot } from "./ingest.mjs";

export const SAFE_FEATURE_NAMES = Object.freeze([
  "usageDaysLast30",
  "supportTicketsLast30",
  "daysToRenewal",
  "estimatedReviewValueUnits",
  "isReviewEligible",
]);

const OUTCOME_OR_FUTURE_FIELD_NAMES = new Set([
  "label",
  "nonRenewalWithin30d",
  "outcome.nonRenewalWithin30d",
  "outcome.labelAvailableAt",
  "observedReviewUtilityUnits",
  "outcome.observedReviewUtilityUnits",
]);

function isAfter(left, right) {
  return new Date(left).getTime() > new Date(right).getTime();
}

export function assertPointInTimeFeatureSpec(featureNames) {
  const requested = featureNames ?? SAFE_FEATURE_NAMES;
  const forbidden = requested.filter(
    (name) => OUTCOME_OR_FUTURE_FIELD_NAMES.has(name) || !SAFE_FEATURE_NAMES.includes(name),
  );
  if (forbidden.length > 0) {
    throw new Error(`future-label leakage rejected: ${forbidden.join(", ")} is not an observed feature`);
  }
}

export function buildPointInTimeFeatures(snapshot, {
  asOf = snapshot.asOf,
  featureNames = SAFE_FEATURE_NAMES,
} = {}) {
  assertValidSyntheticSnapshot(snapshot);
  assertPointInTimeFeatureSpec(featureNames);

  if (isAfter(asOf, snapshot.asOf)) {
    throw new Error("feature asOf must not be later than the versioned snapshot asOf");
  }

  return snapshot.records.map((record) => {
    const featureRow = {
      accountId: record.accountId,
      snapshotVersion: snapshot.version,
      asOf,
    };

    for (const featureName of featureNames) {
      const availableAt = record.featureAvailableAt[featureName];
      if (isAfter(availableAt, asOf)) {
        throw new Error(
          `point-in-time feature rejected: ${record.accountId}.${featureName} was unavailable at ${asOf}`,
        );
      }
      featureRow[featureName] = record.observedFeatures[featureName];
    }

    return Object.freeze(featureRow);
  });
}
