import legacyTopicSlugs from '@/content/interview-legacy-topic-slugs.json';
import type { Locale } from './types';

const legacyTopicSlugByNumber = legacyTopicSlugs as Readonly<Record<string, string>>;

export function legacyInterviewPracticePath(locale: Locale, topicNumber: string) {
  const slug = legacyTopicSlugByNumber[topicNumber];
  return slug ? `/${locale}/interview-lab/${slug}` : null;
}
