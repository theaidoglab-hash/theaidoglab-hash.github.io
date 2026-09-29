import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleId = 'flagship-portfolio-architecture';
const expectedSlug = 'build-one-flagship-ai-portfolio-project';
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const rowMarkers = {
  'zh-HK': ['01 · 小決定', '02 · 資料界線', '03 · 簡單起點', '04 · 固定情境', '05 · 停低和回退', '06 · 交代給下一個人'],
  'zh-TW': ['01 · 小決策', '02 · 資料邊界', '03 · 簡單起點', '04 · 固定情境', '05 · 停止與回退', '06 · 交代給下一個人'],
  'zh-Hans': ['01 · 小决定', '02 · 数据边界', '03 · 简单起点', '04 · 固定情境', '05 · 停止与回退', '06 · 交代给下一个人'],
  en: ['01 · Small decision', '02 · Data boundary', '03 · Simple starting point', '04 · Fixed situations', '05 · Stop and return', '06 · Hand-off map']
};
const tableHeaders = {
  'zh-HK': ['留下甚麼 artefact', '別人怎樣核對', '這格不可以聲稱甚麼'],
  'zh-TW': ['留下什麼 artefact', '別人怎麼檢查', '這格不能聲稱什麼'],
  'zh-Hans': ['留下什么 artefact', '别人怎样检查', '这格不能声称什么'],
  en: ['Artefact to leave behind', 'What a reviewer can check', 'What this row does not establish']
};
const secondProjectSignals = {
  'zh-HK': ['第二個 project', '另一個決定', '另一種會出事的方法'],
  'zh-TW': ['第二個 project', '另一個決策', '另一種失敗方式'],
  'zh-Hans': ['第二个 project', '另一个决定', '另一种失败方式'],
  en: ['second project', 'different decision', 'fail in a different way']
};
const boundarySignals = {
  'zh-HK': ['本機', '不會建立 GitHub repository'],
  'zh-TW': ['本機', '不會建立 GitHub repository'],
  'zh-Hans': ['本地', '不会建立 GitHub repository'],
  en: ['local', 'does not create a GitHub repository']
};
const entryPointSignals = {
  'zh-HK': ['先集中一個主力案例', '未開第二個 project 前，先砌好呢六格', '閱讀主力案例指南', '下載六格工作紙'],
  'zh-TW': ['先集中一個主力案例', '還沒開始第二個 project 前，先完成這六格', '閱讀主力案例指南', '下載六格工作表'],
  'zh-Hans': ['先集中一个主力案例', '开始第二个 project 前，先完成这六格', '阅读主力案例指南', '下载六格工作表'],
  en: ['FOCUS ONE FLAGSHIP CASE', 'Finish these six rows before opening a second project', 'Read the flagship-case guide', 'Download the six-row worksheet']
};

function fail(message) {
  throw new Error(`Flagship portfolio architecture validation failed: ${message}`);
}

const articles = JSON.parse(fs.readFileSync(path.join(root, 'content', 'articles.json'), 'utf8'));
const article = articles.find(candidate => candidate.id === articleId);
if (!article) fail(`missing ${articleId} metadata.`);
if (article.slug !== expectedSlug) fail('unexpected article slug.');
if (article.categoryId !== 'portfolio-evidence' || article.type !== 'tutorial') fail('article must remain a portfolio-evidence tutorial.');
if (!Array.isArray(article.relatedArticleSlugs) || article.relatedArticleSlugs.length < 5) fail('article must retain its local reading map.');

const workedExamplesSource = fs.readFileSync(path.join(root, 'components', 'portfolio-worked-examples.tsx'), 'utf8');
if (/^['\"]use client['\"]/m.test(workedExamplesSource)) fail('portfolio journey entry point must remain server-rendered.');
if (!workedExamplesSource.includes("getArticle('build-one-flagship-ai-portfolio-project')")) fail('portfolio journey entry point must resolve the flagship guide through the scoped article lookup.');
if (!workedExamplesSource.includes('articlePath(article, locale)')) fail('portfolio journey entry point must use the localized article path.');
if (!workedExamplesSource.includes('`/downloads/flagship-portfolio-architecture/v1/${staticAssetLocale(locale)}.pdf`')) fail('portfolio journey entry point must retain the localized worksheet download through the canonical asset-locale mapping.');
if (!workedExamplesSource.includes("import { canonicalLocaleRecord, staticAssetHref, staticAssetLocale } from '@/lib/types';")) fail('portfolio journey entry point must use the shared static-asset locale mapping.');
if (!workedExamplesSource.includes('download aria-describedby={boundaryId}')) fail('portfolio journey entry point must connect the worksheet download to its boundary.');
const entryPointIndex = workedExamplesSource.indexOf('<PortfolioFlagshipGuide locale={locale} />');
const starterIndex = workedExamplesSource.indexOf('<PortfolioStarterIndex locale={locale} />');
if (entryPointIndex < 0 || starterIndex < 0 || entryPointIndex > starterIndex) fail('portfolio journey entry point must appear before the starter index, outside collapsed examples.');
for (const locale of locales) {
  for (const signal of entryPointSignals[locale]) {
    if (!workedExamplesSource.includes(signal)) fail(`${locale} is missing localized flagship journey entry copy ${signal}.`);
  }
}

for (const slug of [
  'renewal-triage-mlops',
  'enterprise-ai-portfolio-policy-pilot',
  'build-a-github-portfolio-proof-pack',
  'score-an-ai-portfolio-by-evidence-not-fluency',
  'turn-an-ai-course-project-into-portfolio-evidence'
]) {
  if (!article.relatedArticleSlugs.includes(slug)) fail(`related reading is missing ${slug}.`);
}

for (const locale of locales) {
  const file = path.join(root, 'content', 'articles', articleId, `${locale}.mdx`);
  if (!fs.existsSync(file)) fail(`missing ${locale} article.`);
  const source = fs.readFileSync(file, 'utf8');

  for (const marker of rowMarkers[locale]) {
    if (!source.includes(`| ${marker} |`)) fail(`${locale} is missing evidence row ${marker}.`);
  }
  for (const header of tableHeaders[locale]) {
    if (!source.includes(header)) fail(`${locale} is missing the artefact/check/nonclaim table heading ${header}.`);
  }
  for (const signal of secondProjectSignals[locale]) {
    if (!source.includes(signal)) fail(`${locale} is missing the second-project selection rule ${signal}.`);
  }
  for (const signal of boundarySignals[locale]) {
    if (!source.includes(signal)) fail(`${locale} is missing its local-learning boundary ${signal}.`);
  }
  for (const href of [
    `/${locale}/portfolio-evidence-planner`,
    `/${locale}/articles/renewal-triage-mlops`,
    `/${locale}/labs#build-lab-kit-renewal-triage-mlops`,
    `/${locale}/articles/build-a-github-portfolio-proof-pack`,
    `/${locale}/interview-lab`
  ]) {
    if (!source.includes(href)) fail(`${locale} is missing required internal link ${href}.`);
  }
  if (/https?:\/\/github\.com/i.test(source)) fail(`${locale} must not invent a public repository link.`);

  const downloadBase = path.join(root, 'public', 'downloads', articleId, 'v1', locale);
  for (const extension of ['md', 'pdf']) {
    const filePath = `${downloadBase}.${extension}`;
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) fail(`missing ${locale} ${extension} worksheet.`);
  }
  const worksheet = fs.readFileSync(`${downloadBase}.md`, 'utf8');
  const promptCount = (worksheet.match(/^## \d{2} · /gm) ?? []).length;
  if (promptCount !== 6) fail(`${locale} worksheet must retain six prompts, found ${promptCount}.`);
}

console.log('Validated flagship portfolio architecture: six evidence rows, second-project rule, local boundaries, localized portfolio-journey entry point, internal routes, and worksheets.');
