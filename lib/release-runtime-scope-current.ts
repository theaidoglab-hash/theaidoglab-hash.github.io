import rawReleaseManifest from '@/content/release-manifest.json';
import {
  getActiveReleaseScopeFromInputs,
  type RuntimeReleaseScope,
} from './release-runtime-scope';
import { getReleaseScopeActivationError, parseReleaseScopeManifest } from './release-scope';
import type { ReleaseScopeManifest } from './release-scope';

/**
 * This module is for server-rendered route code only. Keeping the checked-in
 * manifest import here lets the pure scope contract run directly under Node
 * in its validator without bundler alias resolution or browser exposure.
 */
export function getActiveReleaseScope(): RuntimeReleaseScope | null {
  return getActiveReleaseScopeFromInputs(process.env, rawReleaseManifest, {
    parse: parseReleaseScopeManifest,
    // `parse` above always returns the full validated manifest. The pure
    // helper intentionally sees only the small structural subset it needs.
    getActivationError: scope => getReleaseScopeActivationError(scope as ReleaseScopeManifest),
  });
}
