import { PROHIBITED_ACTIONS } from "./constants.mjs";

export const ACTION_CONTRACT = Object.freeze({
  mode: "evidence_only",
  allowedActions: Object.freeze([]),
  prohibitedActions: PROHIBITED_ACTIONS,
  requiresHumanReview: true,
});

export function noAction() {
  return Object.freeze({
    kind: "none",
    mode: ACTION_CONTRACT.mode,
    status: "not_executed",
    allowedActions: ACTION_CONTRACT.allowedActions,
    prohibitedActions: ACTION_CONTRACT.prohibitedActions,
    requiresHumanReview: ACTION_CONTRACT.requiresHumanReview,
  });
}
