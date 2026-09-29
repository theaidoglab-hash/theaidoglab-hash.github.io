import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const waitlist = fs.readFileSync(path.join(root, 'components', 'waitlist.tsx'), 'utf8');
const waitlistRoute = fs.readFileSync(path.join(root, 'app', 'api', 'waitlist', 'route.ts'), 'utf8');
const turnstile = fs.readFileSync(path.join(root, 'lib', 'turnstile.ts'), 'utf8');
const vite = fs.readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
const wrangler = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
const types = fs.readFileSync(path.join(root, 'cloudflare-env.d.ts'), 'utf8');

for (const [label, text, required] of [
  ['waitlist component', waitlist, 'turnstileSiteKey: string;'],
  ['waitlist component', waitlist, 'data-sitekey={turnstileSiteKey}'],
  ['local Vite config', vite, 'NEXT_PUBLIC_TURNSTILE_SITE_KEY'],
  ['Wrangler config', wrangler, 'NEXT_PUBLIC_TURNSTILE_SITE_KEY'],
  ['Cloudflare environment type', types, 'NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;']
]) {
  if (!text.includes(required)) throw new Error(`Turnstile handoff: ${label} is missing ${required}.`);
}

if (waitlist.includes('process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY')) {
  throw new Error('Turnstile handoff: the client component must not read a build-time public environment variable.');
}
if (vite.includes("vars: { SITE_ORIGIN: 'http://localhost:3000', TURNSTILE_SITE_KEY:")) {
  throw new Error('Turnstile handoff: local Vite config still uses the obsolete TURNSTILE_SITE_KEY name.');
}
for (const [label, text, required] of [
  ['waitlist route', waitlistRoute, "if(!hasConfiguredTurnstile(env))return Response.json({ok:false},{status:503});"],
  ['waitlist route', waitlistRoute, "if(!token)return Response.json({ok:false},{status:400});"],
  ['Turnstile configuration helper', turnstile, "const LOCAL_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';"],
  ['Turnstile configuration helper', turnstile, 'export function hasConfiguredTurnstile'],
  ['Turnstile configuration helper', turnstile, 'configuration.TURNSTILE_SECRET_KEY']
]) {
  if (!text.includes(required)) throw new Error(`Turnstile collection gate: ${label} is missing ${required}.`);
}
if (waitlistRoute.includes('if(env.TURNSTILE_SECRET_KEY){')) {
  throw new Error('Turnstile collection gate: the route must never bypass verification when the secret is absent.');
}

console.log('Validated Turnstile runtime-to-client public-key handoff and fail-closed collection gate.');
