import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/site';
import { getArticles } from '@/lib/content';
import { LOCALES, type Locale } from '@/lib/types';

export function generateStaticParams(){return (['zh-Hant','zh-Hans','en'] as Locale[]).map(lang=>({lang,series:'prompt-play'}));}

export default async function SeriesPage({params}:{params:Promise<{lang:string;series:string}>}){
  const {lang:rawLang,series}=await params;
  if(!LOCALES.includes(rawLang as Locale)||series!=='prompt-play')notFound();
  const lang=rawLang as Locale;
  const matches=getArticles().filter(article=>article.tags.some(tag=>tag.toLowerCase()==='prompt play'));
  const copy={
    'zh-Hant':{eyebrow:'系列',title:'Prompt Play',intro:'把 prompt experimentation 變成可重現、可評估、權限清楚並保留人工審閱的專業證據。'},
    'zh-Hans':{eyebrow:'系列',title:'Prompt Play',intro:'把 prompt experimentation 变成可复现、可评估、权限清楚并保留人工审核的专业证据。'},
    en:{eyebrow:'Series',title:'Prompt Play',intro:'Turn prompt experimentation into reproducible, evaluated professional evidence with explicit permissions and human review.'}
  }[lang];
  return <main className="page shell"><header className="page-header"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p></header><section className="article-grid" aria-label={copy.title}>{matches.map(article=><ArticleCard key={article.id} article={article} locale={lang}/>)}</section></main>;
}
