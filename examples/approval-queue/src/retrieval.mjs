import { SYNTHETIC_FAQ } from "../data/synthetic-faq.mjs";

function tokenize(value) {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

function isCurrent(item, asOf) {
  return item.status === "approved" && item.effectiveFrom <= asOf && asOf <= item.effectiveTo;
}

export function retrieveApprovedFaq(question, { asOf } = {}) {
  const queryTokens = tokenize(question);

  const scored = SYNTHETIC_FAQ.map((item) => {
    const score = item.keywords.filter((keyword) => queryTokens.has(keyword)).length;
    return { item, score };
  });

  const eligible = scored
    .filter(({ item, score }) => isCurrent(item, asOf) && score >= 2)
    .sort((left, right) => right.score - left.score || left.item.faqId.localeCompare(right.item.faqId));

  return Object.freeze({
    selected: eligible[0]?.item ?? null,
    selectedScore: eligible[0]?.score ?? 0,
    rejected: Object.freeze(
      scored
        .filter(({ item }) => !isCurrent(item, asOf))
        .map(({ item }) => Object.freeze({ faqId: item.faqId, version: item.version, reason: "not_current_approved" })),
    ),
  });
}
