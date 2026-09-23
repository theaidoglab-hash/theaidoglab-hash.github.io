import { notFound } from 'next/navigation';
import Search from '@/components/search';
import { getArticles } from '@/lib/content';
import { isLocale, ui } from '@/lib/i18n';
export default async function Resources({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();const intro=lang==='en'?'Search detailed guides by role, format or skill. Every published guide includes a practical resource.':lang==='zh-Hans'?'按职位、格式或技能搜索深度指南；每篇已发布文章都附有实用资源。':lang==='zh-TW'?'依職務、格式或技能搜尋深度指南；每篇已發布文章都附有實用資源。':'按職位、格式或技能搜尋深度指南；每篇已發佈文章均附實用資源。';return <div className="shell page"><header className="page-header"><p className="eyebrow">LIBRARY</p><h1>{ui[lang].latest as string}</h1><p>{intro}</p></header><Search articles={getArticles()} locale={lang}/></div>}
