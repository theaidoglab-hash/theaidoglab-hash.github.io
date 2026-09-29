'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { Locale } from '@/lib/types';

function preferredLocale(): Locale {
  const saved = window.localStorage.getItem('aidog_locale');
  if (saved === 'zh-Hant' || saved === 'zh-Hans' || saved === 'en') return saved;

  for (const language of navigator.languages) {
    const normalized = language.toLowerCase();
    if (normalized === 'zh-hk' || normalized === 'zh-mo' || normalized === 'zh-tw' || normalized.startsWith('zh-hant')) return 'zh-Hant';
    if (normalized === 'zh-cn' || normalized === 'zh-sg' || normalized.startsWith('zh-hans')) return 'zh-Hans';
    if (normalized.startsWith('en')) return 'en';
  }

  return 'en';
}

/**
 * A static host cannot inspect request headers or set a locale cookie. Keep
 * the root entry point usable by choosing a locale only in the visitor's
 * browser, while every locale route remains directly linkable and crawlable.
 */
export default function RootLocaleRedirect() {
  useEffect(() => {
    const locale = preferredLocale();
    const basePath = window.location.pathname.replace(/\/$/, '');
    window.location.replace(`${basePath}/${locale}${window.location.search}${window.location.hash}`);
  }, []);

  return <main className="shell page"><p>Opening AI.DOG…</p><p><Link href="/zh-Hant/">繁體中文</Link> · <Link href="/en/">English</Link></p></main>;
}
