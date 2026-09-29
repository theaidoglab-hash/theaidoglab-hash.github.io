import 'server-only';

import rawSeriesCatalog from '@/content/series.json';
import { getActiveReleaseScope } from './release-runtime-scope-current';
import { isReleaseAssetSelected, isReleaseRouteSurfaceEnabled } from './release-runtime-scope';
import { selectSeriesForReleaseScope, type ReleaseSeriesRecord } from './release-series-selection';

const seriesCatalog = rawSeriesCatalog as readonly ReleaseSeriesRecord[];

/**
 * Answer whether a complete server-rendered route family is available in the
 * current build. Local review keeps every route available. A scoped release
 * can expose only route surfaces named by its audited manifest.
 *
 * The parameter intentionally remains a string so an undeclared family stays
 * available for local review but cannot be enabled accidentally in a scoped
 * release.
 */
export function isRouteSurfaceEnabledInCurrentBuild(routeSurface: string): boolean {
  return isReleaseRouteSurfaceEnabled(routeSurface, getActiveReleaseScope());
}

/**
 * Return the exact series records available to this build. A scoped build
 * needs both the `series` route surface and an explicitly selected series
 * whose publication record is approved and public. Local review keeps all
 * public review/approved series visible.
 */
export function getReleaseScopedSeries(): readonly ReleaseSeriesRecord[] {
  const scope = getActiveReleaseScope();
  if (!isReleaseRouteSurfaceEnabled('series', scope)) return [];
  return selectSeriesForReleaseScope(seriesCatalog, scope);
}

export function isSeriesEnabledInCurrentBuild(seriesId: string): boolean {
  return getReleaseScopedSeries().some(seriesItem => seriesItem.id === seriesId);
}

export function isReleaseAssetEnabledInCurrentBuild(
  key: 'downloads' | 'templates',
  assetPath: string,
): boolean {
  return isReleaseAssetSelected(key, assetPath, getActiveReleaseScope());
}

/**
 * Keep conditional presentation distinct from route availability. A local
 * review has no release scope and may retain its full navigation; a scoped
 * build uses this signal when it needs to omit a local-only cross-link.
 */
export function isScopedReleaseBuild(): boolean {
  return getActiveReleaseScope() !== null;
}
