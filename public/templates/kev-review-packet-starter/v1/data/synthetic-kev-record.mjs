export const SYNTHETIC_KEV_RECORD = Object.freeze({
  catalogId: "SYN-KEV-2026-0001",
  cveId: "SYN-CVE-2026-0001",
  vendorProject: "Example Harbor Systems",
  product: "Demo Gateway",
  vulnerabilityName: "Synthetic input-validation teaching record",
  dateAdded: "2026-01-12",
  shortDescription: "Invented record used only to practise source checks and human review.",
  requiredAction: "Ask the named reviewer whether a separate authorised assessment is needed.",
  dueDate: "2026-02-15",
  knownRansomwareCampaignUse: "Unknown",
  notes: "SYNTHETIC_FIXTURE_ONLY; not a real vulnerability, feed item, or security finding.",
});

export const SYNTHETIC_SOURCE_RECEIPT = Object.freeze({
  receiptId: "SRC-SYN-KEV-001",
  provenance: "synthetic_teaching_fixture",
  acquisitionStatus: "not_acquired",
  sourceOwner: "fictional-security-assurance-owner",
  recordClassification: "public_field_shape_only",
  collectedAt: "2026-01-12T09:00:00Z",
  fixtureVersion: "1.0.0",
  nonClaims: Object.freeze([
    "not_live_catalog_data",
    "not_an_asset_finding",
    "not_a_remediation_instruction",
    "not_a_deadline_for_any_organisation",
  ]),
});
