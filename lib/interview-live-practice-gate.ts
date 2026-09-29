import { canonicalLocaleRecord, type Locale } from './types';

export const LIVE_INTERVIEW_PRACTICE_ID = 'live-interview-practice';
export const LIVE_INTERVIEW_PRACTICE_TITLE_ID = 'live-interview-practice-title';

type LiveInterviewPracticeGateCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  activate: string;
  loading: string;
  loadFailed: string;
};

/**
 * Keep the small, visible activation shell separate from the rehearsal itself.
 * The much longer scorecard and prompt builder are loaded only after a reader
 * asks to practise, or deliberately follows the documented fragment link.
 */
export const liveInterviewPracticeGateCopy: Record<Locale, LiveInterviewPracticeGateCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '即時練習',
    title: '拎呢條題去你慣用嘅 AI 對話工具練一次',
    intro: '複製指令，貼去你慣用嘅 AI 語音或即時對話工具。工具一次只問一題，等你答完先追問；回饋要跟返你講過嘅內容。',
    activate: '打開練習指令同評分表',
    loading: '正在準備練習指令同評分表。',
    loadFailed: '而家未能載入練習資料。請重新開啟，或者返去逐題練習。'
  },
  'zh-TW': {
    eyebrow: '即時練習',
    title: '把這條問題帶到即時對話練習',
    intro: '把指令複製到你選擇的 AI 語音或即時對話模式。它會一次問一題，等你回答完才追問，最後依你的答案回饋。',
    activate: '開啟練習指令與評分表',
    loading: '正在準備練習指令與評分表。',
    loadFailed: '目前無法載入練習資料。請重新開啟，或回到逐題練習。'
  },
  'zh-Hans': {
    eyebrow: '即时练习',
    title: '把这条问题带到即时对话练习',
    intro: '把指令复制到你选择的 AI 语音或即时对话模式。它会一次问一题，等你回答完才追问，最后按你的答案反馈。',
    activate: '打开练习指令与评分表',
    loading: '正在准备练习指令与评分表。',
    loadFailed: '目前无法载入练习资料。请重新开启，或回到逐题练习。'
  },
  en: {
    eyebrow: 'LIVE REHEARSAL',
    title: 'Take this question into a live chat rehearsal',
    intro: 'Copy the prompt into the voice or live chat mode of an LLM you choose. It asks one question, waits for your answer, then follows up and gives feedback.',
    activate: 'Open the rehearsal prompt and scorecard',
    loading: 'Preparing the rehearsal prompt and scorecard.',
    loadFailed: 'The rehearsal material could not be loaded. Open it again, or return to the individual question.'
  }
});
