'use client';

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID,
  noCodePersonalCaseBuilderGateCopy
} from '@/lib/no-code-personal-case-builder-gate';
import type { Locale } from '@/lib/types';

const LazyNoCodePersonalCaseBuilder = lazy(() =>
  import('@/components/no-code-personal-case-builder').then(module => ({ default: module.NoCodePersonalCaseBuilder }))
);

function isPersonalCaseBuilderFragment() {
  const fragment = window.location.hash.slice(1);
  if (!fragment) return false;
  try {
    return decodeURIComponent(fragment) === NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID;
  } catch {
    return fragment === NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID;
  }
}

/**
 * The manual lab is useful without the longer personal worksheet. Keep its
 * activation boundary in the initial island, and load the worksheet only when
 * the reader asks for it or arrives through its documented fragment link.
 */
export function NoCodePersonalCaseBuilderGate({ locale }: { locale: Locale }) {
  const copy = noCodePersonalCaseBuilderGateCopy[locale];
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFocusFragment, setShouldFocusFragment] = useState(false);
  const [shouldFocusWorksheet, setShouldFocusWorksheet] = useState(false);

  const handleBuilderReady = useCallback(() => {
    if (!shouldFocusWorksheet) return;
    const firstField = document.getElementById('no-code-personal-case-businessSituation');
    firstField?.scrollIntoView({ block: 'center', behavior: 'auto' });
    firstField?.focus({ preventScroll: true });
    setShouldFocusWorksheet(false);
  }, [shouldFocusWorksheet]);

  useEffect(() => {
    function openForFragment() {
      if (!isPersonalCaseBuilderFragment()) return;
      setIsOpen(true);
      setShouldFocusFragment(true);
      setShouldFocusWorksheet(false);
    }

    openForFragment();
    window.addEventListener('hashchange', openForFragment);
    return () => window.removeEventListener('hashchange', openForFragment);
  }, []);

  useEffect(() => {
    if (!shouldFocusFragment) return;
    const frame = window.requestAnimationFrame(() => {
      const target = titleRef.current;
      if (target) {
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
        target.focus({ preventScroll: true });
      }
      setShouldFocusFragment(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [shouldFocusFragment]);

  function openBuilder() {
    setShouldFocusWorksheet(true);
    setIsOpen(true);
  }

  return <section className="no-code-personal-case-builder-gate-shell" aria-labelledby={NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID}>
    <header className="no-code-personal-case-builder-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id={NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID} ref={titleRef} tabIndex={-1}>{copy.title}</h2>
      <p>{copy.intro}</p>
      <aside role="note">{copy.localOnlyBoundary}</aside>
    </header>

    <div className="no-code-personal-case-builder-activation">
      <p>{copy.activationIntro}</p>
      {!isOpen ? <button
        type="button"
        className="button secondary"
        onClick={openBuilder}
      >{copy.activationAction}</button> : <p className="no-code-personal-case-builder-opened" role="status">{copy.openedAction}</p>}
    </div>

    {isOpen ? <Suspense fallback={<p className="no-code-personal-case-builder-loading" role="status" aria-live="polite">{copy.loading}</p>}>
      <div id="no-code-personal-case-builder-panel">
        <LazyNoCodePersonalCaseBuilder locale={locale} headingId={NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID} showHeader={false} onReady={handleBuilderReady} />
      </div>
    </Suspense> : null}
  </section>;
}
