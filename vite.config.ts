import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  return {
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          main: 'vinext/server/app-router-entry',
          compatibility_flags: ['nodejs_compat'],
          d1_databases: [{ binding: 'WAITLIST_DB', database_name: 'aidog-waitlist', database_id: '00000000-0000-4000-8000-000000000000' }],
          vars: { SITE_ORIGIN: 'http://localhost:3000', TURNSTILE_SITE_KEY: '1x00000000000000000000AA' }
        }
      })
    ]
  };
});
