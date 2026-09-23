'use client';
import { useMemo, useState } from 'react';
import type { ArticleMeta, Locale } from '@/lib/types';
import { CATEGORY_IDS } from '@/lib/types';
import { ArticleCard } from './site';
import { categories, ui } from '@/lib/i18n';

export default function Search({articles,locale}:{articles:ArticleMeta[];locale:Locale}){
  const [query,setQuery]=useState(''); const [type,setType]=useState('all'); const [category,setCategory]=useState('all'); const [freshness,setFreshness]=useState('all');
  const newestUpdate=Math.max(...articles.map(a=>new Date(`${a.updatedAt}T00:00:00Z`).getTime()));
  const filtered=useMemo(()=>articles.filter(a=>{
    const text=[a.translations[locale].title,a.translations[locale].description,...a.tags].join(' ').toLowerCase();
    const ageDays=(newestUpdate-new Date(`${a.updatedAt}T00:00:00Z`).getTime())/86400000;
    return text.includes(query.trim().toLowerCase())&&(type==='all'||a.type===type)&&(category==='all'||a.categoryId===category)&&(freshness==='all'||ageDays<=Number(freshness));
  }),[articles,locale,query,type,category,freshness,newestUpdate]);
  const filters=locale==='en'?{formats:'All formats',categories:'All categories',dates:'Any update date',days90:'Updated in 90 days',year:'Updated in 12 months'}:locale==='zh-Hans'?{formats:'所有格式',categories:'所有分类',dates:'所有更新日期',days90:'90 天内更新',year:'12 个月内更新'}:locale==='zh-TW'?{formats:'所有格式',categories:'所有分類',dates:'所有更新日期',days90:'90 天內更新',year:'12 個月內更新'}:{formats:'所有格式',categories:'所有分類',dates:'所有更新日期',days90:'90 日內更新',year:'12 個月內更新'};
  return <section className="search-block" aria-label="Search resources"><div className="search-controls"><label><span className="sr-only">{ui[locale].search as string}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={ui[locale].search as string}/></label><select value={type} onChange={e=>setType(e.target.value)} aria-label="Article type"><option value="all">{filters.formats}</option><option value="deep-dive">Deep dive</option><option value="tutorial">Tutorial</option><option value="portfolio-build">Portfolio build</option><option value="resource-guide">Resource guide</option></select><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Category"><option value="all">{filters.categories}</option>{CATEGORY_IDS.map(id=><option key={id} value={id}>{categories[id][locale].name}</option>)}</select><select value={freshness} onChange={e=>setFreshness(e.target.value)} aria-label="Freshness"><option value="all">{filters.dates}</option><option value="90">{filters.days90}</option><option value="365">{filters.year}</option></select></div>{filtered.length?<div className="article-grid">{filtered.map(a=><ArticleCard key={a.id} article={a} locale={locale}/>)}</div>:<p className="empty">{ui[locale].noResults as string}</p>}</section>;
}
