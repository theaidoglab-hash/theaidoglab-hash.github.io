import Link from 'next/link';
import type { ArticleMeta, Locale } from '@/lib/types';
import { categories, ui } from '@/lib/i18n';

export function Header({locale}:{locale:Locale}){
  const t=ui[locale];
  return <header className="site-header"><div className="shell header-inner">
    <Link className="brand" href={`/${locale}`} aria-label={t.brand as string}><span className="brand-dot"/>AI.DOG</Link>
    <nav aria-label="Primary"><Link href={`/${locale}/start-here`}>{(t.nav as string[])[0]}</Link><Link href={`/${locale}/resources`}>{(t.nav as string[])[2]}</Link><Link href={`/${locale}/about`}>{(t.nav as string[])[3]}</Link></nav>
    <div className="languages" aria-label="Language">{(['zh-Hant','zh-Hans','en'] as Locale[]).map(l=><Link key={l} className={l===locale?'active':''} href={`/${l}`}>{l==='zh-Hant'?'繁':l==='zh-Hans'?'简':'EN'}</Link>)}</div>
  </div></header>;
}

export function Footer({locale}:{locale:Locale}){
  return <footer className="footer"><div className="shell footer-grid"><div><strong>AI.DOG</strong><p>Anonymous, evidence-led guidance for Australian AI careers.</p></div><div><Link href={`/${locale}/about`}>{ui[locale].about as string}</Link><Link href={`/${locale}/privacy`}>{ui[locale].privacy as string}</Link></div></div></footer>;
}

export function ArticleCard({article,locale}:{article:ArticleMeta;locale:Locale}){
  const copy=article.translations[locale]; const cat=categories[article.categoryId][locale];
  const href=`/${locale}/articles/${article.slug}`;
  return <article className="article-card"><div className="card-meta"><span>{cat.name}</span><span>{article.type.replace('-',' ')}</span></div><h3><Link href={href}>{copy.title}</Link></h3><p>{copy.description}</p><div className="tags">{article.tags.slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div><Link className="text-link" href={href}>{ui[locale].read as string} <span aria-hidden>→</span></Link></article>;
}

export function CategoryGrid({locale}:{locale:Locale}){
  return <div className="category-grid">{Object.entries(categories).map(([id,copy],index)=><Link className="category-card" key={id} href={`/${locale}/categories/${id}`}><span className="category-number">0{index+1}</span><h3>{copy[locale].name}</h3><p>{copy[locale].description}</p><span aria-hidden>↗</span></Link>)}</div>;
}

export function LanguageSwitch({locale,slug}:{locale:Locale;slug:string}){
  return <div className="article-languages" aria-label="Article language">{(['zh-Hant','zh-Hans','en'] as Locale[]).map(l=><Link key={l} className={l===locale?'active':''} href={`/${l}/articles/${slug}`}>{ui[l].name as string}</Link>)}</div>;
}
