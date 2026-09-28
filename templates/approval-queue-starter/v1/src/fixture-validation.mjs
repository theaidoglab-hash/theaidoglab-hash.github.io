import { createHash } from "node:crypto";

export class FixtureValidationError extends Error {
  constructor(code) {
    super(code);
    this.name = "FixtureValidationError";
    this.code = code;
  }
}

function assertFixture(condition, code) {
  if (!condition) {
    throw new FixtureValidationError(code);
  }
}

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function canonicalSnapshot(snapshot) {
  return snapshot.records
    .map(({ faqId, version, status, effectiveFrom, effectiveTo, sourceNote }) => ({
      faqId,
      version,
      status,
      effectiveFrom,
      effectiveTo,
      sourceNote,
    }))
    .sort((left, right) => left.faqId.localeCompare(right.faqId));
}

export function validateSyntheticFaqSnapshot(snapshot) {
  assertFixture(snapshot && typeof snapshot === "object", "SNAPSHOT_REQUIRED");
  assertFixture(snapshot.provenance === "synthetic_fixture_only", "SYNTHETIC_PROVENANCE_REQUIRED");
  assertFixture(typeof snapshot.version === "string" && snapshot.version.length > 0, "VERSION_REQUIRED");
  assertFixture(isIsoDate(snapshot.asOf), "AS_OF_DATE_REQUIRED");
  assertFixture(Array.isArray(snapshot.records) && snapshot.records.length > 0, "FAQ_RECORDS_REQUIRED");

  const seenIds = new Set();
  for (const record of snapshot.records) {
    assertFixture(record && typeof record === "object", "FAQ_RECORD_OBJECT_REQUIRED");
    assertFixture(/^SYN-FAQ-\d{3}$/.test(record.faqId), "SYNTHETIC_FAQ_ID_REQUIRED");
    assertFixture(!seenIds.has(record.faqId), "DUPLICATE_FAQ_ID");
    seenIds.add(record.faqId);
    assertFixture(typeof record.version === "string" && /^v\d+$/.test(record.version), "FAQ_VERSION_REQUIRED");
    assertFixture(["approved", "draft"].includes(record.status), "FAQ_STATUS_INVALID");
    assertFixture(isIsoDate(record.effectiveFrom) && isIsoDate(record.effectiveTo), "EFFECTIVE_DATE_REQUIRED");
    assertFixture(record.effectiveFrom <= record.effectiveTo, "EFFECTIVE_DATE_RANGE_INVALID");
    assertFixture(typeof record.title === "string" && record.title.length > 0, "FAQ_TITLE_REQUIRED");
    assertFixture(typeof record.answer === "string" && record.answer.length > 0, "FAQ_ANSWER_REQUIRED");
    assertFixture(Array.isArray(record.keywords) && record.keywords.length > 0, "FAQ_KEYWORDS_REQUIRED");
    assertFixture(record.keywords.every((keyword) => typeof keyword === "string" && /^[a-z]+$/.test(keyword)), "FAQ_KEYWORD_INVALID");
    assertFixture(record.sourceNote === "synthetic local FAQ", "SYNTHETIC_SOURCE_NOTE_REQUIRED");
  }

  return Object.freeze({
    recordCount: snapshot.records.length,
    approvedRecordCount: snapshot.records.filter((record) => record.status === "approved").length,
  });
}

export function createSyntheticSourceReceipt(snapshot) {
  validateSyntheticFaqSnapshot(snapshot);
  return Object.freeze({
    receiptId: `${snapshot.version}-source-receipt`,
    sourceKind: "checked_in_fictional_fixture",
    recordCount: snapshot.records.length,
    snapshotSha256: createHash("sha256").update(JSON.stringify(canonicalSnapshot(snapshot))).digest("hex"),
    containsRealCustomerData: false,
    permittedUse: "local_fixture_evaluation_only",
  });
}
