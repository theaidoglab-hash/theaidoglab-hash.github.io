import assert from 'node:assert/strict';
import {
  getActiveReleaseScopeFromInputs,
  getScopedSelectionIds,
  isReleaseAssetSelected,
  isReleaseRouteSurfaceEnabled,
  RELEASE_BUILD_ENVIRONMENT_KEY,
} from '../lib/release-runtime-scope.ts';
import { selectSeriesForReleaseScope } from '../lib/release-series-selection.ts';

const runtimeScopeDependencies = {
  parse: value => value,
  getActivationError: scope => scope.mode === 'PUBLIC_RELEASE'
    ? null
    : 'release manifest is LOCAL_REVIEW_ONLY and cannot select content for a public release.',
};

function publicManifest(selection = {}) {
  return {
    schemaVersion: 1,
    mode: 'PUBLIC_RELEASE',
    releaseId: 'runtime-scope-contract-test',
    selection: {
      articles: [],
      labs: [],
      readerPaths: [],
      series: [],
      roadmapStages: [],
      interviewPrepTracks: [],
      interviewTopics: [],
      routeSurfaces: [],
      downloads: [],
      templates: [],
      ...selection,
    },
    reviewEvidence: {
      ownerApprovalRecord: 'runtime-scope-owner-review',
      sourceRightsReviewRecord: 'runtime-scope-rights-review',
      approvedCommit: '0123456789abcdef',
      approvedAt: '2026-09-26T00:00:00Z',
    },
  };
}

const localReviewManifest = {
  schemaVersion: 1,
  mode: 'LOCAL_REVIEW_ONLY',
  releaseId: null,
  selection: {
    articles: [],
    labs: [],
    readerPaths: [],
    series: [],
    roadmapStages: [],
    interviewPrepTracks: [],
    interviewTopics: [],
    routeSurfaces: [],
    downloads: [],
    templates: [],
  },
  reviewEvidence: null,
};

assert.equal(getActiveReleaseScopeFromInputs({}, localReviewManifest, runtimeScopeDependencies), null);
assert.equal(getActiveReleaseScopeFromInputs({ [RELEASE_BUILD_ENVIRONMENT_KEY]: 'false' }, publicManifest(), runtimeScopeDependencies), null);
assert.throws(
  () => getActiveReleaseScopeFromInputs({ [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true' }, localReviewManifest, runtimeScopeDependencies),
  /LOCAL_REVIEW_ONLY/,
);

const scope = getActiveReleaseScopeFromInputs(
  { [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true' },
  publicManifest({ articles: ['selected-article'], routeSurfaces: ['article-downloads'], downloads: ['downloads/selected-article/v1/en.pdf'], templates: ['templates/selected.md'] }),
  runtimeScopeDependencies,
);
assert.ok(scope);
assert.equal(isReleaseRouteSurfaceEnabled('article-downloads', scope), true);
assert.equal(isReleaseRouteSurfaceEnabled('labs', scope), false);
assert.deepEqual([...getScopedSelectionIds('articles', scope) ?? []], ['selected-article']);
assert.deepEqual([...getScopedSelectionIds('series', scope) ?? []], []);
assert.equal(getScopedSelectionIds('articles', null), null);
assert.equal(isReleaseAssetSelected('downloads', 'downloads/selected-article/v1/en.pdf', scope), true);
assert.equal(isReleaseAssetSelected('downloads', 'downloads/selected-article/v1/en.md', scope), false);
assert.equal(isReleaseAssetSelected('templates', 'templates/selected.md', scope), true);
assert.equal(isReleaseAssetSelected('templates', 'templates/missing.md', scope), false);
assert.equal(isReleaseAssetSelected('templates', 'templates/local-review.md', null), true);

const seriesScope = getActiveReleaseScopeFromInputs(
  { [RELEASE_BUILD_ENVIRONMENT_KEY]: 'true' },
  publicManifest({ series: ['ai-engineer-roadmap'], routeSurfaces: ['series'] }),
  runtimeScopeDependencies,
);
assert.ok(seriesScope);
assert.equal(isReleaseRouteSurfaceEnabled('series', seriesScope), true);
assert.deepEqual([...getScopedSelectionIds('series', seriesScope) ?? []], ['ai-engineer-roadmap']);
assert.equal(getScopedSelectionIds('series', null), null);

const seriesCatalog = [
  { id: 'ai-engineer-roadmap', status: 'approved', visibility: 'public', updatedAt: '2026-09-26', reviewBy: '2026-12-24' },
  { id: 'ai-use-routes', status: 'approved', visibility: 'public', updatedAt: '2026-09-26', reviewBy: '2026-12-24' },
  { id: 'prompt-play', status: 'review', visibility: 'public', updatedAt: '2026-09-24', reviewBy: '2026-12-24' },
  { id: 'internal-series', status: 'approved', visibility: 'internal', updatedAt: '2026-09-26', reviewBy: '2026-12-24' },
];
assert.deepEqual(
  selectSeriesForReleaseScope(seriesCatalog, null).map(series => series.id),
  ['ai-engineer-roadmap', 'ai-use-routes', 'prompt-play'],
  'local review should retain public review and approved series',
);
assert.deepEqual(
  selectSeriesForReleaseScope(seriesCatalog, seriesScope).map(series => series.id),
  ['ai-engineer-roadmap'],
  'a scoped release should expose only its exact approved public selection',
);
assert.deepEqual(
  selectSeriesForReleaseScope(seriesCatalog, {
    ...seriesScope,
    selection: { ...seriesScope.selection, series: ['prompt-play', 'internal-series', 'missing-series'] },
  }),
  [],
  'review-only, internal, unknown, and unselected series must stay unavailable',
);

console.log('Validated the opt-in, fail-closed runtime release scope. It neither builds nor deploys.');
