import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  MAX_RESOURCE_SEARCH_CLAUSES,
  MAX_RESOURCE_SEARCH_TERM_LENGTH,
  buildResourceSearchClauses,
  matchesResourceSearchQuery,
} from '../lib/resource-search.ts';

const root = process.cwd();
const articles = JSON.parse(fs.readFileSync(path.join(root, 'content/articles.json'), 'utf8'));
const bodies = JSON.parse(fs.readFileSync(path.join(root, 'content/article-bodies.json'), 'utf8'));
const searchComponent = fs.readFileSync(path.join(root, 'components/search.tsx'), 'utf8');

function articleSearchText(article, locale) {
  return [
    article.translations[locale].title,
    article.translations[locale].description,
    ...article.tags,
    ...article.learningObjectives,
    bodies[article.id]?.[locale] ?? '',
  ].join(' ');
}

function matchingArticleIds(locale, query) {
  return articles
    .filter(article => matchesResourceSearchQuery(articleSearchText(article, locale), query))
    .map(article => article.id);
}

assert.equal(matchesResourceSearchQuery('Python fundamentals only', 'python deployment'), false);
assert.equal(matchesResourceSearchQuery('A deployment checklist without code examples', 'python deployment'), false);
assert.equal(matchesResourceSearchQuery('A Python service with deployed health checks', 'python deployment'), true);
assert.equal(matchesResourceSearchQuery('RAG backed by a vector database', '向量 資料庫'), true);
assert.equal(matchesResourceSearchQuery('向量資料庫索引與 retrieval', 'vector db'), true);

const pythonDeploymentResults = matchingArticleIds('en', 'python deployment');
assert.ok(pythonDeploymentResults.length > 0, 'The production library must return at least one Python + deployment intersection.');
assert.ok(pythonDeploymentResults.includes('role-route'), 'The role-route guide should be discoverable for Python + deployment.');

const vectorDatabaseResults = matchingArticleIds('zh-HK', '向量 資料庫');
assert.ok(vectorDatabaseResults.includes('rag-evidence'), 'The RAG evidence guide should match the spaced Traditional Chinese vector-database query.');

const boundedClauses = buildResourceSearchClauses(Array.from({ length: 40 }, (_, index) => `token${index}`).join(' '));
assert.equal(boundedClauses.length, MAX_RESOURCE_SEARCH_CLAUSES);
assert.ok(boundedClauses.flat().every(term => term.length <= MAX_RESOURCE_SEARCH_TERM_LENGTH));

const quickGuideCount = articles.filter(article => article.estimatedMinutes <= 30).length;
if (quickGuideCount === 0) {
  assert.match(searchComponent, /filters\.effort === 'quick'/, 'A visible 30-minute filter with no matching guides needs a dedicated recovery state.');
  assert.match(searchComponent, /audience: filters\.audience/, 'The short-session recovery should preserve the learner\'s coding-level choice.');
  assert.match(searchComponent, /No matching guide currently fits the selected 30-minute limit\./, 'The quick recovery must keep the honest 30-minute empty-state framing.');
  assert.match(searchComponent, /showNonCoderStarter = filters\.audience !== 'developer'/, 'Non-coders must retain the manual no-code recovery path.');
  assert.match(searchComponent, /no-code-starter-lab#no-code-lab-manual-title/, 'The non-coder recovery must start at the manual, no-code exercise.');
  assert.match(searchComponent, /showDeveloperStarters = filters\.audience !== 'non-coder'/, 'Developer quick recovery must expose both developer choices without showing them to non-coders.');
  assert.match(searchComponent, /developerCodingStarter/, 'Developer quick recovery needs a separately scoped coding-case judgement choice.');
  assert.match(searchComponent, /coding-starter-lab#coding-starter-lab-quick-title/, 'The coding judgement choice must start at the bounded 15-minute coding exercise.');
  assert.match(searchComponent, /developerPortfolioStarter/, 'Developer quick recovery needs a separately scoped portfolio start-card choice.');
  assert.match(searchComponent, /portfolio-evidence-planner#portfolio-quick-start/, 'The portfolio choice must start at the bounded 15-minute start card.');
  for (const localizedCopy of [
    'Judge two fixed coding review cases in 15 minutes (no download or code)',
    '用 15 分钟判断两个固定的程序复核案例（不用下载或写程序）',
    '用 15 分鐘判斷兩個固定程式覆核案例（毋須下載或寫程式）',
  ]) {
    assert.ok(searchComponent.includes(localizedCopy), `The developer coding judgement choice must have localized 15-minute copy: ${localizedCopy}`);
  }
}

console.log(`Validated resource-search AND semantics (${pythonDeploymentResults.length} Python/deployment results; ${vectorDatabaseResults.length} vector-database results).`);
