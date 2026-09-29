import {
  ALLOWED_KEV_FIELDS,
  DEFAULT_AS_OF,
  INSTRUCTION_OVERRIDE_PATTERNS,
  MAX_SNAPSHOT_AGE_DAYS,
  PROHIBITED_FIELD_NAME,
  REQUIRED_KEV_FIELDS,
  REQUIRED_SOURCE_MANIFEST_FIELDS,
  SOURCE_URLS,
} from "./constants.mjs";

const ALLOWED_INPUT_FIELDS = new Set([
  "kevRecord",
  "sourceManifest",
  "wrapperNote",
  "requestedAction",
  "assetClaim",
]);
const ALLOWED_SOURCE_MANIFEST_FIELDS = new Set(REQUIRED_SOURCE_MANIFEST_FIELDS);
const ALLOWED_KEV_FIELD_SET = new Set(ALLOWED_KEV_FIELDS);
const CVE_PATTERN = /^CVE-[0-9]{4}-[0-9]{4,19}$/;
const CWE_PATTERN = /^CWE-[0-9]+$/;

function rejection(code, message) {
  return Object.freeze({ ok: false, code, message });
}

function acceptance(value) {
  return Object.freeze({ ok: true, value });
}

export function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function dayDistance(left, right) {
  const leftMs = new Date(`${left}T00:00:00.000Z`).getTime();
  const rightMs = new Date(`${right}T00:00:00.000Z`).getTime();
  return Math.round((leftMs - rightMs) / 86_400_000);
}

function collectProhibitedFieldPaths(value, path = "input", matches = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectProhibitedFieldPaths(item, `${path}[${index}]`, matches));
    return matches;
  }

  if (!isPlainObject(value)) return matches;

  for (const [key, nested] of Object.entries(value)) {
    const fieldPath = `${path}.${key}`;
    if (PROHIBITED_FIELD_NAME.test(key)) matches.push(fieldPath);
    collectProhibitedFieldPaths(nested, fieldPath, matches);
  }

  return matches;
}

function validateInputBoundary(input) {
  if (!isPlainObject(input)) {
    return rejection("INPUT_NOT_OBJECT", "The review input must be an object.");
  }

  if (input.wrapperNote !== undefined) {
    if (typeof input.wrapperNote !== "string") {
      return rejection("INVALID_WRAPPER_NOTE", "The wrapper note must be text when supplied.");
    }
    if (INSTRUCTION_OVERRIDE_PATTERNS.some((pattern) => pattern.test(input.wrapperNote))) {
      return rejection(
        "WRAPPER_INJECTION_REJECTED",
        "The wrapper note attempts to alter the review boundary and is rejected. Source prose remains data, not instructions.",
      );
    }
  }

  if (input.requestedAction !== undefined && input.requestedAction !== "none") {
    return rejection(
      "ACTION_REQUEST_REJECTED",
      "This reference produces evidence packets only and cannot scan, patch, create tickets, or perform an external action.",
    );
  }

  if (input.assetClaim !== undefined && isNonEmptyString(input.assetClaim)) {
    return rejection(
      "AMBIGUOUS_ASSET_SCOPE",
      "The packet cannot map a public catalog record to an organisation, asset, network, or inventory claim.",
    );
  }

  const inputForPrivateFieldCheck = { ...input };
  delete inputForPrivateFieldCheck.assetClaim;
  const prohibitedFields = collectProhibitedFieldPaths(inputForPrivateFieldCheck);
  if (prohibitedFields.length > 0) {
    return rejection(
      "PROHIBITED_PRIVATE_FIELD",
      "The review input contains a private, contact, network, asset, or operational field and is rejected before packet construction.",
    );
  }

  const unexpectedField = Object.keys(input).find((field) => !ALLOWED_INPUT_FIELDS.has(field));
  if (unexpectedField) {
    return rejection(
      "DISALLOWED_INPUT_FIELD",
      "The review input contains a field outside the evidence-packet contract.",
    );
  }

  return acceptance(input);
}

export function validateKevRecord(record) {
  if (!isPlainObject(record)) {
    return rejection("KEV_RECORD_NOT_OBJECT", "The KEV record must be an object.");
  }

  const prohibitedFields = collectProhibitedFieldPaths(record, "kevRecord");
  if (prohibitedFields.length > 0) {
    return rejection(
      "PROHIBITED_PRIVATE_FIELD",
      "The KEV record contains a private, contact, network, asset, or operational field.",
    );
  }

  const disallowedField = Object.keys(record).find((field) => !ALLOWED_KEV_FIELD_SET.has(field));
  if (disallowedField) {
    return rejection(
      "DISALLOWED_KEV_FIELD",
      "The KEV record contains a field outside the fixed public KEV allowlist.",
    );
  }

  const missingField = REQUIRED_KEV_FIELDS.find((field) => !isNonEmptyString(record[field]));
  if (missingField) {
    return rejection("MISSING_REQUIRED_FIELD", "The KEV record is missing a required public catalog field.");
  }

  if (!CVE_PATTERN.test(record.cveID)) {
    return rejection("MALFORMED_CVE", "The public CVE identifier does not match the accepted CVE format.");
  }

  for (const field of ["dateAdded", "dueDate"]) {
    if (!isIsoDate(record[field])) {
      return rejection("MALFORMED_DATE", "A public KEV date is not an ISO calendar date.");
    }
  }

  if (
    record.knownRansomwareCampaignUse !== undefined &&
    !["Known", "Unknown"].includes(record.knownRansomwareCampaignUse)
  ) {
    return rejection(
      "UNRECOGNIZED_RANSOMWARE_VALUE",
      "The ransomware-use field must preserve the supported source value or be omitted.",
    );
  }

  if (record.forensicTriage !== undefined && !["Yes", "No"].includes(record.forensicTriage)) {
    return rejection("UNRECOGNIZED_TRIAGE_VALUE", "The forensic-triage field is not a supported source value.");
  }

  if (record.notes !== undefined && typeof record.notes !== "string") {
    return rejection("INVALID_SOURCE_PROSE", "Source prose fields must remain strings and are never instructions.");
  }

  if (
    record.cwes !== undefined &&
    (!Array.isArray(record.cwes) || record.cwes.some((cwe) => !isNonEmptyString(cwe) || !CWE_PATTERN.test(cwe)))
  ) {
    return rejection("INVALID_CWE", "CWE values must use the public CWE identifier format.");
  }

  return acceptance(structuredClone(record));
}

function validateReceipt(receipt) {
  if (!isPlainObject(receipt)) {
    return rejection("MISSING_SOURCE_RECEIPT", "A complete public-source receipt is required.");
  }

  const canonicalFeed = receipt.canonicalFeed;
  const schema = receipt.schema;
  const license = receipt.license;
  const australianOperationalContext = receipt.australianOperationalContext;

  if (!isPlainObject(canonicalFeed) || canonicalFeed.catalogUrl !== SOURCE_URLS.catalog || canonicalFeed.feedUrl !== SOURCE_URLS.canonicalFeed) {
    return rejection("SOURCE_RECEIPT_MISMATCH", "The source receipt does not identify the canonical CISA KEV route.");
  }

  if (!isPlainObject(schema) || schema.schemaUrl !== SOURCE_URLS.schema) {
    return rejection("SOURCE_RECEIPT_MISMATCH", "The source receipt does not identify the official CISA schema repository URL.");
  }

  if (!isPlainObject(license) || license.licenseUrl !== SOURCE_URLS.license || license.license !== "CC0 1.0 Universal") {
    return rejection("SOURCE_RECEIPT_MISMATCH", "The source receipt does not identify the CISA KEV CC0 license.");
  }

  if (
    !isPlainObject(australianOperationalContext) ||
    australianOperationalContext.guidanceUrl !== SOURCE_URLS.acscPatchGuidance ||
    !/not.+service-level agreement/i.test(australianOperationalContext.role ?? "")
  ) {
    return rejection(
      "SOURCE_RECEIPT_MISMATCH",
      "The Australian context must remain explicitly separate from any CISA due date.",
    );
  }

  return acceptance(structuredClone(receipt));
}

export function validateSourceManifest(manifest, { asOf = DEFAULT_AS_OF } = {}) {
  if (!isPlainObject(manifest)) {
    return rejection("SOURCE_MANIFEST_NOT_OBJECT", "The source manifest must be an object.");
  }

  const prohibitedFields = collectProhibitedFieldPaths(manifest, "sourceManifest");
  if (prohibitedFields.length > 0) {
    return rejection(
      "PROHIBITED_PRIVATE_FIELD",
      "The source manifest contains a private, contact, network, asset, or operational field.",
    );
  }

  const unexpectedField = Object.keys(manifest).find((field) => !ALLOWED_SOURCE_MANIFEST_FIELDS.has(field));
  if (unexpectedField) {
    return rejection("DISALLOWED_SOURCE_MANIFEST_FIELD", "The source manifest contains an unsupported field.");
  }

  const missingField = REQUIRED_SOURCE_MANIFEST_FIELDS.find((field) => manifest[field] === undefined);
  if (missingField) {
    return rejection("MISSING_SOURCE_MANIFEST_FIELD", "The source manifest is incomplete.");
  }

  if (manifest.manifestVersion !== "1.0") {
    return rejection("UNSUPPORTED_MANIFEST_VERSION", "The fixture manifest version is not supported.");
  }

  if (manifest.acquisitionMode !== "fixture_not_live_acquired") {
    return rejection(
      "LIVE_ACQUISITION_NOT_ALLOWED",
      "This package accepts the fixed fixture route only and does not accept a live acquisition claim.",
    );
  }

  if (manifest.recordClassification !== "public_cisa_kev_fields_only") {
    return rejection("INVALID_RECORD_CLASSIFICATION", "The fixture must be limited to public CISA KEV fields.");
  }

  if (!isIsoDate(manifest.fixturePreparedAt) || !isIsoDate(manifest.snapshotAsOf) || !isIsoDate(asOf)) {
    return rejection("MALFORMED_DATE", "Fixture and review dates must be ISO calendar dates.");
  }

  const ageDays = dayDistance(asOf, manifest.snapshotAsOf);
  if (ageDays < 0) {
    return rejection("SNAPSHOT_IN_FUTURE", "The fixture snapshot is later than the declared review date.");
  }
  if (ageDays > MAX_SNAPSHOT_AGE_DAYS) {
    return rejection(
      "STALE_SNAPSHOT",
      "The declared fixture snapshot is outside the fixed review window and cannot support a packet.",
    );
  }

  if (!Array.isArray(manifest.nonClaims) || manifest.nonClaims.some((claim) => !isNonEmptyString(claim))) {
    return rejection("INVALID_NONCLAIMS", "The fixture manifest needs explicit, non-empty non-claims.");
  }

  const receiptResult = validateReceipt(manifest.sourceReceipt);
  if (!receiptResult.ok) return receiptResult;

  return acceptance(structuredClone(manifest));
}

export function validateReviewInput(input, { asOf = DEFAULT_AS_OF } = {}) {
  const boundaryResult = validateInputBoundary(input);
  if (!boundaryResult.ok) return boundaryResult;

  const manifestResult = validateSourceManifest(input.sourceManifest, { asOf });
  if (!manifestResult.ok) return manifestResult;

  const recordResult = validateKevRecord(input.kevRecord);
  if (!recordResult.ok) return recordResult;

  return acceptance(
    Object.freeze({
      kevRecord: recordResult.value,
      sourceManifest: manifestResult.value,
      wrapperNote: input.wrapperNote ?? "",
    }),
  );
}
