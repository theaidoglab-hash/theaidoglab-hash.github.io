import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/content';
import { isReleaseAssetEnabledInCurrentBuild, isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates } from '@/lib/site-metadata';
import { LOCALES, staticAssetLocale, type Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

export function generateStaticParams(){return getArticles().flatMap(article=>LOCALES.map(lang=>({lang,resourceId:article.id})));}

const downloadMetadataCopy: Record<Locale, { label: string; description: string }> = canonicalLocaleRecord({
  'zh-HK': { label: '下載資源', description: '配合原文使用的可列印工作紙及可編輯範本。' },
  'zh-TW': { label: '下載資源', description: '搭配原文使用的可列印工作表及可編輯範本。' },
  'zh-Hans': { label: '下载资源', description: '配合原文使用的可打印工作表及可编辑模板。' },
  en: { label: 'Download resource', description: 'A printable worksheet and editable template to use with the source article.' }
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string; resourceId: string }> }): Promise<Metadata> {
  const { lang: rawLang, resourceId } = await params;
  if (!LOCALES.includes(rawLang as Locale)) return {};
  const article = getArticles().find(item => item.id === resourceId);
  if (!article) return {};
  const lang = rawLang as Locale;
  const copy = downloadMetadataCopy[lang];
  const path = `/${lang}/downloads/${resourceId}`;
  return {
    title: `${copy.label}: ${article.translations[lang].title}`,
    description: copy.description,
    robots: { index: false, follow: true },
    alternates: localizedAlternates(path)
  };
}

export default async function DownloadPage({params}:{params:Promise<{lang:string;resourceId:string}>}){
  const {lang:rawLang,resourceId}=await params;
  if(!LOCALES.includes(rawLang as Locale)||!isRouteSurfaceEnabledInCurrentBuild('article-downloads'))notFound();
  const lang=rawLang as Locale;
  const article=getArticles().find(item=>item.id===resourceId);
  if(!article)notFound();
  const translation=article.translations[lang];
  const copy=canonicalLocaleRecord({
    'zh-HK':{eyebrow:'下載資源',purpose:'用途',purposeText:'配合原文使用的可列印工作紙及可編輯範本。',limits:'限制',limitsText:'只供學習及個人規劃；不保證學習、作品、商業或求職結果。',version:'版本',updated:'更新日期',language:'語言',languageName:'繁體中文',pdf:'下載 PDF',markdown:'下載 Markdown',back:'返回原文'},
    'zh-TW':{eyebrow:'下載資源',purpose:'用途',purposeText:'搭配原文使用的可列印工作表及可編輯範本。',limits:'限制',limitsText:'僅供學習與個人規劃；不保證學習、作品、商業或求職結果。',version:'版本',updated:'更新日期',language:'語言',languageName:'繁體中文',pdf:'下載 PDF',markdown:'下載 Markdown',back:'返回原文'},
    'zh-Hans':{eyebrow:'下载资源',purpose:'用途',purposeText:'配合原文使用的可打印工作表及可编辑模板。',limits:'限制',limitsText:'仅供学习与个人规划；不保证学习、作品、商业或求职结果。',version:'版本',updated:'更新日期',language:'语言',languageName:'简体中文',pdf:'下载 PDF',markdown:'下载 Markdown',back:'返回原文'},
    en:{eyebrow:'Download',purpose:'Purpose',purposeText:'A printable worksheet and editable template to use with the source article.',limits:'Limits',limitsText:'For learning and personal planning only; it does not guarantee a learning, portfolio, business, or job outcome.',version:'Version',updated:'Updated',language:'Language',languageName:'English',pdf:'Download PDF',markdown:'Download Markdown',back:'Return to article'}
  })[lang];
  const assetLocale = staticAssetLocale(lang);
  const assets = [
    { format: 'pdf', path: `downloads/${article.id}/v1/${assetLocale}.pdf`, label: copy.pdf },
    { format: 'md', path: `downloads/${article.id}/v1/${assetLocale}.md`, label: copy.markdown },
  ].filter(asset => isReleaseAssetEnabledInCurrentBuild('downloads', asset.path));
  if (!assets.length) notFound();
  return <div className="page shell"><header className="page-header"><p className="eyebrow">{copy.eyebrow}</p><h1>{translation.title}</h1></header><dl className="downloads"><div><dt>{copy.version}</dt><dd>v1</dd></div><div><dt>{copy.updated}</dt><dd>{article.updatedAt}</dd></div><div><dt>{copy.language}</dt><dd>{copy.languageName}</dd></div><div><dt>{copy.purpose}</dt><dd>{copy.purposeText}</dd></div><div><dt>{copy.limits}</dt><dd>{copy.limitsText}</dd></div><div className="download-actions">{assets.map(asset => <a className={`button ${asset.format === 'pdf' ? 'primary' : 'secondary'}`} download href={`/${asset.path}`} key={asset.path}>{asset.label}</a>)}</div></dl><Link className="text-link" href={`/${lang}/articles/${article.slug}`}>← {copy.back}</Link></div>;
}
