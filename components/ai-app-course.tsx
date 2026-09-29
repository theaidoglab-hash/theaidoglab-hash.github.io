'use client';

import Image from 'next/image';
import { aiAppCourseCopy, type AiAppCourseLesson } from '@/lib/ai-app-course';
import type { Locale } from '@/lib/types';

function LessonCard({ lesson, labels }: { lesson: AiAppCourseLesson; labels: Pick<ReturnType<typeof getCopy>, 'objectiveLabel' | 'stepsLabel' | 'boundaryLabel' | 'completionLabel' | 'sourcesLabel'> }) {
  const headingId = `ai-app-course-lesson-${lesson.id}`;

  return <section className="no-code-lab-section" aria-labelledby={headingId}>
    <div className="no-code-lab-section-heading">
      <p className="eyebrow">{lesson.kind} · {lesson.id}</p>
      <h3 id={headingId} style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.18, letterSpacing: '-.03em' }}>{lesson.title}</h3>
      <p><strong>{lesson.scenario}</strong></p>
    </div>

    <div className="no-code-lab-assets">
      <article className="no-code-lab-asset">
        <div><h3>{labels.objectiveLabel}</h3><p>{lesson.objective}</p></div>
        <h4 style={{ margin: '22px 0 0', fontSize: '14px', color: 'var(--accent-dark)', letterSpacing: '.02em' }}>{labels.stepsLabel}</h4>
        <ol style={{ margin: '10px 0 0', paddingInlineStart: '22px', color: 'var(--ink)', fontSize: '14px', lineHeight: 1.65 }}>
          {lesson.steps.map(step => <li key={step} style={{ marginTop: '8px' }}>{step}</li>)}
        </ol>
        <aside className="no-code-lab-boundary" role="note" style={{ marginTop: '20px', fontSize: '14px' }}>
          <strong>{labels.boundaryLabel}：</strong>{lesson.boundary}
        </aside>
        <p style={{ margin: '18px 0 0', color: 'var(--accent-dark)', fontSize: '14px', lineHeight: 1.6 }}><strong>{labels.completionLabel}：</strong>{lesson.completion}</p>
      </article>

      <figure className="no-code-lab-asset" style={{ margin: 0, alignSelf: 'start' }}>
        <Image src={lesson.image.src} alt={lesson.image.alt} width={1600} height={1000} sizes="(max-width: 900px) 100vw, 50vw" style={{ display: 'block', width: '100%', height: 'auto' }} />
        <figcaption style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '13px', lineHeight: 1.58 }}>{lesson.image.caption}</figcaption>
      </figure>
    </div>

    {lesson.sources?.length ? <div className="no-code-lab-source-pack" style={{ marginTop: '20px' }}>
      <p><strong>{labels.sourcesLabel}</strong></p>
      <div className="no-code-lab-actions" style={{ marginTop: 0 }}>
        {lesson.sources.map(source => <a className="button secondary" href={source.href} key={source.href} target="_blank" rel="noreferrer">{source.label} <span aria-hidden>↗</span></a>)}
      </div>
    </div> : null}
  </section>;
}

function getCopy(locale: Locale) {
  return aiAppCourseCopy[locale];
}

/** The large course is lazy-loaded from AiAppCourseGate. */
export function AiAppCourse({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return <div style={{ marginTop: '34px' }}>
    <section className="no-code-lab-section" aria-labelledby="ai-app-course-content-title">
      <div className="no-code-lab-section-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="ai-app-course-content-title">{copy.title}</h2>
        <p>{copy.intro}</p>
        <aside className="no-code-lab-boundary" role="note">{copy.startNote}</aside>
      </div>

      <article className="no-code-lab-asset" style={{ marginTop: '28px' }}>
        <details>
          <summary>{copy.promptTitle}</summary>
          <p>{copy.promptIntro}</p>
          <pre role="region" aria-label={copy.promptTitle} tabIndex={0}><code>{copy.prompt}</code></pre>
        </details>
      </article>
    </section>

    <section className="no-code-lab-section" aria-labelledby="ai-app-course-map-title">
      <div className="no-code-lab-section-heading">
        <p className="eyebrow">01–07</p>
        <h2 id="ai-app-course-map-title">{copy.mapTitle}</h2>
      </div>
      <ol className="no-code-lab-setup">
        {copy.lessons.map(lesson => <li key={lesson.id}>
          <span>{lesson.id}</span>
          <div><h3>{lesson.title}</h3><p>{lesson.kind}</p></div>
        </li>)}
      </ol>
      <p style={{ margin: '18px 0 0', color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6 }}>{copy.sourceNote}</p>
    </section>

    {copy.lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} labels={copy} />)}

    <section className="no-code-lab-section" aria-labelledby="ai-app-course-closing-title">
      <div className="no-code-lab-section-heading">
        <p className="eyebrow">{copy.closing.eyebrow}</p>
        <h2 id="ai-app-course-closing-title">{copy.closing.title}</h2>
        <p>{copy.closing.text}</p>
        <aside className="no-code-lab-boundary" role="note">{copy.closing.boundary}</aside>
      </div>
      <div className="no-code-lab-assets">
        <figure className="no-code-lab-asset" style={{ margin: 0, alignSelf: 'start' }}>
          <Image src={copy.closing.image.src} alt={copy.closing.image.alt} width={1600} height={1000} sizes="(max-width: 900px) 100vw, 50vw" style={{ display: 'block', width: '100%', height: 'auto' }} />
          <figcaption style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '13px', lineHeight: 1.58 }}>{copy.closing.image.caption}</figcaption>
        </figure>
        <article className="no-code-lab-asset"><h3>{copy.completionLabel}</h3><ol style={{ margin: '14px 0 0', paddingInlineStart: '22px', fontSize: '14px', lineHeight: 1.65 }}>{copy.closing.items.map(item => <li key={item} style={{ marginTop: '10px' }}>{item}</li>)}</ol></article>
      </div>
    </section>
  </div>;
}
