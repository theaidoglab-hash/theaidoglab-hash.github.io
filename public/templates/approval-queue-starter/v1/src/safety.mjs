const INSTRUCTION_OVERRIDE_PATTERNS = Object.freeze([
  /\b(ignore|disregard|override)\b[\s\S]{0,80}\b(previous|system|developer|safety|guardrail|instruction)/i,
  /\b(system prompt|developer message|jailbreak|prompt injection)\b/i,
]);

const EMBEDDED_ACTION_PATTERNS = Object.freeze([
  /\b(issue|process|send|create|delete|update)\b[\s\S]{0,80}\b(refund|email|message|ticket|account|record|payment)/i,
  /\b(change|cancel)\b[\s\S]{0,80}\b(order|payment|account|record)/i,
]);

export function classifySafetyRisk({ question, requestedAction }) {
  if (requestedAction !== "none") {
    return Object.freeze({
      route: "BLOCKED_EXTERNAL_ACTION_REQUEST",
      reasonCode: "REQUESTED_ACTION_NOT_ALLOWED",
    });
  }

  if (EMBEDDED_ACTION_PATTERNS.some((pattern) => pattern.test(question))) {
    return Object.freeze({
      route: "BLOCKED_EXTERNAL_ACTION_REQUEST",
      reasonCode: "EXTERNAL_ACTION_IN_QUESTION",
    });
  }

  if (INSTRUCTION_OVERRIDE_PATTERNS.some((pattern) => pattern.test(question))) {
    return Object.freeze({
      route: "HANDOFF_SAFETY_REVIEW",
      reasonCode: "INSTRUCTION_OVERRIDE_ATTEMPT",
    });
  }

  return null;
}
