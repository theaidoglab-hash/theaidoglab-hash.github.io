import { ACTION_CONTRACT, assertDecisionSupportOnly } from "./contracts.mjs";

function rankByScore(rows) {
  return [...rows].sort((left, right) => right.score - left.score || left.accountId.localeCompare(right.accountId));
}

export function buildCapacityAwareReviewQueue(scoredRows, { capacity }) {
  assertDecisionSupportOnly();
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error("capacity must be a positive integer");
  }

  const eligible = rankByScore(scoredRows.filter((row) => row.isReviewEligible));
  const ineligible = rankByScore(scoredRows.filter((row) => !row.isReviewEligible));
  const selected = eligible.slice(0, capacity).map((row, index) => ({
    accountId: row.accountId,
    score: row.score,
    queuePosition: index + 1,
    proposedAction: "human_review_only",
    action: {
      kind: "none",
      mode: ACTION_CONTRACT.mode,
      requiresHumanReview: true,
    },
  }));

  return Object.freeze({
    capacity,
    modelVersion: scoredRows[0]?.modelVersion ?? "unknown",
    selected,
    deferredEligibleAccountIds: eligible.slice(capacity).map(({ accountId }) => accountId),
    excludedIneligibleAccountIds: ineligible.map(({ accountId }) => accountId),
    noExternalActions: true,
  });
}
