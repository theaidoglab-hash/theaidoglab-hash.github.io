const MAX_SOURCE_AGE_DAYS = 31;
const OUT_OF_SCOPE = /forecast|prediction|hiring|salary|visa|migration|investment|publish|external action/i;

function reject(reasonCode) {
  return {
    route: 'SOURCE_REJECTED',
    reasonCodes: [reasonCode],
    packet: null
  };
}

function hasForbiddenField(receipt, rows) {
  const forbidden = new Set(receipt.forbiddenFields ?? []);
  return rows.some(row => Object.keys(row).some(field => forbidden.has(field)));
}

function periodsAreStrictlyAscending(rows) {
  const periods = rows.map(row => row.period);
  return periods.every((period, index) => typeof period === 'string' && (index === 0 || periods[index - 1] < period));
}

function buildPacket(rows) {
  return {
    fixtureStatus: 'synthetic_source_shaped_not_live_acquired',
    facts: rows.map(({ period, fictional_region, synthetic_index, unit, fixture_label }) => ({ period, fictional_region, synthetic_index, unit, fixture_label })),
    reviewerQuestions: [
      'Is this still synthetic and not acquired from a live source?',
      'Is the stated unit sufficient for the intended human-written context?',
      'What source terms and interpretation checks would be needed before any future release?'
    ],
    prohibitedActions: ['forecast', 'hiring-recommendation', 'salary-advice', 'visa-or-migration-advice', 'publication', 'external-action']
  };
}

export function evaluateSourceReceipt({ receipt, rows, request }) {
  if (receipt.status !== 'synthetic_source_shaped_not_live_acquired') return reject('SOURCE_NOT_SYNTHETIC');
  if (receipt.unit !== 'indexed-points' || rows.some(row => row.unit !== 'indexed-points')) return reject('MISSING_UNIT');
  if (receipt.sourceAgeDays > MAX_SOURCE_AGE_DAYS) return reject('STALE_RECEIPT');
  if (!periodsAreStrictlyAscending(rows)) return reject('UNORDERED_PERIOD');
  if (hasForbiddenField(receipt, rows)) return reject('PRIVATE_FIELD');
  if (OUT_OF_SCOPE.test(request)) return reject('OUT_OF_SCOPE_REQUEST');

  return {
    route: 'CONTEXT_BRIEF_READY',
    reasonCodes: [],
    packet: buildPacket(rows)
  };
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
