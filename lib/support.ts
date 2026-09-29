import type { Locale } from './types';
import { canonicalLocaleRecord } from './types';

const approvedSupportUrl = 'https://buymeacoffee.com/theaidog.lab';

export type SupportCopy = {
  eyebrow: string;
  pageTitle: string;
  pageIntro: string;
  pending: Pick<SupportCopy, 'pageTitle' | 'pageIntro' | 'monthlyAsk' | 'cardTitle' | 'cardBody' | 'footerLink' | 'useOfSupportTitle' | 'useOfSupport'>;
  monthlyAsk: string;
  cardTitle: string;
  cardBody: string;
  action: string;
  actionNewTab: string;
  unavailable: string;
  boundaryTitle: string;
  boundary: string;
  footerLink: string;
  useOfSupportTitle: string;
  useOfSupport: string;
};

export const supportCopy: Record<Locale, SupportCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '支持呢個資源庫',
    pageTitle: '自選支持 AI.DOG',
    pageIntro: '如果呢啲指南對你有用，你可以在 Buy Me a Coffee 自選支持，用作整理與維護免費資源。',
    pending: {
      pageTitle: '支持安排準備中',
      pageIntro: '自願支持仲未開放。免費閱讀、下載同本機練習照常保留；呢頁唔會收款或傳送資料。',
      monthlyAsk: '仲未開放',
      cardTitle: '呢個資源庫暫時唔收款',
      cardBody: '等私隱、法律同負責人審核完成，先會顯示自願支持嘅方式。',
      footerLink: '支持 AI.DOG',
      useOfSupportTitle: '支持開放前，要先完成乜',
      useOfSupport: '現階段冇會員、課程或付款入口。任何自願支持、額外收費或服務安排，都要先完成私隱、法律同負責人審核。'
    },
    monthlyAsk: '自選支持',
    cardTitle: '支持免費指南與練習的維護',
    cardBody: '支持會用於整理、校對和維護免費指南、練習題與案例。',
    action: '在 Buy Me a Coffee 支持 AI.DOG',
    actionNewTab: '會在新分頁開啟',
    unavailable: '自願支持仲未啟用；呢頁唔會收款或傳送資料。',
    boundaryTitle: '支持嘅界線',
    boundary: '呢個係自願支持。唔會保證任何學習、作品、商業或求職結果，亦唔會買到個人建議、優先回覆或服務資格。',
    footerLink: '支持 AI.DOG',
    useOfSupportTitle: '支持會維護甚麼',
    useOfSupport: '新內容會先公開閱讀。呢個連結只接受自選支持；額外收費、會員或服務安排仍要完成私隱、法律同負責人審核。'
  },
  'zh-TW': {
    eyebrow: '支持這個資源庫',
    pageTitle: '自選支持 AI.DOG',
    pageIntro: '若這些指南對你有用，你可以在 Buy Me a Coffee 自選支持，用於整理與維護免費資源。',
    pending: {
      pageTitle: '支持計畫準備中',
      pageIntro: '自願支持尚未開放。免費閱讀、下載與本機練習會照常保留；這個頁面不會收款或傳送資料。',
      monthlyAsk: '尚未開放',
      cardTitle: '這個資源庫暫時不收款',
      cardBody: '等待隱私、法律與負責人審核完成後，才會顯示自願支持的方式。',
      footerLink: '支持 AI.DOG',
      useOfSupportTitle: '支持開放前會先完成什麼',
      useOfSupport: '現階段不設會員、課程或付款入口。任何自願支持、額外收費或服務安排，都要先完成隱私、法律與負責人審核。'
    },
    monthlyAsk: '自選支持',
    cardTitle: '支持免費指南與練習的維護',
    cardBody: '支持會用於整理、校對和維護免費指南、練習題與案例。',
    action: '在 Buy Me a Coffee 支持 AI.DOG',
    actionNewTab: '會在新分頁開啟',
    unavailable: '可選支持尚未啟用；這個頁面不會收款或傳送資料。',
    boundaryTitle: '自願支持，不交換結果承諾',
    boundary: '這是自願支持，不保證任何學習、作品、商業或求職結果；也不會購買個人建議、優先回覆或服務資格。',
    footerLink: '支持 AI.DOG',
    useOfSupportTitle: '支持會維護什麼',
    useOfSupport: '新內容會先維持免費閱讀。這個連結只接受可選支持；任何額外收費、會員或服務安排，仍須完成隱私、法律與負責人審核。'
  },
  'zh-Hans': {
    eyebrow: '支持这个资源库',
    pageTitle: '自选支持 AI.DOG',
    pageIntro: '如果这些指南对你有用，你可以在 Buy Me a Coffee 自选支持，用于整理与维护免费资源。',
    pending: {
      pageTitle: '支持计划准备中',
      pageIntro: '自愿支持尚未开放。免费阅读、下载与本机练习会照常保留；这个页面不会收款或传送资料。',
      monthlyAsk: '尚未开放',
      cardTitle: '这个资源库暂时不收款',
      cardBody: '等待隐私、法律与负责人审核完成后，才会显示自愿支持的方式。',
      footerLink: '支持 AI.DOG',
      useOfSupportTitle: '支持开放前会先完成什么',
      useOfSupport: '现阶段不设会员、课程或付款入口。任何自愿支持、额外收费或服务安排，都要先完成隐私、法律与负责人审核。'
    },
    monthlyAsk: '自选支持',
    cardTitle: '支持免费指南与练习的维护',
    cardBody: '支持将用于整理、校对和维护免费指南、练习题与案例。',
    action: '在 Buy Me a Coffee 支持 AI.DOG',
    actionNewTab: '将在新标签页打开',
    unavailable: '可选支持尚未启用；这个页面不会收款或传送资料。',
    boundaryTitle: '自愿支持，不交换结果承诺',
    boundary: '这是自愿支持，不保证任何学习、作品、商业或求职结果；也不会购买个人建议、优先回复或服务资格。',
    footerLink: '支持 AI.DOG',
    useOfSupportTitle: '支持会维护什么',
    useOfSupport: '新内容会先保持免费阅读。这个链接只接受可选支持；任何额外收费、会员或服务安排，仍须完成隐私、法律与负责人审核。'
  },
  en: {
    eyebrow: 'SUPPORT THE LIBRARY',
    pageTitle: 'Support AI.DOG',
    pageIntro: 'If these guides are useful to you, you can choose to support AI.DOG on Buy Me a Coffee to help maintain free resources.',
    pending: {
      pageTitle: 'Voluntary support is being prepared',
      pageIntro: 'Voluntary support is not open yet. Free reading, downloads, and local exercises remain available; this page cannot take a payment or send your data.',
      monthlyAsk: 'NOT OPEN YET',
      cardTitle: 'This library is not collecting payments yet',
      cardBody: 'A voluntary-support option appears only after privacy, legal, and owner review are complete.',
      footerLink: 'Support AI.DOG',
      useOfSupportTitle: 'What must happen before support opens',
      useOfSupport: 'There is no membership, course, or payment entry point at this stage. Any voluntary support, paid offer, or service arrangement needs completed privacy, legal, and owner review first.'
    },
    monthlyAsk: 'OPTIONAL SUPPORT',
    cardTitle: 'Support free guides and exercises',
    cardBody: 'Support funds the editing, checking, and upkeep of free guides, exercises, and cases.',
    action: 'Support AI.DOG on Buy Me a Coffee',
    actionNewTab: 'Opens in a new tab',
    unavailable: 'Optional support is not enabled here; this page cannot collect a payment or send your data.',
    boundaryTitle: 'Voluntary support, not an outcome promise',
    boundary: 'This is voluntary support. It does not guarantee a learning, portfolio, business, or job outcome, and it does not buy individual advice, priority replies, or access to a service.',
    footerLink: 'Support AI.DOG',
    useOfSupportTitle: 'What support maintains',
    useOfSupport: 'New material remains free to read first. This link accepts optional support only; any additional paid offer, membership, or service arrangement still requires completed privacy, legal, and owner review.'
  }
});

export function getBuyMeACoffeeSupportUrl(): string {
  return approvedSupportUrl;
}
