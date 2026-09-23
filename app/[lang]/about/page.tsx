import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';

const copy={
  'zh-HK':{title:'匿名從業者，公開一套判斷方法',intro:'AI.DOG 協助已有技術底子的人判讀澳洲 AI／Data 職位、找出證據缺口，再選擇一個實際下一步。可信度來自可檢查的判斷，而不是可反查的完整個人履歷。',boundary:'本站不承諾甚麼',detail:'本站不承諾工作、薪酬、簽證、內推或面試結果。例子只使用公開或合成資料，不公開僱主系統或客戶資料。'},
  'zh-TW':{title:'匿名從業者，公開一套判斷方法',intro:'AI.DOG 協助已有技術基礎的人判讀澳洲 AI／Data 職務、找出證據缺口，再選擇一個實際的下一步。可信度來自可檢查的判斷，而不是可反查的完整個人履歷。',boundary:'本站不承諾什麼',detail:'本站不承諾工作、薪資、簽證、內部推薦或面試結果。範例只使用公開或合成資料，不公開雇主系統或客戶資料。'},
  'zh-Hans':{title:'匿名从业者，公开一套判断方法',intro:'AI.DOG 帮助已有技术基础的人判断澳洲 AI／Data 职位、找出证据缺口，再选择一个实际的下一步。可信度来自可检查的判断，而不是可反查的完整个人履历。',boundary:'本站不承诺什么',detail:'本站不承诺工作、薪酬、签证、内推或面试结果。示例只使用公开或合成数据，不公开雇主系统或客户资料。'},
  en:{title:'An anonymous practitioner, a public method',intro:'AI.DOG helps technically grounded people interpret Australian AI and data roles, find gaps in their evidence, and choose a practical next step. Credibility comes from checkable reasoning, not a traceable personal biography.',boundary:'What this site does not promise',detail:'It does not promise employment, salary, visa outcomes, referrals or interview results. Examples use public or synthetic data and never disclose employer systems or client information.'}
} as const;

export default async function About({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();const t=copy[lang];return <div className="article-shell page"><header className="page-header"><p className="eyebrow">AI.DOG</p><h1>{t.title}</h1></header><article className="prose"><p>{t.intro}</p><h2>{t.boundary}</h2><p>{t.detail}</p></article></div>}
