import {
  interviewCapabilityGroups,
  interviewTopics,
  type InterviewCapabilityGroup,
  type InterviewTopic,
} from './interview-lab';
import { interviewLabPublication } from './interview-lab-publication';
import {
  selectInterviewCapabilityGroups,
  selectInterviewPrepForReleaseScope,
  selectInterviewTopicsForReleaseScope,
  selectRoadmapForReleaseScope,
} from './release-learning-selection';
import { getActiveReleaseScope } from './release-runtime-scope-current';
import { aiEngineerInterviewPrep, aiEngineerRoadmap, type AiEngineerInterviewPrep, type AiEngineerRoadmap } from './roadmaps';

/**
 * Server-only accessors for learning-map routes. They use the same opt-in
 * release scope as article/lab selection and deliberately keep the raw
 * manifest out of client modules.
 */
export function getReleaseScopedRoadmap(): AiEngineerRoadmap | null {
  return selectRoadmapForReleaseScope(aiEngineerRoadmap, getActiveReleaseScope());
}

export function getReleaseScopedInterviewPrep(): AiEngineerInterviewPrep | null {
  return selectInterviewPrepForReleaseScope(aiEngineerInterviewPrep, getActiveReleaseScope());
}

export function getReleaseScopedInterviewTopics(): InterviewTopic[] {
  return selectInterviewTopicsForReleaseScope(
    interviewTopics,
    interviewLabPublication,
    getActiveReleaseScope(),
  );
}

export function getReleaseScopedInterviewTopic(slug: string): InterviewTopic | undefined {
  return getReleaseScopedInterviewTopics().find(topic => topic.slug === slug);
}

export function getReleaseScopedInterviewCapabilityGroups(): InterviewCapabilityGroup[] {
  return selectInterviewCapabilityGroups(interviewCapabilityGroups, getReleaseScopedInterviewTopics());
}
