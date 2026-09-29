import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  blockedActionRequest,
  citedDraftRequest,
  instructionOverrideRequest,
  unsupportedQuestionRequest,
} from "../data/request-fixtures.mjs";
import { syntheticFaqSnapshot } from "../data/synthetic-faq.mjs";
import { ALLOWED_OPERATION, STARTER_BOUNDARY } from "../src/contracts.mjs";
import { routeApprovalQueue } from "../src/route-approval-queue.mjs";

test("a current approved synthetic FAQ produces a cited draft for human approval", () => {
  const result = routeApprovalQueue({ snapshot: syntheticFaqSnapshot, request: citedDraftRequest });

  assert.equal(result.route, "DRAFT_FOR_HUMAN_APPROVAL");
  assert.equal(result.reasonCode, "CURRENT_APPROVED_FAQ_CITED");
  assert.equal(result.draft.provider, "deterministic_local_template");
  assert.equal(result.draft.network, "disabled");
  assert.equal(result.draft.modelCallMade, false);
  assert.deepEqual(result.citations.map(({ faqId, version }) => ({ faqId, version })), [{ faqId: "SYN-FAQ-001", version: "v1" }]);
  assert.equal(result.action.kind, "none");
  assert.equal(result.action.status, "not_executed");
  assert.equal(result.reviewer.status, "pending_human_approval");
  assert.equal(result.trace.rawQuestionStored, false);
  assert.equal(JSON.stringify(result.trace).includes(citedDraftRequest.question), false);
  assert.equal(result.futureMeasurement.status, "not_measured_in_this_fixture");
  assert.equal(result.sourceReceipt.containsRealCustomerData, false);
});

test("an unsupported question is handed off without a draft", () => {
  const result = routeApprovalQueue({ snapshot: syntheticFaqSnapshot, request: unsupportedQuestionRequest });

  assert.equal(result.route, "HANDOFF_NO_CURRENT_APPROVED_SUPPORT");
  assert.equal(result.draft, null);
  assert.deepEqual(result.citations, []);
  assert.equal(result.reviewer.status, "handoff_required");
});

test("an instruction override is handed off before retrieval", () => {
  const result = routeApprovalQueue({ snapshot: syntheticFaqSnapshot, request: instructionOverrideRequest });

  assert.equal(result.route, "HANDOFF_SAFETY_REVIEW");
  assert.equal(result.reasonCode, "INSTRUCTION_OVERRIDE_ATTEMPT");
  assert.equal(result.trace.retrieval, null);
  assert.equal(result.draft, null);
});

test("a requested external action is blocked before retrieval or execution", () => {
  const result = routeApprovalQueue({ snapshot: syntheticFaqSnapshot, request: blockedActionRequest });

  assert.equal(result.route, "BLOCKED_EXTERNAL_ACTION_REQUEST");
  assert.equal(result.reasonCode, "REQUESTED_ACTION_NOT_ALLOWED");
  assert.equal(result.trace.retrieval, null);
  assert.equal(result.action.kind, "none");
  assert.equal(result.actionBoundary.externalActionsPerformed, false);
  assert.equal(result.reviewer.status, "manual_work_required");
});

test("an expired source cannot become a cited draft", () => {
  const result = routeApprovalQueue({
    snapshot: syntheticFaqSnapshot,
    request: citedDraftRequest,
    asOf: "2028-01-01",
  });

  assert.equal(result.route, "HANDOFF_NO_CURRENT_APPROVED_SUPPORT");
  assert.equal(result.draft, null);
  assert.deepEqual(result.citations, []);
});

test("a deterministic-template failure fails closed to a human handoff", () => {
  const result = routeApprovalQueue({
    snapshot: syntheticFaqSnapshot,
    request: citedDraftRequest,
    simulateDraftFailure: true,
  });

  assert.equal(result.route, "HANDOFF_DETERMINISTIC_TEMPLATE_UNAVAILABLE");
  assert.equal(result.draft, null);
  assert.equal(result.action.kind, "none");
});

test("a non-synthetic fixture is blocked before any queue route is created", () => {
  const invalidSnapshot = structuredClone(syntheticFaqSnapshot);
  invalidSnapshot.provenance = "unverified_external_data";

  const result = routeApprovalQueue({ snapshot: invalidSnapshot, request: citedDraftRequest });

  assert.equal(result.route, "BLOCKED_INVALID_FIXTURE");
  assert.equal(result.reasonCode, "SYNTHETIC_PROVENANCE_REQUIRED");
  assert.equal(result.draft, null);
});

test("the declared operation and local-only action boundary remain narrow", () => {
  assert.equal(ALLOWED_OPERATION, "prepare_cited_draft");
  assert.equal(STARTER_BOUNDARY.output, "cited_draft_for_human_review");
  assert.equal(STARTER_BOUNDARY.externalActionsPerformed, false);
  assert.equal(STARTER_BOUNDARY.requiresHumanReview, true);
  assert.deepEqual(STARTER_BOUNDARY.prohibitedActions, [
    "create_ticket",
    "issue_refund",
    "read_account",
    "send_external_message",
    "update_record",
  ]);
});

test("the runtime source has no credential, environment, or network path", () => {
  const runtime = [
    "../src/contracts.mjs",
    "../src/deterministic-draft.mjs",
    "../src/fixture-validation.mjs",
    "../src/retrieval.mjs",
    "../src/route-approval-queue.mjs",
    "../src/safety.mjs",
  ]
    .map((relativePath) => fs.readFileSync(new URL(relativePath, import.meta.url), "utf8"))
    .join("\n");

  assert.doesNotMatch(runtime, /\bfetch\s*\(|https?:\/\/|process\.env|OPENAI|api[_-]?key/i);
});
