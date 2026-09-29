import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const types = fs.readFileSync(path.join(root, 'lib', 'types.ts'), 'utf8');
const handler = fs.readFileSync(path.join(root, 'app', 'api', 'waitlist', 'route.ts'), 'utf8');
const component = fs.readFileSync(path.join(root, 'components', 'waitlist.tsx'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'migrations', '0003_unify_traditional_chinese_locale.sql'), 'utf8');
const wrangler = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
const vite = fs.readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
const exampleEnv = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const workerTypes = fs.readFileSync(path.join(root, 'cloudflare-env.d.ts'), 'utf8');

const localeMatch = types.match(/export const LOCALES\s*=\s*\[([^\]]+)\]/);
if (!localeMatch) throw new Error('Waitlist contract: could not find LOCALES in lib/types.ts.');

const locales = Array.from(localeMatch[1].matchAll(/'([^']+)'/g), match => match[1]);
if (!locales.length) throw new Error('Waitlist contract: LOCALES is empty.');

for (const locale of locales) {
  if (!migration.includes(`'${locale}'`)) {
    throw new Error(`Waitlist contract: migration does not allow public locale ${locale}.`);
  }
}

if (!migration.includes("CHECK (locale IN ('zh-Hant', 'zh-Hans', 'en'))")) {
  throw new Error('Waitlist contract: canonical migration must constrain persisted locales to the public locale set.');
}

for (const required of [
  "CASE WHEN locale IN ('zh-HK', 'zh-TW', 'zh-MO') THEN 'zh-Hant' ELSE locale END",
  'ALTER TABLE waitlist_entries_next RENAME TO waitlist_entries;',
  'CREATE INDEX idx_waitlist_created_at ON waitlist_entries(created_at);'
]) {
  if (!migration.includes(required)) {
    throw new Error(`Waitlist contract: migration is missing ${required}.`);
  }
}

if (!handler.includes('LOCALES.includes(locale as never)')) {
  throw new Error('Waitlist contract: API route must validate against LOCALES.');
}
if (!handler.includes("env.WAITLIST_COLLECTION_APPROVED!=='true'")) {
  throw new Error('Waitlist contract: API route must fail closed until collection is explicitly approved.');
}
if (handler.includes('body.sourcePath') || component.includes('sourcePath:location.pathname')) {
  throw new Error('Waitlist contract: source paths must not be accepted from the client.');
}
if (!handler.includes("const now=new Date().toISOString(); const sourcePath='/';")) {
  throw new Error('Waitlist contract: API route must retain only the non-identifying source marker until an approved measurement policy exists.');
}
if (!component.includes('locale,interest:')) {
  throw new Error('Waitlist contract: client must submit the current locale.');
}
if (!component.includes('select name="interest" required defaultValue=""')) {
  throw new Error('Waitlist contract: readers must actively choose an interest instead of inheriting a default category.');
}
if (component.includes("interest:String(formData.get('interest')||'portfolio-evidence')")) {
  throw new Error('Waitlist contract: client interest must not silently default to portfolio evidence.');
}
if (!component.includes('if (!collectionEnabled)')) {
  throw new Error('Waitlist contract: client must render a non-collecting state until collection is approved.');
}
if (!wrangler.includes('"migrations_dir": "migrations"')) {
  throw new Error('Waitlist contract: Wrangler must apply the migrations directory.');
}
for (const [label, text, expected] of [
  ['.env.example', exampleEnv, 'WAITLIST_COLLECTION_APPROVED=false'],
  ['wrangler.jsonc', wrangler, '"WAITLIST_COLLECTION_APPROVED": "false"'],
  ['vite.config.ts', vite, "WAITLIST_COLLECTION_APPROVED: 'false'"],
  ['cloudflare-env.d.ts', workerTypes, 'WAITLIST_COLLECTION_APPROVED?: string;']
]) {
  if (!text.includes(expected)) throw new Error(`Waitlist contract: ${label} is missing the fail-closed collection gate.`);
}

console.log(`Validated waitlist locale contract for ${locales.join(', ')}.`);
