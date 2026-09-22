import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CategoryGrid } from '@/components/site';
import { isLocale } from '@/lib/i18n';
export default async function Start({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();return <div className="shell page"><header className="page-header"><p className="eyebrow">START HERE</p><h1>{lang==='en'?'Start with the decision, not another tool':lang==='zh-Hans'?'先从决定开始，不要再堆一个工具':'先由決定開始，不要再堆一個工具'}</h1><p>{lang==='en'?'Choose the question closest to your current bottleneck. Each path ends in evidence you can inspect and improve.':'先選最接近你目前卡位的問題。每條路最後都要產出可檢查、可改善的證據。'}</p></header><CategoryGrid locale={lang}/><p className="start-cta"><Link className="button primary" href={`/${lang}/resources`}>{lang==='en'?'Browse every guide':'瀏覽全部指南'}</Link></p></div>}
