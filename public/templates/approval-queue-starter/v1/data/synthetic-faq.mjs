export const syntheticFaqSnapshot = Object.freeze({
  provenance: "synthetic_fixture_only",
  version: "approval-queue-starter-fixture-v1",
  asOf: "2026-09-25",
  records: Object.freeze([
    Object.freeze({
      faqId: "SYN-FAQ-001",
      version: "v1",
      status: "approved",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-12-31",
      title: "Synthetic learning kit returns",
      answer:
        "A return request for an unopened synthetic learning kit may be reviewed within 30 calendar days after delivery. A human reviewer must confirm eligibility before any outcome is communicated.",
      keywords: Object.freeze(["return", "returns", "unopened", "learning", "kit", "materials", "delivery", "days"]),
      sourceNote: "synthetic local FAQ",
    }),
    Object.freeze({
      faqId: "SYN-FAQ-002",
      version: "v2",
      status: "approved",
      effectiveFrom: "2026-03-01",
      effectiveTo: "2027-12-31",
      title: "Synthetic workshop access code",
      answer:
        "A synthetic workshop access code may be considered only after an authorised reviewer confirms the applicable record. This exercise cannot inspect records or send an access code.",
      keywords: Object.freeze(["workshop", "access", "code", "activation", "login", "record"]),
      sourceNote: "synthetic local FAQ",
    }),
    Object.freeze({
      faqId: "SYN-FAQ-003",
      version: "v1",
      status: "draft",
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-12-31",
      title: "Unapproved synthetic exception",
      answer: "This draft record must never be cited.",
      keywords: Object.freeze(["exception", "special", "return"]),
      sourceNote: "synthetic local FAQ",
    }),
  ]),
});
