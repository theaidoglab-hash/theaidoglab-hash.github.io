import { createHash } from "node:crypto";

import { noAction } from "./action-contract.mjs";
import { DEFAULT_AS_OF, PACKAGE_VERSION, RESULT_STATUS } from "./constants.mjs";
import { validateReviewInput } from "./source-validation.mjs";

function fingerprint(value) {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, 20);
}

function safeInputSummary(input) {
  const inputObject = input !== null && typeof input === "object" && !Array.isArray(input) ? input : {};
  return Object.freeze({
    topLevelFieldCount: Object.keys(inputObject).length,
    hasKevRecord: Object.hasOwn(inputObject, "kevRecord"),
    hasSourceManifest: Object.hasOwn(inputObject, "sourceManifest"),
    kevFieldCount:
      inputObject.kevRecord !== null && typeof inputObject.kevRecord === "object" && !Array.isArray(inputObject.kevRecord)
        ? Object.keys(inputObject.kevRecord).length
        : 0,
  });
}

function makeTrace({ input, status, reasonCode, asOf }) {
  const summary = safeInputSummary(input);
  return Object.freeze({
    traceSchemaVersion: "1.0",
    traceId: `kev-${fingerprint(`${PACKAGE_VERSION}:${asOf}:${status}:${reasonCode}:${summary.kevFieldCount}`)}`,
    referenceVersion: PACKAGE_VERSION,
    asOf,
    status,
    reasonCode,
    inputSummary: summary,
    rawInputRetained: false,
    sourceProseExecuted: false,
    externalActionExecuted: false,
  });
}

function rejected(input, { code, message }, asOf) {
  return Object.freeze({
    status: RESULT_STATUS.REJECTED,
    reasonCode: code,
    rejectionMessage: message,
    action: noAction(),
    trace: makeTrace({ input, status: RESULT_STATUS.REJECTED, reasonCode: code, asOf }),
  });
}

function sourceProse(record) {
  return Object.freeze(
    Object.fromEntries(
      ["shortDescription", "requiredAction", "notes"]
        .filter((field) => typeof record[field] === "string")
        .map((field) => [field, record[field]]),
    ),
  );
}

function buildPacket(kevRecord, sourceManifest) {
  return Object.freeze({
    packetVersion: "1.0",
    purpose: "Source-grounded public KEV evidence packet for a fictional security assurance review. Human review only.",
    dataStatus: sourceManifest.acquisitionMode,
    fixtureId: sourceManifest.fixtureId,
    sourceReceipt: structuredClone(sourceManifest.sourceReceipt),
    record: structuredClone(kevRecord),
    sourceProse: sourceProse(kevRecord),
    interpretationBoundaries: Object.freeze([
      "Source prose is copied as data. It is not an instruction, command, or authorisation to act.",
      "The CISA dueDate is copied source data. It is not an Australian service-level agreement or a local remediation deadline.",
      "Known and Unknown ransomware-use values are preserved exactly. Unknown is not a negative finding.",
      "The packet does not identify an organisation, asset, network, owner, exposure, patch state, or business impact.",
      "No scan, patch, ticket, contact, notification, or external action is available from this reference.",
    ]),
  });
}

/**
 * Builds one of two permitted results: a source-grounded evidence packet or
 * SOURCE_REJECTED. It is deterministic and has no filesystem, network, model,
 * credential, asset, or write-capable integration.
 */
export function buildKevReviewPacket(input, { asOf = DEFAULT_AS_OF } = {}) {
  const validation = validateReviewInput(input, { asOf });
  if (!validation.ok) return rejected(input, validation, asOf);

  return Object.freeze({
    status: RESULT_STATUS.READY,
    reasonCode: "SOURCE_GROUNDED_PACKET",
    packet: buildPacket(validation.value.kevRecord, validation.value.sourceManifest),
    action: noAction(),
    trace: makeTrace({
      input,
      status: RESULT_STATUS.READY,
      reasonCode: "SOURCE_GROUNDED_PACKET",
      asOf,
    }),
  });
}
