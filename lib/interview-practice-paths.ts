import practicePathData from '@/content/interview-practice-paths.json';
import { normalizeLocaleContent, type Locale } from './types';

export type InterviewPracticePath = {
  id: string;
  topicSlugs: readonly string[];
  evidenceTasks?: readonly Record<Locale, string>[];
  copy: Record<Locale, {
    title: string;
    description: string;
  }>;
};

export type InterviewPracticeAfterDemoPath = {
  id: string;
  trackId: string;
  topicSlugs: readonly string[];
  copy: Record<Locale, {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  }>;
};

type PracticePathIndexCopy = Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  stepLabel: readonly string[];
  evidenceTaskLabel: string;
  finalLabel: string;
}>;

const normalizedPracticePathData = normalizeLocaleContent(practicePathData) as unknown as {
  index: PracticePathIndexCopy;
  paths: readonly InterviewPracticePath[];
  afterDemoPaths: readonly InterviewPracticeAfterDemoPath[];
};
export const interviewPracticePathIndexCopy = normalizedPracticePathData.index as PracticePathIndexCopy;
export const interviewPracticePaths = normalizedPracticePathData.paths as readonly InterviewPracticePath[];
export const interviewPracticeAfterDemoPaths = normalizedPracticePathData.afterDemoPaths as readonly InterviewPracticeAfterDemoPath[];

export function getInterviewPracticePathsForTopic(slug: string) {
  return interviewPracticePaths.filter(path => path.topicSlugs.includes(slug));
}

export function getInterviewPracticeAfterDemoPathsForTrack(trackId: string) {
  return interviewPracticeAfterDemoPaths.filter(path => path.trackId === trackId);
}

export function interviewPracticeAfterDemoPathAnchor(path: InterviewPracticeAfterDemoPath) {
  return `interview-practice-after-demo-${path.id}`;
}

export function nextInterviewPracticeTopic(path: InterviewPracticePath, slug: string) {
  const index = path.topicSlugs.indexOf(slug);
  return index >= 0 ? path.topicSlugs[index + 1] : undefined;
}
