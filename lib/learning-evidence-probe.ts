import type { Locale } from './types';
import { canonicalLocaleRecord } from './types';

export const LEARNING_ROUTE_IDS = ['no-code', 'coder'] as const;
export type LearningRouteId = typeof LEARNING_ROUTE_IDS[number];

export const PROBE_CHECK_IDS = ['local-artefact', 'scope-boundary', 'negative-case', 'review-record'] as const;
export type ProbeCheckId = typeof PROBE_CHECK_IDS[number];

export type ProbeCheckStatus = 'not-started' | 'observed' | 'revise' | 'stop';

type Option = { value: ProbeCheckStatus; label: string };

type Route = {
  label: string;
  intro: string;
  steps: string[];
  inspectable: string;
  handoff: string;
  starterLab: {
    title: string;
    text: string;
    action: string;
    href: string;
    boundary: string;
  };
};

type PortfolioHandoff = {
  eyebrow: string;
  title: string;
  intro: string;
  carryHeading: string;
  carryItems: Record<LearningRouteId, string[]>;
  outcome: Record<'ready' | 'revise' | 'stop', { title: string; text: string; action: string }>;
  boundary: string;
};

export type LearningEvidenceProbeCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  routeLabel: string;
  routeHelp: string;
  routeHeading: string;
  stepsHeading: string;
  inspectableHeading: string;
  handoffHeading: string;
  recordHeading: string;
  recordHelp: string;
  checks: Record<ProbeCheckId, { label: string; help: string }>;
  options: Option[];
  outcomeHeading: string;
  outcomeLabel: string;
  outcomes: Record<'ready' | 'revise' | 'stop', { label: string; text: string }>;
  evidenceBoundary: string;
  copyRecord: string;
  copySuccess: string;
  copyError: string;
  copyNote: string;
  recordRoute: string;
  recordGap: string;
  recordSource: string;
  recordOutcome: string;
  recordChecks: string;
  portfolioHandoff: PortfolioHandoff;
  routes: Record<LearningRouteId, Route>;
};

export const learningEvidenceProbeCopy: Record<Locale, LearningEvidenceProbeCopy> = canonicalLocaleRecord({
  en: {
    eyebrow: 'LOCAL ROUTE REHEARSAL',
    title: 'Test the route with work you can keep',
    intro: 'A source comparison is only a hypothesis. Use this small, account-free rehearsal to check whether the route can produce inspectable work before you spend more time or money.',
    routeLabel: 'Which route are you rehearsing?',
    routeHelp: 'Choose the way you work today. You can cross over later when the work itself requires it.',
    routeHeading: 'The smallest useful rehearsal',
    stepsHeading: 'Make this locally',
    inspectableHeading: 'Someone can inspect',
    handoffHeading: 'The work also shows',
    recordHeading: 'Record what actually happened',
    recordHelp: 'Do the exercise before changing these fields. A checkbox is not evidence; keep the local note, table, test output, or reviewer comment it refers to.',
    checks: {
      'local-artefact': { label: 'Keepable local artefact', help: 'Did you save the brief, table, or small code/test file where you can reopen it?' },
      'scope-boundary': { label: 'Boundary written down', help: 'Did you name synthetic/public-safe inputs, a non-goal, and the human who still owns the decision?' },
      'negative-case': { label: 'One negative case observed', help: 'Did one missing, unsafe, conflicting, or out-of-scope case visibly route to HANDOFF, BLOCKED, or a test failure?' },
      'review-record': { label: 'A decision record', help: 'Did you write PASS, REVISE, or STOP with a reason instead of treating completion as a result?' }
    },
    options: [
      { value: 'not-started', label: 'Not run / no local record yet' },
      { value: 'observed', label: 'Observed and kept locally' },
      { value: 'revise', label: 'Observed a mismatch; revise the route or artefact' },
      { value: 'stop', label: 'Stop: unsafe, unclear, or needs a different route' }
    ],
    outcomeHeading: 'Route evidence outcome',
    outcomeLabel: 'Current local decision',
    outcomes: {
      ready: {
        label: 'PASS the small rehearsal',
        text: 'You have a bounded local record with a visible boundary, one negative case, and a written decision. Continue with one next module or small change, then repeat the same check. This does not certify a skill, provider, or job readiness.'
      },
      revise: {
        label: 'REVISE before investing more',
        text: 'A missing record or mismatch is useful evidence. Reduce the scope, make the expected route clearer, or choose a source that gives you a checkable first task. Do not use a completion badge to fill the gap.'
      },
      stop: {
        label: 'STOP this version of the route',
        text: 'Do not add an account, key, real data, or external action just to force a pass. Keep the stop note, then choose a lower-risk route or ask the named decision owner what must be clarified.'
      }
    },
    evidenceBoundary: 'This is a local learning receipt, not a credential, provider rating, production claim, or proof of business impact. It must not contain API keys, connected accounts, employer data, client data, or an external action.',
    copyRecord: 'Copy local route record',
    copySuccess: 'Copied. It remains on this device until you choose where to paste it.',
    copyError: 'Copying is unavailable in this browser. You can still select the record below.',
    copyNote: 'The record contains only choices made on this page. Nothing is stored or sent.',
    recordRoute: 'Route rehearsed',
    recordGap: 'Evidence gap',
    recordSource: 'Compared source slot',
    recordOutcome: 'Local decision',
    recordChecks: 'Observed checks',
    portfolioHandoff: {
      eyebrow: 'BEFORE YOU CALL IT A PORTFOLIO PROJECT',
      title: 'Carry the record forward; do not carry a success claim',
      intro: 'This rehearsal can show that you kept a bounded decision, cases, and a review outcome. It cannot show business impact, model quality, production readiness, or professional experience. Move the evidence forward only after you can say exactly what was observed.',
      carryHeading: 'Keep these four pieces together',
      carryItems: {
        'no-code': [
          'The fictional decision and the named person who keeps the final action.',
          'The allowed synthetic input and the action that stays prohibited.',
          'The six expected-versus-observed routes, including a handoff or blocked case.',
          'The reviewer record and the reason for PASS, REVISE, or STOP.'
        ],
        coder: [
          'The small change brief, its non-goal, and the person who decides whether to release it.',
          'The allowed source-file scope and the fixed input cases.',
          'The manual baseline plus the observed test or review result, including a failure case.',
          'The reviewer or rollback record and the reason for PASS, REVISE, or STOP.'
        ]
      },
      outcome: {
        ready: {
          title: 'PASS means you may plan the next evidence step',
          text: 'Open the portfolio planner to decide whether this is only a learning artefact or the first slice of a larger case. Add a business measure only when you can define the decision, baseline, guardrail, and measurement method; do not invent one from this rehearsal.',
          action: 'Use this record in the portfolio planner'
        },
        revise: {
          title: 'REVISE means the record belongs in the next experiment, not a project claim',
          text: 'Keep the mismatch and make one narrower rerun. A visible revision can become useful evidence later; a completion claim cannot replace the missing case, boundary, or decision.',
          action: 'Return to the smaller rehearsal'
        },
        stop: {
          title: 'STOP means preserve the limit and do not package a result',
          text: 'Keep the stop reason locally. Do not add a key, account, real data, or external action to manufacture a portfolio outcome. Start a lower-risk case only after its owner and boundary are clear.',
          action: 'Return to the local rehearsal'
        }
      },
      boundary: 'The portfolio planner helps structure evidence; it does not convert a synthetic local exercise into a live system, credential, business result, or public project.'
    },
    routes: {
      'no-code': {
        label: 'No-code: a reviewable draft workflow',
        intro: 'Start with the supplied no-code lab below. It gives you the local materials; you do not need an AI account to practise the parts that make a draft safe to review.',
        steps: [
          'Write one fictional user, one decision a human keeps, one allowed input, one draft output, and one non-goal.',
          'Add two synthetic rows: one ordinary request and one missing, unsafe, or out-of-scope request.',
          'For each row, write the expected route (DRAFT, HANDOFF, or BLOCKED), then record the reviewer decision and one reason.'
        ],
        inspectable: 'A plain input/output contract, two fixed cases, expected routes, and a visible exception path.',
        handoff: 'A named owner, a reason the final action stays human, and an honest limit on what the exercise demonstrates.',
        starterLab: {
          title: 'Do the six supplied no-code cases next',
          text: 'The starter lab gives you a synthetic supply-request sheet, manual route cards, a permission receipt, and a reviewer record. Complete those materials before marking any check on this page.',
          action: 'Open the no-code starter lab',
          href: '/en/no-code-starter-lab#no-code-lab-manual-title',
          boundary: 'It stays offline and local: no account, connected app, live data, or external action.'
        }
      },
      coder: {
        label: 'Coder: a bounded local change',
        intro: 'Start with the supplied coding lab below. It gives you six fictional materials and one small deterministic change; no model call, package, credential, or deployment is needed.',
        steps: [
          'Write a five-line change brief: user, decision, input/output, non-goal, and stop condition.',
          'Create one normal case and one missing, unknown, or conflicting case with expected deterministic routes.',
          'If you write code, run the fixed cases locally. Otherwise keep pseudocode and an expected-result table; record PASS, REVISE, or STOP with the reason.'
        ],
        inspectable: 'A narrow contract, fixed inputs and expected results, plus a test or manual result that another person can challenge.',
        handoff: 'Scope control, a rollback or handoff trigger, and a human release decision rather than an assistant-generated claim of completion.',
        starterLab: {
          title: 'Make one small code change with supplied material',
          text: 'The coding lab provides six fictional materials and asks you to make one narrow pure-function change, then record the plan, diff, and test review. Bring that record back here.',
          action: 'Open the coding starter lab',
          href: '/en/coding-starter-lab#coding-starter-lab-manual-title',
          boundary: 'It stays offline and local: no account, connected app, live data, or external action.'
        }
      }
    }
  },
  'zh-TW': {
    eyebrow: '本機路線試跑',
    title: '先用留得下來的工作，確認這條路值不值得走',
    intro: '比較到學習來源，只是一個假設。做這個不需要帳戶的小試跑，先看看這條路能不能真的留下可檢查的工作，再投入更多時間或金錢。',
    routeLabel: '這次要試哪一條路？',
    routeHelp: '依照你今天做得到的方式選。真的需要看程式改動或測試結果時，再轉去寫 Code 的路線。',
    routeHeading: '足夠小而能完成的試跑',
    stepsHeading: '只在本機做這幾樣',
    inspectableHeading: '別人可以檢查',
    handoffHeading: '這份工作也交代了',
    recordHeading: '記下實際發生了什麼',
    recordHelp: '完成練習後才填。勾選本身不是證據；請保留對應的本機筆記、表格、測試結果或覆核意見。',
    checks: {
      'local-artefact': { label: '可以重新打開的本機成果', help: '你有沒有儲存計畫、表格，或小型程式／測試檔，之後可以重新打開？' },
      'scope-boundary': { label: '已寫清楚的邊界', help: '你有沒有寫出練習資料或公開安全資料、這次不做什麼，以及最後仍由哪一個人做決定？' },
      'negative-case': { label: '試過一個不會照常處理的情境', help: '是否有一個資料缺失、不安全、矛盾或超出範圍的情境，清楚交給人、拒絕處理或測試不通過？' },
      'review-record': { label: '留下決定記錄', help: '你有沒有寫繼續、修改或停止與原因，而不是把完成當成結果？' }
    },
    options: [
      { value: 'not-started', label: '尚未做／沒有本機記錄' },
      { value: 'observed', label: '已觀察並保留在本機' },
      { value: 'revise', label: '看見不吻合，需要改做法或成果' },
      { value: 'stop', label: '停止：不安全、不清楚，或要換另一條路' }
    ],
    outcomeHeading: '路線證據結果',
    outcomeLabel: '目前的本機決定',
    outcomes: {
      ready: {
        label: '這個小試跑可以繼續',
        text: '你現在有一份有範圍的本機記錄，寫清楚邊界、至少一個不會照常處理的情境，以及一個決定。可以做下一個單元或小改動，之後再用同一套檢查。這不是技能證書、平台背書，也不證明你已準備好某份工作。'
      },
      revise: {
        label: '投入更多前先修改',
        text: '缺少記錄或看見不吻合，本身就是有用證據。縮小範圍、寫清楚該怎樣處理，或換一個能給你可檢查第一個任務的來源。不要拿完成徽章補這個缺口。'
      },
      stop: {
        label: '停止這個版本的路線',
        text: '不要為了硬要完成就加入帳戶、存取金鑰、真實資料或外部操作。保留停止記錄，然後選風險更低的路，或請負責決定的人說清楚需要補什麼。'
      }
    },
    evidenceBoundary: '這份只是本機學習紀錄，不是證書、平台評分、正式上線成果或商業成效證明。不能放 API 存取金鑰、已連接帳戶、雇主資料、客戶資料，或任何外部操作。',
    copyRecord: '複製本機路線記錄',
    copySuccess: '已複製。在你自己決定貼到哪裡之前，內容只會留在這台裝置。',
    copyError: '這個瀏覽器無法直接複製；你仍可自行選取下方的記錄。',
    copyNote: '記錄只包含你在本頁選擇的內容，不會儲存或傳送。',
    recordRoute: '試跑路線',
    recordGap: '能力證據缺口',
    recordSource: '比較來源欄位',
    recordOutcome: '本機決定',
    recordChecks: '已觀察檢查',
    portfolioHandoff: {
      eyebrow: '還沒叫它作品之前',
      title: '帶著記錄往前走，不要帶著「成功」宣稱往前走',
      intro: '這次小試跑最多證明你保留了一個有範圍的決策、幾個情境與覆核結果。它不證明商業成效、模型品質、可正式上線，也不代表你有工作經驗。只有能說清楚觀察到什麼時，才把記錄帶到下一步。',
      carryHeading: '這四樣要一起留下',
      carryItems: {
        'no-code': [
          '虛構情境要作的決策，以及最後仍由哪一位人員拍板。',
          '允許使用的合成輸入，以及這次明確禁止的外部操作。',
          '六個預期與實際處理方式，包括至少一個交給人或拒絕處理的情境。',
          '覆核記錄，以及為何選擇繼續、修改或停止。'
        ],
        coder: [
          '小型改動說明、這次不做什麼，以及哪一位人員決定能否放行。',
          '允許變更的來源檔範圍，以及固定輸入情境。',
          '手動基準，加上實際測試或覆核結果，包括一個失敗情境。',
          '覆核／退回記錄，以及為何選擇繼續、修改或停止。'
        ]
      },
      outcome: {
        ready: {
          title: '繼續，表示可以規劃下一格證據',
          text: '開啟作品規劃器，先判斷這份是學習記錄，還是一個更大案例的第一格。只有能定義決策、基準、保護界線與量度方法時，才加入商業量度；不要從這次試跑硬湊一個。',
          action: '用這份記錄開始規劃作品證據'
        },
        revise: {
          title: '修改，表示記錄應該帶到下一次試跑，不是變成作品宣稱',
          text: '保留不吻合的地方，做一次更小範圍的重試。日後看得見的修改可以是有用證據；但「已完成」補不回缺少的情境、邊界或決策。',
          action: '回到小試跑，做一個更小的改動'
        },
        stop: {
          title: '停止，表示保留限制，不要包裝成成果',
          text: '把停止原因留在本機。不要為了湊出作品結果，就加入 key、帳戶、真實資料或外部操作。等負責人與邊界都清楚後，再開始一個風險更低的情境。',
          action: '回到本機小試跑，選風險更低的版本'
        }
      },
      boundary: '作品規劃器只幫你整理證據；它不會把合成本機練習變成正式系統、證書、商業成果或公開作品。'
    },
    routes: {
      'no-code': {
        label: '不寫 Code：交給人覆核的草稿流程',
        intro: '先開下面的不寫 Code 練習。它提供本機材料；即使沒有 AI 帳戶，也能先練習把草稿交給人覆核。',
        steps: [
          '寫一個虛構使用者、一個仍由人手決定的問題、一種允許輸入、一份草稿輸出，以及一件這次不做的事。',
          '加兩則練習記錄：一則正常請求，與一則資料缺失、不安全或超出範圍的請求。',
          '每則先寫預期如何處理：出草稿、交給人或拒絕處理；再記下覆核者的決定與一個原因。'
        ],
        inspectable: '一份簡單的輸入／輸出說明、兩個固定情境、預期處理方式，以及看得見的例外路徑。',
        handoff: '一位有名字的負責人、最後操作為何留給人手，還有這個練習實際證明什麼與無法證明什麼。',
        starterLab: {
          title: '下一步：用提供的六個情境試一次',
          text: '練習提供合成的供應請求表、手動處理卡、權限核對記錄與覆核記錄。完成這些材料後，才回來勾選上面的檢查。',
          action: '開始不寫 Code 練習',
          href: '/zh-TW/no-code-starter-lab#no-code-lab-manual-title',
          boundary: '全程只在本機做：不需要帳戶、不連接其他應用程式、不用真實資料，也不會做外部操作。'
        }
      },
      coder: {
        label: '有寫 Code：有範圍的本機改動',
        intro: '先開下面的寫 Code 練習。它提供六份虛構材料與一個小型、輸入相同結果相同的改動；不需要呼叫模型、安裝套件、存取憑證或部署。',
        steps: [
          '寫五行改動說明：使用者、要作的決定、輸入與輸出、這次不做什麼、何時停止。',
          '做一個正常情境，再做一個資料缺失、不確定或互相矛盾的情境；為兩個寫好預期處理方式。',
          '如果你會寫程式，就在本機跑固定情境；否則保留偽碼與預期結果表，並寫繼續、修改或停止與原因。'
        ],
        inspectable: '一份範圍窄的說明、固定輸入與預期結果，以及另一個人可以質疑的測試或手動結果。',
        handoff: '控制範圍、何時退回上一版或交給人，以及由人手決定能否放行，不是由助手說完成就算。',
        starterLab: {
          title: '下一步：用現成材料做一個小改動',
          text: '寫 Code 練習提供六份虛構材料；你只要做一個範圍窄的純函式改動，再留下改動說明、修改差異與測試覆核，然後把記錄帶回這裡。',
          action: '開始寫 Code 練習',
          href: '/zh-TW/coding-starter-lab#coding-starter-lab-manual-title',
          boundary: '全程只在本機做：不需要帳戶、不連接其他應用程式、不用真實資料，也不會做外部操作。'
        }
      }
    }
  },
  'zh-Hans': {
    eyebrow: '本机路线试跑',
    title: '先用留得下来的工作，确认这条路值不值得走',
    intro: '比较到学习来源，只是一个假设。做这个不需要账户的小试跑，先看看这条路能不能真的留下可检查的工作，再投入更多时间或金钱。',
    routeLabel: '这次要试哪一条路？',
    routeHelp: '按照你今天做得到的方式选。真的需要看程序改动或测试结果时，再转去写 Code 的路线。',
    routeHeading: '足够小而能完成的试跑',
    stepsHeading: '只在本机做这几样',
    inspectableHeading: '别人可以检查',
    handoffHeading: '这份工作也交代了',
    recordHeading: '记下实际发生了什么',
    recordHelp: '完成练习后才填。勾选本身不是证据；请保留对应的本机笔记、表格、测试结果或评审意见。',
    checks: {
      'local-artefact': { label: '可以重新打开的本机成果', help: '你有没有保存计划、表格，或小型程序／测试文件，之后可以重新打开？' },
      'scope-boundary': { label: '已写清楚的边界', help: '你有没有写出练习资料或公开安全资料、这次不做什么，以及最后仍由哪一个人做决定？' },
      'negative-case': { label: '试过一个不会照常处理的情境', help: '是否有一个数据缺失、不安全、矛盾或超出范围的情境，清楚交给人、拒绝处理或测试不通过？' },
      'review-record': { label: '留下决定记录', help: '你有没有写继续、修改或停止与原因，而不是把完成当成结果？' }
    },
    options: [
      { value: 'not-started', label: '尚未做／没有本机记录' },
      { value: 'observed', label: '已观察并保留在本机' },
      { value: 'revise', label: '看见不吻合，需要改做法或成果' },
      { value: 'stop', label: '停止：不安全、不清楚，或要换另一条路' }
    ],
    outcomeHeading: '路线证据结果',
    outcomeLabel: '当前的本机决定',
    outcomes: {
      ready: {
        label: '这个小试跑可以继续',
        text: '你现在有一份有范围的本机记录，写清楚边界、至少一个不会照常处理的情境，以及一个决定。可以做下一个单元或小改动，之后再用同一套检查。这不是技能证书、平台背书，也不证明你已准备好某份工作。'
      },
      revise: {
        label: '投入更多前先修改',
        text: '缺少记录或看见不吻合，本身就是有用证据。缩小范围、写清楚该怎样处理，或换一个能给你可检查第一个任务的来源。不要拿完成徽章补这个缺口。'
      },
      stop: {
        label: '停止这个版本的路线',
        text: '不要为了硬要完成就加入账户、存取密钥、真实数据或外部操作。保留停止记录，然后选风险更低的路，或请负责决定的人说清楚需要补什么。'
      }
    },
    evidenceBoundary: '这份只是本机学习记录，不是证书、平台评分、正式上线成果或商业成效证明。不能放 API 存取密钥、已连接账户、雇主数据、客户数据，或任何外部操作。',
    copyRecord: '复制本机路线记录',
    copySuccess: '已复制。在你自己决定粘贴到哪里之前，内容只会留在这台设备。',
    copyError: '这个浏览器无法直接复制；你仍可自行选择下方的记录。',
    copyNote: '记录只包含你在本页选择的内容，不会储存或发送。',
    recordRoute: '试跑路线',
    recordGap: '能力证据缺口',
    recordSource: '比较来源栏位',
    recordOutcome: '本机决定',
    recordChecks: '已观察检查',
    portfolioHandoff: {
      eyebrow: '还没叫它作品之前',
      title: '带着记录往前走，不要带着“成功”宣称往前走',
      intro: '这次小试跑最多证明你保留了一个有范围的决策、几个情境与评审结果。它不证明商业成效、模型质量、可正式上线，也不代表你有工作经验。只有能说清楚观察到什么时，才把记录带到下一步。',
      carryHeading: '这四样要一起留下',
      carryItems: {
        'no-code': [
          '虚构情境要作的决策，以及最后仍由哪一位人员拍板。',
          '允许使用的合成输入，以及这次明确禁止的外部操作。',
          '六个预期与实际处理方式，包括至少一个交给人或拒绝处理的情境。',
          '评审记录，以及为何选择继续、修改或停止。'
        ],
        coder: [
          '小型改动说明、这次不做什么，以及哪一位人员决定能否放行。',
          '允许变更的来源文件范围，以及固定输入情境。',
          '手动基准，加上实际测试或评审结果，包括一个失败情境。',
          '评审／退回记录，以及为何选择继续、修改或停止。'
        ]
      },
      outcome: {
        ready: {
          title: '继续，表示可以规划下一格证据',
          text: '打开作品规划器，先判断这份是学习记录，还是一个更大案例的第一格。只有能定义决策、基准、保护边界与量度方法时，才加入商业量度；不要从这次试跑硬凑一个。',
          action: '用这份记录开始规划作品证据'
        },
        revise: {
          title: '修改，表示记录应该带到下一次试跑，不是变成作品宣称',
          text: '保留不吻合的地方，做一次更小范围的重试。日后看得见的修改可以是有用证据；但“已完成”补不回缺少的情境、边界或决策。',
          action: '回到小试跑，做一个更小的改动'
        },
        stop: {
          title: '停止，表示保留限制，不要包装成成果',
          text: '把停止原因留在本机。不要为了凑出作品结果，就加入 key、账户、真实数据或外部操作。等负责人和边界都清楚后，再开始一个风险更低的情境。',
          action: '回到本机小试跑，选风险更低的版本'
        }
      },
      boundary: '作品规划器只帮你整理证据；它不会把合成本机练习变成正式系统、证书、商业成果或公开作品。'
    },
    routes: {
      'no-code': {
        label: '不写 Code：交给人评审的草稿流程',
        intro: '先打开下面的不写 Code 练习。它提供本机材料；即使没有 AI 账户，也能先练习把草稿交给人评审。',
        steps: [
          '写一个虚构用户、一个仍由人手决定的问题、一种允许输入、一份草稿输出，以及一件这次不做的事。',
          '加两则练习记录：一则正常请求，与一则数据缺失、不安全或超出范围的请求。',
          '每则先写预期如何处理：出草稿、交给人或拒绝处理；再记下评审者的决定与一个原因。'
        ],
        inspectable: '一份简单的输入／输出说明、两个固定情境、预期处理方式，以及看得见的例外路径。',
        handoff: '一位有名字的负责人、最后操作为什么留给人手，还有这个练习实际证明什么与无法证明什么。',
        starterLab: {
          title: '下一步：用提供的六个情境试一次',
          text: '练习提供合成的供应请求表、手动处理卡、权限核对记录与评审记录。完成这些材料后，才回来勾选上面的检查。',
          action: '开始不写 Code 练习',
          href: '/zh-Hans/no-code-starter-lab#no-code-lab-manual-title',
          boundary: '全程只在本机做：不需要账户、不连接其他应用程序、不用真实数据，也不会做外部操作。'
        }
      },
      coder: {
        label: '写 Code：有范围的本机改动',
        intro: '先打开下面的写 Code 练习。它提供六份虚构材料与一个小型、输入相同结果相同的改动；不需要调用模型、安装套件、存取凭证或部署。',
        steps: [
          '写五行改动说明：用户、要作的决定、输入与输出、这次不做什么、何时停止。',
          '做一个正常情境，再做一个数据缺失、不确定或互相矛盾的情境；为两个写好预期处理方式。',
          '如果你会写程序，就在本机跑固定情境；否则保留伪码与预期结果表，并写继续、修改或停止与原因。'
        ],
        inspectable: '一份范围窄的说明、固定输入与预期结果，以及另一个人可以质疑的测试或手动结果。',
        handoff: '控制范围、何时退回上一版或交给人，以及由人手决定能否放行，不是由助手说完成就算。',
        starterLab: {
          title: '下一步：用现成材料做一个小改动',
          text: '写 Code 练习提供六份虚构材料；你只要做一个范围窄的纯函数改动，再留下改动说明、修改差异与测试评审，然后把记录带回这里。',
          action: '开始写 Code 练习',
          href: '/zh-Hans/coding-starter-lab#coding-starter-lab-manual-title',
          boundary: '全程只在本机做：不需要账户、不连接其他应用程序、不用真实数据，也不会做外部操作。'
        }
      }
    }
  }
});
