import type { Locale } from './types';
import { canonicalLocaleRecord, normalizeLocaleContent } from './types';

type TrackStep = {
  articleId: string;
  purpose: Record<Locale, string>;
};

type StarterLab = {
  href: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  action: Record<Locale, string>;
};

export type AiUseTrack = {
  id: 'non-coder' | 'coder';
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  categoryHref: Record<Locale, string>;
  categoryLabel: Record<Locale, string>;
  steps: TrackStep[];
  starterLab?: StarterLab;
};

export const aiUseTracks: AiUseTrack[] = normalizeLocaleContent([
  {
    id: 'non-coder',
    eyebrow: {
      'zh-HK': '不寫 Code 路線',
      'zh-TW': '不寫 Code 路線',
      'zh-Hans': '不写 Code 路线',
      en: 'No-code route'
    },
    title: {
      'zh-HK': '由一個草稿練習，學會先問清權限',
      'zh-TW': '從一個草稿練習，學會先問清權限',
      'zh-Hans': '从一个草稿练习，学会先问清权限',
      en: 'Learn permission review through one draft exercise'
    },
    intro: {
      'zh-HK': '想用 Codex、Grok 或其他 agent 幫手準備工作，可以；交出去之前，仍要知道它讀咗乜、做咗乜，同邊個最後拍板。',
      'zh-TW': '想用 Codex、Grok 或其他 agent 協助準備工作，可以；交出去之前，仍要知道它讀了什麼、做了什麼，以及誰最後拍板。',
      'zh-Hans': '可以用 Codex、Grok 或其他 agent 协助准备工作；交出去之前，仍要知道它读了什么、做了什么，以及谁最后拍板。',
      en: 'Use Codex, Grok, or another agent for preparation work—but before anything leaves your desk, know what it read, what it did, and who makes the final call.'
    },
    categoryHref: {
      'zh-HK': '/zh-HK/categories/low-code-ai-builders',
      'zh-TW': '/zh-TW/categories/low-code-ai-builders',
      'zh-Hans': '/zh-Hans/categories/low-code-ai-builders',
      en: '/en/categories/low-code-ai-builders'
    },
    categoryLabel: {
      'zh-HK': '查看所有不寫 Code 教學',
      'zh-TW': '查看所有不寫 Code 教學',
      'zh-Hans': '查看所有不写 Code 教学',
      en: 'Browse all AI-without-Code guides'
    },
    starterLab: {
      href: '/no-code-starter-lab',
      title: {
        'zh-HK': '完成 15 分鐘起步後，才延伸六個案例',
        'zh-TW': '完成 15 分鐘起步後，再延伸六個案例',
        'zh-Hans': '完成 15 分钟起步后，再延伸六个案例',
        en: 'Extend to six cases only after the 15-minute start'
      },
      description: {
        'zh-HK': 'AC-01 嘅 15 分鐘手動檢查已經可以完成同停低：保留 HLS-001，route 標為 DRAFT_REVIEW_NOTE，同確認冇有外部動作。只有想再練更多例外，才做 AC-02 至 AC-06。',
        'zh-TW': 'AC-01 的 15 分鐘手動檢查已可完成並停止：保留 HLS-001，route 標為 DRAFT_REVIEW_NOTE，並確認沒有外部動作。只有想再練更多例外，才做 AC-02 至 AC-06。',
        'zh-Hans': 'AC-01 的 15 分钟手动检查已经可以完成并停止：保留 HLS-001，route 标为 DRAFT_REVIEW_NOTE，并确认没有外部动作。只有想再练更多例外，才做 AC-02 到 AC-06。',
        en: 'The 15-minute AC-01 manual check is a complete stopping point: retain HLS-001 and DRAFT_REVIEW_NOTE, then confirm there is no external action. Only extend to AC-02 through AC-06 when you want more exception practice.'
      },
      action: {
        'zh-HK': '查看可選六案例延伸',
        'zh-TW': '查看可選六案例延伸',
        'zh-Hans': '查看可选六案例延伸',
        en: 'View the optional six-case extension'
      }
    },
    steps: [
      {
        articleId: 'ai-agent-permission-review',
        purpose: {
          'zh-HK': '先睇清 AI 想讀、寫、連接定發送乜，先決定開唔開權限。',
          'zh-TW': '先看清 AI 想讀、寫、連接或發送什麼，再決定是否開權限。',
          'zh-Hans': '先看清 AI 想读、写、连接或发送什么，再决定是否开放权限。',
          en: 'See what the agent wants to read, write, connect, or send before you grant permission.'
        }
      },
      {
        articleId: 'non-coder-ai-workflow',
        purpose: {
          'zh-HK': '將一段要求收窄成虛構資料、固定格式，同埋要交返畀人處理嘅情況。',
          'zh-TW': '把一段要求收窄成虛構資料、固定格式，以及必須交回人處理的情況。',
          'zh-Hans': '把一段要求收窄成虚构数据、固定格式，以及必须交回人处理的情境。',
          en: 'Narrow one request into fictional inputs, a fixed format, and cases that must go back to a person.'
        }
      },
      {
        articleId: 'low-code-automation',
        purpose: {
          'zh-HK': '用預先寫好嘅案例檢查流程，唔好只靠一次順暢示範。',
          'zh-TW': '用預先寫好的案例檢查流程，不要只靠一次順暢示範。',
          'zh-Hans': '用预先写好的案例检查流程，不要只靠一次顺畅演示。',
          en: 'Check the workflow with cases written in advance; do not trust one smooth demonstration.'
        }
      },
      {
        articleId: 'coding-agent-review-loop',
        purpose: {
          'zh-HK': '就算唔寫 Code，都可以睇明計劃、改動同測試，知道覆核嘅人最後點樣決定。',
          'zh-TW': '就算不寫 Code，也能看懂計畫、改動與測試，知道覆核的人最後怎麼決定。',
          'zh-Hans': '就算不写 Code，也能看懂计划、改动与测试，知道复核的人最后怎样决定。',
          en: 'Even if you do not write code, learn to read the plan, the change, the tests, and the reviewer’s decision.'
        }
      },
      {
        articleId: 'approval-queue-reference',
        purpose: {
          'zh-HK': '睇一個只用虛構資料、由輸入到覆核都有寫低嘅示例，再核對自己仲欠咩工作說明。',
          'zh-TW': '看一個只用虛構資料、從輸入到覆核都有寫下來的示例，再核對自己還缺什麼工作說明。',
          'zh-Hans': '看一个只用虚构数据、从输入到复核都有写下来的示例，再核对自己还缺什么工作说明。',
          en: 'Read a worked example that uses fictional data only and records each step through review, then identify what you still need to explain about your own work.'
        }
      }
    ]
  },
  {
    id: 'coder',
    eyebrow: {
      'zh-HK': '有寫 Code 路線',
      'zh-TW': '有寫 Code 路線',
      'zh-Hans': '写 Code 路线',
      en: 'Coder route'
    },
    title: {
      'zh-HK': '由一份改動說明，做到可覆核嘅程式工作',
      'zh-TW': '從一份改動說明，做到可覆核的程式工作',
      'zh-Hans': '从一份改动说明，做到可复核的程序工作',
      en: 'Turn a change request into reviewable engineering work'
    },
    intro: {
      'zh-HK': '已有程式碼庫，或者想試 agent 提議嘅改動，就先講清今次做乜、唔做乜、點樣測試、資料可唔可以用，同埋出事時點樣退返上一版。更多程式碼唔係目標。',
      'zh-TW': '已有程式碼庫，或想試 agent 提議的改動，就先說清這次要做什麼、不做什麼、怎麼測試、資料能不能用，以及出事時怎麼退回上一版。寫更多程式碼不是目標。',
      'zh-Hans': '已有代码库，或想试 agent 提议的改动，就先说清这次要做什么、不做什么、怎样测试、数据能不能用，以及出事时怎样退回上一版。写更多代码不是目标。',
      en: 'If you have a codebase or want to try an agent’s change, define what this change does and does not do, how it will be tested, whether the data is allowed, and how to return to the previous version if it goes wrong. More code is not the goal.'
    },
    categoryHref: {
      'zh-HK': '/zh-HK/categories/ai-for-coders',
      'zh-TW': '/zh-TW/categories/ai-for-coders',
      'zh-Hans': '/zh-Hans/categories/ai-for-coders',
      en: '/en/categories/ai-for-coders'
    },
    categoryLabel: {
      'zh-HK': '查看所有寫 Code 教學',
      'zh-TW': '查看所有寫 Code 教學',
      'zh-Hans': '查看所有写 Code 教学',
      en: 'Browse all AI-for-Coders guides'
    },
    starterLab: {
      href: '/coding-starter-lab',
      title: {
        'zh-HK': '完成 15 分鐘起步後，再做完整程式覆核',
        'zh-TW': '完成 15 分鐘起步後，再做完整程式覆核',
        'zh-Hans': '完成 15 分钟起步后，再做完整代码审查',
        en: 'Complete the full coding review after the 15-minute start'
      },
      description: {
        'zh-HK': '15 分鐘只判斷 TC-01 同 TC-06，暫時唔寫 Code。只有有 45–60 分鐘時，才用六份英文虛構來源檔完成改動說明、人手基準、程式差異同覆核記錄。',
        'zh-TW': '15 分鐘只判斷 TC-01 與 TC-06，暫時不寫 Code。只有有 45–60 分鐘時，才用六份英文虛構來源檔完成改動說明、人工基準、程式差異與覆核記錄。',
        'zh-Hans': '15 分钟只判断 TC-01 和 TC-06，暂时不写 Code。只有有 45–60 分钟时，才用六份英文虚构源文件完成改动说明、人工基准、代码差异和复核记录。',
        en: 'The 15-minute start judges TC-01 and TC-06 only; you do not write code yet. Use the six English fictional source assets for the change brief, manual baseline, diff, and reviewer record only when you have 45–60 minutes.'
      },
      action: {
        'zh-HK': '繼續完整 Coder Starter Lab（45–60 分鐘）',
        'zh-TW': '繼續完整 Coder Starter Lab（45–60 分鐘）',
        'zh-Hans': '继续完整 Coder Starter Lab（45–60 分钟）',
        en: 'Continue the full Coder Starter Lab (45–60 minutes)'
      }
    },
    steps: [
      {
        articleId: 'coder-ai-pair-workflow',
        purpose: {
          'zh-HK': '先寫清要改乜、今次唔改乜，同埋邊啲情況會出事，先請 agent 提計劃或改動。',
          'zh-TW': '先寫清要改什麼、這次不改什麼，以及哪些情況會出事，再請 agent 提計畫或改動。',
          'zh-Hans': '先写清要改什么、这次不改什么，以及哪些情境会出事，再请 agent 提计划或改动。',
          en: 'Write down what changes, what does not change, and which cases could fail before asking an agent for a plan or code change.'
        }
      },
      {
        articleId: 'implementation-evidence-loop',
        purpose: {
          'zh-HK': '將改動說明寫成輸入同輸出、正常同出錯情況，仲有覆核後可以點決定。先確定改動有得檢查，再處理批次流程。',
          'zh-TW': '把改動說明寫成輸入與輸出、正常與出錯情況，還有覆核後可以怎麼決定。先確定改動能檢查，再處理批次流程。',
          'zh-Hans': '把改动说明写成输入与输出、正常与出错情境，还有复核后可以怎样决定。先确定改动能检查，再处理批次流程。',
          en: 'Write the change as inputs and outputs, normal and failure cases, and the possible review decisions. Make the change checkable before you tackle batch work.'
        }
      },
      {
        articleId: 'ai-batch-worker-reliability',
        purpose: {
          'zh-HK': '將 agent 寫嘅批次工作變成可測試流程：排隊、重試、避免重做已完成項目、保存中途進度，同埋交返畀人處理嘅出口。',
          'zh-TW': '把 agent 寫的批次工作變成可測試流程：排隊、重試、避免重做已完成項目、保存中途進度，以及交回人處理的出口。',
          'zh-Hans': '把 agent 写的批次工作变成可测试流程：排队、重试、避免重做已完成项目、保存中途进度，以及交回人处理的出口。',
          en: 'Turn an agent-written batch job into a testable flow: queue work, retry safely, avoid repeating completed items, save progress, and provide a route back to a person.'
        }
      },
      {
        articleId: 'professional-workflow',
        purpose: {
          'zh-HK': '將模糊要求講清楚：邊個拍板、點先叫做做到、出錯點算、邊個批，同埋點退返上一版。',
          'zh-TW': '把模糊要求講清楚：誰拍板、怎樣才算做到、出錯怎麼辦、誰批，以及怎麼退回上一版。',
          'zh-Hans': '把模糊要求讲清楚：谁拍板、怎样才算做到、出错怎么办、谁批，以及怎样退回上一版。',
          en: 'Make a vague request concrete: who decides, what counts as done, what happens on failure, who approves it, and how to return to the previous version.'
        }
      },
      {
        articleId: 'prompt-evidence',
        purpose: {
          'zh-HK': '改 prompt 時留低相同題目同預期結果，先至比較到新舊做法。',
          'zh-TW': '改 prompt 時留下相同題目與預期結果，才比較得到新舊做法。',
          'zh-Hans': '改 prompt 时留下相同题目与预期结果，才比较得到新旧做法。',
          en: 'When you change a prompt, keep the same questions and expected results so you can compare the old and new approaches.'
        }
      },
      {
        articleId: 'policy-pilot',
        purpose: {
          'zh-HK': '分清目前真有嘅規則式對照做法、附來源草稿、去識別化處理紀錄同人手交接；檢索（RAG）或模型擴充要另外設計同核准。',
          'zh-TW': '分清目前真的有的規則式對照做法、附來源草稿、去識別化處理紀錄與人工交接；檢索（RAG）或模型擴充要另外設計與核准。',
          'zh-Hans': '分清目前真的有的规则式对照做法、附来源草稿、去标识化处理记录与人工交接；检索（RAG）或模型扩充要另外设计与批准。',
          en: 'Separate what is actually present today—rule-based comparison, source-linked drafts, redacted records, and human handoff—from any retrieval (RAG) or model extension that needs its own design and approval.'
        }
      }
    ]
  }
]) as unknown as AiUseTrack[];

export const aiUseRouteCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  tracksEyebrow: string;
  crossOverTitle: string;
  crossOver: string;
  step: string;
}> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '兩種開始方法',
    title: '每條路先有一個短起步，再留低講得清嘅成果',
    intro: '上面每條路只會畀你一個首選起步；完成後，先用下面嘅路線內容延伸。不寫 Code 路線先幫你講清楚工作同檢查方法；要睇實作、改動或測試時，再去 coder 路線。',
    tracksEyebrow: '兩條路線',
    crossOverTitle: '幾時轉去寫 Code 路線？',
    crossOver: '要睇程式碼、跑測試或實作受控改動，先轉去寫 Code 路線。真實資料、登入、連接 app、發送、更新、批核或部署一出現，就先停低，交畀有權限嘅人決定；寫 Code 唔會令呢啲 action 自動獲批。',
    step: '第'
  },
  'zh-TW': {
    eyebrow: '兩種開始方法',
    title: '每條路先有一個短起步，再留下一份說得清楚的成果',
    intro: '上方每條路只會給你一個首選起步；完成後，再用下方路線內容延伸。不寫 Code 路線先幫你說清楚工作與檢查方法；要看實作、改動或測試時，再去 coder 路線。',
    tracksEyebrow: '兩條路線',
    crossOverTitle: '何時轉去寫 Code 路線？',
    crossOver: '需要看程式碼、跑測試或實作受控改動時，再轉到寫 Code 路線。一旦要求涉及真實資料、登入、連接 app、發送、更新、核准或部署，就先停止，交給有權限的人決定；寫 Code 不會讓這些 action 自動獲准。',
    step: '第'
  },
  'zh-Hans': {
    eyebrow: '两种开始方法',
    title: '每条路线先有一个短起步，再留下一份说得清楚的成果',
    intro: '上方每条路线只会给你一个首选起步；完成后，再用下方路线内容延伸。不写 Code 路线先帮你说清工作与检查方法；要看实现、改动或测试时，再去 coder 路线。',
    tracksEyebrow: '两条路线',
    crossOverTitle: '何时转去写 Code 路线？',
    crossOver: '需要看代码、跑测试或实现受控改动时，再转到写 Code 路线。一旦要求涉及真实数据、登录、连接 app、发送、更新、批准或部署，就先停止，交给有权限的人决定；写 Code 不会让这些 action 自动获准。',
    step: '第'
  },
  en: {
    eyebrow: 'Two ways to begin',
    title: 'Each route has one short start, then something you can explain',
    intro: 'Each route above gives you one preferred start; use the route material below only after it. The no-code route helps you define the work and how to check it; move to the coder route when you need to inspect implementation, a change, or tests.',
    tracksEyebrow: 'Two tracks',
    crossOverTitle: 'When should you cross over?',
    crossOver: 'Move to the coder route when you need to review code, run tests, or implement a controlled change. If a request needs real data, sign-in, an app connection, sending, updating, approval, or deployment, stop and ask an authorised person to decide; writing code does not approve the action.',
    step: 'Step'
  }
});
