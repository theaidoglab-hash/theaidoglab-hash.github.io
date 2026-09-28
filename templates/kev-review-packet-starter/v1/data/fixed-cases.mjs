import { SYNTHETIC_KEV_RECORD, SYNTHETIC_SOURCE_RECEIPT } from "./synthetic-kev-record.mjs";

const validInput = Object.freeze({
  operation: "BUILD_LOCAL_REVIEW_PACKET",
  kevRecord: SYNTHETIC_KEV_RECORD,
  sourceReceipt: SYNTHETIC_SOURCE_RECEIPT,
});

function clone(value) {
  return structuredClone(value);
}

export const FIXED_CASES = Object.freeze([
  Object.freeze({
    id: "complete-synthetic-record",
    input: validInput,
    expectedRoute: "EVIDENCE_PACKET_READY",
    expectedReasonCode: "SYNTHETIC_SOURCE_ACCEPTED",
  }),
  Object.freeze({
    id: "unknown-is-preserved",
    input: validInput,
    expectedRoute: "EVIDENCE_PACKET_READY",
    expectedReasonCode: "SYNTHETIC_SOURCE_ACCEPTED",
    expectedRansomwareValue: "Unknown",
  }),
  Object.freeze({
    id: "malformed-date-is-rejected",
    input: Object.freeze({
      ...clone(validInput),
      kevRecord: Object.freeze({ ...clone(SYNTHETIC_KEV_RECORD), dueDate: "15 February 2026" }),
    }),
    expectedRoute: "SOURCE_REJECTED",
    expectedReasonCode: "MALFORMED_DATE",
  }),
  Object.freeze({
    id: "private-field-is-rejected",
    input: Object.freeze({
      ...clone(validInput),
      kevRecord: Object.freeze({ ...clone(SYNTHETIC_KEV_RECORD), internalAssetName: "do-not-include" }),
    }),
    expectedRoute: "SOURCE_REJECTED",
    expectedReasonCode: "DISALLOWED_RECORD_FIELD",
  }),
  Object.freeze({
    id: "non-synthetic-source-is-rejected",
    input: Object.freeze({
      ...clone(validInput),
      sourceReceipt: Object.freeze({ ...clone(SYNTHETIC_SOURCE_RECEIPT), provenance: "unverified_external_data" }),
    }),
    expectedRoute: "SOURCE_REJECTED",
    expectedReasonCode: "SYNTHETIC_PROVENANCE_REQUIRED",
  }),
  Object.freeze({
    id: "unsafe-operation-is-rejected",
    input: Object.freeze({ ...clone(validInput), operation: "CREATE_PATCH_TICKET" }),
    expectedRoute: "SOURCE_REJECTED",
    expectedReasonCode: "OPERATION_NOT_ALLOWED",
  }),
]);

export const DEMO_INPUT = validInput;
