import { createHash } from "node:crypto";

import {
  CORPUS_VERSION,
  isCurrentApprovedPolicy,
  policySearchText,
  SYNTHETIC_POLICIES,
} from "./synthetic-corpus.mjs";

export const REFERENCE_VERSION = "policy-pilot-reference-0.1.0";
export const DEFAULT_AS_OF = "2026-09-24";
export const MIN_BASELINE_SCORE = 6;

// This is intentionally empty. The sample has no write-capable integration,
// and every route returns action.kind === "none".
export const ACTION_CONTRACT = Object.freeze({
  mode: "read_only",
  allowedActions: Object.freeze([]),
  prohibitedActions: Object.freeze([
    "refund",
    "change_order",
    "read_account",
    "take_payment",
    "send_external_message",
    "create_case",
  ]),
  requiresHumanReview: true,
});

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "ask",
  "at",
  "can",
  "customer",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "on",
  "please",
  "the",
  "to",
  "what",
  "with",
]);

const INJECTION_PATTERNS = [
  /ignore\s+(?:(?:all|the|previous)\s+)*(?:policy|instructions?)/i,
  /disregard\s+(?:the\s+)?(?:policy|instructions?)/i,
  /system\s+prompt/i,
];

const READ_ONLY_ACTION_PATTERN =
  /\b(refund|cancel\s+(?:my\s+)?order|change\s+(?:my\s+)?order|read\s+(?:my\s+)?account|take\s+payment|charge\s+(?:my\s+)?card|send\s+(?:an\s+)?(?:email|message)|create\s+(?:a\s+)?case)\b/i;

function fingerprint(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function normalise(value) {
  return value.normalize("NFKC").toLocaleLowerCase();
}

function tokenize(value) {
  return (normalise(value).match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (token) => !STOP_WORDS.has(token),
  );
}

function scorePolicy(query, policy) {
  const queryTokens = new Set(tokenize(query));
  const searchableTokens = new Set(tokenize(policySearchText(policy)));
  const tokenOverlap = [...queryTokens].filter((token) => searchableTokens.has(token));
  const queryText = normalise(query);
  const keywordHits = policy.keywords.filter((keyword) =>
    queryText.includes(normalise(keyword)),
  );

  return {
    score: tokenOverlap.length + keywordHits.length * 2,
    tokenOverlap,
    keywordHits,
  };
}

function policySafetyReason(policy, asOf) {
  if (policy.status !== "approved") {
    return `status_${policy.status}`;
  }
  if (policy.effectiveFrom > asOf) {
    return "not_effective_yet";
  }
  if (policy.effectiveTo < asOf) {
    return "expired";
  }
  return "not_current";
}

function explicitUnsafeSourceRequest(query) {
  return /\b(?:20\d{2}|old|retired|superseded|draft)\b/i.test(query);
}

function detectSafetyBlock(query) {
  if (INJECTION_PATTERNS.some((pattern) => pattern.test(query))) {
    return {
      reasonCode: "PROMPT_INJECTION",
      message: "The input attempts to override the policy boundary. Processing stopped and requires human review.",
    };
  }

  if (READ_ONLY_ACTION_PATTERN.test(query)) {
    return {
      reasonCode: "READ_ONLY_BOUNDARY",
      message: "This local reference prepares drafts only. It cannot refund, change orders, read accounts, take payment, or send external messages.",
    };
  }

  return null;
}

function makeCitation(policy) {
  return {
    policyId: policy.policyId,
    version: policy.version,
    title: policy.title,
    excerpt: policy.citationExcerpt,
    sourceNote: policy.sourceNote,
  };
}

function emptyAction() {
  return {
    kind: "none",
    mode: ACTION_CONTRACT.mode,
    requiresHumanReview: ACTION_CONTRACT.requiresHumanReview,
  };
}

function makeTrace({ query, asOf, safety, retrieval, citations, route, reasonCode }) {
  return {
    traceSchemaVersion: "1.0",
    traceId: `pp-${fingerprint(`${asOf}:${query}`).slice(0, 16)}`,
    referenceVersion: REFERENCE_VERSION,
    corpusVersion: CORPUS_VERSION,
    asOf,
    // Deliberately retain a fingerprint and simple metadata, never the raw query.
    querySha256: fingerprint(query),
    queryCharacterCount: query.length,
    safety,
    retrieval,
    route,
    reasonCode,
    citationRefs: citations.map(({ policyId, version }) => ({ policyId, version })),
    actionContract: {
      mode: ACTION_CONTRACT.mode,
      allowedActionCount: ACTION_CONTRACT.allowedActions.length,
      requiresHumanReview: ACTION_CONTRACT.requiresHumanReview,
    },
  };
}

function makeHandoff({ query, asOf, reasonCode, message, safety, retrieval }) {
  const citations = [];
  return {
    route: "handoff",
    reasonCode,
    draftResponse: message,
    citations,
    action: emptyAction(),
    trace: makeTrace({
      query,
      asOf,
      safety,
      retrieval,
      citations,
      route: "handoff",
      reasonCode,
    }),
  };
}

/**
 * Runs a deterministic keyword baseline over an entirely synthetic corpus.
 * It never calls a model, API, filesystem, or write-capable tool.
 */
export function runPolicyPilot(query, { asOf = DEFAULT_AS_OF, corpus = SYNTHETIC_POLICIES } = {}) {
  if (typeof query !== "string" || query.trim().length === 0) {
    throw new TypeError("query must be a non-empty string");
  }

  const safetyBlock = detectSafetyBlock(query);
  if (safetyBlock) {
    return makeHandoff({
      query,
      asOf,
      reasonCode: safetyBlock.reasonCode,
      message: safetyBlock.message,
      safety: { blocked: true, reasonCode: safetyBlock.reasonCode },
      retrieval: { skipped: true, reason: "safety_block" },
    });
  }

  const scored = corpus
    .map((policy) => ({ policy, ...scorePolicy(query, policy) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.policy.policyId.localeCompare(right.policy.policyId));

  const rejected = scored
    .filter(({ policy }) => !isCurrentApprovedPolicy(policy, asOf))
    .map(({ policy, score }) => ({
      policyId: policy.policyId,
      version: policy.version,
      score,
      reason: policySafetyReason(policy, asOf),
    }));

  if (explicitUnsafeSourceRequest(query) && rejected.length > 0) {
    return makeHandoff({
      query,
      asOf,
      reasonCode: "STALE_OR_UNAPPROVED_SOURCE",
      message: "The query points to a superseded or unapproved synthetic source. It will not be cited; a human must confirm the current policy.",
      safety: { blocked: true, reasonCode: "STALE_OR_UNAPPROVED_SOURCE" },
      retrieval: {
        type: "keyword_baseline",
        skipped: false,
        minimumScore: MIN_BASELINE_SCORE,
        eligibleCandidates: [],
        rejectedCandidates: rejected,
      },
    });
  }

  const eligible = scored
    .filter(({ policy, score }) => isCurrentApprovedPolicy(policy, asOf) && score >= MIN_BASELINE_SCORE)
    .slice(0, 1);
  const retrieval = {
    type: "keyword_baseline",
    skipped: false,
    minimumScore: MIN_BASELINE_SCORE,
    eligibleCandidates: eligible.map(({ policy, score, tokenOverlap, keywordHits }) => ({
      policyId: policy.policyId,
      version: policy.version,
      score,
      matchedTokens: tokenOverlap,
      matchedKeywords: keywordHits,
    })),
    rejectedCandidates: rejected,
  };

  if (eligible.length === 0) {
    return makeHandoff({
      query,
      asOf,
      reasonCode: "NO_SUPPORTED_POLICY",
      message: "The current approved synthetic policies do not provide enough support. Add context or route the case to human review.",
      safety: { blocked: false },
      retrieval,
    });
  }

  const policy = eligible[0].policy;
  const citations = [makeCitation(policy)];
  return {
    route: "answer_with_citation",
    reasonCode: "SUPPORTED_BY_ACTIVE_POLICY",
    draftResponse: `According to synthetic policy ${policy.policyId} ${policy.version}: ${policy.answer} This is a read-only draft that requires human confirmation; the system performs no external action.`,
    citations,
    action: emptyAction(),
    trace: makeTrace({
      query,
      asOf,
      safety: { blocked: false },
      retrieval,
      citations,
      route: "answer_with_citation",
      reasonCode: "SUPPORTED_BY_ACTIVE_POLICY",
    }),
  };
}
