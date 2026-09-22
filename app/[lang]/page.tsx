import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard, CategoryGrid } from '@/components/site';
import Waitlist from '@/components/waitlist';
import { getArticles } from '@/lib/content';
import { isLocale, ui } from '@/lib/i18n';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!isLocale(lang))return{};return{title:ui[lang].brand as string,alternates:{canonical:`/${lang}`,languages:{'zh-Hant':'/zh-Hant','zh-Hans':'/zh-Hans',en:'/en','x-default':'/'}}};}
export default async function Home({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();const t=ui[lang];const articles=getArticles();return <>
  <section className="hero shell"><div className="hero-copy"><p className="eyebrow">AUSTRALIAN AI CAREER EVIDENCE</p><h1>{t.hero as string}</h1><p className="hero-intro">{t.intro as string}</p><div className="hero-actions"><Link className="button primary" href={`/${lang}/start-here`}>{(t.nav as string[])[0]}</Link><Link className="button secondary" href={`/${lang}/resources`}>{t.latest as string}</Link></div></div><div className="evidence-map" aria-label="Evidence workflow"><div><span>01</span><strong>Role</strong><small>What must be delivered?</small></div><div><span>02</span><strong>Build</strong><small>What decision can be inspected?</small></div><div><span>03</span><strong>Evidence</strong><small>What survives follow-up?</small></div></div></section>
  <section className="shell section"><p className="eyebrow">{t.browse as string}</p><h2>{lang==='en'?'One library, five decisions':lang==='zh-Hans'?'一个资源库，五个关键决定':'一個資源庫，五個關鍵決定'}</h2><CategoryGrid locale={lang}/></section>
  <section className="shell section"><div className="section-heading"><div><p className="eyebrow">{t.latest as string}</p><h2>{lang==='en'?'Built to be used, not skimmed':'不是重貼，而是可落手使用的指南'}</h2></div><Link className="text-link" href={`/${lang}/resources`}>{lang==='en'?'Explore all':'查看全部'} →</Link></div><div className="article-grid">{articles.slice(0,3).map(a=><ArticleCard article={a} locale={lang} key={a.id}/>)}</div></section>
  <div className="shell section"><Waitlist locale={lang}/></div>
  </>}
