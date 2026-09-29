const REQUIRED_FEATURES = [
  "usageDaysLast30",
  "supportTicketsLast30",
  "daysToRenewal",
  "estimatedReviewValueUnits",
  "isReviewEligible",
];

function isValidDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function dateAfter(left, right) {
  return new Date(left).getTime() > new Date(right).getTime();
}

export function validateSyntheticSnapshot(snapshot) {
  const errors = [];

  if (!snapshot || typeof snapshot !== "object") {
    return { valid: false, errors: ["snapshot must be an object"] };
  }
  if (typeof snapshot.version !== "string" || !snapshot.version.startsWith("synthetic-renewal-snapshot-")) {
    errors.push("snapshot version must use the synthetic-renewal-snapshot-* contract");
  }
  if (snapshot.provenance !== "synthetic_authoring_only") {
    errors.push("snapshot provenance must be synthetic_authoring_only");
  }
  if (!isValidDate(snapshot.asOf)) {
    errors.push("snapshot asOf must be an ISO date");
  }
  if (!Array.isArray(snapshot.records) || snapshot.records.length === 0) {
    errors.push("snapshot must contain at least one synthetic record");
  }

  const seenIds = new Set();
  for (const [index, record] of (snapshot.records ?? []).entries()) {
    const prefix = `record[${index}]`;
    if (!record || typeof record !== "object") {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    if (typeof record.accountId !== "string" || !record.accountId.startsWith("SYN-")) {
      errors.push(`${prefix}.accountId must use a synthetic SYN-* identifier`);
    } else if (seenIds.has(record.accountId)) {
      errors.push(`${prefix}.accountId must be unique`);
    } else {
      seenIds.add(record.accountId);
    }

    for (const feature of REQUIRED_FEATURES) {
      if (!(feature in (record.observedFeatures ?? {}))) {
        errors.push(`${prefix}.observedFeatures.${feature} is required`);
      }
      if (!isValidDate(record.featureAvailableAt?.[feature])) {
        errors.push(`${prefix}.featureAvailableAt.${feature} must be an ISO date`);
      }
    }

    if (![0, 1].includes(record.outcome?.nonRenewalWithin30d)) {
      errors.push(`${prefix}.outcome.nonRenewalWithin30d must be 0 or 1`);
    }
    if (!isValidDate(record.outcome?.labelAvailableAt)) {
      errors.push(`${prefix}.outcome.labelAvailableAt must be an ISO date`);
    } else if (isValidDate(snapshot.asOf) && !dateAfter(record.outcome.labelAvailableAt, snapshot.asOf)) {
      errors.push(`${prefix}.outcome.labelAvailableAt must be after snapshot.asOf`);
    }
    if (typeof record.outcome?.observedReviewUtilityUnits !== "number") {
      errors.push(`${prefix}.outcome.observedReviewUtilityUnits must be numeric`);
    }
  }

  return {
    valid: errors.length === 0,
    schemaVersion: snapshot.schemaVersion,
    snapshotVersion: snapshot.version,
    recordCount: snapshot.records?.length ?? 0,
    errors,
  };
}

export function assertValidSyntheticSnapshot(snapshot) {
  const result = validateSyntheticSnapshot(snapshot);
  if (!result.valid) {
    throw new Error(`synthetic snapshot schema check failed: ${result.errors.join("; ")}`);
  }
  return result;
}
