'use client';

import { lazy, Suspense, useState } from 'react';
import { AI_APP_COURSE_TITLE_ID, aiAppCourseGateCopy } from '@/lib/ai-app-course-gate';
import type { Locale } from '@/lib/types';

const LazyAiAppCourse = lazy(() =>
  import('@/components/ai-app-course').then(module => ({ default: module.AiAppCourse }))
);

/**
 * The whole course deliberately stays behind an explicit activation point.
 * The existing manual lab remains account-free and light; the richer course is
 * available when the reader elects to start it.
 */
export function AiAppCourseGate({ locale }: { locale: Locale }) {
  const copy = aiAppCourseGateCopy[locale];
  const [isOpen, setIsOpen] = useState(false);

  return <section className="no-code-lab-section" aria-labelledby={AI_APP_COURSE_TITLE_ID}>
    <div className="no-code-lab-section-heading">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id={AI_APP_COURSE_TITLE_ID}>{copy.title}</h2>
      <p>{copy.intro}</p>
      <aside className="no-code-lab-boundary" role="note">{copy.boundary}</aside>
    </div>

    <article className="no-code-lab-asset" style={{ marginTop: '28px' }}>
      <div><h3>{copy.courseShape}</h3><p>{copy.reviewStatus}</p></div>
      {!isOpen ? <div className="no-code-lab-actions"><button className="button secondary" type="button" onClick={() => setIsOpen(true)}>{copy.activation}</button></div>
        : <p role="status" aria-live="polite" style={{ margin: '18px 0 0', color: 'var(--accent-dark)', fontWeight: 700 }}>{copy.opened}</p>}
    </article>

    {isOpen ? <Suspense fallback={<p role="status" aria-live="polite" style={{ margin: '24px 0 0', color: 'var(--muted)' }}>{copy.loading}</p>}>
      <LazyAiAppCourse locale={locale} />
    </Suspense> : null}
  </section>;
}
