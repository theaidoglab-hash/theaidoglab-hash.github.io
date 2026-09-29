export type ReleaseSelectableContent = Readonly<{
  id: string;
  status: string;
  visibility: string;
}>;

/**
 * Local review may show both review and approved public material. An active
 * scoped release is stricter: it renders only explicitly selected, approved,
 * public records. This is deliberately separate from catalog preflight so a
 * route remains conservative even if a release command is miswired.
 */
export function selectContentForReleaseScope<T extends ReleaseSelectableContent>(
  items: readonly T[],
  selectedIds: ReadonlySet<string> | null,
): T[] {
  if (selectedIds === null) {
    return items.filter(item => item.visibility === 'public' && (item.status === 'review' || item.status === 'approved'));
  }
  return items.filter(item => item.visibility === 'public' && item.status === 'approved' && selectedIds.has(item.id));
}
