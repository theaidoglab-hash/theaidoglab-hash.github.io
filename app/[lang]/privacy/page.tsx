import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';

const copy={
  'zh-HK':{title:'私隱通知',intro:'Waitlist 只收集電郵、語言、興趣分類、同意時間及加入時所在頁面；不要求 CV、僱主、姓名或自由文字資料。',heading:'用途與保留期',detail:'資料只預留作通知 AI.DOG 新資源。未啟用的 waitlist 資料預定於 12 個月後刪除。正式公開前，負責人必須批准本通知並加入品牌私隱電郵。'},
  'zh-TW':{title:'隱私權通知',intro:'候補名單只收集電子郵件、語言、興趣分類、同意時間及加入時所在頁面；不要求履歷、雇主、姓名或自由文字資料。',heading:'用途與保留期限',detail:'資料只預留用於通知 AI.DOG 新資源。未啟用的候補名單資料預定於 12 個月後刪除。正式公開前，負責人必須核准本通知並加入品牌隱私聯絡信箱。'},
  'zh-Hans':{title:'隐私通知',intro:'候补名单只收集电子邮箱、语言、兴趣分类、同意时间及加入时所在页面；不要求简历、雇主、姓名或自由文本资料。',heading:'用途与保留期限',detail:'资料只预留用于通知 AI.DOG 新资源。未启用的候补名单资料计划在 12 个月后删除。正式公开前，负责人必须批准本通知并加入品牌隐私邮箱。'},
  en:{title:'Privacy notice',intro:'The waitlist collects only your email address, chosen language, topic interest, consent time and the page where you joined. It does not request a CV, employer, name or free-text profile.',heading:'Purpose and retention',detail:'The information is reserved for notifying you about new AI.DOG resources. Inactive waitlist data is scheduled for deletion after 12 months. This draft must be approved and a brand privacy address added before public launch.'}
} as const;

export default async function Privacy({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();const t=copy[lang];return <div className="article-shell page"><header className="page-header"><p className="eyebrow">PRIVACY DRAFT · OWNER REVIEW REQUIRED</p><h1>{t.title}</h1></header><article className="prose"><p>{t.intro}</p><h2>{t.heading}</h2><p>{t.detail}</p></article></div>}
