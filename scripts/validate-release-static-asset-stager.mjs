import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FIXED_BRAND_ASSET_PATHS,
  stageReleaseStaticAssets,
} from './stage-release-static-assets.mjs';

const projectRoot = process.cwd();
const checkedInManifestPath = path.join(projectRoot, 'content', 'release-manifest.json');
const checkedInManifestBefore = fs.readFileSync(checkedInManifestPath, 'utf8');

function writeFile(pathname, contents) {
  fs.mkdirSync(path.dirname(pathname), { recursive: true });
  fs.writeFileSync(pathname, contents);
}

function writeJson(pathname, value) {
  writeFile(pathname, `${JSON.stringify(value, null, 2)}\n`);
}

function makePublicManifest({ downloads = [], templates = [] } = {}) {
  return {
    schemaVersion: 1,
    mode: 'PUBLIC_RELEASE',
    releaseId: 'static-assets-contract-test',
    selection: {
      articles: [],
      labs: [],
      readerPaths: [],
      series: [],
      roadmapStages: [],
      interviewPrepTracks: [],
      interviewTopics: [],
      routeSurfaces: [],
      downloads,
      templates,
    },
    reviewEvidence: {
      ownerApprovalRecord: 'asset-stager-owner-review-test',
      sourceRightsReviewRecord: 'asset-stager-rights-review-test',
      approvedCommit: '0123456789abcdef',
      approvedAt: '2026-09-26T00:00:00Z',
    },
  };
}

function listFiles(root, current = root) {
  return fs.readdirSync(current, { withFileTypes: true })
    .flatMap(entry => {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) return listFiles(root, entryPath);
      return [path.relative(root, entryPath).split(path.sep).join('/')];
    })
    .sort();
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aidog-release-static-assets-'));

try {
  const publicRoot = path.join(fixtureRoot, 'public');
  writeFile(path.join(publicRoot, 'ai-dog-mark.webp'), 'brand-mark');
  writeFile(path.join(publicRoot, 'ai-dog.png'), 'brand-icon');
  writeFile(path.join(publicRoot, 'downloads', 'selected', 'v1', 'guide.pdf'), 'selected-download');
  writeFile(path.join(publicRoot, 'downloads', 'unselected', 'v1', 'private.pdf'), 'must-not-stage');
  writeFile(path.join(publicRoot, 'templates', 'selected', 'v1', 'README.md'), 'selected-template');
  writeFile(path.join(publicRoot, 'templates', 'unselected', 'v1', 'README.md'), 'must-not-stage');

  const manifestPath = path.join(fixtureRoot, 'content', 'approved-release-manifest.json');
  writeJson(manifestPath, makePublicManifest({
    downloads: ['downloads/selected/v1/guide.pdf'],
    templates: ['templates/selected/v1/README.md'],
  }));

  const outputPath = path.join(fixtureRoot, '.release-static-assets', 'candidate');
  const result = stageReleaseStaticAssets({ root: fixtureRoot, manifestPath, outputPath });
  assert.equal(result.outputPath, outputPath);
  assert.deepEqual(result.copiedAssetPaths, [
    ...FIXED_BRAND_ASSET_PATHS,
    'downloads/selected/v1/guide.pdf',
    'templates/selected/v1/README.md',
  ]);
  assert.deepEqual(listFiles(outputPath), [
    'ai-dog-mark.webp',
    'ai-dog.png',
    'downloads/selected/v1/guide.pdf',
    'templates/selected/v1/README.md',
  ]);
  assert.equal(fs.readFileSync(path.join(outputPath, 'downloads', 'selected', 'v1', 'guide.pdf'), 'utf8'), 'selected-download');
  assert.equal(fs.readFileSync(path.join(outputPath, 'ai-dog-mark.webp'), 'utf8'), 'brand-mark');
  assert.equal(fs.readFileSync(path.join(outputPath, 'ai-dog.png'), 'utf8'), 'brand-icon');
  assert.equal(fs.existsSync(path.join(outputPath, 'downloads', 'unselected', 'v1', 'private.pdf')), false);
  assert.equal(fs.existsSync(path.join(outputPath, 'templates', 'unselected', 'v1', 'README.md')), false);
  assert.throws(
    () => stageReleaseStaticAssets({ root: fixtureRoot, manifestPath, outputPath }),
    /fresh and must not already exist/,
  );

  const rootLevelOutputPath = path.join(fixtureRoot, 'stage-at-project-root');
  stageReleaseStaticAssets({
    root: fixtureRoot,
    manifestPath: path.relative(fixtureRoot, manifestPath),
    outputPath: path.relative(fixtureRoot, rootLevelOutputPath),
  });
  assert.deepEqual(listFiles(rootLevelOutputPath), listFiles(outputPath));

  const missingAssetManifestPath = path.join(fixtureRoot, 'content', 'missing-asset-manifest.json');
  writeJson(missingAssetManifestPath, makePublicManifest({ downloads: ['downloads/missing/v1/guide.pdf'] }));
  const missingOutputPath = path.join(fixtureRoot, '.release-static-assets', 'missing');
  assert.throws(
    () => stageReleaseStaticAssets({ root: fixtureRoot, manifestPath: missingAssetManifestPath, outputPath: missingOutputPath }),
    /does not exist/,
  );
  assert.equal(fs.existsSync(missingOutputPath), false, 'a failed stage must not leave a final output directory');

  const traversalManifestPath = path.join(fixtureRoot, 'content', 'traversal-manifest.json');
  writeJson(traversalManifestPath, makePublicManifest({ downloads: ['downloads/../escape.pdf'] }));
  assert.throws(
    () => stageReleaseStaticAssets({ root: fixtureRoot, manifestPath: traversalManifestPath, outputPath: path.join(fixtureRoot, '.release-static-assets', 'traversal') }),
    /exact, relative paths/,
  );

  const linkedDownloadPath = path.join(publicRoot, 'downloads', 'selected', 'v1', 'linked-guide.pdf');
  try {
    fs.symlinkSync('guide.pdf', linkedDownloadPath, 'file');
    assert.equal(fs.lstatSync(linkedDownloadPath).isSymbolicLink(), true);
    const symlinkManifestPath = path.join(fixtureRoot, 'content', 'symlink-manifest.json');
    writeJson(symlinkManifestPath, makePublicManifest({ downloads: ['downloads/selected/v1/linked-guide.pdf'] }));
    assert.throws(
      () => stageReleaseStaticAssets({ root: fixtureRoot, manifestPath: symlinkManifestPath, outputPath: path.join(fixtureRoot, '.release-static-assets', 'symlink') }),
      /must not use symbolic links/,
    );
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error.code === 'EPERM' || error.code === 'EACCES')) {
      assert.match(
        fs.readFileSync(fileURLToPath(new URL('./stage-release-static-assets.mjs', import.meta.url)), 'utf8'),
        /lstatSync\(current\)[\s\S]*isSymbolicLink/,
        'platform denied symlink fixture creation, so retain an explicit source-level guard check',
      );
    } else {
      throw error;
    }
  }

  const checkedInOutputPath = path.join(projectRoot, '.release-static-assets', 'must-not-exist-from-local-manifest');
  assert.throws(
    () => stageReleaseStaticAssets({ root: projectRoot, outputPath: checkedInOutputPath }),
    /LOCAL_REVIEW_ONLY/,
  );
  assert.equal(fs.existsSync(checkedInOutputPath), false, 'the checked-in local manifest must not create an output directory');
  assert.equal(fs.readFileSync(checkedInManifestPath, 'utf8'), checkedInManifestBefore, 'staging must not alter the checked-in release manifest');
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true, maxRetries: 2 });
}

console.log('Validated the fail-closed local static-asset stager. It does not build routes or deploy.');
