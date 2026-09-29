import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const support = fs.readFileSync(path.join(root, 'lib', 'support.ts'), 'utf8');
const card = fs.readFileSync(path.join(root, 'components', 'support-card.tsx'), 'utf8');
const home = fs.readFileSync(path.join(root, 'app', '[lang]', 'page.tsx'), 'utf8');
const nudge = fs.readFileSync(path.join(root, 'components', 'support-nudge.tsx'), 'utf8');
const readiness = fs.readFileSync(path.join(root, 'docs', 'deployment-readiness.md'), 'utf8');

function fail(message) {
  throw new Error(`Support contract: ${message}`);
}

for (const [label, text, required] of [
  ['support helper', support, "'https://buymeacoffee.com/theaidog.lab'"],
  ['support helper', support, 'return approvedSupportUrl;'],
  ['support card', card, 'target="_blank"'],
  ['support card', card, 'rel="noreferrer"'],
  ['home page support gate', home, "const supportEnabled = isRouteSurfaceEnabledInCurrentBuild('support');"],
  ['home page support gate', home, 'const supportUrl = supportEnabled ? getBuyMeACoffeeSupportUrl() : undefined;'],
  ['home page support gate', home, 'href={supportUrl}'],
  ['support nudge', nudge, "if (!isRouteSurfaceEnabledInCurrentBuild('support')) return null;"],
  ['deployment readiness', readiness, 'links directly to the fixed Buy Me a Coffee page']
]) {
  if (!text.includes(required)) fail(`${label} is missing ${required}.`);
}

for (const forbidden of ['NODE_ENV', 'NEXT_PUBLIC_BUY_ME_A_COFFEE_URL', 'localPreviewApproval']) {
  if (support.includes(forbidden)) fail(`support helper must not enable support through ${forbidden}.`);
}

if (support.match(/https:\/\/buymeacoffee\.com\/theaidog\.lab/g)?.length !== 1) {
  fail('the support helper must keep exactly one fixed approved Buy Me a Coffee URL.');
}

if (card.includes('support-unavailable') || card.includes('role="status"')) {
  fail('the support card must link directly to Buy Me a Coffee without an unavailable state.');
}

console.log('Validated the direct Buy Me a Coffee voluntary-support contract.');
