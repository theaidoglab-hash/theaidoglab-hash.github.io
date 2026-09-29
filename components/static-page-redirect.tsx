'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * GitHub Pages cannot issue a server redirect. Keep a visible fallback link
 * for old bookmarks, then replace the browser history entry after hydration.
 */
export function StaticPageRedirect({ href, title, detail, action }: {
  href: string;
  title: string;
  detail: string;
  action: string;
}) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return <section className="shell page" aria-live="polite">
    <header className="page-header">
      <h1>{title}</h1>
      <p>{detail}</p>
      <p><Link className="button primary" href={href}>{action} <span aria-hidden>→</span></Link></p>
    </header>
  </section>;
}
