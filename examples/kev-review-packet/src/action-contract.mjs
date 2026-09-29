export const ACTION_CONTRACT = Object.freeze({
  mode: "evidence_only",
  allowedActions: Object.freeze([]),
  prohibitedActions: Object.freeze([
    "asset_discovery",
    "network_scan",
    "patch",
    "create_ticket",
    "send_external_message",
    "contact_client",
    "read_private_inventory",
    "change_configuration",
    "open_incident",
  ]),
  requiresHumanReview: true,
});

export function noAction() {
  return Object.freeze({
    kind: "none",
    mode: ACTION_CONTRACT.mode,
    status: "not_executed",
    requiresHumanReview: ACTION_CONTRACT.requiresHumanReview,
  });
}
