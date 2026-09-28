import { ALLOWED_RECORD_FIELDS, REQUIRED_RECORD_FIELDS } from "./contracts.mjs";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validIsoDate(value) {
  return ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function validateKevRecord(record) {
  if (!isPlainObject(record)) {
    return Object.freeze({ ok: false, reasonCode: "RECORD_NOT_OBJECT" });
  }

  const disallowedField = Object.keys(record).find((field) => !ALLOWED_RECORD_FIELDS.includes(field));
  if (disallowedField) {
    return Object.freeze({ ok: false, reasonCode: "DISALLOWED_RECORD_FIELD", field: disallowedField });
  }

  const missingField = REQUIRED_RECORD_FIELDS.find((field) => !nonEmptyString(record[field]));
  if (missingField) {
    return Object.freeze({ ok: false, reasonCode: "MISSING_REQUIRED_RECORD_FIELD", field: missingField });
  }

  const malformedDate = ["dateAdded", "dueDate"].find((field) => !validIsoDate(record[field]));
  if (malformedDate) {
    return Object.freeze({ ok: false, reasonCode: "MALFORMED_DATE", field: malformedDate });
  }

  if (!record.cveId.startsWith("SYN-CVE-")) {
    return Object.freeze({ ok: false, reasonCode: "SYNTHETIC_RECORD_ID_REQUIRED", field: "cveId" });
  }

  return Object.freeze({ ok: true, value: Object.freeze(structuredClone(record)) });
}

export function validateSourceReceipt(receipt) {
  if (!isPlainObject(receipt)) {
    return Object.freeze({ ok: false, reasonCode: "SOURCE_RECEIPT_NOT_OBJECT" });
  }
  if (receipt.provenance !== "synthetic_teaching_fixture") {
    return Object.freeze({ ok: false, reasonCode: "SYNTHETIC_PROVENANCE_REQUIRED" });
  }
  if (receipt.acquisitionStatus !== "not_acquired") {
    return Object.freeze({ ok: false, reasonCode: "LIVE_ACQUISITION_NOT_ALLOWED" });
  }
  if (receipt.recordClassification !== "public_field_shape_only") {
    return Object.freeze({ ok: false, reasonCode: "PUBLIC_FIELD_SHAPE_REQUIRED" });
  }
  if (!nonEmptyString(receipt.receiptId) || !nonEmptyString(receipt.sourceOwner) || !nonEmptyString(receipt.fixtureVersion)) {
    return Object.freeze({ ok: false, reasonCode: "INCOMPLETE_SOURCE_RECEIPT" });
  }
  return Object.freeze({ ok: true, value: Object.freeze(structuredClone(receipt)) });
}
