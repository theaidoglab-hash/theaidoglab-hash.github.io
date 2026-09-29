const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "be",
  "can",
  "for",
  "i",
  "is",
  "it",
  "my",
  "of",
  "the",
  "to",
  "what",
  "with",
]);

function normalise(value) {
  return value.normalize("NFKC").toLocaleLowerCase();
}

function tokens(value) {
  return (normalise(value).match(/[\p{L}\p{N}]+/gu) ?? []).filter((token) => !STOP_WORDS.has(token));
}

function searchText(policy) {
  return [
    policy.policyId,
    policy.version,
    policy.title,
    policy.topic,
    ...policy.keywords,
    policy.draftAnswer,
    policy.citationExcerpt,
  ].join(" ");
}

export function isCurrentApprovedPolicy(policy, asOf) {
  return policy.status === "approved" && policy.effectiveFrom <= asOf && policy.effectiveTo >= asOf;
}

export function policyEligibilityReason(policy, asOf) {
  if (policy.status !== "approved") return `status_${policy.status}`;
  if (policy.effectiveFrom > asOf) return "not_effective_yet";
  if (policy.effectiveTo < asOf) return "expired";
  return "eligible";
}

export function findPolicyEvidence({ policies, question, asOf, minimumScore = 4 }) {
  const queryTokens = new Set(tokens(question));
  const queryText = normalise(question);
  const scored = policies
    .map((policy) => {
      const searchableTokens = new Set(tokens(searchText(policy)));
      const matchedTokens = [...queryTokens].filter((token) => searchableTokens.has(token));
      const matchedKeywords = policy.keywords.filter((keyword) => queryText.includes(normalise(keyword)));
      return {
        policy,
        matchedTokens,
        matchedKeywords,
        score: matchedTokens.length + matchedKeywords.length * 2,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.policy.policyId.localeCompare(right.policy.policyId));

  const eligibleCandidates = scored
    .filter(({ policy, score }) => isCurrentApprovedPolicy(policy, asOf) && score >= minimumScore)
    .slice(0, 1)
    .map(({ policy, score, matchedTokens, matchedKeywords }) => ({
      policy,
      score,
      matchedTokens,
      matchedKeywords,
    }));
  const rejectedCandidates = scored
    .filter(({ policy }) => !isCurrentApprovedPolicy(policy, asOf))
    .map(({ policy, score }) => ({
      policyId: policy.policyId,
      version: policy.version,
      score,
      reason: policyEligibilityReason(policy, asOf),
    }));

  return Object.freeze({
    minimumScore,
    eligibleCandidates: Object.freeze(eligibleCandidates),
    rejectedCandidates: Object.freeze(rejectedCandidates),
  });
}
