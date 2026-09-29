import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getReleaseScopeActivationError,
  parseReleaseScopeManifest,
} from '../lib/release-scope.ts';

/**
 * These are the only static assets which every explicitly approved release
 * receives without listing them in content/release-manifest.json. Keep this
 * list small and literal: it is not a public-directory allowlist.
 */
export const FIXED_BRAND_ASSET_PATHS = Object.freeze([
  'ai-dog-mark.webp',
  'ai-dog.png',
]);

const STAGING_DIRECTORY_NAME = '.release-static-assets';
const STAGED_ASSET_PREFIXES = Object.freeze(['downloads/', 'templates/']);

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function assertDirectory(pathname, label) {
  let stat;
  try {
    stat = fs.lstatSync(pathname);
  } catch {
    throw new Error(`${label} does not exist: ${pathname}`);
  }

  if (stat.isSymbolicLink()) throw new Error(`${label} must not be a symbolic link: ${pathname}`);
  if (!stat.isDirectory()) throw new Error(`${label} must be a directory: ${pathname}`);
}

function assertPathIsInside(root, candidate, label) {
  const relative = path.relative(root, candidate);
  if (!relative || path.isAbsolute(relative) || relative.split(path.sep).includes('..')) {
    throw new Error(`${label} must resolve inside the project root.`);
  }
}

function assertExistingPathHasNoSymbolicLinks(root, candidate, label) {
  const relative = path.relative(root, candidate);
  assertPathIsInside(root, candidate, label);

  let current = root;
  assertDirectory(current, 'project root');

  for (const segment of relative.split(path.sep)) {
    current = path.join(current, segment);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch {
      throw new Error(`${label} does not exist: ${candidate}`);
    }

    if (stat.isSymbolicLink()) throw new Error(`${label} must not use symbolic links: ${candidate}`);
  }
}

function getSafeRelativeAssetPath(assetPath) {
  if (typeof assetPath !== 'string' || assetPath !== assetPath.trim() || !assetPath) {
    throw new Error('release static asset path must be a non-empty relative path.');
  }
  if (path.isAbsolute(assetPath) || /[\\?#:]/.test(assetPath)) {
    throw new Error(`release static asset path is unsafe: ${assetPath}`);
  }

  const segments = assetPath.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
    throw new Error(`release static asset path is unsafe: ${assetPath}`);
  }
  return segments;
}

function getSourceAssetPath(root, assetPath) {
  const publicRoot = path.join(root, 'public');
  assertDirectory(publicRoot, 'public asset root');

  const segments = getSafeRelativeAssetPath(assetPath);
  const sourcePath = path.resolve(publicRoot, ...segments);
  assertExistingPathHasNoSymbolicLinks(publicRoot, sourcePath, `selected static asset (${assetPath})`);

  const stat = fs.lstatSync(sourcePath);
  if (!stat.isFile()) throw new Error(`selected static asset must be a regular file: ${assetPath}`);
  return sourcePath;
}

function getStagedAssetPaths(manifest) {
  const selectedAssetPaths = [
    ...FIXED_BRAND_ASSET_PATHS,
    ...manifest.selection.downloads,
    ...manifest.selection.templates,
  ];

  const seen = new Set();
  for (const assetPath of selectedAssetPaths) {
    if (seen.has(assetPath)) throw new Error(`release static assets must not select the same path twice: ${assetPath}`);
    seen.add(assetPath);
  }

  for (const assetPath of manifest.selection.downloads) {
    if (!STAGED_ASSET_PREFIXES[0] || !assetPath.startsWith(STAGED_ASSET_PREFIXES[0])) {
      throw new Error(`selected download must remain below public/downloads/: ${assetPath}`);
    }
  }
  for (const assetPath of manifest.selection.templates) {
    if (!STAGED_ASSET_PREFIXES[1] || !assetPath.startsWith(STAGED_ASSET_PREFIXES[1])) {
      throw new Error(`selected template must remain below public/templates/: ${assetPath}`);
    }
  }

  return selectedAssetPaths;
}

function resolveProjectPath(root, pathname) {
  return path.isAbsolute(pathname) ? pathname : path.join(root, pathname);
}

function getManifest(root, manifestPath) {
  const resolvedManifestPath = path.resolve(resolveProjectPath(root, manifestPath ?? 'content/release-manifest.json'));
  assertExistingPathHasNoSymbolicLinks(root, resolvedManifestPath, 'release manifest');

  let rawManifest;
  try {
    rawManifest = JSON.parse(fs.readFileSync(resolvedManifestPath, 'utf8'));
  } catch (error) {
    throw new Error(`release manifest could not be read as JSON: ${getErrorMessage(error)}`);
  }

  let manifest;
  try {
    manifest = parseReleaseScopeManifest(rawManifest);
  } catch (error) {
    throw new Error(`release manifest is invalid: ${getErrorMessage(error)}`);
  }

  const activationError = getReleaseScopeActivationError(manifest);
  if (activationError) throw new Error(`Static asset staging blocked: ${activationError}`);

  return { manifest, manifestPath: resolvedManifestPath };
}

function getOutputPath(root, releaseId, outputPath) {
  const resolvedOutputPath = path.resolve(resolveProjectPath(root, outputPath ?? path.join(STAGING_DIRECTORY_NAME, releaseId)));
  assertPathIsInside(root, resolvedOutputPath, 'staging directory');

  const publicRoot = path.join(root, 'public');
  const relativeToPublic = path.relative(publicRoot, resolvedOutputPath);
  if (!path.isAbsolute(relativeToPublic) && !relativeToPublic.split(path.sep).includes('..')) {
    throw new Error('staging directory must not be created inside public/.');
  }
  if (fs.existsSync(resolvedOutputPath)) {
    throw new Error(`staging directory must be fresh and must not already exist: ${resolvedOutputPath}`);
  }

  return resolvedOutputPath;
}

function ensureStagingParent(root, outputPath) {
  const parentPath = path.dirname(outputPath);
  const relativeParentPath = path.relative(root, parentPath);
  if (path.isAbsolute(relativeParentPath) || relativeParentPath.split(path.sep).includes('..')) {
    throw new Error('staging directory parent must resolve inside the project root.');
  }
  fs.mkdirSync(parentPath, { recursive: true });
  if (parentPath === root) {
    assertDirectory(root, 'project root');
  } else {
    assertExistingPathHasNoSymbolicLinks(root, parentPath, 'staging directory parent');
  }
  return parentPath;
}

/**
 * Make a local, byte-for-byte staging directory for selected public assets.
 * It neither builds routes nor invokes a host, deployment API, or Git command.
 * The output exists only after every source path has passed the safety checks.
 */
export function stageReleaseStaticAssets({
  root = process.cwd(),
  manifestPath,
  outputPath,
} = {}) {
  const resolvedRoot = path.resolve(root);
  assertDirectory(resolvedRoot, 'project root');

  const { manifest, manifestPath: resolvedManifestPath } = getManifest(resolvedRoot, manifestPath);
  const stagedAssetPaths = getStagedAssetPaths(manifest);
  const resolvedOutputPath = getOutputPath(resolvedRoot, manifest.releaseId, outputPath);

  const sourceAssets = stagedAssetPaths.map(assetPath => ({
    assetPath,
    sourcePath: getSourceAssetPath(resolvedRoot, assetPath),
  }));
  const parentPath = ensureStagingParent(resolvedRoot, resolvedOutputPath);
  const temporaryPath = fs.mkdtempSync(path.join(parentPath, `.${path.basename(resolvedOutputPath)}.staging-`));

  try {
    for (const { assetPath, sourcePath } of sourceAssets) {
      const destinationPath = path.join(temporaryPath, ...getSafeRelativeAssetPath(assetPath));
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
      fs.copyFileSync(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
    }
    fs.renameSync(temporaryPath, resolvedOutputPath);
  } catch (error) {
    fs.rmSync(temporaryPath, { recursive: true, force: true, maxRetries: 2 });
    throw error;
  }

  return Object.freeze({
    releaseId: manifest.releaseId,
    manifestPath: resolvedManifestPath,
    outputPath: resolvedOutputPath,
    copiedAssetPaths: Object.freeze([...stagedAssetPaths]),
  });
}

function printUsage() {
  console.log('Usage: node --experimental-strip-types scripts/stage-release-static-assets.mjs [--manifest <path>] [--output <path>]');
  console.log('Creates a local staging directory only. It never deploys or enables the release gate.');
}

function parseCliOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg !== '--manifest' && arg !== '--output') throw new Error(`Unknown option: ${arg}`);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`${arg} requires a path.`);
    options[arg === '--manifest' ? 'manifestPath' : 'outputPath'] = value;
    index += 1;
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = parseCliOptions(process.argv.slice(2));
    if (options.help) {
      printUsage();
    } else {
      const result = stageReleaseStaticAssets(options);
      console.log(`Staged ${result.copiedAssetPaths.length} static assets for local review at ${result.outputPath}.`);
      console.log('No routes were built and no deployment was attempted.');
    }
  } catch (error) {
    console.error(`Static asset staging failed: ${getErrorMessage(error)}`);
    process.exitCode = 1;
  }
}
