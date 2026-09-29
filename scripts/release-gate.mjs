import fs from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getReleaseScopeActivationError,
  parseReleaseScopeManifest
} from '../lib/release-scope.ts';

export const PRIVACY_OWNER_REVIEW_MARKERS = Object.freeze([
  'PRIVACY DRAFT',
  'OWNER REVIEW REQUIRED'
]);

const PLACEHOLDER_HOST_LABELS = new Set([
  'example',
  'invalid',
  'placeholder',
  'replace',
  'changeme',
  'todo'
]);

function normaliseString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidNamedHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(host);
}

function isLocalOrPlaceholderHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const labels = host.split('.').filter(Boolean);
  const topLevelLabel = labels.at(-1);

  return (
    !host ||
    isIP(host) ||
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    ['invalid', 'example', 'test'].includes(topLevelLabel) ||
    labels.some(label => PLACEHOLDER_HOST_LABELS.has(label)) ||
    /(^|[-.])(your-domain|approved-domain|placeholder|replace|changeme|todo)([-.]|$)/.test(host)
  );
}

export function getSiteOriginError(value) {
  const origin = normaliseString(value);
  if (!origin) return 'set an approved HTTPS SITE_ORIGIN.';
  if (origin !== value) return 'SITE_ORIGIN must not contain leading or trailing whitespace.';

  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    return 'SITE_ORIGIN must be a valid absolute HTTPS URL.';
  }

  if (parsed.protocol !== 'https:') return 'SITE_ORIGIN must use HTTPS.';
  if (parsed.username || parsed.password) return 'SITE_ORIGIN must not include credentials.';
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) return 'SITE_ORIGIN must be an origin without a path, query, or fragment.';
  if (!isValidNamedHostname(parsed.hostname) || isLocalOrPlaceholderHost(parsed.hostname)) {
    return 'SITE_ORIGIN must use a non-local, non-placeholder public hostname.';
  }

  return null;
}

export function getPrivacyEmailError(value) {
  const email = normaliseString(value);
  if (!email) return 'set an approved brand privacy email.';
  if (email !== value) return 'PRIVACY_EMAIL must not contain leading or trailing whitespace.';

  const match = email.match(/^[^\s@]+@([^\s@]+)$/);
  if (!match) return 'PRIVACY_EMAIL must be a valid email address.';

  const domain = match[1].toLowerCase();
  if (!isValidNamedHostname(domain) || isLocalOrPlaceholderHost(domain)) {
    return 'PRIVACY_EMAIL must use a non-placeholder, monitored domain.';
  }

  return null;
}

export function getPrivacyPageError(privacyPage) {
  const marker = PRIVACY_OWNER_REVIEW_MARKERS.find(value => privacyPage.includes(value));
  return marker ? `privacy notice is still marked for owner review (${marker}).` : null;
}

export function getRobotsReleaseError(layoutSource, robotsSource) {
  const layoutRequired = [
    "const allowPublicIndexing = process.env.OWNER_PUBLICATION_APPROVED === 'true';",
    'robots: { index: allowPublicIndexing, follow: allowPublicIndexing }'
  ];
  const missingLayoutToken = layoutRequired.find(token => !layoutSource.includes(token));
  if (missingLayoutToken) {
    return 'locale metadata must allow indexing only through the explicit owner-publication gate.';
  }

  const robotsRequired = [
    "const allowPublicIndexing = process.env.OWNER_PUBLICATION_APPROVED === 'true';",
    'rules: allowPublicIndexing',
    "allow: '/'",
    "disallow: '/'"
  ];
  const missingRobotsToken = robotsRequired.find(token => !robotsSource?.includes(token));
  return missingRobotsToken ? 'robots.txt must allow crawling only through the explicit owner-publication gate.' : null;
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isProvisionedD1Id(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    && !/^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(value)
    && value !== '00000000-0000-4000-8000-000000000000';
}

export function getWorkerConfigReleaseError(workerConfig, env) {
  if (!isRecord(workerConfig)) return 'wrangler.jsonc must be valid JSON before release.';

  const flags = Array.isArray(workerConfig.compatibility_flags) ? workerConfig.compatibility_flags : [];
  if (flags.filter(flag => flag === 'nodejs_compat').length !== 1) {
    return 'wrangler.jsonc must contain nodejs_compat exactly once.';
  }

  const bindings = Array.isArray(workerConfig.d1_databases)
    ? workerConfig.d1_databases.filter(binding => isRecord(binding) && binding.binding === 'WAITLIST_DB')
    : [];
  if (bindings.length !== 1 || !isProvisionedD1Id(bindings[0]?.database_id)) {
    return 'wrangler.jsonc must contain exactly one WAITLIST_DB binding with a provisioned non-placeholder database_id.';
  }

  const configuredOrigin = isRecord(workerConfig.vars) ? workerConfig.vars.SITE_ORIGIN : undefined;
  if (configuredOrigin !== env.SITE_ORIGIN || getSiteOriginError(configuredOrigin)) {
    return 'wrangler.jsonc SITE_ORIGIN must match the approved non-placeholder HTTPS SITE_ORIGIN.';
  }

  return null;
}

/**
 * Keep the release manifest connected to the release gate before it can be
 * used to select content. The current deployment path has no scoped route or
 * static-asset builder, so a manifest may never turn a broad deploy into an
 * apparently approved narrow one. The explicit hard stop is removed only
 * together with those two fail-closed builders and their artifact tests.
 */
export function getReleaseScopeReleaseError(releaseManifest) {
  let manifest;
  try {
    manifest = parseReleaseScopeManifest(releaseManifest);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return `release manifest is invalid: ${detail}`;
  }

  const activationError = getReleaseScopeActivationError(manifest);
  if (activationError) return activationError;

  return 'PUBLIC_RELEASE is blocked until the scoped route and static-asset release pipeline is implemented and validated.';
}

export function getReleaseBlockersFromInputs({ env = process.env, articles, labs, readerPaths, privacyPage, layoutSource, robotsSource, releaseManifest }) {
  const pendingArticles = articles.filter(article => article.status !== 'approved').map(article => article.id);
  const pendingLabs = labs.filter(lab => lab.status !== 'approved').map(lab => lab.id);
  const pendingReaderPaths = readerPaths.filter(readerPath => readerPath.status !== 'approved').map(readerPath => readerPath.id);
  const blockers = [];

  if (env.OWNER_PUBLICATION_APPROVED !== 'true') {
    blockers.push('OWNER_PUBLICATION_APPROVED=true is required after explicit owner approval.');
  }
  if (pendingArticles.length) blockers.push(`articles pending approval: ${pendingArticles.join(', ')}`);
  if (pendingLabs.length) blockers.push(`labs pending approval: ${pendingLabs.join(', ')}`);
  if (pendingReaderPaths.length) blockers.push(`reader paths pending approval: ${pendingReaderPaths.join(', ')}`);

  const originError = getSiteOriginError(env.SITE_ORIGIN);
  if (originError) blockers.push(originError);

  const privacyEmailError = getPrivacyEmailError(env.PRIVACY_EMAIL);
  if (privacyEmailError) blockers.push(privacyEmailError);

  const privacyPageError = getPrivacyPageError(privacyPage);
  if (privacyPageError) blockers.push(privacyPageError);

  const robotsError = getRobotsReleaseError(layoutSource, robotsSource);
  if (robotsError) blockers.push(robotsError);

  const releaseScopeError = getReleaseScopeReleaseError(releaseManifest);
  if (releaseScopeError) blockers.push(releaseScopeError);

  return blockers;
}

export function getReleaseBlockers({ root = process.cwd(), env = process.env } = {}) {
  const articles = JSON.parse(fs.readFileSync(path.join(root, 'content', 'articles.json'), 'utf8'));
  const labs = JSON.parse(fs.readFileSync(path.join(root, 'content', 'labs.json'), 'utf8'));
  const readerPaths = JSON.parse(fs.readFileSync(path.join(root, 'content', 'reader-paths.json'), 'utf8'));
  const privacyPage = fs.readFileSync(path.join(root, 'app', '[lang]', 'privacy', 'page.tsx'), 'utf8');
  const layoutSource = fs.readFileSync(path.join(root, 'app', '[lang]', 'layout.tsx'), 'utf8');
  const robotsSource = fs.readFileSync(path.join(root, 'app', 'robots.ts'), 'utf8');
  let releaseManifest;
  try {
    releaseManifest = JSON.parse(fs.readFileSync(path.join(root, 'content', 'release-manifest.json'), 'utf8'));
  } catch {
    releaseManifest = undefined;
  }
  let workerConfig;
  try {
    workerConfig = JSON.parse(fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8'));
  } catch {
    workerConfig = undefined;
  }
  const blockers = getReleaseBlockersFromInputs({ env, articles, labs, readerPaths, privacyPage, layoutSource, robotsSource, releaseManifest });
  const workerConfigError = getWorkerConfigReleaseError(workerConfig, env);
  if (workerConfigError) blockers.push(workerConfigError);
  return blockers;
}

export function runReleaseGate(options) {
  const blockers = getReleaseBlockers(options);
  if (blockers.length) {
    throw new Error(`Release blocked:\n${blockers.map(blocker => `- ${blocker}`).join('\n')}`);
  }
  console.log('Release gate passed.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runReleaseGate();
}
