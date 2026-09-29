import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveReleaseCatalog } from '../lib/release-catalog.ts';
import {
  getReleaseScopeActivationError,
  parseReleaseScopeManifest,
} from '../lib/release-scope.ts';

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readLiveReleaseCatalog(root) {
  const articles = readJson(root, 'content/articles.json');
  const labs = readJson(root, 'content/labs.json');
  const readerPaths = readJson(root, 'content/reader-paths.json');
  const series = readJson(root, 'content/series.json');
  const roadmap = readJson(root, 'content/roadmaps/ai-engineer-roadmap.json');
  const interviewPrep = readJson(root, 'content/roadmaps/ai-engineer-interview-prep.json');
  const interviewMetadata = readJson(root, 'content/interview-question-metadata.json');

  return {
    articles: articles.map(item => ({ id: item.id, status: item.status, visibility: item.visibility, item })),
    labs: labs.map(item => ({ id: item.id, status: item.status, visibility: item.visibility, item })),
    readerPaths: readerPaths.map(item => ({ id: item.id, status: item.status, visibility: item.visibility, item })),
    series: series.map(item => ({ id: item.id, status: item.status, visibility: item.visibility, item })),
    roadmapStages: roadmap.stages.map(item => ({ id: item.id, status: roadmap.status, visibility: roadmap.visibility, item })),
    interviewPrepTracks: interviewPrep.tracks.map(item => ({ id: item.id, status: interviewPrep.status, visibility: interviewPrep.visibility, item })),
    // Question pages currently inherit their release state from the review-stage
    // Interview Lab product. A public scoped build cannot relabel that state.
    interviewTopics: interviewMetadata.questions.map(item => ({ id: item.slug, status: 'review', visibility: 'public', item: { slug: item.slug } })),
  };
}

/**
 * Resolve the checked-out catalog only when an explicit scoped-release build
 * is underway. It is intentionally read-only: calling it cannot stage files,
 * build a route, change content metadata, or contact a deployment host.
 */
export function validateLiveReleaseCatalog({
  root = process.cwd(),
  environment = process.env,
} = {}) {
  const manifest = parseReleaseScopeManifest(readJson(root, 'content/release-manifest.json'));

  if (environment.AIDOG_RELEASE_BUILD !== 'true') {
    return Object.freeze({ status: 'skipped', manifest });
  }

  const activationError = getReleaseScopeActivationError(manifest);
  if (activationError) {
    throw new Error(`Live release catalog preflight blocked: ${activationError}`);
  }

  const resolved = resolveReleaseCatalog(manifest, readLiveReleaseCatalog(root));
  return Object.freeze({ status: 'validated', manifest, resolved });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateLiveReleaseCatalog();
  if (result.status === 'skipped') {
    console.log(`Live release catalog preflight skipped: ${result.manifest.mode} is not running with AIDOG_RELEASE_BUILD=true.`);
  } else {
    const { manifest, resolved } = result;
    console.log(`Validated live scoped catalog ${manifest.releaseId}: ${resolved.articles.length} articles, ${resolved.labs.length} labs, ${resolved.readerPaths.length} reader paths, ${resolved.series.length} series, ${resolved.roadmapStages.length} roadmap stages, ${resolved.interviewPrepTracks.length} interview-prep tracks, ${resolved.interviewTopics.length} interview questions.`);
    console.log('This preflight validates selection only. It does not build routes, stage static assets, or deploy.');
  }
}
