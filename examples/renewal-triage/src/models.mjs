function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

function round(value) {
  return Number(value.toFixed(4));
}

export const MODEL_VERSIONS = Object.freeze({
  baseline: "value-aware-baseline-v1",
  candidate: "risk-only-candidate-v1",
});

// A simple transparent risk-only ranking. It deliberately ignores value so this
// example can demonstrate that a generic predictive score is not a queue objective.
export function scoreRiskOnlyCandidate(featureRows) {
  return featureRows.map((row) => {
    const lowUsageSignal = clamp((30 - row.usageDaysLast30) / 30);
    const supportSignal = clamp(row.supportTicketsLast30 / 6);
    const renewalUrgencySignal = clamp((30 - row.daysToRenewal) / 30);
    const score = round((0.6 * lowUsageSignal) + (0.3 * supportSignal) + (0.1 * renewalUrgencySignal));

    return Object.freeze({
      ...row,
      modelVersion: MODEL_VERSIONS.candidate,
      score,
      scoreMeaning: "synthetic risk-only ranking score; not an action recommendation",
    });
  });
}

// A transparent priority baseline. It combines the same current signals with an
// observed-at-asOf estimate of review value. It is not a calibrated probability.
export function scoreValueAwareBaseline(featureRows) {
  return featureRows.map((row) => {
    const lowUsageSignal = clamp((30 - row.usageDaysLast30) / 30);
    const supportSignal = clamp(row.supportTicketsLast30 / 6);
    const renewalUrgencySignal = clamp((30 - row.daysToRenewal) / 30);
    const riskSignal = (0.6 * lowUsageSignal) + (0.3 * supportSignal) + (0.1 * renewalUrgencySignal);
    const valueSignal = clamp(row.estimatedReviewValueUnits / 50);
    const score = round((0.8 * valueSignal) + (0.2 * riskSignal));

    return Object.freeze({
      ...row,
      modelVersion: MODEL_VERSIONS.baseline,
      score,
      scoreMeaning: "synthetic value-aware priority score; not a probability or action recommendation",
    });
  });
}
