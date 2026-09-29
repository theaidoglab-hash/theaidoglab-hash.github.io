import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const examples = ['policy-pilot', 'renewal-triage', 'approval-queue', 'ai-batch-worker', 'kev-review-packet', 'workforce-signal-brief'];
const requiredReadmes = ['README.md', 'README.zh-HK.md', 'README.zh-TW.md', 'README.zh-Hans.md'];
const requiredFiles = ['.gitignore', 'LICENSE', '.github/workflows/ci.yml', 'docs/demonstration-map.md', ...requiredReadmes];
const exampleSpecificFiles = {
  'ai-batch-worker': [
    'docs/brief.md',
    'docs/acceptance-cases.md',
    'docs/retry-policy.md',
    'docs/decision-log.md',
    'docs/pilot-measurement-map.md',
  ],
  'renewal-triage': [
    'docs/brief.md',
    'docs/portfolio-tutorial.md',
    'docs/pilot-measurement-map.md',
  ],
  'policy-pilot': [
    'src/responses-api-fixture.mjs',
    'evals/promptfoo.fixture.yaml',
    'evals/promptfoo.responses.optional.yaml',
    'schemas/policy-pilot-response-format.json',
    'docs/optional-responses-demo-contract.md',
  ],
  'approval-queue': [
    'data/responses-api-gpt-5-mini.fixture.json',
    'src/decision-contract.mjs',
    'docs/decision-contract.md',
    'docs/optional-responses-demo-contract.md',
    'docs/evaluation-release-monitoring.md',
  ],
  'kev-review-packet': [
    'data/kev-record.fixture.json',
    'data/source-manifest.fixture.json',
    'schemas/kev-review-contract.schema.json',
    'schemas/promptfoo-evidence-packet-response-format.json',
    'prompts/review-packet-v1.txt',
    'evals/promptfoo.fixture.yaml',
    'evals/promptfoo.responses.optional.yaml',
    'scripts/eval-diff.mjs',
    'docs/evidence-delta-change-001.md',
    'docs/decision-log.md',
    'docs/release-gate.md',
    'docs/rollback.md',
  ],
  'workforce-signal-brief': [
    'data/source-manifest.fixture.json',
    'data/series.fixture.json',
    'schemas/workforce-signal-contract.schema.json',
    'schemas/promptfoo-context-brief-response-format.json',
    'prompts/context-brief-v1.txt',
    'evals/promptfoo.fixture.yaml',
    'evals/promptfoo.responses.optional.yaml',
    'scripts/eval-diff.mjs',
    'docs/data-contract.md',
    'docs/framework-selection.md',
    'docs/evaluation-release-monitoring.md',
    'docs/portfolio-tutorial.md',
  ],
};
const operationalDocumentation = {
  'approval-queue': 'docs/evaluation-release-monitoring.md',
  'ai-batch-worker': 'docs/pilot-measurement-map.md',
};
const decisionContractDocumentation = {
  'approval-queue': {
    path: 'docs/decision-contract.md',
    requiredPhrases: [/business outcome/i, /guardrails/i, /data receipt/i, /acceptance matrix/i, /rollback/i, /not_measured_in_this_fixture/i],
  },
};
const tutorialDocumentation = {
  'renewal-triage': {
    path: 'docs/portfolio-tutorial.md',
    requiredPhrases: [/point-in-time/i, /baseline/i, /capacity-aware/i, /release gate/i, /rollback/i, /Promptfoo/i, /synthetic/i],
  },
};
const briefDocumentation = {
  'renewal-triage': {
    path: 'docs/brief.md',
    requiredPhrases: [/synthetic/i, /human review/i, /asOf/i, /baseline/i, /candidate/i, /stop conditions/i],
  },
};
const sourceExtensions = new Set(['.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.md', '.txt']);
const readmePattern = /^README(?:\.zh-(?:HK|TW|Hans))?\.md$/;
const han = /\p{Script=Han}/u;

function fail(message) {
  throw new Error(message);
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' || entry.name === '.git' ? [] : listFiles(target);
    return [target];
  });
}

for (const example of examples) {
  const directory = path.join(root, 'examples', example);
  if (!fs.existsSync(directory)) fail(example + ': missing example directory');

  for (const relativePath of [...requiredFiles, ...(exampleSpecificFiles[example] ?? [])]) {
    if (!fs.existsSync(path.join(directory, relativePath))) fail(example + ': missing ' + relativePath);
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  if (manifest.private !== true) fail(example + ': package.json must set private=true to prevent npm publication');
  if (!manifest.scripts?.test || !manifest.scripts?.demo) fail(example + ': package.json must retain test and demo commands');

  const map = fs.readFileSync(path.join(directory, 'docs', 'demonstration-map.md'), 'utf8');
  for (const phrase of [/technical/i, /non-technical/i, /business/i, /end-to-end/i, /test evidence/i, /non-?claims/i]) {
    if (!phrase.test(map)) fail(example + ': demonstration map misses required evidence section ' + phrase);
  }

  const operationalDocument = operationalDocumentation[example];
  if (operationalDocument) {
    const document = fs.readFileSync(path.join(directory, operationalDocument), 'utf8');
    for (const phrase of [/fixture[- ]only/i, /human owner/i, /monitoring/i, /rollback|stop/i, /non-production/i]) {
      if (!phrase.test(document)) fail(example + ': operational document misses required boundary ' + phrase);
    }

    const readme = fs.readFileSync(path.join(directory, 'README.md'), 'utf8');
    if (!readme.includes(operationalDocument)) {
      fail(example + ': README must link ' + operationalDocument);
    }
    if (!map.includes(path.basename(operationalDocument))) {
      fail(example + ': demonstration map must link ' + operationalDocument);
    }
  }

  const decisionContract = decisionContractDocumentation[example];
  if (decisionContract) {
    const document = fs.readFileSync(path.join(directory, decisionContract.path), 'utf8');
    for (const phrase of decisionContract.requiredPhrases) {
      if (!phrase.test(document)) fail(example + ': decision contract misses required evidence ' + phrase);
    }

    const readme = fs.readFileSync(path.join(directory, 'README.md'), 'utf8');
    const map = fs.readFileSync(path.join(directory, 'docs', 'demonstration-map.md'), 'utf8');
    if (!readme.includes(decisionContract.path) || !map.includes(path.basename(decisionContract.path))) {
      fail(example + ': README and demonstration map must link its decision contract');
    }
  }

  const tutorial = tutorialDocumentation[example];
  if (tutorial) {
    const document = fs.readFileSync(path.join(directory, tutorial.path), 'utf8');
    for (const phrase of tutorial.requiredPhrases) {
      if (!phrase.test(document)) fail(example + ': portfolio tutorial misses required concept ' + phrase);
    }

    const readme = fs.readFileSync(path.join(directory, 'README.md'), 'utf8');
    const map = fs.readFileSync(path.join(directory, 'docs', 'demonstration-map.md'), 'utf8');
    if (!readme.includes(tutorial.path) || !map.includes(path.basename(tutorial.path))) {
      fail(example + ': README and demonstration map must link its portfolio tutorial');
    }
    for (const readmeName of requiredReadmes) {
      const localizedReadme = fs.readFileSync(path.join(directory, readmeName), 'utf8');
      if (!localizedReadme.includes(tutorial.path)) {
        fail(example + ': ' + readmeName + ' must link its portfolio tutorial');
      }
    }
  }

  const brief = briefDocumentation[example];
  if (brief) {
    const document = fs.readFileSync(path.join(directory, brief.path), 'utf8');
    for (const phrase of brief.requiredPhrases) {
      if (!phrase.test(document)) fail(example + ': problem brief misses required concept ' + phrase);
    }
    const map = fs.readFileSync(path.join(directory, 'docs', 'demonstration-map.md'), 'utf8');
    if (!map.includes(path.basename(brief.path))) {
      fail(example + ': demonstration map must link its problem brief');
    }
    for (const readmeName of requiredReadmes) {
      const readme = fs.readFileSync(path.join(directory, readmeName), 'utf8');
      if (!readme.includes(brief.path)) fail(example + ': ' + readmeName + ' must link its problem brief');
    }
  }

  for (const file of listFiles(directory)) {
    const name = path.basename(file);
    const extension = path.extname(file).toLowerCase();
    if (!sourceExtensions.has(extension) && name !== '.gitignore' && name !== 'LICENSE') continue;
    const content = fs.readFileSync(file, 'utf8');
    if (/(?:\.\.\/){1,2}(?:policy-pilot|renewal-triage|approval-queue|ai-batch-worker|kev-review-packet|workforce-signal-brief)(?:\/|\b)/.test(content)) {
      fail(example + ': local cross-example link prevents standalone repository export in ' + path.relative(directory, file));
    }
    if (readmePattern.test(name)) {
      if (name !== 'README.md') continue;
      if (han.test(content)) fail(example + ': non-English canonical README text found in ' + path.relative(directory, file));
      continue;
    }
    if (han.test(content)) fail(example + ': non-English source or documentation text found in ' + path.relative(directory, file));
  }
}

console.log('Validated ' + examples.length + ' English-source portfolio examples with translated README-only editions.');
