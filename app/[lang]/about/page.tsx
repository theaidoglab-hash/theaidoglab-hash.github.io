import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { canonicalLocaleRecord } from '@/lib/types';

const copy = canonicalLocaleRecord({
  'zh-HK':{title:'匿名從業者，公開一套判斷方法',intro:'AI.DOG 寫俾想學 AI、砌一個可以畀人檢查嘅作品集嘅人。由系統點設計、點驗，到作品要留低咩證據，一步步砌成可以重做、亦講得清楚嘅作品。可信度來自每一個取捨、檢查同限制都有清楚交代。',boundary:'呢度唔會承諾嘅事',detail:'唔會保證學習成果、作品表現、商業機會或求職結果。例子只用公開或合成資料；僱主系統同客戶資料唔會放上嚟。'},
  'zh-TW':{title:'匿名從業者，公開一套判斷方法',intro:'AI.DOG 面向想學 AI、建立可供他人檢查的 AI 作品集的人。從系統怎麼設計、怎麼驗證，到作品應留下哪些證據，一步步做成可重現、也能清楚說明的作品。可信度來自每一個取捨、檢查與限制都有清楚交代。',boundary:'本站不承諾什麼',detail:'本站不保證學習成果、作品表現、商業機會或求職結果。範例只使用公開或合成資料，不公開雇主系統或客戶資料。'},
  'zh-Hans':{title:'匿名从业者，公开一套判断方法',intro:'AI.DOG 面向想学习 AI、建立可供他人检查的 AI 作品集的人。从系统怎样设计、怎样验证，到作品应留下哪些证据，一步步做成可重现、也能清楚说明的作品。可信度来自每一个取舍、检查与限制都有清楚交代。',boundary:'本站不承诺什么',detail:'本站不保证学习成果、作品表现、商业机会或求职结果。示例只使用公开或合成数据，不公开雇主系统或客户资料。'},
  en:{title:'An anonymous practitioner, a public method',intro:'AI.DOG is for anyone learning AI and building a portfolio that others can inspect. It works through how systems are designed and checked, then what evidence makes the work repeatable and explainable. Credibility comes from clearly stated trade-offs, checks, and limits, not a traceable personal biography.',boundary:'What this site does not promise',detail:'It does not guarantee a learning result, portfolio outcome, business opportunity, or job outcome. Examples use public or synthetic data and never disclose employer systems or client information.'}
});

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = copy[lang];
  const path = `/${lang}/about`;
  return {
    title: t.title,
    description: t.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: t.title, description: t.intro, path })
  };
}

export default async function About({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang)||!isRouteSurfaceEnabledInCurrentBuild('about'))notFound();const t=copy[lang];return <div className="article-shell page"><header className="page-header"><p className="eyebrow">AI.DOG</p><h1>{t.title}</h1></header><article className="prose"><p>{t.intro}</p><h2>{t.boundary}</h2><p>{t.detail}</p></article></div>}
