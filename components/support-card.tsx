import type { Locale } from '@/lib/types';
import { getBuyMeACoffeeSupportUrl, supportCopy } from '@/lib/support';

export function SupportCard({ locale }: { locale: Locale }) {
  const copy = supportCopy[locale];
  const supportUrl = getBuyMeACoffeeSupportUrl();

  return <section className="support-card" aria-labelledby="support-card-title">
    <div className="support-card-copy">
      <p className="eyebrow">{copy.eyebrow}</p>
      <p className="support-price">{copy.monthlyAsk}</p>
      <h2 id="support-card-title">{copy.cardTitle}</h2>
      <p>{copy.cardBody}</p>
    </div>
    <div className="support-card-action">
      <a className="button primary" href={supportUrl} target="_blank" rel="noreferrer" aria-label={`${copy.action}. ${copy.actionNewTab}`}>
        {copy.action} <span aria-hidden="true">↗</span>
      </a>
    </div>
    <aside className="support-boundary" aria-label={copy.boundaryTitle}>
      <strong>{copy.boundaryTitle}</strong>
      <p>{copy.boundary}</p>
    </aside>
  </section>;
}
