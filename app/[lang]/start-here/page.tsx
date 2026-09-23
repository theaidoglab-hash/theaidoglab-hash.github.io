import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryGrid } from '@/components/site';
import { isLocale } from '@/lib/i18n';

const copy={
  'zh-HK':{title:'先由決定開始，不要再堆一個工具',intro:'先選最接近你目前卡位的問題。每條路最後都要產出可檢查、可改善的證據。',browse:'瀏覽全部指南'},
  'zh-TW':{title:'先從決定開始，不要再堆一個工具',intro:'先選擇最接近你目前卡關的問題。每條路最後都要產出可檢查、可改善的證據。',browse:'瀏覽全部指南'},
  'zh-Hans':{title:'先从决定开始，不要再堆一个工具',intro:'先选择最接近你目前瓶颈的问题。每条路线最后都要产出可检查、可改善的证据。',browse:'浏览全部指南'},
  en:{title:'Start with the decision, not another tool',intro:'Choose the question closest to your current bottleneck. Each path ends in evidence you can inspect and improve.',browse:'Browse every guide'}
} as const;

export default async function Start({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();const t=copy[lang];return <div className="shell page"><header className="page-header"><p className="eyebrow">START HERE</p><h1>{t.title}</h1><p>{t.intro}</p></header><CategoryGrid locale={lang}/><p className="start-cta"><Link className="button primary" href={`/${lang}/resources`}>{t.browse}</Link></p></div>}
