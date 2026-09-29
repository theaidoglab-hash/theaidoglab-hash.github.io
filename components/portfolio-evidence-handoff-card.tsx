import {
  PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS,
  portfolioEvidenceHandoffPackCopy
} from '@/lib/portfolio-evidence-handoff-pack';
import type { Locale } from '@/lib/types';

/**
 * A static reading card: the pack is deliberately separate from the local
 * planner so readers can inspect it without adding code to that client island.
 */
export function PortfolioEvidenceHandoffCard({ locale }: { locale: Locale }) {
  const copy = portfolioEvidenceHandoffPackCopy[locale];

  return <section className="planner-handoff-pack" aria-labelledby="portfolio-evidence-handoff-pack-title">
    <header>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="portfolio-evidence-handoff-pack-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>
    <div className="planner-handoff-pack-action">
      <a className="button secondary" href={PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS[locale]}>{copy.open}</a>
    </div>
    <div className="planner-handoff-pack-content">
      <section>
        <h3>{copy.includesHeading}</h3>
        <ul>{copy.includes.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
      <aside>
        <p>{copy.sourceLanguage}</p>
      </aside>
    </div>
    <p className="planner-handoff-pack-boundary" role="note">{copy.boundary}</p>
  </section>;
}
