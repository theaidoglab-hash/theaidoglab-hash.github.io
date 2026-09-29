import assert from 'node:assert/strict';
import { selectContentForReleaseScope } from '../lib/release-content-selection.ts';

const items = [
  { id: 'approved-selected', status: 'approved', visibility: 'public' },
  { id: 'review-selected', status: 'review', visibility: 'public' },
  { id: 'approved-unselected', status: 'approved', visibility: 'public' },
  { id: 'private-selected', status: 'approved', visibility: 'internal' },
  { id: 'draft-selected', status: 'draft', visibility: 'public' },
];

assert.deepEqual(
  selectContentForReleaseScope(items, null).map(item => item.id),
  ['approved-selected', 'review-selected', 'approved-unselected'],
  'Local review may show only review/approved public records.',
);
assert.deepEqual(
  selectContentForReleaseScope(items, new Set(['approved-selected', 'review-selected', 'private-selected', 'draft-selected'])).map(item => item.id),
  ['approved-selected'],
  'A scoped release must require explicit selection plus approved public state.',
);
assert.deepEqual(
  selectContentForReleaseScope(items, new Set()).map(item => item.id),
  [],
  'An empty scoped selection must render no content records.',
);

console.log('Validated local-review and public-release content selection boundaries.');
