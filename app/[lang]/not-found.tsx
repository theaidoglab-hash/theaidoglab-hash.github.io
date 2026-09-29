'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; navigation: string; start: string; library: string; practice: string }> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '搵唔到呢一頁',
    title: '呢個連結可能已搬位，或者本身唔存在。',
    intro: '由一條清楚嘅路重新開始：揀你而家想建立嘅證據，或者直接練一條面試題。',
    navigation: '下一步',
    start: '由開始這裡重新揀路',
    library: '瀏覽全部指南',
    practice: '去面試練習'
  },
  'zh-TW': {
    eyebrow: '找不到這一頁',
    title: '這個連結可能已搬移，或原本就不存在。',
    intro: '從一條清楚的路重新開始：選擇你現在想建立的證據，或直接練習一題面試題。',
    navigation: '下一步',
    start: '從這裡重新選路',
    library: '瀏覽全部指南',
    practice: '前往面試練習'
  },
  'zh-Hans': {
    eyebrow: '找不到这个页面',
    title: '这个链接可能已移动，或原本就不存在。',
    intro: '从一条清楚的路线重新开始：选择你现在想建立的证据，或直接练习一道面试题。',
    navigation: '下一步',
    start: '从这里重新选路线',
    library: '浏览全部指南',
    practice: '前往面试练习'
  },
  en: {
    eyebrow: 'PAGE NOT FOUND',
    title: 'This link may have moved, or it may not exist.',
    intro: 'Restart from a clear route: choose the evidence you want to build, or practise one interview question directly.',
    navigation: 'Next steps',
    start: 'Choose a route from Start here',
    library: 'Browse all guides',
    practice: 'Open interview practice'
  }
});

export default function LocalizedNotFound() {
  const params = useParams<{ lang?: string | string[] }>();
  const rawLocale = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const locale = rawLocale && isLocale(rawLocale) ? rawLocale : 'zh-Hant';
  const text = copy[locale];

  return <div className="shell page recovery-page">
    <header className="page-header">
      <p className="eyebrow">{text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p>{text.intro}</p>
    </header>
    <nav className="hero-actions" aria-label={text.navigation}>
      <Link className="button primary" href={`/${locale}#start-here`}>{text.start}</Link>
      <Link className="button secondary" href={`/${locale}/resources`}>{text.library}</Link>
      <Link className="button secondary" href={`/${locale}/interview-lab`}>{text.practice}</Link>
    </nav>
  </div>;
}
