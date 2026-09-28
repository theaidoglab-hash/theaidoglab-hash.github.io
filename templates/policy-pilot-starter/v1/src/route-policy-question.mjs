import { createHash } from "node:crypto";

import { ACTION_BOUNDARY, ALLOWED_OPERATION, STARTER_VERSION, createBlockedResult } from "./contracts.mjs";
import { FixtureValidationError, validateRequest, validateSyntheticPolicyCorpus } from "./fixture-validation.mjs";
import { findPolicyEvidence } from "./retrieve.mjs";

export const DEFAULT_AS_OF = "2026-06-15";

const INSTRUCTION_OVERRIDE_PATTERN = /\b(ignore|disregard)\b.*\b(policy|instruction|rule)/i;
const EXTERNAL_ACTION_PATTERN = /\b(refund|cancel|change\s+order|read\s+account|take\s+payment|send\s+(?:an\s+)?(?:email|message)|create\s+case)\b/i;
const STALE_SOURCE_PATTERN = /\b(20\d{2}|old|retired|superseded|draft)\b/i;

function hash(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function citationFor(policy) {
  return Object.freeze({
    policyId: policy.policyId,
    version: policy.version,
    title: policy.title,
    excerpt: policy.citationExcerpt,
    sourceNote: "synthetic authoring",
  });
}

function traceFor({ corpus, question, asOf, route, reasonCode, retrieval, citations, safety }) {
  return Object.freeze({
    traceSchemaVersion: "1.0",
    traceId: `pp-${hash(`${asOf}:${question}`).slice(0, 16)}`,
    starterVersion: STARTER_VERSION,
    corpusVersion: corpus.version,
    asOf,
    questionSha256: hash(question),
    questionCharacterCount: question.length,
    safety,
    retrieval,
    route,
    reasonCode,
    citationRefs: Object.freeze(citations.map(({ policyId, version }) => ({ policyId, version }))),
    actionBoundary: Object.freeze({
      requiresHumanReview: ACTION_BOUNDARY.requiresHumanReview,
      externalActionsPerformed: ACTION_BOUNDARY.externalActionsPerformed,
    }),
  });
}

function humanHandoff({ corpus, question, asOf, reasonCode, message, retrieval, safety }) {
  const citations = Object.freeze([]);
  return Object.freeze({
    reportVersion: STARTER_VERSION,
    route: "HUMAN_REVIEW_REQUIRED",
    reasonCode,
    draftCreated: false,
    draft: message,
    citations,
    actionBoundary: ACTION_BOUNDARY,
    trace: traceFor({ corpus, question, asOf, route: "HUMAN_REVIEW_REQUIRED", reasonCode, retrieval, citations, safety }),
    reviewerNextStep: "A human policy owner must decide the next step. The starter performs no external action.",
  });
}

function safetyResult({ corpus, question, asOf, reasonCode, message }) {
  return humanHandoff({
    corpus,
    question,
    asOf,
    reasonCode,
    message,
    safety: Object.freeze({ blocked: true, reasonCode }),
    retrieval: Object.freeze({ skipped: true, reason: "safety_boundary" }),
  });
}

/**
 * Creates either a cited synthetic draft or a human handoff. It performs no
 * model call, filesystem access, network request, or external action.
 */
export function routePolicyQuestion({ corpus, request, asOf = DEFAULT_AS_OF }) {
  if (request?.operation !== ALLOWED_OPERATION) {
    return createBlockedResult({ route: "BLOCKED_OUT_OF_SCOPE_OPERATION", reasonCode: "OPERATION_NOT_ALLOWED" });
  }

  try {
    validateSyntheticPolicyCorpus(corpus);
    validateRequest(request);
  } catch (error) {
    const reasonCode = error instanceof FixtureValidationError ? error.code : "UNEXPECTED_VALIDATION_ERROR";
    return createBlockedResult({ route: "BLOCKED_INVALID_INPUT", reasonCode });
  }

  const question = request.question.trim();
  if (INSTRUCTION_OVERRIDE_PATTERN.test(question)) {
    return safetyResult({
      corpus,
      question,
      asOf,
      reasonCode: "INSTRUCTION_OVERRIDE_ATTEMPT",
      message: "This request tries to override the policy boundary, so it must be reviewed by a person.",
    });
  }
  if (EXTERNAL_ACTION_PATTERN.test(question)) {
    return safetyResult({
      corpus,
      question,
      asOf,
      reasonCode: "READ_ONLY_BOUNDARY",
      message: "This starter can draft or hand off only. It cannot perform customer or system actions.",
    });
  }

  const evidence = findPolicyEvidence({ policies: corpus.policies, question, asOf });
  const retrieval = Object.freeze({
    type: "keyword_baseline",
    skipped: false,
    minimumScore: evidence.minimumScore,
    eligibleCandidates: Object.freeze(
      evidence.eligibleCandidates.map(({ policy, score, matchedTokens, matchedKeywords }) => ({
        policyId: policy.policyId,
        version: policy.version,
        score,
        matchedTokens,
        matchedKeywords,
      })),
    ),
    rejectedCandidates: evidence.rejectedCandidates,
  });

  if (STALE_SOURCE_PATTERN.test(question) && evidence.rejectedCandidates.length > 0) {
    return humanHandoff({
      corpus,
      question,
      asOf,
      reasonCode: "STALE_OR_UNAPPROVED_SOURCE_REQUESTED",
      message: "A stale or unapproved synthetic source was requested. It cannot support a current draft.",
      retrieval,
      safety: Object.freeze({ blocked: true, reasonCode: "STALE_OR_UNAPPROVED_SOURCE_REQUESTED" }),
    });
  }

  const candidate = evidence.eligibleCandidates[0];
  if (!candidate) {
    return humanHandoff({
      corpus,
      question,
      asOf,
      reasonCode: "NO_CURRENT_APPROVED_SUPPORT",
      message: "No current approved synthetic policy provides enough support for a draft. Route this case to a human.",
      retrieval,
      safety: Object.freeze({ blocked: false }),
    });
  }

  const citation = citationFor(candidate.policy);
  const citations = Object.freeze([citation]);
  const reasonCode = "CURRENT_APPROVED_POLICY_FOUND";
  return Object.freeze({
    reportVersion: STARTER_VERSION,
    route: "CITED_DRAFT_READY",
    reasonCode,
    draftCreated: true,
    draft: `${candidate.policy.draftAnswer} This is a read-only draft for human confirmation; no external action has occurred.`,
    citations,
    actionBoundary: ACTION_BOUNDARY,
    trace: traceFor({
      corpus,
      question,
      asOf,
      route: "CITED_DRAFT_READY",
      reasonCode,
      retrieval,
      citations,
      safety: Object.freeze({ blocked: false }),
    }),
    reviewerNextStep: "A human policy owner may check the cited source before deciding whether to send or act on anything.",
  });
}
