export const RETRY_CATEGORIES = Object.freeze({
  timeout: Object.freeze({ retryable: true, baseDelayMs: 500, maxDelayMs: 4_000 }),
  rate_limited: Object.freeze({ retryable: true, baseDelayMs: 1_000, maxDelayMs: 8_000 }),
});

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
    throw new TypeError("Retry is not allowed for category " + category);
  }
  if (!Number.isInteger(attempt) || attempt < 1) {
    throw new TypeError("attempt must be a positive integer");
  }
  if (!Number.isInteger(jitterWindowMs) || jitterWindowMs < 0) {
    throw new TypeError("jitterWindowMs must be a non-negative integer");
  }

  const exponentialDelayMs = Math.min(
    categoryPolicy.baseDelayMs * 2 ** (attempt - 1),
    categoryPolicy.maxDelayMs,
  );
  const jitterMs = jitterWindowMs === 0
    ? 0
    : deterministicHash(idempotencyKey + ":" + category + ":" + attempt) % (jitterWindowMs + 1);

  return Object.freeze({
    category,
    attempt,
    exponentialDelayMs,
    jitterMs,
    delayMs: exponentialDelayMs + jitterMs,
  });
}
