import { canonicalLocaleRecord, type Locale } from './types';

export const AI_APP_COURSE_TITLE_ID = 'ai-app-course-title';

type AiAppCourseGateCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  boundary: string;
  courseShape: string;
  activation: string;
  opened: string;
  loading: string;
  reviewStatus: string;
};

/**
 * Keep the first load small. The full seven-lesson course, its source-backed
 * adapters, and its illustrations are loaded only after a learner opens it.
 */
export const aiAppCourseGateCopy: Record<Locale, AiAppCourseGateCopy> = canonicalLocaleRecord({
  'zh-Hant': {
    eyebrow: '完整入門課程 · 7 課',
    title: '用 Grok Bot 或 Codex 學同一套 AI 工作方法',
    intro: '這是一套共同核心課程，不是兩套工具操作手冊。先學怎樣界定工作、限制資料、要求計劃、核對固定案例、逐次批准與交回人處理；最後才選擇 Grok Bot 或 Codex 做一次受限練習。',
    boundary: '前五課可完全不用帳戶或安裝。只使用本頁的合成個案；不要上載履歷、個人資料、僱主／客戶資料、未公開文件、密碼或一次性驗證碼。',
    courseShape: '約 30–45 分鐘。核心課 01–05 不依賴 app；課 06–07 是選做的 Grok Bot／Codex 實作分支。某個 app 不可用，不會影響共同核心的完成。',
    activation: '開啟七課完整課程',
    opened: '完整課程已開啟',
    loading: '正在準備七課課程與教學圖…',
    reviewStatus: '僅限本機審閱草稿，待負責人審閱；未發佈。',
  },
  'zh-Hans': {
    eyebrow: '完整入门课程 · 7 课',
    title: '用 Grok Bot 或 Codex 学同一套 AI 工作方法',
    intro: '这是一套共同核心课程，不是两套工具操作手册。先学怎样界定工作、限制资料、要求计划、核对固定案例、逐次批准与交回人处理；最后才选择 Grok Bot 或 Codex 做一次受限练习。',
    boundary: '前五课可完全不需要帐户或安装。只使用本页的合成案例；不要上传简历、个人资料、雇主／客户资料、未公开文件、密码或一次性验证码。',
    courseShape: '约 30–45 分钟。核心课 01–05 不依赖 app；课 06–07 是选做的 Grok Bot／Codex 实作分支。某个 app 不可用，不会影响共同核心的完成。',
    activation: '开启七课完整课程',
    opened: '完整课程已开启',
    loading: '正在准备七课课程与教学图…',
    reviewStatus: '仅限本地审阅草稿，待负责人审阅；未发布。',
  },
  en: {
    eyebrow: 'FULL BEGINNER COURSE · 7 LESSONS',
    title: 'Learn one AI-work method with Grok Bot or Codex',
    intro: 'This is one shared-core course, not two tool manuals. Learn to define work, limit data, request a plan, check fixed cases, approve one action at a time, and hand work back to a person—then choose Grok Bot or Codex for one constrained exercise.',
    boundary: 'Lessons 01–05 need neither an account nor an installation. Use only the page’s synthetic case; do not upload résumés, personal information, employer or client material, unpublished files, passwords, or one-time codes.',
    courseShape: 'About 30–45 minutes. Core lessons 01–05 do not depend on an app; lessons 06–07 are optional Grok Bot / Codex practice branches. An unavailable app does not prevent completing the shared core.',
    activation: 'Open the full seven-lesson course',
    opened: 'Full course opened',
    loading: 'Preparing the seven lessons and instructional diagrams…',
    reviewStatus: 'Local review draft — awaiting owner review; not published.',
  },
});
