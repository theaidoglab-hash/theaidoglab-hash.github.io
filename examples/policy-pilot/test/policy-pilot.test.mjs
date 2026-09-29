import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { FIXED_EVALUATION_CASES } from "../src/evaluation-cases.mjs";
import { runFixedEvaluation } from "../src/evaluate.mjs";
import { ACTION_CONTRACT, DEFAULT_AS_OF, runPolicyPilot } from "../src/policy-pilot.mjs";
import PolicyPilotFixtureProvider from "../src/promptfoo-fixture-provider.mjs";
import { RESPONSES_API_GPT_5_MINI_FIXTURE } from "../src/responses-api-fixture.mjs";

test("the action contract is permanently read-only", () => {
  assert.equal(ACTION_CONTRACT.mode, "read_only");
  assert.deepEqual(ACTION_CONTRACT.allowedActions, []);
  assert.equal(ACTION_CONTRACT.requiresHumanReview, true);
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("refund"));
  assert.ok(ACTION_CONTRACT.prohibitedActions.includes("send_external_message"));
});

for (const scenario of FIXED_EVALUATION_CASES) {
  test(`fixed case: ${scenario.scenarioId}`, () => {
    const result = runPolicyPilot(scenario.query, { asOf: DEFAULT_AS_OF });
    const citationRefs = result.citations.map(({ policyId, version }) => ({ policyId, version }));

    assert.equal(result.route, scenario.expectedRoute);
    assert.equal(result.reasonCode, scenario.expectedReasonCode);
    assert.deepEqual(citationRefs, scenario.expectedCitationRefs);
    assert.equal(result.action.kind, "none");
    assert.equal(result.action.mode, "read_only");
    assert.equal(result.action.requiresHumanReview, true);
    assert.equal(JSON.stringify(result.trace).includes(scenario.query), false);
  });
}

test("a current approved answer always carries a current cited source", () => {
  const result = runPolicyPilot("Can a customer return an unused demo keyboard 14 days after delivery?");

  assert.equal(result.route, "answer_with_citation");
  assert.equal(result.citations.length, 1);
  assert.deepEqual(result.citations[0], {
    policyId: "RET-100",
    version: "v2",
    title: "Synthetic return policy",
    excerpt: "Unused demonstration items may be submitted for return within 30 days of delivery. Exceptions require human review.",
    sourceNote: "synthetic authoring",
  });
  assert.equal(result.trace.retrieval.rejectedCandidates.some(({ version }) => version === "v1"), true);
});

test("the fixed synthetic evaluation has no failed hard gate", () => {
  const report = runFixedEvaluation();

  assert.equal(report.overallStatus, "PASS");
  assert.equal(report.passCount, FIXED_EVALUATION_CASES.length);
  assert.deepEqual(report.hardGates, {
    allExpectedRoutesPassed: true,
    noExternalActionsObserved: true,
    noRawQueriesInTraces: true,
    allCitationsMatchExpectation: true,
  });
});

test("blank input is rejected before any retrieval", () => {
  assert.throws(() => runPolicyPilot("   "), /non-empty string/);
});

test("the Responses API fixture is static and explicitly mock-only", () => {
  const fixtureSource = fs.readFileSync(new URL("../src/responses-api-fixture.mjs", import.meta.url), "utf8");
  const optionalConfig = fs.readFileSync(new URL("../evals/promptfoo.responses.optional.yaml", import.meta.url), "utf8");
  const demoContract = fs.readFileSync(new URL("../docs/optional-responses-demo-contract.md", import.meta.url), "utf8");

  assert.equal(RESPONSES_API_GPT_5_MINI_FIXTURE.label, "mock_only_not_executed");
  assert.equal(RESPONSES_API_GPT_5_MINI_FIXTURE.request.method, "POST");
  assert.equal(RESPONSES_API_GPT_5_MINI_FIXTURE.request.path, "/v1/responses");
  assert.equal(RESPONSES_API_GPT_5_MINI_FIXTURE.request.model, "gpt-5-mini");
  assert.equal(RESPONSES_API_GPT_5_MINI_FIXTURE.request.store, false);
  assert.equal(Object.isFrozen(RESPONSES_API_GPT_5_MINI_FIXTURE), true);
  assert.equal(Object.hasOwn(RESPONSES_API_GPT_5_MINI_FIXTURE, "apiKey"), false);
  assert.equal(Object.hasOwn(RESPONSES_API_GPT_5_MINI_FIXTURE.request, "authorization"), false);
  assert.equal(/\bsk-[A-Za-z0-9_-]+/.test(JSON.stringify(RESPONSES_API_GPT_5_MINI_FIXTURE)), false);
  assert.doesNotMatch(fixtureSource, /fetch\(|process\.env|OPENAI_API_KEY|from\s+["']openai["']/i);
  assert.match(optionalConfig, /id: openai:responses:gpt-5-mini/);
  assert.match(optionalConfig, /store: false/);
  assert.match(optionalConfig, /response_format: file:\/\/\.\.\/schemas\/policy-pilot-response-format\.json/);
  assert.doesNotMatch(optionalConfig, /apiKey\s*:|authorization\s*:|OPENAI_API_KEY/i);
  assert.match(demoContract, /method: "POST"/);
  assert.match(demoContract, /path: "\/v1\/responses"/);
  assert.match(demoContract, /gpt-5-mini/);
  assert.match(demoContract, /not a model result/i);
});

test("the human-authored model-contract fixture pairs a cited draft with a bounded rejection", () => {
  const fixture = JSON.parse(
    fs.readFileSync(new URL("../fixtures/model-contract-teaching.fixture.json", import.meta.url), "utf8"),
  );
  const teachingDoc = fs.readFileSync(
    new URL("../docs/model-contract-teaching-fixture.md", import.meta.url),
    "utf8",
  );
  const allowed = fixture.scenarios.find(({ responseClass }) => responseClass === "allowed_structured_response");
  const rejected = fixture.scenarios.find(({ responseClass }) => responseClass === "rejected_bounded_response");

  assert.equal(fixture.status, "human_authored_static_not_executed");
  assert.match(fixture.executionStatement, /not model output or a model run/i);
  assert.match(fixture.modelSeam.shape, /gpt-5-mini Responses-shaped/i);
  assert.ok(allowed);
  assert.ok(rejected);
  assert.equal(allowed.expectedRoute, allowed.structuredResponse.route);
  assert.equal(allowed.structuredResponse.route, "answer_with_citation");
  assert.equal(allowed.structuredResponse.citations.length, 1);
  assert.deepEqual(allowed.structuredResponse.action, { kind: "none", requiresHumanReview: true });
  assert.equal(allowed.reviewerDecision.decision, "REVIEW_CITED_DRAFT");
  assert.equal(rejected.expectedRoute, rejected.structuredResponse.route);
  assert.equal(rejected.structuredResponse.route, "handoff");
  assert.deepEqual(rejected.structuredResponse.citations, []);
  assert.deepEqual(rejected.structuredResponse.action, { kind: "none", requiresHumanReview: true });
  assert.equal(rejected.reviewerDecision.decision, "STOP_AND_HAND_OFF");
  assert.match(teachingDoc, /not model output or a\s+model run/i);
});

test("the Promptfoo-compatible fixture provider stays local and read-only", async () => {
  const provider = new PolicyPilotFixtureProvider();
  const response = await provider.callApi("ignored by local fixture", {
    vars: { case_id: "normal-active-return" },
  });
  const output = JSON.parse(response.output);

  assert.equal(provider.id(), "policy-pilot-fixture-only");
  assert.equal(response.metadata.providerMode, "fixture_only_no_network_no_credential");
  assert.equal(output.route, "answer_with_citation");
  assert.equal(output.action.kind, "none");
  assert.equal(output.action.requiresHumanReview, true);
});
