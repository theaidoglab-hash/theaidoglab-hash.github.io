function tokenize(value) {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

function isCurrentApproved(record, asOf) {
  return record.status === "approved" && record.effectiveFrom <= asOf && asOf <= record.effectiveTo;
}

export function retrieveCurrentApprovedFaq({ snapshot, question, asOf }) {
  const questionTokens = tokenize(question);
  const candidates = snapshot.records.map((record) => ({
    record,
    score: record.keywords.filter((keyword) => questionTokens.has(keyword)).length,
  }));

  const eligible = candidates
    .filter(({ record, score }) => isCurrentApproved(record, asOf) && score >= 2)
    .sort((left, right) => right.score - left.score || left.record.faqId.localeCompare(right.record.faqId));

  return Object.freeze({
    selected: eligible[0]?.record ?? null,
    selectedScore: eligible[0]?.score ?? 0,
    rejected: Object.freeze(
      candidates
        .filter(({ record }) => !isCurrentApproved(record, asOf))
        .map(({ record }) => Object.freeze({ faqId: record.faqId, version: record.version, reason: "not_current_approved" })),
    ),
  });
}
