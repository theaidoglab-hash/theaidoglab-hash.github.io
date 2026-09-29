import rawInterviewPrep from '@/content/roadmaps/ai-engineer-interview-prep.json';
import rawRoadmap from '@/content/roadmaps/ai-engineer-roadmap.json';
import rawStageCompletion from '@/content/roadmaps/ai-engineer-stage-completion.json';
import { normalizeLocaleContent, type Locale } from './types';

export type RoadmapStatus = 'available' | 'partial' | 'planned';
export type RoadmapLessonEntry = 'foundation' | 'sequence' | 'diagnostic';
export type RoadmapPracticeMode = 'guided-self-check' | 'runnable-practice';
export type RoadmapStageCompletionContract = Readonly<{
  criteria: Record<Locale, readonly string[]>;
  returnCondition: Record<Locale, string>;
}>;
export type RoadmapLessonContract = Readonly<{
  entry: RoadmapLessonEntry;
  prerequisiteStageId?: string;
  estimatedMinutes: Readonly<{ minimum: number; maximum: number }>;
  practiceMode: RoadmapPracticeMode;
  completion: RoadmapStageCompletionContract;
}>;
export type RoadmapResource = Readonly<{
  kind: 'article' | 'interview-question' | 'interview-prep' | 'lab';
  target: string;
  anchor?: string;
  title?: Record<Locale, string>;
  primary?: boolean;
}>;

export type RoadmapPhase = Readonly<{
  id: string;
  range: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  checkpoint: Record<Locale, string>;
}>;

export type RoadmapLearningRoute = Readonly<{
  id: string;
  range: string;
  startStage: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  action: Record<Locale, string>;
}>;

export type RoadmapLearningGuide = Readonly<{
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  root: Record<Locale, string>;
  routes: RoadmapLearningRoute[];
  loop: Readonly<{
    title: Record<Locale, string>;
    steps: ReadonlyArray<Readonly<{
      title: Record<Locale, string>;
      text: Record<Locale, string>;
    }>>;
  }>;
  boundary: Record<Locale, string>;
}>;

export type RoadmapStage = Readonly<{
  id: string;
  number: string;
  phase: string;
  status: RoadmapStatus;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  focus: string[];
  evidence: Record<Locale, string>;
  gap?: Record<Locale, string>;
  resources: RoadmapResource[];
  lessonContract: RoadmapLessonContract;
}>;

export type RoadmapSourceNote = Readonly<{
  label: Record<Locale, string>;
  text: Record<Locale, string>;
  reference?: Readonly<{
    url: string;
    label: Record<Locale, string>;
  }>;
}>;

export type AiEngineerRoadmap = Readonly<{
  id: 'ai-engineer-roadmap';
  status: 'review' | 'approved';
  visibility: 'public';
  updatedAt: string;
  reviewBy: string;
  phases: RoadmapPhase[];
  stages: RoadmapStage[];
  selfLearning: RoadmapLearningGuide;
  sourceNote: RoadmapSourceNote;
}>;

export type InterviewPrepTrack = Readonly<{
  id: string;
  number: string;
  status: RoadmapStatus;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  evidence: Record<Locale, string>;
  resources: RoadmapResource[];
}>;

export type AiEngineerInterviewPrep = Readonly<{
  id: 'ai-engineer-interview-prep';
  status: 'review' | 'approved';
  visibility: 'public';
  updatedAt: string;
  reviewBy: string;
  tracks: InterviewPrepTrack[];
  sourceNote: RoadmapSourceNote;
}>;

type RoadmapStageSource = Omit<RoadmapStage, 'lessonContract'>;
type AiEngineerRoadmapSource = Omit<AiEngineerRoadmap, 'stages'> & Readonly<{
  stages: RoadmapStageSource[];
}>;

function lessonContractForStage(
  stage: RoadmapStageSource,
  index: number,
  stages: readonly RoadmapStageSource[],
  diagnosticEntryNumbers: ReadonlySet<string>,
  completionByStage: Readonly<Record<string, RoadmapStageCompletionContract>>,
): RoadmapLessonContract {
  const hasRunnablePractice = stage.resources.some(resource => resource.kind === 'lab');
  const completion = completionByStage[stage.id];
  if (!completion) throw new Error(`Missing completion contract for roadmap stage ${stage.id}.`);
  const entry: RoadmapLessonEntry = index === 0
    ? 'foundation'
    : diagnosticEntryNumbers.has(stage.number)
      ? 'diagnostic'
      : 'sequence';

  return {
    entry,
    prerequisiteStageId: entry === 'sequence' ? stages[index - 1]?.id : undefined,
    estimatedMinutes: hasRunnablePractice
      ? { minimum: 60, maximum: 90 }
      : entry === 'foundation'
        ? { minimum: 30, maximum: 45 }
        : { minimum: 45, maximum: 75 },
    practiceMode: hasRunnablePractice ? 'runnable-practice' : 'guided-self-check',
    completion,
  };
}

function attachLessonContracts(
  source: AiEngineerRoadmapSource,
  completionByStage: Readonly<Record<string, RoadmapStageCompletionContract>>,
): AiEngineerRoadmap {
  const diagnosticEntryNumbers = new Set(source.selfLearning.routes.map(route => route.startStage));
  const stages = source.stages.map((stage, index) => ({
    ...stage,
    lessonContract: lessonContractForStage(stage, index, source.stages, diagnosticEntryNumbers, completionByStage),
  }));
  return { ...source, stages };
}

const normalizedRoadmap = normalizeLocaleContent(rawRoadmap) as unknown as AiEngineerRoadmapSource;
const normalizedStageCompletion = normalizeLocaleContent(rawStageCompletion) as unknown as Record<string, RoadmapStageCompletionContract>;

export const aiEngineerRoadmap = attachLessonContracts(normalizedRoadmap, normalizedStageCompletion);
export const aiEngineerInterviewPrep = normalizeLocaleContent(rawInterviewPrep) as unknown as AiEngineerInterviewPrep;

export type RoadmapArticleContext = Readonly<{
  stages: readonly RoadmapStage[];
  stage?: RoadmapStage;
  previousStage?: RoadmapStage;
  nextStage?: RoadmapStage;
}>;

export function primaryArticleForRoadmapStage(stage: RoadmapStage): RoadmapResource | undefined {
  return stage.resources.find(resource => resource.kind === 'article' && resource.primary)
    ?? stage.resources.find(resource => resource.kind === 'article');
}

/**
 * Recovers a stable roadmap context from the article slug itself. Primary
 * placement wins when a guide appears in more than one stage, so navigation
 * does not depend on a query string or browser history.
 */
export function roadmapArticleContext(
  articleSlug: string,
  roadmap: AiEngineerRoadmap = aiEngineerRoadmap,
): RoadmapArticleContext | undefined {
  const matchingStages = roadmap.stages.filter(stage => stage.resources.some(
    resource => resource.kind === 'article' && resource.target === articleSlug,
  ));
  if (!matchingStages.length) return undefined;
  const primaryStages = matchingStages.filter(candidate => candidate.resources.some(
    resource => resource.kind === 'article' && resource.target === articleSlug && resource.primary,
  ));
  const stage = primaryStages.length === 1
    ? primaryStages[0]
    : matchingStages.length === 1
      ? matchingStages[0]
      : undefined;
  if (!stage) return { stages: matchingStages };

  const index = roadmap.stages.findIndex(candidate => candidate.id === stage.id);
  return {
    stages: matchingStages,
    stage,
    previousStage: index > 0 ? roadmap.stages[index - 1] : undefined,
    nextStage: index >= 0 && index < roadmap.stages.length - 1 ? roadmap.stages[index + 1] : undefined,
  };
}

const roadmapLabRoutes: Record<string, string> = {
  'coding-starter-lab': 'coding-starter-lab',
  'build-lab': 'labs'
};

const roadmapInterviewPrepRoutes = {
  'ai-engineer-interview-prep': 'interview-lab#interview-prep-map'
} as const;

function isRoadmapInterviewPrepTarget(target: string): target is keyof typeof roadmapInterviewPrepRoutes {
  return Object.hasOwn(roadmapInterviewPrepRoutes, target);
}

export function roadmapResourcePath(locale: Locale, resource: RoadmapResource) {
  if (resource.kind === 'article') return `/${locale}/articles/${resource.target}`;
  if (resource.kind === 'lab') {
    const path = roadmapLabRoutes[resource.target] ?? resource.target;
    return `/${locale}/${path}${resource.anchor ? `#${resource.anchor}` : ''}`;
  }
  if (resource.kind === 'interview-prep') {
    const path = isRoadmapInterviewPrepTarget(resource.target)
      ? roadmapInterviewPrepRoutes[resource.target]
      : resource.target;
    return `/${locale}/${path}`;
  }
  return `/${locale}/interview-lab/${resource.target}`;
}
