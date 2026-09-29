import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const metadataHelper = read('lib/site-metadata.ts');
assert.match(metadataHelper, /const defaultLocale: Locale = 'zh-Hant'/);
assert.match(metadataHelper, /url: '\/ai-dog\.png'/);
assert.match(metadataHelper, /width: 1254/);
assert.match(metadataHelper, /height: 1254/);
assert.match(metadataHelper, /twitter:/);
assert.match(metadataHelper, /'x-default': localizedPath\(defaultLocale\)/);

const localizedPageFiles = [
  'app/[lang]/page.tsx',
  'app/[lang]/about/page.tsx',
  'app/[lang]/articles/[slug]/page.tsx',
  'app/[lang]/categories/[category]/page.tsx',
  'app/[lang]/coding-starter-lab/page.tsx',
  'app/[lang]/interview-lab/page.tsx',
  'app/[lang]/interview-lab/[topic]/page.tsx',
  'app/[lang]/labs/page.tsx',
  'app/[lang]/learning-evidence-planner/page.tsx',
  'app/[lang]/no-code-starter-lab/page.tsx',
  'app/[lang]/portfolio-evidence-planner/page.tsx',
  'app/[lang]/privacy/page.tsx',
  'app/[lang]/resources/page.tsx',
  'app/[lang]/series/[series]/page.tsx',
  'app/[lang]/support/page.tsx'
];

for (const pageFile of localizedPageFiles) {
  const source = read(pageFile);
  assert.match(source, /localizedAlternates\(/, `${pageFile} must emit canonical and language alternates through the shared helper.`);
  assert.match(source, /pageSocialMetadata\(/, `${pageFile} must emit a localized static social card.`);
}

const home = read('app/[lang]/page.tsx');
assert.match(home, /const description=ui\[lang\]\.intro as string/);
assert.doesNotMatch(home, /'x-default':'\/'/);
assert.match(home, /quickHref: `\/\$\{lang\}\/no-code-starter-lab#no-code-lab-manual-title`/);
assert.match(home, /coding: \{[\s\S]*quickHref: `\/\$\{lang\}\/coding-starter-lab#coding-starter-lab-quick-title`/);
assert.match(home, /technical: \{[\s\S]*quickHref: `\/\$\{lang\}\/articles\/inference-memory-scheduling-and-serving-engines#inference-request-path-lab-title`/);
assert.match(home, /const firstInterviewTopic = interviewEnabled \? getReleaseScopedInterviewTopics\(\)\[0\] : undefined;/);
assert.match(home, /interview: \{[\s\S]*quickHref: firstInterviewTopic \? `\/\$\{lang\}\/interview-lab\/\$\{firstInterviewTopic\.slug\}` : `\/\$\{lang\}\/interview-lab`/);
assert.match(home, /labs: `\/\$\{lang\}\/labs\?case=coding-starter#lab-case-selector-title`/);
assert.match(home, /copy=\{learnerStartDiagnosticCopy\[lang\]\}/);
assert.match(home, /<RoadmapPreview locale=\{lang\} roadmap=\{roadmap\} actionHref=\{roadmapHref\} \/>/);
assert.doesNotMatch(home, /<RoadmapTimeline/, 'The homepage must not duplicate the full 19-stage roadmap.');

const learnerDiagnostic = read('components/learner-start-diagnostic.tsx');
assert.match(learnerDiagnostic, /time === 'quick'\s*\? coding === 'comfortable'\s*\? \['technical', 'resources', 'roadmap'\]/);
assert.match(learnerDiagnostic, /time === 'quick'[\s\S]*\['portfolio', 'noCode', 'coding', 'resources'\]/);
assert.match(learnerDiagnostic, /target\.quickHref/);
const learnerDiagnosticCopy = read('lib/learner-start-diagnostic-copy.ts');
assert.match(learnerDiagnosticCopy, /quickRecommendations/);
assert.match(learnerDiagnosticCopy, /Use 15 minutes to judge two Coder Starter cases/);
assert.match(learnerDiagnosticCopy, /Start the 15-minute case judgment/);
assert.match(learnerDiagnosticCopy, /Use 15 minutes on one interview question/);
assert.match(learnerDiagnostic, /recommendationCopy\.action \?\? copy\.startAction/);

const siteShell = read('components/site.tsx');
assert.match(siteShell, /hasLearnerStart \? '#learner-start' : '#start-here'/);

const labsPage = read('app/[lang]/labs/page.tsx');
assert.match(labsPage, /initialCaseId=\{initialCaseId\}/);
const labSelector = read('components/build-lab-case-selector.tsx');
assert.match(labSelector, /initialCaseId && availableCaseIds\.includes\(initialCaseId\)/);
assert.match(labSelector, /useState<BuildLabCaseId \| undefined>/);
assert.match(labSelector, /value=\{caseId \?\? ''\}/);
assert.match(labSelector, /copy\.selectionPlaceholder/);
assert.match(labSelector, /copy\.emptySelection\.noCodeAction/);
assert.match(labSelector, /copy\.emptySelection\.codingAction/);
assert.doesNotMatch(labSelector, /availableCaseIds\[0\]/, 'Direct Lab visits must not silently select the first available case.');
assert.match(labSelector, /codingStarterNextStep: CodingStarterNextStepCopy/);
assert.doesNotMatch(labSelector, /buildLabCaseSelectorCopy/, 'The client selector must not bundle every locale of Lab copy.');
assert.match(labsPage, /copy=\{buildLabCaseSelectorCopy\[lang\]\}/);
assert.match(labsPage, /metaCopy=\{buildLabCaseSelectorMetaCopy\[lang\]\}/);
assert.match(labsPage, /codingStarterNextStep=\{codingStarterNextStepCopy\[lang\]\}/);
assert.match(labSelector, /starter=\$\{caseId\}\$\{caseId === 'coding-starter' \? '#portfolio-capstone' : ''\}/);
assert.match(labSelector, /buildLabCaseSelectionHref\(/);
assert.match(labSelector, /router\.replace\(nextHref, \{ scroll: false \}\)/);
assert.match(labSelector, /aidog:url-state-change/);

const workflowSeries = read('app/[lang]/series/[series]/page.tsx');
assert.match(workflowSeries, /Start the 15-minute manual check \(no sign-in\)/);
assert.match(workflowSeries, /Start the 15-minute case judgment \(no code yet\)/);
assert.match(workflowSeries, /\/coding-starter-lab#coding-starter-lab-quick-title/);
assert.match(workflowSeries, /className="button primary" href=\{`\/\$\{lang\}\$\{route\.labHref\}`\}/, 'Each AI-use route must make its timed Lab start the primary action.');
assert.match(workflowSeries, /Read the coding-partner route for context/);

const codingStarter = read('components/coding-starter-lab.tsx');
const codingStarterPage = read('app/[lang]/coding-starter-lab/page.tsx');
assert.match(codingStarterPage, /\?starter=coding-starter#portfolio-capstone/);
assert.match(codingStarter, /portfolioHref \? <Link/);
const noCodeStarter = read('components/no-code-starter-lab.tsx');
const noCodeStarterPage = read('app/[lang]/no-code-starter-lab/page.tsx');
assert.match(noCodeStarterPage, /\?starter=no-code#portfolio-capstone/);
assert.match(noCodeStarter, /portfolioHref \? <Link/);

const portfolioPage = read('app/[lang]/portfolio-evidence-planner/page.tsx');
assert.match(portfolioPage, /canReadWorkedExamples=\{!scopedRelease\}/);
assert.match(portfolioPage, /initialShape=\{starterCaseId \? starterShape\[starterCaseId\] : undefined\}/);
assert.match(portfolioPage, /runnableHref=\{runnableHref\}/);
assert.match(portfolioPage, /'coding-starter': 'approval'/);
assert.match(portfolioPage, /<details className="portfolio-reference-disclosure">/);

const resourcesPage = read('app/[lang]/resources/page.tsx');
assert.match(resourcesPage, /const RESOURCE_PAGE_SIZE = 12;/);
assert.match(resourcesPage, /Math\.ceil\(matchingArticles\.length \/ RESOURCE_PAGE_SIZE\)/);
assert.match(resourcesPage, /matchingArticles\.slice\(firstArticleIndex, firstArticleIndex \+ RESOURCE_PAGE_SIZE\)/);
assert.match(resourcesPage, /pageSize=\{RESOURCE_PAGE_SIZE\}/);

const resourceSearch = read('components/search.tsx');
assert.match(resourceSearch, /pageSize: number/);
assert.match(resourceSearch, /\(currentPage - 1\) \* pageSize \+ 1/);
assert.match(resourceSearch, /if \(filters\.query\) params\.set\('q', filters\.query\)/);
assert.match(resourceSearch, /if \(filters\.type !== 'all'\) params\.set\('type', filters\.type\)/);
assert.match(resourceSearch, /if \(filters\.category !== 'all'\) params\.set\('category', filters\.category\)/);
assert.match(resourceSearch, /if \(filters\.freshness !== 'all'\) params\.set\('freshness', filters\.freshness\)/);
assert.match(resourceSearch, /if \(filters\.audience !== 'all'\) params\.set\('audience', filters\.audience\)/);
assert.match(resourceSearch, /if \(filters\.effort !== 'all'\) params\.set\('effort', filters\.effort\)/);
assert.match(resourceSearch, /if \(page > 1\) params\.set\('page', String\(page\)\)/);
assert.match(resourceSearch, /aria-current=\{page===currentPage\?'page':undefined\}/);

const interviewQuestion = read('app/[lang]/interview-lab/[topic]/page.tsx');
assert.match(interviewQuestion, /const description = `\$\{topic\.title\[lang\]\}/);

const downloads = read('app/[lang]/downloads/[resourceId]/page.tsx');
assert.match(downloads, /robots: \{ index: false, follow: true \}/);

const sitemap = read('app/sitemap.ts');
assert.match(sitemap, /CATEGORY_IDS/);
assert.match(sitemap, /alternates: \{ languages: localizedUrls\(origin, suffix\) \}/);
assert.match(sitemap, /'x-default': `\$\{origin\}\/zh-Hant\$\{suffix\}`/);

const types = read('lib/types.ts');
assert.match(types, /export const LOCALES = \['zh-Hant', 'zh-Hans', 'en'\] as const;/);

const proxy = read('proxy.ts');
assert.match(proxy, /NextResponse\.redirect\(redirectUrl, 308\)/);
assert.match(proxy, /\/zh-Hant/);

const localeSwitch = read('components/locale-switch.tsx');
assert.match(localeSwitch, /'zh-Hant': '選擇語言'/);
assert.doesNotMatch(localeSwitch, /'zh-HK':|'zh-TW':/);
assert.match(localeSwitch, /usePathname, useSearchParams/);
assert.match(localeSwitch, /const search = searchParams\.toString\(\);/);
assert.match(localeSwitch, /const locationSuffix = `\$\{searchSuffix\}\$\{locationHash\}`;/);
assert.match(localeSwitch, /window\.requestAnimationFrame\(syncLocationHash\)/);

const robots = read('app/robots.ts');
assert.match(robots, /const allowPublicIndexing = process\.env\.OWNER_PUBLICATION_APPROVED === 'true';/);
assert.match(robots, /allowPublicIndexing \? \{ sitemap: `\$\{origin\}\/sitemap\.xml` \} : \{\}/);

const rss = read('app/rss.xml/route.ts');
assert.match(rss, /guid isPermaLink="false"/);
assert.match(rss, /xmlns:atom=/);
assert.match(rss, /atom:link href=/);
assert.match(rss, /function cdata/);

console.log(`Validated discoverability contract across ${localizedPageFiles.length} localized page families.`);
