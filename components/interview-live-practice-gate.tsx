'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  LIVE_INTERVIEW_PRACTICE_ID,
  LIVE_INTERVIEW_PRACTICE_TITLE_ID,
  liveInterviewPracticeGateCopy
} from '@/lib/interview-live-practice-gate';
import type { LiveInterviewPracticeTopic } from '@/lib/interview-live-practice-topics';
import type { Locale } from '@/lib/types';

const LazyInterviewLivePractice = lazy(() => import('@/components/interview-live-practice-loader'));

type InterviewLivePracticeGateProps = {
  locale: Locale;
  initialTopicSlug?: string;
  initialInterviewerQuestion?: string;
  topics?: readonly LiveInterviewPracticeTopic[];
};

function targetsPracticeFragment() {
  const fragment = window.location.hash.slice(1);
  if (!fragment) return false;
  try {
    return decodeURIComponent(fragment) === LIVE_INTERVIEW_PRACTICE_ID;
  } catch {
    return fragment === LIVE_INTERVIEW_PRACTICE_ID;
  }
}

/**
 * An explicit activation boundary keeps the optional mock-interview UI out of
 * ordinary Interview Lab visits. The documented fragment link still opens it
 * for readers who arrive from a practice route or question-page CTA.
 */
export function InterviewLivePracticeGate({ locale, initialTopicSlug, initialInterviewerQuestion, topics }: InterviewLivePracticeGateProps) {
  const copy = liveInterviewPracticeGateCopy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focusAfterOpen, setFocusAfterOpen] = useState(false);

  useEffect(() => {
    function openForFragment() {
      if (!targetsPracticeFragment()) return;
      setFocusAfterOpen(true);
      setIsOpen(true);
    }

    openForFragment();
    window.addEventListener('hashchange', openForFragment);
    return () => window.removeEventListener('hashchange', openForFragment);
  }, []);

  useEffect(() => {
    if (!isOpen || !focusAfterOpen) return;
    const frame = window.requestAnimationFrame(() => {
      sectionRef.current?.focus({ preventScroll: true });
      setFocusAfterOpen(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusAfterOpen, isOpen]);

  function openPractice() {
    setFocusAfterOpen(true);
    setIsOpen(true);
  }

  return <section
    id={LIVE_INTERVIEW_PRACTICE_ID}
    ref={sectionRef}
    className="live-interview-practice"
    aria-labelledby={LIVE_INTERVIEW_PRACTICE_TITLE_ID}
    tabIndex={-1}
  >
    <div className="live-interview-heading">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id={LIVE_INTERVIEW_PRACTICE_TITLE_ID}>{copy.title}</h2>
      <p>{copy.intro}</p>
    </div>
    {!isOpen ? <div className="live-interview-activation">
      <button type="button" className="button primary" onClick={openPractice}>{copy.activate}</button>
    </div> : <Suspense fallback={<p className="live-interview-loading" role="status" aria-live="polite">{copy.loading}</p>}>
      <LazyInterviewLivePractice
        locale={locale}
        initialTopicSlug={initialTopicSlug}
        initialInterviewerQuestion={initialInterviewerQuestion}
        topics={topics}
      />
    </Suspense>}
  </section>;
}
