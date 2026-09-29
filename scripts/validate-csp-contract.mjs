import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createContentSecurityPolicy, createCspNonce } from '../lib/csp.ts';

const root = process.cwd();

function directive(policy, name) {
  return policy.split(';').map(part => part.trim()).find(part => part.startsWith(`${name} `)) ?? '';
}

const nonce = createCspNonce();
assert.match(nonce, /^[A-Za-z0-9+/]+={0,2}$/, 'CSP nonce must be base64-safe.');

const productionPolicy = createContentSecurityPolicy(nonce);
const productionScriptSource = directive(productionPolicy, 'script-src');
assert.ok(productionScriptSource.includes(`'nonce-${nonce}'`), 'Production script-src must carry the request nonce.');
assert.doesNotMatch(productionScriptSource, /'unsafe-inline'|'unsafe-eval'/, 'Production script-src must not allow unsafe inline or eval scripts.');
assert.match(productionPolicy, /script-src-attr 'none'/, 'Inline script attributes must remain blocked.');
assert.match(productionPolicy, /object-src 'none'/, 'Plugin/object execution must remain blocked.');
assert.match(productionPolicy, /frame-ancestors 'none'/, 'Framing must remain blocked.');
assert.throws(() => createContentSecurityPolicy(null), /requires a script nonce/);

const developmentPolicy = createContentSecurityPolicy(null, true);
assert.match(directive(developmentPolicy, 'script-src'), /'unsafe-inline'.*'unsafe-eval'/, 'Development keeps the pre-existing Vite HMR allowances only.');
assert.doesNotMatch(directive(developmentPolicy, 'script-src'), /'nonce-/, 'Development CSP must not combine a nonce with the HMR unsafe-inline allowance.');

const proxySource = fs.readFileSync(path.join(root, 'proxy.ts'), 'utf8');
assert.match(proxySource, /requestHeaders\.set\('Content-Security-Policy', contentSecurityPolicy\)/, 'Proxy must forward CSP before rendering.');
assert.match(proxySource, /response\.headers\.set\('Content-Security-Policy', contentSecurityPolicy\)/, 'Proxy must send the matching CSP to the browser.');
for (const matcher of ["'/'", "'/:lang'", "'/:lang/:path*'", "'/downloads/:path*'", "'/templates/:path*'"]) {
  assert.ok(proxySource.includes(matcher), `Proxy must cover ${matcher}.`);
}

const nextConfigSource = fs.readFileSync(path.join(root, 'next.config.ts'), 'utf8');
assert.doesNotMatch(nextConfigSource, /Content-Security-Policy/, 'A static next.config CSP would bypass nonce injection and must not return.');

console.log('Validated request-scoped production CSP nonce forwarding and strict script policy.');
