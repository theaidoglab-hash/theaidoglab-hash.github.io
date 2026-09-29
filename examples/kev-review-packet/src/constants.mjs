export const PACKAGE_VERSION = "kev-review-packet-reference-0.1.0";
export const DEFAULT_AS_OF = "2026-09-24";
export const MAX_SNAPSHOT_AGE_DAYS = 30;

export const RESULT_STATUS = Object.freeze({
  READY: "EVIDENCE_PACKET_READY",
  REJECTED: "SOURCE_REJECTED",
});

export const ALLOWED_KEV_FIELDS = Object.freeze([
  "cveID",
  "vendorProject",
  "product",
  "vulnerabilityName",
  "dateAdded",
  "shortDescription",
  "requiredAction",
  "dueDate",
  "knownRansomwareCampaignUse",
  "forensicTriage",
  "notes",
  "cwes",
]);

export const REQUIRED_KEV_FIELDS = Object.freeze([
  "cveID",
  "vendorProject",
  "product",
  "vulnerabilityName",
  "dateAdded",
  "shortDescription",
  "requiredAction",
  "dueDate",
]);

export const REQUIRED_SOURCE_MANIFEST_FIELDS = Object.freeze([
  "manifestVersion",
  "fixtureId",
  "acquisitionMode",
  "fixturePreparedAt",
  "snapshotAsOf",
  "recordClassification",
  "sourceReceipt",
  "nonClaims",
]);

export const SOURCE_URLS = Object.freeze({
  catalog: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
  canonicalFeed:
    "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
  schema:
    "https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json",
  license: "https://www.cisa.gov/sites/default/files/licenses/kev/license.txt",
  acscPatchGuidance:
    "https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20%28November%202023%29.pdf",
});

export const INSTRUCTION_OVERRIDE_PATTERNS = Object.freeze([
  /\b(ignore|disregard|override)\b[\s\S]{0,100}\b(previous|system|developer|safety|guardrail|instruction)/i,
  /\b(system prompt|developer message|jailbreak|prompt injection)\b/i,
]);

export const PROHIBITED_FIELD_NAME =
  /^(?:client|customer|contact|email|phone|network|ip|asset|hostname|tenant|account|ticket|credential|secret|password|token|address|identity)(?:[A-Z_].*)?$/i;
