import type { ReactNode } from 'react';

export type LearningRouteSwitcherCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  legend: string;
  selectedLabel: string;
  chooseLabel: string;
  early: { label: string; detail: string };
  engineer: { label: string; detail: string };
};

type LearningRouteSwitcherProps = {
  copy: LearningRouteSwitcherCopy;
  earlyRoute: ReactNode;
  engineerRoute: ReactNode;
  initialRoute?: 'early' | 'engineer';
};

/**
 * A native-radio route switcher deliberately keeps both learning paths in the
 * server-rendered document. It needs no client JavaScript, supports standard
 * keyboard radio behaviour, and preserves existing roadmap fragment links.
 */
export function LearningRouteSwitcher({ copy, earlyRoute, engineerRoute, initialRoute = 'engineer' }: LearningRouteSwitcherProps) {
  return <section className="learning-route-switcher" aria-labelledby="learning-route-switcher-title">
    <header className="learning-route-switcher__header roadmap-timeline-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="learning-route-switcher-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>

    <fieldset className="learning-route-switcher__choices">
      <legend>{copy.legend}</legend>
      <input
        id="learning-route-early"
        className="sr-only"
        type="radio"
        name="learning-route"
        value="early"
        aria-controls="learning-route-panel-early"
        defaultChecked={initialRoute === 'early'}
      />
      <input
        id="learning-route-engineer"
        className="sr-only"
        type="radio"
        name="learning-route"
        value="engineer"
        aria-controls="learning-route-panel-engineer"
        defaultChecked={initialRoute === 'engineer'}
      />

      <div className="learning-route-switcher__options">
        <label className="learning-route-switcher__option" htmlFor="learning-route-early">
          <span className="learning-route-switcher__option-title">{copy.early.label}</span>
          <small className="learning-route-switcher__option-detail">{copy.early.detail}</small>
          <span className="learning-route-switcher__choice-state learning-route-switcher__choice-state--selected">{copy.selectedLabel}</span>
          <span className="learning-route-switcher__choice-state learning-route-switcher__choice-state--choose">{copy.chooseLabel}</span>
        </label>
        <label className="learning-route-switcher__option" htmlFor="learning-route-engineer">
          <span className="learning-route-switcher__option-title">{copy.engineer.label}</span>
          <small className="learning-route-switcher__option-detail">{copy.engineer.detail}</small>
          <span className="learning-route-switcher__choice-state learning-route-switcher__choice-state--selected">{copy.selectedLabel}</span>
          <span className="learning-route-switcher__choice-state learning-route-switcher__choice-state--choose">{copy.chooseLabel}</span>
        </label>
      </div>

      <div className="learning-route-switcher__panels">
        <section id="learning-route-panel-early" className="learning-route-switcher__panel learning-route-switcher__panel--early" aria-label={copy.early.label}>
          {earlyRoute}
        </section>
        <section id="learning-route-panel-engineer" className="learning-route-switcher__panel learning-route-switcher__panel--engineer" aria-label={copy.engineer.label}>
          {engineerRoute}
        </section>
      </div>
    </fieldset>
  </section>;
}
