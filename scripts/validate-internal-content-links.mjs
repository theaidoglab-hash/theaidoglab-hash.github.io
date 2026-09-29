import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const locales = new Set(['zh-HK', 'zh-TW', 'zh-Hans', 'en']);
const contentRoot = path.join(root, 'content');
const articles = JSON.parse(fs.readFileSync(path.join(contentRoot, 'articles.json'), 'utf8'));
const articleSlugs = new Set(articles.map(article => article.slug));
const legacyArticleSlugs = new Set(['ai-engineer-interview-practice-cards']);
const questionRoot = path.join(contentRoot, 'interview-questions');
const questionSlugs = new Set(
  fs.readdirSync(questionRoot)
    .filter(name => name.endsWith('.json'))
    .map(name => path.basename(name, '.json'))
);
const categorySlugs = new Set([
  'ai-engineering-interviews',
  'ai-engineering-foundations',
  'ai-engineering-career',
  'portfolio-evidence',
  'professional-workflows',
  'low-code-ai-builders',
  'ai-for-coders',
  'resources-opportunities'
]);
const seriesSlugs = new Set(['ai-engineer-interviews', 'prompt-play', 'ai-use-routes', 'ai-engineer-roadmap']);
const staticRoutes = new Set([
  'about',
  'interview-lab',
  'labs',
  'learning-evidence-planner',
  'coding-starter-lab',
  'no-code-starter-lab',
  'portfolio-evidence-planner',
  'privacy',
  'resources',
  'support'
]);
const ignoredFiles = new Set(['article-bodies.json']);
const failures = [];
let checked = 0;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function fail(source, message) {
  failures.push(path.relative(root, source) + ': ' + message);
}

function sourceLocale(filePath) {
  const match = path.basename(filePath, '.mdx').match(/^(zh-HK|zh-TW|zh-Hans|en)$/);
  return match?.[1];
}

function validateInternalHref(rawHref, source, locale) {
  const href = rawHref.replace(/&amp;/g, '&');
  const parsed = new URL(href, 'https://ai-dog.invalid');
  const parts = parsed.pathname.split('/').filter(Boolean);
  if (!locales.has(parts[0])) {
    fail(source, 'internal link must begin with a supported locale: ' + rawHref);
    return;
  }
  if (locale && parts[0] !== locale) {
    fail(source, 'internal link changes locale from ' + locale + ' to ' + parts[0] + ': ' + rawHref);
    return;
  }

  const [, route, target] = parts;
  if (route === 'articles') {
    if (parts.length !== 3 || (!articleSlugs.has(target) && !legacyArticleSlugs.has(target))) {
      fail(source, 'unknown article link: ' + rawHref);
    }
    return;
  }
  if (route === 'interview-lab') {
    if (parts.length === 2) return;
    if (parts.length !== 3 || !questionSlugs.has(target)) fail(source, 'unknown interview-lab question link: ' + rawHref);
    return;
  }
  if (route === 'categories') {
    if (parts.length !== 3 || !categorySlugs.has(target)) fail(source, 'unknown category link: ' + rawHref);
    return;
  }
  if (route === 'series') {
    if (parts.length !== 3 || !seriesSlugs.has(target)) fail(source, 'unknown series link: ' + rawHref);
    return;
  }
  if (parts.length !== 2 || !staticRoutes.has(route)) {
    fail(source, 'unknown internal route: ' + rawHref);
  }
}

function validateTextLinks(text, source, locale) {
  const links = text.matchAll(/\]\((\/(?:zh-HK|zh-TW|zh-Hans|en)\/[^)\s]+)\)/g);
  for (const match of links) {
    checked += 1;
    validateInternalHref(match[1], source, locale);
  }
}

function validateJsonValue(value, source, inheritedLocale) {
  if (typeof value === 'string') {
    validateTextLinks(value, source, inheritedLocale);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(item => validateJsonValue(item, source, inheritedLocale));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    validateJsonValue(child, source, locales.has(key) ? key : inheritedLocale);
  }
}

for (const file of walk(contentRoot)) {
  const extension = path.extname(file);
  if (!['.mdx', '.json'].includes(extension) || ignoredFiles.has(path.basename(file))) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (extension === '.mdx') {
    validateTextLinks(source, file, sourceLocale(file));
  } else {
    validateJsonValue(JSON.parse(source), file, undefined);
  }
}

if (failures.length) {
  throw new Error('Internal content-link validation failed:\n' + failures.join('\n'));
}

console.log('Validated ' + checked + ' locale-preserving internal content links.');
