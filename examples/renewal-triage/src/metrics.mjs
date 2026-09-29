function outcomeByAccount(snapshot) {
  return new Map(snapshot.records.map((record) => [record.accountId, record.outcome]));
}

function ranked(scoredRows) {
  return [...scoredRows].sort((left, right) => right.score - left.score || left.accountId.localeCompare(right.accountId));
}

export function averagePrecision(scoredRows, snapshot) {
  const outcomes = outcomeByAccount(snapshot);
  const totalPositives = snapshot.records.filter(({ outcome }) => outcome.nonRenewalWithin30d === 1).length;
  if (totalPositives === 0) return 0;

  let positivesSeen = 0;
  let precisionSum = 0;
  ranked(scoredRows).forEach((row, index) => {
    if (outcomes.get(row.accountId).nonRenewalWithin30d === 1) {
      positivesSeen += 1;
      precisionSum += positivesSeen / (index + 1);
    }
  });
  return Number((precisionSum / totalPositives).toFixed(4));
}

export function precisionAtCapacity(scoredRows, snapshot, capacity) {
  const outcomes = outcomeByAccount(snapshot);
  const topRows = ranked(scoredRows).slice(0, capacity);
  const positives = topRows.filter((row) => outcomes.get(row.accountId).nonRenewalWithin30d === 1).length;
  return Number((positives / topRows.length).toFixed(4));
}

export function scoreBandDiagnostic(scoredRows, snapshot) {
  const outcomes = outcomeByAccount(snapshot);
  const bands = [
    { label: "low", minimum: 0, maximum: 0.34 },
    { label: "medium", minimum: 0.34, maximum: 0.67 },
    { label: "high", minimum: 0.67, maximum: 1.000001 },
  ];

  return bands.map((band) => {
    const rows = scoredRows.filter((row) => row.score >= band.minimum && row.score < band.maximum);
    const observedPositiveRate = rows.length === 0
      ? null
      : Number((rows.filter((row) => outcomes.get(row.accountId).nonRenewalWithin30d === 1).length / rows.length).toFixed(4));
    const meanScore = rows.length === 0
      ? null
      : Number((rows.reduce((sum, row) => sum + row.score, 0) / rows.length).toFixed(4));
    return { ...band, count: rows.length, meanScore, observedPositiveRate };
  });
}

export function evaluateRanking(scoredRows, snapshot, { capacity }) {
  return Object.freeze({
    averagePrecision: averagePrecision(scoredRows, snapshot),
    precisionAtCapacity: precisionAtCapacity(scoredRows, snapshot, capacity),
    scoreBandDiagnostic: scoreBandDiagnostic(scoredRows, snapshot),
  });
}

export function evaluateQueueUtility(queue, snapshot, { reviewCostUnits = 1 } = {}) {
  const outcomes = outcomeByAccount(snapshot);
  const rows = queue.selected.map((item) => {
    const outcome = outcomes.get(item.accountId);
    const grossUtilityUnits = outcome.nonRenewalWithin30d === 1 ? outcome.observedReviewUtilityUnits : 0;
    return {
      accountId: item.accountId,
      outcomeObservedOnlyAfter: outcome.labelAvailableAt,
      nonRenewalWithin30d: outcome.nonRenewalWithin30d,
      grossUtilityUnits,
      reviewCostUnits,
      netUtilityUnits: grossUtilityUnits - reviewCostUnits,
    };
  });
  const totalUtilityUnits = rows.reduce((sum, row) => sum + row.netUtilityUnits, 0);

  return Object.freeze({
    metricVersion: "synthetic-queue-utility-v1",
    description: "Offline-only synthetic utility; it is not a revenue, retention, or production-impact claim.",
    reviewCostUnits,
    selectedCount: queue.selected.length,
    totalUtilityUnits,
    rows,
  });
}
