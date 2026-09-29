import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { canonicalLocaleRecord } from '@/lib/types';

const draftCopy = canonicalLocaleRecord({
  'zh-HK':{title:'私隱通知',intro:'Waitlist 目前未啟用，網站不會透過 Waitlist 收集電郵或其他個人資料。日後如獲批准啟用，預定只會收集電郵、語言、興趣分類和同意時間；不會要求 CV、僱主、姓名或自由文字資料。',heading:'用途與保留期',detail:'如日後啟用，資料只會用作通知 AI.DOG 新資源，並預定於 12 個月後刪除。正式公開前，負責人仍須批准本通知、加入品牌私隱電郵，並完成收集與保留流程。'},
  'zh-TW':{title:'隱私權通知',intro:'候補名單目前尚未啟用，網站不會透過候補名單收集電子郵件或其他個人資料。日後如獲核准啟用，預定只會收集電子郵件、語言、興趣分類與同意時間；不會要求履歷、雇主、姓名或自由文字資料。',heading:'用途與保留期限',detail:'如日後啟用，資料只會用於通知 AI.DOG 新資源，並預定於 12 個月後刪除。正式公開前，負責人仍須核准本通知、加入品牌隱私聯絡信箱，並完成收集與保留流程。'},
  'zh-Hans':{title:'隐私通知',intro:'候补名单目前尚未启用，网站不会通过候补名单收集电子邮箱或其他个人资料。日后如获批准启用，预计只会收集电子邮箱、语言、兴趣分类与同意时间；不会要求简历、雇主、姓名或自由文本资料。',heading:'用途与保留期限',detail:'如日后启用，资料只会用于通知 AI.DOG 新资源，并计划在 12 个月后删除。正式公开前，负责人仍须批准本通知、加入品牌隐私邮箱，并完成收集与保留流程。'},
  en:{title:'Privacy notice',intro:'The waitlist is not enabled, so this site does not collect an email address or other personal data through its waitlist. If it is approved later, it is intended to collect only an email address, chosen language, topic interest, and consent time. It will not request a CV, employer, name, free-text profile, or client-provided page path.',heading:'Purpose and retention',detail:'If enabled later, that information will be used only to notify readers about new AI.DOG resources and is intended to be deleted after 12 months. Before public launch, the owner must still approve this notice, add a brand privacy address, and complete the collection and retention process.'}
});

const publishedCopy = canonicalLocaleRecord({
  'zh-HK':{title:'私隱通知',intro:'本網站為純靜態閱讀資源；不設候補名單、聯絡表單或伺服器端資料收集。',heading:'日後功能',detail:'如日後啟用任何個人資料收集功能，會先更新本通知、說明用途與保留期，並完成相應營運與私隱程序。',contactHeading:'私隱聯絡',contactLead:'如有私隱查詢，請電郵：'},
  'zh-TW':{title:'隱私權通知',intro:'本網站為純靜態閱讀資源；不設候補名單、聯絡表單或伺服器端資料收集。',heading:'後續功能',detail:'若日後啟用任何個人資料蒐集功能，會先更新本通知、說明用途與保留期限，並完成相應營運與隱私程序。',contactHeading:'隱私聯絡',contactLead:'如有隱私查詢，請寄信至：'},
  'zh-Hans':{title:'隐私通知',intro:'本网站为纯静态阅读资源；不设候补名单、联系表单或服务器端资料收集。',heading:'后续功能',detail:'若日后启用任何个人资料收集功能，会先更新本通知、说明用途与保留期限，并完成相应运营与隐私程序。',contactHeading:'隐私联系',contactLead:'如有隐私查询，请发送邮件至：'},
  en:{title:'Privacy notice',intro:'This is a read-only static website. It has no waitlist, contact form, or server-side collection of personal data.',heading:'Future features',detail:'If the site later enables a personal-data collection feature, this notice will be updated first with its purpose and retention period, after the relevant operating and privacy process is complete.',contactHeading:'Privacy contact',contactLead:'For privacy questions, email:'}
});

const privacyEmail = process.env.PRIVACY_EMAIL?.trim() ?? '';
const isPublishedNotice = process.env.OWNER_PUBLICATION_APPROVED === 'true' && privacyEmail.length > 0;

export function generateStaticParams() { return localeStaticParams(); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = (isPublishedNotice ? publishedCopy : draftCopy)[lang];
  const path = `/${lang}/privacy`;
  return {
    title: t.title,
    description: t.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: t.title, description: t.intro, path })
  };
}

export default async function Privacy({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang)||!isRouteSurfaceEnabledInCurrentBuild('privacy'))notFound();const t=(isPublishedNotice?publishedCopy:draftCopy)[lang];const publishedT=publishedCopy[lang];return <div className="article-shell page"><header className="page-header"><p className="eyebrow">{isPublishedNotice?'PRIVACY NOTICE':'PRIVACY DRAFT · OWNER REVIEW REQUIRED'}</p><h1>{t.title}</h1></header><article className="prose"><p>{t.intro}</p><h2>{t.heading}</h2><p>{t.detail}</p>{isPublishedNotice&&<><h2>{publishedT.contactHeading}</h2><p>{publishedT.contactLead} <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a></p></>}</article></div>}
