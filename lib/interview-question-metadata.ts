import rawMetadata from '@/content/interview-question-metadata.json';
import { normalizeLocaleContent, type Locale } from './types';

export type InterviewQuestionPractice = Readonly<{
  scenario: string;
  trap: string;
  mechanism: string;
  tradeoff: string;
  failure: string;
  evidence: string;
}>;

export type InterviewQuestionCompanyAttribution = 'not-asserted';

export type InterviewQuestionMetadata = Readonly<{
  slug: string;
  companyAttribution: InterviewQuestionCompanyAttribution;
  roadmapStages: readonly string[];
  prepTracks: readonly string[];
  practice: Record<Locale, InterviewQuestionPractice>;
}>;

type InterviewQuestionMetadataDocument = Readonly<{
  questions: readonly InterviewQuestionMetadata[];
}>;

export const interviewQuestionMetadata = (normalizeLocaleContent(rawMetadata) as unknown as InterviewQuestionMetadataDocument).questions;

export const interviewQuestionMetadataBySlug = new Map(
  interviewQuestionMetadata.map(question => [question.slug, question]),
);

export function getInterviewQuestionMetadata(slug: string) {
  return interviewQuestionMetadataBySlug.get(slug);
}
