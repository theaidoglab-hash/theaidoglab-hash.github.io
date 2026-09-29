import assert from 'node:assert/strict';
import {
  getReleaseCatalogResolutionErrors,
  resolveReleaseCatalog,
} from '../lib/release-catalog.ts';
import { parseReleaseScopeManifest } from '../lib/release-scope.ts';

function makeManifest({
  selection = {},
  mode = 'PUBLIC_RELEASE',
} = {}) {
  return parseReleaseScopeManifest({
    schemaVersion: 1,
    mode,
    releaseId: mode === 'PUBLIC_RELEASE' ? 'release-catalog-contract-test' : null,
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
    reviewEvidence: mode === 'PUBLIC_RELEASE'
      ? {
        ownerApprovalRecord: 'release-catalog-owner-review',
        sourceRightsReviewRecord: 'release-catalog-rights-review',
        approvedCommit: '0123456789abcdef',
        approvedAt: '2026-09-26T00:00:00Z',
      }
      : null,
  });
}

function entry(id, item, { status = 'approved', visibility = 'public' } = {}) {
  return { id, status, visibility, item };
}

const approvedCatalog = {
  articles: [
    entry('second-article', { id: 'second-article', status: 'approved', visibility: 'public', marker: 'second article' }),
    entry('first-article', { id: 'first-article', status: 'approved', visibility: 'public', marker: 'first article' }),
    entry('role-route', { id: 'role-route', status: 'approved', visibility: 'public', marker: 'role route' }),
    entry('github-portfolio-proof-pack', { id: 'github-portfolio-proof-pack', status: 'approved', visibility: 'public', marker: 'proof pack' }),
  ],
  labs: [entry('build-lab', { id: 'build-lab', status: 'approved', visibility: 'public', marker: 'lab' })],
  readerPaths: [entry('start-here', { id: 'start-here', status: 'approved', visibility: 'public', marker: 'reader path' })],
  series: [entry('ai-engineer-roadmap', { id: 'ai-engineer-roadmap', status: 'approved', visibility: 'public', marker: 'series' })],
  roadmapStages: [entry('stage-00', { id: 'stage-00', marker: 'stage', resources: [] })],
  interviewPrepTracks: [entry('serving-track', { id: 'serving-track', marker: 'prep track', resources: [] })],
  interviewTopics: [entry('model-routing-needs-a-fallback', { slug: 'model-routing-needs-a-fallback', marker: 'topic' })],
};

const completeManifest = makeManifest({
  selection: {
    articles: ['first-article', 'second-article'],
    labs: ['build-lab'],
    readerPaths: ['start-here'],
    series: ['ai-engineer-roadmap'],
    roadmapStages: ['stage-00'],
    interviewPrepTracks: ['serving-track'],
    interviewTopics: ['model-routing-needs-a-fallback'],
    routeSurfaces: ['article-downloads', 'labs', 'home', 'series', 'interview-lab'],
  },
});

const resolved = resolveReleaseCatalog(completeManifest, approvedCatalog);
assert.deepEqual(resolved.articleIds, ['first-article', 'second-article']);
assert.deepEqual(resolved.articles.map(item => item.marker), ['first article', 'second article'], 'manifest order must be preserved');
assert.deepEqual(resolved.labs.map(item => item.marker), ['lab']);
assert.deepEqual(resolved.readerPaths.map(item => item.marker), ['reader path']);
assert.deepEqual(resolved.seriesIds, ['ai-engineer-roadmap']);
assert.deepEqual(resolved.series.map(item => item.marker), ['series']);
assert.deepEqual(resolved.roadmapStages.map(item => item.marker), ['stage']);
assert.deepEqual(resolved.interviewPrepTracks.map(item => item.marker), ['prep track']);
assert.deepEqual(resolved.interviewTopics.map(item => item.marker), ['topic']);
assert.equal(Object.isFrozen(resolved), true);
assert.equal(Object.isFrozen(resolved.articles), true);
assert.equal(Object.isFrozen(resolved.interviewTopics), true);
assert.throws(() => resolved.articleIds.push('unexpected'), TypeError);

const localManifest = makeManifest({ mode: 'LOCAL_REVIEW_ONLY' });
assert.match(
  getReleaseCatalogResolutionErrors(localManifest, approvedCatalog).join('\n'),
  /already-parsed PUBLIC_RELEASE/,
);

for (const [label, manifest, catalog, expected] of [
  [
    'labs route without its renderable lab selection',
    makeManifest({ selection: { routeSurfaces: ['labs'] } }),
    approvedCatalog,
    /route surface labs requires selected lab build-lab/,
  ],
  [
    'portfolio planner without its linked content and template',
    makeManifest({ selection: { routeSurfaces: ['portfolio-evidence-planner'] } }),
    approvedCatalog,
    /requires article role-route/,
  ],
  [
    'portfolio planner without its proof-pack template',
    makeManifest({ selection: { articles: ['role-route', 'github-portfolio-proof-pack'], routeSurfaces: ['portfolio-evidence-planner', 'article-downloads'] } }),
    approvedCatalog,
    /requires template templates\/portfolio-proof-pack\/v1\/portfolio-proof-pack\.md/,
  ],
  [
    'portfolio planner without a runnable learner route',
    makeManifest({
      selection: {
        articles: ['role-route', 'github-portfolio-proof-pack'],
        routeSurfaces: ['portfolio-evidence-planner', 'article-downloads'],
        templates: ['templates/portfolio-proof-pack/v1/portfolio-proof-pack.md'],
      },
    }),
    approvedCatalog,
    /requires at least one runnable learner route surface: labs, no-code-starter-lab, coding-starter-lab/,
  ],
  [
    'unknown selected identifier',
    makeManifest({ selection: { articles: ['missing-article'], routeSurfaces: ['article-downloads'] } }),
    approvedCatalog,
    /unknown catalog identifier: missing-article/,
  ],
  [
    'review-only selected item',
    makeManifest({ selection: { labs: ['build-lab'], routeSurfaces: ['labs'] } }),
    { ...approvedCatalog, labs: [entry('build-lab', { id: 'build-lab', status: 'review', visibility: 'public' }, { status: 'review' })] },
    /but it is review; public releases require approved items/,
  ],
  [
    'non-public selected item',
    makeManifest({ selection: { readerPaths: ['start-here'], routeSurfaces: ['home'] } }),
    { ...approvedCatalog, readerPaths: [entry('start-here', { id: 'start-here', status: 'approved', visibility: 'internal' }, { visibility: 'internal' })] },
    /visibility is internal; public releases require public items/,
  ],
  [
    'missing hard route dependency',
    makeManifest({ selection: { interviewTopics: ['model-routing-needs-a-fallback'], routeSurfaces: [] } }),
    approvedCatalog,
    /requires route surface interview-lab/,
  ],
  [
    'wrapper relabels source review status',
    makeManifest({ selection: { articles: ['first-article'], routeSurfaces: ['article-downloads'] } }),
    { ...approvedCatalog, articles: [entry('first-article', { id: 'first-article', status: 'review', visibility: 'public' })] },
    /cannot relabel source publication state/,
  ],
  [
    'wrong canonical topic identifier',
    makeManifest({ selection: { interviewTopics: ['model-routing-needs-a-fallback'], routeSurfaces: ['interview-lab'] } }),
    { ...approvedCatalog, interviewTopics: [entry('model-routing-needs-a-fallback', { slug: 'different-topic' })] },
    /item.slug must match/,
  ],
  [
    'duplicate catalog identifier',
    makeManifest({ selection: { roadmapStages: ['stage-00'], routeSurfaces: ['home'] } }),
    { ...approvedCatalog, roadmapStages: [entry('stage-00', { id: 'stage-00' }), entry('stage-00', { id: 'stage-00' })] },
    /duplicate identifier: stage-00/,
  ],
  [
    'unknown selected series',
    makeManifest({ selection: { series: ['prompt-play'], routeSurfaces: ['series'] } }),
    approvedCatalog,
    /unknown catalog identifier: prompt-play/,
  ],
  [
    'review-only selected series',
    makeManifest({ selection: { series: ['ai-engineer-roadmap'], routeSurfaces: ['series'] } }),
    { ...approvedCatalog, series: [entry('ai-engineer-roadmap', { id: 'ai-engineer-roadmap', status: 'review', visibility: 'public' }, { status: 'review' })] },
    /but it is review; public releases require approved items/,
  ],
  [
    'series without its route surface',
    makeManifest({ selection: { series: ['ai-engineer-roadmap'] } }),
    approvedCatalog,
    /selection\.series requires route surface series/,
  ],
  [
    'unselected roadmap article dependency',
    makeManifest({ selection: { roadmapStages: ['stage-00'], routeSurfaces: ['home'] } }),
    { ...approvedCatalog, roadmapStages: [entry('stage-00', { id: 'stage-00', resources: [{ kind: 'article', target: 'missing-article-slug' }] })] },
    /links to article missing-article-slug, which must be explicitly selected/,
  ],
  [
    'unselected interview-question dependency',
    makeManifest({ selection: { interviewPrepTracks: ['serving-track'], routeSurfaces: ['interview-lab'] } }),
    { ...approvedCatalog, interviewPrepTracks: [entry('serving-track', { id: 'serving-track', resources: [{ kind: 'interview-question', target: 'model-routing-needs-a-fallback' }] })] },
    /links to interview question model-routing-needs-a-fallback, which must be explicitly selected/,
  ],
  [
    'coding lab route dependency',
    makeManifest({ selection: { interviewPrepTracks: ['serving-track'], routeSurfaces: ['interview-lab'] } }),
    { ...approvedCatalog, interviewPrepTracks: [entry('serving-track', { id: 'serving-track', resources: [{ kind: 'lab', target: 'coding-starter-lab' }] })] },
    /requires route surface coding-starter-lab/,
  ],
]) {
  const errors = getReleaseCatalogResolutionErrors(manifest, catalog);
  assert.match(errors.join('\n'), expected, `${label} should fail closed`);
  assert.throws(() => resolveReleaseCatalog(manifest, catalog), expected, `${label} should not resolve`);
}

for (const runnableRouteSurface of ['labs', 'no-code-starter-lab', 'coding-starter-lab']) {
  const manifest = makeManifest({
    selection: {
      articles: ['role-route', 'github-portfolio-proof-pack'],
      labs: runnableRouteSurface === 'labs' ? ['build-lab'] : [],
      routeSurfaces: ['portfolio-evidence-planner', 'article-downloads', runnableRouteSurface],
      templates: ['templates/portfolio-proof-pack/v1/portfolio-proof-pack.md'],
    },
  });
  assert.deepEqual(
    getReleaseCatalogResolutionErrors(manifest, approvedCatalog),
    [],
    `portfolio planner should accept runnable route surface ${runnableRouteSurface}`,
  );
  assert.doesNotThrow(
    () => resolveReleaseCatalog(manifest, approvedCatalog),
    `portfolio planner should resolve with runnable route surface ${runnableRouteSurface}`,
  );
}

console.log('Validated the fail-closed injectable release catalog resolver. It does not read live content, build routes, or deploy.');
