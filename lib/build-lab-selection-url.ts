import type { BuildLabCaseId } from './build-lab-case-selector';

export const BUILD_LAB_SELECTOR_ANCHOR = 'lab-case-selector-title';

export function buildLabCaseSelectionHref(pathname: string, search: string, caseId: BuildLabCaseId) {
  const params = new URLSearchParams(search);
  params.set('case', caseId);
  return `${pathname}?${params.toString()}#${BUILD_LAB_SELECTOR_ANCHOR}`;
}
