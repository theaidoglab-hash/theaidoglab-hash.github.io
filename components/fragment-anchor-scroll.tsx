'use client';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect } from 'react';

function revealContainingDetails(target: HTMLElement) {
  let element: HTMLElement | null = target;
  while (element) {
    if (element instanceof HTMLDetailsElement && !element.open) element.open = true;
    element = element.parentElement;
  }
}

function scrollToFragmentTarget(target: HTMLElement) {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  // Fragment handoffs can point many screens down a learner route. Keep the
  // page-wide smooth scrolling for ordinary navigation, but make an explicit
  // destination available as soon as it receives focus.
  root.style.scrollBehavior = 'auto';
  try {
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
  } finally {
    root.style.scrollBehavior = previousScrollBehavior;
  }
}

function focusFragment(fragment: string) {
  if (!fragment) return false;
  let targetId = fragment;
  try {
    targetId = decodeURIComponent(fragment);
  } catch {
    // An invalid URL escape must not break the page's client-side navigation.
  }
  const target = document.getElementById(targetId);
  if (!target) return false;
  revealContainingDetails(target);
  scrollToFragmentTarget(target);
  if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  return true;
}

type RoadmapStagePhase = Readonly<{ number: string; phase: string }>;

function scrollToFragment(roadmapStages: readonly RoadmapStagePhase[] = []) {
  const fragment = window.location.hash.slice(1);
  if (focusFragment(fragment) || !fragment.startsWith('roadmap-stage-')) return;
  const number = fragment.slice('roadmap-stage-'.length);
  const stage = roadmapStages.find(candidate => candidate.number === number);
  if (!stage) return;
  const url = new URL(window.location.href);
  if (url.searchParams.get('phase') === stage.phase) return;
  url.searchParams.set('phase', stage.phase);
  window.location.replace(url.toString());
}

type FragmentAnchorLinkProps = {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
};

export function FragmentAnchorLink({ href, className, children }: FragmentAnchorLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    window.requestAnimationFrame(() => focusFragment(href.slice(1)));
  }

  return <a className={className} href={href} onClick={handleClick}>{children}</a>;
}

export function FragmentAnchorScroll({ roadmapStages = [] }: { roadmapStages?: readonly RoadmapStagePhase[] } = {}) {
  useEffect(() => {
    const handleFragment = () => scrollToFragment(roadmapStages);
    const frame = window.requestAnimationFrame(handleFragment);
    window.addEventListener('hashchange', handleFragment);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', handleFragment);
    };
  }, [roadmapStages]);

  return null;
}
