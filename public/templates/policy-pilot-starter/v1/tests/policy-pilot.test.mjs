import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { blockedRefundRequest, citedReturnDraftRequest } from "../data/request-fixtures.mjs";
import { SYNTHETIC_POLICY_CORPUS } from "../data/synthetic-policy-corpus.mjs";
import { runFixedEvaluation } from "../src/evaluate.mjs";
import PolicyPilotFixtureProvider from "../src/promptfoo-fixture-provider.mjs";
import { RESPONSES_API_GPT_5_MINI_SEAM } from "../src/responses-api-fixture.mjs";
import { routePolicyQuestion } from "../src/route-policy-question.mjs";

const expectedOutputPath = new URL("../expected-output.json", import.meta.url);

test("matches the recorded cited-draft demonstration", async () => {
  const expected = JSON.parse(await readFile(expectedOutputPath, "utf8"));
  const actual = routePolicyQuestion({
    corpus: SYNTHETIC_POLICY_CORPUS,
    request: citedReturnDraftRequest,
  });

  assert.deepEqual(actual, expected);
  assert.equal(actual.actionBoundary.externalActionsPerformed, false);
  assert.equal(actual.actionBoundary.requiresHumanReview, true);
});

test("uses the current approved synthetic source and records the superseded source as rejected", () => {
  const result = routePolicyQuestion({
    corpus: SYNTHETIC_POLICY_CORPUS,
    request: citedReturnDraftRequest,
  });

  assert.equal(result.route, "CITED_DRAFT_READY");
  assert.deepEqual(result.citations.map(({ policyId, version }) => ({ policyId, version })), [
    { policyId: "SYN-POL-RET-100", version: "v2" },
  ]);
  assert.equal(
    result.trace.retrieval.rejectedCandidates.some(({ policyId, version, reason }) => (
      policyId === "SYN-POL-RET-100" && version === "v1" && reason === "status_superseded"
    )),
    true,
  );
  assert.equal(JSON.stringify(result.trace).includes(citedReturnDraftRequest.question), false);
});

test("passes the fixed synthetic decision, citation, action, and trace gates", () => {
  const evaluation = runFixedEvaluation({ corpus: SYNTHETIC_POLICY_CORPUS });

  assert.equal(evaluation.overallStatus, "PASS");
  assert.equal(evaluation.passCount, 5);
  assert.deepEqual(evaluation.hardGates, {
    allExpectedRoutesPassed: true,
    allExpectedCitationsPassed: true,
    noExternalActionsObserved: true,
    allHumanReviewBoundariesPresent: true,
    tracesOmitRawQuestions: true,
  });
});

test("blocks an operation that crosses the read-only boundary", () => {
  const result = routePolicyQuestion({
    corpus: SYNTHETIC_POLICY_CORPUS,
    request: blockedRefundRequest,
  });

  assert.equal(result.route, "BLOCKED_OUT_OF_SCOPE_OPERATION");
  assert.equal(result.reasonCode, "OPERATION_NOT_ALLOWED");
  assert.equal(result.draftCreated, false);
  assert.equal(result.actionBoundary.externalActionsPerformed, false);
});

test("blocks a non-synthetic corpus before drafting", () => {
  const invalidCorpus = structuredClone(SYNTHETIC_POLICY_CORPUS);
  invalidCorpus.provenance = "unverified_external_data";

  const result = routePolicyQuestion({
    corpus: invalidCorpus,
    request: citedReturnDraftRequest,
  });

  assert.equal(result.route, "BLOCKED_INVALID_INPUT");
  assert.equal(result.reasonCode, "SYNTHETIC_PROVENANCE_REQUIRED");
  assert.equal(result.draftCreated, false);
});

test("keeps the optional Promptfoo fixture provider local and deterministic", async () => {
  const provider = new PolicyPilotFixtureProvider();
  const response = await provider.callApi("ignored by local fixture", {
    vars: { case_id: "current-approved-return" },
  });
  const output = JSON.parse(response.output);

  assert.equal(provider.id(), "policy-pilot-starter-fixture-only");
  assert.equal(response.metadata.providerMode, "fixture_only_no_network_no_credential");
  assert.equal(output.route, "CITED_DRAFT_READY");
  assert.equal(output.actionBoundary.externalActionsPerformed, false);
});

test("keeps the GPT-5 mini Responses API seam static and unexecuted", async () => {
  const source = await readFile(new URL("../src/responses-api-fixture.mjs", import.meta.url), "utf8");

  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.status, "design_note_only_not_executed");
  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.requestShape.api, "Responses API");
  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.requestShape.model, "gpt-5-mini");
  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.requestShape.store, false);
  assert.equal(Object.isFrozen(RESPONSES_API_GPT_5_MINI_SEAM), true);
  assert.equal(Object.hasOwn(RESPONSES_API_GPT_5_MINI_SEAM, "apiKey"), false);
  assert.doesNotMatch(source, /fetch\(|process\.env|OPENAI_API_KEY|from\s+["']openai["']/i);
});
