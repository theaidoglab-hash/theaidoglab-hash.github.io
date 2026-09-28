import { fixedCases } from '../src/fixed-cases.mjs';
import { evaluateSourceReceipt } from '../src/evaluate.mjs';

const report = {
  runId: 'WSB-LOCAL-RUN-001',
  fixtureStatus: 'synthetic_source_shaped_not_live_acquired',
  cases: fixedCases.map(testCase => {
    const result = evaluateSourceReceipt(testCase.input);
    return {
      id: testCase.id,
      route: result.route,
      reasonCode: result.reasonCodes[0] ?? null,
      expectedRoute: testCase.expectedRoute,
      expectedReason: testCase.expectedReason,
      matchesExpectation: result.route === testCase.expectedRoute && (result.reasonCodes[0] ?? null) === testCase.expectedReason
    };
  })
};

console.log(JSON.stringify(report, null, 2));
