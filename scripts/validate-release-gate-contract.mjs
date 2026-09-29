import assert from 'node:assert/strict';
import {
  getPrivacyEmailError,
  getPrivacyPageError,
  getReleaseScopeReleaseError,
  getRobotsReleaseError,
  getWorkerConfigReleaseError,
  getReleaseBlockersFromInputs,
  getSiteOriginError,
  PRIVACY_OWNER_REVIEW_MARKERS
} from './release-gate.mjs';

for (const value of [
  undefined,
  'http://library.ai-dog.org',
  'https://localhost:3000',
  'https://preview.invalid',
  'https://example.com',
  'https://library.ai_dog.org',
  'https://library.ai-dog.org/release',
  'https://library.ai-dog.org?draft=true',
  'https://library.ai-dog.org#preview'
]) {
  assert.notEqual(getSiteOriginError(value), null, `SITE_ORIGIN should be rejected: ${String(value)}`);
}
assert.equal(getSiteOriginError('https://library.ai-dog.org'), null);

for (const value of [
  undefined,
  'privacy@example.invalid',
  'privacy@example.com',
  'privacy@localhost',
  'privacy@library.ai_dog.org',
  'privacy@library.ai-dog.org:443',
  'privacy@library.ai-dog.org ',
  'not-an-email'
]) {
  assert.notEqual(getPrivacyEmailError(value), null, `PRIVACY_EMAIL should be rejected: ${String(value)}`);
}
assert.equal(getPrivacyEmailError('privacy@ai-dog.org'), null);

for (const marker of PRIVACY_OWNER_REVIEW_MARKERS) {
  assert.notEqual(getPrivacyPageError(`<p>${marker}</p>`), null, `Privacy marker should block release: ${marker}`);
}
assert.equal(getPrivacyPageError('<p>Owner-approved privacy notice</p>'), null);

const ownerGatedRobots = `const allowPublicIndexing = process.env.OWNER_PUBLICATION_APPROVED === 'true';\nrobots: { index: allowPublicIndexing, follow: allowPublicIndexing }`;
const ownerGatedRobotsRoute = `const allowPublicIndexing = process.env.OWNER_PUBLICATION_APPROVED === 'true';\nreturn { rules: allowPublicIndexing ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' } };`;
assert.equal(getRobotsReleaseError(ownerGatedRobots, ownerGatedRobotsRoute), null);
assert.notEqual(getRobotsReleaseError('robots: { index: false, follow: false }', ownerGatedRobotsRoute), null);
assert.notEqual(getRobotsReleaseError(ownerGatedRobots, "return { rules: { userAgent: '*', disallow: '/' } };"), null);

const approvedWorkerConfig = {
  compatibility_flags: ['nodejs_compat'],
  d1_databases: [{ binding: 'WAITLIST_DB', database_id: '11111111-2222-4333-8444-555555555555' }],
  vars: { SITE_ORIGIN: 'https://library.ai-dog.org' }
};
assert.equal(getWorkerConfigReleaseError(approvedWorkerConfig, { SITE_ORIGIN: 'https://library.ai-dog.org' }), null);
assert.notEqual(getWorkerConfigReleaseError({ ...approvedWorkerConfig, vars: { SITE_ORIGIN: 'https://preview.invalid' } }, { SITE_ORIGIN: 'https://library.ai-dog.org' }), null);
assert.notEqual(getWorkerConfigReleaseError({ ...approvedWorkerConfig, d1_databases: [{ binding: 'WAITLIST_DB', database_id: 'REPLACE_AFTER_OWNER_APPROVAL' }] }, { SITE_ORIGIN: 'https://library.ai-dog.org' }), null);
assert.notEqual(getWorkerConfigReleaseError({ ...approvedWorkerConfig, d1_databases: [{ binding: 'WAITLIST_DB', database_id: '00000000-0000-0000-0000-000000000000' }] }, { SITE_ORIGIN: 'https://library.ai-dog.org' }), null);
assert.notEqual(getWorkerConfigReleaseError({ ...approvedWorkerConfig, d1_databases: [{ binding: 'WAITLIST_DB', database_id: '11111111-2222-4333-8444-555555555555' }, { binding: 'WAITLIST_DB', database_id: '66666666-7777-4888-8999-000000000000' }] }, { SITE_ORIGIN: 'https://library.ai-dog.org' }), null);
assert.notEqual(getWorkerConfigReleaseError({ ...approvedWorkerConfig, compatibility_flags: ['nodejs_compat', 'nodejs_compat'] }, { SITE_ORIGIN: 'https://library.ai-dog.org' }), null);

const approvedInputs = {
  env: {
    OWNER_PUBLICATION_APPROVED: 'true',
    SITE_ORIGIN: 'https://library.ai-dog.org',
    PRIVACY_EMAIL: 'privacy@ai-dog.org'
  },
  articles: [{ id: 'article', status: 'approved' }],
  labs: [{ id: 'lab', status: 'approved' }],
  readerPaths: [{ id: 'path', status: 'approved' }],
  privacyPage: '<p>Owner-approved privacy notice</p>',
  layoutSource: ownerGatedRobots,
  robotsSource: ownerGatedRobotsRoute
};

const localReviewOnlyScope = {
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
    templates: []
  },
  reviewEvidence: null
};

const publicScopeAwaitingPipeline = {
  schemaVersion: 1,
  mode: 'PUBLIC_RELEASE',
  releaseId: 'release-contract-test',
  selection: {
    articles: ['article'],
    labs: [],
    readerPaths: [],
    series: [],
    roadmapStages: [],
    interviewPrepTracks: [],
    interviewTopics: [],
    routeSurfaces: ['article-downloads'],
    downloads: [],
    templates: []
  },
  reviewEvidence: {
    ownerApprovalRecord: 'owner-approval-contract-test',
    sourceRightsReviewRecord: 'source-rights-contract-test',
    approvedCommit: '0123456789abcdef',
    approvedAt: '2026-09-26T00:00:00Z'
  }
};

assert.match(getReleaseScopeReleaseError(localReviewOnlyScope) ?? '', /LOCAL_REVIEW_ONLY/);
assert.match(getReleaseScopeReleaseError(publicScopeAwaitingPipeline) ?? '', /scoped route and static-asset release pipeline/);
assert.match(getReleaseScopeReleaseError(undefined) ?? '', /release manifest is invalid/);
assert.match(
  getReleaseBlockersFromInputs({ ...approvedInputs, releaseManifest: localReviewOnlyScope }).join('\n'),
  /LOCAL_REVIEW_ONLY/
);
assert.match(
  getReleaseBlockersFromInputs({ ...approvedInputs, releaseManifest: publicScopeAwaitingPipeline }).join('\n'),
  /scoped route and static-asset release pipeline/
);
assert.match(
  getReleaseBlockersFromInputs({ ...approvedInputs, privacyPage: '<p>PRIVACY DRAFT · OWNER REVIEW REQUIRED</p>' }).join('\n'),
  /privacy notice is still marked for owner review/
);
assert.match(
  getReleaseBlockersFromInputs({ ...approvedInputs, env: { ...approvedInputs.env, OWNER_PUBLICATION_APPROVED: 'false' } }).join('\n'),
  /OWNER_PUBLICATION_APPROVED=true/
);
assert.match(
  getReleaseBlockersFromInputs({ ...approvedInputs, layoutSource: 'robots: { index: false, follow: false }' }).join('\n'),
  /locale metadata must allow indexing only/
);
assert.match(
  getReleaseBlockersFromInputs({ ...approvedInputs, robotsSource: "return { rules: { userAgent: '*', disallow: '/' } };" }).join('\n'),
  /robots\.txt must allow crawling only/
);

console.log('Validated release-gate origin, privacy-contact, and owner-review fail-closed rules.');
