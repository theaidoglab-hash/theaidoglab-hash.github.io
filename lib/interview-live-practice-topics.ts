import type { InterviewQuestionPractice } from './interview-question-metadata';
import { extractInterviewerQuestion, readStandaloneInterviewQuestion } from './interview-question-content';
import type { Locale } from './types';

export type LiveInterviewPracticeTopic = Readonly<{
  number: string;
  slug: string;
  title: string;
  interviewerQuestion: string;
  practice: InterviewQuestionPractice;
}>;

type LocalizedInterviewTopic = Readonly<{
  number: string;
  slug: string;
  title: Record<Locale, string>;
  practice: Record<Locale, InterviewQuestionPractice>;
}>;

function interviewerQuestionFor(locale: Locale, topic: LocalizedInterviewTopic) {
  const markdown = readStandaloneInterviewQuestion(topic.slug, locale);
  const interviewerQuestion = markdown ? extractInterviewerQuestion(markdown, locale) : undefined;
  if (!interviewerQuestion) {
    throw new Error(`Could not project the interviewer question for ${topic.slug}/${locale}`);
  }
  return interviewerQuestion;
}

/**
 * The client rehearsal needs one label and one practice brief per topic.
 * Keep roadmap, attribution, anchors, other locales, and content routing on
 * the server where the rest of the standalone question is rendered.
 */
export function toLiveInterviewPracticeTopic(locale: Locale, topic: LocalizedInterviewTopic): LiveInterviewPracticeTopic {
  return {
    number: topic.number,
    slug: topic.slug,
    title: topic.title[locale],
    interviewerQuestion: interviewerQuestionFor(locale, topic),
    practice: topic.practice[locale]
  };
}

export function toLiveInterviewPracticeTopics(locale: Locale, topics: readonly LocalizedInterviewTopic[]) {
  return topics.map(topic => toLiveInterviewPracticeTopic(locale, topic));
}
