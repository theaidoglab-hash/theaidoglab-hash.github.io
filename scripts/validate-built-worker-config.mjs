import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function fail(message) {
  throw new Error(`Built Worker configuration: ${message}`);
}

function readJson(relativePath) {
  const target = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    fail(`could not parse ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function waitlistBindings(config) {
  return Array.isArray(config.d1_databases)
    ? config.d1_databases.filter(binding => binding?.binding === 'WAITLIST_DB')
    : [];
}

const configured = readJson('wrangler.jsonc');
const built = readJson(path.join('dist', 'server', 'wrangler.json'));
const configuredBindings = waitlistBindings(configured);
const builtBindings = waitlistBindings(built);

if (configuredBindings.length !== 1) {
  fail(`wrangler.jsonc must define exactly one WAITLIST_DB binding; found ${configuredBindings.length}.`);
}
if (builtBindings.length !== 1) {
  fail(`dist/server/wrangler.json must contain exactly one WAITLIST_DB binding; found ${builtBindings.length}.`);
}

const configuredBinding = configuredBindings[0];
const builtBinding = builtBindings[0];
for (const field of ['database_name', 'database_id']) {
  if (builtBinding[field] !== configuredBinding[field]) {
    fail(`WAITLIST_DB ${field} diverged from wrangler.jsonc.`);
  }
}

const configuredFlags = Array.isArray(configured.compatibility_flags) ? configured.compatibility_flags : [];
const builtFlags = Array.isArray(built.compatibility_flags) ? built.compatibility_flags : [];
if (builtFlags.filter(flag => flag === 'nodejs_compat').length !== 1) {
  fail('dist/server/wrangler.json must contain nodejs_compat exactly once.');
}
if (JSON.stringify(builtFlags) !== JSON.stringify(configuredFlags)) {
  fail('compatibility flags diverged from wrangler.jsonc.');
}

const configuredVars = configured.vars ?? {};
const builtVars = built.vars ?? {};
for (const [key, value] of Object.entries(configuredVars)) {
  if (builtVars[key] !== value) {
    fail(`Worker var ${key} diverged from wrangler.jsonc.`);
  }
}

if (typeof configuredVars.SITE_ORIGIN !== 'string' || !configuredVars.SITE_ORIGIN) {
  fail('wrangler.jsonc must define SITE_ORIGIN.');
}
if (builtVars.SITE_ORIGIN !== configuredVars.SITE_ORIGIN) {
  fail('the built Worker silently replaced the configured SITE_ORIGIN.');
}

console.log('Validated built Worker config: one WAITLIST_DB binding, one nodejs_compat flag, and configured runtime vars preserved.');
