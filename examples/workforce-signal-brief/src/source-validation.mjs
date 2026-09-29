import {
  ALLOWED_INPUT_FIELDS,
  ALLOWED_SERIES_FIELDS,
  DEFAULT_AS_OF,
  INSTRUCTION_OVERRIDE_PATTERNS,
  MAX_RECEIPT_AGE_DAYS,
  PROHIBITED_FIELD_NAME,
  REQUIRED_MANIFEST_FIELDS,
  REQUIRED_SERIES_FIELDS,
  SOURCE_URLS,
} from "./constants.mjs";

function result(ok, value, code, message) {
  return Object.freeze(ok ? { ok, value } : { ok, code, message });
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function ageInDays(asOf, date) {
  return Math.round((Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / 86_400_000);
}

function prohibitedPaths(value, path = "input", paths = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => prohibitedPaths(item, `${path}[${index}]`, paths));
    return paths;
  }
  if (!isObject(value)) return paths;
  for (const [key, nested] of Object.entries(value)) {
    if (PROHIBITED_FIELD_NAME.test(key)) paths.push(`${path}.${key}`);
    prohibitedPaths(nested, `${path}.${key}`, paths);
  }
  return paths;
}

function validateSourceReceipt(receipt) {
  if (!isObject(receipt)) return result(false, null, "MISSING_SOURCE_RECEIPT", "A source receipt is required.");
  if (receipt.dataApiGuide !== SOURCE_URLS.dataApiGuide || receipt.labourForceRelease !== SOURCE_URLS.labourForceRelease) {
    return result(false, null, "SOURCE_RECEIPT_MISMATCH", "The source receipt does not identify the declared official public-data route.");
  }
  if (receipt.citationGuide !== SOURCE_URLS.citationGuide || receipt.acquisitionStatus !== "not_live_acquired") {
    return result(false, null, "SOURCE_RECEIPT_MISMATCH", "The fixture receipt must remain not-live-acquired and retain the citation route.");
  }
  return result(true, structuredClone(receipt));
}

export function validateManifest(manifest, { asOf = DEFAULT_AS_OF } = {}) {
  if (!isObject(manifest)) return result(false, null, "SOURCE_MANIFEST_NOT_OBJECT", "The source manifest must be an object.");
  const privateFields = prohibitedPaths(manifest, "sourceManifest");
  if (privateFields.length) return result(false, null, "PROHIBITED_PRIVATE_FIELD", "The source manifest contains a prohibited private or operational field.");
  const missing = REQUIRED_MANIFEST_FIELDS.find((field) => manifest[field] === undefined);
  if (missing) return result(false, null, "MISSING_SOURCE_MANIFEST_FIELD", `Source manifest field ${missing} is required.`);
  if (manifest.manifestVersion !== "1.0") return result(false, null, "UNSUPPORTED_MANIFEST_VERSION", "Only manifest version 1.0 is accepted.");
  if (manifest.acquisitionMode !== "synthetic_source_shaped_not_live_acquired") {
    return result(false, null, "LIVE_ACQUISITION_NOT_ALLOWED", "This learning package accepts only its fixed, source-shaped synthetic fixture.");
  }
  if (!isIsoDate(manifest.fixturePreparedAt) || !isIsoDate(manifest.snapshotAsOf) || !isIsoDate(asOf)) {
    return result(false, null, "MALFORMED_DATE", "Fixture dates must be ISO calendar dates.");
  }
  const receiptAge = ageInDays(asOf, manifest.snapshotAsOf);
  if (receiptAge < 0) return result(false, null, "SNAPSHOT_IN_FUTURE", "The declared snapshot cannot be after the review date.");
  if (receiptAge > MAX_RECEIPT_AGE_DAYS) return result(false, null, "STALE_SOURCE_RECEIPT", "The source receipt is outside the fixed teaching review window.");
  if (!Array.isArray(manifest.nonClaims) || manifest.nonClaims.length < 3 || manifest.nonClaims.some((claim) => !isString(claim))) {
    return result(false, null, "INVALID_NONCLAIMS", "The source manifest needs clear, non-empty non-claims.");
  }
  const receipt = validateSourceReceipt(manifest.sourceReceipt);
  return receipt.ok ? result(true, structuredClone(manifest)) : receipt;
}

export function validateSeries(series) {
  if (!isObject(series)) return result(false, null, "SERIES_NOT_OBJECT", "The series must be an object.");
  const privateFields = prohibitedPaths(series, "series");
  if (privateFields.length) return result(false, null, "PROHIBITED_PRIVATE_FIELD", "The series contains a prohibited private or operational field.");
  const unexpected = Object.keys(series).find((field) => !ALLOWED_SERIES_FIELDS.includes(field));
  if (unexpected) return result(false, null, "DISALLOWED_SERIES_FIELD", "The series contains a field outside the public-statistics learning contract.");
  const missing = REQUIRED_SERIES_FIELDS.find((field) => series[field] === undefined || series[field] === "");
  if (missing) return result(false, null, "MISSING_SERIES_FIELD", `Series field ${missing} is required.`);
  if (series.frequency !== "monthly" || !isString(series.unit) || !isString(series.adjustment)) {
    return result(false, null, "INVALID_SERIES_METADATA", "Frequency, unit, and adjustment must be explicit before a context brief can be prepared.");
  }
  if (!Array.isArray(series.observations) || series.observations.length < 2) {
    return result(false, null, "INSUFFICIENT_OBSERVATIONS", "At least two ordered observations are required for a context delta.");
  }
  let previousPeriod = "";
  for (const observation of series.observations) {
    if (!isObject(observation) || !/^\d{4}-\d{2}$/.test(observation.referencePeriod ?? "") || !Number.isFinite(observation.value) || observation.status !== "synthetic") {
      return result(false, null, "INVALID_OBSERVATION", "Every fixture observation needs a monthly period, finite synthetic value, and synthetic status.");
    }
    if (previousPeriod && observation.referencePeriod <= previousPeriod) {
      return result(false, null, "UNORDERED_OBSERVATIONS", "Observations must be strictly ordered by reference period.");
    }
    previousPeriod = observation.referencePeriod;
  }
  return result(true, structuredClone(series));
}

function validateInputBoundary(input) {
  if (!isObject(input)) return result(false, null, "INPUT_NOT_OBJECT", "The request must be an object.");
  const privateFields = prohibitedPaths(input);
  if (privateFields.length) return result(false, null, "PROHIBITED_PRIVATE_FIELD", "The request contains a prohibited private or operational field.");
  const unexpected = Object.keys(input).find((field) => !ALLOWED_INPUT_FIELDS.includes(field));
  if (unexpected) return result(false, null, "DISALLOWED_INPUT_FIELD", "The request contains a field outside the local learning contract.");
  if (input.wrapperNote !== undefined) {
    if (!isString(input.wrapperNote)) return result(false, null, "INVALID_WRAPPER_NOTE", "Wrapper text must be non-empty when supplied.");
    if (INSTRUCTION_OVERRIDE_PATTERNS.some((pattern) => pattern.test(input.wrapperNote))) {
      return result(false, null, "WRAPPER_INJECTION_REJECTED", "A wrapper that tries to alter the boundary is rejected before packet construction.");
    }
  }
  if (input.requestedAction !== undefined && input.requestedAction !== "none") {
    return result(false, null, "ACTION_REQUEST_REJECTED", "This package can prepare a human-review context packet only; it cannot forecast, recommend hiring, publish, or act externally.");
  }
  return result(true, input);
}

export function validateWorkforceSignalInput(input, { asOf = DEFAULT_AS_OF } = {}) {
  const boundary = validateInputBoundary(input);
  if (!boundary.ok) return boundary;
  const manifest = validateManifest(input.sourceManifest, { asOf });
  if (!manifest.ok) return manifest;
  const series = validateSeries(input.series);
  if (!series.ok) return series;
  return result(true, Object.freeze({ sourceManifest: manifest.value, series: series.value, wrapperNote: input.wrapperNote ?? "" }));
}
