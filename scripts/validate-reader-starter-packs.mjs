import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

const root = process.cwd();
const receiptPath = path.join(root, 'content', 'portfolio-example-receipts.json');
const childProcessTimeoutMs = 15_000;
const childProcessMaxBuffer = 1_024 * 1_024;
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const readmeFileByLocale = {
  'zh-HK': 'README.zh-HK.md',
  'zh-TW': 'README.zh-TW.md',
  'zh-Hans': 'README.zh-Hans.md',
  en: 'README.md',
};
const promptfooStaticCheckBoundaryByLocale = {
  'zh-HK': '唔可以當成有記錄嘅 Promptfoo pass',
  'zh-TW': '不能當成已記錄的 Promptfoo pass',
  'zh-Hans': '不能当成已经记录的 Promptfoo pass',
  en: 'not a recorded Promptfoo pass',
};

const optionalPromptfooFixture = Object.freeze({
  commandPrefix: 'npx --yes promptfoo@0.123.1 eval',
  configPath: 'evals/promptfoo.fixture.yaml',
  outputPath: 'results/promptfoo.fixture.json',
  minimumNodeVersion: 'Node.js 22.22',
  ignoredOutputDirectory: 'results/',
});

const localizedStarterArtifacts = [
  {
    exampleId: 'policy-pilot', directory: 'policy-pilot-starter', archive: 'policy-pilot-starter-v1.zip',
    commands: ['npm test', 'npm run demo'], readmeRouteMarker: 'package.json', optionalPromptfooFixture,
    fixedScripts: { test: 'node --test tests/policy-pilot.test.mjs', demo: 'node scripts/demo.mjs' },
  },
  {
    exampleId: 'renewal-triage', directory: 'renewal-triage-starter', archive: 'renewal-triage-starter-v1.zip',
    commands: ['npm test', 'npm run demo'], readmeRouteMarker: 'package.json',
    fixedScripts: { test: 'node --test tests/renewal-triage.test.mjs', demo: 'node scripts/demo.mjs' },
  },
  {
    exampleId: 'approval-queue', directory: 'approval-queue-starter', archive: 'approval-queue-starter-v1.zip',
    commands: ['npm test', 'npm run demo'], readmeRouteMarker: 'From the extracted folder',
    fixedScripts: { test: 'node --test tests/approval-queue.test.mjs', demo: 'node scripts/demo.mjs' },
  },
  {
    exampleId: 'ai-batch-worker', directory: 'ai-batch-worker-starter', archive: 'ai-batch-worker-starter-v1.zip',
    commands: ['npm test', 'npm run demo'], readmeRouteMarker: 'package.json',
    fixedScripts: { test: 'node --test tests/ai-batch-worker.test.mjs', demo: 'node scripts/demo.mjs' },
  },
  {
    exampleId: 'kev-review-packet', directory: 'kev-review-packet-starter', archive: 'kev-review-packet-starter-v1.zip',
    commands: ['npm test', 'npm run fixture:validate', 'npm run demo'], readmeRouteMarker: 'package.json', optionalPromptfooFixture,
    fixedScripts: {
      test: 'node --test tests/kev-review-packet.test.mjs',
      'fixture:validate': 'node scripts/validate-fixture.mjs',
      demo: 'node scripts/demo.mjs',
    },
  },
  {
    exampleId: 'workforce-signal-brief', directory: 'workforce-signal-brief-starter', archive: 'workforce-signal-brief-starter-v1.zip',
    commands: ['npm test', 'npm run demo'], readmeRouteMarker: 'package.json',
    fixedScripts: { test: 'node --test tests/workforce-signal-brief.test.mjs', demo: 'node scripts/demo.mjs' },
  },
];
const localizedStarterByExampleId = new Map(localizedStarterArtifacts.map((starter) => [starter.exampleId, starter]));

const requiredGitignoreEntries = [
  '.env',
  '.env.*',
  '!.env.example',
  'node_modules/',
  'coverage/',
  'reports/',
  'report/',
  'results/',
  'output/',
  'outputs/',
  'generated/',
];

const excludedArtifactDirectoryNames = new Set([
  '.cache', '.git', '.next', '.tmp', 'build', 'coverage', 'dist', 'generated', 'node_modules',
  'output', 'outputs', 'report', 'reports', 'results', 'temp', 'tmp',
]);

// This is deliberately a fixed list. Do not discover or execute package
// scripts from a starter automatically: a future starter must be reviewed
// before it joins the public build gate.
const starters = [
  {
    exampleId: 'ai-batch-worker',
    directory: 'ai-batch-worker-starter',
    archive: 'ai-batch-worker-starter-v1.zip',
    testFile: 'tests/ai-batch-worker.test.mjs',
    demoFile: 'scripts/demo.mjs',
    commands: ['npm test', 'npm run demo'],
    requiredFiles: [
      'README.md', 'CONTENTS.md', 'package.json', 'expected-output.json',
      'data/request-fixtures.mjs', 'data/synthetic-batch-fixtures.mjs',
      'src/contracts.mjs', 'src/fixture-validation.mjs', 'src/retry-policy.mjs', 'src/run-local-batch-worker.mjs',
      'src/responses-api-fixture.mjs', 'scripts/demo.mjs', 'tests/ai-batch-worker.test.mjs',
      'docs/decision-brief.md', 'docs/failure-cases.md', 'docs/metric-map.md', 'docs/manual-review-record.md',
      'docs/rollback-record.md', 'docs/adaptation-worksheet.md', 'docs/future-model-seam.md',
    ],
    checkDemo(report) {
      return report?.scope === 'synthetic_local_only'
        && report?.actionBoundary === 'human_review_only_no_external_actions'
        && Array.isArray(report?.runs)
        && report.runs.length === 2;
    },
  },
  {
    exampleId: 'kev-review-packet',
    directory: 'kev-review-packet-starter',
    archive: 'kev-review-packet-starter-v1.zip',
    testFile: 'tests/kev-review-packet.test.mjs',
    fixtureFile: 'scripts/validate-fixture.mjs',
    demoFile: 'scripts/demo.mjs',
    commands: ['npm test', 'npm run fixture:validate', 'npm run demo'],
    requiredFiles: [
      'README.md', 'package.json', 'expected-output.json',
      'data/fixed-cases.mjs', 'data/synthetic-kev-record.mjs',
      'src/contracts.mjs', 'src/validate.mjs', 'src/build-review-packet.mjs', 'src/evaluate.mjs',
      'src/promptfoo-fixture-provider.mjs', 'src/responses-api-fixture.mjs',
      'scripts/validate-fixture.mjs', 'scripts/demo.mjs', 'tests/kev-review-packet.test.mjs',
      'evals/promptfoo.fixture.yaml', 'docs/decision-brief.md', 'docs/failure-cases.md',
      'docs/reader-owned-static-source-receipt.md', 'docs/reviewer-decision.md', 'docs/rollback-record.md',
    ],
    checkDemo(report) {
      return report?.route === 'EVIDENCE_PACKET_READY'
        && report?.actionBoundary?.externalActionsPerformed === false
        && report?.actionBoundary?.requiresHumanReview === true;
    },
  },
  {
    exampleId: 'workforce-signal-brief',
    directory: 'workforce-signal-brief-starter',
    archive: 'workforce-signal-brief-starter-v1.zip',
    testFile: 'tests/workforce-signal-brief.test.mjs',
    demoFile: 'scripts/demo.mjs',
    commands: ['npm test', 'npm run demo'],
    requiredFiles: [
      'README.md', 'CONTENTS.md', 'package.json', 'expected-output.json', 'workforce-signal-brief-starter.md',
      'data/source-receipt.mjs', 'data/synthetic-series.mjs', 'src/evaluate.mjs', 'src/fixed-cases.mjs',
      'scripts/demo.mjs', 'tests/workforce-signal-brief.test.mjs', 'docs/decision-brief.md',
      'docs/failure-cases.md', 'docs/reviewer-record.md', 'docs/rollback-record.md',
    ],
    checkDemo(report) {
      return report?.fixtureStatus === 'synthetic_source_shaped_not_live_acquired'
        && report?.cases?.length === 7
        && report.cases.filter((entry) => entry.matchesExpectation).length === 7;
    },
  },
];

function fail(message) {
  throw new Error(`[reader starters] ${message}`);
}

function isExcludedArtifactPath(relativePath) {
  const normalizedPath = relativePath.split(path.sep).join('/').replace(/^\.\//, '');
  const segments = normalizedPath.split('/').filter(Boolean);
  const fileName = segments.at(-1)?.toLowerCase();

  return segments.some((segment) => excludedArtifactDirectoryNames.has(segment.toLowerCase()))
    || (fileName === '.env' || (fileName?.startsWith('.env.') && fileName !== '.env.example'));
}

function collectSourceFiles(directory, { excludeGeneratedArtifacts = false } = {}) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`source tree must not contain symlinks: ${entryPath}`);
    if (entry.isDirectory()) {
      if (excludeGeneratedArtifacts && excludedArtifactDirectoryNames.has(entry.name.toLowerCase())) return [];
      return collectSourceFiles(entryPath, { excludeGeneratedArtifacts });
    }
    if (entry.isFile()) return [entryPath];
    fail(`source tree contains an unsupported entry: ${entryPath}`);
  });
}

function collectExecutableJavaScriptFiles(directory) {
  return collectSourceFiles(directory, { excludeGeneratedArtifacts: true })
    .filter((sourcePath) => /\.(?:[cm]?js)$/i.test(sourcePath));
}

function stripJavaScriptStringsAndComments(source) {
  let result = '';
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (lineComment) {
      if (character === '\n') {
        lineComment = false;
        result += '\n';
      } else {
        result += ' ';
      }
      continue;
    }
    if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false;
        result += '  ';
        index += 1;
      } else {
        result += character === '\n' ? '\n' : ' ';
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        result += character === '\n' ? '\n' : ' ';
        continue;
      }
      if (character === '\\') {
        escaped = true;
        result += ' ';
        continue;
      }
      if (character === quote) quote = null;
      result += character === '\n' ? '\n' : ' ';
      continue;
    }
    if (character === '/' && next === '/') {
      lineComment = true;
      result += '  ';
      index += 1;
      continue;
    }
    if (character === '/' && next === '*') {
      blockComment = true;
      result += '  ';
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      result += ' ';
      continue;
    }
    result += character;
  }

  return result;
}

function validateFixedPackageManifest(starter, directory) {
  const manifestPath = path.join(directory, 'package.json');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    fail(`${starter.exampleId}: package.json is invalid: ${error.message}`);
  }

  if (manifest.private !== true || manifest.type !== 'module' || manifest.engines?.node !== '>=20') {
    fail(`${starter.exampleId}: package must remain private, dependency-free Node 20+ ESM`);
  }
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundledDependencies', 'bundleDependencies']) {
    if (manifest[field]) fail(`${starter.exampleId}: starter package must not add ${field}`);
  }

  const actualScripts = manifest.scripts ?? {};
  const expectedScriptNames = Object.keys(starter.fixedScripts).sort();
  const expectedReaderCommands = Object.keys(starter.fixedScripts)
    .map((scriptName) => scriptName === 'test' ? 'npm test' : `npm run ${scriptName}`);
  if (starter.commands.join('\u0000') !== expectedReaderCommands.join('\u0000')) {
    fail(`${starter.exampleId}: the reader command list must be derived from the reviewed fixed scripts`);
  }
  const actualScriptNames = Object.keys(actualScripts).sort();
  if (actualScriptNames.join('\u0000') !== expectedScriptNames.join('\u0000')) {
    fail(`${starter.exampleId}: package scripts must be the reviewed fixed commands only; lifecycle pre/post and arbitrary scripts are not allowed`);
  }
  for (const [scriptName, expectedCommand] of Object.entries(starter.fixedScripts)) {
    if (actualScripts[scriptName] !== expectedCommand) {
      fail(`${starter.exampleId}: package script ${scriptName} must be exactly ${expectedCommand}`);
    }
  }

  return manifest;
}

function validateExecutableSourceBeforeRun(starter, directory) {
  const dangerousImportPatterns = [
    ['network module import', /\b(?:import\s+(?:[^;]*?\s+from\s+)?|import\s*\(|require\s*\()\s*["'](?:node:)?(?:http|https|net|tls|dgram|dns|child_process|cluster)["']/i],
  ];
  const dangerousExecutablePatterns = [
    ['network client call', /\b(?:fetch|WebSocket|XMLHttpRequest)\s*\(/],
    ['browser beacon call', /\bnavigator\s*\.\s*sendBeacon\s*\(/],
    ['process launch call', /\b(?:exec|execFile|execSync|execFileSync|spawn|spawnSync|fork)\s*\(/],
    ['runtime process launch', /\b(?:Bun\s*\.\s*(?:spawn|spawnSync)|Deno\s*\.\s*Command)\b/],
    ['environment access', /\b(?:process\s*\.\s*env|Deno\s*\.\s*env|Bun\s*\.\s*env|process\s*\.\s*loadEnvFile)\b/],
    ['low-level process access', /\bprocess\s*\.\s*(?:binding|dlopen)\s*\(/],
    ['dynamic code evaluation', /\b(?:eval|Function)\s*\(/],
  ];

  for (const sourcePath of collectExecutableJavaScriptFiles(directory)) {
    const source = fs.readFileSync(sourcePath, 'utf8');
    for (const [label, pattern] of dangerousImportPatterns) {
      if (pattern.test(source)) {
        fail(`${starter.exampleId}: ${path.relative(directory, sourcePath)} contains prohibited ${label}`);
      }
    }
    const executableSource = stripJavaScriptStringsAndComments(source);
    for (const [label, pattern] of dangerousExecutablePatterns) {
      if (pattern.test(executableSource)) {
        fail(`${starter.exampleId}: ${path.relative(directory, sourcePath)} contains prohibited ${label}`);
      }
    }
  }
}

function validateStarterBeforeRun(starter, directory) {
  validateFixedPackageManifest(starter, directory);
  validateExecutableSourceBeforeRun(starter, directory);
}

function readZipEntries(archivePath) {
  const archive = fs.readFileSync(archivePath);
  const endOfCentralDirectory = 0x06054b50;
  const centralDirectoryHeader = 0x02014b50;
  const localFileHeader = 0x04034b50;
  const searchStart = Math.max(0, archive.length - 65_557);
  let endOffset = -1;

  for (let offset = archive.length - 22; offset >= searchStart; offset -= 1) {
    if (archive.readUInt32LE(offset) === endOfCentralDirectory) {
      endOffset = offset;
      break;
    }
  }

  if (endOffset === -1) fail(`archive ${path.basename(archivePath)} has no end-of-central-directory record`);
  const entryCount = archive.readUInt16LE(endOffset + 10);
  let offset = archive.readUInt32LE(endOffset + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(offset) !== centralDirectoryHeader) {
      fail(`archive ${path.basename(archivePath)} central-directory entry ${index + 1} is invalid`);
    }
    const flags = archive.readUInt16LE(offset + 8);
    const compressionMethod = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const uncompressedSize = archive.readUInt32LE(offset + 24);
    const fileNameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localHeaderOffset = archive.readUInt32LE(offset + 42);
    const entryName = archive.subarray(offset + 46, offset + 46 + fileNameLength).toString('utf8');
    const normalizedEntryName = entryName.endsWith('/') ? entryName.slice(0, -1) : entryName;
    const pathSegments = normalizedEntryName.split('/');

    if (!normalizedEntryName || entryName.startsWith('/') || entryName.includes('\\') || entryName.includes(':')
      || pathSegments.some((segment) => !segment || segment === '.' || segment === '..')) {
      fail(`archive ${path.basename(archivePath)} has an unsafe entry path: ${entryName}`);
    }
    if (entries.has(entryName)) fail(`archive ${path.basename(archivePath)} has duplicate entry ${entryName}`);
    if ((flags & 0x1) !== 0) fail(`archive ${path.basename(archivePath)} entry ${entryName} is encrypted`);
    if (localHeaderOffset + 30 > archive.length || archive.readUInt32LE(localHeaderOffset) !== localFileHeader) {
      fail(`archive ${path.basename(archivePath)} local header for ${entryName} is invalid`);
    }

    const localNameLength = archive.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = archive.readUInt16LE(localHeaderOffset + 28);
    const compressedStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressedEnd = compressedStart + compressedSize;
    if (compressedEnd > archive.length) fail(`archive ${path.basename(archivePath)} entry ${entryName} is truncated`);

    const compressed = archive.subarray(compressedStart, compressedEnd);
    let contents;
    try {
      if (compressionMethod === 0) {
        contents = Buffer.from(compressed);
      } else if (compressionMethod === 8) {
        contents = inflateRawSync(compressed);
      } else {
        fail(`archive ${path.basename(archivePath)} entry ${entryName} uses unsupported compression method ${compressionMethod}`);
      }
    } catch (error) {
      fail(`archive ${path.basename(archivePath)} entry ${entryName} cannot be extracted: ${error.message}`);
    }
    if (contents.length !== uncompressedSize) {
      fail(`archive ${path.basename(archivePath)} entry ${entryName} has an unexpected extracted size`);
    }

    entries.set(entryName, contents);
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function sourceFilesByArchivePath(directory, archivePath) {
  return new Map(
    collectSourceFiles(directory, { excludeGeneratedArtifacts: true })
      .filter((sourcePath) => path.resolve(sourcePath) !== path.resolve(archivePath))
      .filter((sourcePath) => !isExcludedArtifactPath(path.relative(directory, sourcePath)))
      .map((sourcePath) => [path.relative(directory, sourcePath).split(path.sep).join('/'), fs.readFileSync(sourcePath)]),
  );
}

function validateNoIgnoredArchiveEntries(starter, archiveEntries) {
  for (const entryName of archiveEntries.keys()) {
    if (isExcludedArtifactPath(entryName)) {
      fail(`${starter.exampleId}: archive must not contain generated or ignored path ${entryName}`);
    }
  }
}

function validateArchiveSourceParity(starter, directory, archivePath, archiveEntries) {
  const sourceEntries = sourceFilesByArchivePath(directory, archivePath);
  validateNoIgnoredArchiveEntries(starter, archiveEntries);
  const archiveFiles = new Map([...archiveEntries].filter(([entryName]) => !entryName.endsWith('/')));

  for (const entryName of sourceEntries.keys()) {
    if (!archiveFiles.has(entryName)) fail(`${starter.exampleId}: archive is missing source file ${entryName}`);
  }
  for (const entryName of archiveFiles.keys()) {
    if (!sourceEntries.has(entryName)) fail(`${starter.exampleId}: archive contains an unexpected file ${entryName}`);
  }
  for (const [entryName, sourceContents] of sourceEntries) {
    if (!sourceContents.equals(archiveFiles.get(entryName))) {
      fail(`${starter.exampleId}: archive content differs from source for ${entryName}`);
    }
  }
}

function extractZipEntries(starter, archiveEntries) {
  const extractionDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `ai-dog-${starter.exampleId}-`));

  for (const [entryName, contents] of archiveEntries) {
    const targetPath = path.resolve(extractionDirectory, ...entryName.split('/'));
    if (targetPath !== extractionDirectory && !targetPath.startsWith(`${extractionDirectory}${path.sep}`)) {
      fail(`${starter.exampleId}: archive extraction escaped the temporary directory`);
    }
    if (entryName.endsWith('/')) {
      fs.mkdirSync(targetPath, { recursive: true });
      continue;
    }
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, contents);
  }

  return extractionDirectory;
}

function validateGitignore(starter, directory) {
  const gitignorePath = path.join(directory, '.gitignore');
  if (!fs.existsSync(gitignorePath)) fail(`${starter.exampleId}: missing GitHub-safe .gitignore`);
  const entries = new Set(fs.readFileSync(gitignorePath, 'utf8').split(/\r?\n/).map((entry) => entry.trim()));
  for (const requiredEntry of requiredGitignoreEntries) {
    if (!entries.has(requiredEntry)) fail(`${starter.exampleId}: .gitignore is missing ${requiredEntry}`);
  }
  if (starter.optionalPromptfooFixture && !entries.has(starter.optionalPromptfooFixture.ignoredOutputDirectory)) {
    fail(`${starter.exampleId}: .gitignore is missing ${starter.optionalPromptfooFixture.ignoredOutputDirectory} for optional Promptfoo output`);
  }
}

function validateOptionalPromptfooFixture(starter, directory) {
  const contract = starter.optionalPromptfooFixture;
  if (!contract) return;

  const configPath = path.join(directory, contract.configPath);
  if (!fs.existsSync(configPath)) fail(`${starter.exampleId}: missing optional Promptfoo fixture config`);
  const config = fs.readFileSync(configPath, 'utf8');
  for (const token of ['file://../src/promptfoo-fixture-provider.mjs', 'fixture-only-local-provider']) {
    if (!config.includes(token)) fail(`${starter.exampleId}: optional Promptfoo config lost local provider token ${token}`);
  }
  if (/(?:openai:|OPENAI_API_KEY|apiKey\s*:|authorization\s*:)/i.test(config)) {
    fail(`${starter.exampleId}: optional Promptfoo config must remain local and credential-free`);
  }
}

function validateOptionalPromptfooReadme(starter, locale, readme) {
  const contract = starter.optionalPromptfooFixture;
  if (!contract) return;

  for (const token of [
    contract.commandPrefix,
    contract.configPath,
    contract.outputPath,
    contract.minimumNodeVersion,
    'Promptfoo pass',
    'Promptfoo result',
  ]) {
    if (!readme.includes(token)) fail(`${starter.exampleId}: ${locale} README is missing optional Promptfoo token ${token}`);
  }
  if (!readme.includes(promptfooStaticCheckBoundaryByLocale[locale])) {
    fail(`${starter.exampleId}: ${locale} README must say that static checks are not a recorded Promptfoo pass`);
  }
}

function validateReaderOwnedStaticSourceReceipt(starter, directory) {
  if (starter.exampleId !== 'kev-review-packet') return;

  const receiptTemplatePath = path.join(directory, 'docs', 'reader-owned-static-source-receipt.md');
  const template = fs.readFileSync(receiptTemplatePath, 'utf8');
  const requiredPhrases = [
    'Status: `TEMPLATE_ONLY` · `NOT_ACQUIRED` · `NOT AN INPUT TO THIS STARTER`',
    'A source URL is a route, not proof that you retrieved a copy.',
    'Raw-byte SHA-256',
    'not a moving branch name.',
    'Free-text field policy',
    '`EXCLUDE_BY_DEFAULT`',
    'External actions allowed by this receipt',
    '`NONE`',
    'That any organisation, asset, account, network, or person is affected.',
    'That this starter has acquired, validated, or processed real source data.',
  ];

  for (const phrase of requiredPhrases) {
    if (!template.includes(phrase)) {
      fail(`${starter.exampleId}: static-source receipt template is missing its boundary: ${phrase}`);
    }
  }
  if (!/It does not change this starter's\s+synthetic-only contract/.test(template)) {
    fail(`${starter.exampleId}: static-source receipt template must keep its synthetic-only boundary`);
  }
}

function validateRelativeMarkdownLinks(starter, locale, readmePath) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const links = readme.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^)]*)?\)/g);

  for (const match of links) {
    const target = match[1].replace(/^<|>$/g, '');
    const targetPath = target.split('#', 1)[0];
    if (!targetPath || /^[a-z][a-z0-9+.-]*:/i.test(targetPath)) continue;
    const resolved = path.resolve(path.dirname(readmePath), targetPath);
    if (!fs.existsSync(resolved)) fail(`${starter.exampleId}: ${locale} README link target is missing: ${target}`);
  }
}

function runNode(directory, args, label) {
  try {
    return execFileSync(process.execPath, args, {
      cwd: directory,
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: childProcessTimeoutMs,
      maxBuffer: childProcessMaxBuffer,
      killSignal: 'SIGTERM',
    });
  } catch (error) {
    const output = [error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim();
    fail(`${label} failed\n${output}`);
  }
}

function fixedNpmArguments(starter, command) {
  const args = command === 'npm test'
    ? ['test']
    : command.startsWith('npm run ')
      ? ['run', command.slice('npm run '.length)]
      : null;
  const scriptName = args?.[args.length - 1];
  if (!args || !scriptName || !Object.hasOwn(starter.fixedScripts, scriptName)) {
    fail(`${starter.exampleId}: unsupported fixed archive command ${command}`);
  }
  return args;
}

function runReaderCommand(starter, directory, command, label) {
  const args = fixedNpmArguments(starter, command);

  const npmExecutable = process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const npmArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'npm', ...args] : args;

  try {
    return execFileSync(npmExecutable, npmArgs, {
      cwd: directory,
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: childProcessTimeoutMs,
      maxBuffer: childProcessMaxBuffer,
      killSignal: 'SIGTERM',
    });
  } catch (error) {
    const output = [error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim();
    fail(`${label} failed\n${output}`);
  }
}

if (!fs.existsSync(receiptPath)) fail('missing portfolio-example-receipts.json');
const receiptRecords = JSON.parse(fs.readFileSync(receiptPath, 'utf8')).receipts;
const receiptsByExample = new Map(receiptRecords.map((receipt) => [receipt.exampleId, receipt]));
const receiptComponentSource = fs.readFileSync(path.join(root, 'components', 'portfolio-verification-receipt.tsx'), 'utf8');
if (!receiptComponentSource.includes("import { canonicalLocaleRecord, staticAssetHref, type Locale } from '@/lib/types';")
  || !receiptComponentSource.includes('href={staticAssetHref(receipt.readerStarter.readmeHref[locale])}')) {
  fail('the rendered Traditional Chinese starter README must use the canonical static-asset locale mapping');
}

// Validate all package entry points before executing a single checked-in test
// or demo. Archive parity is checked again before extracted commands run.
for (const starter of localizedStarterArtifacts) {
  const directory = path.join(root, 'public', 'templates', starter.directory, 'v1');
  if (!fs.existsSync(directory)) fail(`${starter.exampleId}: missing starter directory`);
  validateStarterBeforeRun(starter, directory);
}

for (const starter of starters) {
  const directory = path.join(root, 'public', 'templates', starter.directory, 'v1');
  if (!fs.existsSync(directory)) fail(`${starter.exampleId}: missing starter directory`);
  const archiveContract = localizedStarterByExampleId.get(starter.exampleId);
  if (!archiveContract) fail(`${starter.exampleId}: missing fixed archive command contract`);
  if (starter.commands.join('\u0000') !== archiveContract.commands.join('\u0000')
    || archiveContract.fixedScripts.test !== `node --test ${starter.testFile}`
    || archiveContract.fixedScripts.demo !== `node ${starter.demoFile}`
    || (starter.fixtureFile && archiveContract.fixedScripts['fixture:validate'] !== `node ${starter.fixtureFile}`)) {
    fail(`${starter.exampleId}: fixed source checks must use the reviewed archive command contract`);
  }

  for (const relativePath of starter.requiredFiles) {
    if (!fs.existsSync(path.join(directory, relativePath))) fail(`${starter.exampleId}: missing ${relativePath}`);
  }
  validateReaderOwnedStaticSourceReceipt(starter, directory);

  const archivePath = path.join(directory, starter.archive);
  if (!fs.existsSync(archivePath) || fs.statSync(archivePath).size < 1024) {
    fail(`${starter.exampleId}: missing or unexpectedly small downloadable archive`);
  }

  const readme = fs.readFileSync(path.join(directory, 'README.md'), 'utf8').toLowerCase();
  for (const phrase of ['reader-owned local exercise', 'invented', 'api key', 'network', 'model']) {
    if (!readme.includes(phrase)) fail(`${starter.exampleId}: README is missing its local-only boundary (${phrase})`);
  }

  runNode(directory, ['--test', starter.testFile], `${starter.exampleId}: fixed tests`);
  if (starter.fixtureFile) runNode(directory, [starter.fixtureFile], `${starter.exampleId}: fixture validation`);
  const demoOutput = runNode(directory, [starter.demoFile], `${starter.exampleId}: demo`);
  let report;
  try {
    report = JSON.parse(demoOutput);
  } catch {
    fail(`${starter.exampleId}: demo must emit one JSON report`);
  }
  if (!starter.checkDemo(report)) fail(`${starter.exampleId}: demo report lost its documented local-only route`);

  const receipt = receiptsByExample.get(starter.exampleId);
  const expectedBase = `/templates/${starter.directory}/v1`;
  if (!receipt?.readerStarter) fail(`${starter.exampleId}: missing reader starter receipt`);
  if (receipt.readerStarter.downloadHref !== `${expectedBase}/${starter.archive}`) {
    fail(`${starter.exampleId}: reader download link is incorrect`);
  }
  if (receipt.readerStarter.commands.join('\u0000') !== starter.commands.join('\u0000')) {
    fail(`${starter.exampleId}: reader commands do not match the fixed starter commands`);
  }
  for (const locale of locales) {
    const copy = receipt.readerStarter.copy?.[locale];
    for (const field of ['title', 'text', 'download', 'readme', 'boundary']) {
      if (typeof copy?.[field] !== 'string' || !copy[field].trim()) {
        fail(`${starter.exampleId}: missing ${locale} reader starter ${field}`);
      }
    }
  }
}

for (const starter of localizedStarterArtifacts) {
  const directory = path.join(root, 'public', 'templates', starter.directory, 'v1');
  const expectedBase = `/templates/${starter.directory}/v1`;
  const archivePath = path.join(directory, starter.archive);
  const archiveEntries = readZipEntries(archivePath);
  const receipt = receiptsByExample.get(starter.exampleId);

  if (!receipt?.readerStarter) fail(`${starter.exampleId}: missing reader starter receipt`);
  if (receipt.readerStarter.commands.join('\u0000') !== starter.commands.join('\u0000')) {
    fail(`${starter.exampleId}: reader commands do not match the fixed archive commands`);
  }
  validateGitignore(starter, directory);
  validateOptionalPromptfooFixture(starter, directory);
  validateArchiveSourceParity(starter, directory, archivePath, archiveEntries);

  const extractionDirectory = extractZipEntries(starter, archiveEntries);
  try {
    validateStarterBeforeRun(starter, extractionDirectory);
    const extractedReadme = path.join(extractionDirectory, 'README.md');
    const extractedManifest = path.join(extractionDirectory, 'package.json');
    if (!fs.existsSync(extractedReadme) || !fs.existsSync(extractedManifest)) {
      fail(`${starter.exampleId}: archive root must contain README.md and package.json`);
    }

    for (const locale of locales) {
      const fileName = readmeFileByLocale[locale];
      const readmePath = path.join(directory, fileName);
      const extractedReadmePath = path.join(extractionDirectory, fileName);
      if (!fs.existsSync(readmePath)) fail(`${starter.exampleId}: missing ${fileName}`);
      if (!archiveEntries.has(fileName)) fail(`${starter.exampleId}: archive is missing ${fileName}`);
      if (!fs.existsSync(extractedReadmePath)) fail(`${starter.exampleId}: extracted archive is missing ${fileName}`);
      if (!fs.readFileSync(readmePath).equals(fs.readFileSync(extractedReadmePath))) {
        fail(`${starter.exampleId}: extracted ${fileName} differs from its source README`);
      }
      if (receipt.readerStarter.readmeHref?.[locale] !== `${expectedBase}/${fileName}`) {
        fail(`${starter.exampleId}: ${locale} reader README link is incorrect`);
      }

      const readme = fs.readFileSync(extractedReadmePath, 'utf8');
      if (readme.includes(`cd ${starter.directory}/v1`)) {
        fail(`${starter.exampleId}: ${locale} README still points readers to a non-existent post-extraction path`);
      }
      if (!readme.includes(starter.readmeRouteMarker)) {
        fail(`${starter.exampleId}: ${locale} README is missing its extracted-folder route instruction`);
      }
      for (const command of starter.commands) {
        if (!readme.includes(command)) fail(`${starter.exampleId}: ${locale} README is missing reader command ${command}`);
      }
      validateOptionalPromptfooReadme(starter, locale, readme);
      if (locale !== 'en') {
        const localBoundaryToken = locale === 'zh-Hans' ? '本地' : '本機';
        for (const token of ['README.md', 'Node.js 20', 'npm test', 'npm run demo', localBoundaryToken]) {
          if (!readme.includes(token)) fail(`${starter.exampleId}: ${locale} README lost required reader or local-only boundary token ${token}`);
        }
      }
      validateRelativeMarkdownLinks(starter, locale, extractedReadmePath);
    }

    for (const command of starter.commands) {
      runReaderCommand(starter, extractionDirectory, command, `${starter.exampleId}: ${command} from extracted archive`);
    }
  } finally {
    fs.rmSync(extractionDirectory, { recursive: true, force: true });
  }
}

console.log(`Validated ${localizedStarterArtifacts.length} downloadable, reader-owned starter packs: fixed-script command allowlists, pre-run local-only scans, generated-output exclusions, extracted-file parity, runnable archive-root routes, GitHub-safe ignores, and localized README artifacts.`);
