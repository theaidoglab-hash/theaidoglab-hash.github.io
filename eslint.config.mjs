import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Wrangler generates bundled worker output locally. It is not authored source and
// can contain framework-internal hook patterns that should not affect site lint.
export default defineConfig([...nextVitals, ...nextTs, globalIgnores(['dist/**', '.next/**', '.wrangler/**'])]);
