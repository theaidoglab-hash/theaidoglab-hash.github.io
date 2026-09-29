import type { InterviewTopic } from './interview-lab';
import type { InterviewPrepTrack, RoadmapStage } from './roadmaps';
import type { ReleaseScopeManifest, ReleaseScopeRouteSurface } from './release-scope';
import type { ArticleMeta, LabMeta, ReaderPathMeta } from './types';

export type SeriesMeta = Readonly<{
  id: string;
  status: string;
  visibility: string;
  updatedAt?: string;
  reviewBy?: string;
}>;

/**
 * A release catalog entry deliberately separates publication approval from the
 * source content object. Some collections (for example, roadmap stages and
 * interview topics) inherit their publication state from a larger document,
 * so looking only at their learning status would be unsafe.
 */
export type ReleaseCatalogEntry<T> = Readonly<{
  id: string;
  status: string;
  visibility: string;
  item: T;
}>;

/**
 * Callers provide these inputs explicitly. This module does not import the
 * site's live catalog, read a manifest from disk, or decide which review-only
 * items should become public.
 */
export type ReleaseCatalogInputs = Readonly<{
  articles: readonly ReleaseCatalogEntry<ArticleMeta>[];
  labs: readonly ReleaseCatalogEntry<LabMeta>[];
  readerPaths: readonly ReleaseCatalogEntry<ReaderPathMeta>[];
  series: readonly ReleaseCatalogEntry<SeriesMeta>[];
  roadmapStages: readonly ReleaseCatalogEntry<RoadmapStage>[];
  interviewPrepTracks: readonly ReleaseCatalogEntry<InterviewPrepTrack>[];
  interviewTopics: readonly ReleaseCatalogEntry<InterviewTopic>[];
}>;

export type ResolvedReleaseCatalog = Readonly<{
  articleIds: readonly string[];
  articles: readonly ArticleMeta[];
  labIds: readonly string[];
  labs: readonly LabMeta[];
  readerPathIds: readonly string[];
  readerPaths: readonly ReaderPathMeta[];
  seriesIds: readonly string[];
  series: readonly SeriesMeta[];
  roadmapStageIds: readonly string[];
  roadmapStages: readonly RoadmapStage[];
  interviewPrepTrackIds: readonly string[];
  interviewPrepTracks: readonly InterviewPrepTrack[];
  interviewTopicIds: readonly string[];
  interviewTopics: readonly InterviewTopic[];
  routeSurfaces: readonly ReleaseScopeRouteSurface[];
}>;

type CatalogSelectionKey = keyof ReleaseCatalogInputs;
type CatalogEntry = ReleaseCatalogEntry<unknown>;

const CATALOG_SELECTION_KEYS = [
  'articles',
  'labs',
  'readerPaths',
  'series',
  'roadmapStages',
  'interviewPrepTracks',
  'interviewTopics',
] as const satisfies readonly CatalogSelectionKey[];

const CONTENT_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,127}$/;

/**
 * These are hard dependencies, not navigation recommendations. They name the
 * declared route family that must be included when a selected collection is
 * rendered. A future route implementation can add stricter dependencies, but
 * it must never silently omit one of these.
 *
 * `series` is both a selected catalog item and a route surface. Naming the
 * family alone never exposes every series: each series id must also appear in
 * `selection.series` and pass its publication-state check.
 */
export const RELEASE_CATALOG_ROUTE_DEPENDENCIES = Object.freeze({
  articles: Object.freeze(['article-downloads']),
  labs: Object.freeze(['labs']),
  readerPaths: Object.freeze(['home']),
  series: Object.freeze(['series']),
  roadmapStages: Object.freeze(['home']),
  interviewPrepTracks: Object.freeze(['interview-lab']),
  interviewTopics: Object.freeze(['interview-lab']),
} as const satisfies Readonly<Record<CatalogSelectionKey, readonly ReleaseScopeRouteSurface[]>>);

const PORTFOLIO_PLANNER_REQUIRED_ARTICLES = Object.freeze([
  'role-route',
  'github-portfolio-proof-pack',
] as const);
const PORTFOLIO_PLANNER_REQUIRED_TEMPLATES = Object.freeze([
  'templates/portfolio-proof-pack/v1/portfolio-proof-pack.md',
] as const);
const PORTFOLIO_PLANNER_RUNNABLE_ROUTE_SURFACES = Object.freeze([
  'labs',
  'no-code-starter-lab',
  'coding-starter-lab',
] as const satisfies readonly ReleaseScopeRouteSurface[]);

const ITEM_IDENTIFIER_KEYS: Readonly<Record<CatalogSelectionKey, 'id' | 'slug'>> = Object.freeze({
  articles: 'id',
  labs: 'id',
  readerPaths: 'id',
  series: 'id',
  roadmapStages: 'id',
  interviewPrepTracks: 'id',
  interviewTopics: 'slug',
});

/**
 * These source records own their own publication metadata. The wrapper is not
 * allowed to relabel a review item as approved. Roadmap stages, prep tracks,
 * and question topics intentionally inherit their release state from an
 * injected parent approval record, so their learning status is not checked as
 * publication status here.
 */
const ITEM_OWNS_PUBLICATION_STATE: Readonly<Record<CatalogSelectionKey, boolean>> = Object.freeze({
  articles: true,
  labs: true,
  readerPaths: true,
  series: true,
  roadmapStages: false,
  interviewPrepTracks: false,
  interviewTopics: false,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getStringList(value: unknown, label: string, errors: string[]): readonly string[] {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array on an already-parsed release manifest.`);
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function getCatalogIndex(
  key: CatalogSelectionKey,
  entries: unknown,
  errors: string[],
): Map<string, CatalogEntry> {
  const index = new Map<string, CatalogEntry>();
  if (!Array.isArray(entries)) {
    errors.push(`release catalog ${key} must be an array.`);
    return index;
  }

  const itemIdentifierKey = ITEM_IDENTIFIER_KEYS[key];
  for (const [position, candidate] of entries.entries()) {
    const label = `release catalog ${key}[${position}]`;
    if (!isRecord(candidate)) {
      errors.push(`${label} must be an object.`);
      continue;
    }
    if (typeof candidate.id !== 'string' || candidate.id !== candidate.id.trim() || !CONTENT_ID_PATTERN.test(candidate.id)) {
      errors.push(`${label}.id must be a lowercase content identifier.`);
      continue;
    }
    if (typeof candidate.status !== 'string' || !candidate.status) {
      errors.push(`${label}.status must be a non-empty publication status.`);
      continue;
    }
    if (typeof candidate.visibility !== 'string' || !candidate.visibility) {
      errors.push(`${label}.visibility must be a non-empty visibility value.`);
      continue;
    }
    if (!('item' in candidate) || candidate.item === undefined || !isRecord(candidate.item)) {
      errors.push(`${label}.item must be a catalog object.`);
      continue;
    }
    if (candidate.item[itemIdentifierKey] !== candidate.id) {
      errors.push(`${label}.item.${itemIdentifierKey} must match ${label}.id.`);
      continue;
    }
    if (ITEM_OWNS_PUBLICATION_STATE[key]) {
      if (candidate.item.status !== candidate.status) {
        errors.push(`${label}.item.status must match ${label}.status; a wrapper cannot relabel source publication state.`);
        continue;
      }
      if (candidate.item.visibility !== candidate.visibility) {
        errors.push(`${label}.item.visibility must match ${label}.visibility; a wrapper cannot relabel source visibility.`);
        continue;
      }
    }
    if (index.has(candidate.id)) {
      errors.push(`release catalog ${key} has duplicate identifier: ${candidate.id}.`);
      continue;
    }
    index.set(candidate.id, candidate as CatalogEntry);
  }
  return index;
}

function getSelectedEntries(
  key: CatalogSelectionKey,
  ids: readonly string[],
  index: ReadonlyMap<string, CatalogEntry>,
  errors: string[],
): CatalogEntry[] {
  const selected: CatalogEntry[] = [];
  for (const id of ids) {
    const entry = index.get(id);
    if (!entry) {
      errors.push(`selection.${key} selects an unknown catalog identifier: ${id}.`);
      continue;
    }
    if (entry.status !== 'approved') {
      errors.push(`selection.${key} selects ${id}, but it is ${entry.status}; public releases require approved items.`);
      continue;
    }
    if (entry.visibility !== 'public') {
      errors.push(`selection.${key} selects ${id}, but its visibility is ${entry.visibility}; public releases require public items.`);
      continue;
    }
    selected.push(entry);
  }
  return selected;
}

function requireRouteDependencies(
  key: CatalogSelectionKey,
  ids: readonly string[],
  routeSurfaces: ReadonlySet<string>,
  errors: string[],
) {
  if (!ids.length) return;
  for (const routeSurface of RELEASE_CATALOG_ROUTE_DEPENDENCIES[key]) {
    if (!routeSurfaces.has(routeSurface)) {
      errors.push(`selection.${key} requires route surface ${routeSurface}.`);
    }
  }
}

type ResourceBearingItem = Readonly<{
  id: string;
  resources?: readonly Readonly<{ kind?: unknown; target?: unknown }>[];
}>;

/**
 * A scoped map must be closed over the learning links it displays. This does
 * not infer more content into a release; it makes the manifest name every
 * article, question, or route surface that a selected map card can open.
 */
function getResourceDependencyErrors(
  label: 'roadmap stage' | 'interview-prep track',
  entries: readonly CatalogEntry[],
  selectedArticleSlugs: ReadonlySet<string>,
  selectedTopicSlugs: ReadonlySet<string>,
  selectedLabIds: ReadonlySet<string>,
  routeSurfaces: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];
  for (const entry of entries) {
    const item = entry.item as ResourceBearingItem;
    const resources = Array.isArray(item.resources) ? item.resources : [];
    for (const resource of resources) {
      const kind = resource?.kind;
      const target = resource?.target;
      if (typeof target !== 'string' || !target) {
        errors.push(`${label} ${entry.id} has a resource without a usable target.`);
        continue;
      }
      if (kind === 'article' && !selectedArticleSlugs.has(target)) {
        errors.push(`${label} ${entry.id} links to article ${target}, which must be explicitly selected for the release.`);
        continue;
      }
      if (kind === 'interview-question' && !selectedTopicSlugs.has(target)) {
        errors.push(`${label} ${entry.id} links to interview question ${target}, which must be explicitly selected for the release.`);
        continue;
      }
      if (kind !== 'lab') continue;

      if (target === 'build-lab') {
        if (!selectedLabIds.has(target)) {
          errors.push(`${label} ${entry.id} links to lab ${target}, which must be explicitly selected for the release.`);
        }
        continue;
      }
      if (target === 'coding-starter-lab') {
        if (!routeSurfaces.has('coding-starter-lab')) {
          errors.push(`${label} ${entry.id} links to lab route ${target}, which requires route surface coding-starter-lab.`);
        }
        continue;
      }
      errors.push(`${label} ${entry.id} links to unsupported lab target ${target}; add an explicit release dependency before it can be selected.`);
    }
  }
  return errors;
}

function getCatalogInputs(catalogs: unknown, errors: string[]): Record<CatalogSelectionKey, Map<string, CatalogEntry>> {
  const indexes = {} as Record<CatalogSelectionKey, Map<string, CatalogEntry>>;
  if (!isRecord(catalogs)) {
    for (const key of CATALOG_SELECTION_KEYS) errors.push(`release catalog ${key} must be provided.`);
    for (const key of CATALOG_SELECTION_KEYS) indexes[key] = new Map<string, CatalogEntry>();
    return indexes;
  }

  for (const key of CATALOG_SELECTION_KEYS) {
    indexes[key] = getCatalogIndex(key, catalogs[key], errors);
  }
  return indexes;
}

type ManifestSelectionKey = CatalogSelectionKey;

function getSelectionIds(
  manifest: ReleaseScopeManifest,
  key: ManifestSelectionKey,
  errors: string[],
): readonly string[] {
  return getStringList(manifest.selection?.[key], `selection.${key}`, errors);
}

/**
 * Return every reason a parsed manifest cannot form a closed, public catalog.
 * This stays side-effect free so a build step can fail before it writes output
 * or talks to a deployment host.
 */
export function getReleaseCatalogResolutionErrors(
  manifest: ReleaseScopeManifest,
  catalogs: ReleaseCatalogInputs,
): string[] {
  const errors: string[] = [];
  if (!manifest || manifest.mode !== 'PUBLIC_RELEASE') {
    errors.push('release catalog resolution requires an already-parsed PUBLIC_RELEASE manifest.');
    return errors;
  }

  const selection = manifest.selection;
  if (!selection || !isRecord(selection)) {
    errors.push('release catalog resolution requires a parsed manifest selection.');
    return errors;
  }

  const selectedIds = Object.fromEntries(
    CATALOG_SELECTION_KEYS.map(key => [key, getSelectionIds(manifest, key, errors)]),
  ) as Record<CatalogSelectionKey, readonly string[]>;
  const routeSurfaces = new Set(getStringList(selection.routeSurfaces, 'selection.routeSurfaces', errors));

  if (routeSurfaces.has('labs') && !selectedIds.labs.includes('build-lab')) {
    errors.push('route surface labs requires selected lab build-lab so the route can render.');
  }

  if (routeSurfaces.has('portfolio-evidence-planner')) {
    const selectedArticleIds = new Set(selectedIds.articles);
    const selectedTemplatePaths = new Set(getStringList(selection.templates, 'selection.templates', errors));
    for (const articleId of PORTFOLIO_PLANNER_REQUIRED_ARTICLES) {
      if (!selectedArticleIds.has(articleId)) {
        errors.push(`route surface portfolio-evidence-planner requires article ${articleId} because the core capstone links to it.`);
      }
    }
    for (const templatePath of PORTFOLIO_PLANNER_REQUIRED_TEMPLATES) {
      if (!selectedTemplatePaths.has(templatePath)) {
        errors.push(`route surface portfolio-evidence-planner requires template ${templatePath} because the core planner exposes it.`);
      }
    }
    if (!PORTFOLIO_PLANNER_RUNNABLE_ROUTE_SURFACES.some(routeSurface => routeSurfaces.has(routeSurface))) {
      errors.push(
        `route surface portfolio-evidence-planner requires at least one runnable learner route surface: ${PORTFOLIO_PLANNER_RUNNABLE_ROUTE_SURFACES.join(', ')}.`,
      );
    }
  }

  for (const key of CATALOG_SELECTION_KEYS) {
    requireRouteDependencies(key, selectedIds[key], routeSurfaces, errors);
  }

  const indexes = getCatalogInputs(catalogs, errors);
  const selectedEntries = Object.fromEntries(
    CATALOG_SELECTION_KEYS.map(key => [key, getSelectedEntries(key, selectedIds[key], indexes[key], errors)]),
  ) as Record<CatalogSelectionKey, CatalogEntry[]>;
  const selectedArticleSlugs = new Set(selectedEntries.articles.map(entry => (entry.item as ArticleMeta).slug));
  const selectedTopicSlugs = new Set(selectedEntries.interviewTopics.map(entry => (entry.item as InterviewTopic).slug));
  const selectedLabIds = new Set(selectedEntries.labs.map(entry => entry.id));
  errors.push(...getResourceDependencyErrors(
    'roadmap stage',
    selectedEntries.roadmapStages,
    selectedArticleSlugs,
    selectedTopicSlugs,
    selectedLabIds,
    routeSurfaces,
  ));
  errors.push(...getResourceDependencyErrors(
    'interview-prep track',
    selectedEntries.interviewPrepTracks,
    selectedArticleSlugs,
    selectedTopicSlugs,
    selectedLabIds,
    routeSurfaces,
  ));
  return errors;
}

function freezeStrings(values: readonly string[]): readonly string[] {
  return Object.freeze([...values]);
}

function freezeItems<T>(entries: readonly CatalogEntry[]): readonly T[] {
  return Object.freeze(entries.map(entry => entry.item as T));
}

/**
 * Resolve the exact approved, public entries named by one parsed manifest.
 * Selection order follows the manifest, never the source catalog. Arrays are
 * frozen snapshots; the underlying content objects are intentionally not
 * cloned or mutated here.
 */
export function resolveReleaseCatalog(
  manifest: ReleaseScopeManifest,
  catalogs: ReleaseCatalogInputs,
): ResolvedReleaseCatalog {
  const errors = getReleaseCatalogResolutionErrors(manifest, catalogs);
  if (errors.length) {
    throw new Error(`Release catalog resolution failed:\n${errors.map(error => `- ${error}`).join('\n')}`);
  }

  const selectedIds = Object.fromEntries(
    CATALOG_SELECTION_KEYS.map(key => [key, manifest.selection[key]]),
  ) as Record<CatalogSelectionKey, readonly string[]>;
  const indexes = getCatalogInputs(catalogs, []);
  const selectedEntries = Object.fromEntries(
    CATALOG_SELECTION_KEYS.map(key => [key, getSelectedEntries(key, selectedIds[key], indexes[key], [])]),
  ) as Record<CatalogSelectionKey, CatalogEntry[]>;

  return Object.freeze({
    articleIds: freezeStrings(selectedIds.articles),
    articles: freezeItems<ArticleMeta>(selectedEntries.articles),
    labIds: freezeStrings(selectedIds.labs),
    labs: freezeItems<LabMeta>(selectedEntries.labs),
    readerPathIds: freezeStrings(selectedIds.readerPaths),
    readerPaths: freezeItems<ReaderPathMeta>(selectedEntries.readerPaths),
    seriesIds: freezeStrings(selectedIds.series),
    series: freezeItems<SeriesMeta>(selectedEntries.series),
    roadmapStageIds: freezeStrings(selectedIds.roadmapStages),
    roadmapStages: freezeItems<RoadmapStage>(selectedEntries.roadmapStages),
    interviewPrepTrackIds: freezeStrings(selectedIds.interviewPrepTracks),
    interviewPrepTracks: freezeItems<InterviewPrepTrack>(selectedEntries.interviewPrepTracks),
    interviewTopicIds: freezeStrings(selectedIds.interviewTopics),
    interviewTopics: freezeItems<InterviewTopic>(selectedEntries.interviewTopics),
    routeSurfaces: freezeStrings(manifest.selection.routeSurfaces) as readonly ReleaseScopeRouteSurface[],
  });
}
