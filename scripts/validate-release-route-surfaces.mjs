import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function fail(message) {
  throw new Error(`Release route surfaces: ${message}`);
}

const guardedPages = [
  ['app/[lang]/page.tsx', 'home'],
  ['app/[lang]/about/page.tsx', 'about'],
  ['app/[lang]/privacy/page.tsx', 'privacy'],
  ['app/[lang]/resources/page.tsx', 'resources'],
  ['app/[lang]/categories/[category]/page.tsx', 'categories'],
  ['app/[lang]/articles/[slug]/page.tsx', 'article-downloads'],
  ['app/[lang]/downloads/[resourceId]/page.tsx', 'article-downloads'],
  ['app/[lang]/series/[series]/page.tsx', 'series'],
  ['app/[lang]/interview-lab/page.tsx', 'interview-lab'],
  ['app/[lang]/interview-lab/[topic]/page.tsx', 'interview-lab'],
  ['app/[lang]/labs/page.tsx', 'labs'],
  ['app/[lang]/portfolio-evidence-planner/page.tsx', 'portfolio-evidence-planner'],
  ['app/[lang]/learning-evidence-planner/page.tsx', 'learning-evidence-planner'],
  ['app/[lang]/no-code-starter-lab/page.tsx', 'no-code-starter-lab'],
  ['app/[lang]/coding-starter-lab/page.tsx', 'coding-starter-lab'],
  ['app/[lang]/support/page.tsx', 'support'],
];

for (const [relativePath, surface] of guardedPages) {
  const text = source(relativePath);
  if (!text.includes(`isRouteSurfaceEnabledInCurrentBuild('${surface}')`)) {
    fail(`${relativePath} must reject a scoped build without ${surface}.`);
  }
}

for (const [relativePath, required] of [
  ['app/sitemap.ts', 'isRouteSurfaceEnabledInCurrentBuild'],
  ['app/rss.xml/route.ts', "isRouteSurfaceEnabledInCurrentBuild('rss')"],
  ['components/site.tsx', '.filter(link => isRouteSurfaceEnabledInCurrentBuild(link.surface))'],
  ['components/support-nudge.tsx', "isRouteSurfaceEnabledInCurrentBuild('support')"],
  ['components/reader-journey-links.tsx', 'function isJourneyHrefEnabled'],
  ['lib/release-server-scope.ts', "import 'server-only';"],
  ['app/api/interview-practice-topics/route.ts', "isRouteSurfaceEnabledInCurrentBuild('interview-lab')"],
]) {
  if (!source(relativePath).includes(required)) {
    fail(`${relativePath} is missing scoped-release contract ${required}.`);
  }
}

const siteHeader = source('components/site.tsx');
for (const required of [
  "import { getReleaseScopedRoadmap } from '@/lib/release-learning-content';",
  "const roadmapRoute = isRouteSurfaceEnabledInCurrentBuild('series')",
  "isSeriesEnabledInCurrentBuild('ai-engineer-roadmap')",
  "isSeriesEnabledInCurrentBuild('ai-use-routes')",
  "getReleaseScopedRoadmap()?.stages.some(stage => stage.number === '00')",
  "'#roadmap-stage-00'",
  '...(roadmapRoute ? [{ ...roadmapRoute, label: navCopy.learningMap }] : []),',
]) {
  if (!siteHeader.includes(required)) {
    fail('Header must retain the Learning map link through the homepage when a scoped release has roadmap stage 00 but no series surface.');
  }
}

const landingPage = source('app/[lang]/page.tsx');
for (const required of [
  "import { LearnerStartDiagnostic, type LearnerStartRoutes } from '@/components/learner-start-diagnostic';",
  "import { learnerStartDiagnosticCopy } from '@/lib/learner-start-diagnostic-copy';",
  "const noCodeEnabled = isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab');",
  "const codingEnabled = isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab');",
  "const roadmapEnabled = isSeriesEnabledInCurrentBuild('ai-engineer-roadmap');",
  "const workflowSeriesEnabled = isSeriesEnabledInCurrentBuild('ai-use-routes');",
  'const learnerStartRoutes: LearnerStartRoutes = {',
  'const scopedRelease = isScopedReleaseBuild();',
  '<LearnerStartDiagnostic locale={lang} copy={learnerStartDiagnosticCopy[lang]} routes={learnerStartRoutes} />',
  '<RoadmapPreview locale={lang} roadmap={roadmap} actionHref={roadmapHref} />',
  'no-code-starter-lab#no-code-lab-setup-title',
  'coding-starter-lab',
  'series/ai-engineer-roadmap#roadmap-stage-00',
]) {
  if (!landingPage.includes(required)) {
    fail('the landing must retain the three-question learner start, exact-series guards, and direct non-developer and developer routes.');
  }
}
if (landingPage.includes('<LandingRoadmapNavigation') || landingPage.includes('<RoadmapTimeline')) {
  fail('the landing must use the route-scoped compact roadmap preview instead of embedding a second full roadmap.');
}

const livePracticeLoader = source('components/interview-live-practice-loader.tsx');
if (livePracticeLoader.includes("@/lib/interview-lab") || !livePracticeLoader.includes('/api/interview-practice-topics?locale=')) {
  fail('the browser rehearsal loader must request the scoped projection instead of bundling the question library.');
}

const interviewLabPage = source('app/[lang]/interview-lab/page.tsx');
for (const required of [
  "import { canonicalLocaleRecord } from '@/lib/types';",
  'const routeFirstCopy: Record<Locale,',
  'const navigation = routeFirstCopy[lang];',
]) {
  if (!interviewLabPage.includes(required)) {
    fail('Interview Lab must provide route-navigation copy for every public locale.');
  }
}

const roadmapSeriesPage = source('app/[lang]/series/[series]/page.tsx');
for (const required of [
  "import { EarlyAiLearningRoute } from '@/components/early-ai-learning-route';",
  "import { LearningRouteSwitcher, type LearningRouteSwitcherCopy } from '@/components/learning-route-switcher';",
  '<LearningRouteSwitcher',
  '<EarlyAiLearningRoute locale={lang} />',
  'learning-route-engineer__actions',
  'getReleaseScopedSeries()',
  'isSeriesEnabledInCurrentBuild(seriesId)',
  'const roadmap = isRoadmap ? getReleaseScopedRoadmap() : null;',
  '<RoadmapTimeline',
  'selectedPhaseId={phaseParam}',
  'phaseBaseHref={`/${lang}/series/ai-engineer-roadmap`}',
]) {
  if (!roadmapSeriesPage.includes(required)) {
    fail('the Learning map must keep an accessible AI-starter route and an AI Engineer route.');
  }
}

const sitemap = source('app/sitemap.ts');
if (!sitemap.includes('getReleaseScopedSeries()')) {
  fail('the sitemap must enumerate only series selected for the current build.');
}

for (const [relativePath, requiredTokens] of [
  ['app/[lang]/articles/[slug]/page.tsx', [
    "isReleaseAssetEnabledInCurrentBuild('downloads', asset.path)",
    'staticAssetLocale(lang)',
  ]],
  ['app/[lang]/downloads/[resourceId]/page.tsx', [
    "isReleaseAssetEnabledInCurrentBuild('downloads', asset.path)",
    'staticAssetLocale(lang)',
  ]],
  ['app/[lang]/portfolio-evidence-planner/page.tsx', [
    'const scopedRelease = isScopedReleaseBuild();',
    '!scopedRelease ? <details className="portfolio-reference-disclosure">',
    '<PortfolioWorkedExamples locale={lang} />',
    '<PortfolioEvidenceHandoffCard locale={lang} />',
    'runnableHref={runnableHref}',
    "isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab')",
    "isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab')",
  ]],
  ['app/[lang]/no-code-starter-lab/page.tsx', [
    "isReleaseAssetEnabledInCurrentBuild('templates', sourcePackPath)",
    "getArticle('approval-queue-low-code-portfolio')",
    "isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner')",
    'sourcePackHref=',
    'handoffArticleHref=',
    'portfolioHref=',
  ]],
  ['app/[lang]/coding-starter-lab/page.tsx', [
    "getArticle('use-ai-as-a-coding-partner-with-proof')",
    "isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner')",
    'handoffArticleHref=',
    'portfolioHref=',
  ]],
]) {
  const text = source(relativePath);
  for (const required of requiredTokens) {
    if (!text.includes(required)) {
      fail(`${relativePath} must keep the exact-asset or scoped-portfolio guard ${required}.`);
    }
  }
}

console.log(`Validated scoped route guards, navigation filtering, sitemap/RSS filtering, and on-demand rehearsal projection across ${guardedPages.length} page families.`);
