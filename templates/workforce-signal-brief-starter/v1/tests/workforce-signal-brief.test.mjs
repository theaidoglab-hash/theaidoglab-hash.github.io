import assert from 'node:assert/strict';
import test from 'node:test';
import { fixedCases } from '../src/fixed-cases.mjs';
import { evaluateSourceReceipt } from '../src/evaluate.mjs';

for (const testCase of fixedCases) {
  test(testCase.id + ' keeps the stated route', () => {
    const result = evaluateSourceReceipt(testCase.input);
    assert.equal(result.route, testCase.expectedRoute);
    assert.equal(result.reasonCodes[0] ?? null, testCase.expectedReason);
    if (result.route === 'CONTEXT_BRIEF_READY') {
      assert.equal(result.packet.fixtureStatus, 'synthetic_source_shaped_not_live_acquired');
      assert.equal(result.packet.prohibitedActions.includes('forecast'), true);
      assert.equal(result.packet.facts.some(row => 'candidate_salary' in row), false);
    } else {
      assert.equal(result.packet, null);
    }
  });
}
