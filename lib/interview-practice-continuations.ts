import continuationData from '@/content/interview-practice-continuations.json';
import { getInterviewQuestionMetadata } from './interview-question-metadata';
import { normalizeLocaleContent, type Locale } from './types';

export type InterviewPracticeCapability = Readonly<{
  id: string;
  topicSlugs: readonly string[];
  focus: Record<Locale, string>;
}>;

type InterviewPracticeContinuationCopy = Record<Locale, {
  eyebrow: string;
  nextLead: string;
  nextAction: string;
  rehearsalLead: string;
  rehearsalAction: string;
}>;

const normalizedContinuationData = normalizeLocaleContent(continuationData) as unknown as {
  copy: InterviewPracticeContinuationCopy;
  capabilities: readonly InterviewPracticeCapability[];
};
export const interviewPracticeContinuationCopy = normalizedContinuationData.copy as InterviewPracticeContinuationCopy;
export const interviewPracticeCapabilities = normalizedContinuationData.capabilities as readonly InterviewPracticeCapability[];

const practiceCapabilityById = new Map(
  interviewPracticeCapabilities.map(capability => [capability.id, capability]),
);

export function getInterviewPracticeContinuation(slug: string) {
  const metadata = getInterviewQuestionMetadata(slug);
  const capability = metadata ? practiceCapabilityById.get(metadata.prepTracks[0]) : undefined;
  if (!capability) return undefined;

  const index = capability.topicSlugs.indexOf(slug);
  if (index < 0) return undefined;

  return {
    capability,
    nextTopicSlug: capability.topicSlugs[index + 1]
  };
}
