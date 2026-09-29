'use client';

import { useEffect, useState } from 'react';
import { LiveInterviewPractice } from '@/components/interview-live-practice';
import { liveInterviewPracticeGateCopy } from '@/lib/interview-live-practice-gate';
import type { LiveInterviewPracticeTopic } from '@/lib/interview-live-practice-topics';
import type { Locale } from '@/lib/types';

type InterviewLivePracticeLoaderProps = {
  locale: Locale;
  initialTopicSlug?: string;
  initialInterviewerQuestion?: string;
  topics?: readonly LiveInterviewPracticeTopic[];
};

/**
 * This module is intentionally lazy-loaded by the small activation gate. It
 * asks the same-origin server for the current build's permitted topic subset
 * only after a reader chooses to practise. The browser bundle therefore does
 * not carry the whole question library or an unscoped release manifest.
 */
export default function InterviewLivePracticeLoader({ locale, initialTopicSlug, initialInterviewerQuestion, topics: suppliedTopics }: InterviewLivePracticeLoaderProps) {
  const [topics, setTopics] = useState<LiveInterviewPracticeTopic[] | null>(suppliedTopics ? [...suppliedTopics] : null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (suppliedTopics) {
      setTopics([...suppliedTopics]);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    void fetch(`/api/interview-practice-topics?locale=${encodeURIComponent(locale)}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Interview practice topics could not be loaded.');
        const body = await response.json() as { topics?: unknown };
        if (!Array.isArray(body.topics)) throw new Error('Interview practice topics response was invalid.');
        setTopics(body.topics as LiveInterviewPracticeTopic[]);
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFailed(true);
      });
    return () => controller.abort();
  }, [locale, suppliedTopics]);

  if (failed) return <p role="alert">{liveInterviewPracticeGateCopy[locale].loadFailed}</p>;
  if (!topics) return <p role="status" aria-live="polite">{liveInterviewPracticeGateCopy[locale].loading}</p>;

  return <LiveInterviewPractice
    embedded
    locale={locale}
    topics={topics}
    initialTopicSlug={initialTopicSlug}
    initialInterviewerQuestion={initialInterviewerQuestion}
  />;
}
