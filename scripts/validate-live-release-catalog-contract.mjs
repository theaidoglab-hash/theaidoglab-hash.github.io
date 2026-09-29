import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateLiveReleaseCatalog } from './validate-live-release-catalog.mjs';

function writeJson(root, relativePath, value) {
  const pathname = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(pathname), { recursive: true });
  fs.writeFileSync(pathname, `${JSON.stringify(value, null, 2)}\n`);
}

function publicManifest(selection = {}) {
  return {
    schemaVersion: 1,
    mode: 'PUBLIC_RELEASE',
    releaseId: 'live-release-catalog-contract-test',
    selection: {
      articles: ['approved-article'],
      labs: [],
      readerPaths: [],
      series: ['approved-series'],
      roadmapStages: [],
      interviewPrepTracks: [],
      interviewTopics: [],
      routeSurfaces: ['article-downloads', 'series'],
      downloads: [],
      templates: [],
      ...selection,
    },
    reviewEvidence: {
      ownerApprovalRecord: 'live-catalog-owner-review-test',
      sourceRightsReviewRecord: 'live-catalog-rights-review-test',
      approvedCommit: '0123456789abcdef',
      approvedAt: '2026-09-26T00:00:00Z',
    },
  };
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aidog-live-release-catalog-'));

try {
  writeJson(fixtureRoot, 'content/articles.json', [
    { id: 'approved-article', slug: 'approved-article', status: 'approved', visibility: 'public' },
    { id: 'review-article', slug: 'review-article', status: 'review', visibility: 'public' },
  ]);
  writeJson(fixtureRoot, 'content/labs.json', []);
  writeJson(fixtureRoot, 'content/reader-paths.json', []);
  writeJson(fixtureRoot, 'content/series.json', [
    { id: 'approved-series', status: 'approved', visibility: 'public' },
    { id: 'review-series', status: 'review', visibility: 'public' },
  ]);
  writeJson(fixtureRoot, 'content/roadmaps/ai-engineer-roadmap.json', {
    id: 'ai-engineer-roadmap', status: 'review', visibility: 'public', stages: [],
  });
  writeJson(fixtureRoot, 'content/roadmaps/ai-engineer-interview-prep.json', {
    id: 'ai-engineer-interview-prep', status: 'review', visibility: 'public', tracks: [],
  });
  writeJson(fixtureRoot, 'content/interview-question-metadata.json', { questions: [] });
  writeJson(fixtureRoot, 'content/release-manifest.json', publicManifest());

  const skipped = validateLiveReleaseCatalog({ root: fixtureRoot, environment: {} });
  assert.equal(skipped.status, 'skipped');
  assert.equal(skipped.manifest.mode, 'PUBLIC_RELEASE');

  const validated = validateLiveReleaseCatalog({
    root: fixtureRoot,
    environment: { AIDOG_RELEASE_BUILD: 'true' },
  });
  assert.equal(validated.status, 'validated');
  assert.deepEqual(validated.resolved.articleIds, ['approved-article']);
  assert.deepEqual(validated.resolved.articles.map(article => article.slug), ['approved-article']);
  assert.deepEqual(validated.resolved.seriesIds, ['approved-series']);
  assert.deepEqual(validated.resolved.series.map(series => series.id), ['approved-series']);

  writeJson(fixtureRoot, 'content/release-manifest.json', {
    schemaVersion: 1,
    mode: 'LOCAL_REVIEW_ONLY',
    releaseId: null,
    selection: {
      articles: [], labs: [], readerPaths: [], series: [], roadmapStages: [],
      interviewPrepTracks: [], interviewTopics: [], routeSurfaces: [], downloads: [], templates: [],
    },
    reviewEvidence: null,
  });
  assert.throws(
    () => validateLiveReleaseCatalog({ root: fixtureRoot, environment: { AIDOG_RELEASE_BUILD: 'true' } }),
    /LOCAL_REVIEW_ONLY/,
  );
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true, maxRetries: 2 });
}

console.log('Validated live-catalog preflight behavior against a synthetic public release. It does not build or deploy.');
