export const STARTER_VERSION = "1.0.0";

export const ALLOWED_OPERATION = "BUILD_LOCAL_REVIEW_PACKET";

export const ACTION_BOUNDARY = Object.freeze({
  requiresHumanReview: true,
  externalActionsPerformed: false,
  permittedActions: Object.freeze([]),
  prohibitedActions: Object.freeze([
    "scan_network",
    "match_asset",
    "assess_exposure",
    "prioritise_remediation",
    "patch_system",
    "create_ticket",
    "send_message",
  ]),
});

export const ALLOWED_RECORD_FIELDS = Object.freeze([
  "catalogId",
  "cveId",
  "vendorProject",
  "product",
  "vulnerabilityName",
  "dateAdded",
  "shortDescription",
  "requiredAction",
  "dueDate",
  "knownRansomwareCampaignUse",
  "notes",
]);

export const REQUIRED_RECORD_FIELDS = ALLOWED_RECORD_FIELDS;

export function sourceRejected(reasonCode, message) {
  return Object.freeze({
    reportVersion: STARTER_VERSION,
    route: "SOURCE_REJECTED",
    reasonCode,
    packetCreated: false,
    packet: null,
    actionBoundary: ACTION_BOUNDARY,
    reviewerNextStep: "A human reviewer must decide whether a corrected local fixture is appropriate. No external action was taken.",
    message,
  });
}
