'use client';

import { useMemo, useRef, useState } from 'react';
import type { LiveInterviewPracticeTopic } from '@/lib/interview-live-practice-topics';
import type { Locale, LocaleSource } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

type LiveInterviewPracticeProps = {
  locale: Locale;
  topics: readonly LiveInterviewPracticeTopic[];
  initialTopicSlug?: string;
  /** Present only on a standalone question page; never contains its model answer. */
  initialInterviewerQuestion?: string;
  /** The activation gate owns the heading and fragment landmark when deferred. */
  embedded?: boolean;
};

type ScorecardCriterion = {
  label: string;
  detail: string;
  /** Ordered 0, 1, 2, 3 so the visible card and copied prompt use the same anchors. */
  anchors: readonly [string, string, string, string];
};

type PracticeCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  topicLabel: string;
  topicChanged: string;
  promptLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  debriefTitle: string;
  debriefIntro: string;
  debriefLabel: string;
  debriefCopy: string;
  debriefCopied: string;
  debriefNote: string;
  scorecardTitle: string;
  scorecardIntro: string;
  scorecardRule: string;
  scorecardCriteria: ScorecardCriterion[];
  privacyTitle: string;
  privacy: string;
  note: string;
};

const copy: Record<Locale, PracticeCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '即時練習',
    title: '拎呢條題去你慣用嘅 AI 對話工具練一次',
    intro: '複製指令，貼去你慣用嘅 AI 語音或即時對話工具。工具一次只問一題，等你答完先追問；回饋要跟返你講過嘅內容。',
    topicLabel: '今日要練嘅題目',
    topicChanged: '以下嘅練習指令已改成「{topic}」；呢篇文章仍然係原本題目。',
    promptLabel: '可複製嘅模擬面試指令',
    copy: '複製指令',
    copied: '已複製',
    copyFailed: '未能自動複製；可以直接選取上面嘅指令。',
    debriefTitle: '練完後，用對話紀錄做第二輪檢討',
    debriefIntro: '如果你已喺另一個 AI 對話工具練過，將呢段指令貼返去同一個工具，然後只喺嗰度貼已去識別嘅對話紀錄。工具只可以根據你答過嘅內容，指出一處講得清楚嘅地方、一個缺口，同一段可以重講嘅答案。',
    debriefLabel: '可複製嘅對話紀錄檢討指令',
    debriefCopy: '複製檢討指令',
    debriefCopied: '檢討指令已複製',
    debriefNote: 'AI.DOG 唔會收對話紀錄；只將虛構、公開或已去識別版本貼到你揀嘅 AI 工具。',
    scorecardTitle: '點樣睇 AI 畀你嘅回饋',
    scorecardIntro: '分數只係方便你重看答案。每一項都要引返你實際講過嘅一句，或者清楚指出對話紀錄邊一段；講唔出根據，就寫「資料不足」，唔好估。',
    scorecardRule: '每項 0–3 分，只評答案內容。先引述或指出對話紀錄，再按下面嘅準則解釋；唔評口音、信心或語速。',
    scorecardCriteria: [
      {
        label: '講得清唔清楚',
        detail: '睇得到你有冇講明情境、要作嘅決定同自己嘅結論。',
        anchors: [
          '冇答，或者聽唔出題目要解乜。',
          '只講大方向或結論；情境、決定或結論仍然欠清楚。',
          '講到情境、決定同結論，但冇講邊個條件會改變做法。',
          '講清情境、決定同結論，並講明一個適用條件或停下界線。'
        ]
      },
      {
        label: '推理有冇連貫',
        detail: '睇得到你有冇由原理講到取捨、失敗情況同決定。',
        anchors: [
          '冇解釋點解會作呢個決定。',
          '講咗術語、主張或步驟，但冇講佢哋點樣有關。',
          '解釋咗一個原理，再提到取捨或失敗情況，但未連返個決定。',
          '用因果關係將原理、取捨或失敗情況，同最終決定連起來。'
        ]
      },
      {
        label: '有冇支持自己',
        detail: '睇得到你有冇用安全而可核對嘅材料支持個判斷。',
        anchors: [
          '冇材料支持，或者將估計講成已發生嘅成效。',
          '提到經驗、指標或作品，但講唔出可以喺邊度睇到，或者佢支持咩判斷。',
          '講得出公開、去識別或虛構示範入面一項可睇嘅紀錄、測試或文件，但未講清佢證明咩或有咩限制。',
          '指出一項安全可睇嘅紀錄、測試或文件，講清佢點樣支持判斷，同時講明佢嘅範圍或限制。'
        ]
      }
    ],
    privacyTitle: '只用可以公開嘅練習材料',
    privacy: '唔好貼僱主、客戶、內部架構、真實數字、API 金鑰或任何未公開資料。用虛構情境、公開作品集或已去識別嘅例子就夠。',
    note: '呢頁唔會連接模型，亦唔會送出答案；只會整好一段指令，畀你帶去自己揀嘅 AI 工具。'
  },
  'zh-TW': {
    eyebrow: '即時練習',
    title: '把這條問題帶到即時對話練習',
    intro: '把指令複製到你選擇的 AI 語音或即時對話模式。它會一次問一題，等你回答完才追問，最後依你的答案回饋。',
    topicLabel: '今天要練的問題',
    topicChanged: '下方的練習指令已改為「{topic}」；這篇文章會維持原本題目。',
    promptLabel: '可複製的模擬面試指令',
    copy: '複製指令',
    copied: '已複製',
    copyFailed: '無法自動複製；可以直接選取上面的 prompt。',
    debriefTitle: '練完後，用對話紀錄做第二輪檢討',
    debriefIntro: '如果你已在另一個即時對話工具練過，把這段指令貼到同一個工具，然後只在那裡貼去識別的對話紀錄。它會依你實際回答的內容找出一個強項、一個缺口和一段可重講的答案。',
    debriefLabel: '可複製的對話紀錄檢討指令',
    debriefCopy: '複製檢討指令',
    debriefCopied: '檢討指令已複製',
    debriefNote: 'AI.DOG 不會收對話紀錄；請只把虛構、公開或去識別版本帶到你選擇的 AI 工具。',
    scorecardTitle: '怎麼看 AI 給你的回饋',
    scorecardIntro: '分數只是方便你回看答案。每一項都要引回你實際說過的一句，或清楚指出對話紀錄的哪一段；說不出根據，就寫「資料不足」，不要猜。',
    scorecardRule: '每項 0–3 分，只評答案內容。先引述或指出對話紀錄，再按下列準則解釋；不評口音、信心或語速。',
    scorecardCriteria: [
      {
        label: '是否說得清楚',
        detail: '看得到你是否說明情境、要作的決策與自己的結論。',
        anchors: [
          '沒有回答，或聽不出題目要解決什麼。',
          '只說大方向或結論；情境、決策或結論仍不清楚。',
          '說到情境、決策與結論，但沒有說哪個條件會改變做法。',
          '說清情境、決策與結論，也說明一個適用條件或停止界線。'
        ]
      },
      {
        label: '推理是否連貫',
        detail: '看得到你是否由原理說到取捨、失敗情況與決策。',
        anchors: [
          '沒有解釋為什麼會作這個決策。',
          '提到術語、主張或步驟，但沒有說明它們如何相連。',
          '解釋一個原理，也提到取捨或失敗情況，但沒有連回決策。',
          '用因果關係把原理、取捨或失敗情況，和最終決策連起來。'
        ]
      },
      {
        label: '有沒有支持自己',
        detail: '看得到你是否用安全且可檢查的材料支持判斷。',
        anchors: [
          '沒有材料支持，或把估計說成已發生的成效。',
          '提到經驗、指標或作品，卻說不出在哪裡可看，或它支持哪個判斷。',
          '說得出公開、去識別或虛構示範裡一項可看的紀錄、測試或文件，但沒說清它證明什麼或有什麼限制。',
          '指出一項安全可看的紀錄、測試或文件，說清它如何支持判斷，同時說明它的範圍或限制。'
        ]
      }
    ],
    privacyTitle: '只用可以公開的練習材料',
    privacy: '不要貼雇主、客戶、內部架構、真實數字、API 金鑰或任何未公開資料。使用虛構情境、公開作品集或已去識別的例子就足夠。',
    note: '這裡不會連接任何模型或送出你的答案；它只生成一段可帶到你自己 AI 工具的練習指令。'
  },
  'zh-Hans': {
    eyebrow: '即时练习',
    title: '把这条问题带到即时对话练习',
    intro: '把指令复制到你选择的 AI 语音或即时对话模式。它会一次问一题，等你回答完才追问，最后按你的答案反馈。',
    topicLabel: '今天要练的问题',
    topicChanged: '下方的练习指令已改为“{topic}”；这篇文章会维持原本题目。',
    promptLabel: '可复制的模拟面试指令',
    copy: '复制指令',
    copied: '已复制',
    copyFailed: '无法自动复制；可以直接选取上面的 prompt。',
    debriefTitle: '练完后，用对话记录做第二轮检讨',
    debriefIntro: '如果你已在另一个即时对话工具练过，把这段指令贴到同一个工具，然后只在那里贴去识别的对话记录。它会按你实际回答的内容找出一个强项、一个缺口和一段可重讲的答案。',
    debriefLabel: '可复制的对话记录检讨指令',
    debriefCopy: '复制检讨指令',
    debriefCopied: '检讨指令已复制',
    debriefNote: 'AI.DOG 不会接收对话记录；请只把虚构、公开或去识别版本带到你选择的 AI 工具。',
    scorecardTitle: '怎么看 AI 给你的反馈',
    scorecardIntro: '分数只是方便你回看答案。每一项都要引回你实际说过的一句，或清楚指出对话记录的哪一段；说不出根据，就写“资料不足”，不要猜。',
    scorecardRule: '每项 0–3 分，只评答案内容。先引用或指出对话记录，再按下列准则解释；不评口音、信心或语速。',
    scorecardCriteria: [
      {
        label: '是否讲得清楚',
        detail: '看得到你是否讲明情境、要作的决策与自己的结论。',
        anchors: [
          '没有回答，或听不出题目要解决什么。',
          '只讲大方向或结论；情境、决策或结论仍不清楚。',
          '讲到情境、决策与结论，但没有说明哪个条件会改变做法。',
          '讲清情境、决策与结论，也说明一个适用条件或停止界线。'
        ]
      },
      {
        label: '推理是否连贯',
        detail: '看得到你是否由原理讲到取舍、失败情况与决策。',
        anchors: [
          '没有解释为什么会作这个决策。',
          '提到术语、主张或步骤，但没有说明它们如何相连。',
          '解释一个原理，也提到取舍或失败情况，但没有连回决策。',
          '用因果关系把原理、取舍或失败情况，和最终决策连起来。'
        ]
      },
      {
        label: '有没有支持自己',
        detail: '看得到你是否用安全且可检查的材料支持判断。',
        anchors: [
          '没有材料支持，或把估计说成已发生的成效。',
          '提到经验、指标或作品，却说不出在哪里可看，或它支持哪个判断。',
          '说得出公开、去识别或虚构示范里一项可看的记录、测试或文件，但没说清它证明什么或有什么限制。',
          '指出一项安全可看的记录、测试或文件，讲清它如何支持判断，同时说明它的范围或限制。'
        ]
      }
    ],
    privacyTitle: '只用可以公开的练习材料',
    privacy: '不要贴雇主、客户、内部架构、真实数字、API 密钥或任何未公开资料。使用虚构情境、公开作品集或已去识别的例子就足够。',
    note: '这里不会连接任何模型或发送你的答案；它只生成一段可带到你自己 AI 工具的练习指令。'
  },
  en: {
    eyebrow: 'LIVE REHEARSAL',
    title: 'Take this question into a live chat rehearsal',
    intro: 'Copy the prompt into the voice or live chat mode of an LLM you choose. It asks one question, waits for your answer, then follows up and gives feedback.',
    topicLabel: 'Question to practise today',
    topicChanged: 'The prompt below now uses “{topic}”; this article remains on its original question.',
    promptLabel: 'Copyable mock-interview prompt',
    copy: 'Copy prompt',
    copied: 'Copied',
    copyFailed: 'Copy was unavailable. You can select the prompt above directly.',
    debriefTitle: 'After the rehearsal, use the transcript for a second feedback pass',
    debriefIntro: 'If you practised in another live chat, copy this prompt into the same LLM and paste a de-identified transcript there only. It checks one established strength, one gap, and one answer you can say again.',
    debriefLabel: 'Copyable transcript-feedback prompt',
    debriefCopy: 'Copy feedback prompt',
    debriefCopied: 'Feedback prompt copied',
    debriefNote: 'AI.DOG never receives a transcript. Take only a fictional, public, or de-identified version to the LLM you choose.',
    scorecardTitle: 'How to read the LLM feedback',
    scorecardIntro: 'The scores are a way to revisit your answer. Each one must quote a short part of what you said or point to a specific transcript passage; if support is missing, it should say so instead of guessing.',
    scorecardRule: 'Score each item from 0–3 from the answer only. Cite the answer or transcript first, then use the anchors below. Do not score accent, confidence, or speaking speed.',
    scorecardCriteria: [
      {
        label: 'Clarity',
        detail: 'Whether the situation, decision, and conclusion are all observable in the answer.',
        anchors: [
          'No answer, or it is not possible to tell what problem is being addressed.',
          'Only a broad direction or conclusion; the situation, decision, or conclusion remains unclear.',
          'Names the situation, decision, and conclusion, but not a condition that would change the approach.',
          'Names the situation, decision, and conclusion, plus one condition of use or stopping boundary.'
        ]
      },
      {
        label: 'Reasoning',
        detail: 'Whether a mechanism leads through a trade-off or failure path to the decision.',
        anchors: [
          'No explanation for the decision.',
          'Names a term, claim, or step without explaining how the pieces relate.',
          'Explains one mechanism and names a trade-off or failure path, but does not connect it back to the decision.',
          'Uses a causal link from the mechanism through a trade-off or failure path to the decision.'
        ]
      },
      {
        label: 'Evidence',
        detail: 'Whether safe, inspectable material supports the stated judgement.',
        anchors: [
          'No supporting material, or presents an estimate as an observed outcome.',
          'Mentions experience, a metric, or a project but cannot say where it can be inspected or what judgement it supports.',
          'Names an inspectable record, test, or document from a public, de-identified, or fictional example, but not what it shows or its limit.',
          'Points to safe inspectable material, says how it supports the judgement, and states its scope or limitation.'
        ]
      }
    ],
    privacyTitle: 'Use public-safe practice material only',
    privacy: 'Do not paste employer or client details, internal architecture, real metrics, API keys or other non-public material. A fictional scenario, public portfolio, or de-identified example is enough.',
    note: 'This page does not connect to a model or send your answer anywhere. It only prepares a prompt for the LLM you choose.'
  }
});

function practiceBriefFor(locale: Locale, topic: LiveInterviewPracticeTopic) {
  const brief = topic.practice;
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return `\n\n第一題已經列咗喺上面。等我答完，先從以下虛構、可公開使用嘅設定揀一條追問。唔好照讀標籤，唔好將設定講成真實公司個案，亦唔好喺我答之前暗示答案：\n- 情境：${brief.scenario}\n- 答啱一半時常見嘅盲點：${brief.trap}\n- 要講清嘅原理：${brief.mechanism}\n- 要講清嘅取捨：${brief.tradeoff}\n- 要防嘅失敗情況：${brief.failure}\n- 可以帶出嘅證據：${brief.evidence}\n\n如果我答啱一半，先指出盲點，再由原理、取捨、失敗情況或證據其中一項收窄問題；唔好代替我補答案。`;
  if (sourceLocale === 'zh-TW') return `\n\n第一題已列在上方。只在我回答後，才用以下虛構、可公開使用的設定選一條追問；不要照讀標籤、不要把設定說成真實公司個案，也不要在我回答前暗示答案：\n- 情境：${brief.scenario}\n- 答對一半時常見的盲點：${brief.trap}\n- 要追到的機制：${brief.mechanism}\n- 要說清的取捨：${brief.tradeoff}\n- 要測試的失敗路徑：${brief.failure}\n- 候選人可帶出的證據：${brief.evidence}\n\n如果我答對一半，指出盲點，再從機制、取捨、失敗路徑或證據其中一項收窄問題；不要替我補答案。`;
  if (locale === 'zh-Hans') return `\n\n第一题已列在上方。只在我回答后，才用以下虚构、可公开使用的设定选一条追问；不要照读标签、不要把设定说成真实公司个案，也不要在我回答前暗示答案：\n- 情境：${brief.scenario}\n- 答对一半时常见的盲点：${brief.trap}\n- 要追到的机制：${brief.mechanism}\n- 要说清的取舍：${brief.tradeoff}\n- 要测试的失败路径：${brief.failure}\n- 候选人可带出的证据：${brief.evidence}\n\n如果我答对一半，指出盲点，再从机制、取舍、失败路径或证据其中一项收窄问题；不要替我补答案。`;
  return `\n\nThe opening question is already above. Only after I answer, use this fictional, public-safe practice brief to choose one follow-up. Do not read the labels aloud, present the brief as a real company case, or hint at an answer before I respond:\n- Scenario: ${brief.scenario}\n- Half-right-answer trap: ${brief.trap}\n- Mechanism to probe: ${brief.mechanism}\n- Trade-off to name: ${brief.tradeoff}\n- Failure path to test: ${brief.failure}\n- Evidence the candidate can bring: ${brief.evidence}\n\nIf I give a half-right answer, probe the trap first, then narrow to one mechanism, trade-off, failure path, or evidence item. Do not complete my answer for me.`;
}

function questionTextFor(locale: Locale, topic: LiveInterviewPracticeTopic, initialInterviewerQuestion?: string) {
  if (topic.interviewerQuestion?.trim()) return topic.interviewerQuestion.trim();
  if (initialInterviewerQuestion?.trim()) return initialInterviewerQuestion.trim();
  const brief = topic.practice;
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return '根據呢個虛構情境「' + brief.scenario + '」，你會作咩決定？請講清佢靠咩原理、要取捨乜、邊度可能出錯，同埋你會用乜安全材料核對。';
  if (sourceLocale === 'zh-TW') return '根據這個虛構情境「' + brief.scenario + '」，你會作什麼決策？請解釋它依靠什麼原理、要取捨什麼、哪裡可能出錯，以及你會用什麼安全材料核對。';
  if (locale === 'zh-Hans') return '根据这个虚构情境“' + brief.scenario + '”，你会作什么决策？请解释它依靠什么原理、要取舍什么、哪里可能出错，以及你会用什么安全材料核对。';
  return 'Given this fictional scenario — “' + brief.scenario + '” — what decision would you make? Explain the mechanism it relies on, the trade-off, where it could fail, and what safe material you would use to check it.';
}

function openingQuestionContractFor(locale: Locale, question: string) {
  const questionBlock = '<CURRENT_INTERVIEW_QUESTION>\n' + question + '\n</CURRENT_INTERVIEW_QUESTION>';
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return '第一題要逐字問以下問題。唔好改成另一條泛泛嘅題目，亦唔好喺我答之前透露或補完示範答案：\n' + questionBlock;
  if (sourceLocale === 'zh-TW') return '第一題必須逐字問以下問題；不要改成另一條泛泛的題目，也不要在我回答前透露或補完示範答案：\n' + questionBlock;
  if (locale === 'zh-Hans') return '第一题必须逐字问以下问题；不要改成另一条泛泛的题目，也不要在我回答前透露或补完示范答案：\n' + questionBlock;
  return 'Ask this exact question first. Do not replace it with a generic question, or reveal or complete a sample answer before I respond:\n' + questionBlock;
}

function debriefQuestionContextFor(locale: Locale, question: string) {
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return '\n\n今次練習問嘅問題係：\n<CURRENT_INTERVIEW_QUESTION>\n' + question + '\n</CURRENT_INTERVIEW_QUESTION>\n只可用對話紀錄內嘅答案作評估，唔好將上面問題當成答案提示。';
  if (sourceLocale === 'zh-TW') return '\n\n這次練習問的問題是：\n<CURRENT_INTERVIEW_QUESTION>\n' + question + '\n</CURRENT_INTERVIEW_QUESTION>\n只能用對話紀錄裡的答案評估，不要把上面的問題當成答案提示。';
  if (locale === 'zh-Hans') return '\n\n这次练习问的问题是：\n<CURRENT_INTERVIEW_QUESTION>\n' + question + '\n</CURRENT_INTERVIEW_QUESTION>\n只能用对话记录里的答案评估，不要把上面的问题当成答案提示。';
  return '\n\nThe question practised was:\n<CURRENT_INTERVIEW_QUESTION>\n' + question + '\n</CURRENT_INTERVIEW_QUESTION>\nUse only the answer in the transcript to assess it; do not treat the question above as an answer cue.';
}

function scorecardAnchorsFor(locale: Locale) {
  return copy[locale].scorecardCriteria.map(criterion => [
    '- ' + criterion.label,
    '  0: ' + criterion.anchors[0],
    '  1: ' + criterion.anchors[1],
    '  2: ' + criterion.anchors[2],
    '  3: ' + criterion.anchors[3]
  ].join('\n')).join('\n');
}

function scorecardContractFor(locale: Locale) {
  const anchors = scorecardAnchorsFor(locale);
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return [
    '',
    '',
    '最後一定要用固定評分表。每項寫「0–3 分｜一段短引述或對話紀錄位置｜按準則嘅理由｜仍欠乜」；引述只可來自我實際講過嘅內容：',
    anchors,
    '如果我有回答但完全唔符合某項，可以畀 0 分；如果連可引述嘅回答或對話紀錄都冇，寫「資料不足」，唔好補故事。'
  ].join('\n');
  if (sourceLocale === 'zh-TW') return [
    '',
    '',
    '最後一定要用固定評分表。每項寫「0–3 分｜一段短引述或對話紀錄位置｜依準則的理由｜還缺什麼」；引述只能來自我實際說過的內容：',
    anchors,
    '如果我有回答但完全不符合某項，可以給 0 分；如果連可引述的回答或對話紀錄都沒有，寫「資料不足」，不要補故事。'
  ].join('\n');
  if (locale === 'zh-Hans') return [
    '',
    '',
    '最后一定要用固定评分表。每项写“0–3 分｜一段短引用或对话记录位置｜按准则的理由｜还缺什么”；引用只能来自我实际说过的内容：',
    anchors,
    '如果我有回答但完全不符合某项，可以给 0 分；如果连可引用的回答或对话记录都没有，写“资料不足”，不要补故事。'
  ].join('\n');
  return [
    '',
    '',
    'End with this fixed scorecard. For each item, write “0–3 | a short quote or transcript location | reason against the anchor | what is still missing.” The quote must come from my actual answer:',
    anchors,
    'Use 0 when I answered but meet none of an item’s anchors. If there is no answer or transcript passage to cite, write “not enough evidence” instead of inventing one.'
  ].join('\n');
}

function promptFor(locale: Locale, topic: LiveInterviewPracticeTopic, initialInterviewerQuestion?: string) {
  const title = topic.title;
  const question = openingQuestionContractFor(locale, questionTextFor(locale, topic, initialInterviewerQuestion));
  const practiceBrief = practiceBriefFor(locale, topic);
  const scorecard = scorecardContractFor(locale);
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return [
    '你而家同我做一場 12 分鐘 AI 工程模擬面試。主題係「' + title + '」。',
    '如果你用嘅工具有語音或即時對話模式，就用佢；否則用一般文字對話。一次只問一題，等我完整答完先追問。唔好喺我答之前教書、補完答案或填補沉默。',
    question,
    '聽完我答，只追問一項我漏講嘅內容：操作原理、取捨、可能出錯嘅情況、指標、權限界線，或者邊個作最後決定。',
    '當我講「總結」時，請用短段落回饋：\n1. 我已經講清楚咗乜\n2. 少咗邊個技術原理\n3. 少咗邊個取捨或可能出錯嘅情況\n4. 有冇講到邊個可以作決定、用喺邊度，同埋咩情況要停低交畀人\n5. 一段可以喺 90 秒內講出嘅改寫答案\n6. 兩個下一步練習',
    '分開評清晰度、推理同證據；唔好評口音、信心或語速。唔好聲稱呢個係任何公司嘅真題或者可以預測面試結果。亦唔好替我虛構作品集指標、上線成效或工作經驗。' + scorecard + practiceBrief,
    '由上面嗰條第一題開始，然後停低等我答。'
  ].join('\n\n');
  if (sourceLocale === 'zh-TW') return [
    '你正在和我進行一場 12 分鐘 AI 工程模擬面試。主題是「' + title + '」。',
    '如果你用的工具有語音或即時對話模式，請使用它；否則使用一般文字對話。一次只問一題，等我完整回答後才追問。不要在我回答前教學、補完我的答案或填補沉默。',
    question,
    '聽完我的回答後，只追問一項我漏說的內容：運作原理、取捨、可能出錯的情況、指標、權限界線，或誰作最後決策。',
    '當我說「總結」時，請用短段落回饋：\n1. 我已經說清楚什麼\n2. 少了哪一個技術原理\n3. 少了哪一個取捨或可能出錯的情況\n4. 是否說到誰可以作決策、會用在哪裡，以及什麼情況要停下來交給人\n5. 一段可在 90 秒內說出的改寫答案\n6. 兩個下一步練習',
    '分開評清晰度、推理與證據；不要評口音、信心或語速。不要聲稱這是任何公司的真題或能預測面試結果。不要替我虛構作品集指標、上線成效或工作經驗。' + scorecard + practiceBrief,
    '從上面的第一題開始，然後停下來等我回答。'
  ].join('\n\n');
  if (locale === 'zh-Hans') return [
    '你正在和我进行一场 12 分钟 AI 工程模拟面试。主题是“' + title + '”。',
    '如果你用的工具有语音或即时对话模式，请使用它；否则使用一般文字对话。一次只问一题，等我完整回答后才追问。不要在我回答前教学、补完我的答案或填补沉默。',
    question,
    '听完我的回答后，只追问一项我漏讲的内容：运作原理、取舍、可能出错的情况、指标、权限界线，或谁作最后决策。',
    '当我说“总结”时，请用短段落反馈：\n1. 我已经讲清楚什么\n2. 少了哪一个技术原理\n3. 少了哪一个取舍或可能出错的情况\n4. 是否说到谁可以作决策、会用在哪里，以及什么情况要停下来交给人\n5. 一段可在 90 秒内讲出的改写答案\n6. 两个下一步练习',
    '分开评清晰度、推理和证据；不要评口音、信心或语速。不要声称这是任何公司的真题或能预测面试结果。不要替我虚构作品集指标、上线成效或工作经验。' + scorecard + practiceBrief,
    '从上面的第一题开始，然后停下来等我回答。'
  ].join('\n\n');
  return [
    'Run a 12-minute mock AI engineering interview with me. The topic is “' + title + '.”',
    'Use voice or live chat if the app supports it; otherwise use ordinary text chat. Ask one question at a time and wait for my complete answer before following up. Do not teach, finish my answer, or fill silences before I respond.',
    question,
    'After hearing my answer, ask exactly one follow-up grounded in what I said. Target one missing mechanism, trade-off, failure path, metric, permission boundary, or decision owner.',
    'When I say “wrap up”, give short feedback on:\n1. What I established\n2. The technical mechanism I left out\n3. The trade-off or failure path I left out\n4. Whether I said who can decide, where it may be used, and when it must stop for human review\n5. A rewritten answer I could say in 90 seconds\n6. Two next practice steps',
    'Score clarity, reasoning, and evidence separately. Do not judge accent, confidence, or speaking speed. Do not claim this is a real company question or predict a hiring outcome. Do not invent portfolio metrics, deployment results, or work experience for me.' + scorecard + practiceBrief,
    'Start with the question above and then wait for my answer.'
  ].join('\n\n');
}

function debriefPromptFor(locale: Locale, topic: LiveInterviewPracticeTopic, initialInterviewerQuestion?: string) {
  const title = topic.title;
  const brief = topic.practice;
  const scorecard = scorecardContractFor(locale) + debriefQuestionContextFor(locale, questionTextFor(locale, topic, initialInterviewerQuestion));
  const sourceLocale = (locale === 'zh-Hant' ? 'zh-TW' : locale) as LocaleSource;
  if (sourceLocale === 'zh-HK') return `我啱啱完成咗一段 AI 工程模擬面試，主題係「${title}」。我會喺最後貼上一段只包含虛構、公開或去識別材料嘅對話紀錄。\n\n先檢查對話紀錄有冇僱主、客戶、內部架構、真實數字、API 金鑰或其他未公開資料。如果有，停低叫我移除；唔好重述或利用嗰啲資料。\n\n之後只可以根據對話紀錄作回饋：\n1. 指出一個我已經講得具體嘅判斷或證據\n2. 指出一個被遺漏嘅技術原理，並講清佢點樣影響結論\n3. 指出一個被遺漏嘅取捨、可能出錯嘅情況、容量限制或權限界線\n4. 判斷我有冇分開模型或任務層面嘅訊號、流程代理指標，同仍未觀察到嘅業務成果\n5. 寫一段 90 秒內可以重講嘅答案；只可用對話紀錄內已有嘅事實，未知就直接標成假設\n6. 留一條最值得下次練嘅追問\n\n分開評清晰度、推理同證據。唔好聲稱呢個係任何公司嘅真題，唔好預測面試結果，亦唔好幫我虛構作品集指標、上線成效或工作經驗。${scorecard}\n\n呢條練習嘅虛構設定：\n- 情境：${brief.scenario}\n- 常見盲點：${brief.trap}\n- 要追嘅原理：${brief.mechanism}\n- 要講清嘅取捨：${brief.tradeoff}\n- 要測試嘅失敗情況：${brief.failure}\n- 可帶出嘅證據：${brief.evidence}\n\n對話紀錄（TRANSCRIPT，只貼可公開材料）：\n[貼喺呢度]`;
  if (sourceLocale === 'zh-TW') return `我剛完成一段 AI 工程模擬面試，主題是「${title}」。我會在最後貼上一段只包含虛構、公開或去識別材料的對話紀錄。\n\n先檢查對話紀錄是否有雇主、客戶、內部架構、真實數字、API 金鑰或其他未公開資料。如果有，停止並要求我移除；不要重述或利用那些資料。\n\n接著只根據對話紀錄作回饋：\n1. 指出一個我已經說得具體的判斷或證據\n2. 指出一個遺漏的技術原理，並說明它如何影響結論\n3. 指出一個遺漏的取捨、可能出錯的情況、容量限制或權限界線\n4. 判斷我是否分開模型或任務層面的訊號、流程代理指標與尚未觀察的業務成果\n5. 寫一段 90 秒內可以重講的答案；只能使用對話紀錄裡已有的事實，未知就直接標成假設\n6. 留下一條最值得下次練習的追問\n\n分開評清晰度、推理與證據。不要聲稱這是任何公司的真題、不要預測面試結果，也不要替我虛構作品集指標、上線成效或工作經驗。${scorecard}\n\n這題的虛構設定：\n- 情境：${brief.scenario}\n- 常見盲點：${brief.trap}\n- 要追的原理：${brief.mechanism}\n- 要說清的取捨：${brief.tradeoff}\n- 要測試的失敗情況：${brief.failure}\n- 可帶出的證據：${brief.evidence}\n\n對話紀錄（TRANSCRIPT，只貼可公開材料）：\n[貼在這裡]`;
  if (locale === 'zh-Hans') return `我刚完成一段 AI 工程模拟面试，主题是“${title}”。我会在最后贴上一段只包含虚构、公开或去识别材料的对话记录。\n\n先检查对话记录是否有雇主、客户、内部架构、真实数字、API 密钥或其他未公开资料。如果有，停止并要求我移除；不要复述或利用那些资料。\n\n之后只根据对话记录作反馈：\n1. 指出一个我已经讲得具体的判断或证据\n2. 指出一个遗漏的技术原理，并说明它如何影响结论\n3. 指出一个遗漏的取舍、可能出错的情况、容量限制或权限界线\n4. 判断我是否分开模型或任务层面的信号、流程代理指标与尚未观察的业务成果\n5. 写一段 90 秒内可以重讲的答案；只能使用对话记录里已有的事实，未知就直接标成假设\n6. 留下一条最值得下次练习的追问\n\n分开评清晰度、推理和证据。不要声称这是任何公司的真题、不要预测面试结果，也不要替我虚构作品集指标、上线成效或工作经验。${scorecard}\n\n这题的虚构设定：\n- 情境：${brief.scenario}\n- 常见盲点：${brief.trap}\n- 要追的原理：${brief.mechanism}\n- 要说清的取舍：${brief.tradeoff}\n- 要测试的失败情况：${brief.failure}\n- 可带出的证据：${brief.evidence}\n\n对话记录（TRANSCRIPT，只贴可公开材料）：\n[贴在这里]`;
  return `I have just completed a mock AI engineering interview on “${title}.” I will paste a transcript that contains fictional, public, or de-identified material only.\n\nFirst check whether the transcript contains employer or client details, internal architecture, real metrics, API keys, or other non-public material. If it does, stop and ask me to remove it; do not repeat or use that material.\n\nThen give feedback from the transcript only:\n1. Name one judgement or evidence point I established concretely\n2. Name one technical mechanism I omitted and explain how it changes the conclusion\n3. Name one missing trade-off, failure path, capacity limit, or permission boundary\n4. Decide whether I separated a model/task signal, workflow proxy, and an unobserved business outcome\n5. Write a 90-second answer I can say again; use only facts already in the transcript and mark unknowns as assumptions\n6. Leave one follow-up question that is most worth practising next\n\nScore clarity, reasoning, and evidence separately. Do not claim this is a question from any company, predict a hiring result, or invent portfolio metrics, deployment outcomes, or work experience.${scorecard}\n\nFictional practice brief:\n- Scenario: ${brief.scenario}\n- Common trap: ${brief.trap}\n- Mechanism to probe: ${brief.mechanism}\n- Trade-off to name: ${brief.tradeoff}\n- Failure path to test: ${brief.failure}\n- Evidence I could bring: ${brief.evidence}\n\nTRANSCRIPT (public-safe material only):\n[PASTE HERE]`;
}

function fallbackCopy(text: string, returnFocus?: HTMLElement | null) {
  const fallback = document.createElement('textarea');
  fallback.value = text;
  fallback.setAttribute('readonly', '');
  fallback.style.position = 'fixed';
  fallback.style.opacity = '0';
  document.body.appendChild(fallback);
  fallback.select();
  try {
    return document.execCommand('copy');
  } finally {
    fallback.remove();
    returnFocus?.focus();
  }
}

export function LiveInterviewPractice({ locale, topics, initialTopicSlug, initialInterviewerQuestion, embedded = false }: LiveInterviewPracticeProps) {
  const labels = copy[locale];
  const [selectedSlug, setSelectedSlug] = useState(initialTopicSlug ?? topics[0]?.slug ?? '');
  const [interviewCopyState, setInterviewCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [debriefCopyState, setDebriefCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const interviewCopyButtonRef = useRef<HTMLButtonElement>(null);
  const debriefCopyButtonRef = useRef<HTMLButtonElement>(null);
  const initialTopic = useMemo(
    () => initialTopicSlug ? topics.find(topic => topic.slug === initialTopicSlug) : undefined,
    [initialTopicSlug, topics],
  );
  const selectedTopic = useMemo(
    () => topics.find(topic => topic.slug === selectedSlug) ?? initialTopic ?? topics[0],
    [initialTopic, selectedSlug, topics],
  );

  if (!selectedTopic) return null;
  const selectedTopicChanged = Boolean(initialTopic && selectedTopic.slug !== initialTopic.slug);
  const selectedInterviewerQuestion = selectedTopic.interviewerQuestion?.trim()
    || (selectedTopic.slug === initialTopicSlug ? initialInterviewerQuestion : undefined);
  const prompt = promptFor(locale, selectedTopic, selectedInterviewerQuestion);
  const debriefPrompt = debriefPromptFor(locale, selectedTopic, selectedInterviewerQuestion);

  async function copyPrompt() {
    let didCopy = false;
    try {
      if (navigator.clipboard?.writeText) {
        didCopy = await Promise.race([
          navigator.clipboard.writeText(prompt).then(() => true).catch(() => false),
          new Promise<boolean>(resolve => window.setTimeout(() => resolve(false), 500)),
        ]);
      }
    } catch {
      didCopy = false;
    }
    if (!didCopy) didCopy = fallbackCopy(prompt, interviewCopyButtonRef.current);
    setInterviewCopyState(didCopy ? 'copied' : 'failed');
    if (didCopy) window.setTimeout(() => setInterviewCopyState('idle'), 1800);
  }

  async function copyDebriefPrompt() {
    let didCopy = false;
    try {
      if (navigator.clipboard?.writeText) {
        didCopy = await Promise.race([
          navigator.clipboard.writeText(debriefPrompt).then(() => true).catch(() => false),
          new Promise<boolean>(resolve => window.setTimeout(() => resolve(false), 500)),
        ]);
      }
    } catch {
      didCopy = false;
    }
    if (!didCopy) didCopy = fallbackCopy(debriefPrompt, debriefCopyButtonRef.current);
    setDebriefCopyState(didCopy ? 'copied' : 'failed');
    if (didCopy) window.setTimeout(() => setDebriefCopyState('idle'), 1800);
  }

  const content = <>
    <div className="live-interview-controls">
      <label htmlFor="live-interview-topic">{labels.topicLabel}</label>
      <select id="live-interview-topic" value={selectedTopic.slug} onChange={event => setSelectedSlug(event.target.value)}>
        {topics.map(topic => <option key={topic.slug} value={topic.slug}>{topic.number}. {topic.title}</option>)}
      </select>
      {selectedTopicChanged ? <p className="live-interview-topic-context" role="status" aria-live="polite">{labels.topicChanged.replace('{topic}', `${selectedTopic.number}. ${selectedTopic.title}`)}</p> : null}
    </div>
    <aside className="live-interview-scorecard" aria-labelledby="live-interview-scorecard-title">
      <header>
        <h3 id="live-interview-scorecard-title">{labels.scorecardTitle}</h3>
        <p>{labels.scorecardIntro}</p>
      </header>
      <ol>
        {labels.scorecardCriteria.map((criterion, index) => <li key={criterion.label}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <strong>{criterion.label}</strong>
            <p>{criterion.detail}</p>
            <ul className="live-interview-scorecard-anchors">
              {criterion.anchors.map((anchor, score) => <li key={score}>
                <span>{score}</span>
                <p>{anchor}</p>
              </li>)}
            </ul>
          </div>
        </li>)}
      </ol>
      <p className="live-interview-scorecard-rule">{labels.scorecardRule}</p>
    </aside>
    <div className="live-interview-prompt">
      <div className="live-interview-prompt-header"><h3>{labels.promptLabel}</h3><button ref={interviewCopyButtonRef} className="button primary" type="button" onClick={copyPrompt}>{interviewCopyState === 'copied' ? labels.copied : labels.copy}</button></div>
      <textarea readOnly aria-label={labels.promptLabel} value={prompt} />
      {interviewCopyState !== 'idle' ? <p className="live-interview-copy-status" role="status" aria-live="polite">{interviewCopyState === 'copied' ? labels.copied : labels.copyFailed}</p> : null}
    </div>
    <div className="live-interview-prompt live-interview-debrief">
      <div className="live-interview-prompt-header"><h3>{labels.debriefTitle}</h3><button ref={debriefCopyButtonRef} className="button" type="button" onClick={copyDebriefPrompt}>{debriefCopyState === 'copied' ? labels.debriefCopied : labels.debriefCopy}</button></div>
      <p className="live-interview-debrief-intro">{labels.debriefIntro}</p>
      <textarea readOnly aria-label={labels.debriefLabel} value={debriefPrompt} />
      <p className="live-interview-debrief-note">{labels.debriefNote}</p>
      {debriefCopyState !== 'idle' ? <p className="live-interview-copy-status" role="status" aria-live="polite">{debriefCopyState === 'copied' ? labels.debriefCopied : labels.copyFailed}</p> : null}
    </div>
    <aside className="live-interview-boundary"><strong>{labels.privacyTitle}</strong><p>{labels.privacy}</p><p>{labels.note}</p></aside>
  </>;

  if (embedded) return <div className="live-interview-practice-content">{content}</div>;

  return <section id="live-interview-practice" className="live-interview-practice" aria-labelledby="live-interview-practice-title" tabIndex={-1}>
    <div className="live-interview-heading">
      <p className="eyebrow">{labels.eyebrow}</p>
      <h2 id="live-interview-practice-title">{labels.title}</h2>
      <p>{labels.intro}</p>
    </div>
    {content}
  </section>;
}
