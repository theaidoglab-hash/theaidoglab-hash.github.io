import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/content';
import { LOCALES, type Locale } from '@/lib/types';

export function generateStaticParams(){return getArticles().flatMap(article=>LOCALES.map(lang=>({lang,resourceId:article.id})));}

export default async function DownloadPage({params}:{params:Promise<{lang:string;resourceId:string}>}){
  const {lang:rawLang,resourceId}=await params;
  if(!LOCALES.includes(rawLang as Locale))notFound();
  const lang=rawLang as Locale;
  const article=getArticles().find(item=>item.id===resourceId);
  if(!article)notFound();
  const translation=article.translations[lang];
  const copy={
    'zh-HK':{eyebrow:'下載資源',purpose:'用途',purposeText:'配合原文使用的可列印工作紙及可編輯範本。',limits:'限制',limitsText:'只供學習及個人規劃；不構成招聘、移民或就業保證。',version:'版本',updated:'更新日期',language:'語言',pdf:'下載 PDF',markdown:'下載 Markdown',back:'返回原文'},
    'zh-TW':{eyebrow:'下載資源',purpose:'用途',purposeText:'搭配原文使用的可列印工作表及可編輯範本。',limits:'限制',limitsText:'僅供學習及個人規劃；不構成招募、移民或就業保證。',version:'版本',updated:'更新日期',language:'語言',pdf:'下載 PDF',markdown:'下載 Markdown',back:'返回原文'},
    'zh-Hans':{eyebrow:'下载资源',purpose:'用途',purposeText:'配合原文使用的可打印工作表及可编辑模板。',limits:'限制',limitsText:'仅供学习及个人规划；不构成招聘、移民或就业保证。',version:'版本',updated:'更新日期',language:'语言',pdf:'下载 PDF',markdown:'下载 Markdown',back:'返回原文'},
    en:{eyebrow:'Download',purpose:'Purpose',purposeText:'A printable worksheet and editable template to use with the source article.',limits:'Limits',limitsText:'For learning and personal planning only; it is not a recruitment, migration, or employment guarantee.',version:'Version',updated:'Updated',language:'Language',pdf:'Download PDF',markdown:'Download Markdown',back:'Return to article'}
  }[lang];
  const base=`/downloads/${article.id}/v1/${lang}`;
  return <main className="page shell"><header className="page-header"><p className="eyebrow">{copy.eyebrow}</p><h1>{translation.title}</h1><p>{copy.purposeText}</p></header><dl className="downloads"><div><dt>{copy.version}</dt><dd>v1.1</dd></div><div><dt>{copy.updated}</dt><dd>{article.updatedAt}</dd></div><div><dt>{copy.language}</dt><dd>{lang}</dd></div><div><dt>{copy.purpose}</dt><dd>{copy.purposeText}</dd></div><div><dt>{copy.limits}</dt><dd>{copy.limitsText}</dd></div><div className="download-actions"><a className="button primary" href={`${base}.pdf`}>{copy.pdf}</a><a className="button secondary" href={`${base}.md`}>{copy.markdown}</a></div></dl><Link className="text-link" href={`/${lang}/articles/${article.slug}`}>← {copy.back}</Link></main>;
}
