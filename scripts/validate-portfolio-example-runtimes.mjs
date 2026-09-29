import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const npmCli = process.env.npm_execpath;
const npmNode = process.env.npm_node_execpath || process.execPath;
const receiptPath = path.join(root, 'content', 'portfolio-example-receipts.json');

// Keep this list explicit. These are the existing deterministic, fixture-only
// commands that each standalone example documents. Do not discover or run
// arbitrary package scripts here: a portfolio reference must not gain a new
// side effect merely because a future script was added to its package.json.
const checks = [
  { example: 'policy-pilot', scripts: ['test', 'demo'] },
  { example: 'renewal-triage', scripts: ['test', 'demo'] },
  { example: 'approval-queue', scripts: ['test', 'demo'] },
  { example: 'ai-batch-worker', scripts: ['test', 'demo'] },
  { example: 'kev-review-packet', scripts: ['test', 'fixture:validate', 'demo', 'eval:diff'] },
  { example: 'workforce-signal-brief', scripts: ['test', 'fixture:validate', 'demo', 'eval:diff'] },
];
const expectedArticleSlugs = {
  'policy-pilot': 'enterprise-ai-portfolio-policy-pilot',
  'renewal-triage': 'renewal-triage-mlops',
  'approval-queue': 'approval-queue-low-code-portfolio',
  'ai-batch-worker': 'build-a-resumable-ai-batch-worker',
  'kev-review-packet': 'build-a-public-data-kev-review-packet',
  'workforce-signal-brief': 'build-a-source-bound-context-brief',
};

function fail(message) {
  throw new Error(message);
}

function outputFor(result) {
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
}

function runNpm(args, options) {
  if (process.platform !== 'win32') return spawnSync('npm', args, options);
  if (!npmCli || !fs.existsSync(npmCli)) {
    fail('[portfolio runtime] Windows runner is unavailable; run this validator through "npm run validate:example-runtimes".');
  }
  // Run npm's JavaScript CLI through Node instead of a shell-wrapped .cmd file.
  // This avoids argument interpolation and keeps the package-script list fixed.
  return spawnSync(npmNode, [npmCli, ...args], options);
}

if (!fs.existsSync(receiptPath)) fail('[portfolio runtime] missing portfolio-example-receipts.json');
const receiptRecords = JSON.parse(fs.readFileSync(receiptPath, 'utf8')).receipts;
if (!Array.isArray(receiptRecords) || receiptRecords.length !== checks.length) {
  fail('[portfolio runtime] the public local-review receipts must cover each fixed example exactly once');
}
const receiptsByExample = new Map(receiptRecords.map(receipt => [receipt.exampleId, receipt]));
if (receiptsByExample.size !== checks.length) fail('[portfolio runtime] duplicate or missing local-review receipt example ids');

for (const check of checks) {
  const receipt = receiptsByExample.get(check.example);
  if (!receipt) fail(`[portfolio runtime] ${check.example}: missing public local-review receipt`);
  if (receipt.articleSlug !== expectedArticleSlugs[check.example]) {
    fail(`[portfolio runtime] ${check.example}: local-review receipt points to the wrong article`);
  }
  const expectedCommands = check.scripts.map(script => script === 'test' ? 'npm test' : `npm run ${script}`);
  if (!Array.isArray(receipt.localCommands) || receipt.localCommands.join('\u0000') !== expectedCommands.join('\u0000')) {
    fail(`[portfolio runtime] ${check.example}: local-review receipt commands do not match this fixed runtime gate`);
  }
  for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans', 'en']) {
    const copy = receipt.copy?.[locale];
    for (const field of ['decision', 'dataAndModel', 'doesNotProve']) {
      if (typeof copy?.[field] !== 'string' || !copy[field].trim()) {
        fail(`[portfolio runtime] ${check.example}: missing ${locale} local-review receipt ${field}`);
      }
    }
  }
}

for (const check of checks) {
  const directory = path.join(root, 'examples', check.example);
  if (!fs.existsSync(directory)) fail(`[portfolio runtime] ${check.example}: missing example directory`);

  const manifestPath = path.join(directory, 'package.json');
  if (!fs.existsSync(manifestPath)) fail(`[portfolio runtime] ${check.example}: missing package.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const script of check.scripts) {
    if (!manifest.scripts?.[script]) {
      fail(`[portfolio runtime] ${check.example}: missing required deterministic script "${script}"`);
    }

    const args = script === 'test' ? ['test'] : ['run', script];
    const commandLabel = `npm ${args.join(' ')}`;
    process.stdout.write(`[portfolio runtime] ${check.example}: ${commandLabel}\n`);
    const result = runNpm(args, {
      cwd: directory,
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 120_000,
    });

    if (result.error || result.status !== 0) {
      const detail = (result.error?.message ?? outputFor(result)) || 'no command output';
      fail(`[portfolio runtime] FAILED ${check.example}: ${commandLabel}\n${detail}`);
    }
  }
}

console.log(`[portfolio runtime] Passed ${checks.length} fixture-only examples.`);
