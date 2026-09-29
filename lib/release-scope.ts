/**
 * The release manifest is deliberately separate from content metadata.
 *
 * Its checked-in default is LOCAL_REVIEW_ONLY with an empty selection. Future
 * release tooling must parse this contract before it chooses routes or public
 * assets. A valid manifest alone does not publish anything: the existing
 * owner-publication, privacy, support, and deployment gates still apply.
 */
export const RELEASE_SCOPE_SCHEMA_VERSION = 1 as const;

export const RELEASE_SCOPE_MODES = ['LOCAL_REVIEW_ONLY', 'PUBLIC_RELEASE'] as const;
export type ReleaseScopeMode = typeof RELEASE_SCOPE_MODES[number];

export const RELEASE_SCOPE_SELECTION_KEYS = [
  'articles',
  'labs',
  'readerPaths',
  'series',
  'roadmapStages',
  'interviewPrepTracks',
  'interviewTopics',
  'routeSurfaces',
  'downloads',
  'templates',
] as const;

export type ReleaseScopeSelectionKey = typeof RELEASE_SCOPE_SELECTION_KEYS[number];

/**
 * These names deliberately describe complete route families, rather than URL
 * fragments. A staged build must know which module family it is permitting;
 * arbitrary strings are too easy for a renderer to ignore.
 */
export const RELEASE_SCOPE_ROUTE_SURFACES = [
  'home',
  'about',
  'privacy',
  'resources',
  'categories',
  'article-downloads',
  'series',
  'interview-lab',
  'labs',
  'portfolio-evidence-planner',
  'learning-evidence-planner',
  'no-code-starter-lab',
  'coding-starter-lab',
  'support',
  'rss',
] as const;

export type ReleaseScopeRouteSurface = typeof RELEASE_SCOPE_ROUTE_SURFACES[number];

export type ReleaseScopeSelection = Readonly<{
  articles: readonly string[];
  labs: readonly string[];
  readerPaths: readonly string[];
  series: readonly string[];
  roadmapStages: readonly string[];
  interviewPrepTracks: readonly string[];
  interviewTopics: readonly string[];
  routeSurfaces: readonly string[];
  downloads: readonly string[];
  templates: readonly string[];
}>;

export type ReleaseScopeReviewEvidence = Readonly<{
  ownerApprovalRecord: string;
  sourceRightsReviewRecord: string;
  approvedCommit: string;
  approvedAt: string;
}>;

export type ReleaseScopeManifest = Readonly<{
  schemaVersion: typeof RELEASE_SCOPE_SCHEMA_VERSION;
  mode: ReleaseScopeMode;
  releaseId: string | null;
  selection: ReleaseScopeSelection;
  reviewEvidence: ReleaseScopeReviewEvidence | null;
}>;

type UnknownRecord = Record<string, unknown>;

const MANIFEST_KEYS = ['schemaVersion', 'mode', 'releaseId', 'selection', 'reviewEvidence'] as const;
const REVIEW_EVIDENCE_KEYS = ['ownerApprovalRecord', 'sourceRightsReviewRecord', 'approvedCommit', 'approvedAt'] as const;
const CONTENT_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,127}$/;
const ROUTE_SURFACE_PATTERN = /^[a-z0-9][a-z0-9/-]{0,127}$/;
const OPAQUE_REFERENCE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]{2,199}$/;
const GIT_COMMIT_PATTERN = /^[0-9a-f]{7,64}$/i;
const PLACEHOLDER_PATTERN = /^(?:todo|tbd|replace(?:[-_ ].*)?|changeme|example|local(?:[-_ ]review[-_ ]only)?)$/i;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function unexpectedKeyErrors(record: UnknownRecord, allowedKeys: readonly string[], label: string): string[] {
  return Object.keys(record)
    .filter(key => !allowedKeys.includes(key))
    .map(key => `${label} contains an unknown key: ${key}.`);
}

function missingKeyErrors(record: UnknownRecord, requiredKeys: readonly string[], label: string): string[] {
  return requiredKeys
    .filter(key => !(key in record))
    .map(key => `${label} is missing required key: ${key}.`);
}

function isPlaceholderReference(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value) || /(?:^|[-_])(todo|tbd|replace|changeme|example)(?:[-_]|$)/i.test(value);
}

function getOpaqueReferenceError(value: unknown, label: string): string | null {
  if (typeof value !== 'string') return `${label} must be a non-empty opaque record identifier.`;
  if (value !== value.trim() || !OPAQUE_REFERENCE_PATTERN.test(value) || isPlaceholderReference(value)) {
    return `${label} must be a non-placeholder opaque record identifier, not a URL or free-form note.`;
  }
  return null;
}

function getIdentifierListErrors(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) return [`${label} must be an array.`];

  const errors: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== 'string' || item !== item.trim() || !CONTENT_ID_PATTERN.test(item)) {
      errors.push(`${label} may contain only lowercase content identifiers made of letters, digits, and hyphens.`);
      continue;
    }
    if (seen.has(item)) errors.push(`${label} must not contain duplicate identifier: ${item}.`);
    seen.add(item);
  }
  return errors;
}

function getRouteSurfaceErrors(value: unknown): string[] {
  if (!Array.isArray(value)) return ['selection.routeSurfaces must be an array.'];

  const errors: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (
      typeof item !== 'string'
      || item !== item.trim()
      || !ROUTE_SURFACE_PATTERN.test(item)
      || item.includes('//')
      || item.split('/').some(segment => segment === '.' || segment === '..')
      || !RELEASE_SCOPE_ROUTE_SURFACES.includes(item as ReleaseScopeRouteSurface)
    ) {
      errors.push(`selection.routeSurfaces may contain only declared route-surface identifiers: ${RELEASE_SCOPE_ROUTE_SURFACES.join(', ')}.`);
      continue;
    }
    if (seen.has(item)) errors.push(`selection.routeSurfaces must not contain duplicate identifier: ${item}.`);
    seen.add(item);
  }
  return errors;
}

function getAssetPathErrors(value: unknown, key: 'downloads' | 'templates'): string[] {
  const label = `selection.${key}`;
  if (!Array.isArray(value)) return [`${label} must be an array.`];

  const prefix = `${key}/`;
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const segments = typeof item === 'string' ? item.split('/') : [];
    const hasUnsafeSegment = segments.some(segment => !segment || segment === '.' || segment === '..');
    const hasUnsafeCharacter = typeof item !== 'string' || /[\\?#:]/.test(item);
    if (
      typeof item !== 'string'
      || item !== item.trim()
      || !item.startsWith(prefix)
      || hasUnsafeSegment
      || hasUnsafeCharacter
    ) {
      errors.push(`${label} may contain only exact, relative paths below public/${key}/.`);
      continue;
    }
    if (seen.has(item)) errors.push(`${label} must not contain duplicate path: ${item}.`);
    seen.add(item);
  }
  return errors;
}

function getSelectionErrors(value: unknown): string[] {
  if (!isRecord(value)) return ['selection must be an object.'];

  const errors = [
    ...unexpectedKeyErrors(value, RELEASE_SCOPE_SELECTION_KEYS, 'selection'),
    ...missingKeyErrors(value, RELEASE_SCOPE_SELECTION_KEYS, 'selection'),
  ];

  for (const key of ['articles', 'labs', 'readerPaths', 'series', 'roadmapStages', 'interviewPrepTracks', 'interviewTopics'] as const) {
    errors.push(...getIdentifierListErrors(value[key], `selection.${key}`));
  }
  errors.push(...getRouteSurfaceErrors(value.routeSurfaces));
  errors.push(...getAssetPathErrors(value.downloads, 'downloads'));
  errors.push(...getAssetPathErrors(value.templates, 'templates'));
  return errors;
}

function getReviewEvidenceErrors(value: unknown): string[] {
  if (!isRecord(value)) return ['reviewEvidence must be an object for PUBLIC_RELEASE.'];
  const errors = [
    ...unexpectedKeyErrors(value, REVIEW_EVIDENCE_KEYS, 'reviewEvidence'),
    ...missingKeyErrors(value, REVIEW_EVIDENCE_KEYS, 'reviewEvidence'),
  ];

  for (const key of ['ownerApprovalRecord', 'sourceRightsReviewRecord'] as const) {
    const error = getOpaqueReferenceError(value[key], `reviewEvidence.${key}`);
    if (error) errors.push(error);
  }

  if (typeof value.approvedCommit !== 'string' || !GIT_COMMIT_PATTERN.test(value.approvedCommit)) {
    errors.push('reviewEvidence.approvedCommit must be the exact reviewed Git commit SHA.');
  }

  if (
    typeof value.approvedAt !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value.approvedAt)
    || Number.isNaN(Date.parse(value.approvedAt))
  ) {
    errors.push('reviewEvidence.approvedAt must be a valid UTC timestamp in YYYY-MM-DDTHH:mm:ssZ form.');
  }

  return errors;
}

function getSelectionCount(selection: UnknownRecord | undefined): number {
  if (!selection) return 0;
  return RELEASE_SCOPE_SELECTION_KEYS.reduce((count, key) => count + (Array.isArray(selection[key]) ? selection[key].length : 0), 0);
}

/**
 * Validate an untrusted JSON value before any release tool can consume it.
 * This function is side-effect free and never reads environment variables.
 */
export function getReleaseScopeManifestValidationErrors(value: unknown): string[] {
  if (!isRecord(value)) return ['release manifest must be a JSON object.'];

  const errors = [
    ...unexpectedKeyErrors(value, MANIFEST_KEYS, 'release manifest'),
    ...missingKeyErrors(value, MANIFEST_KEYS, 'release manifest'),
  ];

  if (value.schemaVersion !== RELEASE_SCOPE_SCHEMA_VERSION) {
    errors.push(`release manifest schemaVersion must be ${RELEASE_SCOPE_SCHEMA_VERSION}.`);
  }
  if (!RELEASE_SCOPE_MODES.includes(value.mode as ReleaseScopeMode)) {
    errors.push(`release manifest mode must be one of: ${RELEASE_SCOPE_MODES.join(', ')}.`);
  }

  errors.push(...getSelectionErrors(value.selection));

  const mode = value.mode;
  const selection = isRecord(value.selection) ? value.selection : undefined;
  if (mode === 'LOCAL_REVIEW_ONLY') {
    if (value.releaseId !== null) errors.push('LOCAL_REVIEW_ONLY requires releaseId to be null.');
    if (value.reviewEvidence !== null) errors.push('LOCAL_REVIEW_ONLY requires reviewEvidence to be null.');
    if (getSelectionCount(selection) !== 0) errors.push('LOCAL_REVIEW_ONLY must not select public content, routes, downloads, or templates.');
  }

  if (mode === 'PUBLIC_RELEASE') {
    const releaseIdError = getOpaqueReferenceError(value.releaseId, 'releaseId');
    if (releaseIdError) errors.push(releaseIdError);
    if (getSelectionCount(selection) === 0) errors.push('PUBLIC_RELEASE must select at least one explicit content item, route, or public asset.');
    errors.push(...getReviewEvidenceErrors(value.reviewEvidence));
  }

  return errors;
}

function freezeSelection(value: UnknownRecord): ReleaseScopeSelection {
  return Object.freeze({
    articles: Object.freeze([...(value.articles as string[])]),
    labs: Object.freeze([...(value.labs as string[])]),
    readerPaths: Object.freeze([...(value.readerPaths as string[])]),
    series: Object.freeze([...(value.series as string[])]),
    roadmapStages: Object.freeze([...(value.roadmapStages as string[])]),
    interviewPrepTracks: Object.freeze([...(value.interviewPrepTracks as string[])]),
    interviewTopics: Object.freeze([...(value.interviewTopics as string[])]),
    routeSurfaces: Object.freeze([...(value.routeSurfaces as string[])]),
    downloads: Object.freeze([...(value.downloads as string[])]),
    templates: Object.freeze([...(value.templates as string[])]),
  });
}

/**
 * Parse a release manifest only after it satisfies the strict contract above.
 * The returned structure is immutable so route and asset selectors receive one
 * stable, audited scope per build.
 */
export function parseReleaseScopeManifest(value: unknown): ReleaseScopeManifest {
  const errors = getReleaseScopeManifestValidationErrors(value);
  if (errors.length) {
    throw new Error(`Invalid release manifest:\n${errors.map(error => `- ${error}`).join('\n')}`);
  }

  const manifest = value as UnknownRecord;
  const selection = freezeSelection(manifest.selection as UnknownRecord);
  const reviewEvidence = manifest.reviewEvidence === null
    ? null
    : Object.freeze({
      ownerApprovalRecord: (manifest.reviewEvidence as UnknownRecord).ownerApprovalRecord as string,
      sourceRightsReviewRecord: (manifest.reviewEvidence as UnknownRecord).sourceRightsReviewRecord as string,
      approvedCommit: (manifest.reviewEvidence as UnknownRecord).approvedCommit as string,
      approvedAt: (manifest.reviewEvidence as UnknownRecord).approvedAt as string,
    });

  return Object.freeze({
    schemaVersion: RELEASE_SCOPE_SCHEMA_VERSION,
    mode: manifest.mode as ReleaseScopeMode,
    releaseId: manifest.releaseId as string | null,
    selection,
    reviewEvidence,
  });
}

/**
 * A caller can use this after parsing to explain why the checked-in default
 * must not be used to build a public release. It does not change any gate.
 */
export function getReleaseScopeActivationError(manifest: ReleaseScopeManifest): string | null {
  return manifest.mode === 'PUBLIC_RELEASE'
    ? null
    : 'release manifest is LOCAL_REVIEW_ONLY and cannot select content for a public release.';
}
