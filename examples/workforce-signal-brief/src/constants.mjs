export const PACKAGE_VERSION = "0.1.0";
export const DEFAULT_AS_OF = "2026-09-25";
export const MAX_RECEIPT_AGE_DAYS = 45;

export const RESULT_STATUS = Object.freeze({
  READY: "CONTEXT_BRIEF_READY",
  REJECTED: "SOURCE_REJECTED",
});

export const SOURCE_URLS = Object.freeze({
  dataApiGuide: "https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide",
  labourForceRelease: "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia",
  citationGuide: "https://www.abs.gov.au/how-cite-abs-sources",
  promptfooGuide: "https://www.promptfoo.dev/docs/configuration/guide/",
  openAiResponses: "https://developers.openai.com/api/docs/models/gpt-5-mini",
});

export const ALLOWED_INPUT_FIELDS = Object.freeze([
  "sourceManifest",
  "series",
  "requestedAction",
  "wrapperNote",
]);

export const REQUIRED_MANIFEST_FIELDS = Object.freeze([
  "manifestVersion",
  "fixtureId",
  "acquisitionMode",
  "fixturePreparedAt",
  "snapshotAsOf",
  "sourceReceipt",
  "nonClaims",
]);

export const ALLOWED_SERIES_FIELDS = Object.freeze([
  "seriesId",
  "seriesTitle",
  "geography",
  "frequency",
  "adjustment",
  "unit",
  "observations",
]);

export const REQUIRED_SERIES_FIELDS = Object.freeze([
  "seriesId",
  "seriesTitle",
  "geography",
  "frequency",
  "adjustment",
  "unit",
  "observations",
]);

export const PROHIBITED_FIELD_NAME = /^(?:email|phone|address|customer|client|employee|candidate|resume|cv|salary|visa|account|credential|token|password|host|ip|asset|ticket|incident)(?:[A-Z_].*)?$/i;
export const INSTRUCTION_OVERRIDE_PATTERNS = Object.freeze([
  /ignore\s+(all\s+)?(previous|prior|above)/i,
  /override\s+(the\s+)?(rule|boundary|instruction)/i,
  /reveal\s+(the\s+)?(secret|system|prompt)/i,
]);

export const PROHIBITED_ACTIONS = Object.freeze([
  "forecast_labour_market",
  "recommend_hiring",
  "set_salary",
  "make_visa_or_migration_advice",
  "publish_external_brief",
  "contact_anyone",
  "write_to_external_system",
]);
