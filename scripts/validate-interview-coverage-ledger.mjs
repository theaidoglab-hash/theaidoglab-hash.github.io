import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const questionDirectory = path.join(root, 'content', 'interview-questions');
const metadataPath = path.join(root, 'content', 'interview-question-metadata.json');
const prepPath = path.join(root, 'content', 'roadmaps', 'ai-engineer-interview-prep.json');
const ledgerPath = path.join(root, 'docs', 'interview-lab-coverage-ledger.md');

const questionFiles = fs.readdirSync(questionDirectory, { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
  .map(entry => entry.name.slice(0, -'.json'.length))
  .sort();
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const prep = JSON.parse(fs.readFileSync(prepPath, 'utf8'));
const ledger = fs.readFileSync(ledgerPath, 'utf8');
const ledgerRows = ledger
  .split(/\r?\n/)
  .filter(line => line.startsWith('|'))
  .map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));

assert.ok(questionFiles.length > 0, 'Interview coverage ledger needs at least one standalone question.');
assert.ok(Array.isArray(metadata.questions), 'Interview metadata must expose a questions array.');
assert.equal(metadata.questions.length, questionFiles.length, 'Every standalone question needs one metadata record.');

const metadataSlugs = metadata.questions.map(question => question.slug).sort();
assert.deepEqual(metadataSlugs, questionFiles, 'Question metadata slugs must exactly match standalone question files.');
assert.ok(
  metadata.questions.every(question => question.companyAttribution === 'not-asserted'),
  'The coverage ledger may not claim company attribution for any standalone question.',
);

assert.ok(Array.isArray(prep.tracks), 'Interview preparation map must expose tracks.');
const questionPlacements = prep.tracks
  .flatMap(track => Array.isArray(track.resources) ? track.resources : [])
  .filter(resource => resource?.kind === 'interview-question')
  .map(resource => resource.target);
const uniquePlacedQuestions = [...new Set(questionPlacements)].sort();
assert.deepEqual(uniquePlacedQuestions, questionFiles, 'Every standalone question needs a preparation-track placement.');

const questionCount = questionFiles.length;
const placementCount = questionPlacements.length;
const trackCount = prep.tracks.length;
const expectedSnapshot = `${trackCount}-track map links to ${placementCount} question placements across ${questionCount} unique question pages.`;
assert.ok(
  ledger.includes(`${questionCount} standalone AI.DOG practice questions and ten reader-facing capability routes.`),
  'Interview coverage ledger must state the current standalone-question count.',
);
assert.ok(
  ledger.includes(`All ${questionCount} metadata records currently use \`companyAttribution: "not-asserted"\`.`),
  'Interview coverage ledger must state the current company-attribution boundary.',
);
assert.ok(ledger.includes(expectedSnapshot), 'Interview coverage ledger must state the current track-placement count.');
assert.ok(
  ledger.includes(`All ${questionCount} local questions are \`not-asserted\` for company attribution.`),
  'Interview coverage ledger must preserve the current company-bank exclusion.',
);

const exactLedgerQuestionRows = [
  { trackId: 'shared-language', route: '01. Shared language and LLM foundations' },
  { trackId: 'agent-systems', route: '04. Agents, tools and workflows' },
  { trackId: 'safety-governance', route: '10. Safety, privacy and responsible AI' },
];

for (const mapping of exactLedgerQuestionRows) {
  const track = prep.tracks.find(candidate => candidate.id === mapping.trackId);
  assert.ok(track, `Interview coverage ledger mapping needs prep track ${mapping.trackId}.`);
  assert.equal(
    track.title.en,
    mapping.route.replace(/^\d{2}\.\s/, ''),
    `Interview coverage ledger route ${mapping.route} must match prep track ${mapping.trackId}.`,
  );

  const expectedQuestionListing = `${track.resources
    .filter(resource => resource?.kind === 'interview-question')
    .length} linked questions: ${track.resources
    .filter(resource => resource?.kind === 'interview-question')
    .map(resource => `\`${resource.target}\``)
    .join(', ')}`;
  const ledgerRow = ledgerRows.find(cells => cells[1] === mapping.route);
  assert.ok(ledgerRow, `Interview coverage ledger needs the ${mapping.route} row.`);
  assert.equal(
    ledgerRow[2],
    expectedQuestionListing,
    `Interview coverage ledger must list the exact prep-question mapping for ${mapping.route}.`,
  );
}

const implementationTrack = prep.tracks.find(track => track.id === 'implementation');
assert.ok(implementationTrack, 'Interview preparation map needs the implementation track.');
const implementationScopeTerms = {
  'zh-HK': ['implementation evidence', 'state', 'queue', 'recovery', 'source receipt', '一般演算法'],
  'zh-TW': ['implementation evidence', 'state', 'queue', 'recovery', 'source receipt', '一般演算法'],
  'zh-Hans': ['implementation evidence', 'state', 'queue', 'recovery', 'source receipt', '通用算法'],
  en: ['implementation evidence', 'state', 'queue', 'recovery', 'source receipt', 'general algorithm preparation'],
};
for (const [locale, terms] of Object.entries(implementationScopeTerms)) {
  const summary = implementationTrack.summary?.[locale];
  assert.equal(typeof summary, 'string', `Implementation-track scope note needs ${locale} copy.`);
  for (const term of terms) {
    assert.ok(summary.includes(term), `Implementation-track ${locale} scope note must retain “${term}”.`);
  }
}

console.log(`Validated Interview Lab ledger against ${questionCount} questions, ${placementCount} track placements, and ${trackCount} tracks.`);
