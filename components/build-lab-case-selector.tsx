'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type {
  BuildLabCaseId,
  BuildLabCaseSelectorCopy,
  BuildLabCaseSelectorMetaCopy,
  CodingStarterNextStepCopy,
} from '@/lib/build-lab-case-selector';
import { buildLabCaseSelectionHref } from '@/lib/build-lab-selection-url';
import type { Locale } from '@/lib/types';

export function BuildLabCaseSelector({
  locale,
  copy,
  metaCopy,
  codingStarterNextStep,
  availableCaseIds,
  initialCaseId,
  canPlanPortfolio = true,
}: {
  locale: Locale;
  copy: BuildLabCaseSelectorCopy;
  metaCopy: BuildLabCaseSelectorMetaCopy;
  codingStarterNextStep: CodingStarterNextStepCopy;
  availableCaseIds: readonly BuildLabCaseId[];
  initialCaseId?: BuildLabCaseId;
  canPlanPortfolio?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [caseId, setCaseId] = useState<BuildLabCaseId | undefined>(initialCaseId && availableCaseIds.includes(initialCaseId) ? initialCaseId : undefined);
  const selected = caseId ? copy.cases[caseId] : undefined;
  const selectedMeta = caseId ? metaCopy.cases[caseId] : undefined;

  useEffect(() => {
    function restoreCaseFromQuery() {
      const requestedCaseId = new URLSearchParams(window.location.search).get('case');
      if (requestedCaseId && availableCaseIds.includes(requestedCaseId as BuildLabCaseId)) {
        setCaseId(requestedCaseId as BuildLabCaseId);
      }
    }

    restoreCaseFromQuery();
    window.addEventListener('popstate', restoreCaseFromQuery);
    return () => window.removeEventListener('popstate', restoreCaseFromQuery);
  }, [availableCaseIds]);

  if (!availableCaseIds.length) return null;

  function selectCase(nextCaseId: BuildLabCaseId) {
    setCaseId(nextCaseId);
    const nextHref = buildLabCaseSelectionHref(pathname, window.location.search, nextCaseId);
    router.replace(nextHref, { scroll: false });
    window.requestAnimationFrame(() => window.dispatchEvent(new Event('aidog:url-state-change')));
  }

  return <section className="lab-case-selector" aria-labelledby="lab-case-selector-title">
    <header className="lab-case-selector-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="lab-case-selector-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>

    <label className="lab-case-selector-control" htmlFor="build-lab-case-goal">
      <span>{copy.goalLabel}</span>
      <select id="build-lab-case-goal" value={caseId ?? ''} onChange={event => selectCase(event.target.value as BuildLabCaseId)}>
        <option value="" disabled>{copy.selectionPlaceholder}</option>
        {availableCaseIds.map(id => <option key={id} value={id}>{copy.cases[id].label}</option>)}
      </select>
      <small>{copy.goalHelp}</small>
    </label>

    {selected && selectedMeta ? <article className="lab-case-selector-result">
      <p className="sr-only" role="status" aria-atomic="true">{copy.selectionStatus.replace('{case}', selected.title)}</p>
      <header>
        <p className="eyebrow">{copy.resultEyebrow}</p>
        <h3>{selected.title}</h3>
        <p>{selected.fit}</p>
      </header>
      <section className="lab-case-selector-first-artifact">
        <h4>{copy.firstArtifactHeading}</h4>
        <p>{selected.firstArtifact}</p>
      </section>
      <dl className="lab-case-selector-evidence">
        <div><dt>{metaCopy.timeLabel}</dt><dd>{selectedMeta.time}</dd></div>
        <div><dt>{metaCopy.prerequisiteLabel}</dt><dd>{selectedMeta.prerequisite}</dd></div>
      </dl>
      <div className="lab-case-selector-evidence">
        <section>
          <h4>{copy.technicalHeading}</h4>
          <p>{selected.technical}</p>
        </section>
        <section>
          <h4>{copy.deliveryHeading}</h4>
          <p>{selected.delivery}</p>
        </section>
      </div>
      <aside className="lab-case-selector-boundary">
        <h4>{copy.boundaryHeading}</h4>
        <p>{selected.boundary}</p>
      </aside>
      <Link className="button primary" href={`/${locale}${selected.href}`} style={{ marginTop: 24 }}>{selected.action} <span aria-hidden>→</span></Link>
    </article> : <article className="lab-case-selector-result">
      <header>
        <h3>{copy.emptySelection.title}</h3>
        <p>{copy.emptySelection.text}</p>
      </header>
      <div className="lab-actions" style={{ marginTop: 24 }}>
        {availableCaseIds.includes('no-code') ? <button type="button" className="button secondary" onClick={() => selectCase('no-code')}>{copy.emptySelection.noCodeAction} <span aria-hidden>→</span></button> : null}
        {availableCaseIds.includes('coding-starter') ? <button type="button" className="button secondary" onClick={() => selectCase('coding-starter')}>{copy.emptySelection.codingAction} <span aria-hidden>→</span></button> : null}
      </div>
    </article>}

    {caseId && canPlanPortfolio ? <aside className="lab-case-selector-own-idea">
      <div>
        <h3>{caseId === 'coding-starter' ? codingStarterNextStep.title : copy.ownIdeaTitle}</h3>
        <p>{caseId === 'coding-starter' ? codingStarterNextStep.text : copy.ownIdeaText}</p>
      </div>
      <Link className="button secondary" href={`/${locale}/portfolio-evidence-planner?starter=${caseId}${caseId === 'coding-starter' ? '#portfolio-capstone' : ''}`}>{caseId === 'coding-starter' ? codingStarterNextStep.action : copy.ownIdeaAction} <span aria-hidden>→</span></Link>
    </aside> : null}
    <p className="lab-case-selector-local-boundary" role="note">{copy.localBoundary}</p>
  </section>;
}
