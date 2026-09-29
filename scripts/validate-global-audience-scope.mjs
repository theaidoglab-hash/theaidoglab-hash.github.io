import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const narrowingPattern = /澳洲|Australia|Hong Kong|香港|簽證|签证|visa/iu;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function fail(message) {
  throw new Error(`Global audience scope validation failed: ${message}`);
}

function assertBroadIntro(label, text) {
  if (narrowingPattern.test(text)) {
    fail(`${label} narrows the site to a region, visa status, or Hong Kong technical-job audience.`);
  }
  if (!/AI/u.test(text) || !/(?:作品|portfolio)/iu.test(text)) {
    fail(`${label} must say that the site is for learning AI and building an inspectable portfolio.`);
  }
}

function extractQuotedIntros(relativePath) {
  const source = read(relativePath);
  const intros = Array.from(source.matchAll(/intro:\s*'((?:\\.|[^'])*)'/gu), match => match[1]);
  if (intros.length !== locales.length) {
    fail(`${relativePath} must expose one localized intro for each public locale.`);
  }
  return intros;
}

for (const [index, intro] of extractQuotedIntros('lib/i18n.ts').entries()) {
  assertBroadIntro(`lib/i18n.ts intro ${index + 1}`, intro);
}

for (const [index, intro] of extractQuotedIntros('app/[lang]/about/page.tsx').entries()) {
  assertBroadIntro(`app/[lang]/about/page.tsx intro ${index + 1}`, intro);
}

const readerPaths = JSON.parse(read('content/reader-paths.json'));
for (const locale of locales) {
  const intro = readerPaths[0]?.translations?.[locale]?.intro;
  if (typeof intro !== 'string') fail(`content/reader-paths.json is missing its ${locale} start-here intro.`);
  assertBroadIntro(`content/reader-paths.json ${locale} intro`, intro);
}

console.log('Validated global AI learning and portfolio audience framing across 12 localized entry messages.');
