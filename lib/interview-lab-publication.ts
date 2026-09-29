import rawPublication from '@/content/interview-lab-publication.json';
import type { InterviewLabPublicationState } from './release-learning-selection';

type InterviewLabPublication = InterviewLabPublicationState & Readonly<{
  id: 'interview-lab';
  updatedAt: string;
  reviewBy: string;
}>;

/**
 * Question teaching metadata names the exercise; this record owns whether
 * that collection can be selected for a public release. It remains review
 * only until an owner performs a separate content and rights review.
 */
export const interviewLabPublication = rawPublication as InterviewLabPublication;
