import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { DEMO_INPUT, FIXED_CASES } from "../data/fixed-cases.mjs";
import { buildKevReviewPacket } from "../src/build-review-packet.mjs";
import { runFixedEvaluation } from "../src/evaluate.mjs";
import KevReviewPacketFixtureProvider from "../src/promptfoo-fixture-provider.mjs";
import { RESPONSES_API_GPT_5_MINI_SEAM } from "../src/responses-api-fixture.mjs";

test("builds a local human-review packet from the complete synthetic record", () => {
  const result = buildKevReviewPacket(DEMO_INPUT);

  assert.equal(result.route, "EVIDENCE_PACKET_READY");
  assert.equal(result.reasonCode, "SYNTHETIC_SOURCE_ACCEPTED");
  assert.equal(result.packetCreated, true);
  assert.equal(result.packet.record.cveId, "SYN-CVE-2026-0001");
  assert.equal(result.actionBoundary.externalActionsPerformed, false);
  assert.deepEqual(result.actionBoundary.permittedActions, []);
  assert.equal(result.trace.recordSha256.length, 64);
});

test("matches the recorded local demonstration", async () => {
  const expectedPath = new URL("../expected-output.json", import.meta.url);
  const expected = JSON.parse(await readFile(expectedPath, "utf8"));

  assert.deepEqual(buildKevReviewPacket(DEMO_INPUT), expected);
});

test("preserves Unknown rather than inventing a stronger claim", () => {
  const unknownCase = FIXED_CASES.find(({ id }) => id === "unknown-is-preserved");
  const result = buildKevReviewPacket(unknownCase.input);

  assert.equal(result.packet.record.knownRansomwareCampaignUse, "Unknown");
  assert.doesNotMatch(JSON.stringify(result), /no\s+ransomware/i);
});

test("rejects every declared invalid or unsafe fixed case", () => {
  const invalidCases = FIXED_CASES.filter(({ expectedRoute }) => expectedRoute === "SOURCE_REJECTED");

  for (const testCase of invalidCases) {
    const result = buildKevReviewPacket(testCase.input);
    assert.equal(result.route, testCase.expectedRoute, testCase.id);
    assert.equal(result.reasonCode, testCase.expectedReasonCode, testCase.id);
    assert.equal(result.packetCreated, false, testCase.id);
    assert.equal(result.actionBoundary.externalActionsPerformed, false, testCase.id);
  }
});

test("passes the six fixed local cases with no external action", () => {
  const evaluation = runFixedEvaluation();

  assert.equal(evaluation.overallStatus, "PASS");
  assert.equal(evaluation.passCount, 6);
  assert.deepEqual(evaluation.hardGates, {
    expectedRoutesAndReasonCodesPassed: true,
    unknownValuePreserved: true,
    noExternalActionsObserved: true,
  });
});

test("keeps the optional Promptfoo provider local and deterministic", async () => {
  const provider = new KevReviewPacketFixtureProvider();
  const response = await provider.callApi("ignored by local fixture", {
    vars: { case_id: "private-field-is-rejected" },
  });
  const output = JSON.parse(response.output);

  assert.equal(provider.id(), "kev-review-packet-starter-fixture-only");
  assert.equal(response.metadata.providerMode, "fixture_only_no_network_no_credential");
  assert.equal(output.route, "SOURCE_REJECTED");
  assert.equal(output.reasonCode, "DISALLOWED_RECORD_FIELD");
});

test("keeps the GPT-5 mini Responses API seam static and unexecuted", async () => {
  const source = await readFile(new URL("../src/responses-api-fixture.mjs", import.meta.url), "utf8");

  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.status, "design_note_only_not_executed");
  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.requestShape.api, "Responses API");
  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.requestShape.model, "gpt-5-mini");
  assert.equal(RESPONSES_API_GPT_5_MINI_SEAM.requestShape.store, false);
  assert.doesNotMatch(source, /fetch\(|process\.env|OPENAI_API_KEY|from\s+["']openai["']/i);
});
