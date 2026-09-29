import { createHash } from "node:crypto";

import { noAction } from "./action-contract.mjs";
import { DEFAULT_AS_OF, PACKAGE_VERSION, RESULT_STATUS } from "./constants.mjs";
import { validateWorkforceSignalInput } from "./source-validation.mjs";

function fingerprint(value) {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, 20);
}

function trace(input, status, reasonCode, asOf) {
  const source = input && typeof input === "object" ? input : {};
  return Object.freeze({
    traceSchemaVersion: "1.0",
    traceId: `workforce-${fingerprint(`${PACKAGE_VERSION}:${asOf}:${status}:${reasonCode}`)}`,
    referenceVersion: PACKAGE_VERSION,
    asOf,
    status,
    reasonCode,
    inputSummary: Object.freeze({
      topLevelFieldCount: Object.keys(source).length,
      hasSourceManifest: Object.hasOwn(source, "sourceManifest"),
      observationCount: Array.isArray(source.series?.observations) ? source.series.observations.length : 0,
    }),
    rawInputRetained: false,
    sourceProseExecuted: false,
    externalActionExecuted: false,
  });
}

function rejected(input, validation, asOf) {
  return Object.freeze({
    status: RESULT_STATUS.REJECTED,
    reasonCode: validation.code,
    rejectionMessage: validation.message,
    action: noAction(),
    trace: trace(input, RESULT_STATUS.REJECTED, validation.code, asOf),
  });
}

function buildPacket(sourceManifest, series) {
  const previous = series.observations.at(-2);
  const latest = series.observations.at(-1);
  const delta = Number((latest.value - previous.value).toFixed(3));
  return Object.freeze({
    packetVersion: "1.0",
    purpose: "Source-shaped synthetic context packet for a fictional workforce-planning research review. Human interpretation only.",
    dataStatus: sourceManifest.acquisitionMode,
    fixtureId: sourceManifest.fixtureId,
    sourceReceipt: structuredClone(sourceManifest.sourceReceipt),
    seriesFacts: Object.freeze({
      seriesId: series.seriesId,
      seriesTitle: series.seriesTitle,
      geography: series.geography,
      frequency: series.frequency,
      adjustment: series.adjustment,
      unit: series.unit,
      previous: structuredClone(previous),
      latest: structuredClone(latest),
      latestMinusPrevious: delta,
    }),
    reviewerQuestions: Object.freeze([
      "Has a human checked the official source, its release timing, revision status, series definition, and terms before any use outside this fixture?",
      "Is the intended use only context for a human-written brief, rather than a hiring, salary, visa, migration, policy, investment, or labour-market prediction decision?",
      "Does the brief say that the teaching values are synthetic and avoid extending a simple period-to-period difference into a forecast or causal explanation?",
    ]),
    interpretationBoundaries: Object.freeze([
      "The observations are synthetic teaching values and are not ABS observations or an ABS-derived result.",
      "A period-to-period difference is a calculation, not a trend claim, forecast, causal explanation, or hiring recommendation.",
      "The packet cannot make a staffing, salary, visa, migration, policy, investment, or external publication decision.",
      "No source fetch, model call, credential read, external write, or communication exists in this reference.",
    ]),
  });
}

/**
 * Produces a deterministic, human-review context packet or SOURCE_REJECTED.
 * This function has no live data acquisition, model call, credential access,
 * filesystem write, forecast, hiring capability, or external action.
 */
export function buildWorkforceSignalBrief(input, { asOf = DEFAULT_AS_OF } = {}) {
  const validation = validateWorkforceSignalInput(input, { asOf });
  if (!validation.ok) return rejected(input, validation, asOf);
  return Object.freeze({
    status: RESULT_STATUS.READY,
    reasonCode: "SOURCE_SHAPED_CONTEXT_PACKET",
    packet: buildPacket(validation.value.sourceManifest, validation.value.series),
    action: noAction(),
    trace: trace(input, RESULT_STATUS.READY, "SOURCE_SHAPED_CONTEXT_PACKET", asOf),
  });
}
