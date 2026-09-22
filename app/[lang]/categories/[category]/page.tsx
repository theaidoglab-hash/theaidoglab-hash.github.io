import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/site';
import { getCategoryArticles } from '@/lib/content';
import { categories, isLocale } from '@/lib/i18n';
import { CATEGORY_IDS, type CategoryId } from '@/lib/types';
export function generateStaticParams(){return CATEGORY_IDS.map(category=>({category}));}
export default async function CategoryPage({params}:{params:Promise<{lang:string;category:string}>}){const {lang,category}=await params;if(!isLocale(lang)||!CATEGORY_IDS.includes(category as CategoryId))notFound();const id=category as CategoryId;const copy=categories[id][lang];const articles=getCategoryArticles(id);return <div className="shell page"><header className="page-header"><p className="eyebrow">CATEGORY</p><h1>{copy.name}</h1><p>{copy.description}</p></header><div className="article-grid">{articles.map(a=><ArticleCard key={a.id} article={a} locale={lang}/>)}</div></div>}
