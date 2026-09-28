export class FixtureValidationError extends Error {
  constructor(code) {
    super(code);
    this.name = "FixtureValidationError";
    this.code = code;
  }
}

function assertCondition(condition, code) {
  if (!condition) {
    throw new FixtureValidationError(code);
  }
}

function isDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function validateSyntheticPolicyCorpus(corpus) {
  assertCondition(corpus && typeof corpus === "object", "CORPUS_REQUIRED");
  assertCondition(corpus.provenance === "synthetic_fixture_only", "SYNTHETIC_PROVENANCE_REQUIRED");
  assertCondition(typeof corpus.version === "string" && corpus.version.length > 0, "CORPUS_VERSION_REQUIRED");
  assertCondition(Array.isArray(corpus.policies) && corpus.policies.length > 0, "POLICIES_REQUIRED");

  const seenPolicyVersions = new Set();

  for (const policy of corpus.policies) {
    assertCondition(policy && typeof policy === "object", "POLICY_OBJECT_REQUIRED");
    assertCondition(/^SYN-POL-[A-Z]{3}-\d{3}$/.test(policy.policyId), "SYNTHETIC_POLICY_ID_REQUIRED");
    assertCondition(typeof policy.version === "string" && policy.version.length > 0, "POLICY_VERSION_REQUIRED");
    const policyVersionKey = `${policy.policyId}:${policy.version}`;
    assertCondition(!seenPolicyVersions.has(policyVersionKey), "DUPLICATE_POLICY_VERSION");
    seenPolicyVersions.add(policyVersionKey);
    assertCondition(["approved", "superseded", "draft"].includes(policy.status), "POLICY_STATUS_INVALID");
    assertCondition(isDate(policy.effectiveFrom) && isDate(policy.effectiveTo), "POLICY_EFFECTIVE_DATE_REQUIRED");
    assertCondition(policy.effectiveFrom <= policy.effectiveTo, "POLICY_EFFECTIVE_RANGE_INVALID");
    assertCondition(typeof policy.title === "string" && policy.title.length > 0, "POLICY_TITLE_REQUIRED");
    assertCondition(typeof policy.topic === "string" && policy.topic.length > 0, "POLICY_TOPIC_REQUIRED");
    assertCondition(
      Array.isArray(policy.keywords) && policy.keywords.length > 0 && policy.keywords.every((keyword) => typeof keyword === "string" && keyword.length > 0),
      "POLICY_KEYWORDS_REQUIRED",
    );
    assertCondition(typeof policy.draftAnswer === "string" && policy.draftAnswer.length > 0, "POLICY_DRAFT_ANSWER_REQUIRED");
    assertCondition(typeof policy.citationExcerpt === "string" && policy.citationExcerpt.length > 0, "POLICY_CITATION_REQUIRED");
  }

  return Object.freeze({ policyCount: corpus.policies.length, corpusVersion: corpus.version });
}

export function validateRequest(request) {
  assertCondition(request && typeof request === "object", "REQUEST_REQUIRED");
  assertCondition(typeof request.operation === "string" && request.operation.length > 0, "REQUEST_OPERATION_REQUIRED");
  assertCondition(typeof request.question === "string" && request.question.trim().length > 0, "REQUEST_QUESTION_REQUIRED");
}
