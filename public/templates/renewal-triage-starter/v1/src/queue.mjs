function roundToFourDecimals(value) {
  return Math.round(value * 10_000) / 10_000;
}

function sortWithAccountIdTieBreak(records, valueForRecord) {
  return [...records].sort((left, right) => {
    const difference = valueForRecord(right) - valueForRecord(left);
    return difference === 0 ? left.accountId.localeCompare(right.accountId) : difference;
  });
}

export function calculateBusinessPriorityUnits(record) {
  return roundToFourDecimals(record.rawRiskSignal * record.syntheticRenewalValueUnits);
}

export function buildDraftQueues(records, { capacity }) {
  const eligibleRecords = records.filter((record) => record.reviewEligible);
  const excludedAccountIds = records
    .filter((record) => !record.reviewEligible)
    .map((record) => record.accountId)
    .sort();

  const rawRiskQueue = sortWithAccountIdTieBreak(eligibleRecords, (record) => record.rawRiskSignal)
    .slice(0, capacity)
    .map((record, index) => Object.freeze({
      queuePosition: index + 1,
      accountId: record.accountId,
      rawRiskScore: record.rawRiskSignal,
    }));

  const businessPriorityQueue = sortWithAccountIdTieBreak(eligibleRecords, calculateBusinessPriorityUnits)
    .slice(0, capacity)
    .map((record, index) => Object.freeze({
      queuePosition: index + 1,
      accountId: record.accountId,
      businessPriorityUnits: calculateBusinessPriorityUnits(record),
    }));

  return Object.freeze({
    rawRiskQueue: Object.freeze(rawRiskQueue),
    businessPriorityQueue: Object.freeze(businessPriorityQueue),
    excludedAccountIds: Object.freeze(excludedAccountIds),
  });
}

export function calculateOfflineSyntheticQueueUtility(selectedRows, records) {
  const recordByAccountId = new Map(records.map((record) => [record.accountId, record]));

  return selectedRows.reduce((total, selectedRow) => {
    const record = recordByAccountId.get(selectedRow.accountId);
    return total + record.syntheticOfflineReviewValueUnits;
  }, 0);
}
