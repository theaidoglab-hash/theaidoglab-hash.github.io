export const SYNTHETIC_POLICY_CORPUS = Object.freeze({
  version: "policy-pilot-synthetic-corpus-v1",
  provenance: "synthetic_fixture_only",
  policies: Object.freeze([
    Object.freeze({
      policyId: "SYN-POL-RET-100",
      version: "v2",
      status: "approved",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-12-31",
      title: "Synthetic demonstration-item return rule",
      topic: "returns",
      keywords: Object.freeze(["return", "unused", "demo", "keyboard", "delivery", "30 days"]),
      draftAnswer:
        "For this synthetic exercise, an unused demonstration keyboard can be submitted for review within 30 days of delivery. Any exception needs a human policy owner.",
      citationExcerpt:
        "Unused demonstration keyboards may be submitted for review within 30 days of delivery. Exceptions require human policy-owner review.",
    }),
    Object.freeze({
      policyId: "SYN-POL-WAR-200",
      version: "v1",
      status: "approved",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-12-31",
      title: "Synthetic demonstration-item warranty rule",
      topic: "warranty",
      keywords: Object.freeze(["warranty", "repair", "defect", "demo", "device"]),
      draftAnswer:
        "For this synthetic exercise, warranty questions need a human reviewer to confirm the proof of purchase and item condition. This starter does not create a repair case.",
      citationExcerpt:
        "Warranty questions need human verification of proof of purchase and item condition. The starter does not create repair cases.",
    }),
    Object.freeze({
      policyId: "SYN-POL-RET-100",
      version: "v1",
      status: "superseded",
      effectiveFrom: "2025-01-01",
      effectiveTo: "2025-12-31",
      title: "Synthetic demonstration-item return rule (superseded)",
      topic: "returns",
      keywords: Object.freeze(["return", "unused", "demo", "keyboard", "2025"]),
      draftAnswer: "This deliberately retained old rule must not be used for a current draft.",
      citationExcerpt: "This synthetic rule is superseded and cannot be cited as current policy.",
    }),
    Object.freeze({
      policyId: "SYN-POL-EXC-300",
      version: "v1-draft",
      status: "draft",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-12-31",
      title: "Synthetic exception-handling draft",
      topic: "exceptions",
      keywords: Object.freeze(["exception", "override", "manager", "draft"]),
      draftAnswer: "This unapproved synthetic draft must not support a policy answer.",
      citationExcerpt: "An unapproved draft cannot support a decision.",
    }),
  ]),
});
