import Link from 'next/link';
import {
  interviewPracticeAfterDemoPathAnchor,
  interviewPracticeAfterDemoPaths,
} from '@/lib/interview-practice-paths';
import { interviewPracticePath, interviewTopics, type InterviewTopic } from '@/lib/interview-lab';
import type { Locale } from '@/lib/types';

export function InterviewAfterDemoPaths({ locale, topics = interviewTopics }: { locale: Locale; topics?: readonly InterviewTopic[] }) {
  const topicsBySlug = new Map(topics.map(topic => [topic.slug, topic]));
  const visiblePaths = interviewPracticeAfterDemoPaths.filter(path => path.topicSlugs.every(slug => topicsBySlug.has(slug)));

  if (!visiblePaths.length) return null;

  return <section id="interview-practice-after-demo-paths" className="interview-after-demo-paths">
    {visiblePaths.map(path => {
      const firstTopic = topicsBySlug.get(path.topicSlugs[0]);
      const copy = path.copy[locale];
      return <article id={interviewPracticeAfterDemoPathAnchor(path)} className="interview-after-demo-path" key={path.id} tabIndex={-1}>
        <header>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
        </header>
        <nav aria-label={copy.title}>
          <ol>
            {path.topicSlugs.map((slug, index) => {
              const topic = topicsBySlug.get(slug);
              if (!topic) return null;
              return <li key={topic.slug}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Link href={interviewPracticePath(locale, topic)}>{topic.title[locale]} <small>{topic.number} / {topics.length} <span aria-hidden>→</span></small></Link>
              </li>;
            })}
          </ol>
        </nav>
        {firstTopic ? <Link className="button secondary" href={interviewPracticePath(locale, firstTopic)}>{copy.action} <span aria-hidden>→</span></Link> : null}
      </article>;
    })}
  </section>;
}
