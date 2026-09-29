import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  getReleaseScopeActivationError,
  getReleaseScopeManifestValidationErrors,
  parseReleaseScopeManifest,
} from '../lib/release-scope.ts';

const root = process.cwd();
const checkedInManifest = JSON.parse(fs.readFileSync(path.join(root, 'content', 'release-manifest.json'), 'utf8'));
const localManifest = parseReleaseScopeManifest(checkedInManifest);

assert.equal(localManifest.mode, 'LOCAL_REVIEW_ONLY');
assert.equal(localManifest.releaseId, null);
assert.equal(localManifest.reviewEvidence, null);
assert.deepEqual(localManifest.selection, {
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
});
assert.match(getReleaseScopeActivationError(localManifest) ?? '', /LOCAL_REVIEW_ONLY/);

const syntheticPublicManifest = {
  schemaVersion: 1,
  mode: 'PUBLIC_RELEASE',
  releaseId: 'synthetic-release-contract-test',
  selection: {
    articles: ['role-route'],
    labs: [],
    readerPaths: [],
    series: ['ai-engineer-roadmap'],
    roadmapStages: [],
    interviewPrepTracks: [],
    interviewTopics: [],
    routeSurfaces: ['article-downloads', 'series'],
    downloads: ['downloads/role-route/v1/en.pdf'],
    templates: ['templates/role-route/v1/README.md'],
  },
  reviewEvidence: {
    ownerApprovalRecord: 'synthetic-owner-approval-record',
    sourceRightsReviewRecord: 'synthetic-source-rights-record',
    approvedCommit: '0123456789abcdef',
    approvedAt: '2026-09-26T00:00:00Z',
  },
};

const parsedPublicManifest = parseReleaseScopeManifest(syntheticPublicManifest);
assert.equal(getReleaseScopeActivationError(parsedPublicManifest), null);
assert.equal(Object.isFrozen(parsedPublicManifest), true);
assert.equal(Object.isFrozen(parsedPublicManifest.selection.articles), true);
assert.deepEqual(parsedPublicManifest.selection.series, ['ai-engineer-roadmap']);

for (const [label, manifest, expected] of [
  ['unknown root key', { ...checkedInManifest, accidentalEnablement: true }, /unknown key/],
  ['local selection', { ...checkedInManifest, selection: { ...checkedInManifest.selection, articles: ['role-route'] } }, /must not select public content/],
  ['local evidence', { ...checkedInManifest, reviewEvidence: {} }, /requires reviewEvidence to be null/],
  ['public without evidence', { ...syntheticPublicManifest, reviewEvidence: null }, /reviewEvidence must be an object/],
  ['placeholder receipt', { ...syntheticPublicManifest, reviewEvidence: { ...syntheticPublicManifest.reviewEvidence, ownerApprovalRecord: 'TODO' } }, /non-placeholder opaque record/],
  ['invalid reviewed commit', { ...syntheticPublicManifest, reviewEvidence: { ...syntheticPublicManifest.reviewEvidence, approvedCommit: 'not-a-commit' } }, /exact reviewed Git commit SHA/],
  ['asset traversal', { ...syntheticPublicManifest, selection: { ...syntheticPublicManifest.selection, downloads: ['downloads/../private.zip'] } }, /exact, relative paths/],
  ['duplicate content', { ...syntheticPublicManifest, selection: { ...syntheticPublicManifest.selection, articles: ['role-route', 'role-route'] } }, /duplicate identifier/],
  ['undeclared route surface', { ...syntheticPublicManifest, selection: { ...syntheticPublicManifest.selection, routeSurfaces: ['articles/role-route'] } }, /declared route-surface identifiers/],
]) {
  const errors = getReleaseScopeManifestValidationErrors(manifest);
  assert.match(errors.join('\n'), expected, `${label} should be rejected`);
  assert.throws(() => parseReleaseScopeManifest(manifest), expected, `${label} should not parse`);
}

console.log('Validated the disabled release manifest and fail-closed release-scope schema.');
