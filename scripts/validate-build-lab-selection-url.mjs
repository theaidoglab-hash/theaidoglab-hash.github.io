import assert from 'node:assert/strict';
import {
  BUILD_LAB_SELECTOR_ANCHOR,
  buildLabCaseSelectionHref,
} from '../lib/build-lab-selection-url.ts';

assert.equal(BUILD_LAB_SELECTOR_ANCHOR, 'lab-case-selector-title');
assert.equal(
  buildLabCaseSelectionHref('/zh-Hant/labs', '?case=coding-starter', 'approval'),
  '/zh-Hant/labs?case=approval#lab-case-selector-title',
);
assert.equal(
  buildLabCaseSelectionHref('/en/labs', '?source=resources&case=coding-starter', 'reliability'),
  '/en/labs?source=resources&case=reliability#lab-case-selector-title',
);

console.log('Validated Build Lab selected-case URL preservation.');
