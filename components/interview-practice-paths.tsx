import Link from 'next/link';
import { interviewPracticePathIndexCopy, interviewPracticePaths } from '@/lib/interview-practice-paths';
import { interviewPracticePath, interviewTopics, type InterviewTopic } from '@/lib/interview-lab';
import type { Locale } from '@/lib/types';

export function InterviewPracticePaths({ locale, topics = interviewTopics }: { locale: Locale; topics?: readonly InterviewTopic[] }) {
  const copy = interviewPracticePathIndexCopy[locale];
  const topicsBySlug = new Map(topics.map(topic => [topic.slug, topic]));
  const visiblePaths = interviewPracticePaths.filter(path => path.topicSlugs.every(slug => topicsBySlug.has(slug)));

  if (!visiblePaths.length) return null;

  return <section id="interview-practice-paths" className="interview-practice-paths" aria-labelledby="interview-practice-paths-title" tabIndex={-1}>
    <header className="interview-practice-paths-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="interview-practice-paths-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>
    <div className="interview-practice-path-grid">
      {visiblePaths.map(path => {
        const finalTopic = topicsBySlug.get(path.topicSlugs.at(-1) ?? '');
        return <article id={`interview-practice-path-${path.id}`} className="interview-practice-path-card" key={path.id} tabIndex={-1}>
          <h3>{path.copy[locale].title}</h3>
          <p>{path.copy[locale].description}</p>
          <ol>
            {path.topicSlugs.map((slug, index) => {
              const topic = topicsBySlug.get(slug);
              if (!topic) return null;
              const evidenceTask = path.evidenceTasks?.[index]?.[locale];
              return <li key={topic.slug}>
                <Link href={interviewPracticePath(locale, topic)}>
                  <span>{String(index + 1).padStart(2, '0')} · {copy.stepLabel[index]}</span>
                  <strong>{topic.title[locale]}</strong>
                  <small>{topic.number} / {topics.length} <span aria-hidden>→</span></small>
                </Link>
                {evidenceTask ? <p className="interview-practice-evidence-task"><span>{copy.evidenceTaskLabel}</span>{evidenceTask}</p> : null}
              </li>;
            })}
          </ol>
          {finalTopic && <Link className="button secondary" href={`${interviewPracticePath(locale, finalTopic)}#live-interview-practice`}>{copy.finalLabel} <span aria-hidden>→</span></Link>}
        </article>;
      })}
    </div>
  </section>;
}
