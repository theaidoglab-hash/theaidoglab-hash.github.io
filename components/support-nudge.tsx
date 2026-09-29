import Link from 'next/link';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

const copy: Record<Locale, { eyebrow: string; title: string; text: string; action: string }> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '可選支持',
    title: '如果你想幫呢度繼續更新',
    text: '免費資源會繼續公開。自選 US$5／月支持只用於維護，唔會交換個人建議、優先回覆或任何結果承諾。',
    action: '了解自選支持'
  },
  'zh-TW': {
    eyebrow: '可選支持',
    title: '如果這份資源讓你少走了一點彎路',
    text: '免費資源會繼續公開。可選 US$5／月支持只用於維護，不會交換個人建議、優先回覆或任何結果承諾。',
    action: '了解可選支持'
  },
  'zh-Hans': {
    eyebrow: '可选支持',
    title: '如果这份资源让你少走了一点弯路',
    text: '免费资源会继续公开。可选 US$5／月支持只用于维护，不会交换个人建议、优先回复或任何结果承诺。',
    action: '了解可选支持'
  },
  en: {
    eyebrow: 'OPTIONAL SUPPORT',
    title: 'If this resource saved you a little unnecessary work',
    text: 'Free material remains public. Optional US$5/month support maintains it; it does not buy individual advice, priority replies, or an outcome promise.',
    action: 'Learn about optional support'
  }
});

export function SupportNudge({ locale }: { locale: Locale }) {
  if (!isRouteSurfaceEnabledInCurrentBuild('support')) return null;
  const text = copy[locale];
  return <aside className="support-nudge" aria-labelledby="support-nudge-title">
    <p className="eyebrow">{text.eyebrow}</p>
    <h2 id="support-nudge-title">{text.title}</h2>
    <p>{text.text}</p>
    <Link className="text-link" href={`/${locale}/support`}>{text.action} <span aria-hidden>→</span></Link>
  </aside>;
}
