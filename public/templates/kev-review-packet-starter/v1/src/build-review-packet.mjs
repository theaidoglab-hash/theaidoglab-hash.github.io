import { createHash } from "node:crypto";

import { ACTION_BOUNDARY, ALLOWED_OPERATION, STARTER_VERSION, sourceRejected } from "./contracts.mjs";
import { validateKevRecord, validateSourceReceipt } from "./validate.mjs";

export const DEFAULT_AS_OF = "2026-01-12";

function fingerprint(value) {
  return createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

function sourceSummary(receipt) {
  return Object.freeze({
    receiptId: receipt.receiptId,
    provenance: receipt.provenance,
    acquisitionStatus: receipt.acquisitionStatus,
    sourceOwner: receipt.sourceOwner,
    fixtureVersion: receipt.fixtureVersion,
  });
}

/**
 * Builds evidence for a human reviewer. It has no network, model, filesystem,
 * asset, ticket, notification, or remediation capability.
 */
export function buildKevReviewPacket(input, { asOf = DEFAULT_AS_OF } = {}) {
  if (input?.operation !== ALLOWED_OPERATION) {
    return sourceRejected("OPERATION_NOT_ALLOWED", "This local starter cannot perform an operation outside packet construction.");
  }

  const recordResult = validateKevRecord(input.kevRecord);
  if (!recordResult.ok) {
    return sourceRejected(recordResult.reasonCode, "The record did not meet the local fixture boundary.");
  }

  const receiptResult = validateSourceReceipt(input.sourceReceipt);
  if (!receiptResult.ok) {
    return sourceRejected(receiptResult.reasonCode, "The source receipt did not meet the local fixture boundary.");
  }

  const record = recordResult.value;
  const sourceReceipt = receiptResult.value;
  const traceInput = Object.freeze({ asOf, record, sourceReceipt, starterVersion: STARTER_VERSION });
  const trace = Object.freeze({
    traceSchemaVersion: "1.0",
    traceId: `kev-local-${fingerprint(traceInput).slice(0, 16)}`,
    starterVersion: STARTER_VERSION,
    asOf,
    recordSha256: fingerprint(record),
    sourceReceiptSha256: fingerprint(sourceReceipt),
    actionBoundary: Object.freeze({
      requiresHumanReview: ACTION_BOUNDARY.requiresHumanReview,
      externalActionsPerformed: ACTION_BOUNDARY.externalActionsPerformed,
    }),
  });

  return Object.freeze({
    reportVersion: STARTER_VERSION,
    route: "EVIDENCE_PACKET_READY",
    reasonCode: "SYNTHETIC_SOURCE_ACCEPTED",
    packetCreated: true,
    packet: Object.freeze({
      packetVersion: "1.0",
      purpose: "Local synthetic evidence packet for human review only.",
      record,
      sourceReceipt: sourceSummary(sourceReceipt),
      reviewerChecklist: Object.freeze([
        "Confirm the record remains synthetic and local.",
        "Confirm no asset, exposure, or remediation conclusion was added.",
        "Decide whether any separate authorised assessment is needed.",
      ]),
    }),
    actionBoundary: ACTION_BOUNDARY,
    trace,
    reviewerNextStep: "A named human reviewer decides whether a separate authorised assessment is needed. This package cannot take that next step.",
  });
}
