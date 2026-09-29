import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const clientDirectory = path.join(root, 'dist', 'client');
const staticDirectory = path.join(clientDirectory, '_next', 'static');
const viteManifestPath = path.join(clientDirectory, '.vite', 'manifest.json');
const cssDirectory = path.join(staticDirectory, 'css');

/*
 * Vinext exposes client islands as Vite dynamic entries. The application browser
 * entry therefore lists every island in `dynamicImports`, even though a reader
 * only downloads an island when the server-rendered route includes it. Do not
 * walk every dynamic import from the application entry into the shared budget:
 * that would make a route-local planner look like normal-site JavaScript.
 *
 * Instead, declare the shell and each client island here, then follow each
 * declaration's own import graph. An ordinary island budget includes static and
 * lazy dependencies, but a deliberately named on-demand feature can keep its
 * lazy import out of the initial-route measurement and give that import its own
 * budget. Every emitted entry must still be classified. A newly added client
 * component therefore cannot quietly avoid the gate.
 */
const sharedShellBudget = {
  label: 'shared application shell',
  maxGzipBytes: 165_000,
  entries: [
    'virtual:vinext-app-browser-entry',
    'components/locale-switch.tsx',
    'node_modules/vinext/dist/shims/layout-segment-context.js',
    'node_modules/vinext/dist/shims/internal/hybrid-client-route-owner.js',
    'node_modules/vinext/dist/shims/link.js'
  ]
};

const routeChunkBudgets = [
  {
    label: 'portfolio planner',
    maxGzipBytes: 60_000,
    entries: ['components/portfolio-evidence-planner.tsx']
  },
  {
    label: 'no-code starter lab',
    maxGzipBytes: 28_000,
    entries: ['components/no-code-starter-lab.tsx'],
    includeDynamicImports: false
  },
  {
    label: 'no-code personal-case builder (on demand)',
    maxGzipBytes: 25_000,
    entries: ['components/no-code-personal-case-builder.tsx']
  },
  {
    // The seven-lesson Grok Bot / Codex course stays behind an explicit
    // learner activation point so the account-free starter lab remains light.
    label: 'AI app course (on demand)',
    maxGzipBytes: 45_000,
    entries: ['components/ai-app-course.tsx']
  },
  {
    label: 'learning evidence planner',
    maxGzipBytes: 35_000,
    entries: ['components/learning-evidence-planner.tsx']
  },
  {
    label: 'build lab selector',
    maxGzipBytes: 16_000,
    entries: ['components/build-lab-case-selector.tsx']
  },
  {
    label: 'live interview practice gate',
    maxGzipBytes: 4_000,
    entries: ['components/interview-live-practice-gate.tsx'],
    includeDynamicImports: false
  },
  {
    label: 'live interview practice (on demand)',
    // This interaction is behind an explicit button or fragment link. Its
    // locale-specific topic projection arrives from the scoped server route
    // only after activation, never as a bundled question catalogue.
    maxGzipBytes: 50_000,
    entries: ['components/interview-live-practice-loader.tsx']
  },
  {
    label: 'coding starter lab',
    maxGzipBytes: 15_000,
    entries: ['components/coding-starter-lab.tsx']
  },
  {
    label: 'learner start diagnostic',
    maxGzipBytes: 6_000,
    entries: ['components/learner-start-diagnostic.tsx']
  },
  {
    label: 'roadmap progress',
    maxGzipBytes: 5_000,
    entries: ['components/roadmap-progress.tsx']
  },
  {
    label: 'portfolio capstone path',
    maxGzipBytes: 10_000,
    entries: ['components/portfolio-capstone-path.tsx']
  },
  {
    label: 'legacy interview fragment redirect',
    maxGzipBytes: 3_000,
    entries: ['components/clear-legacy-interview-fragment.tsx']
  },
  {
    label: 'fragment anchor navigation',
    maxGzipBytes: 1_500,
    entries: ['components/fragment-anchor-scroll.tsx']
  },
  {
    label: 'inference request-path lab',
    maxGzipBytes: 8_000,
    entries: ['components/inference-request-path-lab.tsx']
  },
  {
    label: 'locale not-found page',
    maxGzipBytes: 3_000,
    entries: ['app/[lang]/not-found.tsx']
  }
];

// The learner diagnostic, progress controls, lesson contracts, and portfolio
// capstone add responsive UI states. Keep a small measured buffer without
// allowing those route-local improvements to grow the stylesheet unchecked.
const cssMaxGzipBytes = 22_600;

function fail(message) {
  throw new Error(`[client weight] ${message}`);
}

function gzipBytes(filePath) {
  return gzipSync(fs.readFileSync(filePath), { level: 9 }).length;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function collectFiles(directory, relativeDirectory = '') {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push(toPosix(relativePath));
    }
  }
  return files;
}

function formatKiB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function asStringArray(value, description) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    fail(`${description} must be an array of manifest entry ids.`);
  }
  return value;
}

function isWithin(directory, candidate) {
  const relative = path.relative(directory, candidate);
  return relative && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function isNextBootMetadata(relativePath) {
  return /^[^/]+\/_+(?:build|ssg)Manifest\.js$/.test(relativePath);
}

if (!fs.existsSync(staticDirectory) || !fs.existsSync(viteManifestPath)) {
  fail('missing built client assets or Vite manifest. Run the production build before this validation.');
}

const rawManifest = JSON.parse(fs.readFileSync(viteManifestPath, 'utf8'));
if (!rawManifest || typeof rawManifest !== 'object' || Array.isArray(rawManifest)) {
  fail('the Vite client manifest is not an object. Update this validator deliberately for the new build format.');
}

const entries = new Map();
const fileToEntryIds = new Map();
for (const [id, manifestEntry] of Object.entries(rawManifest)) {
  if (!manifestEntry || typeof manifestEntry !== 'object' || Array.isArray(manifestEntry)) {
    fail(`Vite manifest entry ${id} is not an object.`);
  }
  if (typeof manifestEntry.file !== 'string' || !manifestEntry.file.endsWith('.js')) continue;

  const absoluteFile = path.resolve(clientDirectory, manifestEntry.file);
  if (!isWithin(staticDirectory, absoluteFile)) {
    fail(`Vite manifest entry ${id} points outside _next/static (${manifestEntry.file}). Add an explicit budget model before accepting this build layout.`);
  }
  if (!fs.existsSync(absoluteFile)) {
    fail(`Vite manifest entry ${id} references a missing file (${manifestEntry.file}).`);
  }

  const file = toPosix(path.relative(staticDirectory, absoluteFile));
  const entry = {
    id,
    src: typeof manifestEntry.src === 'string' ? manifestEntry.src : undefined,
    file,
    imports: asStringArray(manifestEntry.imports, `Vite manifest entry ${id}.imports`),
    dynamicImports: asStringArray(manifestEntry.dynamicImports, `Vite manifest entry ${id}.dynamicImports`)
  };
  entries.set(id, entry);
  const ids = fileToEntryIds.get(file) ?? [];
  ids.push(id);
  fileToEntryIds.set(file, ids);
}

if (entries.size === 0) {
  fail('the Vite client manifest contains no JavaScript entries. Update this validator deliberately for the new build format.');
}

for (const entry of entries.values()) {
  for (const dependencyId of [...entry.imports, ...entry.dynamicImports]) {
    if (!entries.has(dependencyId)) {
      fail(`Vite entry ${entry.id} references ${dependencyId}, which has no JavaScript manifest entry. Classify the new asset type before it can bypass the client-weight gate.`);
    }
  }
}

const staticJavaScriptFiles = new Set(collectFiles(staticDirectory).filter(file => file.endsWith('.js')));
const manifestJavaScriptFiles = new Set(fileToEntryIds.keys());
const bootMetadataFiles = new Set();
for (const file of staticJavaScriptFiles) {
  if (manifestJavaScriptFiles.has(file)) continue;
  if (isNextBootMetadata(file)) {
    bootMetadataFiles.add(file);
    continue;
  }
  fail(`unclassified executable client asset ${file}. It is not in the Vite manifest or the explicitly counted Next boot metadata. Add it to a shared or route-local budget before merging.`);
}

for (const file of manifestJavaScriptFiles) {
  if (!staticJavaScriptFiles.has(file)) {
    fail(`Vite manifest references ${file}, but it was not found in built client assets.`);
  }
}

function resolveConfiguredEntry(source, label) {
  const matches = [...entries.values()].filter(entry => entry.id === source || entry.src === source);
  if (matches.length !== 1) {
    fail(`${label} must resolve exactly one Vite entry for ${source}; found ${matches.length}. Update the budget deliberately if the build layout changed.`);
  }
  return matches[0].id;
}

const allBudgets = [sharedShellBudget, ...routeChunkBudgets];
const configuredEntryIds = new Set();
for (const budget of allBudgets) {
  budget.entryIds = budget.entries.map(source => resolveConfiguredEntry(source, budget.label));
  for (const entryId of budget.entryIds) configuredEntryIds.add(entryId);
}

function collectDependencyClosure(entryIds, { includeDynamicImports = true, skipAppEntryDynamicImports = false } = {}) {
  const visited = new Set();
  const pending = [...entryIds];
  while (pending.length) {
    const entryId = pending.pop();
    if (visited.has(entryId)) continue;
    const entry = entries.get(entryId);
    if (!entry) fail(`configured entry ${entryId} disappeared from the Vite manifest.`);
    visited.add(entryId);
    pending.push(...entry.imports);

    const dynamicImports = !includeDynamicImports || (skipAppEntryDynamicImports && entry.id === 'virtual:vinext-app-browser-entry')
      ? []
      : entry.dynamicImports;
    pending.push(...dynamicImports);
  }
  return visited;
}

const appEntryId = resolveConfiguredEntry('virtual:vinext-app-browser-entry', sharedShellBudget.label);
const appEntry = entries.get(appEntryId);
const appEntryStaticClosure = collectDependencyClosure([appEntryId], { skipAppEntryDynamicImports: true });
for (const dependencyId of appEntry.dynamicImports) {
  if (!configuredEntryIds.has(dependencyId) && !appEntryStaticClosure.has(dependencyId)) {
    const dependency = entries.get(dependencyId);
    fail(`the application browser entry dynamically imports ${dependency?.src ?? dependencyId}, but no shared or route-local budget declares it. Add a named budget instead of letting a new island hide in the shell.`);
  }
}

sharedShellBudget.entryClosure = collectDependencyClosure(sharedShellBudget.entryIds, { skipAppEntryDynamicImports: true });
sharedShellBudget.files = new Set([...sharedShellBudget.entryClosure].map(entryId => entries.get(entryId).file));
for (const file of bootMetadataFiles) sharedShellBudget.files.add(file);

const sharedGzipBytes = [...sharedShellBudget.files]
  .reduce((total, file) => total + gzipBytes(path.join(staticDirectory, file)), 0);
if (sharedGzipBytes > sharedShellBudget.maxGzipBytes) {
  fail(`ordinary server-rendered routes exceed the ${sharedShellBudget.maxGzipBytes}-byte shared gzip budget (${sharedGzipBytes} bytes). Keep optional labs route-local or reduce shared client code.`);
}

const classifiedEntryIds = new Set(sharedShellBudget.entryClosure);
const classifiedFiles = new Set(sharedShellBudget.files);
for (const budget of routeChunkBudgets) {
  budget.entryClosure = collectDependencyClosure(budget.entryIds, { includeDynamicImports: budget.includeDynamicImports !== false });
  budget.files = new Set([...budget.entryClosure].map(entryId => entries.get(entryId).file));
  budget.addedFiles = new Set([...budget.files].filter(file => !sharedShellBudget.files.has(file)));
  budget.gzipBytes = [...budget.addedFiles]
    .reduce((total, file) => total + gzipBytes(path.join(staticDirectory, file)), 0);

  if (budget.gzipBytes > budget.maxGzipBytes) {
    fail(`${budget.label} exceeds its ${budget.maxGzipBytes}-byte route-local gzip budget (${budget.gzipBytes} bytes). Keep its state and data local to that route.`);
  }

  for (const entryId of budget.entryClosure) classifiedEntryIds.add(entryId);
  for (const file of budget.files) classifiedFiles.add(file);
}

const unclassifiedEntries = [...entries.values()].filter(entry => !classifiedEntryIds.has(entry.id));
if (unclassifiedEntries.length) {
  const details = unclassifiedEntries.map(entry => `${entry.src ?? entry.id} (${entry.file})`).join(', ');
  fail(`unclassified Vite client entries: ${details}. Add each entry to the shared shell or a named route-local budget before merging.`);
}

for (const file of staticJavaScriptFiles) {
  if (!classifiedFiles.has(file) && !bootMetadataFiles.has(file)) {
    fail(`unclassified executable client asset ${file}. It was not reached by a shared or route-local budget.`);
  }
}

if (!fs.existsSync(cssDirectory)) fail('missing built client CSS.');
const cssGzipBytes = collectFiles(cssDirectory)
  .filter(file => file.endsWith('.css'))
  .reduce((total, file) => total + gzipBytes(path.join(cssDirectory, file)), 0);
if (cssGzipBytes > cssMaxGzipBytes) {
  fail(`client CSS exceeds the ${cssMaxGzipBytes}-byte gzip budget (${cssGzipBytes} bytes).`);
}

console.log(`Client weight validated: ${formatKiB(sharedGzipBytes)} shared gzip (${sharedShellBudget.files.size} files, including ${bootMetadataFiles.size} boot metadata files), ${formatKiB(cssGzipBytes)} CSS gzip.`);
for (const budget of routeChunkBudgets) {
  console.log(`  ${budget.label}: ${formatKiB(budget.gzipBytes)} route-local gzip (${budget.addedFiles.size} files; budget ${formatKiB(budget.maxGzipBytes)}).`);
}
console.log(`  Classified ${entries.size} Vite JavaScript entries and ${bootMetadataFiles.size} boot metadata files; no executable client chunk is unbudgeted.`);
