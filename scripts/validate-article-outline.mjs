import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { extractArticleOutline } from '../lib/article-outline.ts';
import { splitTrailingRelatedLinks } from '../lib/article-trailing-links.ts';

const root = process.cwd();
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const sample = [
  '## An **answer** with [a link](https://example.com)',
  '### A child section',
  '```text',
  '## This is an example, not a destination',
  '```',
  '## An **answer** with [a link](https://example.com)',
  '## Deliberate anchor {#fixed-anchor}',
].join('\n');

assert.deepEqual(extractArticleOutline(sample), [
  { level: 2, text: 'An answer with a link', id: 'an-answer-with-a-link' },
  { level: 3, text: 'A child section', id: 'a-child-section' },
  { level: 2, text: 'An answer with a link', id: 'an-answer-with-a-link-2' },
  { level: 2, text: 'Deliberate anchor', id: 'fixed-anchor' },
]);

const denseInternalTail = [
  'Keep this conclusion visible.',
  '',
  '延伸閱讀：[第一份指南](/zh-Hant/articles/first)、[第二份指南](/zh-Hant/articles/second)，以及[第三份指南](/zh-Hant/articles/third)。',
].join('\n');
assert.deepEqual(splitTrailingRelatedLinks(denseInternalTail), {
  main: 'Keep this conclusion visible.',
  links: '延伸閱讀：[第一份指南](/zh-Hant/articles/first)、[第二份指南](/zh-Hant/articles/second)，以及[第三份指南](/zh-Hant/articles/third)。',
});

const headedInternalTail = [
  'Keep this conclusion visible.',
  '',
  '## Further reading',
  '',
  'Start with [one](/en/articles/one), then [two](/en/articles/two).',
].join('\n');
assert.deepEqual(splitTrailingRelatedLinks(headedInternalTail), {
  main: 'Keep this conclusion visible.',
  links: 'Start with [one](/en/articles/one), then [two](/en/articles/two).',
});

const externalSourceTail = '延伸閱讀：[內部指南](/zh-Hant/articles/first) 和 [原始來源](https://example.com/source)。';
assert.deepEqual(splitTrailingRelatedLinks(externalSourceTail), { main: externalSourceTail });

const explanatoryConclusion = '這個結論會在延伸閱讀中再被檢查：[第一份指南](/zh-Hant/articles/first)、[第二份指南](/zh-Hant/articles/second)。';
assert.deepEqual(splitTrailingRelatedLinks(explanatoryConclusion), { main: explanatoryConclusion });

let checked = 0;
for (const entry of fs.readdirSync(path.join(root, 'content', 'articles'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  for (const locale of locales) {
    const file = path.join(root, 'content', 'articles', entry.name, `${locale}.mdx`);
    if (!fs.existsSync(file)) continue;
    const outline = extractArticleOutline(fs.readFileSync(file, 'utf8'));
    const ids = new Set(outline.map(item => item.id));
    assert.equal(ids.size, outline.length, `${entry.name}/${locale}: duplicate outline IDs`);
    for (const item of outline) {
      assert.ok(item.text.trim(), `${entry.name}/${locale}: blank outline label`);
      assert.match(item.id, /\S/, `${entry.name}/${locale}: blank outline ID`);
    }
    checked += 1;
  }
}

const articlePage = fs.readFileSync(path.join(root, 'app', '[lang]', 'articles', '[slug]', 'page.tsx'), 'utf8');
assert.match(articlePage, /extractArticleOutline\(outlineBody\)/, 'article pages must derive their visible outline on the server');
assert.match(articlePage, /aria-label=\{outlineCopy\[lang\]\.label\}/, 'article outline needs an accessible label');
assert.match(articlePage, /createArticleLearningContract\(\{[\s\S]*?body,[\s\S]*?locale: lang,[\s\S]*?roadmapContext: articleRoadmapContext,[\s\S]*?\}\)/, 'article pages must resolve the learning contract from the localized body and article roadmap context');
assert.match(articlePage, /<ArticleLearningContract contract=\{learningContract\} locale=\{lang\} \/>/, 'article pages must render the localized learning contract');
assert.match(articlePage, /splitTrailingRelatedLinks\(body\)/, 'article pages must move only recognised trailing internal reading lists out of the main body');
assert.match(articlePage, /article-mentioned-links/, 'article pages must preserve moved links in optional, accessible UI');
assert.doesNotMatch(articlePage, /localizedObjectiveFallback|visibleLearningObjectives/, 'generic translated objectives must not be presented as article-specific metadata');

const technicalConceptPath = fs.readFileSync(path.join(root, 'components', 'technical-concept-path.tsx'), 'utf8');
assert.match(technicalConceptPath, /technical-concept-audience/, 'technical entry must name its intended learner');
assert.match(technicalConceptPath, /technical-concept-bridge/, 'technical entry must define its specialist terms in plain language');
assert.match(technicalConceptPath, /ai-engineering-shared-language/, 'technical entry must link readers to foundational terminology');

console.log(`Validated article outlines across ${checked} localized article bodies.`);
