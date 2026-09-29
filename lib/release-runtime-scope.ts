/**
 * Local review intentionally renders the whole review-stage library. A scoped
 * public build must opt in through this exact environment flag; merely editing
 * a manifest must never hide material from an owner's local review session.
 */
export const RELEASE_BUILD_ENVIRONMENT_KEY = 'AIDOG_RELEASE_BUILD' as const;

type RuntimeEnvironment = Readonly<Record<string, string | undefined>>;
type ScopedSelectionKey = 'articles' | 'labs' | 'readerPaths' | 'series' | 'roadmapStages' | 'interviewPrepTracks' | 'interviewTopics';
type ScopedAssetSelectionKey = 'downloads' | 'templates';

/**
 * Structural boundary for the pure runtime helper. The real manifest parser
 * remains in release-scope.ts; this module deliberately has no runtime file
 * import so its contract can run directly under Node as well as Vite.
 */
export type RuntimeReleaseScope = Readonly<{
  mode: 'LOCAL_REVIEW_ONLY' | 'PUBLIC_RELEASE';
  selection: Readonly<{
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
}>;

type ScopeDependencies = Readonly<{
  parse: (value: unknown) => RuntimeReleaseScope;
  getActivationError: (scope: RuntimeReleaseScope) => string | null;
}>;

export function getActiveReleaseScopeFromInputs(
  environment: RuntimeEnvironment,
  manifestValue: unknown,
  dependencies: ScopeDependencies,
): RuntimeReleaseScope | null {
  if (environment[RELEASE_BUILD_ENVIRONMENT_KEY] !== 'true') return null;

  const manifest = dependencies.parse(manifestValue);
  const activationError = dependencies.getActivationError(manifest);
  if (activationError) {
    throw new Error(`Scoped release build is blocked: ${activationError}`);
  }
  return manifest;
}

/**
 * Server-rendered route modules use this to decide whether they are running
 * an ordinary local review or a deliberately scoped public build. Do not
 * import this module into a client component: the release manifest is a
 * server build input, not browser configuration.
 */
export function isReleaseRouteSurfaceEnabled(
  routeSurface: string,
  scope: RuntimeReleaseScope | null,
): boolean {
  return scope === null || scope.selection.routeSurfaces.includes(routeSurface);
}

export function getScopedSelectionIds(
  key: ScopedSelectionKey,
  scope: RuntimeReleaseScope | null,
): ReadonlySet<string> | null {
  return scope === null ? null : new Set(scope.selection[key]);
}

export function isReleaseAssetSelected(
  key: ScopedAssetSelectionKey,
  assetPath: string,
  scope: RuntimeReleaseScope | null,
): boolean {
  return scope === null || scope.selection[key].includes(assetPath);
}
