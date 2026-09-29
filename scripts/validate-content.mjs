import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const locales = ['zh-HK', 'zh-TW', 'zh-Hans', 'en'];
const interviewScopeHeading = {
  'zh-HK': '範圍說明',
  'zh-TW': '範圍說明',
  'zh-Hans': '范围说明',
  en: 'Scope note'
};
const categories = new Set([
  'ai-engineering-interviews',
  'ai-engineering-foundations',
  'ai-engineering-career',
  'roles-pathways',
  'portfolio-evidence',
  'professional-workflows',
  'low-code-ai-builders',
  'ai-for-coders',
  'resources-opportunities'
]);
const banned = ['僅限內部草稿', 'source_notes', 'qualified_pain', 'method_intent', 'owner_approved'];
const articles = JSON.parse(fs.readFileSync(path.join(root, 'content', 'articles.json'), 'utf8'));
const publicCategoryOverrides = JSON.parse(fs.readFileSync(path.join(root, 'content', 'public-category-overrides.json'), 'utf8'));
const publicCategories = new Set([
  'ai-engineering-interviews',
  'ai-engineering-foundations',
  'ai-engineering-career',
  'portfolio-evidence',
  'professional-workflows',
  'low-code-ai-builders',
  'ai-for-coders',
  'resources-opportunities'
]);
const articleSlugSet = new Set(articles.map(article => article.slug));
const legacyRedirectArticleSlugs = new Set(['ai-engineer-interview-practice-cards']);
const labs = JSON.parse(fs.readFileSync(path.join(root, 'content', 'labs.json'), 'utf8'));
const readerPaths = JSON.parse(fs.readFileSync(path.join(root, 'content', 'reader-paths.json'), 'utf8'));
const aiEngineerRoadmap = JSON.parse(fs.readFileSync(path.join(root, 'content', 'roadmaps', 'ai-engineer-roadmap.json'), 'utf8'));
const aiEngineerStageCompletion = JSON.parse(fs.readFileSync(path.join(root, 'content', 'roadmaps', 'ai-engineer-stage-completion.json'), 'utf8'));
const aiEngineerInterviewPrep = JSON.parse(fs.readFileSync(path.join(root, 'content', 'roadmaps', 'ai-engineer-interview-prep.json'), 'utf8'));
const interviewQuestionMetadata = JSON.parse(fs.readFileSync(path.join(root, 'content', 'interview-question-metadata.json'), 'utf8'));
const interviewPracticePaths = JSON.parse(fs.readFileSync(path.join(root, 'content', 'interview-practice-paths.json'), 'utf8'));
const interviewPracticeContinuations = JSON.parse(fs.readFileSync(path.join(root, 'content', 'interview-practice-continuations.json'), 'utf8'));
const interviewLabSource = fs.readFileSync(path.join(root, 'lib', 'interview-lab.ts'), 'utf8');
const interviewQuestionContentSource = fs.readFileSync(path.join(root, 'lib', 'interview-question-content.ts'), 'utf8');
const interviewLabPageSource = fs.readFileSync(path.join(root, 'app', '[lang]', 'interview-lab', 'page.tsx'), 'utf8');
const interviewQuestionPageSource = fs.readFileSync(path.join(root, 'app', '[lang]', 'interview-lab', '[topic]', 'page.tsx'), 'utf8');
const interviewPracticePathsSource = fs.readFileSync(path.join(root, 'components', 'interview-practice-paths.tsx'), 'utf8');
const interviewAfterDemoPathsSource = fs.readFileSync(path.join(root, 'components', 'interview-after-demo-paths.tsx'), 'utf8');
const interviewPracticeContinuationsSource = fs.readFileSync(path.join(root, 'lib', 'interview-practice-continuations.ts'), 'utf8');
const fragmentAnchorScrollSource = fs.readFileSync(path.join(root, 'components', 'fragment-anchor-scroll.tsx'), 'utf8');
const roadmapTimelineSource = fs.readFileSync(path.join(root, 'components', 'roadmap-timeline.tsx'), 'utf8');
const roadmapsSource = fs.readFileSync(path.join(root, 'lib', 'roadmaps.ts'), 'utf8');
const labsPageSource = fs.readFileSync(path.join(root, 'app', '[lang]', 'labs', 'page.tsx'), 'utf8');
const portfolioEvidencePlannerSource = fs.readFileSync(path.join(root, 'components', 'portfolio-evidence-planner.tsx'), 'utf8');
const interviewQuestionSlugs = new Set(Array.from(interviewLabSource.matchAll(/\bslug:\s*['\"]([^'\"]+)['\"]/g), match => match[1]));
const portfolioEvidencePlannerAnchors = new Set(Array.from(portfolioEvidencePlannerSource.matchAll(/\bid=(['\"])([a-z0-9-]+)\1/g), match => match[2]));
const interviewCapabilityGroupSection = interviewLabSource.slice(interviewLabSource.indexOf('export const interviewCapabilityGroups'));
const interviewCapabilityGroupCount = Array.from(interviewCapabilityGroupSection.matchAll(/^\s{4}id:\s*['\"][^'\"]+['\"]/gm)).length;
const interviewQuestionContentRoot = path.join(root, 'content', 'interview-questions');
const standaloneQuestionContentFiles = new Map(Array.from(
  interviewLabSource.matchAll(/\bslug:\s*['\"]([^'\"]+)['\"],\s*contentFile:\s*['\"]([^'\"]+)['\"]/g),
  match => [match[1], match[2]],
));
const curriculumStatuses = new Set(['review', 'approved']);
const roadmapStatuses = new Set(['available', 'partial', 'planned']);
const roadmapResourceKinds = new Set(['article', 'interview-question', 'interview-prep', 'lab']);
const roadmapInterviewPrepTargets = new Set(['ai-engineer-interview-prep']);
const buildLabWorkflowStepPlan = [
  { stage: '09', id: 'build-lab-output-decision-brief', href: '/labs#build-lab-kit-enterprise-ai-portfolio-policy-pilot', kitArticleSlug: 'enterprise-ai-portfolio-policy-pilot' },
  { stage: '13', id: 'build-lab-output-fixed-cases', href: '/labs#build-lab-kit-enterprise-ai-portfolio-policy-pilot', kitArticleSlug: 'enterprise-ai-portfolio-policy-pilot' },
  { stage: '12', id: 'build-lab-output-deterministic-run-trace', href: '/labs#build-lab-kit-build-a-resumable-ai-batch-worker', kitArticleSlug: 'build-a-resumable-ai-batch-worker' },
  { stage: '16', id: 'build-lab-output-handoff-pilot-boundary', href: '/articles/from-offline-evaluation-to-an-authorised-pilot', articleSlug: 'from-offline-evaluation-to-an-authorised-pilot' },
  { stage: '18', id: 'build-lab-output-readme-evidence-map', href: '/articles/build-a-github-portfolio-proof-pack', articleSlug: 'build-a-github-portfolio-proof-pack' }
];
const roadmapLabTargets = new Map([
  ['coding-starter-lab', new Set()],
  ['build-lab', new Set(buildLabWorkflowStepPlan.map(step => step.id))]
]);
const roadmapPhasePlan = [
  { id: 'foundations', range: '00–07', start: 0, end: 7 },
  { id: 'applications', range: '08–11', start: 8, end: 11 },
  { id: 'production', range: '12–16', start: 12, end: 16 },
  { id: 'career-evidence', range: '17–18', start: 17, end: 18 }
];
const roadmapLearningRoutePlan = [
  { id: 'choose-a-problem', range: '00–07', startStage: '00' },
  { id: 'make-a-workflow-testable', range: '08–11', startStage: '08' },
  { id: 'make-a-demo-reviewable', range: '12–16', startStage: '12' },
  { id: 'package-work-evidence', range: '17–18', startStage: '17' }
];
const roadmapReaderFlowPrimaryPlan = [
  { stageId: 'transformer-mental-model', kind: 'article', target: 'attention-qkv-mask-position' },
  { stageId: 'generation-control', kind: 'article', target: 'decoding-strategies-and-output-policy' },
  { stageId: 'architecture-tradeoffs', kind: 'article', target: 'modern-attention-moe-and-serving-tradeoffs' },
  { stageId: 'model-family-choice', kind: 'article', target: 'language-model-families-and-when-to-use-them' },
  { stageId: 'adaptation-choice', kind: 'article', target: 'adaptation-data-and-alignment-choice' },
  { stageId: 'prompt-context-interface', kind: 'article', target: 'prompt-play-to-professional-evidence' },
  { stageId: 'agents-tools', kind: 'article', target: 'review-an-ai-agent-before-clicking-allow' },
  { stageId: 'evaluation-observability', kind: 'article', target: 'evaluate-an-ai-agent-workflow-not-just-the-final-answer' },
  { stageId: 'safety-security', kind: 'article', target: 'safety-governance-privacy-and-incident-response' },
  { stageId: 'system-delivery', kind: 'article', target: 'from-offline-evaluation-to-an-authorised-pilot' }
];
const seenIds = new Set();
const seenSlugs = new Set();
const bodies = {};
const publicCategoryCounts = new Map(Array.from(publicCategories, category => [category, 0]));

function fail(message) {
  throw new Error(message);
}

function parsePublicGitHubUrl(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail(label + ': invalid URL');
  }
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com') fail(label + ': expected an HTTPS github.com URL');
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length < 2) fail(label + ': expected owner and repository');
  return parsed;
}

function validatePortfolioRepository(article) {
  const project = article.portfolioRepository;
  if (!project) return;
  const repositoryUrl = parsePublicGitHubUrl(project.url, article.id + ': repository');
  if (!project.ref || !/^[A-Za-z0-9._/-]+$/.test(project.ref)) fail(article.id + ': invalid repository ref');
  if (!project.testedCommand?.trim()) fail(article.id + ': missing repository test command');
  if (project.sourceLanguage !== 'en') fail(article.id + ': repository source language must be English');
  if (!project.verifiedAt || Number.isNaN(Date.parse(project.verifiedAt))) fail(article.id + ': invalid repository verification date');
  for (const locale of locales) {
    const readmeUrl = project.readmeUrls?.[locale];
    const parsedReadme = parsePublicGitHubUrl(readmeUrl, article.id + ': missing ' + locale + ' README URL');
    const expectedPrefix = repositoryUrl.pathname.replace(/\/$/, '') + '/blob/' + project.ref + '/';
    if (!parsedReadme.pathname.startsWith(expectedPrefix)) fail(article.id + ': ' + locale + ' README does not match repository ref');
    if (!/\/README(?:\.zh-(?:HK|TW|Hans))?\.md$/.test(parsedReadme.pathname)) fail(article.id + ': invalid ' + locale + ' README filename');
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateDate(value, label) {
  const timestamp = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? Date.parse(value + 'T00:00:00Z')
    : Number.NaN;
  if (Number.isNaN(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    fail(label + ': expected YYYY-MM-DD date');
  }
}

function validateLocalizedText(value, label) {
  if (!isRecord(value)) fail(label + ': expected localized copy object');
  for (const locale of locales) {
    const text = value[locale];
    if (typeof text !== 'string' || !text.trim()) fail(label + ': missing ' + locale + ' copy');
    for (const term of banned) if (text.includes(term)) fail(label + '/' + locale + ': internal marker ' + term);
  }
}

function validateSourceNote(sourceNote, label, expectedReferenceUrl) {
  if (!isRecord(sourceNote)) fail(label + ': missing source note');
  for (const field of ['label', 'text']) validateLocalizedText(sourceNote[field], label + ': sourceNote.' + field);
  for (const locale of locales) {
    if (!sourceNote.text[locale].includes('AI.DOG')) fail(label + '/' + locale + ': source note must identify the AI.DOG editorial boundary');
  }
  if (expectedReferenceUrl) {
    if (!isRecord(sourceNote.reference) || sourceNote.reference.url !== expectedReferenceUrl) fail(label + ': missing approved public reference');
    validateLocalizedText(sourceNote.reference.label, label + ': sourceNote.reference.label');
  } else if (sourceNote.reference !== undefined) {
    fail(label + ': unexpected public reference');
  }
}

function validateCurriculumMetadata(curriculum, label, expectedId, expectedReferenceUrl) {
  if (!isRecord(curriculum)) fail(label + ': expected object');
  if (curriculum.id !== expectedId) fail(label + ': unexpected curriculum id');
  if (!curriculumStatuses.has(curriculum.status) || curriculum.visibility !== 'public') fail(label + ': invalid public curriculum status');
  validateDate(curriculum.updatedAt, label + ': updatedAt');
  validateDate(curriculum.reviewBy, label + ': reviewBy');
  if (curriculum.reviewBy < '2026-09-23') fail(label + ': review expired');
  validateSourceNote(curriculum.sourceNote, label, expectedReferenceUrl);
}

function validateNonEmptyStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) fail(label + ': expected at least one item');
  const seen = new Set();
  for (const item of value) {
    if (typeof item !== 'string' || !item.trim()) fail(label + ': expected non-empty strings');
    if (seen.has(item)) fail(label + ': duplicate item ' + item);
    seen.add(item);
  }
}

function normalizeContractText(value) {
  return value.toLocaleLowerCase('en').replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
}

function validateRoadmapStageCompletion(roadmap, completionByStage) {
  const label = 'ai-engineer-roadmap stage completion';
  if (!isRecord(completionByStage)) fail(label + ': expected a stage-keyed object');

  const expectedStageIds = new Set(roadmap.stages.map(stage => stage.id));
  const actualStageIds = Object.keys(completionByStage);
  if (actualStageIds.length !== expectedStageIds.size) {
    fail(label + ': expected exactly one contract for each of the 19 roadmap stages');
  }
  for (const stageId of actualStageIds) {
    if (!expectedStageIds.has(stageId)) fail(label + ': unknown stage contract ' + stageId);
  }

  const seenCriteria = Object.fromEntries(locales.map(locale => [locale, new Set()]));
  const seenReturnConditions = Object.fromEntries(locales.map(locale => [locale, new Set()]));
  const seenContracts = Object.fromEntries(locales.map(locale => [locale, new Set()]));

  for (const stage of roadmap.stages) {
    const stageLabel = label + ': ' + stage.id;
    const completion = completionByStage[stage.id];
    if (!isRecord(completion)) fail(stageLabel + ': missing completion contract');
    if (!isRecord(completion.criteria)) fail(stageLabel + ': criteria must be localized');
    validateLocalizedText(completion.returnCondition, stageLabel + ' returnCondition');

    for (const locale of locales) {
      const criteria = completion.criteria[locale];
      if (!Array.isArray(criteria) || criteria.length !== 2) {
        fail(stageLabel + '/' + locale + ': expected exactly two observable completion criteria');
      }

      const normalizedEvidence = normalizeContractText(stage.evidence[locale]);
      const normalizedCriteria = criteria.map((criterion, index) => {
        if (typeof criterion !== 'string' || criterion.trim().length < 32) {
          fail(stageLabel + '/' + locale + ': completion criterion ' + (index + 1) + ' is too short to be meaningful');
        }
        const normalized = normalizeContractText(criterion);
        if (normalized === normalizedEvidence) {
          fail(stageLabel + '/' + locale + ': completion criterion must add an observable check beyond the evidence summary');
        }
        if (seenCriteria[locale].has(normalized)) {
          fail(stageLabel + '/' + locale + ': completion criterion duplicates another stage');
        }
        seenCriteria[locale].add(normalized);
        return normalized;
      });

      const returnCondition = completion.returnCondition[locale].trim();
      if (returnCondition.length < 32 || !/^(?:如果|若|if\b)/iu.test(returnCondition)) {
        fail(stageLabel + '/' + locale + ': return condition must state a concrete if/when stop trigger');
      }
      const normalizedReturn = normalizeContractText(returnCondition);
      if (seenReturnConditions[locale].has(normalizedReturn)) {
        fail(stageLabel + '/' + locale + ': return condition duplicates another stage');
      }
      seenReturnConditions[locale].add(normalizedReturn);

      const fingerprint = [...normalizedCriteria, normalizedReturn].join('|');
      if (seenContracts[locale].has(fingerprint)) fail(stageLabel + '/' + locale + ': duplicate lesson contract');
      seenContracts[locale].add(fingerprint);
    }
  }

  for (const marker of [
    "import rawStageCompletion from '@/content/roadmaps/ai-engineer-stage-completion.json'",
    'completion: RoadmapStageCompletionContract',
    'Missing completion contract for roadmap stage',
  ]) {
    if (!roadmapsSource.includes(marker)) fail(label + ': runtime wiring missing ' + marker);
  }
  for (const marker of [
    'contract.completion.criteria[locale]',
    'contract.completion.returnCondition[locale]',
    'stopOrReturn',
    'className="roadmap-phase-disclosure"',
    'suppressHydrationWarning',
  ]) {
    if (!roadmapTimelineSource.includes(marker)) fail(label + ': lesson contract UI missing ' + marker);
  }
}

function validateRoadmapResources(resources, label, { allowEmpty = false } = {}) {
  if (!Array.isArray(resources)) fail(label + ': resources must be an array');
  if (!allowEmpty && resources.length === 0) fail(label + ': missing resource links');
  const seen = new Set();
  let primaryCount = 0;

  for (const resource of resources) {
    if (!isRecord(resource)) fail(label + ': invalid resource');
    if (!roadmapResourceKinds.has(resource.kind)) fail(label + ': invalid resource kind');
    if (typeof resource.target !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.target)) fail(label + ': invalid resource target');
    if ('primary' in resource && typeof resource.primary !== 'boolean') fail(label + ': resource primary must be boolean');
    if ('title' in resource && resource.title !== undefined) validateLocalizedText(resource.title, label + ': resource title');
    if ('anchor' in resource && resource.anchor !== undefined) {
      if (resource.kind !== 'lab') fail(label + ': only lab resources may set an anchor');
      if (typeof resource.anchor !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.anchor)) fail(label + ': invalid resource anchor');
    }
    if (resource.kind === 'article' && !articleSlugs.has(resource.target)) fail(label + ': unknown article resource ' + resource.target);
    if (resource.kind === 'interview-question' && !interviewQuestionSlugs.has(resource.target)) fail(label + ': unknown interview-question resource ' + resource.target);
    if (resource.kind === 'interview-prep' && !roadmapInterviewPrepTargets.has(resource.target)) fail(label + ': unknown interview-prep resource ' + resource.target);
    if (resource.kind === 'lab') {
      const allowedAnchors = roadmapLabTargets.get(resource.target);
      if (!allowedAnchors) fail(label + ': unknown lab resource ' + resource.target);
      if (resource.anchor && !allowedAnchors.has(resource.anchor)) fail(label + ': unknown lab anchor ' + resource.anchor);
      if (resource.target === 'build-lab' && !resource.anchor) fail(label + ': build-lab resources must point to a workflow output');
    }
    if (resource.primary === true) primaryCount += 1;
    const key = resource.kind + ':' + resource.target;
    if (seen.has(key)) fail(label + ': duplicate resource ' + key);
    seen.add(key);
  }

  if (resources.length > 0 && primaryCount !== 1) fail(label + ': expected exactly one primary resource');
}

function validateBuildLabWorkflowPath(workflowPath, label) {
  if (!isRecord(workflowPath)) fail(label + ': missing five-record local workflow path');
  for (const field of ['eyebrow', 'title', 'intro', 'boundary']) {
    if (typeof workflowPath[field] !== 'string' || !workflowPath[field].trim()) fail(label + ': missing workflowPath ' + field);
  }
  if (!Array.isArray(workflowPath.steps) || workflowPath.steps.length !== buildLabWorkflowStepPlan.length) {
    fail(label + ': expected five workflow outputs');
  }

  workflowPath.steps.forEach((step, index) => {
    const expected = buildLabWorkflowStepPlan[index];
    if (!isRecord(step)) fail(label + ': invalid workflow output ' + index);
    if (step.id !== expected.id || step.href !== expected.href) fail(label + ': workflow output does not match the local practice route');
    for (const field of ['title', 'text', 'action']) {
      if (typeof step[field] !== 'string' || !step[field].trim()) fail(label + ': missing workflow output ' + field);
    }
  });
}

function validateRoadmapLearningGuide(guide, label) {
  if (!isRecord(guide)) fail(label + ': missing self-learning guide');
  for (const field of ['eyebrow', 'title', 'intro', 'root', 'boundary']) {
    validateLocalizedText(guide[field], label + ': selfLearning.' + field);
  }

  if (!Array.isArray(guide.routes) || guide.routes.length !== roadmapLearningRoutePlan.length) {
    fail(label + ': self-learning guide must have four entry routes');
  }

  guide.routes.forEach((route, index) => {
    const expected = roadmapLearningRoutePlan[index];
    const routeLabel = label + ': selfLearning route ' + String(index + 1).padStart(2, '0');
    if (!isRecord(route)) fail(routeLabel + ': invalid route');
    if (route.id !== expected.id || route.range !== expected.range || route.startStage !== expected.startStage) {
      fail(routeLabel + ': route does not match the public roadmap entry plan');
    }
    for (const field of ['title', 'description', 'action']) validateLocalizedText(route[field], routeLabel + ' ' + field);
  });

  if (!isRecord(guide.loop)) fail(label + ': self-learning guide missing loop');
  validateLocalizedText(guide.loop.title, label + ': selfLearning.loop title');
  if (!Array.isArray(guide.loop.steps) || guide.loop.steps.length !== 3) {
    fail(label + ': self-learning guide must have three learning moves');
  }
  guide.loop.steps.forEach((step, index) => {
    const stepLabel = label + ': selfLearning loop step ' + String(index + 1).padStart(2, '0');
    if (!isRecord(step)) fail(stepLabel + ': invalid step');
    validateLocalizedText(step.title, stepLabel + ' title');
    validateLocalizedText(step.text, stepLabel + ' text');
  });
}

function validateAiEngineerRoadmap(roadmap) {
  const label = 'ai-engineer-roadmap';
  validateCurriculumMetadata(roadmap, label, 'ai-engineer-roadmap', 'https://github.com/amitshekhariitbhu/ai-engineer-roadmap');

  if (!Array.isArray(roadmap.phases) || roadmap.phases.length !== roadmapPhasePlan.length) fail(label + ': expected four phases');
  const seenPhaseIds = new Set();
  roadmap.phases.forEach((phase, index) => {
    const expected = roadmapPhasePlan[index];
    if (!isRecord(phase)) fail(label + ': invalid phase ' + index);
    if (phase.id !== expected.id || phase.range !== expected.range) fail(label + ': phase ' + index + ' does not match the 00–18 curriculum plan');
    if (seenPhaseIds.has(phase.id)) fail(label + ': duplicate phase ' + phase.id);
    seenPhaseIds.add(phase.id);
    validateLocalizedText(phase.title, label + ': phase ' + phase.id + ' title');
    validateLocalizedText(phase.description, label + ': phase ' + phase.id + ' description');
    validateLocalizedText(phase.checkpoint, label + ': phase ' + phase.id + ' checkpoint');
  });

  if (!Array.isArray(roadmap.stages) || roadmap.stages.length !== 19) fail(label + ': expected stages 00–18 exactly once');
  const seenStageIds = new Set();
  roadmap.stages.forEach((stage, index) => {
    const number = String(index).padStart(2, '0');
    const expectedPhase = roadmapPhasePlan.find(phase => index >= phase.start && index <= phase.end);
    const stageLabel = label + ': stage ' + number;
    if (!isRecord(stage)) fail(stageLabel + ': invalid stage');
    if (stage.number !== number) fail(stageLabel + ': stage numbers must run from 00 through 18 in order');
    if (typeof stage.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stage.id)) fail(stageLabel + ': invalid stage id');
    if (seenStageIds.has(stage.id)) fail(stageLabel + ': duplicate stage id ' + stage.id);
    seenStageIds.add(stage.id);
    if (stage.phase !== expectedPhase?.id) fail(stageLabel + ': assigned to the wrong phase');
    if (!roadmapStatuses.has(stage.status)) fail(stageLabel + ': invalid availability status');
    validateLocalizedText(stage.title, stageLabel + ' title');
    validateLocalizedText(stage.summary, stageLabel + ' summary');
    validateLocalizedText(stage.evidence, stageLabel + ' evidence');
    validateNonEmptyStringArray(stage.focus, stageLabel + ' focus');

    const hasGap = Object.hasOwn(stage, 'gap') && stage.gap !== undefined;
    if (stage.status === 'available' && hasGap) fail(stageLabel + ': available stages must not claim an unresolved gap');
    if (stage.status !== 'available') {
      if (!hasGap) fail(stageLabel + ': partial or planned stages must explain the current gap');
      validateLocalizedText(stage.gap, stageLabel + ' gap');
    }

    const planned = stage.status === 'planned';
    validateRoadmapResources(stage.resources, stageLabel, { allowEmpty: planned });
    if (planned && stage.resources.length !== 0) fail(stageLabel + ': planned stages must not imply an available resource');
  });

  for (const expected of roadmapReaderFlowPrimaryPlan) {
    const stage = roadmap.stages.find(candidate => candidate.id === expected.stageId);
    const primary = stage?.resources.find(resource => resource.primary === true);
    if (!stage || !primary || primary.kind !== expected.kind || primary.target !== expected.target) {
      fail(label + ': stage ' + expected.stageId + ' must expose its closest local explainer as the primary next step');
    }
    if (stage.resources[0] !== primary) {
      fail(label + ': stage ' + expected.stageId + ' must place its primary explainer before optional resources');
    }
    const firstQuestionIndex = stage.resources.findIndex(resource => resource.kind === 'interview-question');
    if (firstQuestionIndex >= 0 && stage.resources.slice(firstQuestionIndex).some(resource => resource.kind !== 'interview-question')) {
      fail(label + ': stage ' + expected.stageId + ' must place local explainers and practice resources before question checks');
    }
  }

  validateRoadmapLearningGuide(roadmap.selfLearning, label);

  for (const expected of buildLabWorkflowStepPlan) {
    const stage = roadmap.stages.find(candidate => candidate.number === expected.stage);
    if (!stage?.resources.some(resource => resource.kind === 'lab' && resource.target === 'build-lab' && resource.anchor === expected.id)) {
      fail(label + ': stage ' + expected.stage + ' must link to workflow output ' + expected.id);
    }
  }

  const interviewEvidenceStage = roadmap.stages.find(stage => stage.id === 'interview-evidence');
  if (!interviewEvidenceStage?.resources.some(resource => resource.kind === 'interview-prep' && resource.target === 'ai-engineer-interview-prep')) {
    fail(label + ': stage interview-evidence must hand readers into the preparation map');
  }
}

function validateRoadmapResourceDisclosure() {
  const resourceLinksSource = roadmapTimelineSource.slice(
    roadmapTimelineSource.indexOf('function ResourceLinks'),
    roadmapTimelineSource.indexOf('function StageCard')
  );
  const stageCardSource = roadmapTimelineSource.slice(
    roadmapTimelineSource.indexOf('function StageCard'),
    roadmapTimelineSource.indexOf('function SelfLearningGuide')
  );

  if (!roadmapsSource.includes("'ai-engineer-interview-prep': 'interview-lab#interview-prep-map'")) {
    fail('ai-engineer-roadmap: interview-prep resource must resolve to the preparation-map anchor');
  }
  if (!roadmapTimelineSource.includes('id="interview-prep-map"')) {
    fail('interview-lab: preparation-map route must retain a stable anchor');
  }
  if (!roadmapTimelineSource.includes("resource.kind === 'interview-prep'")) {
    fail('ai-engineer-roadmap: interview-prep resources must have a localized title fallback');
  }

  if (!resourceLinksSource.includes('const primary = resources.find(resource => resource.primary);')
    || !resourceLinksSource.includes('const optional = resources.filter(resource => resource !== primary);')
    || !resourceLinksSource.includes('const optionalList = <ul>{optional.map(resource =>')) {
    fail('ai-engineer-roadmap: resource renderer must retain one primary resource and the full optional resource set');
  }
  if (!resourceLinksSource.includes('collapseOptional ? <details className="roadmap-resource-optional roadmap-resource-optional--collapsible">')
    || !resourceLinksSource.includes('<summary>{optionalResources}</summary>')
    || !resourceLinksSource.includes('{optionalList}')) {
    fail('ai-engineer-roadmap: optional stage resources must use a localized native details disclosure');
  }
  if (!stageCardSource.includes('collapseOptional />')) {
    fail('ai-engineer-roadmap: stage cards must keep the primary action visible while collapsing only deeper resources');
  }
}

function validateAiEngineerInterviewPrep(interviewPrep) {
  const label = 'ai-engineer-interview-prep';
  validateCurriculumMetadata(interviewPrep, label, 'ai-engineer-interview-prep');

  if (!Array.isArray(interviewPrep.tracks) || interviewPrep.tracks.length !== 14) fail(label + ': expected 14 interview preparation tracks');
  const seenTrackIds = new Set();
  interviewPrep.tracks.forEach((track, index) => {
    const number = String(index + 1).padStart(2, '0');
    const trackLabel = label + ': track ' + number;
    if (!isRecord(track)) fail(trackLabel + ': invalid track');
    if (track.number !== number) fail(trackLabel + ': tracks must run from 01 through 14 in order');
    if (typeof track.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(track.id)) fail(trackLabel + ': invalid track id');
    if (seenTrackIds.has(track.id)) fail(trackLabel + ': duplicate track id ' + track.id);
    seenTrackIds.add(track.id);
    if (!roadmapStatuses.has(track.status)) fail(trackLabel + ': invalid availability status');
    if (Object.hasOwn(track, 'gap')) fail(trackLabel + ': interview prep tracks use status and evidence, not a roadmap gap');
    validateLocalizedText(track.title, trackLabel + ' title');
    validateLocalizedText(track.summary, trackLabel + ' summary');
    validateLocalizedText(track.evidence, trackLabel + ' evidence');
    validateRoadmapResources(track.resources, trackLabel);
  });

  const implementationTrack = interviewPrep.tracks.find(track => track.id === 'implementation');
  if (!implementationTrack?.resources.some(resource => resource.kind === 'lab' && resource.target === 'coding-starter-lab')) {
    fail(label + ': implementation track must link to the local coding practice lab');
  }
}

function questionResourceTargets(resources) {
  return new Set(resources.filter(resource => resource.kind === 'interview-question').map(resource => resource.target));
}

function validateInterviewQuestionMetadata(metadata) {
  const label = 'interview-question-metadata';
  if (!isRecord(metadata) || !Array.isArray(metadata.questions)) fail(label + ': expected a questions array');
  if (metadata.questions.length !== standaloneQuestionContentFiles.size) fail(label + ': expected one record for every standalone question');

  const stageById = new Map(aiEngineerRoadmap.stages.map(stage => [stage.id, stage]));
  const trackById = new Map(aiEngineerInterviewPrep.tracks.map(track => [track.id, track]));
  const metadataBySlug = new Map();
  const practiceFields = ['scenario', 'trap', 'mechanism', 'tradeoff', 'failure', 'evidence'];
  const permittedCompanyAttribution = 'not-asserted';

  for (const entry of metadata.questions) {
    if (!isRecord(entry) || typeof entry.slug !== 'string') fail(label + ': invalid question record');
    const entryLabel = label + ': ' + entry.slug;
    if (!interviewQuestionSlugs.has(entry.slug)) fail(entryLabel + ': unknown standalone question');
    if (metadataBySlug.has(entry.slug)) fail(entryLabel + ': duplicate question metadata');
    metadataBySlug.set(entry.slug, entry);
    if (entry.companyAttribution !== permittedCompanyAttribution) {
      fail(entryLabel + ': company attribution must explicitly remain not-asserted without a verified record');
    }

    validateNonEmptyStringArray(entry.roadmapStages, entryLabel + ' roadmapStages');
    validateNonEmptyStringArray(entry.prepTracks, entryLabel + ' prepTracks');
    for (const stageId of entry.roadmapStages) {
      const stage = stageById.get(stageId);
      if (!stage) fail(entryLabel + ': unknown roadmap stage ' + stageId);
      if (!questionResourceTargets(stage.resources).has(entry.slug)) fail(entryLabel + ': roadmap stage ' + stageId + ' is missing its question resource');
    }
    for (const trackId of entry.prepTracks) {
      const track = trackById.get(trackId);
      if (!track) fail(entryLabel + ': unknown prep track ' + trackId);
      if (!questionResourceTargets(track.resources).has(entry.slug)) fail(entryLabel + ': prep track ' + trackId + ' is missing its question resource');
    }

    if (!isRecord(entry.practice)) fail(entryLabel + ': missing question-aware practice brief');
    for (const locale of locales) {
      const brief = entry.practice[locale];
      if (!isRecord(brief)) fail(entryLabel + ': missing ' + locale + ' practice brief');
      for (const field of practiceFields) {
        const text = brief[field];
        if (typeof text !== 'string' || text.trim().length < 8) fail(entryLabel + '/' + locale + ': invalid practice ' + field);
        for (const term of banned) if (text.includes(term)) fail(entryLabel + '/' + locale + ': internal marker ' + term);
      }
    }
  }

  for (const slug of interviewQuestionSlugs) {
    if (!metadataBySlug.has(slug)) fail(label + ': missing metadata for ' + slug);
  }

  for (const stage of aiEngineerRoadmap.stages) {
    const targets = questionResourceTargets(stage.resources);
    if (targets.size === 0) fail(label + ': roadmap stage ' + stage.id + ' needs at least one question');
    for (const slug of targets) {
      const entry = metadataBySlug.get(slug);
      if (!entry?.roadmapStages.includes(stage.id)) fail(label + ': roadmap stage ' + stage.id + ' has an unmapped question ' + slug);
    }
  }

  for (const track of aiEngineerInterviewPrep.tracks) {
    const targets = questionResourceTargets(track.resources);
    if (targets.size === 0) fail(label + ': prep track ' + track.id + ' needs at least one question');
    for (const slug of targets) {
      const entry = metadataBySlug.get(slug);
      if (!entry?.prepTracks.includes(track.id)) fail(label + ': prep track ' + track.id + ' has an unmapped question ' + slug);
    }
  }
}

function validateInterviewPracticeCardDownloadCount() {
  const expectedCount = String(interviewQuestionSlugs.size);
  for (const locale of locales) {
    const file = path.join(root, 'public', 'downloads', 'interview-practice-cards', 'v1', locale + '.md');
    const [heading = ''] = fs.readFileSync(file, 'utf8').split(/\r?\n/, 1);
    const numbers = heading.match(/\d+/g) ?? [];
    if (!heading.startsWith('# ') || numbers.length !== 1 || numbers[0] !== expectedCount) {
      fail('interview-practice-cards/' + locale + ': download heading must state the current ' + expectedCount + '-question Lab count');
    }
  }
}

function validateInternalLearningLinks(text, locale, label) {
  for (const match of text.matchAll(/\/(zh-HK|zh-TW|zh-Hans|en)\/(articles|interview-lab)\/([a-z0-9]+(?:-[a-z0-9]+)*)/g)) {
    const [, linkedLocale, kind, target] = match;
    if (linkedLocale !== locale) fail(label + '/' + locale + ': cross-locale internal learning link ' + match[0]);
    if (kind === 'articles' && !articleSlugSet.has(target)) fail(label + '/' + locale + ': unknown article link ' + match[0]);
    if (kind === 'articles' && legacyRedirectArticleSlugs.has(target)) fail(label + '/' + locale + ': internal learning link must not target a legacy redirect ' + match[0]);
    if (kind === 'interview-lab' && !interviewQuestionSlugs.has(target)) fail(label + '/' + locale + ': unknown interview question link ' + match[0]);
  }
}

function isSafeMarkdownHref(value) {
  const href = value.trim().replace(/&amp;/g, '&');
  if (href.startsWith('#')) return true;
  if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/\\')) return true;
  try {
    const parsed = new URL(href);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function validateMarkdownLinkSchemes(text, label) {
  for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (!isSafeMarkdownHref(match[1])) fail(label + ': unsupported markdown link target ' + match[1]);
  }
}

function validateHttpsSourceUrl(value, label) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' || !parsed.hostname) fail(label + ': source URL must use HTTPS');
  } catch {
    fail(label + ': invalid source URL');
  }
}

function validateStandaloneInterviewQuestions() {
  if (!fs.existsSync(interviewQuestionContentRoot)) fail('interview-lab: missing standalone question content directory');
  // The public locale layer canonically maps the legacy Traditional-Chinese
  // content keys at the registry boundary.  Accept either the original
  // literal registry or that equivalent normalized registry, then continue
  // checking every imported file is actually present in its runtime list.
  const registryMatch = interviewQuestionContentSource.match(/const standaloneQuestions:[\s\S]*?=\s*(?:normalizeLocaleContent\()?\[([\s\S]*?)\]\)?\s*(?:as unknown as )?readonly StandaloneInterviewQuestion\[\];/);
  if (!registryMatch) fail('interview-lab: could not find the runtime standalone-question registry');
  const expectedFiles = new Set(Array.from(standaloneQuestionContentFiles.values(), file => file + '.json'));
  const files = fs.readdirSync(interviewQuestionContentRoot).filter(file => file.endsWith('.json'));
  if (files.length !== expectedFiles.size) fail('interview-lab: standalone question file count does not match topic definitions');
  const seenSlugs = new Set();

  for (const file of files) {
    if (!expectedFiles.has(file)) fail('interview-lab: unreferenced standalone question file ' + file);
    const value = JSON.parse(fs.readFileSync(path.join(interviewQuestionContentRoot, file), 'utf8'));
    const label = 'interview-lab: ' + file;
    if (!isRecord(value) || typeof value.slug !== 'string' || !isRecord(value.body)) fail(label + ': expected slug and localized body');
    if (!interviewQuestionSlugs.has(value.slug)) fail(label + ': unknown interview question slug ' + value.slug);
    if (standaloneQuestionContentFiles.get(value.slug) + '.json' !== file) fail(label + ': topic definition does not point to this file');
    if (seenSlugs.has(value.slug)) fail(label + ': duplicate standalone question slug ' + value.slug);
    seenSlugs.add(value.slug);

    const importPattern = new RegExp(`^import\\s+([A-Za-z][A-Za-z0-9]*)\\s+from\\s+['\"]@/content/interview-questions/${file.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}['\"];$`, 'm');
    const importMatch = interviewQuestionContentSource.match(importPattern);
    if (!importMatch) fail(label + ': missing runtime import');
    const importedName = importMatch[1];
    if (!new RegExp(`(?:^|[\\s,])${importedName}(?=[\\s,]|$)`).test(registryMatch[1])) {
      fail(label + ': runtime import is missing from the standalone-question registry');
    }

    for (const locale of locales) {
      const text = value.body[locale];
      const minimum = locale === 'en' ? 900 : 700;
      if (typeof text !== 'string' || text.trim().length < minimum) fail(label + '/' + locale + ': standalone question is too short');
      for (const term of banned) if (text.includes(term)) fail(label + '/' + locale + ': internal marker ' + term);
      if (!text.includes(interviewScopeHeading[locale])) fail(label + '/' + locale + ': missing scope boundary');
      validateInternalLearningLinks(text, locale, label);
      validateMarkdownLinkSchemes(text, label + '/' + locale);
    }
  }

  for (const [slug, contentFile] of standaloneQuestionContentFiles) {
    if (!seenSlugs.has(slug)) fail('interview-lab: missing standalone content for ' + contentFile);
  }
}

function validateInterviewPracticePaths(paths) {
  const label = 'interview-practice-paths';
  if (!isRecord(paths) || !isRecord(paths.index) || !Array.isArray(paths.paths) || !Array.isArray(paths.afterDemoPaths)) fail(label + ': expected index copy, starting paths, and after-demo paths');
  if (paths.paths.length !== 5) fail(label + ': expected exactly five starting routes');

  for (const locale of locales) {
    const index = paths.index[locale];
    if (!isRecord(index)) fail(label + ': missing ' + locale + ' index copy');
    for (const field of ['eyebrow', 'title', 'intro', 'evidenceTaskLabel', 'finalLabel']) {
      const value = index[field];
      if (typeof value !== 'string' || !value.trim()) fail(label + '/' + locale + ': missing index ' + field);
      for (const term of banned) if (value.includes(term)) fail(label + '/' + locale + ': internal marker in index ' + field);
    }
    if (!Array.isArray(index.stepLabel) || index.stepLabel.length !== 4 || index.stepLabel.some(value => typeof value !== 'string' || !value.trim())) {
      fail(label + '/' + locale + ': expected four ordered step labels');
    }
    if (new Set(index.stepLabel).size !== 4) fail(label + '/' + locale + ': duplicate step label');
  }

  const seenPathIds = new Set();
  for (const pathEntry of paths.paths) {
    if (!isRecord(pathEntry) || typeof pathEntry.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathEntry.id)) fail(label + ': invalid path id');
    if (seenPathIds.has(pathEntry.id)) fail(label + ': duplicate path id ' + pathEntry.id);
    seenPathIds.add(pathEntry.id);
    if (!Array.isArray(pathEntry.topicSlugs) || pathEntry.topicSlugs.length !== 4) fail(label + ': ' + pathEntry.id + ' must contain four questions');
    const seenTopics = new Set();
    for (const slug of pathEntry.topicSlugs) {
      if (typeof slug !== 'string' || !interviewQuestionSlugs.has(slug)) fail(label + ': ' + pathEntry.id + ' references unknown question ' + slug);
      if (seenTopics.has(slug)) fail(label + ': ' + pathEntry.id + ' repeats question ' + slug);
      seenTopics.add(slug);
    }
    if (!isRecord(pathEntry.copy)) fail(label + ': ' + pathEntry.id + ' missing localized copy');
    for (const locale of locales) {
      const copy = pathEntry.copy[locale];
      if (!isRecord(copy)) fail(label + ': ' + pathEntry.id + ' missing ' + locale + ' copy');
      for (const field of ['title', 'description']) {
        const value = copy[field];
        if (typeof value !== 'string' || !value.trim()) fail(label + '/' + locale + ': ' + pathEntry.id + ' missing ' + field);
        for (const term of banned) if (value.includes(term)) fail(label + '/' + locale + ': internal marker in ' + pathEntry.id + ' ' + field);
      }
    }

    if (pathEntry.id === 'no-project-first-evidence') {
      if (!Array.isArray(pathEntry.evidenceTasks) || pathEntry.evidenceTasks.length !== pathEntry.topicSlugs.length) {
        fail(label + ': no-project-first-evidence must include one evidence task for each question');
      }
      for (const [index, task] of pathEntry.evidenceTasks.entries()) {
        if (!isRecord(task)) fail(label + ': no-project-first-evidence evidence task ' + (index + 1) + ' must be localized');
        for (const locale of locales) {
          const value = task[locale];
          if (typeof value !== 'string' || !value.trim()) fail(label + '/' + locale + ': no-project-first-evidence evidence task ' + (index + 1) + ' is missing');
          for (const term of banned) if (value.includes(term)) fail(label + '/' + locale + ': internal marker in no-project-first-evidence evidence task ' + (index + 1));
        }
      }
    }
  }

  if (!seenPathIds.has('no-project-first-evidence')) fail(label + ': missing no-project-first-evidence route');

  const expectedAfterDemoPathIds = ['rag-after-first-demo', 'agent-after-first-demo'];
  if (paths.afterDemoPaths.length !== expectedAfterDemoPathIds.length) fail(label + ': expected exactly the RAG and agent after-demo paths');
  const expectedRagAfterDemoTopics = [
    'rag-retrieval-generation-or-permission',
    'a-reranker-cannot-restore-a-missing-permission',
    'conflicting-sources-need-an-owner',
    'an-embedding-change-needs-an-index-migration',
    'metadata-needs-a-backfill-contract',
    'a-document-deletion-needs-a-retrieval-receipt'
  ];
  const expectedAgentAfterDemoTopics = [
    'agent-draft-without-consequential-actions',
    'an-agent-loop-needs-terminal-states',
    'an-agent-eval-needs-a-route-verdict',
    'tool-schema-is-not-least-privilege',
    'mcp-discovery-is-not-an-approval-gate',
    'memory-must-expire-before-it-becomes-policy'
  ];
  const prepTrackIds = new Set(aiEngineerInterviewPrep.tracks.map(track => track.id));
  const seenAfterDemoIds = new Set();
  for (const pathEntry of paths.afterDemoPaths) {
    if (!isRecord(pathEntry) || typeof pathEntry.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathEntry.id)) {
      fail(label + ': invalid after-demo path id');
    }
    if (seenAfterDemoIds.has(pathEntry.id)) fail(label + ': duplicate after-demo path id ' + pathEntry.id);
    seenAfterDemoIds.add(pathEntry.id);
    if (typeof pathEntry.trackId !== 'string' || !prepTrackIds.has(pathEntry.trackId)) {
      fail(label + ': ' + pathEntry.id + ' must reference an existing interview preparation track');
    }
    if (!Array.isArray(pathEntry.topicSlugs) || pathEntry.topicSlugs.length < 2) {
      fail(label + ': ' + pathEntry.id + ' needs an ordered local-question route');
    }
    const seenTopics = new Set();
    for (const slug of pathEntry.topicSlugs) {
      if (typeof slug !== 'string' || !interviewQuestionSlugs.has(slug)) fail(label + ': ' + pathEntry.id + ' references unknown question ' + slug);
      if (seenTopics.has(slug)) fail(label + ': ' + pathEntry.id + ' repeats question ' + slug);
      seenTopics.add(slug);
    }
    if (!isRecord(pathEntry.copy)) fail(label + ': ' + pathEntry.id + ' missing localized copy');
    for (const locale of locales) {
      const copy = pathEntry.copy[locale];
      if (!isRecord(copy)) fail(label + ': ' + pathEntry.id + ' missing ' + locale + ' copy');
      for (const field of ['eyebrow', 'title', 'description', 'action']) {
        const value = copy[field];
        if (typeof value !== 'string' || !value.trim()) fail(label + '/' + locale + ': ' + pathEntry.id + ' missing ' + field);
        for (const term of banned) if (value.includes(term)) fail(label + '/' + locale + ': internal marker in ' + pathEntry.id + ' ' + field);
      }
    }
  }
  if (seenAfterDemoIds.size !== expectedAfterDemoPathIds.length || expectedAfterDemoPathIds.some(id => !seenAfterDemoIds.has(id))) {
    fail(label + ': expected exactly rag-after-first-demo and agent-after-first-demo routes');
  }
  const ragAfterDemo = paths.afterDemoPaths.find(pathEntry => pathEntry.id === 'rag-after-first-demo');
  if (!ragAfterDemo || ragAfterDemo.trackId !== 'retrieval-rag') fail(label + ': missing retrieval-rag after-first-demo path');
  if (JSON.stringify(ragAfterDemo.topicSlugs) !== JSON.stringify(expectedRagAfterDemoTopics)) {
    fail(label + ': rag-after-first-demo must retain the diagnosis-to-withdrawal question order');
  }
  const agentAfterDemo = paths.afterDemoPaths.find(pathEntry => pathEntry.id === 'agent-after-first-demo');
  if (!agentAfterDemo || agentAfterDemo.trackId !== 'agent-systems') fail(label + ': missing agent-systems after-first-demo path');
  if (JSON.stringify(agentAfterDemo.topicSlugs) !== JSON.stringify(expectedAgentAfterDemoTopics)) {
    fail(label + ': agent-after-first-demo must retain the draft-to-expiring-memory question order');
  }

  if (!interviewLabPageSource.includes('<InterviewPracticePaths locale={lang} topics={topics} />')) fail(label + ': Interview Lab does not render the scoped starting routes');
  if (!interviewLabPageSource.includes('<InterviewAfterDemoPaths locale={lang} topics={topics} />')) fail(label + ': Interview Lab does not render the scoped after-demo route');
  if (!interviewPracticePathsSource.includes('id="interview-practice-paths"')) fail(label + ': missing practice-path anchor');
  if (!interviewPracticePathsSource.includes('path.evidenceTasks')) fail(label + ': practice-path evidence tasks are not rendered');
  if (!interviewAfterDemoPathsSource.includes('interviewPracticeAfterDemoPathAnchor(path)') || !interviewAfterDemoPathsSource.includes('path.topicSlugs.map')) {
    fail(label + ': after-demo route must render ordered local-question navigation');
  }
  if (!roadmapTimelineSource.includes('getInterviewPracticeAfterDemoPathsForTrack(track.id)') || !roadmapTimelineSource.includes('interviewPracticeAfterDemoPathAnchor(path)')) {
    fail(label + ': relevant interview preparation track must expose the after-demo route');
  }
  if (!interviewQuestionPageSource.includes('QuestionPracticePathCallout')) fail(label + ': question pages do not expose their route membership');
}

function validateInterviewPracticeContinuations(continuations) {
  const label = 'interview-practice-continuations';
  if (!isRecord(continuations) || !isRecord(continuations.copy) || !Array.isArray(continuations.capabilities)) {
    fail(label + ': expected localized copy and capability sequences');
  }

  for (const locale of locales) {
    const copy = continuations.copy[locale];
    if (!isRecord(copy)) fail(label + ': missing ' + locale + ' copy');
    for (const field of ['eyebrow', 'nextLead', 'nextAction', 'rehearsalLead', 'rehearsalAction']) {
      const value = copy[field];
      if (typeof value !== 'string' || !value.trim()) fail(label + '/' + locale + ': missing ' + field);
      for (const term of banned) if (value.includes(term)) fail(label + '/' + locale + ': internal marker in ' + field);
    }
  }

  const trackIds = new Set(aiEngineerInterviewPrep.tracks.map(track => track.id));
  if (continuations.capabilities.length !== trackIds.size) {
    fail(label + ': expected one capability sequence for every interview preparation track');
  }

  const metadataBySlug = new Map(interviewQuestionMetadata.questions.map(question => [question.slug, question]));
  const seenCapabilityIds = new Set();
  const seenTopicSlugs = new Set();

  for (const capability of continuations.capabilities) {
    if (!isRecord(capability) || typeof capability.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(capability.id)) {
      fail(label + ': invalid capability id');
    }
    if (!trackIds.has(capability.id)) fail(label + ': unknown interview preparation track ' + capability.id);
    if (seenCapabilityIds.has(capability.id)) fail(label + ': duplicate capability sequence ' + capability.id);
    seenCapabilityIds.add(capability.id);

    validateNonEmptyStringArray(capability.topicSlugs, label + ': ' + capability.id + ' topicSlugs');
    validateLocalizedText(capability.focus, label + ': ' + capability.id + ' focus');

    for (const slug of capability.topicSlugs) {
      if (!interviewQuestionSlugs.has(slug)) fail(label + ': ' + capability.id + ' references unknown question ' + slug);
      if (seenTopicSlugs.has(slug)) fail(label + ': question appears in more than one primary capability sequence: ' + slug);
      seenTopicSlugs.add(slug);
      const metadata = metadataBySlug.get(slug);
      if (!metadata?.prepTracks?.length || metadata.prepTracks[0] !== capability.id) {
        fail(label + ': ' + slug + ' must stay with its primary interview preparation capability');
      }
    }
  }

  for (const trackId of trackIds) {
    if (!seenCapabilityIds.has(trackId)) fail(label + ': missing capability sequence for ' + trackId);
  }
  for (const slug of interviewQuestionSlugs) {
    if (!seenTopicSlugs.has(slug)) fail(label + ': missing next-practice action for ' + slug);
  }

  if (!interviewPracticeContinuationsSource.includes('getInterviewQuestionMetadata') || !interviewPracticeContinuationsSource.includes('metadata.prepTracks[0]')) {
    fail(label + ': continuation resolution must follow the question primary capability');
  }
  if (!interviewQuestionPageSource.includes('QuestionCapabilityContinuationCallout') || !interviewQuestionPageSource.includes('getInterviewPracticeContinuation')) {
    fail(label + ': every standalone question must render a capability continuation');
  }
  if (interviewQuestionPageSource.includes('interview-question-next')) {
    fail(label + ': question pages must not fall back to generic linear next-question navigation');
  }
}

for (const article of articles) {
  if (!['review', 'approved'].includes(article.status) || article.visibility !== 'public') fail(article.id + ': invalid preview content status');
  if (seenIds.has(article.id) || seenSlugs.has(article.slug)) fail(article.id + ': duplicate id or slug');
  seenIds.add(article.id);
  seenSlugs.add(article.slug);
  if (!categories.has(article.categoryId)) fail(article.id + ': invalid category');
  const publicCategory = publicCategoryOverrides[article.id] ?? article.categoryId;
  if (!publicCategories.has(publicCategory)) fail(article.id + ': invalid public category ' + publicCategory);
  publicCategoryCounts.set(publicCategory, (publicCategoryCounts.get(publicCategory) ?? 0) + 1);
  if (!article.sourceUrls?.length) fail(article.id + ': missing sources');
  for (const sourceUrl of article.sourceUrls) validateHttpsSourceUrl(sourceUrl, article.id);
  if (!Array.isArray(article.relatedArticleSlugs) || article.relatedArticleSlugs.length === 0) fail(article.id + ': missing related article links');
  validatePortfolioRepository(article);
  if (new Date(article.reviewBy) < new Date('2026-09-23')) fail(article.id + ': review expired');
  bodies[article.id] = {};

  for (const locale of locales) {
    if (!article.translations?.[locale]) fail(article.id + ': missing ' + locale + ' metadata');
    const mdx = path.join(root, 'content', 'articles', article.id, locale + '.mdx');
    if (!fs.existsSync(mdx)) fail(article.id + ': missing ' + locale + '.mdx');
    const text = fs.readFileSync(mdx, 'utf8').trim();
    const minimum = locale === 'en' ? 1200 : 800;
    if (text.length < minimum) fail(article.id + '/' + locale + ': article is too short');
    for (const term of banned) if (text.includes(term)) fail(article.id + '/' + locale + ': internal marker ' + term);
    validateInternalLearningLinks(text, locale, article.id);
    validateMarkdownLinkSchemes(text, article.id + '/' + locale);
    bodies[article.id][locale] = text;

    for (const extension of ['pdf', 'md']) {
      const asset = path.join(root, 'public', 'downloads', article.id, 'v1', locale + '.' + extension);
      if (!fs.existsSync(asset)) fail(article.id + ': missing ' + locale + '.' + extension);
      if (fs.statSync(asset).size === 0) fail(article.id + ': empty ' + locale + '.' + extension);
    }
  }
}

for (const [articleId, category] of Object.entries(publicCategoryOverrides)) {
  if (!seenIds.has(articleId)) fail('public category override references unknown article ' + articleId);
  if (!publicCategories.has(category)) fail('public category override has invalid category ' + category);
}
for (const [category, count] of publicCategoryCounts) {
  if (count === 0) fail('public category has no articles: ' + category);
}

const articleSlugs = new Set(articles.map(article => article.slug));
const knownLabInternalRoutes = new Set(['/no-code-starter-lab', '/coding-starter-lab']);
const buildLabPackageRoutes = new Map([
  ['No-code Starter Lab', { internalRoute: '/no-code-starter-lab' }],
  ['Coder Starter Lab', { internalRoute: '/coding-starter-lab' }],
  ['PolicyPilot', { articleSlug: 'enterprise-ai-portfolio-policy-pilot' }],
  ['Approval Queue', { articleSlug: 'approval-queue-low-code-portfolio' }],
  ['AI Batch Worker', { articleSlug: 'build-a-resumable-ai-batch-worker' }],
  ['Renewal Triage', { articleSlug: 'renewal-triage-mlops' }],
  ['KEV Review Packet', { articleSlug: 'build-a-public-data-kev-review-packet' }],
  ['Workforce Signal Brief', { articleSlug: 'build-a-source-bound-context-brief' }]
]);
for (const article of articles) {
  const relatedSeen = new Set();
  for (const relatedSlug of article.relatedArticleSlugs ?? []) {
    if (!articleSlugs.has(relatedSlug)) fail(article.id + ': unknown related article ' + relatedSlug);
    if (legacyRedirectArticleSlugs.has(relatedSlug)) fail(article.id + ': related reading must not target a legacy redirect ' + relatedSlug);
    if (relatedSlug === article.slug) fail(article.id + ': cannot link to itself as related reading');
    if (relatedSeen.has(relatedSlug)) fail(article.id + ': duplicate related article ' + relatedSlug);
    relatedSeen.add(relatedSlug);
  }
}
if (interviewQuestionSlugs.size === 0) fail('interview-lab: unable to find public interview-question routes');
if (interviewCapabilityGroupCount === 0) fail('interview-lab: unable to find public capability routes');
if (!interviewQuestionPageSource.includes('QuestionAttributionCallout') || !interviewQuestionPageSource.includes('companyAttributionCopy[topic.companyAttribution]')) {
  fail('interview-lab: every standalone question must render its company-attribution and source-limit disclosure');
}
if (!interviewQuestionPageSource.includes('interview-prep-track-${track.number}') || !roadmapTimelineSource.includes('id={`interview-prep-track-${track.number}`}')) {
  fail('interview-lab: question routes must target a stable interview-preparation track anchor');
}
if (!fragmentAnchorScrollSource.includes('revealContainingDetails') || !fragmentAnchorScrollSource.includes('element.open = true')) {
  fail('interview-lab: fragment navigation must reveal a closed details ancestor before focusing a track');
}
for (const marker of [
  '這條練習題不作公司歸屬',
  '这条练习题不作公司归属',
  'No company attribution is made for this practice question',
  'not evidence of a company’s current or past interview process'
]) {
  if (!interviewQuestionPageSource.includes(marker)) fail('interview-lab: missing localized company-attribution or source-limit copy');
}
if (/(?:https?:\/\/|git(?:hub)?\.com)/i.test(JSON.stringify(interviewQuestionMetadata))) {
  fail('interview-lab: question metadata must not expose an unapproved external source or repository trace');
}
if (/(?:https?:\/\/|git(?:hub)?\.com)/i.test(interviewQuestionPageSource)) {
  fail('interview-lab: question pages must not expose an unapproved repository trace');
}
validateStandaloneInterviewQuestions();
validateInterviewPracticePaths(interviewPracticePaths);
validateRoadmapStageCompletion(aiEngineerRoadmap, aiEngineerStageCompletion);
validateAiEngineerRoadmap(aiEngineerRoadmap);
validateRoadmapResourceDisclosure();
validateAiEngineerInterviewPrep(aiEngineerInterviewPrep);
validateInterviewQuestionMetadata(interviewQuestionMetadata);
if (!interviewQuestionPageSource.includes('function QuestionAnswerMap')
  || !interviewQuestionPageSource.includes('getInterviewQuestionMetadata(topic.slug)?.practice[locale]')
  || !interviewQuestionPageSource.includes('<QuestionAnswerMap locale={lang} topic={topic} />')) {
  fail('interview-lab: every standalone question must render its structured answer map from localized practice metadata');
}
const answerMapCopySource = interviewQuestionPageSource.split('const questionAnswerMapCopy')[1]?.split('const companyAttributionCopy')[0] ?? '';
const hongKongAnswerMapIntro = answerMapCopySource.match(/'zh-HK': \{[\s\S]*?intro: '([^']+)'/)?.[1] ?? '';
for (const concept of ['情境', '容易誤判', '原理', '取捨', '失敗', '證據']) {
  if (!hongKongAnswerMapIntro.includes(concept)) fail(`interview-lab: Hong Kong answer-map intro must name all six concepts, missing ${concept}`);
}
validateInterviewPracticeCardDownloadCount();
validateInterviewPracticeContinuations(interviewPracticeContinuations);
const seenLabIds = new Set();
for (const lab of labs) {
  if (!['review', 'approved'].includes(lab.status) || lab.visibility !== 'public') fail(lab.id + ': invalid lab content status');
  if (seenLabIds.has(lab.id)) fail(lab.id + ': duplicate lab id');
  seenLabIds.add(lab.id);
  if (new Date(lab.reviewBy) < new Date('2026-09-23')) fail(lab.id + ': lab review expired');
  if (!Array.isArray(lab.relatedArticleSlugs) || lab.relatedArticleSlugs.length === 0) fail(lab.id + ': missing related article links');
  for (const slug of lab.relatedArticleSlugs) if (!articleSlugs.has(slug)) fail(lab.id + ': unknown related article ' + slug);

  for (const locale of locales) {
    const copy = lab.translations?.[locale];
    if (!copy || !copy.eyebrow || !copy.title || !copy.intro || !copy.note) fail(lab.id + ': incomplete ' + locale + ' lab copy');
    if (!Array.isArray(copy.kits) || copy.kits.length === 0) fail(lab.id + ': missing ' + locale + ' lab kits');
    const workflowPublicText = isRecord(copy.workflowPath)
      ? [
          copy.workflowPath.eyebrow,
          copy.workflowPath.title,
          copy.workflowPath.intro,
          copy.workflowPath.boundary,
          ...(Array.isArray(copy.workflowPath.steps)
            ? copy.workflowPath.steps.flatMap(step => isRecord(step) ? [step.title, step.text, step.action, step.href] : [])
            : [])
        ]
      : [];
    const publicText = [copy.eyebrow, copy.title, copy.intro, copy.note, ...workflowPublicText, ...copy.kits.flatMap(kit => [kit.title, kit.kind, kit.text, kit.action, ...(kit.steps ?? []), ...(kit.demonstrates?.technical ?? []), ...(kit.demonstrates?.nonTechnical ?? [])])].join(' ');
    for (const term of banned) if (publicText.includes(term)) fail(lab.id + '/' + locale + ': internal marker ' + term);
    if (lab.id === 'build-lab' && copy.kits.length !== buildLabPackageRoutes.size) fail(lab.id + '/' + locale + ': expected every portfolio package exactly once');
    for (const kit of copy.kits) {
      if (!kit.title || !kit.kind || !kit.text || !kit.action) fail(lab.id + '/' + locale + ': incomplete kit');
      if (!Array.isArray(kit.steps) || kit.steps.length === 0) fail(lab.id + '/' + locale + ': kit missing steps');
      if (!Array.isArray(kit.demonstrates?.technical) || kit.demonstrates.technical.length === 0) fail(lab.id + '/' + locale + ': kit missing technical demonstration map');
      if (!Array.isArray(kit.demonstrates?.nonTechnical) || kit.demonstrates.nonTechnical.length === 0) fail(lab.id + '/' + locale + ': kit missing business and delivery demonstration map');
      if (!kit.articleSlug && !kit.internalRoute) fail(lab.id + '/' + locale + ': kit needs an article or an internal route');
      if (kit.articleSlug) {
        if (!articleSlugs.has(kit.articleSlug)) fail(lab.id + '/' + locale + ': unknown kit article ' + kit.articleSlug);
        if (!lab.relatedArticleSlugs.includes(kit.articleSlug)) fail(lab.id + '/' + locale + ': kit article missing review link ' + kit.articleSlug);
      }
      if (kit.internalRoute) {
        if (!/^\/[a-z0-9-]+(?:#[a-z0-9-]+)?$/.test(kit.internalRoute)) fail(lab.id + '/' + locale + ': invalid kit internal route ' + kit.internalRoute);
        if (!knownLabInternalRoutes.has(kit.internalRoute)) fail(lab.id + '/' + locale + ': unknown kit internal route ' + kit.internalRoute);
        const [internalPath, anchor] = kit.internalRoute.split('#');
        if (internalPath === '/portfolio-evidence-planner' && (!anchor || !portfolioEvidencePlannerAnchors.has(anchor))) {
          fail(lab.id + '/' + locale + ': missing planner anchor for ' + kit.internalRoute);
        }
      }
    }
    if (lab.id === 'build-lab') {
      validateBuildLabWorkflowPath(copy.workflowPath, lab.id + '/' + locale);
      for (const expected of buildLabWorkflowStepPlan) {
        if (expected.kitArticleSlug && !copy.kits.some(kit => kit.articleSlug === expected.kitArticleSlug)) {
          fail(lab.id + '/' + locale + ': missing workflow kit anchor for ' + expected.kitArticleSlug);
        }
        if (expected.articleSlug && !articleSlugs.has(expected.articleSlug)) {
          fail(lab.id + '/' + locale + ': missing workflow article for ' + expected.articleSlug);
        }
      }
      for (const [title, expectedRoute] of buildLabPackageRoutes) {
        const kit = copy.kits.find(candidate => candidate.title === title);
        if (!kit) fail(lab.id + '/' + locale + ': missing portfolio package ' + title);
        if (kit.articleSlug !== expectedRoute.articleSlug || kit.internalRoute !== expectedRoute.internalRoute) {
          fail(lab.id + '/' + locale + ': incorrect public route for ' + title);
        }
      }
    }
  }
}

if (!roadmapsSource.includes("'build-lab': 'labs'")) fail('ai-engineer-roadmap: build-lab must resolve to /labs');
if (!labsPageSource.includes('visibleWorkflowSteps.map') || !labsPageSource.includes('id={buildLabKitAnchor(kit)}')) {
  fail('build-lab: workflow outputs and kit anchors must render');
}

const labIds = new Set(labs.map(lab => lab.id));
const knownSeries = new Set(['ai-engineer-interviews', 'prompt-play', 'ai-use-routes', 'ai-engineer-roadmap']);
const knownPlanners = new Set(['learning-evidence-planner', 'portfolio-evidence-planner']);
const knownInterviewLabRoutes = new Set(['interview-lab']);
const seenReaderPathIds = new Set();
for (const readerPath of readerPaths) {
  if (!['review', 'approved'].includes(readerPath.status) || readerPath.visibility !== 'public') fail(readerPath.id + ': invalid reader-path content status');
  if (seenReaderPathIds.has(readerPath.id)) fail(readerPath.id + ': duplicate reader-path id');
  seenReaderPathIds.add(readerPath.id);
  if (new Date(readerPath.reviewBy) < new Date('2026-09-23')) fail(readerPath.id + ': reader-path review expired');
  if (!Array.isArray(readerPath.relatedArticleSlugs) || readerPath.relatedArticleSlugs.length === 0) fail(readerPath.id + ': missing related article links');
  for (const slug of readerPath.relatedArticleSlugs) if (!articleSlugs.has(slug)) fail(readerPath.id + ': unknown related article ' + slug);

  for (const locale of locales) {
    const copy = readerPath.translations?.[locale];
    if (!copy || !copy.eyebrow || !copy.title || !copy.intro || !copy.browse) fail(readerPath.id + ': incomplete ' + locale + ' reader-path copy');
    if (!Array.isArray(copy.paths) || copy.paths.length !== 4) fail(readerPath.id + ': expected four ' + locale + ' reader paths');
    const publicText = [copy.eyebrow, copy.title, copy.intro, copy.browse, ...copy.paths.flatMap(route => [route.title, route.description, route.action])].join(' ');
    for (const term of banned) if (publicText.includes(term)) fail(readerPath.id + '/' + locale + ': internal marker ' + term);
    for (const route of copy.paths) {
      if (!route.title || !route.description || !route.action || !route.target) fail(readerPath.id + '/' + locale + ': incomplete reader path');
      if (!['series', 'labs', 'article', 'planner', 'interview-lab'].includes(route.kind)) fail(readerPath.id + '/' + locale + ': invalid reader path kind');
      if (route.kind === 'article' && !articleSlugs.has(route.target)) fail(readerPath.id + '/' + locale + ': unknown reader article ' + route.target);
      if (route.kind === 'labs' && !labIds.has(route.target)) fail(readerPath.id + '/' + locale + ': unknown reader lab ' + route.target);
      if (route.kind === 'series' && !knownSeries.has(route.target)) fail(readerPath.id + '/' + locale + ': unknown reader series ' + route.target);
      if (route.kind === 'planner' && !knownPlanners.has(route.target)) fail(readerPath.id + '/' + locale + ': unknown reader planner ' + route.target);
      if (route.kind === 'interview-lab' && !knownInterviewLabRoutes.has(route.target)) fail(readerPath.id + '/' + locale + ': unknown interview lab route ' + route.target);
    }
    if (readerPath.id === 'start-here') {
      const roadmapRoutes = copy.paths.filter(route => route.kind === 'series' && route.target === 'ai-engineer-roadmap');
      if (roadmapRoutes.length !== 1) fail(readerPath.id + '/' + locale + ': expected exactly one link to the AI Engineer roadmap');
      const interviewRoutes = copy.paths.filter(route => route.kind === 'interview-lab' && route.target === 'interview-lab');
      if (interviewRoutes.length !== 1) fail(readerPath.id + '/' + locale + ': expected exactly one link to the Interview Lab');
      const interviewDescription = interviewRoutes[0].description;
      if (!interviewDescription.includes(String(interviewQuestionSlugs.size)) || !interviewDescription.includes(String(interviewCapabilityGroupCount))) {
        fail(readerPath.id + '/' + locale + ': Interview Lab description must state the current question and capability-route counts');
      }
    }
  }
}

fs.writeFileSync(path.join(root, 'content', 'article-bodies.json'), JSON.stringify(bodies, null, 2));
const manifest = [];
for (const article of articles) {
  for (const locale of locales) {
    for (const extension of ['pdf', 'md']) {
      const file = path.join(root, 'public', 'downloads', article.id, 'v1', locale + '.' + extension);
      manifest.push({
        article: article.id,
        locale,
        format: extension,
        size: fs.statSync(file).size,
        sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
      });
    }
  }
}
const latest = articles.map(article => article.updatedAt).concat(labs.map(lab => lab.updatedAt), readerPaths.map(readerPath => readerPath.updatedAt)).sort().at(-1);
fs.writeFileSync(path.join(root, 'public', 'downloads', 'manifest.json'), JSON.stringify({ generatedAt: latest + 'T00:00:00.000Z', assets: manifest }, null, 2));
console.log('Validated ' + articles.length + ' articles, ' + labs.length + ' labs, ' + readerPaths.length + ' reader paths, 19 roadmap stages, 14 interview-prep tracks, ' + standaloneQuestionContentFiles.size + ' standalone interview questions, and ' + manifest.length + ' downloads.');
