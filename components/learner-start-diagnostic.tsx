'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/types';
import type {
  CodingLevel,
  DiagnosticCopy,
  Goal,
  LearnerStartRouteTarget,
  LearnerStartRoutes,
  StartRouteId,
  TimeBudget
} from '@/lib/learner-start-diagnostic-copy';

export type { LearnerStartRoutes } from '@/lib/learner-start-diagnostic-copy';

function chooseRoute(goal: Goal, coding: CodingLevel | '', time: TimeBudget | '', routes: LearnerStartRoutes): StartRouteId | undefined {
  if (goal === 'explore') {
    const preferred: StartRouteId[] = ['early', 'resources', 'roadmap'];
    return preferred.find(route => Boolean(routes[route]));
  }

  const preferred: StartRouteId[] = goal === 'interview'
    ? ['interview', 'resources']
    : goal === 'concepts'
      ? time === 'quick'
        ? coding === 'comfortable'
          ? ['technical', 'resources', 'roadmap']
          : ['resources', 'technical', 'roadmap']
        : coding === 'none'
          ? ['resources', 'technical', 'roadmap']
          : ['technical', 'roadmap', 'resources']
      : goal === 'portfolio'
        ? time === 'quick'
          ? ['portfolio', 'noCode', 'coding', 'resources']
          : coding === 'none'
          ? ['noCode', 'portfolio', 'resources']
          : coding === 'comfortable' && time === 'week'
            ? ['labs', 'coding', 'portfolio']
            : ['coding', 'portfolio', 'labs']
        : coding === 'none'
          ? ['noCode', 'resources']
          : coding === 'comfortable' && time !== 'quick'
            ? ['labs', 'coding', 'roadmap']
            : ['coding', 'roadmap', 'resources'];

  return preferred.find(route => Boolean(routes[route]));
}

function routeHref(
  target: LearnerStartRouteTarget | undefined,
  route: StartRouteId | undefined,
  coding: CodingLevel | '',
  time: TimeBudget | '',
  fallback: string
) {
  if (!target) return fallback;
  const href = typeof target === 'string'
    ? target
    : time === 'quick' && target.quickHref
      ? target.quickHref
      : target.href;
  if (route !== 'resources' || !coding) return href;
  const [baseHref, fragment] = href.split('#', 2);
  const separator = baseHref.includes('?') ? '&' : '?';
  const audience = coding === 'none' ? 'non-coder' : 'developer';
  const effort = time === 'week' ? 'project' : 'session';
  return `${baseHref}${separator}audience=${audience}&effort=${effort}#${fragment || 'resource-results'}`;
}

export function LearnerStartDiagnostic({ locale, copy, routes }: { locale: Locale; copy: DiagnosticCopy; routes: LearnerStartRoutes }) {
  const [goal, setGoal] = useState<Goal | ''>('');
  const [coding, setCoding] = useState<CodingLevel | ''>('');
  const [time, setTime] = useState<TimeBudget | ''>('');
  const recommendation = useMemo(
    () => goal === 'explore'
      ? chooseRoute(goal, '', '', routes)
      : goal && coding && time
        ? chooseRoute(goal, coding, time, routes)
        : undefined,
    [coding, goal, routes, time]
  );

  const recommendationCopy = recommendation
    ? time === 'quick'
      ? copy.quickRecommendations?.[recommendation] ?? copy.recommendations[recommendation]
      : copy.recommendations[recommendation]
    : undefined;
  const recommendationHref = recommendation
    ? routeHref(routes[recommendation], recommendation, coding, time, `/${locale}/resources`)
    : `/${locale}/resources`;
  const fields = [
    { legend: copy.goalLegend, name: 'learner-goal', values: copy.goals, selected: goal, setSelected: (value: string) => setGoal(value as Goal) },
    { legend: copy.codingLegend, name: 'learner-coding', values: copy.codingLevels, selected: coding, setSelected: (value: string) => setCoding(value as CodingLevel) },
    { legend: copy.timeLegend, name: 'learner-time', values: copy.timeBudgets, selected: time, setSelected: (value: string) => setTime(value as TimeBudget) }
  ];
  const visibleFields = goal === 'explore' ? fields.slice(0, 1) : fields;

  return <section id="learner-start" className="learner-start shell section" aria-labelledby="learner-start-title" tabIndex={-1}>
    <header className="learner-start__header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="learner-start-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>

    <div className="learner-start__layout">
      <form className="learner-start__questions">
        {visibleFields.map(field => <fieldset key={field.name}>
          <legend>{field.legend}</legend>
          <div className="learner-start__options">
            {Object.entries(field.values).map(([value, label]) => <label key={value}>
              <input type="radio" name={field.name} value={value} checked={field.selected === value} onChange={event => field.setSelected(event.target.value)} />
              <span>{label}</span>
            </label>)}
          </div>
        </fieldset>)}
      </form>

      <p className="sr-only" role="status" aria-live="polite">{recommendationCopy ? `${copy.resultEyebrow}: ${recommendationCopy.title}` : ''}</p>
      <aside className="learner-start__result">
        <p className="eyebrow">{copy.resultEyebrow}</p>
        <h3>{recommendationCopy?.title ?? copy.resultTitle}</h3>
        {recommendationCopy && recommendation ? <>
          <dl>
            <div><dt>{copy.whyLabel}</dt><dd>{recommendationCopy.why}</dd></div>
            <div><dt>{copy.nextLabel}</dt><dd>{recommendationCopy.next}</dd></div>
          </dl>
          <Link className="button primary" href={recommendationHref}>{recommendation === 'early' ? copy.exploreAction : recommendationCopy.action ?? copy.startAction} <span aria-hidden="true">→</span></Link>
        </> : <p>{copy.resultEmpty}</p>}
      </aside>
    </div>
    <p className="learner-start__boundary" role="note">{copy.localBoundary}</p>
  </section>;
}
