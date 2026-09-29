import type { Locale } from './types';
import { canonicalLocaleRecord } from './types';

export const NO_CODE_PERSONAL_CASE_BUILDER_TITLE_ID = 'no-code-personal-case-builder-title';

export type NoCodePersonalCaseBuilderGateCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  localOnlyBoundary: string;
  activationIntro: string;
  activationAction: string;
  openedAction: string;
  loading: string;
};

/**
 * This deliberately small copy block is all the initial lab needs to describe
 * the optional worksheet. The detailed fields, fixed cases, and Markdown
 * exporter stay in the lazy builder chunk until a reader opens it.
 */
export const noCodePersonalCaseBuilderGateCopy: Record<Locale, NoCodePersonalCaseBuilderGateCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '只留喺本機嘅案例工作紙',
    title: '由你熟悉嘅工作，砌一個可以畀人睇明嘅案例',
    intro: '揀一件你熟悉、但唔使攞真實公司資料出嚟講嘅工作。填完後，頁面只會砌出 Markdown 預覽，等你自己本機保存或再修改。',
    localOnlyBoundary: '呢一頁唔會儲存、傳送或執行任何資料。只放虛構或准許公開嘅資料；唔好放公司、客戶、同事、帳戶、合約或內部檔案。',
    activationIntro: '完成六個固定練習後，再用呢份工作紙整理一個你自己設計嘅虛構情境。開啟後先會載入完整工作紙；你填嘅文字只留喺目前頁面，重整或離開後唔會保留。',
    activationAction: '開啟案例工作紙',
    openedAction: '案例工作紙已開啟',
    loading: '正在準備案例工作紙…'
  },
  'zh-TW': {
    eyebrow: '只留在本機的案例工作紙',
    title: '從熟悉的工作，整理一個能讓人看懂的案例',
    intro: '選一件你熟悉、但不需要拿出真實公司資料的工作。填完後，頁面只會產生 Markdown 預覽，讓你留在本機修改或保存。',
    localOnlyBoundary: '這個頁面不會儲存、傳送或執行任何資料。只放虛構或准許公開的資料；不要放公司、客戶、同事、帳戶、合約或內部檔案。',
    activationIntro: '完成六個固定練習後，再用這份工作紙整理一個自己設計的虛構情境。開啟後才會載入完整工作紙；你填的文字只留在目前頁面，重新整理或離開後不會保留。',
    activationAction: '開啟案例工作紙',
    openedAction: '案例工作紙已開啟',
    loading: '正在準備案例工作紙…'
  },
  'zh-Hans': {
    eyebrow: '只留在本地的案例工作纸',
    title: '从熟悉的工作，整理一个能让人看懂的案例',
    intro: '选一件你熟悉、但不需要拿出真实公司资料的工作。填完后，页面只会生成 Markdown 预览，让你留在本地修改或保存。',
    localOnlyBoundary: '这个页面不会保存、传送或执行任何资料。只放虚构或允许公开的资料；不要放公司、客户、同事、账户、合同或内部文件。',
    activationIntro: '完成六个固定练习后，再用这份工作纸整理一个自己设计的虚构情境。开启后才会载入完整工作纸；你填写的文字只留在当前页面，刷新或离开后不会保留。',
    activationAction: '开启案例工作纸',
    openedAction: '案例工作纸已开启',
    loading: '正在准备案例工作纸…'
  },
  en: {
    eyebrow: 'LOCAL-ONLY CASE WORKSHEET',
    title: 'Turn a familiar piece of work into a case someone can inspect',
    intro: 'Choose a small decision you understand without bringing in real company material. When you finish, this page only assembles a Markdown preview for you to keep or edit locally.',
    localOnlyBoundary: 'This builder does not save, send, or run anything. Use invented or permitted public material only; do not enter company, customer, colleague, account, contract, or internal-file information.',
    activationIntro: 'After the six fixed exercises, use this worksheet to frame one invented case of your own. The full worksheet loads only when you open it; text you enter stays on this page and disappears when you refresh or leave.',
    activationAction: 'Open the case worksheet',
    openedAction: 'Case worksheet opened',
    loading: 'Preparing the case worksheet…'
  }
});
