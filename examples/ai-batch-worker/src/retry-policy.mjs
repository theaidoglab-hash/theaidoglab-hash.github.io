export const RETRY_CATEGORIES = Object.freeze({
  rate_limited: Object.freeze({ retryable: true, baseDelayMs: 1_000, maxDelayMs: 8_000 }),
  timeout: Object.freeze({ retryable: true, baseDelayMs: 500, maxDelayMs: 4_000 }),
  invalid_input: Object.freeze({ retryable: false, baseDelayMs: 0, maxDelayMs: 0 }),
  unexpected_fixture_failure: Object.freeze({ retryable: false, baseDelayMs: 0, maxDelayMs: 0 }),
});

export function classifyFixtureOutcome(outcome) {
  if (outcome.kind === "success") return Object.freeze({ category: "success", retryable: false });
  if (outcome.code === "rate_limited" && outcome.httpStatus === 429) {
    return Object.freeze({ category: "rate_limited", retryable: true });
  }
  if (outcome.code === "timeout") return Object.freeze({ category: "timeout", retryable: true });
  return Object.freeze({ category: "unexpected_fixture_failure", retryable: false });
}

function deterministicHash(value) {
  let hash = 2_166_136_261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

export function calculateRetryDelayMs({ category, attempt, idempotencyKey, jitterWindowMs }) {
  const categoryPolicy = RETRY_CATEGORIES[category];
  if (!categoryPolicy || !categoryPolicy.retryable) {
    throw new TypeError(`retry is not allowed for category ${category}`);
  }
  if (!Number.isInteger(attempt) || attempt < 1) throw new TypeError("attempt must be a positive integer");
  if (!Number.isInteger(jitterWindowMs) || jitterWindowMs < 0) {
    throw new TypeError("jitterWindowMs must be a non-negative integer");
  }

  const exponentialDelay = Math.min(
    categoryPolicy.baseDelayMs * 2 ** (attempt - 1),
    categoryPolicy.maxDelayMs,
  );
  const jitterMs = jitterWindowMs === 0
    ? 0
    : deterministicHash(`${idempotencyKey}:${category}:${attempt}`) % (jitterWindowMs + 1);

  return Object.freeze({
    category,
    attempt,
    exponentialDelayMs: exponentialDelay,
    jitterMs,
    delayMs: exponentialDelay + jitterMs,
  });
}
