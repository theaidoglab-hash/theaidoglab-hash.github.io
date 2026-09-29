import fs from 'node:fs';
import path from 'node:path';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { cloudflare, type WorkerConfig } from '@cloudflare/vite-plugin';
import { getReleaseBuildPublicDirFromInputs } from './lib/release-build-public-dir.ts';

const LOCAL_REVIEW_ORIGIN = 'http://localhost:3000';
const LOCAL_REVIEW_D1_ID = '00000000-0000-4000-8000-000000000000';
const LOCAL_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

function applyLocalReviewWorkerConfig(workerConfig: WorkerConfig) {
  // The Worker config file remains the sole source for production output.
  // Mutate its already-loaded entries only for `vinext dev`, rather than
  // returning a second partial config that defu would append to the arrays.
  workerConfig.vars = {
    ...workerConfig.vars,
    SITE_ORIGIN: LOCAL_REVIEW_ORIGIN,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: LOCAL_TURNSTILE_SITE_KEY,
    WAITLIST_COLLECTION_APPROVED: 'false'
  };
  workerConfig.d1_databases = (workerConfig.d1_databases ?? []).map(database => (
    database.binding === 'WAITLIST_DB'
      ? { ...database, database_id: LOCAL_REVIEW_D1_ID }
      : database
  ));
}

export default defineConfig(({ command }) => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  const releasePublicDir = getReleaseBuildPublicDirFromInputs(
    process.env,
    process.cwd(),
    pathname => {
      try {
        return fs.statSync(pathname).isDirectory();
      } catch {
        return false;
      }
    },
  );
  return {
    // During owner-reviewed local work Vite uses its normal public/ folder.
    // A deliberately scoped public release must supply only the fresh output
    // of stage-release-static-assets.mjs through AIDOG_RELEASE_PUBLIC_DIR.
    ...(releasePublicDir ? { publicDir: path.resolve(releasePublicDir) } : {}),
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        ...(command === 'serve' ? { config: applyLocalReviewWorkerConfig } : {})
      })
    ]
  };
});
