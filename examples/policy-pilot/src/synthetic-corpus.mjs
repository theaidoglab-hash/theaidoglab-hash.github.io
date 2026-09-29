export const CORPUS_VERSION = "synthetic-policy-corpus-0.1.0";

// Every record in this corpus is fictional. The expired and draft records are
// deliberate safety fixtures: retrieval must never cite them as current policy.
export const SYNTHETIC_POLICIES = Object.freeze([
  Object.freeze({
    policyId: "RET-100",
    version: "v2",
    status: "approved",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    title: "Synthetic return policy",
    topic: "returns",
    keywords: ["return", "returns", "unused", "demo", "item", "delivery"],
    answer:
      "Unused demonstration items may be submitted for return within 30 days of delivery. Any exception requires human review.",
    citationExcerpt:
      "Unused demonstration items may be submitted for return within 30 days of delivery. Exceptions require human review.",
    sourceNote: "synthetic authoring",
  }),
  Object.freeze({
    policyId: "WAR-200",
    version: "v1",
    status: "approved",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    title: "Synthetic warranty policy",
    topic: "warranty",
    keywords: ["warranty", "repair", "defect", "demo", "device"],
    answer:
      "Synthetic warranty questions for demonstration devices require a human to verify proof of purchase and device condition. This reference does not create repair cases.",
    citationExcerpt:
      "Warranty questions for demonstration devices require human verification of proof of purchase and device condition. The system does not create repair cases.",
    sourceNote: "synthetic authoring",
  }),
  Object.freeze({
    policyId: "RET-100",
    version: "v1",
    status: "superseded",
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    title: "Synthetic return policy (superseded)",
    topic: "returns",
    keywords: ["return", "returns", "unused", "demo", "item", "2025"],
    answer: "This is a deliberately retained superseded rule for testing. It must never support a current response.",
    citationExcerpt: "This fictional version is superseded and cannot be cited as current return policy.",
    sourceNote: "synthetic authoring",
  }),
  Object.freeze({
    policyId: "EXC-300",
    version: "v1-draft",
    status: "draft",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    title: "Synthetic exception-handling draft",
    topic: "exceptions",
    keywords: ["exception", "override", "manager", "draft"],
    answer: "This is an unapproved synthetic draft and must never be retrieved or cited.",
    citationExcerpt: "An unapproved draft cannot support a decision.",
    sourceNote: "synthetic authoring",
  }),
]);

export function isCurrentApprovedPolicy(policy, asOf) {
  return (
    policy.status === "approved" &&
    policy.effectiveFrom <= asOf &&
    policy.effectiveTo >= asOf
  );
}

export function policySearchText(policy) {
  return [
    policy.policyId,
    policy.version,
    policy.title,
    policy.topic,
    ...policy.keywords,
    policy.answer,
    policy.citationExcerpt,
  ]
    .join(" ")
    .toLocaleLowerCase();
}
