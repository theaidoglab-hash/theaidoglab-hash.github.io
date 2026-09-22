import React from 'react';
import rawArticles from '@/content/articles.json';
import rawBodies from '@/content/article-bodies.json';
import { CATEGORY_IDS, LOCALES, type ArticleMeta, type CategoryId, type Locale } from './types';

const articles = rawArticles as ArticleMeta[];

export function getArticles() { return articles.filter(a => ['review','approved'].includes(a.status) && a.visibility === 'public'); }
export function getArticle(slug:string) { return getArticles().find(a => a.slug === slug); }
export function getCategoryArticles(category:CategoryId) { return getArticles().filter(a => a.categoryId === category); }
export function articlePath(article:ArticleMeta, locale:Locale) { return `/${locale}/articles/${article.slug}`; }

export function readArticle(article:ArticleMeta, locale:Locale) {
  return (rawBodies as Record<string,Record<Locale,string>>)[article.id][locale];
}

function inline(text:string, key:string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('`')) return <code key={`${key}-${i}`}>{part.slice(1,-1)}</code>;
    if (part.startsWith('**')) return <strong key={`${key}-${i}`}>{part.slice(2,-2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={`${key}-${i}`} href={link[2]}>{link[1]}</a>;
    return <React.Fragment key={`${key}-${i}`}>{part}</React.Fragment>;
  });
}

export function renderMarkdown(markdown:string) {
  const lines = markdown.split(/\r?\n/);
  const nodes:React.ReactNode[] = [];
  let list:string[]=[]; let quote:string[]=[]; let code:string[]=[]; let inCode=false; let language='';
  const flushList=()=>{ if(list.length){ nodes.push(<ul key={`ul-${nodes.length}`}>{list.map((v,i)=><li key={i}>{inline(v,`li-${nodes.length}-${i}`)}</li>)}</ul>); list=[]; }};
  const flushQuote=()=>{ if(quote.length){ nodes.push(<blockquote key={`q-${nodes.length}`}>{quote.map((v,i)=><p key={i}>{inline(v,`q-${i}`)}</p>)}</blockquote>); quote=[]; }};
  for (const raw of lines) {
    const line=raw.trimEnd();
    if(line.startsWith('```')) { if(inCode){ nodes.push(<pre key={`pre-${nodes.length}`}><code data-language={language}>{code.join('\n')}</code></pre>); code=[]; inCode=false; } else { flushList(); flushQuote(); inCode=true; language=line.slice(3); } continue; }
    if(inCode){ code.push(raw); continue; }
    if(line.startsWith('- ')){ flushQuote(); list.push(line.slice(2)); continue; }
    if(line.startsWith('> ')){ flushList(); quote.push(line.slice(2)); continue; }
    flushList(); flushQuote();
    if(!line.trim()) continue;
    if(line.startsWith('### ')) nodes.push(<h3 key={`h3-${nodes.length}`}>{inline(line.slice(4),`h3-${nodes.length}`)}</h3>);
    else if(line.startsWith('## ')) nodes.push(<h2 key={`h2-${nodes.length}`}>{inline(line.slice(3),`h2-${nodes.length}`)}</h2>);
    else nodes.push(<p key={`p-${nodes.length}`}>{inline(line,`p-${nodes.length}`)}</p>);
  }
  flushList(); flushQuote();
  return nodes;
}

export function validateRuntimeContent() {
  const ids=new Set<string>(); const slugs=new Set<string>();
  for(const article of articles){
    if(ids.has(article.id)||slugs.has(article.slug)) throw new Error(`Duplicate article: ${article.id}`);
    ids.add(article.id); slugs.add(article.slug);
    if(!CATEGORY_IDS.includes(article.categoryId)) throw new Error(`Invalid category: ${article.id}`);
    for(const locale of LOCALES){
      if(!article.translations[locale]) throw new Error(`Missing translation metadata: ${article.id}/${locale}`);
      if(!(rawBodies as Record<string,Record<Locale,string>>)[article.id]?.[locale]) throw new Error(`Missing article: ${article.id}/${locale}`);
    }
  }
}
