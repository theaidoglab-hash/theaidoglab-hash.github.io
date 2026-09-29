import { selectContentForReleaseScope, type ReleaseSelectableContent } from './release-content-selection.ts';
import { getScopedSelectionIds, type RuntimeReleaseScope } from './release-runtime-scope.ts';

export type ReleaseSeriesRecord = ReleaseSelectableContent & Readonly<{
  updatedAt: string;
  reviewBy: string;
}>;

/**
 * Local review keeps public review/approved series visible. A scoped release
 * receives only exact manifest selections that are independently approved and
 * public; selecting the route family never broadens this item-level result.
 */
export function selectSeriesForReleaseScope<T extends ReleaseSeriesRecord>(
  seriesCatalog: readonly T[],
  scope: RuntimeReleaseScope | null,
): T[] {
  return selectContentForReleaseScope(seriesCatalog, getScopedSelectionIds('series', scope));
}
