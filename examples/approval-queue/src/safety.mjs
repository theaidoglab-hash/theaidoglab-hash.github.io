import { ACTION_CONTRACT } from "./contracts.mjs";

const INSTRUCTION_OVERRIDE_PATTERNS = Object.freeze([
  /\b(ignore|disregard|override)\b[\s\S]{0,80}\b(previous|system|developer|safety|guardrail|instruction)/i,
  /\b(system prompt|developer message|jailbreak|prompt injection)\b/i,
]);

const EMBEDDED_ACTION_PATTERNS = Object.freeze([
  /\b(issue|process|send|create|delete|update)\b[\s\S]{0,80}\b(refund|email|message|ticket|account|order|payment|record)/i,
  /\b(change|cancel)\b[\s\S]{0,80}\b(order|payment|account|record)/i,
]);

export function classifySafetyRisk({ question, requestedAction }) {
  if (requestedAction !== "none") {
    return Object.freeze({
      route: "blocked",
      reasonCode: ACTION_CONTRACT.prohibitedActions.includes(requestedAction)
        ? "forbidden_requested_action"
        : "unsupported_requested_action",
    });
  }

  if (EMBEDDED_ACTION_PATTERNS.some((pattern) => pattern.test(question))) {
    return Object.freeze({
      route: "blocked",
      reasonCode: "forbidden_action_in_question",
    });
  }

  if (INSTRUCTION_OVERRIDE_PATTERNS.some((pattern) => pattern.test(question))) {
    return Object.freeze({
      route: "handoff",
      reasonCode: "prompt_injection_or_instruction_override",
    });
  }

  return null;
}
